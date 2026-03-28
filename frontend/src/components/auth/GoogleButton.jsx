import { useState } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/auth.service";
import useAuth from "../../hooks/useAuth";

const GoogleLoginButton = ({ onSuccessRedirect, onError, buttonText = "Continue with Google", className = "" }) => {
  const { setAuthSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const googleToken = credentialResponse.credential;

      if (!googleToken) {
        throw new Error("Google token not received");
      }

      const response = await loginWithGoogle(googleToken);
      const { user, token } = response.data;

      setAuthSession({ user, token });

      if (onSuccessRedirect) {
        onSuccessRedirect(user);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Google login failed";

      if (onError) {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          if (onError) onError("Google sign-in failed. Please try again.");
        }}
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
        text="continue_with"
        logo_alignment="center"
      />
    </div>
  );
};

export default GoogleLoginButton;