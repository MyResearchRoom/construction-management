"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("labor_report", {
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
      laborHeadName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      work: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mukadam: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      male: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      female: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("labor_report");
  },
};
