import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../../api/auth.service";

const ForgotPasswordPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await forgotPasswordRequest({ email });
      setSuccessMessage(response.message || "Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-[#242B38] to-[#1a1f28] rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                  <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#95BDCB] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#3BC0E9] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
              </div>

              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}
              ></div>

              <div className="relative z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                    Password Recovery
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                  Forgot Your{' '}
                  <span className="bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] bg-clip-text text-transparent">
                    Password?
                  </span>
                </h1>

                <p className="text-white/80 mb-6 leading-relaxed">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#3BC0E9]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">Reset link sent within minutes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#3BC0E9]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">Secure password reset process</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#3BC0E9]/20 flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-[#3BC0E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/80">24/7 support available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                    Reset Password
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#242B38]">Reset Your Password</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {serverError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {serverError}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium">Check your email!</p>
                      <p className="text-xs mt-1">{successMessage}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] px-4 py-3 font-medium text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-6 text-center">
                <Link
                  to="/landlord/login"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[#3BC0E9] transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Having trouble?{" "}
                <Link to="/contact" className="text-[#3BC0E9] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;