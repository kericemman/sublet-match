import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createSupportTicket,
  getMySupportTickets,
} from "../../api/support.service";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const initialForm = {
  subject: "",
  category: "other",
  message: "",
};

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getMySupportTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Failed to load support tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await createSupportTicket(form);
      setForm(initialForm);
      fetchTickets();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create support ticket");
    } finally {
      setSubmitting(false);
    }
  };

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
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
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

  if (loading) return <Loader text="Loading support tickets..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
          <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
            Help & Support
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Support Center</h1>
        <p className="mt-2 text-gray-600">
          Send support requests and continue the conversation with our support team.
        </p>
      </div>

      {/* Stats Cards */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-[#242B38]">{tickets.length}</p>
            <p className="text-xs text-gray-500">Total Tickets</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'open').length}
            </p>
            <p className="text-xs text-gray-500">Open</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'in-progress').length}
            </p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
        </div>
      )}

      {/* Create Ticket Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3BC0E9]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#242B38]">Create New Support Ticket</h2>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Need help? Submit a request and our team will get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief summary of your issue"
                className={`w-full rounded-lg border pl-10 pr-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.subject ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
                }`}
                required
              />
            </div>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              >
                <option value="account">Account Issues</option>
                <option value="listing">Listing Problems</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Issues</option>
                <option value="inquiry">General Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better."
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 resize-none transition-all ${
                errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
              }`}
              required
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {form.message.length}/1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : (
              "Create Support Ticket"
            )}
          </button>
        </form>
      </div>

      {/* Tickets List */}
      {!tickets.length ? (
        <EmptyState
          title="No support tickets yet"
          description="Your support conversations will appear here. Need help? Create a new ticket above."
          action={{
            label: "Create Ticket",
            onClick: () => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      ) : (
        <>
          <h2 className="text-lg font-semibold text-[#242B38] mb-4">Your Support Tickets</h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/landlord/support/${ticket._id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#3BC0E9] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getCategoryIcon(ticket.category)}</span>
                      <h3 className="text-lg font-semibold text-[#242B38]">
                        {ticket.subject}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-gray-500 capitalize">{ticket.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        Last updated: {formatDate(ticket.lastMessageAt)}
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
        </>
      )}

      {/* Helpful Resources */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-[#3BC0E9]/20 p-6">
        <h3 className="text-lg font-semibold text-[#242B38] mb-4 flex items-center">
          <svg className="w-5 h-5 text-[#3BC0E9] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Helpful Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/faq" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#3BC0E9] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </a>
          <a href="/contact" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#3BC0E9] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;