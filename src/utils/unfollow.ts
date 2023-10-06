import logger from "../middlewares/logger";
import { getNeo4jDriver } from "../config/db/neo4j";

const unfollowUser = async (followerId: Number, followingId: Number) => {
  const session = getNeo4jDriver().session();
  try {
    const result = await session.run(
      'MATCH (follower:User {user_id: $followerId})-[rel:FOLLOWS]->(following:User {user_id: $followingId}) ' +
      'DELETE rel ' +
      'RETURN follower, following',
      { followerId, followingId }
    );
  
    // Check if the relationship was deleted
    if (result.records.length === 0) {
      throw new Error('Relationship does not exist');
    }
  
    const deletedRelationship = result.records[0];
  
    // Access the follower and following nodes
    const followerNode = deletedRelationship.get('follower');
    const followingNode = deletedRelationship.get('following');
  
    // Handle the nodes as needed
  
    logger.info('Relationship deleted successfully:', followerNode.properties, followingNode.properties);
  } catch (error: any) {
    if (error.message.includes('Relationship does not exist')) {
      throw new Error('Error: Relationship does not exist between the users');
    } else if (error.message.includes('Node not found')) {
      throw new Error('Error: One or both users do not exist');
    } else {
      throw new Error('Error:', error.message);
    }
  } finally {
    // Always close the session
    session.close();
  }
  
};

export default unfollowUser;