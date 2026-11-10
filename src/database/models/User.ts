import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import CustomerProfile from './CustomerProfile';
import StaffProfile from './StaffProfile';
import UserAddress from './UserAddress';
import Order from './Order';
import LoyaltyTransaction from './LoyaltyTransaction';

export enum UserType {
  CUSTOMER = 'customer',
  STAFF = 'staff',
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export default class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  phone!: string;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING(255))
  email?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  passwordHash?: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  fullName!: string;

  @AllowNull(false)
  @Default(UserType.CUSTOMER)
  @Column(DataType.ENUM('customer', 'staff'))
  userType!: UserType;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @HasOne(() => CustomerProfile)
  customerProfile?: CustomerProfile;

  @HasOne(() => StaffProfile)
  staffProfile?: StaffProfile;

  @HasMany(() => UserAddress)
  addresses?: UserAddress[];

  @HasMany(() => Order)
  orders?: Order[];

  @HasMany(() => LoyaltyTransaction)
  loyaltyTransactions?: LoyaltyTransaction[];
}
