import { Session } from "neo4j-driver";

const getFollowers = async (userId: String, session: Session) => {
  try {
    const result = await session.run(
      'MATCH (follower:User)-[:FOLLOWS]->(following:User {user_id: $userId}) RETURN follower',
      { userId }
    );

  
    return result.records.map((record: any) => record.get('follower').properties);
  } catch (error: any) {
    return new Error(error);
  }
}

export default getFollowers;