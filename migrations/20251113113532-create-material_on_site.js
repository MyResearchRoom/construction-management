"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("material_on_site", {
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
      challanNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      materialType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicleNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brass: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("material_on_site");
  },
};
