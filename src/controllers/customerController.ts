import { Request, Response } from 'express';
import { User, CustomerProfile, Order, LoyaltyTransaction } from '../database/models';
import { Op } from 'sequelize';

export class CustomerController {
  /**
   * List customer records with metrics (Protected: customers:read)
   */
  public static async getCustomers(req: Request, res: Response) {
    try {
      const { search, segment } = req.query;

      const profileWhere: any = {};
      if (segment) {
        profileWhere.segment = segment;
      }

      const userWhere: any = { userType: 'customer' };
      if (search) {
        userWhere[Op.or] = [
          { fullName: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];
      }

      const customers = await User.findAll({
        where: userWhere,
        attributes: ['id', 'fullName', 'phone', 'email', 'createdAt'],
        include: [
          {
            model: CustomerProfile,
            as: 'customerProfile',
            where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({ success: true, data: customers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get single customer details with order history (Protected: customers:read)
   */
  public static async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const customer = await User.findByPk(id, {
        attributes: ['id', 'fullName', 'phone', 'email', 'createdAt'],
        include: [
          { model: CustomerProfile, as: 'customerProfile' },
          { model: Order, as: 'orders' },
          { model: LoyaltyTransaction, as: 'loyaltyTransactions' },
        ],
      });

      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found.' });
      }

      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get loyalty transaction audit log (Protected: loyalty:manage)
   */
  public static async getLoyaltyTransactions(req: Request, res: Response) {
    try {
      const transactions = await LoyaltyTransaction.findAll({
        include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'phone'] }],
        order: [['createdAt', 'DESC']],
        limit: 100,
      });

      return res.status(200).json({ success: true, data: transactions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
