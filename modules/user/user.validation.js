const { check } = require("express-validator");
const { createError } = require("../../utils/error");

const userRegisterValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit mobile number"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),
  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([
      "ADMIN",
      "PROJECT_MANAGER",
      "SITE_MANAGER",
      "TENDER_MANAGER",
      "FINANCE_MANAGER",
      "HR_MANAGER",
    ])
    .withMessage("Invalid role selected")
    .custom((value, { req }) => {
      if (req.url === "/admin" && value !== "ADMIN") {
        throw createError("Only ADMIN role allowed for this route", 400);
      }
      return true;
    }),
];

const userUpdateValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit mobile number"),
];

module.exports = {
  userRegisterValidation,
  userUpdateValidation,
};
