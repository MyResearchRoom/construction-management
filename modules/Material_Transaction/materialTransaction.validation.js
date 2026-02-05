const { body, query } = require("express-validator");

exports.addCompanyMaterialTransactionValidation = [
  body("materialId")
    .notEmpty()
    .withMessage("Material ID is required")
    .isInt()
    .withMessage("Material ID must be an integer"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),

  body("pricePerUnit")
    .notEmpty()
    .withMessage("Price Per Unit is required")
    .isInt({ gt: 0 })
    .withMessage("Price Per Unit must be a positive integer"),

  body("supplierName")
    .notEmpty()
    .withMessage("Supplier name is required"),
];

exports.paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be ≥ 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Limit must be ≥ 1"),
];


