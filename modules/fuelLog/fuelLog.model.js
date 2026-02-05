const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FuelLog extends Model {
    static associate(models) {
      FuelLog.belongsTo(models.Vehicle, {
        foreignKey: "vehicleId",
        as: "vehicle",
      });
    }
  }

  FuelLog.init(
    {
      vehicleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startReading: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      endReading: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      litersFilled: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ratePerLiter: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      fuelSupplier: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      billPhoto: {
        type: DataTypes.BLOB("long"),
      },
      remarks: {
        type: DataTypes.TEXT,
      },
      imageContentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "fuel_logs",
    }
  );

  return FuelLog;
};
