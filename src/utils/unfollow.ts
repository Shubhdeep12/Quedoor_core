import { ForeignKeyConstraintError } from 'sequelize';
import logger from '../middlewares/logger';

import postgresConnection from '../config/db/sequelize';
import { Relationship } from '../models/relationship';

const unfollowUser = async (followerId: number, followingId: number): Promise<void> => {
  let transaction;
  try {
    transaction = await postgresConnection.transaction();

    const deletedRelationship = await Relationship.destroy({
      where: {
        followerId,
        followingId,
      },
      transaction,
    });

    if (deletedRelationship === 0) {
      throw new Error('Relationship does not exist');
    }

    await transaction.commit();

    logger.info('Relationship deleted successfully');
  } catch (error: any) {
    if (transaction) await transaction.rollback();

    if (error instanceof ForeignKeyConstraintError) {
      throw new Error('One or both users do not exist');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export default unfollowUser;
