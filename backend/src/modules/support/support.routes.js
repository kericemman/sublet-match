const express = require("express");
const supportController = require("./support.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createTicketValidation,
  replyTicketValidation,
  updateTicketStatusValidation,
} = require("./support.validation");

const router = express.Router();

router.use(authMiddleware);

/**
 * Landlord
 */
router.post(
  "/",
  allowRoles("landlord"),
  createTicketValidation,
  validate,
  supportController.createTicket
);

router.get(
  "/mine",
  allowRoles("landlord"),
  supportController.getMyTickets
);

router.get(
  "/mine/:id",
  allowRoles("landlord"),
  supportController.getMyTicketById
);

router.post(
  "/mine/:id/reply",
  allowRoles("landlord"),
  replyTicketValidation,
  validate,
  supportController.replyToTicket
);

/**
 * Admin
 */
router.get(
  "/admin/all",
  allowRoles("admin"),
  supportController.getAllTickets
);

router.get(
  "/admin/:id",
  allowRoles("admin"),
  supportController.getTicketByIdAdmin
);

router.post(
  "/admin/:id/reply",
  allowRoles("admin"),
  replyTicketValidation,
  validate,
  supportController.replyToTicket
);

router.patch(
  "/admin/:id/status",
  allowRoles("admin"),
  updateTicketStatusValidation,
  validate,
  supportController.updateTicketStatus
);

module.exports = router;