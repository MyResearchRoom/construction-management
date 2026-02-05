const express = require("express");
const router = express.Router();

const userRoutes = require("../modules/user/user.routes");
const authRoutes = require("../modules/auth/auth.routes");
const tenderRoutes = require("../modules/tender/tender.routes");
const projectRoutes = require("../modules/project/project.routes");
const vehicleRoutes = require("../modules/vehicle/vehicle.routes");
const fuelLogRoutes = require("../modules/fuelLog/fuelLog.routes");
const laborRoutes = require("../modules/labor/labor.routes");
const materialRoutes = require("../modules/material/material.routes");
const dprRoutes = require("../modules/dpr/dpr.routes");
const companyRoutes = require("../modules/company/company.routes");
const permissionRoute = require("../modules/permission/permission.routes");
const userPermissionRoutes = require("../modules/permission/userPermission.routes");
const companyMaterial = require("../modules/Material_Company/companyMaterial.routes");
const companyMaterialTransaction = require("../modules/Material_Transaction/companyMaterialTransaction.routes");
const categoryRoutes = require("../modules/category/category.routes");
const expenseRoutes = require("../modules/expense/expense.routes");
const participantsRoutes = require("../modules/participants/participants.routes");

router.use("/api/test", (req, res) => {
  res.send("<h1>This is a test route.</h1>");
});
router.use("/api/users", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/tenders", tenderRoutes);
router.use("/api/projects", projectRoutes);
router.use("/api/vehicles", vehicleRoutes);
router.use("/api/fuel-logs", fuelLogRoutes);
router.use("/api/labors", laborRoutes);
router.use("/api/materials", materialRoutes);
router.use("/api/dprs", dprRoutes);
router.use("/api/company", companyRoutes);
router.use("/api/permission", permissionRoute);
router.use("/api/user-permission", userPermissionRoutes);
router.use("/api/company-material", companyMaterial);
router.use("/api/company-materialTransaction", companyMaterialTransaction);
router.use("/api/category", categoryRoutes);
router.use("/api/expense", expenseRoutes);
router.use("/api/participants",participantsRoutes)

module.exports = router;
