import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../../api/blog.service";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import NewsletterSignup from "../../components/home/NewsletterSignup";

const BlogPage = () => {
    useEffect(() => {
            window.scrollTo(0, 0);
        }, []);
        
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const fetchBlogs = async (params = {}) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getPublishedBlogs(params);
      setBlogs(response.data.blogs || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs({ search, category: selectedCategory !== "all" ? selectedCategory : undefined });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchBlogs({ search, category: category !== "all" ? category : undefined });
  };

  const categories = [
    { id: "all", label: "All Posts", icon: "📚" },
    { id: "housing-tips", label: "Housing Tips", icon: "🏠" },
    { id: "market-updates", label: "Market Updates", icon: "📈" },
    { id: "landlord-guides", label: "Landlord Guides", icon: "👔" },
    { id: "renter-advice", label: "Renter Advice", icon: "🔑" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading blog posts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-16 border-b border-[#95BDCB]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              Insights & Updates
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#242B38] mb-4">
            The{' '}
            <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
              SubletMatch
            </span>{' '}
            Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, guides, and useful content around short-term housing and better listing decisions.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blog posts..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all"
            >
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" 
                    ? "bg-[#3BC0E9] text-white" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" 
                    ? "bg-[#3BC0E9] text-white" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-8">
            {serverError}
          </div>
        )}

        {/* Blog Posts */}
        {blogs.length === 0 && !serverError ? (
          <EmptyState
            title="No blog posts found"
            description={search ? "Try adjusting your search terms." : "There are no published blog posts yet."}
          />
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#3BC0E9] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {blog?.coverImage?.url ? (
                        <img
                          src={blog.coverImage.url}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {blog.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                            {blog.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>
                      <h2 className="text-xl font-semibold text-[#242B38] group-hover:text-[#3BC0E9] transition-colors line-clamp-2 mb-2">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {blog.excerpt}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm font-medium text-[#3BC0E9] hover:translate-x-1 transition-transform"
                      >
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                  >
                    {/* Image */}
                    <div className="md:w-1/3 aspect-[16/10] overflow-hidden bg-gray-100">
                      {blog?.coverImage?.url ? (
                        <img
                          src={blog.coverImage.url}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 md:flex-1">
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>
                      <h2 className="text-xl font-semibold text-[#242B38] group-hover:text-[#3BC0E9] transition-colors mb-2">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm font-medium text-[#3BC0E9] hover:translate-x-1 transition-transform"
                      >
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchBlogs({ page: pagination.page - 1, search, category: selectedCategory !== "all" ? selectedCategory : undefined })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchBlogs({ page: pagination.page + 1, search, category: selectedCategory !== "all" ? selectedCategory : undefined })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12">
          <NewsletterSignup
            title="Get new housing insights in your inbox"
            description="Subscribe for practical updates, platform news, and helpful articles."
          />
        </div>

        <Link
          to="/feedback"
          className="mt-12 inline-flex items-center text-sm font-medium text-[#3BC0E9] hover:translate-x-1 transition-transform"
        >
          Share your feedback
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogPage;