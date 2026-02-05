const { body } = require("express-validator");

exports.createTenderValidator = [
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("client").notEmpty().withMessage("Client is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("estimatedBidValue")
    .isNumeric()
    .withMessage("Estimated bid value must be a number"),
  body("dueDate").isISO8601().withMessage("Valid due date is required"),
  body("status")
    .optional()
    .isIn([
      "new",
      "boqPreparation",
      "rateAnalysis",
      "submitted",
      "won",
      "lost",
      "cancelled",
    ])
    .withMessage("Invalid status value"),
];
