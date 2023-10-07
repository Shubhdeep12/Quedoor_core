import connectPostCache from "../cache/postCache";
import connectUserCache from "../cache/userCache";
import connectToMongoDB from "./mongoose";
import { createNeo4jConnection } from "./neo4j";
import postgresConnection from "./sequelize";

const connectDB = async () => {
  
  await postgresConnection.authenticate();
  await connectToMongoDB();
  await createNeo4jConnection();
  await connectUserCache();
  await connectPostCache();
  // await connectNewsFeedCache();

};

export default connectDB;