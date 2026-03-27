import api from "./axios";

export const submitContactMessage = async (payload) => {
  const { data } = await api.post("/contacts", payload);
  return data;
};

export const getAdminContacts = async () => {
  const { data } = await api.get("/contacts/admin/all");
  return data;
};

export const updateContactStatus = async (id, payload) => {
  const { data } = await api.patch(`/contacts/admin/${id}/status`, payload);
  return data;
};

export const deleteContact = async (id) => {
  const { data } = await api.delete(`/contacts/admin/${id}`);
  return data;
};