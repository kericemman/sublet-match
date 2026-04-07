const catchAsync = require("../../utils/catchAsync");
const feedbackService = require("./feedback.service");

const createFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.createFeedback(req.body);

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
    data: feedback,
  });
});

const getAllFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.getAllFeedback();

  res.status(200).json({
    success: true,
    data: feedback,
  });
});

const updateFeedbackStatus = catchAsync(async (req, res) => {
  const feedback = await feedbackService.updateFeedbackStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Feedback status updated successfully",
    data: feedback,
  });
});

const deleteFeedback = catchAsync(async (req, res) => {
  await feedbackService.deleteFeedback(req.params.id);

  res.status(200).json({
    success: true,
    message: "Feedback deleted successfully",
  });
});

module.exports = {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
};