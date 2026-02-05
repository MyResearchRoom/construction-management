const { body, query } = require("express-validator");

exports.addFuelLogValidation = [
  body("vehicleId").notEmpty().withMessage("Vehicle ID is required"),
  body("startReading")
    .isFloat({ gt: 0 })
    .withMessage("Start reading must be a positive number"),
  body("endReading")
    .isFloat({ gt: 0 })
    .withMessage("End reading must be a positive number"),
  body("litersFilled")
    .isFloat({ gt: 0 })
    .withMessage("Liters filled must be a positive number"),
  body("ratePerLiter")
    .isFloat({ gt: 0 })
    .withMessage("Rate per liter must be a positive number"),
  body("fuelSupplier").notEmpty().withMessage("Fuel supplier is required"),
];

exports.paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be ≥ 1"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be ≥ 1"),
];


// vehicleId
// 8
// startReading
// 10
// endReading
// 100
// litersFilled
// 20
// ratePerLiter
// 90
// fuelSupplier
// bharatPetroleum
// billPhoto
// (binary)
// remarks
// Qui voluptate autem 