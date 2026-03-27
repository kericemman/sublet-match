const express = require("express");
const blogController = require("./blog.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createBlogValidation,
  updateBlogValidation,
} = require("./blog.validation");

const router = express.Router();

/**
 * Public
 */
router.get("/", blogController.getPublishedBlogs);
router.get("/:slug", blogController.getPublishedBlogBySlug);

/**
 * Admin
 */
router.post(
  "/admin",
  authMiddleware,
  allowRoles("admin"),
  createBlogValidation,
  validate,
  blogController.createBlog
);

router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("admin"),
  blogController.getAllBlogsAdmin
);

router.get(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  blogController.getBlogByIdAdmin
);

router.patch(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  updateBlogValidation,
  validate,
  blogController.updateBlog
);

router.patch(
  "/admin/:id/publish",
  authMiddleware,
  allowRoles("admin"),
  blogController.publishBlog
);

router.patch(
  "/admin/:id/unpublish",
  authMiddleware,
  allowRoles("admin"),
  blogController.unpublishBlog
);

router.delete(
  "/admin/:id",
  authMiddleware,
  allowRoles("admin"),
  blogController.deleteBlog
);

module.exports = router;