const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const listingRoutes = require("./modules/listings/listing.routes");
const inquiryRoutes = require("./modules/inquiries/inquiry.routes");
const blogRoutes = require("./modules/blogs/blog.routes");
const newsletterRoutes = require("./modules/newsletters/newsletter.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const uploadRoutes = require("./modules/uploads/upload.routes");
const contactRoutes = require("./modules/contacts/contact.routes");
const supportRoutes = require("./modules/support/support.routes");

const env = require("./config/env");

const app = express();

const allowedOrigins = [
  "https://subletmatch.com",
  "https://www.subletmatch.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/newsletters", newsletterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/support", supportRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;