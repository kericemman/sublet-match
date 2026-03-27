import { useEffect, useState } from "react";
import {
  getAdminContacts,
  updateContactStatus,
  deleteContact,
} from "../../api/contact.service";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";

const ManageContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await getAdminContacts();
      setContacts(response.data || []);
    } catch (error) {
      console.error("Failed to load contact messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateContactStatus(id, { status });
      setContacts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update contact status");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((item) => item._id !== id));
      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete contact message");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'bg-blue-100 text-blue-800', label: 'New' },
      'read': { color: 'bg-gray-100 text-gray-800', label: 'Read' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
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

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = filter === "all" || contact.status === filter;
    const matchesSearch = searchQuery === "" ||
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
  };

  const columns = [
    {
      key: "name",
      header: "Sender",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {row.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#242B38]">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          row.category === 'general' ? 'bg-gray-100 text-gray-700' :
          row.category === 'support' ? 'bg-blue-100 text-blue-700' :
          row.category === 'partnership' ? 'bg-purple-100 text-purple-700' :
          row.category === 'landlord' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.category}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      sortable: true,
      render: (row) => (
        <p className="font-medium text-[#242B38] max-w-xs truncate">
          {row.subject}
        </p>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <p className="max-w-xs whitespace-pre-line text-sm text-gray-700 line-clamp-2">
          {row.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{formatDate(row.createdAt)}</p>
          <p className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleTimeString()}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
          >
            <option value="new">Mark New</option>
            <option value="read">Mark Read</option>
            <option value="resolved">Mark Resolved</option>
          </select>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Detailed View Modal
  if (selectedContact) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-xl font-semibold text-[#242B38]">Contact Message Details</h3>
            <button
              onClick={() => setSelectedContact(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3BC0E9] to-[#95BDCB] flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {selectedContact.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-[#242B38]">{selectedContact.name}</h4>
                <a href={`mailto:${selectedContact.email}`} className="text-sm text-[#3BC0E9] hover:underline">
                  {selectedContact.email}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-[#242B38] capitalize">{selectedContact.category}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Status</p>
                {getStatusBadge(selectedContact.status)}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#242B38] mb-1">Subject</p>
              <p className="text-gray-700">{selectedContact.subject}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-[#242B38] mb-1">Message</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{selectedContact.message}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg text-center hover:shadow-md transition-all"
              >
                Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selectedContact._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader text="Loading contact messages..." />
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
            Admin
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#242B38]">Manage Contacts</h1>
        <p className="mt-2 text-gray-600">
          Review public messages, support requests, and partnership inquiries.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-[#242B38]">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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
                placeholder="Search by name, email, or subject..."
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
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredContacts}
        emptyText="No contact messages found"
        pagination={true}
        pageSize={10}
        showSearch={false}
        onRowClick={(row) => setSelectedContact(row)}
      />

      {/* Results Count */}
      {filteredContacts.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredContacts.length} of {contacts.length} messages
        </p>
      )}
    </div>
  );
};

export default ManageContactsPage;