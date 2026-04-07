import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/auth.service";
import useAuth from "../../hooks/useAuth";

const GoogleLoginButton = ({ onSuccessRedirect, onError }) => {
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

      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => onError?.("Google sign-in failed")}
      />
      {loading ? <p className="mt-2 text-sm text-gray-500">Signing in...</p> : null}
    </div>
  );
};

export default GoogleLoginButton;