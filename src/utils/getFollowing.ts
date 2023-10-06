import { getNeo4jDriver } from "../config/db/neo4j";

const getFollowing = async (userId: Number) => {
  const session = getNeo4jDriver().session();
  try {
    const result = await session.run(
      'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
      { userId }
    );

    return result.records.map((record: any) => record.get('following').properties.user_id.low);
  } catch (error: any) {
    throw new Error(error);
  } finally {
    session.close();
  }
};

export default getFollowing;