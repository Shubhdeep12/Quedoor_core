import {DataTypes} from 'sequelize';

const UserSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255)
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING
  },
  profileImg: {
    type: DataTypes.STRING
  },
};

export default UserSchema;