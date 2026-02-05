const { body } = require("express-validator");

exports.addTransactionValidation = [
  body("projectId").notEmpty().withMessage("Project ID is required"),
  body("materialId").notEmpty().withMessage("materialId is required"),
  body("transactionType")
    .isIn(["receive", "issue", "return"])
    .withMessage("Invalid transaction type"),
  body("quantity")
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("challanNumber").optional().isString(),
];
