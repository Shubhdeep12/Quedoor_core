const neo4j = require("neo4j-driver");

import { neo4j_password, neo4j_uri, neo4j_user } from "../config";

let driver: any;

export const createNeo4jConnection = async () => {
  console.log('Connecting to neo4j');
  driver = neo4j.driver(neo4j_uri, neo4j.auth.basic(neo4j_user, neo4j_password));
  driver.onCompleted = () => {
    console.log('Connected to Neo4j');
  };
  
  driver.onError = (error: any) => {
    console.error('Neo4j connection error:', error);
  };

  const session = driver.session();
  try {
    await session.run('RETURN 1');

    console.log('Connected to Neo4j');
  } catch (error) {
    console.error('Neo4j connection error:', error);
  } finally {
    session.close();
  }
};

export const getNeo4jDriver = () =>{
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call createNeo4jConnection first.');
  }

  return driver;
};