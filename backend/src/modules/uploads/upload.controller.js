const catchAsync = require("../../utils/catchAsync");
const uploadToCloudinary = require("../../utils/uploadToCloudinary");
const ApiError = require("../../utils/ApiError");

const uploadSingleImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file uploaded");
  }

  const folder = req.body.folder || "subletmatch/general";
  const image = await uploadToCloudinary(req.file.buffer, folder);

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: image,
  });
});

const uploadMultipleImages = catchAsync(async (req, res) => {
  if (!req.files || !req.files.length) {
    throw new ApiError(400, "No image files uploaded");
  }

  const folder = req.body.folder || "subletmatch/listings";

  const uploadedImages = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file.buffer, folder))
  );

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: uploadedImages,
  });
});

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};