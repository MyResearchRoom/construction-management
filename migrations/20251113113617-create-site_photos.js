"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("site_photos", {
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
      photo: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("site_photos");
  },
};
