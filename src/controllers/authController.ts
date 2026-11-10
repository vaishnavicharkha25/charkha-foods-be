import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, CustomerProfile, StaffProfile, Role, Permission } from '../database/models';

const JWT_SECRET = process.env.JWT_SECRET || 'charkha-foods-secret';

export class AuthController {
  /**
   * Register a new customer account
   */
  public static async register(req: Request, res: Response) {
    try {
      const { phone, fullName, email, password } = req.body;

      if (!phone || !fullName) {
        return res.status(400).json({ success: false, message: 'Phone number and Full Name are required.' });
      }

      const cleanPhone = String(phone).trim();
      const existingUser = await User.findOne({ where: { phone: cleanPhone } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User with this phone number already exists.' });
      }

      const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

      const user = await User.create({
        phone: cleanPhone,
        fullName,
        email,
        passwordHash,
        userType: 'customer',
        isActive: true,
      });

      await CustomerProfile.create({
        userId: user.id,
        loyaltyPoints: 50, // Welcome bonus
        totalOrders: 0,
        totalSpend: 0.00,
        segment: 'New',
      });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          token,
          user: {
            id: user.id,
            phone: user.phone,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Login (Customer or Staff)
   */
  public static async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
      }

      const cleanPhone = String(phone).trim();
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

      const user = await User.findOne({
        where: {
          [Op.or]: [
            { phone: cleanPhone },
            ...(last10 ? [{ phone: { [Op.like]: `%${last10}%` } }] : []),
          ],
        },
        include: [
          {
            model: StaffProfile,
            as: 'staffProfile',
            include: [
              {
                model: Role,
                as: 'roleDetail',
                include: [{ model: Permission, as: 'permissions' }],
              },
            ],
          },
        ],
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: 'Invalid phone number or account inactive.' });
      }

      if (user.passwordHash && password) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid password.' });
        }
      }

      const staffProfile = user.staffProfile;
      const roleDetail = staffProfile?.roleDetail;
      const permissionCodes = roleDetail?.permissions?.map((p: Permission) => p.code) || [];

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            phone: user.phone,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            role: roleDetail?.name || staffProfile?.role,
            permissions: permissionCodes,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get current authenticated user profile
   */
  public static async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated.' });
      }

      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [
          { model: CustomerProfile, as: 'customerProfile' },
          {
            model: StaffProfile,
            as: 'staffProfile',
            include: [{ model: Role, as: 'roleDetail', include: [{ model: Permission, as: 'permissions' }] }],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
