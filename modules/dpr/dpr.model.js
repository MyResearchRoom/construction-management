const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Dpr extends Model {
    static associate(models) {

      Dpr.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
      Dpr.hasMany(models.WorkDone, { 
        as: "workDone", 
        foreignKey: "dprId" 
      });
      Dpr.hasMany(models.MaterialOnSite, {
        as: "materialOnSite",
        foreignKey: "dprId",
      });
      Dpr.hasMany(models.DieselReport, {
        as: "dieselReport",
        foreignKey: "dprId",
      });
      Dpr.hasMany(models.LaborReport, {
        as: "laborReport",
        foreignKey: "dprId",
      });
      Dpr.hasMany(models.DailyExpense, {
        as: "dailyExpense",
        foreignKey: "dprId",
      });
      Dpr.hasMany(models.SitePhoto, {
        as: "photos",
        foreignKey: "dprId",
      });
    }
  }

  Dpr.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nameOfSite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameOfSupervisor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateOfSubmission: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("approved", "rejected", "pending"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      tableName: "dprs",
    }
  );

  return Dpr;
};
