const mongoose = require("mongoose");
const connectDB = require("../config/db");
const env = require("../config/env");
const User = require("../modules/users/user.model");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = await User.create({
      fullName: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      authProvider: "local",
      isVerified: true,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();