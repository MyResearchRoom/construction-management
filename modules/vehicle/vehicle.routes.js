const express = require("express");
const router = express.Router();
const {
  addVehicle,
  editVehicle,
  getAllVehicles,
  getVehicleById,
} = require("./vehicle.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {
  addVehicleValidation,
  editVehicleValidation,
} = require("./vehicle.validation");

// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/add", addVehicleValidation, validate, addVehicle);
router.patch("/edit/:id", editVehicleValidation, validate, editVehicle);
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

module.exports = router;
