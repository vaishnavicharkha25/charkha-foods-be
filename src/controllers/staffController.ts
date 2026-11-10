import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, StaffProfile, Role, Permission } from '../database/models';

export class StaffController {
  /**
   * List all staff members (Protected: staff:manage)
   */
  public static async getStaff(req: Request, res: Response) {
    try {
      const staffMembers = await User.findAll({
        where: { userType: 'staff' },
        attributes: ['id', 'fullName', 'phone', 'email', 'isActive', 'createdAt'],
        include: [
          {
            model: StaffProfile,
            as: 'staffProfile',
            include: [
              {
                model: Role,
                as: 'roleDetail',
                include: [{ model: Permission, as: 'permissions', attributes: ['code'] }],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({ success: true, data: staffMembers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Register a new staff member and assign Role (Protected: staff:manage)
   */
  public static async createStaff(req: Request, res: Response) {
    try {
      const { fullName, phone, email, password, roleId, role } = req.body;

      if (!fullName || !phone || !roleId) {
        return res.status(400).json({ success: false, message: 'Full Name, Phone number, and Role ID are required.' });
      }

      const roleObj = await Role.findByPk(roleId);
      if (!roleObj) {
        return res.status(404).json({ success: false, message: 'Specified Role not found.' });
      }

      const existingUser = await User.findOne({ where: { phone } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User with this phone number already exists.' });
      }

      const passwordHash = await bcrypt.hash(password || 'Password@123', 10);

      const user = await User.create({
        fullName,
        phone,
        email,
        passwordHash,
        userType: 'staff',
        isActive: true,
      });

      const staffProfile = await StaffProfile.create({
        userId: user.id,
        roleId: roleObj.id,
        role: (role || roleObj.name) as any,
        shiftStatus: 'on_duty',
      });

      const createdStaff = await User.findByPk(user.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [
          {
            model: StaffProfile,
            as: 'staffProfile',
            include: [{ model: Role, as: 'roleDetail' }],
          },
        ],
      });

      return res.status(201).json({ success: true, message: 'Staff member created successfully', data: createdStaff });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update staff role or status (Protected: staff:manage)
   */
  public static async updateStaff(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { roleId, isActive, shiftStatus } = req.body;

      const user = await User.findByPk(id, {
        include: [{ model: StaffProfile, as: 'staffProfile' }],
      });

      if (!user || user.userType !== 'staff') {
        return res.status(404).json({ success: false, message: 'Staff member not found.' });
      }

      if (isActive !== undefined) {
        user.isActive = isActive;
        await user.save();
      }

      if (user.staffProfile) {
        if (roleId) {
          const roleObj = await Role.findByPk(roleId);
          if (roleObj) {
            user.staffProfile.roleId = roleObj.id;
            user.staffProfile.role = roleObj.name as any;
          }
        }
        if (shiftStatus) {
          user.staffProfile.shiftStatus = shiftStatus;
        }
        await user.staffProfile.save();
      }

      const updatedStaff = await User.findByPk(user.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [
          {
            model: StaffProfile,
            as: 'staffProfile',
            include: [{ model: Role, as: 'roleDetail' }],
          },
        ],
      });

      return res.status(200).json({ success: true, message: 'Staff profile updated', data: updatedStaff });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
