import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuthUser, isAuthenticated } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"visitor" | "vendor" | "admin">;
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = getAuthUser();
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/search" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
