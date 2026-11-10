
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

        server.listen(PORT, HOST, () => {
            logger.info(
                `${NAMESPACE} Server started on http://${HOST}:${PORT}`
            );
        });
    } catch (error: unknown) {
        logger.error(
            `${NAMESPACE} Unable to start the server: ${error instanceof Error ? error.message : error
            }`
        );
        process.exit(1);
    }
})();

export default server;
