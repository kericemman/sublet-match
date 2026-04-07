import api from "./axios";

export const submitPlatformFeedback = async (payload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};

export const getAdminFeedback = async () => {
  const { data } = await api.get("/feedback/admin/all");
  return data;
};

export const updateFeedbackStatus = async (id, payload) => {
  const { data } = await api.patch(`/feedback/admin/${id}/status`, payload);
  return data;
};

export const deleteFeedback = async (id) => {
  const { data } = await api.delete(`/feedback/admin/${id}`);
  return data;
}