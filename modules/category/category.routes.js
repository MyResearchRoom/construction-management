const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { saveCategoryData, getAllCategoryData } = require("./category.controller");
// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/", saveCategoryData);
router.get("/", getAllCategoryData);

module.exports = router;