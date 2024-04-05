import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
    id!: number;

  @Column({
    type: DataType.STRING(255)
  })
    name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
    email!: string;

  @Column({
    type: DataType.STRING
  })
    password!: string;

  @Column({
    type: DataType.STRING
  })
    city!: string;

  @Column({
    type: DataType.STRING
  })
    website!: string;

  @Column({
    type: DataType.STRING
  })
    profileImg!: string;
}
