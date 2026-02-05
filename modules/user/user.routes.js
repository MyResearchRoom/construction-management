const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const {
  userRegisterValidation,
  userUpdateValidation,
} = require("./user.validation");
const { validate } = require("../../middlewares/validate.middleware");

router.post(
  "/admin",
  userRegisterValidation,
  validate,
  userController.createUser
);

router.post(
  "/manager",
  authenticate(["ADMIN"]),
  userRegisterValidation,
  validate,
  userController.createUser
);

router.get(
  "/", 
  authenticate(["ADMIN"]), 
  userController.getAllUsers
);

router.put(
  "/:id",
  authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]),
  userUpdateValidation,
  validate,
  userController.updateUser
);

router.patch(
  "/:id/status",
  authenticate(["ADMIN"]),
  userController.changeStatus
);

router.get(
  "/projectmanager", 
  authenticate(["ADMIN"]), 
  userController.getAllProjectManagers
);

router.get(
  "/sitemanager", 
  authenticate(["ADMIN"]), 
  userController.getAllSiteManagers
);

router.get(
  "/finanancemanager", 
  authenticate(["ADMIN"]), 
  userController.getAllFinanaceManagers
);

router.get(
  "/:id",
  authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]),
  userController.getUserById
);

router.post(
  "/changePassword",
  authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]),
  userController.changePassword
);

module.exports = router;
