import connectToMongoDB from "./mongoose";
import { createNeo4jConnection } from "./neo4j";
import postgresConnection from "./sequelize";

const connectDB = async () => {
 // Establish Sequelize, MongoDB, Neo4j, and Redis connections
  await postgresConnection.authenticate();
  await connectToMongoDB();
  await createNeo4jConnection()
  
 // const neo4jDriver = createNeo4jDriver();
 // const redisClient = createRedisClient(); 
}

export default connectDB;