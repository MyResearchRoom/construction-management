const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares/auth.middleware");
const { getPermissions } = require("./permission.controller");

// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.get(
  "/permissions-list",
  getPermissions
);

module.exports = router;
