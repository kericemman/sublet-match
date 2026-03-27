const { body } = require("express-validator");

const createInquiryValidation = [
  body("listingId")
    .trim()
    .notEmpty()
    .withMessage("Listing id is required")
    .isMongoId()
    .withMessage("Invalid listing id"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 120 })
    .withMessage("Name cannot exceed 120 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Phone cannot exceed 30 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 3000 })
    .withMessage("Message cannot exceed 3000 characters"),
];

const updateInquiryStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "read", "resolved"])
    .withMessage("Invalid inquiry status"),
];

module.exports = {
  createInquiryValidation,
  updateInquiryStatusValidation,
};