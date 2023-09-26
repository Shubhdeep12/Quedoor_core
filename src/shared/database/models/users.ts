import { DataTypes } from 'sequelize';
import postgresConnection from '../config/sequelize';

const User = postgresConnection.define('users',
    {
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
    coverImg: {
      type: DataTypes.STRING
    }
    // country: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true
    // }
  }, {
    tableName: 'users',
    timestamps: false
});
  
export default User;
