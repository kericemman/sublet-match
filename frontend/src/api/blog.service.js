import api from "./axios";

export const getPublishedBlogs = async (params = {}) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

export const getPublishedBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

export const createBlog = async (payload) => {
  const { data } = await api.post("/blogs/admin", payload);
  return data;
};

export const getAdminBlogs = async () => {
  const { data } = await api.get("/blogs/admin/all");
  return data;
};

export const getAdminBlogById = async (id) => {
  const { data } = await api.get(`/blogs/admin/${id}`);
  return data;
};

export const updateBlog = async (id, payload) => {
  const { data } = await api.patch(`/blogs/admin/${id}`, payload);
  return data;
};

export const publishBlog = async (id) => {
  const { data } = await api.patch(`/blogs/admin/${id}/publish`);
  return data;
};

export const unpublishBlog = async (id) => {
  const { data } = await api.patch(`/blogs/admin/${id}/unpublish`);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/admin/${id}`);
  return data;
};