import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  PrimaryKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import Category from './Category';
import AddOn from './AddOn';
import ProductAddOn from './ProductAddOn';

@Table({
  tableName: 'products',
  timestamps: true,
  underscored: true,
})
export default class Product extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  categoryId!: string;

  @BelongsTo(() => Category)
  category!: Category;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  name!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  price!: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  bestseller!: boolean;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  offerTag?: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  serves?: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isAvailable!: boolean;

  @BelongsToMany(() => AddOn, () => ProductAddOn)
  addOns?: AddOn[];
}
