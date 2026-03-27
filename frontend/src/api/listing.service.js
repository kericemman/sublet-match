import api from "./axios";

export const registerLandlord = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginLandlord = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const loginWithGoogle = async (token) => {
  const { data } = await api.post("/auth/google", { token });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const getMyListings = async () => {
  const { data } = await api.get("/listings/mine/all");
  return data;
};
export const getPublicListings = async (params = {}) => {
  const { data } = await api.get("/listings", { params });
  return data;
};

export const getPublicListingById = async (id) => {
  const { data } = await api.get(`/listings/${id}`);
  return data;
};

export const deleteListing = async (id) => {
  const { data } = await api.delete(`/listings/${id}`);
  return data;
};

export const createListing = async (payload) => {
  const { data } = await api.post("/listings", payload);
  return data;
};

export const getMyListingById = async (id) => {
  const { data } = await api.get(`/listings/mine/${id}`);
  return data;
};

export const updateListing = async (id, payload) => {
  const { data } = await api.patch(`/listings/${id}`, payload);
  return data;
};