import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getMyListingById, updateListing } from "../../api/listing.service";
import ListingForm from "../../components/listings/ListingForm";
import Loader from "../../components/common/Loader";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await getMyListingById(id);
      setListing(response.data);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to load listing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateListing = async (values) => {
    setSaving(true);
    setSuccess(false);

    try {
      await updateListing(id, values);
      setSuccess(true);
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        navigate("/landlord/listings", { replace: true });
      }, 2000);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to update listing. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', label: 'Active' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Needs Revision' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading listing details..." />
      </div>
    );
  }

  if (serverError && !listing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-red-700 mb-4">{serverError}</p>
          <Link
            to="/landlord/listings"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            Edit Listing
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#242B38]">Edit Listing</h1>
            <p className="mt-2 text-gray-600">
              Update your listing details to keep them accurate and appealing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            {getStatusBadge(listing.status)}
          </div>
        </div>
      </div>

      {/* Status Info (if pending or rejected) */}
      {(listing.status === 'pending' || listing.status === 'rejected') && (
        <div className={`mb-6 p-4 rounded-lg border ${
          listing.status === 'pending' 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 mr-3 mt-0.5 ${
              listing.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className={`text-sm font-medium ${
                listing.status === 'pending' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {listing.status === 'pending' 
                  ? 'This listing is pending review.' 
                  : 'This listing needs revision.'}
              </p>
              {listing.status === 'pending' ? (
                <p className="text-xs text-yellow-700 mt-1">
                  Your listing is currently being reviewed by our team. You can still edit it, 
                  but changes may affect the review process.
                </p>
              ) : listing.adminNote && (
                <p className="text-xs text-red-700 mt-1">
                  <span className="font-medium">Admin feedback:</span> {listing.adminNote}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800">Listing updated successfully!</p>
            <p className="text-xs text-green-700 mt-1">Redirecting to your listings...</p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Tips for updating your listing</p>
            <ul className="mt-2 text-xs text-blue-700 space-y-1">
              <li>• Add new photos to keep your listing fresh and appealing</li>
              <li>• Update availability dates to reflect current openings</li>
              <li>• Adjust pricing based on market trends if needed</li>
              <li>• Make sure your description highlights key features and amenities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
          <h2 className="text-lg font-semibold text-[#242B38]">Listing Information</h2>
          <p className="text-sm text-gray-500 mt-1">Update the fields below to modify your listing</p>
        </div>
        <div className="p-6">
          <ListingForm
            initialValues={listing}
            onSubmit={handleUpdateListing}
            submitText="Save Changes"
            loading={saving}
          />
        </div>
      </div>

      {/* Preview Link */}
      <div className="mt-6 flex justify-between items-center">
        <Link
          to={`/listings/${listing._id}`}
          target="_blank"
          className="text-sm text-[#3BC0E9] hover:underline flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview your listing
        </Link>
        <Link
          to="/landlord/listings"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel and go back
        </Link>
      </div>
    </div>
  );
};

export default EditListing;