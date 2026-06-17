import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  signupUser,
} from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);
  const login = async (credentials) => {
    const result = await loginUser(credentials);

    if (!result.success) {
      return result;
    }

    const { access_token, user } = result.data;

    localStorage.setItem(
      "token",
      access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(access_token);
    setUser(user);

    return result;
  };

  const signup = async (userData) => {
    return await signupUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,

    login,
    signup,
    logout,

    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () =>
  useContext(AuthContext);