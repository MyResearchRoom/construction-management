const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { saveCompanyData, getCompanyData } = require("./company.controller");
// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/", saveCompanyData);
router.get("/", getCompanyData);

module.exports = router;