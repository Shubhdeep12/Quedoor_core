import logger from '../middlewares/logger';
import { ForeignKeyConstraintError } from 'sequelize';
import {Relationship} from '../models/relationship';

const followUser = async (followerId: number, followingId: number): Promise<any> => {
  try {
    const existingRelationship = await Relationship.findOne({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingRelationship) {
      throw new Error('Relationship already exists between the users');
    }

    const createdRelationship = await Relationship.create({
      followerId,
      followingId,
    } as Relationship);

    logger.info('Relationship created successfully:', createdRelationship);

    return createdRelationship;
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new Error('One or both users do not exist');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export default followUser;
