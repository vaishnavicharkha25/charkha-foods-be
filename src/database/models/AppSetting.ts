import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'app_settings',
  timestamps: true,
  underscored: true,
})
export default class AppSetting extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(50))
  key!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  value!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  description?: string;

  /**
   * Helper to fetch setting value from DB
   */
  public static async getSetting(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const record = await AppSetting.findByPk(key);
      return record ? record.value : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Check if 5% GST is enabled directly in DB
   */
  public static async isGstEnabled(): Promise<boolean> {
    try {
      const val = await this.getSetting('gst_enabled', 'true');
      return val === 'true' || val === '1';
    } catch {
      return true;
    }
  }

  /**
   * Update setting value in DB
   */
  public static async setSetting(key: string, value: string, description?: string): Promise<AppSetting> {
    const [record] = await AppSetting.upsert({
      key,
      value,
      description,
    });
    return record;
  }
}
