// modules/tender/tender.model.js
const { Model } = require("sequelize");
const auditEmitter = require("../../utils/eventBus");

module.exports = (sequelize, DataTypes) => {
  class Tender extends Model {}

  Tender.init(
    {
      tenderId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estimatedBidValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      boq: {
        type: DataTypes.BLOB("long"),
      },
      status: {
        type: DataTypes.ENUM(
          "new",
          "boqPreparation",
          "rateAnalysis",
          "submitted",
          "won",
          "lost",
          "cancelled"
        ),
        defaultValue: "new",
      },
    },
    {
      sequelize,
      tableName: "tenders",
    }
  );

  Tender.addHook("afterCreate", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Tender",
      action: "CREATE",
      recordId: record.tenderId,
      oldData: null,
      newData: record.toJSON(),
      req: options?.req,
    });
  });

  Tender.addHook("beforeUpdate", async (record, options) => {
    const oldData = record._previousDataValues;
    const newData = record.dataValues;

    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Tender",
      action: "UPDATE",
      recordId: record.tenderId,
      oldData,
      newData,
      req: options?.req,
    });
  });

  Tender.addHook("afterDestroy", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Tender",
      action: "DELETE",
      recordId: record.tenderId,
      oldData: record.toJSON(),
      newData: null,
      req: options?.req,
    });
  });

  return Tender;
};
