import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicListings } from "../../api/listing.service";

const Hero = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicListings({
          limit: 4,
          sort: "newest"
        });
        const allListings = response.data.listings || [];
        setListings(allListings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#242B38] to-[#1a1f28]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#95BDCB] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Mobile: Listings First, Content Second */}
        {/* Desktop: Content First, Listings Second */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Right Column - Featured Listings (Shows first on mobile) */}
          <div className="order-first lg:order-last mt-0 lg:mt-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Latest Listings</h3>
                <Link 
                  to="/listings" 
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  View all →
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/10 rounded-lg overflow-hidden animate-pulse">
                      <div className="h-28 sm:h-32 bg-white/5"></div>
                      <div className="p-2">
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-white/10 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60 text-sm">No listings available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {listings.map((listing) => (
                    <Link
                      key={listing._id}
                      to={`/listings/${listing._id}`}
                      className="group bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative h-28 sm:h-32 overflow-hidden">
                        {listing.images?.[0]?.url ? (
                          <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <span className="px-1.5 py-0.5 bg-[#3BC0E9] text-white text-xs font-medium rounded">
                            {formatPrice(listing.price)}
                          </span>
                        </div>
                        {listing.status === 'approved' && (
                          <div className="absolute top-1 left-1">
                            <span className="px-1.5 py-0.5 bg-green-500/80 backdrop-blur-sm text-white text-[10px] font-medium rounded">
                              ✓ Verified
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="text-xs font-medium text-white line-clamp-1 mb-0.5">
                          {listing.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/70">
                            {listing.location || listing.city || "Location"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Left Column - Content (Shows second on mobile) */}
          <div className="order-last lg:order-first text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
              <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                Join Us Today
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl text-start md:text-start lg:text-start lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
                Short-Term Home
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-start text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Built for interns and young professionals moving to NYC. Find short-term housing without hustle. Choose from a variety of listings and book your stay in minutes.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2">
              <div>
                <p className="text-xs text-white/60">Verified Properties</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Happy Renters</p>
              </div>
              <div>
                <p className="text-xs text-white/60">New York</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/listings"
                className="group relative px-8 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#3BC0E9]/20 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Browse Listings
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/register"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg font-medium hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                Post Apartment Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      

      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;