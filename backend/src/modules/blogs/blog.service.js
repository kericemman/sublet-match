const mongoose = require("mongoose");
const Blog = require("./blog.model");
const ApiError = require("../../utils/ApiError");
const makeSlug = require("../../utils/slugify");
const sanitizeHtml = require("../../utils/sanitizeHtml");

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = makeSlug(title);
  let slug = baseSlug || `post-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existingBlog = await Blog.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });

    if (!existingBlog) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const createBlog = async (userId, payload) => {
  const slug = await generateUniqueSlug(payload.title);

  const blog = await Blog.create({
    title: payload.title,
    slug,
    excerpt: payload.excerpt,
    content: sanitizeHtml(payload.content),
    coverImage: payload.coverImage,
    seoTitle: payload.seoTitle || payload.title,
    seoDescription: payload.seoDescription || payload.excerpt,
    isPublished: false,
    publishedAt: null,
    author: userId,
  });

  return blog;
};

const getPublishedBlogs = async (query) => {
  const filter = { isPublished: true };

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { excerpt: { $regex: query.search, $options: "i" } },
      { seoTitle: { $regex: query.search, $options: "i" } },
    ];
  }

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "fullName")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getPublishedBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug, isPublished: true }).populate(
    "author",
    "fullName"
  );

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  return blog;
};

const getAllBlogsAdmin = async () => {
  const blogs = await Blog.find()
    .populate("author", "fullName email")
    .sort({ createdAt: -1 });

  return blogs;
};

const getBlogByIdAdmin = async (blogId) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog id");
  }

  const blog = await Blog.findById(blogId).populate("author", "fullName email");

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  return blog;
};

const updateBlog = async (blogId, payload) => {
  const blog = await getBlogByIdAdmin(blogId);

  if (payload.title && payload.title !== blog.title) {
    blog.title = payload.title;
    blog.slug = await generateUniqueSlug(payload.title, blog._id);
  }

  if (payload.excerpt !== undefined) blog.excerpt = payload.excerpt;
  if (payload.content !== undefined) blog.content = sanitizeHtml(payload.content);
  if (payload.coverImage !== undefined) blog.coverImage = payload.coverImage;
  if (payload.seoTitle !== undefined) blog.seoTitle = payload.seoTitle;
  if (payload.seoDescription !== undefined) {
    blog.seoDescription = payload.seoDescription;
  }

  await blog.save();

  return blog;
};

const publishBlog = async (blogId) => {
  const blog = await getBlogByIdAdmin(blogId);

  blog.isPublished = true;
  blog.publishedAt = blog.publishedAt || new Date();

  await blog.save();

  return blog;
};

const unpublishBlog = async (blogId) => {
  const blog = await getBlogByIdAdmin(blogId);

  blog.isPublished = false;
  await blog.save();

  return blog;
};

const deleteBlog = async (blogId) => {
  const blog = await getBlogByIdAdmin(blogId);
  await blog.deleteOne();
  return true;
};

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