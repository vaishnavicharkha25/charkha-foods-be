import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'offer_banners',
  timestamps: true,
  underscored: true,
})
export default class OfferBanner extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  title!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  subtitle?: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  code?: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  displayOrder!: number;
}
