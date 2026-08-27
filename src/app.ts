import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import router from './routes';  
import logger from './utils/winstonLogger';  
import { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();

const NAMESPACE = '[APPLICATION]:';

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173'
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

// Use the CORS middleware with the configured options
app.use(cors(corsOptions));

// Use body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Set security headers with Helmet, allowing cross-origin resource access
app.use(helmet({ crossOriginResourcePolicy: false }));

// Static files (uploads directory)
app.use('/api/v1/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(`${NAMESPACE} ${err.message}`);
    res.status(500).json({ message: err.message });
};

// Use router
app.use('/api/v1', router);

// Use error handler middleware
app.use(errorHandler);

export default app;
