import { Router } from 'express';
import { QrController } from '../controllers/qrController';
import { authenticateJWT, authorizePermission } from '../middlewares/authMiddleware';

const router = Router();

// Track QR scan (Public)
router.post('/qr-sources/:id/scan', QrController.recordScan);

// Protected RBAC routes
router.get('/qr-sources', authenticateJWT, authorizePermission('qr:manage'), QrController.getQrSources);
router.post('/qr-sources', authenticateJWT, authorizePermission('qr:manage'), QrController.createQrSource);

export default router;
