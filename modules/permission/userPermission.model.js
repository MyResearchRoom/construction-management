const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UserPermission extends Model {
    static associate(models) {
      UserPermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permission",
      });
    }
  }

  UserPermission.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      grantedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "UserPermission",
      tableName: "user_permissions",
      timestamps: true,
    }
  );

  return UserPermission;
};
