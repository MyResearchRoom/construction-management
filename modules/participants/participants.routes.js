const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const participantsController = require("./participants.controller");


// router.use(authenticate(["ADMIN"]));
router.use(authenticate(["ADMIN"]));

router.post(
    "/assign-managers/:projectId",
    participantsController.assignProjectManagers
);

router.get(
    "/getAssignManagers/:projectId",
    participantsController.getAssignedMAnagers
)

module.exports = router;