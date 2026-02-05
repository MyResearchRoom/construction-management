const { Model } = require("sequelize");
const auditEmitter = require("../../utils/eventBus");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          "ADMIN",
          "PROJECT_MANAGER",
          "SITE_MANAGER",
          "TENDER_MANAGER",
          "FINANCE_MANAGER",
          "HR_MANAGER"
        ),
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      sequelize,
      tableName: "users",
    }
  );

  /**
   * 🧩 Helper: Sanitize sensitive fields before logging
   */
  const sanitize = (data) => {
    if (!data) return null;
    const clone = { ...data };
    if (clone.password) clone.password = "[REDACTED]";
    return clone;
  };

  /**
   * 🧩 Audit Hooks
   */
  User.addHook("afterCreate", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || record.id || null,
      module: "User",
      action: "CREATE",
      recordId: record.id,
      oldData: null,
      newData: sanitize(record.toJSON()),
      req: options?.req,
    });
  });

  User.addHook("beforeUpdate", async (record, options) => {
    const oldData = sanitize(record._previousDataValues);
    const newData = sanitize(record.dataValues);

    auditEmitter.emit("audit", {
      userId: options?.userId || record.id || null,
      module: "User",
      action: "UPDATE",
      recordId: record.id,
      oldData,
      newData,
      req: options?.req,
    });
  });

  User.addHook("afterDestroy", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || record.id || null,
      module: "User",
      action: "DELETE",
      recordId: record.id,
      oldData: sanitize(record.toJSON()),
      newData: null,
      req: options?.req,
    });
  });

  return User;
};
