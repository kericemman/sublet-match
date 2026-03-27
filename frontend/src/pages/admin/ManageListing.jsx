import { useEffect, useState } from "react";
import {
  deleteAdminListing,
  getAdminListings,
  hideListing,
  unhideListing,
  approveListing,
  rejectListing,
} from "../../api/admin.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import { Link } from "react-router-dom";

const ManageListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getAdminListings();
      setListings(response.data || []);
    } catch (error) {
      console.error("Failed to load listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleStatusToggle = async (listing) => {
    try {
      if (listing.status === "hidden") {
        await unhideListing(listing._id);
      } else {
        await hideListing(listing._id);
      }
      fetchListings();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update listing");
    }
  };

  const handleApprove = async (id) => {
    const confirmed = window.confirm("Are you sure you want to approve this listing?");
    if (!confirmed) return;

    try {
      await approveListing(id);
      fetchListings();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to approve listing");
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to reject this listing?");
    if (!confirmed) return;

    try {
      await rejectListing(id);
      fetchListings();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to reject listing");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this listing? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAdminListing(id);
      fetchListings();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete listing");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      'hidden': { color: 'bg-gray-100 text-gray-800', label: 'Hidden' },
      'deleted': { color: 'bg-gray-100 text-gray-500', label: 'Deleted' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredListings = listings.filter(listing => {
    const matchesFilter = filter === "all" || listing.status === filter;
    const matchesSearch = searchQuery === "" ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.landlord?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
    hidden: listings.filter(l => l.status === 'hidden').length,
  };

  const columns = [
    {
      key: "title",
      header: "Property",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0]?.url ? (
            <img 
              src={row.images[0].url} 
              alt={row.title}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-[#242B38]">{row.title}</p>
            <p className="text-xs text-gray-500">{row.location || row.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: "landlord",
      header: "Landlord",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-[#242B38]">{row.landlord?.fullName || row.owner?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">{row.landlord?.email || row.owner?.email || ""}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-[#3BC0E9]">
          ${row.price}<span className="text-xs text-gray-500">/month</span>
        </span>
      ),
    },
    {
      key: "listedBy",
      header: "Listed By",
      render: (row) => (
        <span className="capitalize">{row.listedBy?.replace(/_/g, ' ') || "N/A"}</span>
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
      header: "Created",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/listings/${row._id}`}
            target="_blank"
            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            View
          </Link>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row._id)}
                className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(row._id)}
                className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {row.status !== 'deleted' && row.status !== 'pending' && (
            <button
              onClick={() => handleStatusToggle(row)}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {row.status === "hidden" ? "Unhide" : "Hide"}
            </button>
          )}
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
        <Loader text="Loading listings..." />
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
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Listings</h1>
        <p className="mt-2 text-gray-600">
          Review, approve, hide, or remove listings across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-500">{stats.hidden}</p>
          <p className="text-xs text-gray-500">Hidden</p>
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
                placeholder="Search by title, location, or landlord..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>
          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredListings}
        emptyText="No listings found"
        pagination={true}
        pageSize={10}
        showSearch={false}
      />

      {/* Results Count */}
      {filteredListings.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredListings.length} of {listings.length} listings
        </p>
      )}
    </div>
  );
};

export default ManageListingsPage;