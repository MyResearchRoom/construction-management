const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Permission extends Model {}

  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      timestamps: true,
    }
  );

  return Permission;
};
