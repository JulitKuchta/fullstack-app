// src/components/PublicRoute/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface Props {
  children: React.ReactElement;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Użytkownik zalogowany – nie pokazuj loginu/rejestracji
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
