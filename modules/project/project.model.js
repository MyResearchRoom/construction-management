const { Model } = require("sequelize");
const auditEmitter = require("../../utils/eventBus");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Dpr, {
        foreignKey: "projectId",
        as: "dprs",
      });
      Project.hasMany(models.ProjectMaterial, {
        foreignKey: "projectId",
        as: "projectMaterials",
      });
      Project.hasMany(models.Expense, {
        foreignKey: "projectId",
        as: "expensesProjects",
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      projectId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM("onTrack", "delayed"),
        defaultValue: "onTrack",
      },
    },
    {
      sequelize,
      tableName: "projects",
    }
  );

  // 🧩 Sequelize Hooks for automatic audit logs
  Project.addHook("afterCreate", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Project",
      action: "CREATE",
      recordId: record.projectId,
      oldData: null,
      newData: record.toJSON(),
      req: options?.req,
    });
  });

  Project.addHook("beforeUpdate", async (record, options) => {
    const oldData = record._previousDataValues;
    const newData = record.dataValues;

    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Project",
      action: "UPDATE",
      recordId: record.projectId,
      oldData,
      newData,
      req: options?.req,
    });
  });

  Project.addHook("afterDestroy", async (record, options) => {
    auditEmitter.emit("audit", {
      userId: options?.userId || null,
      module: "Project",
      action: "DELETE",
      recordId: record.projectId,
      oldData: record.toJSON(),
      newData: null,
      req: options?.req,
    });
  });

  return Project;
};
