import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('app_settings', {
      key: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Seed default settings for GST
    await queryInterface.bulkInsert('app_settings', [
      {
        key: 'gst_enabled',
        value: 'true',
        description: 'Enable or disable 5% GST across orders and billing (true / false)',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'gst_rate',
        value: '5',
        description: 'Default GST percentage rate',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('app_settings');
  },
};
