const catchAsync = require("../../utils/catchAsync");
const newsletterService = require("./newsletter.service");

const subscribe = catchAsync(async (req, res) => {
  const result = await newsletterService.subscribe(req.body);

  res.status(201).json({
    success: true,
    message: result.message,
    data: result.subscriber,
  });
});

const getAllSubscribers = catchAsync(async (req, res) => {
  const subscribers = await newsletterService.getAllSubscribers();

  res.status(200).json({
    success: true,
    data: subscribers,
  });
});

const deactivateSubscriber = catchAsync(async (req, res) => {
  const subscriber = await newsletterService.deactivateSubscriber(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subscriber deactivated successfully",
    data: subscriber,
  });
});

const activateSubscriber = catchAsync(async (req, res) => {
  const subscriber = await newsletterService.activateSubscriber(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subscriber activated successfully",
    data: subscriber,
  });
});

const deleteSubscriber = catchAsync(async (req, res) => {
  await newsletterService.deleteSubscriber(req.params.id);

  res.status(200).json({
    success: true,
    message: "Subscriber deleted successfully",
  });
});

module.exports = {
  subscribe,
  getAllSubscribers,
  deactivateSubscriber,
  activateSubscriber,
  deleteSubscriber,
};