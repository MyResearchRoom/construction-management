const { Model } = require("sequelize");
const auditEmitter = require("../../utils/eventBus");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {}

  RefreshToken.init(
    {
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "refresh_tokens",
    }
  );

  RefreshToken.addHook("afterCreate", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || record.userId || null,
      module: "RefreshToken",
      action: "CREATE",
      recordId: record.id,
      oldData: null,
      newData: {
        ...record.toJSON(),
        token: "[REDACTED]",
      },
      req: options?.req,
    });
  });

  RefreshToken.addHook("beforeUpdate", async (record, options) => {
    const oldData = { ...record._previousDataValues, token: "[REDACTED]" };
    const newData = { ...record.dataValues, token: "[REDACTED]" };

    auditEmitter.emit("audit", {
      userId: options?.userId || record.userId || null,
      module: "RefreshToken",
      action: "UPDATE",
      recordId: record.id,
      oldData,
      newData,
      req: options?.req,
    });
  });

  RefreshToken.addHook("afterDestroy", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || record.userId || null,
      module: "RefreshToken",
      action: "DELETE",
      recordId: record.id,
      oldData: { ...record.toJSON(), token: "[REDACTED]" },
      newData: null,
      req: options?.req,
    });
  });

  return RefreshToken;
};
