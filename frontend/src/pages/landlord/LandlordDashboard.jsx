import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyListings } from "../../api/listing.service";
import { getMyInquiries } from "../../api/inquiry.service";
import Loader from "../../components/common/Loader";

const StatCard = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#242B38]">{value}</h3>
    </div>
  );
};

const ActivityItem = ({ icon, title, time, description }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-[#242B38]">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const LandlordDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    hiddenListings: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [listingResponse, inquiryResponse] = await Promise.all([
          getMyListings(),
          getMyInquiries(),
        ]);

        const listings = listingResponse.data || [];
        const inquiries = inquiryResponse.data || [];

        setStats({
          totalListings: listings.length,
          activeListings: listings.filter((item) => item.status === "approved" || item.status === "active").length,
          pendingListings: listings.filter((item) => item.status === "pending").length,
          hiddenListings: listings.filter((item) => item.status === "rejected" || item.status === "hidden").length,
          totalInquiries: inquiries.length,
          unreadInquiries: inquiries.filter((item) => !item.isRead).length,
        });

        // Get recent listings (last 3)
        setRecentListings(listings.slice(0, 3));
        
        // Get recent inquiries (last 3)
        setRecentInquiries(inquiries.slice(0, 3));
      } catch (error) {
        console.error("Failed to load landlord dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            Welcome Back
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Landlord Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your listings and keep track of incoming inquiries.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Active Listings"
          value={stats.activeListings}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingListings}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
        />
        <StatCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Unread Inquiries Alert */}
      {stats.unreadInquiries > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm text-blue-800">
              You have <span className="font-bold">{stats.unreadInquiries}</span> unread {stats.unreadInquiries === 1 ? 'inquiry' : 'inquiries'}. 
              <Link to="/landlord/inquiries" className="font-medium underline ml-1">Review now</Link>
            </span>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#242B38]">Recent Listings</h2>
            <Link
              to="/landlord/listings"
              className="text-sm text-[#3BC0E9] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentListings.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-sm">No listings yet</p>
              <Link
                to="/landlord/listings/create"
                className="mt-3 inline-block text-sm text-[#3BC0E9] hover:underline"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/landlord/listings/${listing._id}/edit`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {listing.images?.[0]?.url ? (
                      <img 
                        src={listing.images[0].url} 
                        alt={listing.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-[#242B38]">{listing.title}</h3>
                      <p className="text-sm text-gray-500">{listing.location || listing.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#3BC0E9]">${listing.price}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-700' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {listing.status === 'approved' ? 'Active' : listing.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#242B38]">Recent Inquiries</h2>
            <Link
              to="/landlord/inquiries"
              className="text-sm text-[#3BC0E9] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-500 text-sm">No inquiries yet</p>
              <p className="text-xs text-gray-400 mt-1">Inquiries will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry._id}
                  to={`/landlord/inquiries/${inquiry._id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#242B38]">{inquiry.name}</h3>
                        {!inquiry.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{inquiry.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-[#3BC0E9]/5 to-[#95BDCB]/5 rounded-xl border border-[#3BC0E9]/20 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/landlord/listings/create"
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Listing
          </Link>
          <Link
            to="/landlord/listings"
            className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            View All Listings
          </Link>
          <Link
            to="/landlord/inquiries"
            className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Check Inquiries
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboardPage;