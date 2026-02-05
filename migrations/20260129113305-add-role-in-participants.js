"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("participants", "role", {
      type: Sequelize.ENUM(
        "PROJECT_MANAGER",
        "SITE_MANAGER",
        "FINANCE_MANAGER",
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("participants", "role");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_participants_role";'
    );
  },
};
