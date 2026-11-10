import { Request, Response } from 'express';
import { Coupon, OfferBanner } from '../database/models';

export class OfferController {
  /**
   * Get list of coupons
   */
  public static async getCoupons(req: Request, res: Response) {
    try {
      const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json({ success: true, data: coupons });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Validate a coupon for checkout
   */
  public static async validateCoupon(req: Request, res: Response) {
    try {
      const { code, subtotal } = req.body;
      if (!code || subtotal === undefined) {
        return res.status(400).json({ success: false, message: 'Coupon code and subtotal are required.' });
      }

      const coupon = await Coupon.findByPk(code.toUpperCase());
      if (!coupon || !coupon.isActive) {
        return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code.' });
      }

      if (subtotal < Number(coupon.minOrderAmount)) {
        return res.status(400).json({
          success: false,
          message: `Coupon requires a minimum order amount of ₹${coupon.minOrderAmount}`,
        });
      }

      let discount = 0;
      if (coupon.discountType === 'percent') {
        discount = (subtotal * Number(coupon.value)) / 100;
      } else {
        discount = Number(coupon.value);
      }

      return res.status(200).json({
        success: true,
        message: 'Coupon code applied successfully',
        data: {
          code: coupon.code,
          label: coupon.label,
          discountType: coupon.discountType,
          value: coupon.value,
          discountAmount: Math.min(discount, subtotal),
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Create a new coupon (Protected: offers:manage)
   */
  public static async createCoupon(req: Request, res: Response) {
    try {
      const { code, label, discountType, value, minOrderAmount } = req.body;

      if (!code || !label || !discountType || value === undefined) {
        return res.status(400).json({ success: false, message: 'Coupon code, label, discountType, and value are required.' });
      }

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        label,
        discountType,
        value,
        minOrderAmount: minOrderAmount || 0,
        isActive: true,
      });

      return res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get offer banners
   */
  public static async getOfferBanners(req: Request, res: Response) {
    try {
      const banners = await OfferBanner.findAll({
        where: { isActive: true },
        order: [['displayOrder', 'ASC']],
      });
      return res.status(200).json({ success: true, data: banners });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
