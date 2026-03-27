const catchAsync = require("../../utils/catchAsync");
const supportService = require("./support.service");

const createTicket = catchAsync(async (req, res) => {
  const ticket = await supportService.createTicket(req.user, req.body);

  res.status(201).json({
    success: true,
    message: "Support ticket created successfully",
    data: ticket,
  });
});

const getMyTickets = catchAsync(async (req, res) => {
  const tickets = await supportService.getMyTickets(req.user._id);

  res.status(200).json({
    success: true,
    data: tickets,
  });
});

const getMyTicketById = catchAsync(async (req, res) => {
  const ticket = await supportService.getMyTicketById(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

const getAllTickets = catchAsync(async (req, res) => {
  const tickets = await supportService.getAllTickets();

  res.status(200).json({
    success: true,
    data: tickets,
  });
});

const getTicketByIdAdmin = catchAsync(async (req, res) => {
  const ticket = await supportService.getTicketByIdAdmin(req.params.id);

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

const replyToTicket = catchAsync(async (req, res) => {
  const ticket = await supportService.replyToTicket(
    req.user,
    req.params.id,
    req.body.message
  );

  res.status(200).json({
    success: true,
    message: "Reply sent successfully",
    data: ticket,
  });
});

const updateTicketStatus = catchAsync(async (req, res) => {
  const ticket = await supportService.updateTicketStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Ticket status updated successfully",
    data: ticket,
  });
});

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicketById,
  getAllTickets,
  getTicketByIdAdmin,
  replyToTicket,
  updateTicketStatus,
};