const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkDone extends Model {}

  WorkDone.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chainage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemOfWork: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      length: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      width: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
    },
    {
      sequelize,
      tableName: "work_done",
      timestamps: false,
    }
  );

  return WorkDone;
};
