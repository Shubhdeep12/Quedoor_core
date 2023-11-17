import { Sequelize } from 'sequelize';
// import fs from 'fs';

import { node_env, postgres_db, postgres_host, postgres_password, postgres_port, postgres_user } from '../config';

const postgresConnection= new Sequelize({
  dialect: "postgres",
  host: postgres_host,
  port: postgres_port,
  database: postgres_db,
  username: postgres_user,
  password: postgres_password,
  ...(node_env === 'production' ? {dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      // ca: fs.readFileSync('./ca.pem').toString()
    },
  }} : {})
});

export default postgresConnection;