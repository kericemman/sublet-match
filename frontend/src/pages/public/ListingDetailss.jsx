import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicListingById } from "../../api/listing.service";
import Loader from "../../components/common/Loader";
import InquiryForm from "../../components/inquiries/InquiryForm";

const ListingDetailsPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getPublicListingById(id);
      const data = response.data;

      setListing(data);
      setActiveImage(data?.images?.[0]?.url || "");
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to load listing details."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCallClick = () => {
    setShowPhone(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader text="Loading listing details..." />
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#242B38] mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The property listing you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/listings"
            className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse Other Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-[#3BC0E9] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/listings" className="text-gray-600 hover:text-[#3BC0E9] transition-colors">
                Listings
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-[#242B38] font-medium truncate max-w-xs">
              {listing.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Left Column - Details */}
          <div>
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-[16/10] bg-gray-100">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing?.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-3 p-4 border-t border-gray-100">
                  {listing.images.map((image, index) => (
                    <button
                      key={image.publicId || index}
                      onClick={() => setActiveImage(image.url)}
                      className={`overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === image.url
                          ? "border-[#3BC0E9]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${listing.title} - ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#242B38]">
                    {listing.title}
                  </h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <svg className="w-5 h-5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{listing.location || listing.city || "Location not specified"}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-[#3BC0E9]">
                    {listing.currency || "$"} {listing.price}
                    <span className="text-sm font-normal text-gray-500 ml-1">/month</span>
                  </p>
                  {listing.availabilityDate && (
                    <p className="mt-1 text-sm text-gray-500">
                      Available {new Date(listing.availabilityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  listing.listedBy === "landlord" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {listing.listedBy === "landlord" ? "Posted by Landlord" : "Private Lister"}
                </span>

                {listing.propertyType && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 capitalize">
                    {listing.propertyType.replace(/_/g, ' ')}
                  </span>
                )}

                {listing.lifestyleTags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-[#242B38]">Description</h2>
                <p className="mt-3 whitespace-pre-line text-gray-700 leading-relaxed">
                  {listing.description || "No description provided."}
                </p>
              </div>

              {/* Additional Details */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-[#242B38]">Additional Details</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.bedrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-gray-700">{listing.bedrooms} Bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-gray-700">{listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.squareFeet && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-700">{listing.squareFeet} sq ft</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Inquiry */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Call Lister Button */}
              {listing.phone && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h4 className="font-medium text-[#242B38] mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Quick Contact
                  </h4>
                  
                  {!showPhone ? (
                    <div>
                      <button
                        onClick={handleCallClick}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Lister
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Click to reveal phone number
                      </p>
                    </div>
                  ) : (
                    <div>
                      <a
                        href={`tel:${listing.phone}`}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {listing.phone}
                      </a>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Tap number to call
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your number is only shared when you call
                    </p>
                  </div>
                </div>
              )}

              {/* Inquiry Form */}
              <InquiryForm listingId={listing._id} />

              {/* Safety Tips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h4 className="font-medium text-[#242B38] mb-3 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Safety Tips
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#3BC0E9] mr-2">•</span>
                    Always verify the lister's identity
                  </li>
                  <li className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#3BC0E9] mr-2">•</span>
                    Schedule in-person or virtual tours
                  </li>
                  <li className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#3BC0E9] mr-2">•</span>
                    Never send money without a contract
                  </li>
                  <li className="text-sm text-gray-600 flex items-start">
                    <span className="text-[#3BC0E9] mr-2">•</span>
                    Use secure payment methods
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;