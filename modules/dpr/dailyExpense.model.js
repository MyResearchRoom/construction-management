const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DailyExpense extends Model {}

  DailyExpense.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      particular: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expense: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize, tableName: "daily_expenses", timestamps: false }
  );

  return DailyExpense;
};
