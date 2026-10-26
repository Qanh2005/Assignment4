import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If a regular user tries to hit /admin, redirect them away
  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
