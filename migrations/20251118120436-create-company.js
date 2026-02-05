"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("company_data", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registeredAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dprSubmissions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expenseApprovals: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lowStockAlerts: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      projectMilestones: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tenderDeadlines: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fuelVarianceAlerts: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      weeklyReports: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("company_data");
  },
};
