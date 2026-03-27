const express = require("express");
const contactController = require("./contact.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { inquiryLimiter } = require("../../middlewares/rateLimiter.middleware");
const {
  createContactValidation,
  updateContactStatusValidation,
} = require("./contact.validation");

const router = express.Router();

/**
 * Public
 */
router.post(
  "/",
  inquiryLimiter,
  createContactValidation,
  validate,
  contactController.createContactMessage
);

/**
 * Admin
 */
router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("admin"),
  contactController.getAllContactMessages
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  allowRoles("admin"),
  updateContactStatusValidation,
  validate,
  contactController.updateContactStatus
);

router.delete(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  contactController.deleteContactMessage
);

module.exports = router;