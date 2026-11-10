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
import User from './User';
import Order from './Order';

export enum LoyaltyType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  BONUS = 'bonus',
  EXPIRED = 'expired',
}

@Table({
  tableName: 'loyalty_transactions',
  timestamps: true,
  updatedAt: false,
  underscored: true,
})
export default class LoyaltyTransaction extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Order)
  @AllowNull(true)
  @Column(DataType.UUID)
  orderId?: string;

  @BelongsTo(() => Order)
  order?: Order;

  @AllowNull(false)
  @Column(DataType.ENUM('earned', 'redeemed', 'bonus', 'expired'))
  type!: LoyaltyType;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  points!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  description!: string;
}
