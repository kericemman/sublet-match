const express = require("express");
const listingController = require("./listing.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createListingValidation,
  updateListingValidation,
} = require("./listing.validation");

const router = express.Router();

/**
 * Public routes
 */
router.get("/", listingController.getPublicListings);

/**
 * Landlord routes
 */
router.post(
  "/",
  authMiddleware,
  allowRoles("landlord"),
  createListingValidation,
  validate,
  listingController.createListing
);

router.get(
  "/mine/all",
  authMiddleware,
  allowRoles("landlord"),
  listingController.getMyListings
);

router.get(
  "/mine/:id",
  authMiddleware,
  allowRoles("landlord"),
  listingController.getMyListingById
);

router.patch(
  "/:id",
  authMiddleware,
  allowRoles("landlord"),
  updateListingValidation,
  validate,
  listingController.updateMyListing
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("landlord"),
  listingController.deleteMyListing
);

/**
 * Public single listing route
 */
router.get("/:id", listingController.getPublicListingById);

module.exports = router;