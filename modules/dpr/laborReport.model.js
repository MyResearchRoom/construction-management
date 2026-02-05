const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LaborReport extends Model {}

  LaborReport.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      laborHeadName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      work: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mukadam: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      male: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      female: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "labor_report",
      timestamps: false,
    }
  );

  return LaborReport;
};
