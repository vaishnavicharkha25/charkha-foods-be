import { Request, Response } from 'express';
import { Router } from 'express';
import logger from '../utils/winstonLogger';
import HttpErrorMessage from '../constants/httpErrorMessage';

const router = Router();

const NAMESPACE = '[SERVER]:';

// log every request
router.use((req, res, next) => {
    logger.log({
        message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
        level: 'info'
    });
    res.on('finish', () => {
        logger.log({
            message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`,
            level: 'info'
        });
    });
    next();
});

/* route to check the status of the server */
router.get('/', (req: Request, res: Response) => {
    res.send('SSM API is running!');
});

/* route to handle exception urls */
router.use((req, res) => {
    const error = new Error(HttpErrorMessage.API_ENDPOINT_NOT_FOUND);
    res.status(404).json({
        message: error.message
    });
});

export default router;