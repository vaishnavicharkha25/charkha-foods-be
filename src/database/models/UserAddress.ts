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

export enum AddressType {
  HOME = 'Home',
  WORK = 'Work',
  SOCIETY = 'Society',
  OTHER = 'Other',
}

@Table({
  tableName: 'user_addresses',
  timestamps: true,
  underscored: true,
})
export default class UserAddress extends Model {
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
  @Default(AddressType.HOME)
  @Column(DataType.ENUM('Home', 'Work', 'Society', 'Other'))
  addressType!: AddressType;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  flatBuilding!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  areaStreet!: string;

  @AllowNull(false)
  @Default('Pune')
  @Column(DataType.STRING(100))
  city!: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  pincode?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isDefault!: boolean;
}
