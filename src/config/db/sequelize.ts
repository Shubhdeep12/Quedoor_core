import { Sequelize } from 'sequelize';

import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } from '../config';

const postgresConnection= new Sequelize({
  dialect: "postgres",
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

export default postgresConnection;