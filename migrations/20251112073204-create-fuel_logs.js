"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("fuel_logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      startReading: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      endReading: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      litersFilled: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      ratePerLiter: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fuelSupplier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billPhoto: {
        type: Sequelize.BLOB("long"),
      },
      remarks: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("fuel_logs");
  },
};
