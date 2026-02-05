const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { addLaborSummary, getAllLaborSummaries } = require("./labor.controller");
const { laborValidation } = require("./labor.validation");

// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/", laborValidation, validate, addLaborSummary);
router.get("/", getAllLaborSummaries);

module.exports = router;
