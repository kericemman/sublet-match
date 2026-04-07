const { body } = require("express-validator");

const createFeedbackValidation = [
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

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("experienceType")
    .optional()
    .isIn([
      "general",
      "trust",
      "usability",
      "bug_report",
      "suggestion",
      "other",
    ])
    .withMessage("Invalid experience type"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 3000 })
    .withMessage("Message cannot exceed 3000 characters"),
];

const updateFeedbackStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "reviewed"])
    .withMessage("Invalid feedback status"),
];


const deleteFeedbackValidation = [
  body("id")
    .trim()
    .notEmpty()
    .withMessage("Feedback ID is required")
    .isMongoId()
    .withMessage("Invalid Feedback ID"),
];

module.exports = {
  createFeedbackValidation,
  updateFeedbackStatusValidation,
  deleteFeedbackValidation,

};