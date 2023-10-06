import express, { Application } from "express";
import config from "./config/config";
import router from "./routes";
import { port } from './config/config';
import connectDB from "./config/db/connectDB";
import configureCloudinary from "./config/configureCloudinary";

const app: Application = express();
config(app, express);

connectDB();

configureCloudinary();

app.use("/api/v1", router);


app.listen(port, () => console.log(`Server running on port ${port}`));
