const { body } = require("express-validator");

const createBlogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title cannot exceed 180 characters"),

  body("excerpt")
    .trim()
    .notEmpty()
    .withMessage("Excerpt is required")
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required"),

  body("coverImage.url")
    .trim()
    .notEmpty()
    .withMessage("Cover image url is required"),

  body("coverImage.publicId")
    .trim()
    .notEmpty()
    .withMessage("Cover image publicId is required"),

  body("seoTitle")
    .optional()
    .trim()
    .isLength({ max: 180 })
    .withMessage("SEO title cannot exceed 180 characters"),

  body("seoDescription")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("SEO description cannot exceed 300 characters"),
];

const updateBlogValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 180 })
    .withMessage("Title cannot exceed 180 characters"),

  body("excerpt")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Excerpt cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),

  body("coverImage.url")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Cover image url cannot be empty"),

  body("coverImage.publicId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Cover image publicId cannot be empty"),

  body("seoTitle")
    .optional()
    .trim()
    .isLength({ max: 180 })
    .withMessage("SEO title cannot exceed 180 characters"),

  body("seoDescription")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("SEO description cannot exceed 300 characters"),
];

module.exports = {
  createBlogValidation,
  updateBlogValidation,
};