const Feedback = require("./feedback.model");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const createFeedback = async (payload) => {
  const { name, email, rating, experienceType, message } = payload;

  const feedback = await Feedback.create({
    name,
    email,
    rating,
    experienceType: experienceType || "general",
    message,
    status: "new",
  });

  try {
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New SubletMatch feedback submitted`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Platform Feedback</h2>
            <p><strong>Name:</strong> ${sanitizeHtml(name)}</p>
            <p><strong>Email:</strong> ${sanitizeHtml(email)}</p>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p><strong>Type:</strong> ${sanitizeHtml(experienceType || "general")}</p>
            <p><strong>Message:</strong></p>
            <p>${sanitizeHtml(message)}</p>
          </div>
        `,
        text: `New feedback from ${name}. Rating: ${rating}/5.`,
      });
    }
  } catch (error) {
    console.error("Feedback email failed:", error.message);
  }

  return feedback;
};

const getAllFeedback = async () => {
  return Feedback.find().sort({ createdAt: -1 });
};

const updateFeedbackStatus = async (feedbackId, status) => {
  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  feedback.status = status;
  await feedback.save();

  return feedback;
};

module.exports = {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
};