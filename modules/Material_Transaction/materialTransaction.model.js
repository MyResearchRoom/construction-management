const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CompanyMaterialTransaction extends Model {
    static associate(models) {
      CompanyMaterialTransaction.belongsTo(models.CompanyMaterial, {
        foreignKey: "materialId",
        as: "companyMaterial",
      });
    }
  }

  CompanyMaterialTransaction.init(
    {
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pricePerUnit:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supplierName:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
      imageContentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "company_material_transactions",
      timestamps:true
    }
  );

  return CompanyMaterialTransaction;
};
