import express, { Application } from "express";
import config from "./config/config";
import router from "./routes";
import { port } from './config/config';
import postgresConnection from "./config/db/sequelize";

const app: Application = express();
config(app, express);

(async () => {
  
  // Establish Sequelize, MongoDB, Neo4j, and Redis connections
  await postgresConnection.authenticate();
  // await connectToMongoDB();
  // const neo4jDriver = createNeo4jDriver();
  // const redisClient = createRedisClient();

})();

app.use("/api", router);

app.listen(port, () => console.log(`Server running on port ${port}`));
