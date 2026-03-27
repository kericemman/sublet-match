import { useEffect, useState } from "react";
import {
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../../api/inquiry.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import { Link } from "react-router-dom";

const ManageInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await getAdminInquiries();
      setInquiries(response.data || []);
    } catch (error) {
      console.error("Failed to load inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, { status });
      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update inquiry");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inquiry? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteInquiry(id);
      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete inquiry");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'bg-blue-100 text-blue-800', label: 'New' },
      'read': { color: 'bg-gray-100 text-gray-800', label: 'Read' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
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

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesFilter = filter === "all" || inquiry.status === filter;
    const matchesSearch = searchQuery === "" ||
      inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
  };

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
            {row.phone && <p className="text-xs text-gray-500">📞 {row.phone}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "listing",
      header: "Listing",
      sortable: true,
      render: (row) => (
        <div>
          {row.listing ? (
            <Link 
              to={`/listings/${row.listing._id}`}
              target="_blank"
              className="text-[#3BC0E9] hover:underline"
            >
              {row.listing.title}
            </Link>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
          <p className="text-xs text-gray-500">{row.listing?.location || row.listing?.city || ""}</p>
        </div>
      ),
    },
    {
      key: "landlord",
      header: "Landlord",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-[#242B38]">{row.landlord?.fullName || row.lister?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">{row.landlord?.email || row.lister?.email || ""}</p>
        </div>
      ),
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
          <p className="text-sm text-gray-600">{formatDate(row.createdAt)}</p>
          <p className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleTimeString()}</p>
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
            <option value="read">Mark Read</option>
            <option value="resolved">Mark Resolved</option>
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
  if (selectedInquiry) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-xl font-semibold text-[#242B38]">Inquiry Details</h3>
            <button
              onClick={() => setSelectedInquiry(null)}
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
                  {selectedInquiry.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38]">{selectedInquiry.name}</h4>
                <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-[#3BC0E9] hover:underline">
                  {selectedInquiry.email}
                </a>
                {selectedInquiry.phone && (
                  <p className="text-sm text-gray-600 mt-1">📞 {selectedInquiry.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Status</p>
                {getStatusBadge(selectedInquiry.status)}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Received</p>
                <p className="text-sm text-gray-700">{formatDate(selectedInquiry.createdAt)}</p>
              </div>
            </div>

            {selectedInquiry.listing && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-[#242B38] mb-2">About Listing</p>
                <Link 
                  to={`/listings/${selectedInquiry.listing._id}`}
                  target="_blank"
                  className="text-[#3BC0E9] hover:underline"
                >
                  {selectedInquiry.listing.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{selectedInquiry.listing.location || selectedInquiry.listing.city}</p>
                <p className="text-sm font-semibold text-[#3BC0E9] mt-1">${selectedInquiry.listing.price}/month</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-[#242B38] mb-2">Message</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{selectedInquiry.message}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry about ${selectedInquiry.listing?.title || 'SubletMatch'}`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg text-center hover:shadow-md transition-all"
              >
                Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selectedInquiry._id)}
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
        <Loader text="Loading inquiries..." />
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
            Admin
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Inquiries</h1>
        <p className="mt-2 text-gray-600">
          Track user inquiries and update their resolution status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-xs text-gray-500">New</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
          <p className="text-xs text-gray-500">Read</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-xs text-gray-500">Resolved</p>
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
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={fetchInquiries}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredInquiries}
        emptyText="No inquiries found"
        pagination={true}
        pageSize={10}
        showSearch={false}
        onRowClick={(row) => setSelectedInquiry(row)}
      />

      {/* Results Count */}
      {filteredInquiries.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredInquiries.length} of {inquiries.length} inquiries
        </p>
      )}
    </div>
  );
};

export default ManageInquiriesPage;