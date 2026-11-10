import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import Order from './Order';

export enum QrType {
  SOCIETY = 'Society',
  COMMERCIAL = 'Commercial building',
  TABLE = 'Table',
  COUNTER = 'Counter',
}

@Table({
  tableName: 'qr_sources',
  timestamps: true,
  underscored: true,
})
export default class QrSource extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  label!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('Society', 'Commercial building', 'Table', 'Counter'))
  type!: QrType;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  scansCount!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  ordersCount!: number;

  @HasMany(() => Order)
  orders?: Order[];
}
