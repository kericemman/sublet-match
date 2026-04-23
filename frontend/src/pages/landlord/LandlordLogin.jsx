import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import GoogleLoginButton from "../../components/auth/GoogleButton";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";

const LandlordLoginPage = () => {
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
        <div className="grid  items-center">
          

          {/* Right Column - Login Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3BC0E9]/10 border border-[#3BC0E9]/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#3BC0E9] mr-2 animate-pulse"></span>
                  <span className="text-xs font-medium text-[#242B38] uppercase tracking-wider">
                    Welcome Back
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#242B38]">Login to your account</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Sign in with your email and password or continue with Google
                </p>
              </div>

              <LoginForm onSuccessRedirect={handleRedirect} />

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

              

              {/* Help Link */}
              <div className="mt-4 text-center">
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 hover:text-[#3BC0E9] transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
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

export default LandlordLoginPage;