import {Relationship} from "../models/relationship";

const getFollowers = async (userId: number): Promise<number[]> => {
  try {
    const followers = await Relationship.findAll({
      where: {
        followingId: userId,
      },
      attributes: ['followerId'],
    });

    const followerIds = followers.map((follower: any) => follower.followerId);

    return followerIds;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};

export default getFollowers;