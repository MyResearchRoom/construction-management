const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CompanyMaterial extends Model {
    static associate(models) {
      CompanyMaterial.hasMany(models.CompanyMaterialTransaction, {
        foreignKey: "materialId",
        as: "companyMaterialTransaction",
      });
      CompanyMaterial.belongsTo(models.Company, {
        foreignKey: "companyId",
        as: "company",
      });
    }
  }

  CompanyMaterial.init(
    {
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      materialName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      available_quantity : {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "company_materials",
      timestamps:true,
    }
  );

  return CompanyMaterial;
};
