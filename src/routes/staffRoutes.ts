import { Router } from 'express';
import { StaffController } from '../controllers/staffController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Protected RBAC staff routes
router.get('/staff', authenticateJWT, authorizePermission('staff:manage'), StaffController.getStaff);
router.post('/staff', authenticateJWT, authorizePermission('staff:manage'), StaffController.createStaff);
router.patch('/staff/:id', authenticateJWT, authorizePermission('staff:manage'), StaffController.updateStaff);

export default router;
