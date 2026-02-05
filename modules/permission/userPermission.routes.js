const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares/auth.middleware");
const { grantPermission, getUserPermissions } = require("./userPermission.controller");

router.use(authenticate(["ADMIN"]));

router.post(
  "/",
  grantPermission
);

router.get(
  "/:userId",
  getUserPermissions
);

module.exports = router;