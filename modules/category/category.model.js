const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models){
      Category.hasMany(models.Expense, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }

  Category.init(
    {
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
    sequelize,
    modelName: "Category", // ✅ FIX HERE
    tableName: "categories" // optional but recommended
    }
    // { sequelize, modelName: "categories" }
  );

  return Category;
};
