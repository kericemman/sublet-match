import api from "./axios";

export const createSupportTicket = async (payload) => {
  const { data } = await api.post("/support", payload);
  return data;
};

export const getMySupportTickets = async () => {
  const { data } = await api.get("/support/mine");
  return data;
};

export const getMySupportTicketById = async (id) => {
  const { data } = await api.get(`/support/mine/${id}`);
  return data;
};

export const replyToMySupportTicket = async (id, payload) => {
  const { data } = await api.post(`/support/mine/${id}/reply`, payload);
  return data;
};

export const getAdminSupportTickets = async () => {
  const { data } = await api.get("/support/admin/all");
  return data;
};

export const getAdminSupportTicketById = async (id) => {
  const { data } = await api.get(`/support/admin/${id}`);
  return data;
};

export const replyToAdminSupportTicket = async (id, payload) => {
  const { data } = await api.post(`/support/admin/${id}/reply`, payload);
  return data;
};

export const updateSupportTicketStatus = async (id, payload) => {
  const { data } = await api.patch(`/support/admin/${id}/status`, payload);
  return data;
};