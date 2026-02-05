const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { saveMaterialData, getAllMaterialData } = require("./companyMaterial.controller");
// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/", saveMaterialData);
router.get("/", getAllMaterialData);

module.exports = router;