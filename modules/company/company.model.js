const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {}

  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      registeredAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      panNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dprSubmissions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expenseApprovals: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lowStockAlerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      projectMilestones: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenderDeadlines: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fuelVarianceAlerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      weeklyReports: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { sequelize, tableName: "company_data", timestamps: false }
  );

  return Company;
};
