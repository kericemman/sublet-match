const mongoose = require("mongoose");
const SupportTicket = require("./support.model");
const User = require("../users/user.model");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const createTicket = async (user, payload) => {
  const ticket = await SupportTicket.create({
    landlord: user._id,
    subject: payload.subject,
    category: payload.category || "other",
    status: "open",
    messages: [
      {
        sender: user._id,
        senderRole: "landlord",
        message: payload.message,
      },
    ],
    lastMessageAt: new Date(),
  });

  const safeName = sanitizeHtml(user.fullName);
  const safeSubject = sanitizeHtml(payload.subject);
  const safeMessage = sanitizeHtml(payload.message);
  const safeCategory = sanitizeHtml(payload.category || "other");

  try {
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New support ticket: ${payload.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Support Ticket</h2>
            <p><strong>From:</strong> ${safeName} (${sanitizeHtml(user.email)})</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Category:</strong> ${safeCategory}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
        text: `New support ticket from ${user.fullName}: ${payload.subject}`,
      });
    }

    await sendEmail({
      to: user.email,
      subject: `Support ticket received: ${payload.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Support Request Received</h2>
          <p>Hello ${safeName},</p>
          <p>We received your support request.</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p>Our admin team will review it and reply inside your support thread.</p>
        </div>
      `,
      text: `We received your support request: ${payload.subject}`,
    });
  } catch (error) {
    console.error("Support create email failed:", error.message);
  }

  return ticket;
};

const getMyTickets = async (userId) => {
  return SupportTicket.find({ landlord: userId })
    .sort({ lastMessageAt: -1 })
    .populate("landlord", "fullName email");
};

const getMyTicketById = async (userId, ticketId) => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket id");
  }

  const ticket = await SupportTicket.findOne({
    _id: ticketId,
    landlord: userId,
  })
    .populate("landlord", "fullName email")
    .populate("messages.sender", "fullName email role");

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};

const getAllTickets = async () => {
  return SupportTicket.find()
    .sort({ lastMessageAt: -1 })
    .populate("landlord", "fullName email")
    .populate("messages.sender", "fullName email role");
};

const getTicketByIdAdmin = async (ticketId) => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    throw new ApiError(400, "Invalid ticket id");
  }

  const ticket = await SupportTicket.findById(ticketId)
    .populate("landlord", "fullName email")
    .populate("messages.sender", "fullName email role");

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};

const replyToTicket = async (user, ticketId, message) => {
  const ticket = await SupportTicket.findById(ticketId).populate(
    "landlord",
    "fullName email"
  );

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  if (user.role === "landlord" && String(ticket.landlord._id) !== String(user._id)) {
    throw new ApiError(403, "Forbidden");
  }

  ticket.messages.push({
    sender: user._id,
    senderRole: user.role,
    message,
  });

  if (ticket.status === "resolved" || ticket.status === "closed") {
    ticket.status = "in_progress";
  }

  ticket.lastMessageAt = new Date();
  await ticket.save();

  const safeMessage = sanitizeHtml(message);
  const safeSubject = sanitizeHtml(ticket.subject);
  const safeSender = sanitizeHtml(user.fullName);

  try {
    if (user.role === "admin") {
      await sendEmail({
        to: ticket.landlord.email,
        subject: `Admin replied to your support ticket: ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Admin Reply</h2>
            <p>Hello ${sanitizeHtml(ticket.landlord.fullName)},</p>
            <p>The admin replied to your support ticket.</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Reply:</strong></p>
            <p>${safeMessage}</p>

            <p>Login to your account to view the full conversation: <a href="${process.env.FRONTEND_URL}/support/${ticket._id}">View Ticket</a></p>
          </div>
        `,
        text: `Admin replied to your support ticket: ${ticket.subject}`,
      });
    } else if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Landlord replied to support ticket: ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Landlord Reply</h2>
            <p><strong>From:</strong> ${safeSender}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Reply:</strong></p>
            <p>${safeMessage}</p>
            <p>Login to your account to reply <a href="${process.env.FRONTEND_URL}/admin/admin-support/${ticket._id}">View Ticket</a></p>
          </div>
        `,
        text: `Landlord replied to support ticket: ${ticket.subject}`,
      });
    }
  } catch (error) {
    console.error("Support reply email failed:", error.message);
  }

  return ticket;
};

const updateTicketStatus = async (ticketId, status) => {
  const ticket = await SupportTicket.findById(ticketId);

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  ticket.status = status;
  await ticket.save();

  return ticket;
};

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicketById,
  getAllTickets,
  getTicketByIdAdmin,
  replyToTicket,
  updateTicketStatus,
};