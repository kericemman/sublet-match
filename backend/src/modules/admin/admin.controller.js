const catchAsync = require("../../utils/catchAsync");
const adminService = require("./admin.service");

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

const getAllLandlords = catchAsync(async (req, res) => {
  const landlords = await adminService.getAllLandlords();

  res.status(200).json({
    success: true,
    data: landlords,
  });
});

const banLandlord = catchAsync(async (req, res) => {
  const landlord = await adminService.banLandlord(req.params.id);

  res.status(200).json({
    success: true,
    message: "Landlord banned successfully",
    data: landlord,
  });
});

const unbanLandlord = catchAsync(async (req, res) => {
  const landlord = await adminService.unbanLandlord(req.params.id);

  res.status(200).json({
    success: true,
    message: "Landlord unbanned successfully",
    data: landlord,
  });
});

const deleteLandlord = catchAsync(async (req, res) => {
  await adminService.deleteLandlord(req.params.id);

  res.status(200).json({
    success: true,
    message: "Landlord deleted successfully",
  });
});

const getAllListings = catchAsync(async (req, res) => {
  const listings = await adminService.getAllListings();

  res.status(200).json({
    success: true,
    data: listings,
  });
});

const hideListing = catchAsync(async (req, res) => {
  const listing = await adminService.hideListing(req.params.id);

  res.status(200).json({
    success: true,
    message: "Listing hidden successfully",
    data: listing,
  });
});

const unhideListing = catchAsync(async (req, res) => {
  const listing = await adminService.unhideListing(req.params.id);

  res.status(200).json({
    success: true,
    message: "Listing unhidden successfully",
    data: listing,
  });
});

const deleteListing = catchAsync(async (req, res) => {
  const listing = await adminService.deleteListing(req.params.id);

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
    data: listing,
  });
});

const getLandlordStats = catchAsync(async (req, res) => {
  const stats = await adminService.getLandlordStats(req.params.id);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

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
};