import { Session } from "neo4j-driver";

const getFollowing = async (userId: String, session: Session) => {
  try {
    const result = await session.run(
      'MATCH (follower:User {user_id: $userId})-[:FOLLOWS]->(following:User) RETURN following',
      { userId }
    );
  
    return result.records.map((record: any) => record.get('following').properties);
  } catch (error: any) {
    return new Error(error);
  }
};

export default getFollowing;