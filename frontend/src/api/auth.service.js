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

export const forgotPasswordRequest = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

export const resetPasswordRequest = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};