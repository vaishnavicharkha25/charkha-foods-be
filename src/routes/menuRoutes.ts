import { Router } from 'express';
import { MenuController } from '../controllers/menuController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/categories', MenuController.getCategories);
router.get('/products', MenuController.getProducts);
router.get('/products/:id', MenuController.getProductById);

// Protected RBAC routes
router.post('/products', authenticateJWT, authorizePermission('menu:manage'), MenuController.createProduct);
router.put('/products/:id', authenticateJWT, authorizePermission('menu:manage'), MenuController.updateProduct);
router.patch('/products/:id/availability', authenticateJWT, authorizePermission('orders:update'), MenuController.toggleAvailability);
router.delete('/products/:id', authenticateJWT, authorizePermission('menu:manage'), MenuController.deleteProduct);

export default router;
