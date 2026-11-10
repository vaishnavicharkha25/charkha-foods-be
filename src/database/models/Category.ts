import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
} from 'sequelize-typescript';
import Product from './Product';

@Table({
  tableName: 'categories',
  timestamps: true,
  underscored: true,
})
export default class Category extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  slug!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  tagline?: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  imageUrl?: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  displayOrder!: number;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @HasMany(() => Product)
  products?: Product[];
}
