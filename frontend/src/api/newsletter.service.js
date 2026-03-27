import api from "./axios";

export const subscribeNewsletter = async (payload) => {
  const { data } = await api.post("/newsletters/subscribe", payload);
  return data;
};

export const getSubscribers = async () => {
  const { data } = await api.get("/newsletters/admin/all");
  return data;
};

export const deactivateSubscriber = async (id) => {
  const { data } = await api.patch(`/newsletters/admin/${id}/deactivate`);
  return data;
};

export const activateSubscriber = async (id) => {
  const { data } = await api.patch(`/newsletters/admin/${id}/activate`);
  return data;
};

export const deleteSubscriber = async (id) => {
  const { data } = await api.delete(`/newsletters/admin/${id}`);
  return data;
};

export const exportSubscribers = async () => {
  const { data } = await api.get("/newsletters/admin/export");
  return data;
};