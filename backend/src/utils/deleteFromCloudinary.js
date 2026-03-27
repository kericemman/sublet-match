const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId);
};

module.exports = deleteFromCloudinary;