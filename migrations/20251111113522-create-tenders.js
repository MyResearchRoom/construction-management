"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tenders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenderId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estimatedBidValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      boq: {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "new",
          "boqPreparation",
          "rateAnalysis",
          "submitted",
          "won",
          "lost",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "new",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tenders");
  },
};
