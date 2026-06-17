import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "../components/layout/AdminRoute";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import Members from "../pages/members/Members";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeProfile from "../pages/employees/EmployeeProfile";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Subscription from "../pages/subscription/Subscription";
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/UserDashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      {/* Protected Routes */}

      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>

  );
}

export default AppRoutes;