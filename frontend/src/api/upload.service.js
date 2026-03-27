import api from "./axios";

export const uploadSingleImage = async (file, folder = "subletmatch/general") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const { data } = await api.post("/uploads/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const uploadMultipleImages = async (
  files,
  folder = "subletmatch/listings"
) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  formData.append("folder", folder);

  const { data } = await api.post("/uploads/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};