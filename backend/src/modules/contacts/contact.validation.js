const { body } = require("express-validator");

const createContactValidation = [
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

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 180 })
    .withMessage("Subject cannot exceed 180 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["general", "support", "partnership", "landlord", "other"])
    .withMessage("Invalid category"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message cannot exceed 5000 characters"),
];

const updateContactStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "read", "resolved"])
    .withMessage("Invalid status"),
];

const deleteContactValidation = [
  body("id")
    .trim()
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid id"),
];

module.exports = {
  createContactValidation,
  updateContactStatusValidation,
  deleteContactValidation,
};