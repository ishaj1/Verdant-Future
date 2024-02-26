import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { auth } = useAuth();
  const loc = useLocation();

  // allows navigation to children components/routes if user is authorized to
  // otherwise navigates to login page
  return auth?.username ? (
    children
  ) : (
    <Navigate to="/" state={{ from: loc }} replace />
  );
};

export default RequireAuth;
