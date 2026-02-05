const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.hasMany(models.FuelLog, {
        foreignKey: "vehicleId",
        as: "fuelLogs",
      });
    }
  }

  Vehicle.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicleId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      vehicleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      targetEfficiency: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      sequelize,
      tableName: "vehicles",
    }
  );

  return Vehicle;
};
