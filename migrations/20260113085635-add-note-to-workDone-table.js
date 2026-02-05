'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('work_done', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Optional note for the work done entry',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('work_done', 'note');
  }
};
