import { useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  rating: "5",
  experienceType: "general",
  message: "",
};

const ListingFeedbackModal = ({
  isOpen,
  onClose,
  listingId,
  onSubmitFeedback,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setForm(initialForm);
    setServerError("");
    setSuccessMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await onSubmitFeedback({
        listingId,
        ...form,
        rating: Number(form.rating),
      });

      setSuccessMessage("Thank you for sharing your experience!");
      setForm(initialForm);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to send feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating) => {
    const labels = {
      5: "Excellent",
      4: "Good",
      3: "Average",
      2: "Poor",
      1: "Very Poor",
    };
    return labels[rating] || "";
  };

  const experienceTypes = [
    { value: "general", label: "General feedback", icon: "💬" },
    { value: "trust", label: "Trust / Safety", icon: "🛡️" },
    { value: "listing_quality", label: "Listing quality", icon: "🏠" },
    { value: "communication", label: "Communication", icon: "💭" },
    { value: "issue_report", label: "Report an issue", icon: "⚠️" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3BC0E9]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#242B38]">
                Share Your Experience
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500 ml-10">
              Help others by sharing your honest feedback about this listing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name and Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Your Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Your Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Your Rating *
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setForm({ ...form, rating: rating.toString() })}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    <span
                      className={`${
                        (hoveredRating !== null ? rating <= hoveredRating : rating <= parseInt(form.rating))
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {getRatingLabel(parseInt(form.rating))}
                </span>
              </div>
            </div>
          </div>

          {/* Experience Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Experience Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {experienceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, experienceType: type.value })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    form.experienceType === type.value
                      ? "border-[#3BC0E9] bg-[#3BC0E9]/10 text-[#3BC0E9]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-base">{type.icon}</span>
                  <span className="truncate">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Your Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about your experience with this listing..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent resize-none transition-all"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {form.message.length}/500 characters
            </p>
          </div>

          {/* Error/Success Messages */}
          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-sm font-medium text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 pt-2">
            Your feedback helps improve the community. We appreciate your honesty!
          </p>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ListingFeedbackModal;
