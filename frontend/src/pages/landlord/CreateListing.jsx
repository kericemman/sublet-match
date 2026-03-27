import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../api/listing.service";
import ListingForm from "../../components/listings/ListingForm";

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCreateListing = async (values) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createListing(values);
      setSuccess(true);
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        navigate("/landlord/listings", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Failed to create listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            New Listing
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Create New Listing</h1>
        <p className="mt-2 text-gray-600">
          Add a property to start receiving inquiries from potential renters. 
          Your listing will be reviewed by our team before going live.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800">Listing created successfully!</p>
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
            <p className="text-sm font-medium text-blue-800">Tips for a successful listing</p>
            <ul className="mt-2 text-xs text-blue-700 space-y-1">
              <li>• Add high-quality photos to attract more renters</li>
              <li>• Be specific about location, amenities, and house rules</li>
              <li>• Set a competitive price based on similar listings in your area</li>
              <li>• Include availability dates to help renters plan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
          <h2 className="text-lg font-semibold text-[#242B38]">Listing Information</h2>
          <p className="text-sm text-gray-500 mt-1">Fill out all required fields to create your listing</p>
        </div>
        <div className="p-6">
          <ListingForm
            onSubmit={handleCreateListing}
            submitText="Create Listing"
            loading={loading}
          />
        </div>
      </div>

      {/* Preview Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By creating a listing, you agree to our{' '}
          <a href="/terms" className="text-[#3BC0E9] hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-[#3BC0E9] hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default CreateListing;