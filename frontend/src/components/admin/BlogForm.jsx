// src/components/admin/BlogForm.jsx
import { useState, useEffect } from "react";
import RichTextEditor from "./RichText";

const BlogForm = ({ 
  initialData = null, 
  onSubmit, 
  isSubmitting = false,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        seoTitle: initialData.seoTitle || "",
        seoDescription: initialData.seoDescription || "",
      });
      setContent(initialData.content || "");
      if (initialData.coverImage) {
        setCoverImagePreview(initialData.coverImage);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (!coverImage && !initialData?.coverImage) newErrors.coverImage = "Cover image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSubmit({
      ...formData,
      content,
      coverImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt *
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief summary of the blog post"
          rows="3"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent ${
            errors.excerpt ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
        <p className="mt-1 text-xs text-gray-500">
          This will appear in blog listings and search results
        </p>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          error={errors.content}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image *
        </label>
        <div className="flex items-center gap-4">
          {coverImagePreview && (
            <div className="relative">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3BC0E9]/10 file:text-[#3BC0E9] hover:file:bg-[#3BC0E9]/20 ${
                errors.coverImage ? 'border-red-300' : ''
              }`}
            />
            {!initialData && !coverImage && (
              <p className="mt-1 text-xs text-gray-500">
                Upload a cover image for the blog post (JPG, PNG, GIF up to 5MB)
              </p>
            )}
          </div>
        </div>
        {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
      </div>

      {/* SEO Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-[#242B38] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          SEO Settings
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            placeholder="SEO Title (optional)"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to use the blog title. Recommended: 50-60 characters
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Description
          </label>
          <textarea
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleChange}
            placeholder="SEO Description (optional)"
            rows="2"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Recommended: 150-160 characters for search results
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Blog" : "Create Blog"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BlogForm;