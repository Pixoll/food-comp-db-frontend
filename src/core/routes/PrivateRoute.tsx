import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/core/context/AuthContext"; 

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { state } = useAuth();
  
    if (!state.isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <>{children}</>;
  };
export default PrivateRoute;
