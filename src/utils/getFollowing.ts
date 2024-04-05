import {Relationship} from "../models/relationship";

const getFollowing = async (userId: number): Promise<number[]> => {
  Relationship.sync();
  try {
    const following = await Relationship.findAll({
      where: {
        followerId: userId,
      },
      attributes: ['followingId'],
    });

    const followingIds = following.map((follow: any) => follow.followingId);

    return followingIds;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export default getFollowing;