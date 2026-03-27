const { body } = require("express-validator");

const subscribeNewsletterValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
];

module.exports = {
  subscribeNewsletterValidation,
};