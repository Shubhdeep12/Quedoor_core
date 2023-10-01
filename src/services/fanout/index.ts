import express, { Application } from "express";
import config, { port } from "./config/config";
import router from "./routes";
import connectDB from "./config/db/connectDB";

const app: Application = express();
config(app, express);

connectDB();

app.use("/", router);

app.listen(port || 3001, () => console.log(`Server running on port ${port}`));
