const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DieselReport extends Model {}

  DieselReport.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tripFrom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tripTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diesel: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "diesel_report",
      timestamps: false,
    }
  );

  return DieselReport;
};
