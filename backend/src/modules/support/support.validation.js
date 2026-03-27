const { body } = require("express-validator");

const createTicketValidation = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters"),

  body("category")
    .optional()
    .isIn(["account", "listing", "billing", "technical", "inquiry", "other"])
    .withMessage("Invalid category"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message cannot exceed 5000 characters"),
];

const replyTicketValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Reply message is required")
    .isLength({ max: 5000 })
    .withMessage("Message cannot exceed 5000 characters"),
];

const updateTicketStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["open", "in_progress", "resolved", "closed"])
    .withMessage("Invalid status"),
];

module.exports = {
  createTicketValidation,
  replyTicketValidation,
  updateTicketStatusValidation,
};