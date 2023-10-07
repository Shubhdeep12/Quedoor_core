import * as dotenv from 'dotenv';
import { Application } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logger';

dotenv.config();

export const port = Number(process.env.API_PORT);
export const client_url = String(process.env.CLIENT_URL);

export const jwt_key = String(process.env.JWT_KEY);

export const postgres_host = String(process.env.POSTGRES_HOST);
export const postgres_port = Number(process.env.POSTGRES_PORT);
export const postgres_db = String(process.env.POSTGRES_DB);
export const postgres_user = String(process.env.POSTGRES_USER);
export const postgres_password = String(process.env.POSTGRES_PASSWORD);

export const neo4j_password = String(process.env.NEO4J_PASSWORD);
export const neo4j_user = String(process.env.NEO4J_USERNAME);
export const neo4j_uri = String(process.env.NEO4J_URI);

export const mongodb_uri = String(process.env.MONGO_DB_URI);

export const redis_uri = String(process.env.REDIS_URI);

export const cloud_name = String(process.env.CLOUDINARY_CLOUD_NAME);
export const cloud_key = String(process.env.CLOUDINARY_CLOUD_API_KEY);
export const cloud_secret = String(process.env.CLOUDINARY_CLOUD_API_SECRET);

export default (app: Application, express: any) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimit);

  app.use((req, res, next) => {
    // Log an info message for each incoming request
    logger.info(`Received a ${req.method} request for ${req.url}`);
    logger.info(JSON.stringify({ method: req.method, url: req.url, headers: req.headers, body: req.body }));

    next();
  });

};