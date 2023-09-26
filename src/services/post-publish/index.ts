import express, { Application } from "express";
import config, { port } from "./config";

const app: Application = express();
config(app, express);

// app.use("/api", router);

app.listen(port, () => console.log(`Server running on port ${port}`));
