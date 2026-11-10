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
  Unique,
} from 'sequelize-typescript';
import User from './User';
import QrSource from './QrSource';
import OrderItem from './OrderItem';
import LoyaltyTransaction from './LoyaltyTransaction';

export enum FulfillmentMode {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  QR = 'qr',
}

export enum OrderStatus {
  NEW = 'new',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'Card',
  CASH = 'Cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Table({
  tableName: 'orders',
  timestamps: true,
  underscored: true,
})
export default class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  orderCode!: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.UUID)
  customerId?: string;

  @BelongsTo(() => User)
  customer?: User;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  customerName!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  customerPhone!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('delivery', 'pickup', 'qr'))
  fulfillmentMode!: FulfillmentMode;

  @AllowNull(false)
  @Default(OrderStatus.NEW)
  @Column(DataType.ENUM('new', 'preparing', 'ready', 'completed', 'cancelled'))
  status!: OrderStatus;

  @AllowNull(true)
  @Column(DataType.TEXT)
  deliveryAddress?: string;

  @ForeignKey(() => QrSource)
  @AllowNull(true)
  @Column(DataType.STRING(50))
  qrSourceId?: string;

  @BelongsTo(() => QrSource)
  qrSource?: QrSource;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  couponCode?: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  subtotal!: number;

  @AllowNull(false)
  @Default(0.00)
  @Column(DataType.DECIMAL(10, 2))
  discount!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  total!: number;

  @AllowNull(false)
  @Column(DataType.ENUM('UPI', 'Card', 'Cash'))
  paymentMethod!: PaymentMethod;

  @AllowNull(false)
  @Default(PaymentStatus.PAID)
  @Column(DataType.ENUM('pending', 'paid', 'failed'))
  paymentStatus!: PaymentStatus;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  pointsEarned!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  pointsRedeemed!: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  placedAt!: Date;

  @HasMany(() => OrderItem)
  items?: OrderItem[];

  @HasMany(() => LoyaltyTransaction)
  loyaltyTransactions?: LoyaltyTransaction[];
}
