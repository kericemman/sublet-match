import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInquiries, markInquiryAsRead } from "../../api/inquiry.service";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await getMyInquiries();
      setInquiries(response.data || []);
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markInquiryAsRead(id);
      setInquiries(inquiries.map(inq => 
        inq._id === id ? { ...inq, isRead: true } : inq
      ));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
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
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const getStatusBadge = (inquiry) => {
    if (!inquiry.isRead && inquiry.status !== 'replied') {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>;
    } else if (inquiry.status === 'replied') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Replied</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Read</span>;
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === "all") return true;
    if (filter === "unread") return !inquiry.isRead;
    if (filter === "replied") return inquiry.status === 'replied';
    return true;
  });

  const stats = {
    total: inquiries.length,
    unread: inquiries.filter(i => !i.isRead).length,
    replied: inquiries.filter(i => i.status === 'replied').length
  };

  if (selectedInquiry) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedInquiry(null)}
          className="flex items-center text-[#3BC0E9] hover:text-blue-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inquiries
        </button>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-[#242B38]">{selectedInquiry.name}</h2>
                  {getStatusBadge(selectedInquiry)}
                </div>
                <a 
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-sm text-[#3BC0E9] hover:underline"
                >
                  {selectedInquiry.email}
                </a>
                {selectedInquiry.phone && (
                  <p className="text-sm text-gray-600 mt-1">📞 {selectedInquiry.phone}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{formatDate(selectedInquiry.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              About Listing
            </h3>
            <Link
              to={`/listings/${selectedInquiry.listing?._id}`}
              className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-[#242B38]">{selectedInquiry.listing?.title || "Listing"}</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedInquiry.listing?.location || selectedInquiry.listing?.city}
              </p>
              <p className="text-sm font-semibold text-[#3BC0E9] mt-1">
                ${selectedInquiry.listing?.price}/month
              </p>
            </Link>
          </div>

          {/* Message */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedInquiry.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry about ${selectedInquiry.listing?.title}`}
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg hover:shadow-md transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Reply via Email
            </a>
            {!selectedInquiry.isRead && (
              <button
                onClick={() => {
                  handleMarkAsRead(selectedInquiry._id);
                  setSelectedInquiry({ ...selectedInquiry, isRead: true });
                }}
                className="px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading inquiries..." />
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
            Messages
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">My Inquiries</h1>
        <p className="mt-2 text-gray-600">
          Review messages sent by interested users.
          <span className="ml-2 font-medium text-[#3BC0E9]">{stats.total}</span> total inquiries
        </p>
      </div>

      {/* Stats Cards */}
      {inquiries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Inquiries</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
            <p className="text-xs text-gray-500">Unread</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            <p className="text-xs text-gray-500">Replied</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {inquiries.length > 0 && (
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "text-[#3BC0E9] border-b-2 border-[#3BC0E9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === "unread"
                ? "text-[#3BC0E9] border-b-2 border-[#3BC0E9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread {stats.unread > 0 && `(${stats.unread})`}
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === "replied"
                ? "text-[#3BC0E9] border-b-2 border-[#3BC0E9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Replied
          </button>
        </div>
      )}

      {/* Inquiries List */}
      {!filteredInquiries.length ? (
        <EmptyState
          title={filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
          description={
            filter === "all" 
              ? "When users inquire about your listings, they will appear here."
              : `You don't have any ${filter} inquiries at the moment.`
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              onClick={() => {
                setSelectedInquiry(inquiry);
                if (!inquiry.isRead) handleMarkAsRead(inquiry._id);
              }}
              className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                !inquiry.isRead ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 hover:border-[#3BC0E9]'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#242B38]">{inquiry.name}</h3>
                      {getStatusBadge(inquiry)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{inquiry.email}</p>
                    <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>

                  <div className="md:text-right flex-shrink-0">
                    <p className="text-sm font-medium text-[#3BC0E9]">
                      {inquiry.listing?.title || "General Inquiry"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(inquiry.createdAt)}
                    </p>
                    {inquiry.phone && (
                      <p className="text-xs text-gray-500 mt-1">📞 {inquiry.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;