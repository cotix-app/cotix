import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = localStorage.getItem("cotixUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}