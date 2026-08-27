import dotenv from 'dotenv';

import { applicationModeConstants } from '../../constants/applicationModeConstants';

/* based on the node environment set using cross-env, we will pick the environment variable. */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : applicationModeConstants.DEVELOPMENT;
dotenv.config({ path: `.env.${env}` });

export = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT
    },
    test: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT
    },
    production: {
        username: 'root',
        password: 'null',
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql'
    }
};