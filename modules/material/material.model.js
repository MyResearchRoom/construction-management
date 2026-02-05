const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProjectMaterial extends Model {
    static associate(models) {
      ProjectMaterial.hasMany(models.MaterialTransaction, {
        foreignKey: "projectMaterialId",
        as: "transactions",
      });
      ProjectMaterial.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
      ProjectMaterial.belongsTo(models.CompanyMaterial, {
        foreignKey: "materialId",
        as: "material",
      });
    }
  }

  ProjectMaterial.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "project_materials",
    }
  );

  return ProjectMaterial;
};
