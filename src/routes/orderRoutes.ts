import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Place a new order (Public / POS / Customer App)
router.post('/orders', OrderController.createOrder);

// Get single order details
router.get('/orders/:id', OrderController.getOrderById);

// Protected routes
router.get('/orders', authenticateJWT, OrderController.getOrders);
router.patch('/orders/:id/status', authenticateJWT, authorizePermission('orders:update'), OrderController.updateOrderStatus);

export default router;
