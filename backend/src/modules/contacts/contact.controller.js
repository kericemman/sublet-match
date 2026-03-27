const catchAsync = require("../../utils/catchAsync");
const contactService = require("./contact.service");

const createContactMessage = catchAsync(async (req, res) => {
  const contact = await contactService.createContactMessage(req.body);

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: contact,
  });
});

const getAllContactMessages = catchAsync(async (req, res) => {
  const contacts = await contactService.getAllContactMessages();

  res.status(200).json({
    success: true,
    data: contacts,
  });
});

const updateContactStatus = catchAsync(async (req, res) => {
  const contact = await contactService.updateContactStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Contact status updated successfully",
    data: contact,
  });
});

const deleteContactMessage = catchAsync(async (req, res) => {
  await contactService.deleteContactMessage(req.params.id);

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
});

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
};