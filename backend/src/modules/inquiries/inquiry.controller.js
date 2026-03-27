const catchAsync = require("../../utils/catchAsync");
const inquiryService = require("./inquiry.service");

const createInquiry = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.createInquiry(req.body);

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully",
    data: inquiry,
  });
});

const getMyInquiries = catchAsync(async (req, res) => {
  const inquiries = await inquiryService.getMyInquiries(req.user._id);

  res.status(200).json({
    success: true,
    data: inquiries,
  });
});

const getAllInquiries = catchAsync(async (req, res) => {
  const inquiries = await inquiryService.getAllInquiries();

  res.status(200).json({
    success: true,
    data: inquiries,
  });
});

const updateInquiryStatus = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.updateInquiryStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Inquiry status updated successfully",
    data: inquiry,
  });
});

module.exports = {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
};