import express, { Application } from "express";
import config from "./config/config";
import router from "./routes";
import { port } from './config/config';
import connectDB from "./config/db/connectDB";

const app: Application = express();
config(app, express);

connectDB();

app.use("/api/v1", router);

app.listen(port, () => console.log(`Server running on port ${port}`));
