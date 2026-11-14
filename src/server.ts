
import sequelize from './database/config/sequilize';
import app from './app';
import http from 'http';
import logger from './utils/winstonLogger';
import moment from 'moment-timezone';

const NAMESPACE = '[SERVER CONNECTION]:';
const PORT = Number(process.env.PORT) || 15637;
const HOST = '0.0.0.0';

const server = http.createServer(app);

moment.tz.setDefault('Asia/Calcutta');

(async () => {
    try {
        await sequelize.authenticate();
        logger.info(`${NAMESPACE} Database connected successfully`);

        // Ensure app_settings table exists and default flags are initialized
        const { AppSetting } = await import('./database/models');
        await AppSetting.sync();
        await AppSetting.findOrCreate({
            where: { key: 'gst_enabled' },
            defaults: {
                key: 'gst_enabled',
                value: 'true',
                description: 'Enable or disable 5% GST across orders and billing (true / false)',
            },
        });
        await AppSetting.findOrCreate({
            where: { key: 'gst_rate' },
            defaults: {
                key: 'gst_rate',
                value: '5',
                description: 'Default GST percentage rate',
            },
        });

        server.listen(PORT, HOST, () => {
            logger.info(
                `${NAMESPACE} Server started on http://${HOST}:${PORT}`
            );
        });

        // Also listen on port 3000 if PORT is different, so clients targeting port 3000 also work
        if (PORT !== 3000) {
            const fallbackServer = http.createServer(app);
            fallbackServer.on('error', (err: NodeJS.ErrnoException) => {
                if (err.code === 'EADDRINUSE') {
                    logger.warn(`${NAMESPACE} Port 3000 is already in use, skipping port 3000 listener.`);
                } else {
                    logger.error(`${NAMESPACE} Port 3000 listener error: ${err.message}`);
                }
            });
            fallbackServer.listen(3000, HOST, () => {
                logger.info(
                    `${NAMESPACE} Server also listening on http://${HOST}:3000`
                );
            });
        }
    } catch (error: unknown) {
        logger.error(
            `${NAMESPACE} Unable to start the server: ${error instanceof Error ? error.message : error
            }`
        );
        process.exit(1);
    }
})();

export default server;
