const express = require("express");
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  registerValidation,
  loginValidation,
  googleAuthValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("./auth.validation");
const { authLimiter } = require("../../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  authController.register
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

router.post(
  "/google",
  authLimiter,
  googleAuthValidation,
  validate,
  authController.googleLogin
);

router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

router.get("/me", authMiddleware, authController.me);

module.exports = router;