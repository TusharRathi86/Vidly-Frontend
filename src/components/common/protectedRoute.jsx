import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = () => {
  let location = useLocation();
  const authorise = auth.getCurrentUser();
  return authorise ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;

// const ProtectedRoute = ({ children }) => {
//   let location = useLocation();
//   const authorise = auth.getCurrentUser();
//   return authorise ? (
//     children
//   ) : (
//     <Navigate to="/login" replace state={{ from: location }} />
//   );
// };
