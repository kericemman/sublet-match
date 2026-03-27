const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    propertyType: {
      type: String,
      required: true,
      enum: [
        "apartment",
        "studio",
        "shared_room",
        "private_room",
        "house",
        "other",
      ],
    },

    availabilityDate: {
      type: Date,
      required: true,
    },

    availabilityEndDate: {
      type: Date,
      default: null,
    },

    listedBy: {
      type: String,
      required: true,
      enum: ["landlord", "private_lister"],
    },

    lifestyleTags: [
      {
        type: String,
        enum: [
          "sober",
          "bipoc",
          "lgbtq_friendly",
          "students",
          "professionals",
          "families",
        ],
      },
    ],

    bedrooms: {
      type: Number,
      min: 0,
      default: null,
    },

    bathrooms: {
      type: Number,
      min: 0,
      default: null,
    },

    squareFeet: {
      type: Number,
      min: 0,
      default: null,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    petsAllowed: {
      type: Boolean,
      default: false,
    },

    furnished: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "hidden", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);