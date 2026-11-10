import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Get all roles
router.get('/roles', authenticateJWT, authorizePermission('staff:manage'), RoleController.getRoles);

// Get all system permissions
router.get('/permissions', authenticateJWT, authorizePermission('staff:manage'), RoleController.getPermissions);

// Create new custom role
router.post('/roles', authenticateJWT, authorizePermission('staff:manage'), RoleController.createRole);

// Update permissions for a role
router.put('/roles/:id/permissions', authenticateJWT, authorizePermission('staff:manage'), RoleController.updateRolePermissions);

export default router;
