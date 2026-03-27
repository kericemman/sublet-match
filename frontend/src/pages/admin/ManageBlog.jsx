// src/pages/admin/ManageBlogsPage.jsx
import { useEffect, useState } from "react";
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  publishBlog,
  unpublishBlog,
  updateBlog,
} from "../../api/blog.service";
import { uploadSingleImage } from "../../api/upload.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import BlogForm from "../../components/admin/BlogForm";

const ManageBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAdminBlogs();
      setBlogs(response.data || []);
    } catch (error) {
      console.error("Failed to load blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (blogData) => {
    try {
      setSubmitting(true);

      let coverImageUrl = null;
      if (blogData.coverImage) {
        const uploadResponse = await uploadSingleImage(
          blogData.coverImage,
          "subletmatch/blogs"
        );
        coverImageUrl = uploadResponse.data;
      }

      await createBlog({
        ...blogData,
        coverImage: coverImageUrl,
      });

      setShowForm(false);
      fetchBlogs();
      alert("Blog created successfully!");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBlog = async (blogData) => {
    try {
      setSubmitting(true);

      let coverImageUrl = editingBlog.coverImage;
      if (blogData.coverImage && blogData.coverImage instanceof File) {
        const uploadResponse = await uploadSingleImage(
          blogData.coverImage,
          "subletmatch/blogs"
        );
        coverImageUrl = uploadResponse.data;
      }

      await updateBlog(editingBlog._id, {
        ...blogData,
        coverImage: coverImageUrl,
      });

      setEditingBlog(null);
      setShowForm(false);
      fetchBlogs();
      alert("Blog updated successfully!");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingBlog(null);
    setShowForm(false);
  };

  const handlePublishToggle = async (blog) => {
    try {
      if (blog.isPublished) {
        await unpublishBlog(blog._id);
      } else {
        await publishBlog(blog._id);
      }
      fetchBlogs();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update blog");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!confirmed) return;

    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete blog");
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div>
          <p className="font-medium text-[#242B38]">{row.title}</p>
          <p className="text-xs text-gray-500">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "coverImage",
      header: "Image",
      render: (row) => (
        row.coverImage ? (
          <img src={row.coverImage} alt={row.title} className="w-12 h-12 object-cover rounded" />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (row) => row?.author?.fullName || "Admin",
    },
    {
      key: "isPublished",
      header: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {row.isPublished ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "views",
      header: "Views",
      render: (row) => row.views || 0,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handlePublishToggle(row)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              row.isPublished
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {row.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading blogs..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            Content Management
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#242B38]">Manage Blogs</h1>
            <p className="mt-2 text-gray-600">
              Create, edit, and manage blog content with rich text formatting.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Blog
            </button>
          )}
        </div>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
            <h2 className="text-xl font-semibold text-[#242B38]">
              {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editingBlog 
                ? "Update your blog content and settings" 
                : "Fill out the form below to create a new blog post"}
            </p>
          </div>
          <div className="p-6">
            <BlogForm
              initialData={editingBlog}
              onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
              isSubmitting={submitting}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Blogs Table */}
      <div>
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">All Blog Posts</h2>
        <DataTable
          columns={columns}
          data={blogs}
          emptyText="No blog posts found"
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default ManageBlogsPage;