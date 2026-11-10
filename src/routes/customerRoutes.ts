import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Protected RBAC customer routes
router.get('/customers', authenticateJWT, authorizePermission('customers:read'), CustomerController.getCustomers);
router.get('/customers/:id', authenticateJWT, authorizePermission('customers:read'), CustomerController.getCustomerById);
router.get('/loyalty/transactions', authenticateJWT, authorizePermission('loyalty:manage'), CustomerController.getLoyaltyTransactions);

export default router;
