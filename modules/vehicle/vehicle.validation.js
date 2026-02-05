const { body } = require("express-validator");

exports.addVehicleValidation = [
  body("vehicleName").notEmpty().withMessage("Vehicle name is required"),
  body("type").notEmpty().withMessage("Vehicle type is required"),
  body("registrationNumber")
    .notEmpty()
    .withMessage("Registration number is required"),
  body("targetEfficiency")
    .isFloat({ gt: 0 })
    .withMessage("Target efficiency must be a positive number"),
];

        // vehicle:'',
        // registrationNo:'',
        // targetEfficiency:'',
        // type:''

exports.editVehicleValidation = [
  body("vehicleName")
    .optional()
    .notEmpty()
    .withMessage("Vehicle name cannot be empty"),
  body("type")
    .optional()
    .notEmpty()
    .withMessage("Vehicle type cannot be empty"),
  body("registrationNumber")
    .optional()
    .notEmpty()
    .withMessage("Registration number cannot be empty"),
  body("targetEfficiency")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Target efficiency must be a positive number"),
];
