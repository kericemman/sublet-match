const express = require("express");
const feedbackController = require("./feedback.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createFeedbackValidation,
  updateFeedbackStatusValidation,
  deleteFeedbackValidation,
} = require("./feedback.validation");

const router = express.Router();

/**
 * Public
 */
router.post(
  "/",
  createFeedbackValidation,
  validate,
  feedbackController.createFeedback
);

/**
 * Admin
 */
router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("admin"),
  feedbackController.getAllFeedback
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  allowRoles("admin"),
  updateFeedbackStatusValidation,
  validate,
  feedbackController.updateFeedbackStatus
);

router.delete(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteFeedbackValidation,
  validate,
  feedbackController.deleteFeedback
);

module.exports = router;