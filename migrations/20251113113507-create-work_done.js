"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("work_done", {
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
      chainage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemOfWork: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      length: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("work_done");
  },
};
