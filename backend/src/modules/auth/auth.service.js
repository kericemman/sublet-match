const crypto = require("crypto");
const User = require("../users/user.model");
const ApiError = require("../../utils/ApiError");
const generateToken = require("../../utils/generateToken");
const googleClient = require("../../config/googleOAuth");
const env = require("../../config/env");
const sendEmail = require("../../utils/sendEmail");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const formatAuthResponse = (user) => {
  const token = generateToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
    },
    token,
  };
};

const registerLandlord = async (payload) => {
  const { fullName, email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role: "landlord",
    authProvider: "local",
    isVerified: true,
  });

  return formatAuthResponse(user);
};

const loginLandlord = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.isBanned) {
    throw new ApiError(403, "Your account has been banned");
  }

  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(
      400,
      "This account uses Google sign-in. Continue with Google instead."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  return formatAuthResponse(user);
};

const loginWithGoogle = async (googleToken) => {
  try {
    if (!env.googleClientId) {
      throw new ApiError(500, "Google auth is not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new ApiError(401, "Invalid Google token");
    }

    const email = payload.email.toLowerCase().trim();
    const fullName = payload.name || "Google User";
    const googleId = payload.sub;
    const emailVerified = payload.email_verified;

    let user = await User.findOne({ email });

    if (user) {
      if (user.isBanned) {
        throw new ApiError(403, "Your account has been banned");
      }

      if (user.role !== "landlord") {
        throw new ApiError(403, "This Google account cannot access landlord login");
      }

      user.googleId = googleId;
      user.authProvider = "google";
      user.isVerified = !!emailVerified || user.isVerified;
      user.fullName = user.fullName || fullName;

      await user.save();
      return formatAuthResponse(user);
    }

    user = await User.create({
      fullName,
      email,
      googleId,
      role: "landlord",
      authProvider: "google",
      isVerified: !!emailVerified,
      password: null,
    });

    return formatAuthResponse(user);
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error.message);
    throw new ApiError(400, error.message || "Google authentication failed");
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
  }

  if (user.authProvider === "google" && !user.password) {
    return {
      message:
        "If that email exists in our system, a password reset link has been sent.",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  const resetLink = `${env.passwordResetUrl}?token=${rawToken}`;
  const safeName = sanitizeHtml(user.fullName);
  const safeLink = sanitizeHtml(resetLink);

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your SubletMatch password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset</h2>
          <p>Hello ${safeName},</p>
          <p>We received a request to reset your password.</p>
          <p>This link will expire in 30 minutes.</p>
          <p>
            <a href="${safeLink}" target="_blank" rel="noopener noreferrer">
              Reset your password
            </a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
      text: `Reset your password using this link: ${resetLink}`,
    });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    throw new ApiError(500, "Failed to send reset email");
  }

  return {
    message:
      "If that email exists in our system, a password reset link has been sent.",
  };
};

const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.authProvider = "local";

  await user.save();

  return {
    message: "Password reset successful",
  };
};

module.exports = {
  registerLandlord,
  loginLandlord,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
};