const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    experienceType: {
      type: String,
      enum: [
        "general",
        "trust",
        "usability",
        "bug_report",
        "suggestion",
        "other",
      ],
      default: "general",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);