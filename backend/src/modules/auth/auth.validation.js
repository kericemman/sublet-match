const { body } = require("express-validator");

const registerValidation = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const googleAuthValidation = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Google token is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
];

const resetPasswordValidation = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];


module.exports = {
  registerValidation,
  loginValidation,
  googleAuthValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};