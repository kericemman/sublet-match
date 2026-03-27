import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAdminSupportTicketById,
  replyToAdminSupportTicket,
  updateSupportTicketStatus,
} from "../../api/support.service";
import Loader from "../../components/common/Loader";

const SupportTicketAdminPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await getAdminSupportTicketById(id);
      setTicket(response.data);
    } catch (error) {
      console.error("Failed to load support ticket", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // Scroll to bottom when messages load or new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setError("");
    setReplying(true);

    try {
      await replyToAdminSupportTicket(id, { message });
      setMessage("");
      fetchTicket();
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true);
    try {
      await updateSupportTicketStatus(id, { status });
      fetchTicket();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-yellow-100 text-yellow-800', label: 'Open' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved' },
      'closed': { color: 'bg-gray-100 text-gray-800', label: 'Closed' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'open' ? 'bg-yellow-500' :
          status === 'in_progress' ? 'bg-blue-500' :
          status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
        }`} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      account: "👤",
      listing: "🏠",
      billing: "💰",
      technical: "🔧",
      inquiry: "❓",
      other: "📝"
    };
    return icons[category] || "📝";
  };

  if (loading) return <Loader text="Loading support thread..." />;
  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link
          to="/admin/support"
          className="inline-flex items-center text-sm text-[#3BC0E9] hover:underline mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Support Tickets
        </Link>

        {/* Ticket Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                <h1 className="text-2xl font-bold text-[#242B38]">{ticket.subject}</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {ticket.landlord?.fullName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#242B38]">{ticket.landlord?.fullName || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{ticket.landlord?.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="capitalize">Category: {ticket.category}</span>
                <span className="text-gray-300">•</span>
                <span>Created: {formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                {getStatusBadge(ticket.status)}
              </div>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Ticket ID:</span>
              <span className="ml-2 font-mono text-gray-700">{ticket._id.slice(-8)}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-700">{formatDate(ticket.lastMessageAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto p-2">
        {ticket.messages.map((item, index) => {
          const isAdmin = item.senderRole === "admin";
          const isFirstMessage = index === 0;
          const isLastMessage = index === ticket.messages.length - 1;
          
          return (
            <div
              key={item._id}
              className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  isAdmin
                    ? "bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Sender Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAdmin
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {isAdmin ? "A" : "U"}
                  </div>
                  <p className={`text-sm font-semibold ${
                    isAdmin ? "text-white" : "text-[#242B38]"
                  }`}>
                    {item?.sender?.fullName || (isAdmin ? "SubletMatch Support" : ticket.landlord?.fullName || "User")}
                  </p>
                  {isFirstMessage && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isAdmin ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      Original
                    </span>
                  )}
                  {isLastMessage && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isAdmin ? "bg-green-500/30 text-green-300" : "bg-blue-100 text-blue-700"
                    }`}>
                      Latest
                    </span>
                  )}
                </div>
                
                {/* Message Content */}
                <p className={`text-sm whitespace-pre-line leading-relaxed ${
                  isAdmin ? "text-white/90" : "text-gray-700"
                }`}>
                  {item.message}
                </p>
                
                {/* Timestamp */}
                <p className={`mt-2 text-xs ${
                  isAdmin ? "text-white/50" : "text-gray-400"
                }`}>
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      {ticket.status !== 'closed' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
            <h3 className="text-lg font-semibold text-[#242B38]">Admin Reply</h3>
            <p className="text-sm text-gray-500 mt-1">
              Respond to the user's support request
            </p>
          </div>
          
          <form onSubmit={handleReply} className="p-5 space-y-4">
            <div>
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your admin reply here..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent resize-none transition-all"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {message.length}/1000 characters
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMessage("")}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={replying || !message.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replying ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reply"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-[#242B38] mb-2">Ticket Closed</h3>
          <p className="text-sm text-gray-600">
            This ticket has been closed. No further replies can be sent.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportTicketAdminPage;