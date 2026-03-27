import api from "./axios";

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};

export const getLandlords = async () => {
  const { data } = await api.get("/admin/landlords");
  return data;
};

export const banLandlord = async (id) => {
  const { data } = await api.patch(`/admin/landlords/${id}/ban`);
  return data;
};

export const unbanLandlord = async (id) => {
  const { data } = await api.patch(`/admin/landlords/${id}/unban`);
  return data;
};

export const deleteLandlord = async (id) => {
  const { data } = await api.delete(`/admin/landlords/${id}`);
  return data;
};

export const getAdminListings = async () => {
  const { data } = await api.get("/admin/listings");
  return data;
};

export const hideListing = async (id) => {
  const { data } = await api.patch(`/admin/listings/${id}/hide`);
  return data;
};

export const unhideListing = async (id) => {
  const { data } = await api.patch(`/admin/listings/${id}/unhide`);
  return data;
};

export const deleteAdminListing = async (id) => {
  const { data } = await api.delete(`/admin/listings/${id}`);
  return data;
};

export const approveListing = async (id) => {
  const { data } = await api.patch(`/admin/listings/${id}/approve`);
  return data;
};

export const rejectListing = async (id) => {
  const { data } = await api.patch(`/admin/listings/${id}/reject`);
  return data;
};

