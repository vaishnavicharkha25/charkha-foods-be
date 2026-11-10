import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';

export enum DiscountType {
  FLAT = 'flat',
  PERCENT = 'percent',
}

@Table({
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
})
export default class Coupon extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  code!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  label!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('flat', 'percent'))
  discountType!: DiscountType;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  value!: number;

  @AllowNull(false)
  @Default(0.00)
  @Column(DataType.DECIMAL(8, 2))
  minOrderAmount!: number;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;
}
