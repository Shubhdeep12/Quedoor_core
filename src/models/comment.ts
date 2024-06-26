import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './post';

@Table({ tableName: 'comments', timestamps: false })
export class Comment extends Model<Comment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
    id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId!: Number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    postId!: number;

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
  
    @BelongsTo(() => Post)
      post!: Post;
}