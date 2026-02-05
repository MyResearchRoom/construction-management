const EventEmitter = require("events");
const auditEmitter = new EventEmitter();

auditEmitter.on("audit", async (data) => {
  const { createAuditLog } = require("./auditLogger");
  await createAuditLog(data);
});

module.exports = auditEmitter;
