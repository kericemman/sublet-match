const express = require("express");
const uploadController = require("./upload.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

router.post(
  "/single",
  authMiddleware,
  allowRoles("admin", "landlord"),
  upload.single("image"),
  uploadController.uploadSingleImage
);

router.post(
  "/multiple",
  authMiddleware,
  allowRoles("admin", "landlord"),
  upload.array("images", 10),
  uploadController.uploadMultipleImages
);

module.exports = router;