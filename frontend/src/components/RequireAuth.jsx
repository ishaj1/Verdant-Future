import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ children }) => {
  const { auth } = useAuth();

  // allows navigation to children components/routes if user is authorized to
  // otherwise navigates to login page
  return auth?.username ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default RequireAuth;
