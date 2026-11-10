import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  PrimaryKey,
  AllowNull,
  Unique,
  Default,
} from 'sequelize-typescript';
import StaffProfile from './StaffProfile';
import Permission from './Permission';
import RolePermission from './RolePermission';

@Table({
  tableName: 'roles',
  timestamps: true,
  underscored: true,
})
export default class Role extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  description?: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isSystemRole!: boolean;

  @HasMany(() => StaffProfile)
  staffMembers?: StaffProfile[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions?: Permission[];
}
