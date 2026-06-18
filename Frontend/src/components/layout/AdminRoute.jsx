import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logUnauthorizedAccess }from "../../services/securityService";
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user &&
    user.role !== "admin"
) {

    logUnauthorizedAccess(
        user.email,
        user.company,
        window.location.pathname
    );

    return (
        <Navigate
            to="/UserDashboard"
            replace
        />
    );
}

  return children;
}

export default AdminRoute;