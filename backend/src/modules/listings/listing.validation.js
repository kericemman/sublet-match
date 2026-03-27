const { body } = require("express-validator");

const propertyTypes = [
  "apartment",
  "studio",
  "shared_room",
  "private_room",
  "house",
  "other",
];

const listedByOptions = ["landlord", "private_lister"];

const lifestyleTagOptions = [
  "sober",
  "bipoc",
  "lgbtq_friendly",
  "students",
  "professionals",
  "families",
];

const createListingValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Currency must be between 3 and 10 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("propertyType")
    .notEmpty()
    .withMessage("Property type is required")
    .isIn(propertyTypes)
    .withMessage("Invalid property type"),

  body("availabilityDate")
    .notEmpty()
    .withMessage("Availability date is required")
    .isISO8601()
    .withMessage("Availability date must be a valid date"),

  body("availabilityEndDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Availability end date must be a valid date"),

  body("listedBy")
    .notEmpty()
    .withMessage("Listed by is required")
    .isIn(listedByOptions)
    .withMessage("Invalid listedBy value"),

  body("lifestyleTags")
    .optional()
    .isArray()
    .withMessage("Lifestyle tags must be an array"),

  body("lifestyleTags.*")
    .optional()
    .isIn(lifestyleTagOptions)
    .withMessage("Invalid lifestyle tag"),

  body("bedrooms")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Bedrooms must be a valid number"),

  body("bathrooms")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Bathrooms must be a valid number"),

  body("squareFeet")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Square feet must be a valid number"),

  body("parking")
    .optional()
    .isBoolean()
    .withMessage("Parking must be true or false"),

  body("petsAllowed")
    .optional()
    .isBoolean()
    .withMessage("Pets allowed must be true or false"),

  body("furnished")
    .optional()
    .isBoolean()
    .withMessage("Furnished must be true or false"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("images.*.url")
    .optional()
    .isString()
    .withMessage("Image url must be a string"),

  body("images.*.publicId")
    .optional()
    .isString()
    .withMessage("Image publicId must be a string"),
];

const updateListingValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("Currency must be between 3 and 10 characters"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty")
    .isLength({ max: 150 })
    .withMessage("Location cannot exceed 150 characters"),

  body("propertyType")
    .optional()
    .isIn(propertyTypes)
    .withMessage("Invalid property type"),

  body("availabilityDate")
    .optional()
    .isISO8601()
    .withMessage("Availability date must be a valid date"),

  body("availabilityEndDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Availability end date must be a valid date"),

  body("listedBy")
    .optional()
    .isIn(listedByOptions)
    .withMessage("Invalid listedBy value"),

  body("lifestyleTags")
    .optional()
    .isArray()
    .withMessage("Lifestyle tags must be an array"),

  body("lifestyleTags.*")
    .optional()
    .isIn(lifestyleTagOptions)
    .withMessage("Invalid lifestyle tag"),

  body("bedrooms")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Bedrooms must be a valid number"),

  body("bathrooms")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Bathrooms must be a valid number"),

  body("squareFeet")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Square feet must be a valid number"),

  body("parking")
    .optional()
    .isBoolean()
    .withMessage("Parking must be true or false"),

  body("petsAllowed")
    .optional()
    .isBoolean()
    .withMessage("Pets allowed must be true or false"),

  body("furnished")
    .optional()
    .isBoolean()
    .withMessage("Furnished must be true or false"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("images.*.url")
    .optional()
    .isString()
    .withMessage("Image url must be a string"),

  body("images.*.publicId")
    .optional()
    .isString()
    .withMessage("Image publicId must be a string"),
];

module.exports = {
  createListingValidation,
  updateListingValidation,
};