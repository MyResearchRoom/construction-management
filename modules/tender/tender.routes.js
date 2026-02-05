const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/upload.middleware");
const {
  createTender,
  editTender,
  changeTenderStatus,
  getAllTenders,
  getTenderById,
} = require("./tender.controller");

const { createTenderValidator } = require("./tender.validation");

// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post(
  "/",
  upload.single("boq"),
  createTenderValidator,
  validate,
  createTender
);

router.put(
  "/:id",
  upload.single("boq"),
  createTenderValidator,
  validate,
  editTender
);

router.patch("/:id/status", changeTenderStatus);

router.get("/", getAllTenders);

router.get("/:id", getTenderById);

module.exports = router;
