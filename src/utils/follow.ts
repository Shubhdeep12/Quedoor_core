import logger from "../middlewares/logger";
import { getNeo4jDriver } from "../config/db/neo4j";

const followUser = async (followerId: Number, followingId: Number) => {
  const session = getNeo4jDriver().session();
  let createdRelationship: any;
  try {
    const result = await session.run(
      'MATCH (follower:User {user_id: $followerId}), (following:User {user_id: $followingId}) ' +
      'WHERE NOT (follower)-[:FOLLOWS]->(following) ' +
      'CREATE (follower)-[:FOLLOWS]->(following) ' +
      'RETURN follower, following',
      { followerId, followingId }
    );
  
    // Check if the relationship was created
    if (result.records.length === 0) {
      throw new Error('Relationship already exists');
    }
  
    createdRelationship = result.records[0];
  
    // Access the follower and following nodes
    const followerNode = createdRelationship.get('follower');
    const followingNode = createdRelationship.get('following');
  
    // Handle the nodes as needed
  
    logger.info('Relationship created successfully:', followerNode.properties, followingNode.properties);
    return createdRelationship;
  } catch (error: any) {
    if (error?.message.includes('Relationship already exists')) {
      throw new Error('Error: Relationship already exists between the users');
    } else if (error?.message.includes('Node not found')) {
      throw new Error('Error: One or both users do not exist');
    } else {
      throw new Error('Error:', error.message);
    }
  } finally {
    // Always close the session
    session.close();
  }
};

export default followUser;