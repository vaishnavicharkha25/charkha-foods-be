import { Request, Response } from 'express';
import { Order, OrderItem, OrderItemAddOn, Product, AddOn, Coupon, QrSource, CustomerProfile, LoyaltyTransaction, AppSetting } from '../database/models';
import { Op } from 'sequelize';

export class OrderController {
  /**
   * Place a new order (Public / Customer / POS)
   */
  public static async createOrder(req: Request, res: Response) {
    try {
      const {
        customerName,
        customerPhone,
        fulfillmentMode,
        deliveryAddress,
        qrSourceId,
        couponCode,
        paymentMethod,
        items,
        status,
        applyGst,
      } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid order details or empty cart items.' });
      }

      const finalCustomerName = (customerName && String(customerName).trim()) ? String(customerName).trim() : 'Walk-in Customer';
      const finalCustomerPhone = (customerPhone && String(customerPhone).trim()) ? String(customerPhone).trim() : 'Counter';
      const finalFulfillmentMode = fulfillmentMode || 'pickup';
      const finalPaymentMethod = paymentMethod || 'Cash';
      const finalStatus = status || 'new';

      let subtotal = 0;
      const preparedItems: any[] = [];

      // 1. Process items & add-ons pricing
      for (const item of items) {
        let product: any = null;
        if (item.productId) {
          product = await Product.findByPk(item.productId);
        }

        let itemPrice = 0;
        let productName = item.productName || (product ? product.name : 'Item');
        let prodId: string | null = null;

        if (product) {
          itemPrice = Number(product.price);
          productName = product.name;
          prodId = product.id;
        } else if (item.unitPrice !== undefined || item.price !== undefined) {
          itemPrice = Number(item.unitPrice ?? item.price);
          prodId = null;
        } else {
          return res.status(404).json({ success: false, message: `Product ${item.productId || 'unknown'} not found.` });
        }

        let addOnsSubtotal = 0;
        const preparedAddOns: any[] = [];

        if (Array.isArray(item.addOnIds) && item.addOnIds.length > 0) {
          for (const aId of item.addOnIds) {
            const addOn = await AddOn.findByPk(aId);
            if (addOn) {
              const aPrice = Number(addOn.price);
              addOnsSubtotal += aPrice;
              preparedAddOns.push({
                addOnId: addOn.id,
                addOnName: addOn.name,
                price: aPrice,
              });
            }
          }
        }

        const linePrice = itemPrice + addOnsSubtotal;
        const quantity = Number(item.quantity || item.qty || 1);
        const itemSubtotal = linePrice * quantity;
        subtotal += itemSubtotal;

        preparedItems.push({
          productId: prodId,
          productName,
          quantity,
          unitPrice: linePrice,
          itemSubtotal,
          addOns: preparedAddOns,
        });
      }

      // 2. Process coupon discount (Simple billing: No GST, No extra service charges, sum of items)
      let discount = 0;
      if (couponCode) {
        const coupon = await Coupon.findByPk(couponCode);
        if (coupon && coupon.isActive && subtotal >= Number(coupon.minOrderAmount)) {
          if (coupon.discountType === 'percent') {
            discount = (subtotal * Number(coupon.value)) / 100;
          } else {
            discount = Number(coupon.value);
          }
        }
      }
      // 2. Process coupon discount & GST (Reads flag directly from DB app_settings table or request)
      let isGstEnabled: boolean;
      if (applyGst !== undefined && applyGst !== null) {
        isGstEnabled = applyGst !== false && applyGst !== 'false' && applyGst !== 0 && applyGst !== '0';
      } else {
        isGstEnabled = await AppSetting.isGstEnabled();
      }
      const rateStr = await AppSetting.getSetting('gst_rate', '5');
      const gstPercentage = Number(rateStr) || 5;
      const gstRate = isGstEnabled ? (gstPercentage / 100) : 0;

      const taxableAmount = Math.max(0, subtotal - discount);
      const gstAmount = isGstEnabled ? Math.round(taxableAmount * gstRate * 100) / 100 : 0;
      const total = Math.round((taxableAmount + gstAmount) * 100) / 100;

      // 3. Generate unique order code (e.g. CHK-1042)
      const orderCount = await Order.count();
      const orderCode = `CHK-${1042 + orderCount}`;

      // 4. Calculate earned loyalty points (10 points per ₹100 spent)
      const pointsEarned = Math.floor(total / 10);

      // 5. Create Order record
      const order = await Order.create({
        orderCode,
        customerId: req.user?.id || null,
        customerName: finalCustomerName,
        customerPhone: finalCustomerPhone,
        fulfillmentMode: finalFulfillmentMode,
        status: finalStatus,
        deliveryAddress: deliveryAddress || null,
        qrSourceId: qrSourceId || null,
        couponCode: couponCode || null,
        subtotal,
        discount,
        total,
        paymentMethod: finalPaymentMethod,
        paymentStatus: 'paid',
        pointsEarned,
        pointsRedeemed: 0,
        placedAt: new Date(),
      });

      // 6. Create Order Items & Item Add-Ons
      for (const pItem of preparedItems) {
        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: pItem.productId,
          productName: pItem.productName,
          quantity: pItem.quantity,
          unitPrice: pItem.unitPrice,
          itemSubtotal: pItem.itemSubtotal,
        });

        for (const pAddOn of pItem.addOns) {
          await OrderItemAddOn.create({
            orderItemId: orderItem.id,
            addOnId: pAddOn.addOnId,
            addOnName: pAddOn.addOnName,
            price: pAddOn.price,
          });
        }
      }

      // 7. Increment QR Source converted orders counter
      if (qrSourceId) {
        const qr = await QrSource.findByPk(qrSourceId);
        if (qr) {
          await qr.increment('ordersCount');
        }
      }

      // 8. Update Customer Profile loyalty & total spend if authenticated user
      if (req.user?.id) {
        const [profile] = await CustomerProfile.findOrCreate({
          where: { userId: req.user.id },
          defaults: { userId: req.user.id, loyaltyPoints: 0, totalOrders: 0, totalSpend: 0 },
        });

        const newTotalSpend = Number(profile.totalSpend) + total;
        const newTotalOrders = profile.totalOrders + 1;
        const newPoints = profile.loyaltyPoints + pointsEarned;

        let segment: 'New' | 'Regular' | 'VIP' = 'New';
        if (newTotalOrders >= 20) segment = 'VIP';
        else if (newTotalOrders >= 5) segment = 'Regular';

        await profile.update({
          loyaltyPoints: newPoints,
          totalOrders: newTotalOrders,
          totalSpend: newTotalSpend,
          segment,
          lastOrderAt: new Date(),
        });

        await LoyaltyTransaction.create({
          userId: req.user.id,
          orderId: order.id,
          type: 'earned',
          points: pointsEarned,
          description: `Earned on order ${orderCode}`,
        });
      }

      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: OrderItemAddOn, as: 'addOns' }],
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: createdOrder,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get list of orders (Protected: orders:read)
   */
  public static async getOrders(req: Request, res: Response) {
    try {
      const { status, mode, search } = req.query;

      const whereClause: any = {};

      if (req.user?.userType === 'customer') {
        const cleanPhone = req.user.phone ? String(req.user.phone).trim() : '';
        const digitsOnly = cleanPhone.replace(/\D/g, '');
        const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

        whereClause[Op.or] = [
          { customerId: req.user.id },
          { customerPhone: cleanPhone },
          ...(last10 ? [{ customerPhone: { [Op.like]: `%${last10}%` } }] : []),
        ];
      } else {
        const isOwner = req.user?.roleName === 'Owner';
        const hasOrdersRead = req.user?.permissions?.includes('orders:read');
        if (!isOwner && !hasOrdersRead) {
          return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
        }
      }

      if (status) {
        whereClause.status = status;
      }
      if (mode) {
        whereClause.fulfillmentMode = mode;
      }
      if (search) {
        whereClause[Op.or] = [
          { orderCode: { [Op.like]: `%${search}%` } },
          { customerName: { [Op.like]: `%${search}%` } },
          { customerPhone: { [Op.like]: `%${search}%` } },
        ];
      }

      const orders = await Order.findAll({
        where: whereClause,
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: OrderItemAddOn, as: 'addOns' }],
          },
          { model: QrSource, as: 'qrSource' },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get single order by ID
   */
  public static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: OrderItemAddOn, as: 'addOns' }],
          },
          { model: QrSource, as: 'qrSource' },
        ],
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      return res.status(200).json({ success: true, data: order });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update order status (Protected: orders:update)
   */
  public static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['new', 'preparing', 'ready', 'completed', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of ${validStatuses.join(', ')}` });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      order.status = status;
      await order.save();

      return res.status(200).json({ success: true, message: `Order status updated to ${status}`, data: order });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
