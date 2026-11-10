import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  PrimaryKey,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import Role from './Role';
import RolePermission from './RolePermission';

@Table({
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
})
export default class Permission extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  module!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  action!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  code!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  description?: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles?: Role[];
}
