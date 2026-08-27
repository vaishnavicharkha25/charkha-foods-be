import { Sequelize } from 'sequelize';
import database from './database';
import { applicationModeConstants } from '../../constants/applicationModeConstants';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : applicationModeConstants.DEVELOPMENT;
const dbPort = process?.env?.DATABASE_PORT ? +process.env.DATABASE_PORT : 3306;

export default new Sequelize({
    ...database[env as keyof typeof database],
    port: dbPort,
    dialect: 'mysql',
    logging: false,

    pool: {
        max: 50,
        min: 5,
        acquire: 30000,
        idle: 30000
    }
});