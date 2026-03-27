import { useState } from "react";

const ListingFilters = ({ filters, onChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const activeFilterCount = Object.values(filters).filter(value => 
    value !== "" && value !== null && value !== undefined
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      target: {
        name,
        value: value === "" ? "" : value
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#3BC0E9]/5 to-[#95BDCB]/5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-[#3BC0E9] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="font-medium text-[#242B38]">Filter Listings</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#3BC0E9] text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-500 hover:text-[#3BC0E9] transition-colors flex items-center lg:hidden"
        >
          <span>{showAdvanced ? "Hide filters" : "Show filters"}</span>
          <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`p-5 ${showAdvanced ? 'block' : 'hidden lg:block'}`}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Location */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="location"
                value={filters.location || ""}
                onChange={handleInputChange}
                placeholder="e.g. Brooklyn"
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property Type
            </label>
            <select
              name="propertyType"
              value={filters.propertyType || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="shared_room">Shared Room</option>
              <option value="private_room">Private Room</option>
              <option value="house">House</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Listed By */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listed By
            </label>
            <select
              name="listedBy"
              value={filters.listedBy || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
            >
              <option value="">All</option>
              <option value="landlord">Landlord</option>
              <option value="private_lister">Private Lister</option>
            </select>
          </div>

          {/* Lifestyle Tag */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lifestyle Tag
            </label>
            <select
              name="lifestyleTag"
              value={filters.lifestyleTag || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
            >
              <option value="">All</option>
              <option value="sober">Sober</option>
              <option value="bipoc">BIPOC</option>
              <option value="lgbtq_friendly">LGBTQ+ Friendly</option>
              <option value="students">Students</option>
              <option value="professionals">Professionals</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">$</span>
              </div>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice || ""}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
              />
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">$</span>
              </div>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice || ""}
                onChange={handleInputChange}
                placeholder="5000"
                min="0"
                className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm outline-none focus:border-[#3BC0E9] focus:ring-1 focus:ring-[#3BC0E9] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {filters.location && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30 flex items-center">
                  <span className="mr-1">📍</span>
                  {filters.location}
                </span>
              )}
              {filters.propertyType && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30">
                  {filters.propertyType.replace(/_/g, ' ')}
                </span>
              )}
              {filters.listedBy && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30">
                  {filters.listedBy === "landlord" ? "Landlord" : "Private Lister"}
                </span>
              )}
              {filters.lifestyleTag && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30">
                  {filters.lifestyleTag.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
              {filters.minPrice && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30">
                  Min: ${filters.minPrice}
                </span>
              )}
              {filters.maxPrice && (
                <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full border border-[#3BC0E9]/30">
                  Max: ${filters.maxPrice}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-[#3BC0E9] transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all
            </button>
          )}
          <button
            onClick={() => {
              // Trigger search with current filters
              const event = new CustomEvent('search', { detail: filters });
              window.dispatchEvent(event);
            }}
            className="px-5 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white text-sm font-medium rounded-lg hover:shadow-md transition-all flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Mobile Quick Filters */}
      <div className="lg:hidden border-t border-gray-100 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {filters.location && (
            <span className="px-2 py-1 bg-[#3BC0E9]/10 text-[#3BC0E9] text-xs rounded-full">
              📍 {filters.location}
            </span>
          )}
          {filters.propertyType && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {filters.propertyType.replace(/_/g, ' ')}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="px-2 py-1 text-xs text-gray-500 hover:text-red-500"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;