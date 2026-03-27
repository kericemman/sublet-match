import api from "./axios";

export const submitInquiry = async (payload) => {
  const { data } = await api.post("/inquiries", payload);
  return data;
};

export const getMyInquiries = async () => {
  const  { data } = await api.get("/inquiries/mine");
  return data;
};

export const getAdminInquiries = async () => {
  const { data } = await api.get("/inquiries/admin/all");
  return data;
};

export const updateInquiryStatus = async (id, payload) => {
  const { data } = await api.patch(`/inquiries/admin/${id}/status`, payload);
  return data;
};


export const markInquiryAsRead = async (id) => {
  const { data } = await api.patch(`/inquiries/admin/${id}/read`);
  return data;
};

export const deleteInquiry = async (id) => {
  const { data } = await api.delete(`/inquiries/admin/${id}`);
  return data;
};