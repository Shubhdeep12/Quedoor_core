import * as dotenv from 'dotenv';
import { Application } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongoDB from '../shared/database/config/mongoose';
import postgresConnection from '../shared/database/config/sequelize';

dotenv.config();
export const port = Number(process.env.API_PORT);
export const client_url = String(process.env.CLIENT_URL);
export const jwt_key = String(process.env.JWT_KEY);

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

  (async () => {
  
      // Establish Sequelize, MongoDB, Neo4j, and Redis connections
      const sequelize = await postgresConnection.authenticate();
      // const mongoDB = await connectToMongoDB();
      // const neo4jDriver = createNeo4jDriver();
      // const redisClient = createRedisClient();
  
  })();

  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "../client/public/upload");
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + file.originalname);
  //   },
  // });

  // const upload = multer({ storage: storage });

  // app.post("/api/upload", upload.single("file"), (req, res) => {
  //   const file = req.file;
  //   res.status(200).json(file?.filename);
  // });
};