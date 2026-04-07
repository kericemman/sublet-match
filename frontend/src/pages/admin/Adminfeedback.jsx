import { useEffect, useState } from "react";
import {
  getAdminFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from "../../api/feedback.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";

const ManageFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewed: 0,
    avgRating: 0,
  });

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await getAdminFeedback();
      const data = response.data || [];
      setFeedback(data);
      
      // Calculate stats
      const newCount = data.filter(f => f.status === 'new').length;
      const reviewedCount = data.filter(f => f.status === 'reviewed').length;
      const avgRating = data.length > 0 
        ? (data.reduce((sum, f) => sum + f.rating, 0) / data.length).toFixed(1)
        : 0;
      
      setStats({
        total: data.length,
        new: newCount,
        reviewed: reviewedCount,
        avgRating: avgRating,
      });
    } catch (error) {
      console.error("Failed to load feedback", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateFeedbackStatus(id, { status });
      fetchFeedback();
      if (selectedFeedback?._id === id) {
        setSelectedFeedback({ ...selectedFeedback, status });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update feedback status");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteFeedback(id);
      fetchFeedback();
      if (selectedFeedback?._id === id) {
        setSelectedFeedback(null);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete feedback");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'bg-yellow-100 text-yellow-800', label: 'New' },
      'reviewed': { color: 'bg-green-100 text-green-800', label: 'Reviewed' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'new' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  const getExperienceTypeBadge = (type) => {
    const typeConfig = {
      'general': { color: 'bg-blue-100 text-blue-800', label: 'General', icon: '💬' },
      'trust': { color: 'bg-purple-100 text-purple-800', label: 'Trust/Safety', icon: '🛡️' },
      'usability': { color: 'bg-emerald-100 text-emerald-800', label: 'Usability', icon: '🎯' },
      'bug_report': { color: 'bg-red-100 text-red-800', label: 'Bug Report', icon: '🐛' },
      'suggestion': { color: 'bg-amber-100 text-amber-800', label: 'Suggestion', icon: '💡' },
      'other': { color: 'bg-gray-100 text-gray-800', label: 'Other', icon: '📝' },
    };
    
    const config = typeConfig[type] || typeConfig.general;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const columns = [
    {
      key: "user",
      header: "User",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {row.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#242B38]">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (row) => getRatingStars(row.rating),
    },
    {
      key: "experienceType",
      header: "Type",
      sortable: true,
      render: (row) => getExperienceTypeBadge(row.experienceType),
    },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <p className="max-w-xs whitespace-pre-line text-sm text-gray-700 line-clamp-2">
          {row.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{formatDate(row.createdAt)}</p>
          <p className="text-xs text-gray-400">
            {new Date(row.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          >
            <option value="new">Mark New</option>
            <option value="reviewed">Mark Reviewed</option>
          </select>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Detailed View Modal
  if (selectedFeedback) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-xl font-semibold text-[#242B38]">Feedback Details</h3>
            <button
              onClick={() => setSelectedFeedback(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {selectedFeedback.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38]">{selectedFeedback.name}</h4>
                <a href={`mailto:${selectedFeedback.email}`} className="text-sm text-[#3BC0E9] hover:underline">
                  {selectedFeedback.email}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Rating</p>
                {getRatingStars(selectedFeedback.rating)}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Type</p>
                {getExperienceTypeBadge(selectedFeedback.experienceType)}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#242B38] mb-1">Message</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{selectedFeedback.message}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <select
                value={selectedFeedback.status}
                onChange={(e) => {
                  handleStatusChange(selectedFeedback._id, e.target.value);
                  setSelectedFeedback({ ...selectedFeedback, status: e.target.value });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              >
                <option value="new">Mark as New</option>
                <option value="reviewed">Mark as Reviewed</option>
              </select>
              <button
                onClick={() => handleDelete(selectedFeedback._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading feedback..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            User Feedback
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Feedback</h1>
        <p className="mt-2 text-gray-600">
          Review overall SubletMatch experience feedback from users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.new}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-green-600">{stats.reviewed}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <button
            onClick={fetchFeedback}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredFeedback}
        emptyText="No feedback found"
        pagination={true}
        pageSize={10}
        showSearch={false}
        onRowClick={(row) => setSelectedFeedback(row)}
      />

      {/* Results Count */}
      {filteredFeedback.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredFeedback.length} of {feedback.length} feedback entries
        </p>
      )}
    </div>
  );
};

export default ManageFeedbackPage;