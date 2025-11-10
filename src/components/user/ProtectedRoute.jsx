import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
 
  const auth = useSelector((state) => state.auth);
  if (!auth?.userId) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
