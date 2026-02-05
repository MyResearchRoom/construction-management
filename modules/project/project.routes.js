const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const projectController = require("./project.controller");
const {
  addProjectValidation,
  editProjectValidation,
} = require("./project.validation");

// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post("/", addProjectValidation, validate, projectController.addProject);

router.put(
  "/:id",
  editProjectValidation,
  validate,
  projectController.editProject
);

router.get("/", projectController.getAllProjects);

router.get("/:id", projectController.getProjectById);

module.exports = router;
