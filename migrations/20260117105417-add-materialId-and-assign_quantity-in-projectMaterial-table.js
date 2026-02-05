"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "project_materials",
      "material"
    );

    await queryInterface.addColumn(
      "project_materials",
      "materialId",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "company_materials",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", 
      }
    );

    await queryInterface.addColumn(
      "project_materials",
      "assigned_quantity",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    );
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      "project_materials",
      "assigned_quantity"
    );

    await queryInterface.removeColumn(
      "project_materials",
      "materialId"
    );

    await queryInterface.addColumn(
      "project_materials",
      "material",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },
};
