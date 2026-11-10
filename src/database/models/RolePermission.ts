import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';
import Role from './Role';
import Permission from './Permission';

@Table({
  tableName: 'role_permissions',
  timestamps: false,
  underscored: true,
})
export default class RolePermission extends Model {
  @PrimaryKey
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  roleId!: string;

  @PrimaryKey
  @ForeignKey(() => Permission)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  permissionId!: string;
}
