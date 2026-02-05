const { check } = require("express-validator");

exports.laborValidation = [
  check("contractorName").notEmpty().withMessage("Contractor name is required"),
  check("projectId")
    .isInt({ gt: 0 })
    .withMessage("Valid projectId is required"),
  check("maleWorkersCount")
    .isInt({ min: 0 })
    .withMessage("Male workers count must be a positive integer"),
  check("femaleWorkersCount")
    .isInt({ min: 0 })
    .withMessage("Female workers count must be a positive integer"),
  check("wageType")
    .notEmpty()
    .isIn(["contract", "daily"])
    .withMessage("Wage type must be either contract or daily"),
  check("dailyWage")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Daily wage must be a positive number"),
];
