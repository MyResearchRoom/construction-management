const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MaterialOnSite extends Model {}

  MaterialOnSite.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      challanNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      materialType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "material_on_site",
      timestamps: false,
    }
  );

  return MaterialOnSite;
};
