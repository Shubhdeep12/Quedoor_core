import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Comment } from './comment';
import {User} from './user';

@Table({ tableName: 'posts', timestamps: false })
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
    id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  })
    userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    imageUrl!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    richDescription!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    imageText!: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: true,
  })
    reactions!: number[];

  @HasMany(() => Comment)
    comments!: Comment[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
    createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
    updatedAt!: Date;
}