import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";
import { Role } from "../../types";

interface ProtectedRouteProps {
  allow?: Role[];
}

export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthSession();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
