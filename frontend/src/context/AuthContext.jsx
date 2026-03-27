import { createContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../api/auth.service";
import { clearAuth, getStoredToken, getStoredUser, saveAuth } from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  const setAuthSession = ({ token, user }) => {
    saveAuth({ token, user });
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const refreshMe = async () => {
    try {
      if (!getStoredToken()) {
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      isAdmin: user?.role === "admin",
      isLandlord: user?.role === "landlord",
      setAuthSession,
      logout,
      refreshMe,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};