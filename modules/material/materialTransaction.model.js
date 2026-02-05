const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MaterialTransaction extends Model {
    static associate(models) {
      MaterialTransaction.belongsTo(models.ProjectMaterial, {
        foreignKey: "projectMaterialId",
        as: "projectMaterial",
      });
    }
  }

  MaterialTransaction.init(
    {
      projectMaterialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.ENUM("receive", "issue", "return"),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      challanNumber: {
        type: DataTypes.STRING,
      },
      challan: {
        type: DataTypes.BLOB("long"),
      },
      imageContentType:{
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "material_transactions",
    }
  );

  return MaterialTransaction;
};
