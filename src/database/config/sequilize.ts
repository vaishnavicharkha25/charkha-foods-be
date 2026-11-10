import { Sequelize } from 'sequelize-typescript';
import database from './database';
import { applicationModeConstants } from '../../constants/applicationModeConstants';
import { models } from '../models';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : applicationModeConstants.DEVELOPMENT;
const dbPort = process?.env?.DATABASE_PORT ? +process.env.DATABASE_PORT : 3306;

const sequelize = new Sequelize({
  ...database[env as keyof typeof database],
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  models,
  pool: {
    max: 50,
    min: 5,
    acquire: 30000,
    idle: 30000,
  },
});

export default sequelize;