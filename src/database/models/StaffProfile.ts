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
import Role from './Role';

export enum StaffRole {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  KITCHEN = 'Kitchen',
  CASHIER = 'Cashier',
  MARKETING = 'Marketing',
}

export enum ShiftStatus {
  ON_DUTY = 'on_duty',
  OFF_DUTY = 'off_duty',
}

@Table({
  tableName: 'staff_profiles',
  timestamps: true,
  underscored: true,
})
export default class StaffProfile extends Model {
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

  @ForeignKey(() => Role)
  @AllowNull(true)
  @Column(DataType.STRING(50))
  roleId?: string;

  @BelongsTo(() => Role)
  roleDetail?: Role;

  @AllowNull(false)
  @Column(DataType.ENUM('Owner', 'Manager', 'Kitchen', 'Cashier', 'Marketing'))
  role!: StaffRole;

  @AllowNull(false)
  @Default(ShiftStatus.ON_DUTY)
  @Column(DataType.ENUM('on_duty', 'off_duty'))
  shiftStatus!: ShiftStatus;
}
