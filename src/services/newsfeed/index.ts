import express, { Application } from "express";
import config, { port } from "./config/config";
import connectDB from "./config/db/connectDB";

const app: Application = express();
config(app, express);

connectDB();

// app.use("/api", router);

app.listen(port || 3002, () => console.log(`Server running on port ${port}`));
