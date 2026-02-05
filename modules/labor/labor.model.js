const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Labor extends Model {}

  Labor.init(
    {
      contractorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maleWorkersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      femaleWorkersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wageType: {
        type: DataTypes.ENUM("contract", "daily"),
        allowNull: false,
      },
      dailyWage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
    },
    {
      sequelize,
      modelName: "Labor",
      tableName: "labors",
      timestamps: true,
    }
  );

  Labor.associate = (models) => {
    Labor.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return Labor;
};
