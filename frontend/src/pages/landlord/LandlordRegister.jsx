import { Link, Navigate, useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegistrationForm";
import GoogleLoginButton from "../../components/auth/GoogleButton";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";

const LandlordRegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLandlord, isAdmin, loading } = useAuth();
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRedirect = (user) => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    navigate("/landlord/dashboard", { replace: true });
  };

  if (!loading && isAuthenticated && isLandlord) {
    return <Navigate to="/landlord/dashboard" replace />;
  }

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid items-center">
          {/* Left Column - Hero Content */}
          

          {/* Right Column - Registration Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                    Get Started
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#242B38]">Create an account</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Sign up with email and password or continue with Google
                </p>
              </div>

              <RegisterForm onSuccessRedirect={handleRedirect} />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <GoogleLoginButton
                onSuccessRedirect={handleRedirect}
                onError={setGoogleError}
              />

              {googleError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {googleError}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/landlord/login"
                    className="font-medium text-[#3BC0E9] hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <p className="mt-6 text-xs text-center text-gray-500">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-[#3BC0E9] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#3BC0E9] hover:underline">
                  Privacy Policy
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
      `}</style>
    </div>
  );
};

export default LandlordRegisterPage;