const catchAsync = require("../../utils/catchAsync");
const listingService = require("./listing.service");

const createListing = catchAsync(async (req, res) => {
  const listing = await listingService.createListing(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
});

const getPublicListings = catchAsync(async (req, res) => {
  const result = await listingService.getPublicListings(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getPublicListingById = catchAsync(async (req, res) => {
  const listing = await listingService.getPublicListingById(req.params.id);

  res.status(200).json({
    success: true,
    data: listing,
  });
});

const getMyListings = catchAsync(async (req, res) => {
  const listings = await listingService.getMyListings(req.user._id);

  res.status(200).json({
    success: true,
    data: listings,
  });
});

const getMyListingById = catchAsync(async (req, res) => {
  const listing = await listingService.getMyListingById(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: listing,
  });
});

const updateMyListing = catchAsync(async (req, res) => {
  const listing = await listingService.updateMyListing(
    req.user._id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: listing,
  });
});

const deleteMyListing = catchAsync(async (req, res) => {
  await listingService.deleteMyListing(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});

module.exports = {
  createListing,
  getPublicListings,
  getPublicListingById,
  getMyListings,
  getMyListingById,
  updateMyListing,
  deleteMyListing,
};