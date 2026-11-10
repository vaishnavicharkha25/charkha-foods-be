import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import Order from './Order';
import Product from './Product';
import OrderItemAddOn from './OrderItemAddOn';

@Table({
  tableName: 'order_items',
  timestamps: false,
  underscored: true,
})
export default class OrderItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column(DataType.UUID)
  orderId!: string;

  @BelongsTo(() => Order)
  order!: Order;

  @ForeignKey(() => Product)
  @AllowNull(true)
  @Column(DataType.STRING(50))
  productId?: string;

  @BelongsTo(() => Product)
  product?: Product;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  productName!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  unitPrice!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  itemSubtotal!: number;

  @HasMany(() => OrderItemAddOn)
  addOns?: OrderItemAddOn[];
}
