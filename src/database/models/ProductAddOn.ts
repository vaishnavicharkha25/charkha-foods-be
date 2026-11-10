import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';
import Product from './Product';
import AddOn from './AddOn';

@Table({
  tableName: 'product_add_ons',
  timestamps: false,
  underscored: true,
})
export default class ProductAddOn extends Model {
  @PrimaryKey
  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  productId!: string;

  @PrimaryKey
  @ForeignKey(() => AddOn)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  addOnId!: string;
}
