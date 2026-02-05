const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "projectExpenses",
      });
      Expense.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "expenseCategory",
      });
      Expense.belongsTo(models.User, {
        foreignKey: "submittedBy",
        as: "expenseUsers",
      });
    }
  }

  Expense.init(
    {
      expenseId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submittedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      gst: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      receipt: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
      imageContentType:{
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    { sequelize, tableName: "expenses",timestamps: true, }
  );

  return Expense;
};
