const express = require("express");
const newsletterController = require("./newsletter.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { newsletterLimiter } = require("../../middlewares/rateLimiter.middleware");
const {
  subscribeNewsletterValidation,
} = require("./newsletter.validation");

const router = express.Router();

/**
 * Public
 */
router.post(
  "/subscribe",
  newsletterLimiter,
  subscribeNewsletterValidation,
  validate,
  newsletterController.subscribe
);

/**
 * Admin
 */
router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("admin"),
  newsletterController.getAllSubscribers
);

router.patch(
  "/admin/:id/deactivate",
  authMiddleware,
  allowRoles("admin"),
  newsletterController.deactivateSubscriber
);

router.patch(
  "/admin/:id/activate",
  authMiddleware,
  allowRoles("admin"),
  newsletterController.activateSubscriber
);

router.delete(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  newsletterController.deleteSubscriber
);

module.exports = router;