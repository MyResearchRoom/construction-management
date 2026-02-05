"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("daily_expenses", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dprId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "dprs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      particular: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expense: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      remainingAmount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("daily_expenses");
  },
};
