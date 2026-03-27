const Contact = require("./contact.model");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const createContactMessage = async (payload) => {
  const { name, email, subject, category, message } = payload;

  const contact = await Contact.create({
    name,
    email,
    subject,
    category,
    message,
    status: "new",
  });

  const safeName = sanitizeHtml(name);
  const safeEmail = sanitizeHtml(email);
  const safeSubject = sanitizeHtml(subject);
  const safeCategory = sanitizeHtml(category);
  const safeMessage = sanitizeHtml(message);

  try {
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New contact message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Category:</strong> ${safeCategory}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
        text: `New contact message from ${name} (${email}) - ${category}: ${subject}`,
      });
    }

    await sendEmail({
      to: email,
      subject: "We received your message - SubletMatch",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Message Received</h2>
          <p>Hello ${safeName},</p>
          <p>We received your message and will get back to you as soon as possible.</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Your message:</strong></p>
          <p>${safeMessage}</p>
          <br />
          <p>Thank you,</p>
          <p>SubletMatch</p>
        </div>
      `,
      text: `Hello ${name}, we received your message: ${subject}`,
    });
  } catch (error) {
    console.error("Contact email sending failed:", error.message);
  }

  return contact;
};

const getAllContactMessages = async () => {
  return Contact.find().sort({ createdAt: -1 });
};

const updateContactStatus = async (id, status) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.status = status;
  await contact.save();

  return contact;
};

const deleteContactMessage = async (id) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  await contact.deleteOne();
  return true;
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
};