import { Router } from 'express';
import { OfferController } from '../controllers/offerController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/coupons', OfferController.getCoupons);
router.post('/coupons/validate', OfferController.validateCoupon);
router.get('/banners', OfferController.getOfferBanners);

// Protected RBAC routes
router.post('/coupons', authenticateJWT, authorizePermission('offers:manage'), OfferController.createCoupon);

export default router;
