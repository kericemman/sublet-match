const User = require("../users/user.model");
const Listing = require("../listings/listing.model");
const Inquiry = require("../inquiries/inquiry.model");
const Newsletter = require("../newsletters/newsletter.model");
const ApiError = require("../../utils/ApiError");
const mongoose = require("mongoose");

const getDashboardStats = async () => {
  const [
    totalLandlords,
    bannedLandlords,
    totalListings,
    activeListings,
    hiddenListings,
    deletedListings,
    totalInquiries,
    newInquiries,
    resolvedInquiries,
    totalSubscribers,
    activeSubscribers,
  ] = await Promise.all([
    User.countDocuments({ role: "landlord" }),
    User.countDocuments({ role: "landlord", isBanned: true }),
    Listing.countDocuments(),
    Listing.countDocuments({ status: "active" }),
    Listing.countDocuments({ status: "hidden" }),
    Listing.countDocuments({ status: "deleted" }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    Inquiry.countDocuments({ status: "resolved" }),
    Newsletter.countDocuments(),
    Newsletter.countDocuments({ isActive: true }),
  ]);

  return {
    landlords: {
      total: totalLandlords,
      banned: bannedLandlords,
      active: totalLandlords - bannedLandlords,
    },
    listings: {
      total: totalListings,
      active: activeListings,
      hidden: hiddenListings,
      deleted: deletedListings,
    },
    inquiries: {
      total: totalInquiries,
      new: newInquiries,
      resolved: resolvedInquiries,
    },
    newsletters: {
      total: totalSubscribers,
      active: activeSubscribers,
      inactive: totalSubscribers - activeSubscribers,
    },
  };
};
const getAllLandlords = async () => {
  const landlords = await User.find({ role: "landlord" })
    .select("-password")
    .sort({ createdAt: -1 });

  return landlords;
};

const banLandlord = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid landlord id");
  }

  const landlord = await User.findOne({ _id: userId, role: "landlord" });

  if (!landlord) {
    throw new ApiError(404, "Landlord not found");
  }

  landlord.isBanned = true;
  await landlord.save();

  await Listing.updateMany(
    { landlord: landlord._id, status: "active" },
    { $set: { status: "hidden" } }
  );

  return landlord;
};

const unbanLandlord = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid landlord id");
  }

  const landlord = await User.findOne({ _id: userId, role: "landlord" });

  if (!landlord) {
    throw new ApiError(404, "Landlord not found");
  }

  landlord.isBanned = false;
  await landlord.save();

  return landlord;
};

const deleteLandlord = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid landlord id");
  }

  const landlord = await User.findOne({ _id: userId, role: "landlord" });

  if (!landlord) {
    throw new ApiError(404, "Landlord not found");
  }

  await Listing.updateMany(
    { landlord: landlord._id, status: { $ne: "deleted" } },
    { $set: { status: "deleted" } }
  );

  await Inquiry.deleteMany({ landlord: landlord._id });
  await landlord.deleteOne();

  return true;
};

const getAllListings = async () => {
  const listings = await Listing.find()
    .populate("landlord", "fullName email isBanned")
    .sort({ createdAt: -1 });

  return listings;
};

const hideListing = async (listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, "Invalid listing id");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  listing.status = "hidden";
  await listing.save();

  return listing;
};

const unhideListing = async (listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, "Invalid listing id");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.status === "deleted") {
    throw new ApiError(400, "Deleted listing cannot be restored to active here");
  }

  listing.status = "active";
  await listing.save();

  return listing;
};

const deleteListing = async (listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, "Invalid listing id");
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  listing.status = "deleted";
  await listing.save();

  return listing;
};

const getLandlordStats = async (landlordId) => {
  if (!mongoose.Types.ObjectId.isValid(landlordId)) {
    throw new ApiError(400, "Invalid landlord id");
  }

  const landlord = await User.findOne({ _id: landlordId, role: "landlord" });

  if (!landlord) {
    throw new ApiError(404, "Landlord not found");
  }

  const stats = await Listing.aggregate([
    { $match: { landlord: landlord._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    active: 0,
    hidden: 0,
    deleted: 0,
    pending: 0,
    rejected: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
  });

  return result;
};

module.exports = {
  getDashboardStats,
  getAllLandlords,
  banLandlord,
  unbanLandlord,
  deleteLandlord,
  getAllListings,
  hideListing,
  unhideListing,
  deleteListing,
  getLandlordStats,
};