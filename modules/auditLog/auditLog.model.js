const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {}

  AuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // if anonymous action possible
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false, // e.g. "Project", "Tender"
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false, // e.g. "CREATE", "UPDATE", "DELETE", "STATUS_CHANGE"
      },
      recordId: {
        type: DataTypes.STRING,
        allowNull: false, // projectId, tenderId, etc.
      },
      oldData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      newData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING,
      },
      userAgent: {
        type: DataTypes.STRING,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "audit_logs",
      timestamps: false,
    }
  );

  return AuditLog;
};
