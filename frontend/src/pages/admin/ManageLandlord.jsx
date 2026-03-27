import { useEffect, useState } from "react";
import {
  banLandlord,
  deleteLandlord,
  getLandlords,
  unbanLandlord,
  getAdminListings
} from "../../api/admin.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";

const ManageLandlordsPage = () => {
  const [listings, setListings] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    verified: 0,
  });

  const fetchLandlords = async () => {
    try {
      setLoading(true);
      const [landlordsResponse, listingsResponse] = await Promise.all([
        getLandlords(),
        getAdminListings()
      ]);
      
      const landlordsData = landlordsResponse.data || [];
      const listingsData = listingsResponse.data || [];
      
      setLandlords(landlordsData);
      setListings(listingsData);
      
      // Count listings per landlord
      const landlordsWithListingCount = landlordsData.map(landlord => ({
        ...landlord,
        listingsCount: listingsData.filter(listing => 
          listing.landlord?._id === landlord._id || 
          listing.owner?._id === landlord._id
        ).length
      }));
      
      setLandlords(landlordsWithListingCount);
      
      // Calculate stats from the fetched data
      setStats({
        total: landlordsData.length,
        active: landlordsData.filter(l => !l.isBanned).length,
        banned: landlordsData.filter(l => l.isBanned).length,
        verified: landlordsData.filter(l => l.isVerified).length,
      });
    } catch (error) {
      console.error("Failed to load landlords", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, []);

  const handleBanToggle = async (landlord) => {
    const action = landlord.isBanned ? "unban" : "ban";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${landlord.fullName || landlord.email}?`
    );
    if (!confirmed) return;

    try {
      if (landlord.isBanned) {
        await unbanLandlord(landlord._id);
      } else {
        await banLandlord(landlord._id);
      }
      fetchLandlords();
    } catch (error) {
      alert(error?.response?.data?.message || `Failed to ${action} landlord`);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteLandlord(id);
      fetchLandlords();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete landlord");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today`;
    } else if (diffDays === 1) {
      return `Yesterday`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const filteredLandlords = landlords.filter(landlord => {
    const matchesFilter = filter === "all" || 
      (filter === "active" && !landlord.isBanned) ||
      (filter === "banned" && landlord.isBanned) ||
      (filter === "verified" && landlord.isVerified);
    
    const matchesSearch = searchQuery === "" ||
      landlord.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const columns = [
    {
      key: "fullName",
      header: "Landlord",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {row.fullName?.charAt(0).toUpperCase() || row.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#242B38]">{row.fullName || "N/A"}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
            {row.phone && <p className="text-xs text-gray-400">📞 {row.phone}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "authProvider",
      header: "Provider",
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          row.authProvider === 'google' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {row.authProvider === 'google' ? (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            </svg>
          ) : null}
          {row.authProvider === 'google' ? 'Google' : 'Email'}
        </span>
      ),
    },
    {
      key: "isVerified",
      header: "Verified",
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center gap-1 ${
          row.isVerified ? 'text-green-600' : 'text-gray-400'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {row.isVerified ? "Verified" : "Not Verified"}
        </span>
      ),
    },
    {
      key: "listingsCount",
      header: "Listings",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-medium text-[#242B38]">{row.listingsCount || 0}</span>
        </div>
      ),
    },
    {
      key: "isBanned",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            row.isBanned
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            row.isBanned ? "bg-red-500" : "bg-green-500"
          }`} />
          {row.isBanned ? "Banned" : "Active"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{formatDate(row.createdAt)}</p>
          <p className="text-xs text-gray-400">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleBanToggle(row)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              row.isBanned
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            {row.isBanned ? "Unban" : "Ban"}
          </button>
          <button
            onClick={() => handleDelete(row._id, row.fullName || row.email)}
            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading landlords..." />
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
            User Management
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Landlords</h1>
        <p className="mt-2 text-gray-600">
          Review, ban, unban, or remove landlords from the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Landlords</p>
              <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Banned</p>
              <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-purple-600">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          >
            <option value="all">All Landlords</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="verified">Verified Only</option>
          </select>
          <button
            onClick={fetchLandlords}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredLandlords}
        emptyText="No landlords found"
        pagination={true}
        pageSize={10}
        showSearch={false}
      />

      {/* Results Count */}
      {filteredLandlords.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredLandlords.length} of {landlords.length} landlords
        </p>
      )}
    </div>
  );
};

export default ManageLandlordsPage;