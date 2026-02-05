const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { saveExpenseData, getAllExpenseData, changeStatusOfExpense, getExpenseDataById, getProjectMaterialSummary } = require("./expense.controller");
const upload = require("../../middlewares/upload.middleware");
// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN","FINANCE_MANAGER","PROJECT_MANAGER","SITE_MANAGER","TENDER_MANAGER"]));

router.post(
    "/", 
    upload.single("receipt"),
    saveExpenseData
);
router.get("/", getAllExpenseData);

router.patch(
    "/changeStatus/:id",
    changeStatusOfExpense
)

router.get("/:id", getExpenseDataById);

router.get("/project-finance/:projectId", getProjectMaterialSummary);

module.exports = router;