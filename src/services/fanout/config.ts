import * as dotenv from 'dotenv';
import { Application } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
export const port = Number(process.env.API_PORT);
// export const db_host = String(process.env.DB_HOST);
// export const db_port = Number(process.env.DB_PORT);
// export const db_name = String(process.env.DB_NAME);
// export const db_user = String(process.env.DB_USER);
// export const db_password = String(process.env.DB_PASSWORD);
// export const client_url = String(process.env.CLIENT_URL);
// export const jwt_key = String(process.env.JWT_KEY);

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