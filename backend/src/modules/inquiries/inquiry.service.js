const Inquiry = require("./inquiry.model");
const Listing = require("../listings/listing.model");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const createInquiry = async (payload) => {
  const { listingId, name, email, phone, message } = payload;

  const listing = await Listing.findOne({
    _id: listingId,
    status: "active",
  }).populate("landlord", "fullName email");

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  const inquiry = await Inquiry.create({
    listing: listing._id,
    landlord: listing.landlord._id,
    name,
    email,
    phone: phone || "",
    message,
    status: "new",
  });

  const safeName = sanitizeHtml(name);
  const safeEmail = sanitizeHtml(email);
  const safePhone = sanitizeHtml(phone || "Not provided");
  const safeMessage = sanitizeHtml(message);
  const safeListingTitle = sanitizeHtml(listing.title);
  const safeLandlordName = sanitizeHtml(listing.landlord?.fullName || "N/A");

  try {
    await sendEmail({
      to: email,
      subject: `Inquiry received for ${listing.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Inquiry Received</h2>
          <p>Hello ${safeName},</p>
          <p>We have received your inquiry for <strong>${safeListingTitle}</strong>.</p>
          <p>The landlord/admin has been notified and will follow up with you soon.</p>
          <p><strong>Your message:</strong></p>
          <p>${safeMessage}</p>
          <br />
          <p>Thank you,</p>
          <p>SubletMatch</p>
        </div>
      `,
      text: `Hello ${name}, we received your inquiry for ${listing.title}. Your message: ${message}`,
    });

    if (listing.landlord?.email) {
      await sendEmail({
        to: listing.landlord.email,
        subject: `New inquiry for your listing: ${listing.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Inquiry Received</h2>
            <p>You have received a new inquiry for <strong>${safeListingTitle}</strong>.</p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
        text: `New inquiry for ${listing.title} from ${name} (${email}). Message: ${message}`,
      });
    }

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New platform inquiry: ${listing.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Inquiry on SubletMatch</h2>
            <p><strong>Listing:</strong> ${safeListingTitle}</p>
            <p><strong>Landlord:</strong> ${safeLandlordName}</p>
            <p><strong>User Name:</strong> ${safeName}</p>
            <p><strong>User Email:</strong> ${safeEmail}</p>
            <p><strong>User Phone:</strong> ${safePhone}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
        text: `New inquiry on ${listing.title} from ${name} (${email}).`,
      });
    }
  } catch (error) {
    console.error("Inquiry email sending failed:", error.message);
  }

  return inquiry;
};

const getMyInquiries = async (userId) => {
  const inquiries = await Inquiry.find({ landlord: userId })
    .populate("listing", "title location price status")
    .sort({ createdAt: -1 });

  return inquiries;
};

const getAllInquiries = async () => {
  const inquiries = await Inquiry.find()
    .populate("listing", "title location price status")
    .populate("landlord", "fullName email")
    .sort({ createdAt: -1 });

  return inquiries;
};

const updateInquiryStatus = async (inquiryId, status) => {
  const inquiry = await Inquiry.findById(inquiryId);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  inquiry.status = status;
  await inquiry.save();

  return inquiry;
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
};