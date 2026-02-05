const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { saveMaterialTransactionData, getAllCompanyMaterialTransaction } = require("./companyMaterialTransaction.controller");
const { addCompanyMaterialTransactionValidation } = require("./materialTransaction.validation");
const { validate } = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/upload.middleware");
router.use(authenticate(["ADMIN"]));

router.post(
    "/", 
    upload.single("image"),
    addCompanyMaterialTransactionValidation, 
    validate, 
    saveMaterialTransactionData,
);

router.get("/", getAllCompanyMaterialTransaction);

module.exports = router;