"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      "diesel_report",
      "materialType",
      "machineType"
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn(
      "diesel_report",
      "machineType",
      "materialType"
    );
  },
};
