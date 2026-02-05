"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("material_transactions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projectMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "project_materials",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      transactionType: {
        type: Sequelize.ENUM("receive", "issue", "return"),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      challanNumber: {
        type: Sequelize.STRING,
      },
      challan: {
        type: Sequelize.BLOB("long"),
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
    await queryInterface.dropTable("material_transactions");
  },
};
