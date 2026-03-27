import { useEffect, useState } from "react";
import { getPublicListings } from "../../api/listing.service";
import ListingCard from "../../components/listings/ListingCard";
import ListingFilters from "../../components/listings/ListingFilter";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const defaultFilters = {
  location: "",
  propertyType: "",
  listedBy: "",
  lifestyleTag: "",
  minPrice: "",
  maxPrice: "",
};

const ListingsPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [filters, setFilters] = useState(defaultFilters);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const fetchListings = async (params = {}) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getPublicListings({
        ...params,
        sort: sortBy,
        limit: 12
      });
      setListings(response.data.listings || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to load listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(filters);
  }, [sortBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    
    // Update active filter count
    const activeFilters = Object.values(updated).filter(v => v !== "" && v !== null && v !== undefined);
    setActiveFilterCount(activeFilters.length);
  };

  const handleApplyFilters = () => {
    fetchListings(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setActiveFilterCount(0);
    fetchListings(defaultFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-12 border-b border-[#95BDCB]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
              <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                Find Your Home
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#242B38] mb-4">
              Browse{' '}
              <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
                Listings
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find short-term spaces that match your location, budget, and lifestyle preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Filters Section */}
        <div className="mb-6">
          <ListingFilters
            filters={filters}
            onChange={handleChange}
            onReset={handleReset}
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#3BC0E9]">{listings.length}</span> properties found
            </p>
            {activeFilterCount > 0 && (
              <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Sort by:</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid" 
                    ? "bg-[#3BC0E9] text-white" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list" 
                    ? "bg-[#3BC0E9] text-white" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader text="Loading listings..." />
          </div>
        ) : serverError ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : listings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No listings found"
              description="Try changing your filters or check back later."
              action={{
                label: "Clear all filters",
                onClick: handleReset
              }}
            />
          </div>
        ) : (
          <>
            <div className={`mt-6 ${
              viewMode === "grid" 
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-4"
            }`}>
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {pagination.page} of {pagination.pages} pages
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchListings({ ...filters, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchListings({ ...filters, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;