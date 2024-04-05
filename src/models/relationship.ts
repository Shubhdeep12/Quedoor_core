import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'relationship', timestamps: false })
export class Relationship extends Model<Relationship> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
    id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    followerId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    followingId!: number;
}
