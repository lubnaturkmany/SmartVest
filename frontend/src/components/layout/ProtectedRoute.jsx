import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 30 }}>Loading...</div>;
  }

  // إذا ما في user، روح على login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا roles محددة وما ينتمي الدور الحالي للقائمة، روح للداشبورد
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // كلشي تمام، خلي الصفحة تظهر
  return children;
}