import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminSupportTickets } from "../../api/support.service";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const ManageSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getAdminSupportTickets();
        setTickets(response.data || []);
      } catch (error) {
        console.error("Failed to load support tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-yellow-100 text-yellow-800', label: 'Open' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved' },
      'closed': { color: 'bg-gray-100 text-gray-800', label: 'Closed' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'open' ? 'bg-yellow-500' :
          status === 'in-progress' ? 'bg-blue-500' :
          status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
        }`} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesSearch = searchQuery === "" ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.landlord?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.landlord?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  if (loading) return <Loader text="Loading support tickets..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            Support Management
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Support</h1>
        <p className="mt-2 text-gray-600">
          Review support requests and reply to landlords.
        </p>
      </div>

      {/* Stats Cards */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Tickets</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
            <p className="text-xs text-gray-500">Open</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            <p className="text-xs text-gray-500">Closed</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {tickets.length > 0 && (
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
                  placeholder="Search by subject, landlord name, or email..."
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
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Tickets List */}
      {!tickets.length ? (
        <EmptyState
          title="No support tickets"
          description="Support requests from landlords will appear here."
        />
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-[#242B38] mb-2">No matching tickets</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/admin/admin-support/${ticket._id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#3BC0E9] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-[#242B38]">
                      {ticket.subject}
                    </h3>
                    {ticket.status === 'open' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {ticket.landlord?.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span>{ticket.landlord?.fullName || "Unknown"}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{ticket.landlord?.email}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-500 capitalize">Category: {ticket.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">
                      Last message: {formatDate(ticket.lastMessageAt)}
                    </span>
                  </div>
                  {ticket.lastMessage && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {ticket.lastMessage}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(ticket.status)}
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Results Count */}
      {tickets.length > 0 && filteredTickets.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
      )}
    </div>
  );
};

export default ManageSupportPage;