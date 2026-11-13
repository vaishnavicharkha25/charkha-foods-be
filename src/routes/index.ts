import { Request, Response, Router } from 'express';
import logger from '../utils/winstonLogger';
import HttpErrorMessage from '../constants/httpErrorMessage';

import authRoutes from './authRoutes';
import menuRoutes from './menuRoutes';
import orderRoutes from './orderRoutes';
import offerRoutes from './offerRoutes';
import customerRoutes from './customerRoutes';
import qrRoutes from './qrRoutes';
import staffRoutes from './staffRoutes';
import roleRoutes from './roleRoutes';
import settingRoutes from './settingRoutes';

const router = Router();
const NAMESPACE = '[SERVER]:';

// Log every request
router.use((req, res, next) => {
  logger.log({
    message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
    level: 'info',
  });
  res.on('finish', () => {
    logger.log({
      message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`,
      level: 'info',
    });
  });
  next();
});

/* Route to check the status of the server */
router.get('/', (req: Request, res: Response) => {
  res.send('Charkha Foods API is running!');
});

// Mount System REST API routes (app.ts already mounts router at /api/v1)
router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/offers', offerRoutes);
router.use('/', orderRoutes);
router.use('/', customerRoutes);
router.use('/', qrRoutes);
router.use('/', staffRoutes);
router.use('/', roleRoutes);
router.use('/', settingRoutes);

/* Route to handle exception URLs */
router.use((req, res) => {
  const error = new Error(HttpErrorMessage.API_ENDPOINT_NOT_FOUND);
  res.status(404).json({
    message: error.message,
  });
});

export default router;