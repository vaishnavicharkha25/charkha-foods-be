import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import OrderItem from './OrderItem';
import AddOn from './AddOn';

@Table({
  tableName: 'order_item_add_ons',
  timestamps: false,
  underscored: true,
})
export default class OrderItemAddOn extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => OrderItem)
  @AllowNull(false)
  @Column(DataType.UUID)
  orderItemId!: string;

  @BelongsTo(() => OrderItem)
  orderItem!: OrderItem;

  @ForeignKey(() => AddOn)
  @AllowNull(true)
  @Column(DataType.STRING(50))
  addOnId?: string;

  @BelongsTo(() => AddOn)
  addOn?: AddOn;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  addOnName!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  price!: number;
}
