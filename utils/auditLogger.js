const { AuditLog } = require("../models");

exports.createAuditLog = async ({
  userId,
  module,
  action,
  recordId,
  oldData,
  newData,
  req,
}) => {
  try {
    await AuditLog.create({
      userId,
      module,
      action,
      recordId,
      oldData,
      newData,
      ipAddress: req?.clientIp || null,
      userAgent: req?.headers["user-agent"] || null,
    });
  } catch (error) {
    console.error("Audit Log Error:", error.message);
  }
};
