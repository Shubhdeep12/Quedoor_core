import { getNeo4jDriver } from "../config/db/neo4j";

const getFollowers = async (userId: Number) => {
  const session = getNeo4jDriver().session();
  try {
    const result = await session.run(
      'MATCH (follower:User)-[:FOLLOWS]->(following:User {user_id: $userId}) RETURN follower',
      { userId }
    );

    return result.records.map((record: any) => record.get('follower').properties.user_id.low);
  } catch (error: any) {
    throw new Error(error);
  } finally {
    session.close();
  }
};

export default getFollowers;