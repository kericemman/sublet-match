const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many auth requests. Try again later.",
  },
});

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: "Too many inquiry submissions. Try again later.",
  },
});

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many subscription attempts. Try again later.",
  },
});

module.exports = {
  authLimiter,
  inquiryLimiter,
  newsletterLimiter,
};