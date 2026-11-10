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

export enum CustomerSegment {
  NEW = 'New',
  REGULAR = 'Regular',
  VIP = 'VIP',
  LAPSED = 'Lapsed',
}

@Table({
  tableName: 'customer_profiles',
  timestamps: true,
  underscored: true,
})
export default class CustomerProfile extends Model {
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

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  loyaltyPoints!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalOrders!: number;

  @AllowNull(false)
  @Default(0.00)
  @Column(DataType.DECIMAL(10, 2))
  totalSpend!: number;

  @AllowNull(false)
  @Default(CustomerSegment.NEW)
  @Column(DataType.ENUM('New', 'Regular', 'VIP', 'Lapsed'))
  segment!: CustomerSegment;

  @AllowNull(true)
  @Column(DataType.DATE)
  lastOrderAt?: Date;
}
