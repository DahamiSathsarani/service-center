import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ userRole, children, checkedRole }) {
  if (userRole != checkedRole) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}
