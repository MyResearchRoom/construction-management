const { body, param } = require("express-validator");

exports.addProjectValidation = [
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("client").notEmpty().withMessage("Client is required"),
  body("budget").isNumeric().withMessage("Budget must be a number"),
  body("startDate").isISO8601().withMessage("Start date must be a valid date"),
  body("endDate").isISO8601().withMessage("End date must be a valid date"),
  body("location").notEmpty().withMessage("Location is required"),
  body("status")
    .optional()
    .isIn(["onTrack", "delayed"])
    .withMessage("Invalid status value"),
];

exports.editProjectValidation = [
  param("id").isInt().withMessage("Invalid project ID"),
  body("projectName").optional().notEmpty(),
  body("client").optional().notEmpty(),
  body("budget").optional().isNumeric(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("location").optional().notEmpty(),
  body("status").optional().isIn(["onTrack", "delayed"]),
];
