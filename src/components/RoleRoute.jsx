import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function RoleRoute({ children }) {
  const { token, loading, isStaff } = useAuth();

  if (loading) return <Loader />;
  if (!token) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/" replace />;
  return children;
}
