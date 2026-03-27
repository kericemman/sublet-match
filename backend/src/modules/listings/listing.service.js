const mongoose = require("mongoose");
const Listing = require("./listing.model");
const ApiError = require("../../utils/ApiError");

const createListing = async (userId, payload) => {
  const listing = await Listing.create({
    landlord: userId,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    currency: payload.currency || "USD",
    location: payload.location,
    propertyType: payload.propertyType,
    availabilityDate: payload.availabilityDate,
    availabilityEndDate: payload.availabilityEndDate || null,
    listedBy: payload.listedBy,
    lifestyleTags: payload.lifestyleTags || [],
    bedrooms: payload.bedrooms ?? null,
    bathrooms: payload.bathrooms ?? null,
    squareFeet: payload.squareFeet ?? null,
    parking: payload.parking || false,
    petsAllowed: payload.petsAllowed || false,
    furnished: payload.furnished || false,
    images: payload.images || [],
    status: "active",
  });

  return listing;
};

const getPublicListings = async (query) => {
  const filter = {
    status: "active",
  };

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.propertyType) {
    filter.propertyType = query.propertyType;
  }

  if (query.listedBy) {
    filter.listedBy = query.listedBy;
  }

  if (query.lifestyleTag) {
    filter.lifestyleTags = query.lifestyleTag;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 12, 1);
  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("landlord", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Listing.countDocuments(filter),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getPublicListingById = async (listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, "Invalid listing id");
  }

  const listing = await Listing.findOne({
    _id: listingId,
    status: "active",
  }).populate("landlord", "fullName");

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return listing;
};

const getMyListings = async (userId) => {
  const listings = await Listing.find({
    landlord: userId,
    status: { $ne: "deleted" },
  }).sort({ createdAt: -1 });

  return listings;
};

const getMyListingById = async (userId, listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, "Invalid listing id");
  }

  const listing = await Listing.findOne({
    _id: listingId,
    landlord: userId,
    status: { $ne: "deleted" },
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return listing;
};

const updateMyListing = async (userId, listingId, payload) => {
  const listing = await getMyListingById(userId, listingId);

const fields = [
  "title",
  "description",
  "price",
  "currency",
  "location",
  "propertyType",
  "availabilityDate",
  "availabilityEndDate",
  "listedBy",
  "lifestyleTags",
  "bedrooms",
  "bathrooms",
  "squareFeet",
  "parking",
  "petsAllowed",
  "furnished",
  "images",
];

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      listing[field] = payload[field];
    }
  });

  await listing.save();

  return listing;
};

const deleteMyListing = async (userId, listingId) => {
  const listing = await getMyListingById(userId, listingId);

  listing.status = "deleted";
  await listing.save();

  return listing;
};

module.exports = {
  createListing,
  getPublicListings,
  getPublicListingById,
  getMyListings,
  getMyListingById,
  updateMyListing,
  deleteMyListing,
};