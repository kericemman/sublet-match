import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin.service";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/admin/StatCard";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setServerError("");

        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        setServerError(
          error?.response?.data?.message || "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading admin dashboard..." />
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {serverError}
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
            Admin Panel
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of landlords, listings, and inquiries.
        </p>
      </div>

      {/* Main Stats Row */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          title="Total Landlords"
          value={stats?.landlords?.total || 0}
          hint={`Banned: ${stats?.landlords?.banned || 0}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
          change={stats?.landlords?.growth || 0}
          trend={stats?.landlords?.growth >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Active Listings"
          value={stats?.listings?.active || 0}
          hint={`Hidden: ${stats?.listings?.hidden || 0}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
          color="green"
          change={stats?.listings?.growth || 0}
          trend={stats?.listings?.growth >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Total Inquiries"
          value={stats?.inquiries?.total || 0}
          hint={`New: ${stats?.inquiries?.new || 0}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          color="purple"
          change={stats?.inquiries?.growth || 0}
          trend={stats?.inquiries?.growth >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid gap-5 md:grid-cols-2 mb-8">
        <StatCard
          title="Deleted Listings"
          value={stats?.listings?.deleted || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
          color="red"
        />
        <StatCard
          title="Resolved Inquiries"
          value={stats?.inquiries?.resolved || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/users"
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Users
          </a>
          <a
            href="/admin/listings"
            className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Manage Listings
          </a>
          <a
            href="/admin/inquiries"
            className="inline-flex items-center px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-[#3BC0E9] hover:text-[#3BC0E9] transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            View Inquiries
          </a>
        </div>
      </div>

      {/* Recent Activity (if available) */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#242B38] mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      activity.type === 'listing' ? 'bg-blue-500' :
                      activity.type === 'user' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-[#242B38]">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;