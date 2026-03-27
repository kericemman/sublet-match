import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublishedBlogBySlug } from "../../api/blog.service";
import Loader from "../../components/common/Loader";
import NewsletterSignup from "../../components/home/NewsletterSignup";

const BlogDetailsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setServerError("");

        const response = await getPublishedBlogBySlug(slug);
        setBlog(response.data);
        
        // Fetch related posts if category exists
        if (response.data.category) {
          try {
            const relatedResponse = await getPublishedBlogs({ 
              category: response.data.category,
              limit: 3,
              exclude: response.data._id
            });
            setRelatedPosts(relatedResponse.data.blogs || []);
          } catch (err) {
            console.error("Failed to fetch related posts", err);
          }
        }
      } catch (error) {
        setServerError(
          error?.response?.data?.message || "Failed to load blog post."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "3 min read";
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading blog post..." />
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-[#3BC0E9] hover:underline"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-12 border-b border-[#95BDCB]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-medium text-[#3BC0E9] hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
          
          <div className="text-center">
            {blog.category && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2"></span>
                <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                  {blog.category.replace(/-/g, ' ')}
                </span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#242B38] mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span>•</span>
              <span>{calculateReadTime(blog.content)}</span>
              {blog.author && (
                <>
                  <span>•</span>
                  <span>By {blog.author.fullName || blog.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          {blog?.coverImage?.url ? (
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none prose-headings:text-[#242B38] prose-a:text-[#3BC0E9] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md">
              {blog.content ? (
                <div 
                  className="blog-content text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </div>
          </div>

          {/* Author Section */}
          {blog.author && (
            <div className="p-6 md:p-8 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {blog.author.fullName?.charAt(0).toUpperCase() || blog.author?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#242B38]">
                    {blog.author.fullName || blog.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {blog.author.bio || "Content contributor at SubletMatch"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Share Section */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-[#242B38] mb-4">Share this article</h3>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="p-2 bg-gray-100 hover:bg-[#3BC0E9]/10 rounded-lg transition-colors"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`, '_blank')}
              className="p-2 bg-gray-100 hover:bg-[#3BC0E9]/10 rounded-lg transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
              className="p-2 bg-gray-100 hover:bg-[#3BC0E9]/10 rounded-lg transition-colors"
              aria-label="Copy link"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#242B38] mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#3BC0E9] transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {post?.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </p>
                    <h3 className="font-semibold text-[#242B38] group-hover:text-[#3BC0E9] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12">
          <NewsletterSignup
            title="Want more content like this?"
            description="Subscribe and get updates when new blog posts go live."
          />
        </div>
      </div>

      {/* Custom styles for blog content */}
      <style jsx global>{`
        .blog-content {
          font-size: 1.125rem;
          line-height: 1.75;
        }
        .blog-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #242B38;
        }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #242B38;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #242B38;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
        }
        .blog-content a {
          color: #3BC0E9;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #2a9bd6;
        }
        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
        .blog-content blockquote {
          border-left: 4px solid #3BC0E9;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #4b5563;
          font-style: italic;
        }
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .blog-content pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        .blog-content hr {
          margin: 2rem 0;
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailsPage;