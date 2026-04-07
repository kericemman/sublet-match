import { useState, useEffect } from "react";
import { submitPlatformFeedback } from "../../api/feedback.service";

const initialForm = {
  name: "",
  email: "",
  rating: "5",
  experienceType: "general",
  message: "",
};

const FeedbackPage = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await submitPlatformFeedback({
        ...form,
        rating: Number(form.rating),
      });

      setSuccessMessage("Thank you for sharing your SubletMatch experience!");
      setForm(initialForm);

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
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

  const feedbackTypes = [
    { value: "general", label: "General feedback", icon: "💬", color: "bg-blue-100 text-blue-800" },
    { value: "trust", label: "Trust / Safety", icon: "🛡️", color: "bg-purple-100 text-purple-800" },
    { value: "usability", label: "Usability", icon: "🎯", color: "bg-emerald-100 text-emerald-800" },
    { value: "bug_report", label: "Bug report", icon: "🐛", color: "bg-red-100 text-red-800" },
    { value: "suggestion", label: "Suggestion", icon: "💡", color: "bg-amber-100 text-amber-800" },
    { value: "other", label: "Other", icon: "📝", color: "bg-gray-100 text-gray-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-[#95BDCB]/20 py-12 border-b border-[#95BDCB]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider"></span>
            <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
              We Value Your Opinion
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#242B38] mb-4">
            Share Your{' '}
            <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
              Feedback
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us improve SubletMatch by sharing your honest experience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column - Info */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    SubletMatch Feedback
                  </p>
                  <h1 className="text-xl font-bold text-[#242B38]">
                    Share your platform experience
                  </h1>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Tell us what feels good, what feels confusing, what looks missing,
                or what needs improvement on SubletMatch.
              </p>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">We want honest feedback, not perfect feedback.</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your response helps improve trust, usability, and the overall product experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* What we do with feedback */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#242B38] mb-3">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">We review every submission</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Your feedback helps shape our roadmap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">We may follow up for clarification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feedback Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
                  
                  <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                    Tell Us What You Think
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#242B38]">Share Your Feedback</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your insights help us build a better platform for everyone.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                          className="text-3xl transition-transform hover:scale-110"
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
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        {getRatingLabel(parseInt(form.rating))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Feedback Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm({ ...form, experienceType: type.value })}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                          form.experienceType === type.value
                            ? `${type.color} border-current`
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                       
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
                    rows="6"
                    placeholder="Tell us about your experience with SubletMatch..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent resize-none transition-all"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {form.message.length}/1000 characters
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] px-5 py-3 text-sm font-medium text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 pt-2">
                  Your feedback is anonymous to other users. We'll only use your email to follow up if needed.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;