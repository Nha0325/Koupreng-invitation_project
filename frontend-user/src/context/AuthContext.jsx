import { useState, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { authStorage } from "../shared/services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authStorage.getToken()));

  const login = useCallback((session) => {
    authStorage.saveSession(session);
    setUser(session.user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authStorage.clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
