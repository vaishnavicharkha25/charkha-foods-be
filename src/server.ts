import sequelize from './database/config/sequilize';  // Make sure your sequelize instance is configured correctly
import app from './app';  // Import the express app
import http from 'http';  // HTTP server
import logger from './utils/winstonLogger';
import moment from 'moment-timezone';  // Moment for timezone

const NAMESPACE = '[SERVER CONNECTION]:';
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);  // Creating an HTTP server using the express app

moment.tz.setDefault('Asia/Calcutta');  // Set the default timezone

if (require.main === module) {
    (async () => {
        try {
            // Authenticate with the database before starting the server
            await sequelize.authenticate();  // Make sure sequelize is properly set up in ./database/config/sequelize.ts
            logger.info(`${NAMESPACE} Database connected successfully`);

            // Start the server after the database authentication
            server.listen(PORT, () => {
                logger.info(`${NAMESPACE} Server started on port ${PORT}`);
            });
        } catch (error: unknown) {
            logger.error(
                `${NAMESPACE} Unable to start the server: ${
                    error instanceof Error ? error.message : error
                }`
            );
        }
    })();
}

export default server;
