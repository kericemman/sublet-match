import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuickFilters = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);

  const filters = [
    {
      id: "city",
      label: "City",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      options: ["New York", "San Francisco", "Los Angeles", "Chicago", "Boston", "Seattle"],
    },
    {
      id: "price",
      label: "Price",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      options: ["Under $1000", "$1000 - $2000", "$2000 - $3000", "Over $3000"],
    },
    {
      id: "propertyType",
      label: "Property Type",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      options: ["Apartment", "Studio", "Private Room", "Shared Room", "House"],
    },
    {
      id: "availability",
      label: "Availability",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      options: ["Available Now", "Next 7 Days", "Next 30 Days", "Flexible"],
    },
  ];

  const handleFilterClick = (filterId, value) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    
    if (value) {
      // Navigate to listings with filter
      const params = new URLSearchParams();
      if (filterId === "city") params.set("city", value);
      if (filterId === "price") {
        if (value === "Under $1000") params.set("maxPrice", "1000");
        else if (value === "$1000 - $2000") { params.set("minPrice", "1000"); params.set("maxPrice", "2000"); }
        else if (value === "$2000 - $3000") { params.set("minPrice", "2000"); params.set("maxPrice", "3000"); }
        else if (value === "Over $3000") params.set("minPrice", "3000");
      }
      if (filterId === "propertyType") params.set("propertyType", value.toLowerCase().replace(" ", "_"));
      if (filterId === "availability") {
        if (value === "Available Now") params.set("availableNow", "true");
        else if (value === "Next 7 Days") params.set("availableIn", "7");
        else if (value === "Next 30 Days") params.set("availableIn", "30");
      }
      navigate(`/listings?${params.toString()}`);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-[#242B38]">Quick Filters</h2>
          <p className="text-sm text-gray-500">Find your perfect place faster</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {filters.map((filter) => (
            <div key={filter.id} className="relative">
              <button
                onClick={() => handleFilterClick(filter.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "bg-[#3BC0E9] border-[#3BC0E9] text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[#3BC0E9] hover:text-[#3BC0E9]"
                }`}
              >
                <span className={activeFilter === filter.id ? "text-white" : "text-gray-400"}>
                  {filter.icon}
                </span>
                <span className="text-sm font-medium">{filter.label}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeFilter === filter.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Options */}
              {activeFilter === filter.id && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterClick(filter.id, option)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3BC0E9] transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickFilters;