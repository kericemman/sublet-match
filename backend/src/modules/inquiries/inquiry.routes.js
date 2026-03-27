const express = require("express");
const inquiryController = require("./inquiry.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { inquiryLimiter } = require("../../middlewares/rateLimiter.middleware");
const { createInquiryValidation } = require("./inquiry.validation");

const router = express.Router();

/**
 * Public
 */
router.post(
  "/",
  inquiryLimiter,
  createInquiryValidation,
  validate,
  inquiryController.createInquiry
);

/**
 * Landlord
 */
router.get(
  "/mine",
  authMiddleware,
  allowRoles("landlord"),
  inquiryController.getMyInquiries
);

/**
 * Admin
 */
router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("admin"),
  inquiryController.getAllInquiries
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  allowRoles("admin"),
  inquiryController.updateInquiryStatus
);

module.exports = router;