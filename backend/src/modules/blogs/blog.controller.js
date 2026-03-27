const catchAsync = require("../../utils/catchAsync");
const blogService = require("./blog.service");

const createBlog = catchAsync(async (req, res) => {
  const blog = await blogService.createBlog(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

const getPublishedBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getPublishedBlogs(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getPublishedBlogBySlug = catchAsync(async (req, res) => {
  const blog = await blogService.getPublishedBlogBySlug(req.params.slug);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

const getAllBlogsAdmin = catchAsync(async (req, res) => {
  const blogs = await blogService.getAllBlogsAdmin();

  res.status(200).json({
    success: true,
    data: blogs,
  });
});

const getBlogByIdAdmin = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogByIdAdmin(req.params.id);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
});

const publishBlog = catchAsync(async (req, res) => {
  const blog = await blogService.publishBlog(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog published successfully",
    data: blog,
  });
});

const unpublishBlog = catchAsync(async (req, res) => {
  const blog = await blogService.unpublishBlog(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog unpublished successfully",
    data: blog,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  await blogService.deleteBlog(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

module.exports = {
  createBlog,
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  updateBlog,
  publishBlog,
  unpublishBlog,
  deleteBlog,
};