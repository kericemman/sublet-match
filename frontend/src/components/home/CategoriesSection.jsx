import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicListings } from "../../api/listing.service";

const CategorySection = ({ title, icon, filter, bgColor }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryListings = async () => {
      try {
        setLoading(true);
        const params = { ...filter, limit: 4, sort: "newest" };
        const response = await getPublicListings(params);
        setListings(response.data.listings || []);
      } catch (err) {
        console.error("Failed to fetch category listings", err);
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryListings();
  }, [filter]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden ${bgColor || 'bg-white'}`}>
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3BC0E9]/10 flex items-center justify-center">
              {icon}
            </div>
            <h2 className="text-lg font-semibold text-[#242B38]">{title}</h2>
          </div>
          <Link
            to={`/listings?${new URLSearchParams(filter).toString()}`}
            className="text-sm text-[#3BC0E9] hover:underline flex items-center gap-1"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/listings/${listing._id}`}
              className="group block"
            >
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                {listing.images?.[0]?.url ? (
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 bg-[#3BC0E9] text-white text-xs font-medium rounded">
                    {formatPrice(listing.price)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium text-[#242B38] group-hover:text-[#3BC0E9] transition-colors line-clamp-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{listing.city || listing.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoriesSection = ({ quickFilters }) => {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [selectedCity, setSelectedCity] = useState(null);

  const categories = [
    {
      id: "popular",
      label: "🔥 Popular",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      filter: { sort: "popular", limit: 4 },
      bgColor: "bg-white",
    },
    {
      id: "recent",
      label: "🆕 New Listings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      filter: { sort: "newest", limit: 4 },
      bgColor: "bg-white",
    },
    {
      id: "affordable",
      label: "💰 Affordable",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      filter: { maxPrice: 1500, sort: "price-low", limit: 4 },
      bgColor: "bg-white",
    },
    {
      id: "luxury",
      label: "✨ Luxury",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      filter: { minPrice: 3000, sort: "price-high", limit: 4 },
      bgColor: "bg-white",
    },
  ];

  



  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              Explore by Category
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#242B38] mb-2">
            Find Your Perfect Match
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse listings curated by category to find exactly what you're looking for
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
          
        </div>

        {/* Category Content */}
        {activeCategory !== "cities" ? (
          <CategorySection
            key={activeCategory}
            title={categories.find(c => c.id === activeCategory)?.label}
            icon={categories.find(c => c.id === activeCategory)?.icon}
            filter={categories.find(c => c.id === activeCategory)?.filter}
            bgColor={categories.find(c => c.id === activeCategory)?.bgColor}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityFilters.map((city) => (
              <CategorySection
                key={city.id}
                title={city.label}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                filter={city.filter}
                bgColor="bg-white"
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            to="/listings"
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#3BC0E9] text-[#3BC0E9] rounded-lg font-medium hover:bg-[#3BC0E9] hover:text-white transition-all duration-300"
          >
            <span>Browse All Listings</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;