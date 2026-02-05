const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
      Participant.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Participant.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          "PROJECT_MANAGER",
          "SITE_MANAGER",
          "FINANCE_MANAGER",
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Participant",
      tableName: "participants",
      timestamps: false,
    }
  );

  return Participant;
};
