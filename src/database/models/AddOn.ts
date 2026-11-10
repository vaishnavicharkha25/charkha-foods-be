import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';
import Product from './Product';
import ProductAddOn from './ProductAddOn';

@Table({
  tableName: 'add_ons',
  timestamps: true,
  underscored: true,
})
export default class AddOn extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  price!: number;

  @BelongsToMany(() => Product, () => ProductAddOn)
  products?: Product[];
}
