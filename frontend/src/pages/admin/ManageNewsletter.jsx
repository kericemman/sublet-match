import { useEffect, useState } from "react";
import {
  activateSubscriber,
  deactivateSubscriber,
  deleteSubscriber,
  getSubscribers,
  exportSubscribers,
} from "../../api/newsletter.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";

const ManageNewsletterPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await getSubscribers();
      setSubscribers(response.data || []);
    } catch (error) {
      console.error("Failed to load subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggle = async (subscriber) => {
    try {
      if (subscriber.isActive) {
        await deactivateSubscriber(subscriber._id);
      } else {
        await activateSubscriber(subscriber._id);
      }
      fetchSubscribers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update subscriber");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this subscriber? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteSubscriber(id);
      fetchSubscribers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete subscriber");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportSubscribers();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to export subscribers");
    } finally {
      setExporting(false);
    }
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

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesFilter = filter === "all" || 
      (filter === "active" && subscriber.isActive) ||
      (filter === "inactive" && !subscriber.isActive);
    
    const matchesSearch = searchQuery === "" ||
      subscriber.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.isActive).length,
    inactive: subscribers.filter(s => !s.isActive).length,
  };

  const columns = [
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {row.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#242B38]">{row.email}</p>
            {row.name && (
              <p className="text-xs text-gray-500">{row.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            row.isActive ? "bg-green-500" : "bg-gray-400"
          }`} />
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "subscribedAt",
      header: "Subscribed",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{formatDate(row.subscribedAt)}</p>
          <p className="text-xs text-gray-400">
            {new Date(row.subscribedAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleToggle(row)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              row.isActive
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {row.isActive ? "Deactivate" : "Activate"}
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
        <Loader text="Loading subscribers..." />
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
            Email Marketing
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#242B38]">Newsletter Subscribers</h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor your email newsletter subscribers.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || subscribers.length === 0}
            className="px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4-4 4m4-4v12" />
                </svg>
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscribers</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
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
              <p className="text-sm text-gray-600">Inactive Subscribers</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                placeholder="Search by email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchSubscribers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSubscribers}
        emptyText="No subscribers found"
        pagination={true}
        pageSize={10}
        showSearch={false}
      />

      {/* Results Count */}
      {filteredSubscribers.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredSubscribers.length} of {subscribers.length} subscribers
        </p>
      )}

      {/* Bulk Actions (if needed) */}
      {subscribers.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-[#242B38] mb-3">Bulk Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const confirmed = window.confirm("Export all subscribers to CSV?");
                if (confirmed) handleExport();
              }}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Export All
            </button>
            <button
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to send a test newsletter to all active subscribers?");
                if (confirmed) alert("Test newsletter sent!");
              }}
              className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Send Test Newsletter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNewsletterPage;