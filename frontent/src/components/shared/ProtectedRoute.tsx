import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "patient" | "doctor" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const userInfoStr = localStorage.getItem("userInfo");
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  if (!userInfo) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    // Logged in but wrong role, redirect to home
    console.warn(`Access denied: Required role ${requiredRole}, found ${userInfo.role}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
