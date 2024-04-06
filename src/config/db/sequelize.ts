import { Sequelize } from 'sequelize-typescript';

import { selfSignedCertificate, node_env, postgres_db, postgres_host, postgres_password, postgres_port, postgres_user } from '../config';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Relationship } from '../../models/relationship';
import { Comment } from '../../models/comment';

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
      ca: selfSignedCertificate
    },
  }} : {})
});

postgresConnection.addModels([User, Relationship, Post, Comment]);

export default postgresConnection;