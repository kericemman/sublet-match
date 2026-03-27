import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitInquiry } from "../../api/inquiry.service";

const InquiryForm = ({ listingId, onSuccess }) => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await submitInquiry({
        listingId,
        ...values,
      });

      setSuccessMessage(
        "Your inquiry has been sent successfully! The lister will contact you shortly."
      );
      reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to send inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#242B38] mb-2">
          Interested in this property?
        </h3>
        <p className="text-sm text-gray-600">
          Fill in your details and the lister will be notified.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full rounded-lg border pl-10 pr-4 py-3 outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
              }`}
              placeholder="Your full name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                }
              })}
              className={`w-full rounded-lg border pl-10 pr-4 py-3 outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
              }`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              {...register("phone")}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
              placeholder="Optional - for quicker contact"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your number will only be shared with the lister if you choose to call.
          </p>
        </div>

        {/* Message Field */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Message *
          </label>
          <textarea
            rows="5"
            {...register("message", { required: "Message is required" })}
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 resize-none transition-all ${
              errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
            }`}
            placeholder="Tell the lister about yourself and what you're looking for..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Include questions about availability, pricing, or viewing arrangements.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] px-4 py-3 font-medium text-white transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : (
            "Send Inquiry"
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-center text-gray-500">
          By sending this inquiry, you agree to our{' '}
          <a href="/terms" className="text-[#3BC0E9] hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-[#3BC0E9] hover:underline">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

export default InquiryForm;