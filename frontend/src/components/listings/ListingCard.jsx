import { Link } from "react-router-dom";
import { useState } from "react";

const ListingCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);
  
  const image = !imageError && listing?.images?.[0]?.url 
    ? listing.images[0].url 
    : null;

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAvailabilityBadge = () => {
    if (!listing.availableFrom) return null;
    
    const startDate = new Date(listing.availableFrom);
    const now = new Date();
    const diffTime = startDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available Now</span>;
    } else if (diffDays <= 7) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Available in {diffDays} days</span>;
    } else {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        Available {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>;
    }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#3BC0E9] transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {listing.status === 'approved' && (
              <span className="px-2 py-1 bg-[#3BC0E9] text-white text-xs font-medium rounded-full shadow-sm">
                ✓ Verified
              </span>
            )}
            {listing.isFeatured && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full shadow-sm">
                ⚡ Featured
              </span>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[#3BC0E9] text-sm font-bold rounded-lg shadow-sm border border-gray-200">
              {formatPrice(listing.price, listing.currency)}
              <span className="text-xs font-normal text-gray-500 ml-1">/mo</span>
            </div>
          </div>

          {/* Availability Badge */}
          {listing.availableFrom && (
            <div className="absolute bottom-3 left-3">
              {getAvailabilityBadge()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title and Property Type */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-[#242B38] group-hover:text-[#3BC0E9] transition-colors line-clamp-2 flex-1 text-lg">
              {listing.title}
            </h3>
            {listing.propertyType && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 capitalize">
                {listing.propertyType.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <svg className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{listing.location || listing.city || "Location not specified"}</span>
          </div>

          {/* Tags */}
          {(listing.listedBy || listing.lifestyleTags?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.listedBy && (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  listing.listedBy === "landlord" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {listing.listedBy === "landlord" ? "Landlord" : "Private Lister"}
                </span>
              )}
              {listing.lifestyleTags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {listing.lifestyleTags?.length > 2 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                  +{listing.lifestyleTags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
             
            </div>
            
            <div className="flex items-center text-sm text-[#3BC0E9] font-medium group-hover:translate-x-1 transition-transform">
              <span className="text-xs">View Details</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;