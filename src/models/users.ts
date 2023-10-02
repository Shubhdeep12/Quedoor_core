import UserSchema from '../schema/userSchema';
import postgresConnection from '../config/db/sequelize';

const User = postgresConnection.define('users',
  UserSchema, {
    tableName: 'users',
    timestamps: false
  });
  
export default User;
