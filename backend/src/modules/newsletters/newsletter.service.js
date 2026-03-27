const Newsletter = require("./newsletter.model");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const subscribe = async (payload) => {
  const email = payload.email.toLowerCase().trim();

  const existingSubscriber = await Newsletter.findOne({ email });

  if (existingSubscriber) {
    if (!existingSubscriber.isActive) {
      existingSubscriber.isActive = true;
      existingSubscriber.subscribedAt = new Date();
      await existingSubscriber.save();

      try {
        const safeEmail = sanitizeHtml(email);

        await sendEmail({
          to: email,
          subject: "You are subscribed again to SubletMatch",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Subscription Reactivated</h2>
              <p>Hello,</p>
              <p>Your email <strong>${safeEmail}</strong> has been re-subscribed to SubletMatch updates.</p>
              <p>Thank you for staying with us.</p>
            </div>
          `,
          text: `Your email ${email} has been re-subscribed to SubletMatch updates.`,
        });
      } catch (error) {
        console.error("Newsletter re-subscribe email failed:", error.message);
      }

      return {
        subscriber: existingSubscriber,
        message: "Subscription reactivated successfully",
      };
    }

    throw new ApiError(409, "Email is already subscribed");
  }

  const subscriber = await Newsletter.create({
    email,
    isActive: true,
    subscribedAt: new Date(),
  });

  try {
    const safeEmail = sanitizeHtml(email);

    await sendEmail({
      to: email,
      subject: "Welcome to SubletMatch updates",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Subscription Confirmed</h2>
          <p>Hello,</p>
          <p>Your email <strong>${safeEmail}</strong> has been subscribed to SubletMatch updates.</p>
          <p>We’ll keep you posted with relevant updates and insights.</p>
        </div>
      `,
      text: `Your email ${email} has been subscribed to SubletMatch updates.`,
    });

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New newsletter subscriber",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${safeEmail}</p>
          </div>
        `,
        text: `New newsletter subscriber: ${email}`,
      });
    }
  } catch (error) {
    console.error("Newsletter email sending failed:", error.message);
  }

  return {
    subscriber,
    message: "Subscribed successfully",
  };
};

const getAllSubscribers = async () => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  return subscribers;
};

const deactivateSubscriber = async (subscriberId) => {
  const subscriber = await Newsletter.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  subscriber.isActive = false;
  await subscriber.save();

  return subscriber;
};

const activateSubscriber = async (subscriberId) => {
  const subscriber = await Newsletter.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  subscriber.isActive = true;
  await subscriber.save();

  return subscriber;
};

const deleteSubscriber = async (subscriberId) => {
  const subscriber = await Newsletter.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  await subscriber.deleteOne();
  return true;
};

module.exports = {
  subscribe,
  getAllSubscribers,
  deactivateSubscriber,
  activateSubscriber,
  deleteSubscriber,
};