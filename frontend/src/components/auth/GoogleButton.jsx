import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/auth.service";
import useAuth from "../../hooks/useAuth";

const GoogleLoginButton = ({ onSuccessRedirect, onError }) => {
  const { setAuthSession } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
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
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          if (onError) onError("Google sign-in failed");
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;