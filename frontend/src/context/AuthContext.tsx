// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
}

interface JwtPayload {
  sub: string; // email
  id: number;
  exp: number;
  iat: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
        } else {
          const userFromToken = {
            id: decoded.id,
            email: decoded.sub,
          };
          setUser(userFromToken);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Błąd dekodowania tokena:", err);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      localStorage.setItem("accessToken", token);
      const decoded = jwtDecode<JwtPayload>(token);
      const userFromToken = {
        id: decoded.id,
        email: decoded.sub,
      };
      setUser(userFromToken);
      localStorage.setItem("user", JSON.stringify(userFromToken));
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Nieprawidłowy token logowania:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
