import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteListing, getMyListings } from "../../api/listing.service";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getMyListings();
      setListings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', label: 'Active', icon: '✓' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review', icon: '⏳' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: '✗' },
      'hidden': { color: 'bg-gray-100 text-gray-800', label: 'Hidden', icon: '👁' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: '📄' };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading your listings..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              Manage Properties
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#242B38]">My Listings</h1>
          <p className="mt-2 text-gray-600">
            Review, edit, and manage your property listings. 
            <span className="ml-1 font-medium text-[#3BC0E9]">{listings.length}</span> {listings.length === 1 ? 'listing' : 'listings'} total
          </p>
        </div>

        <Link
          to="/landlord/listings/create"
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Listing
        </Link>
      </div>

      {/* Stats Summary */}
      {listings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-2xl font-bold text-[#242B38]">{listings.filter(l => l.status === 'approved').length}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{listings.filter(l => l.status === 'pending').length}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{listings.filter(l => l.status === 'rejected').length}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <p className="text-2xl font-bold text-[#3BC0E9]">{listings.reduce((sum, l) => sum + (l.views || 0), 0)}</p>
            <p className="text-xs text-gray-500">Total Views</p>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {!listings.length ? (
        <EmptyState
          title="No listings yet"
          description="Create your first listing and it will go live after admin approval."
          action={{
            label: "Create Listing",
            to: "/landlord/listings/create"
          }}
        />
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {/* Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  {listing?.images?.[0]?.url ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[#242B38]">
                          {listing.title}
                        </h3>
                        {getStatusBadge(listing.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{listing.location || listing.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#3BC0E9]">
                        ${listing.price}<span className="text-sm font-normal text-gray-500">/month</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {formatDate(listing.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {listing.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {listing.propertyType && (
                      <span className="capitalize">🏠 {listing.propertyType.replace(/_/g, ' ')}</span>
                    )}
                    {listing.views !== undefined && (
                      <span>👁 {listing.views} views</span>
                    )}
                    {listing.inquiriesCount !== undefined && (
                      <span>💬 {listing.inquiriesCount} inquiries</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/listings/${listing._id}`}
                      target="_blank"
                      className="px-4 py-2 text-sm text-[#3BC0E9] border border-[#3BC0E9] rounded-lg hover:bg-[#3BC0E9]/5 transition-colors"
                    >
                      View Public
                    </Link>
                    <Link
                      to={`/landlord/listings/${listing._id}/edit`}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      disabled={deletingId === listing._id}
                      className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === listing._id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>

                  {/* Admin Note (if rejected) */}
                  {listing.status === 'rejected' && listing.adminNote && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-800">Feedback from admin:</p>
                      <p className="text-xs text-red-700 mt-1">{listing.adminNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;