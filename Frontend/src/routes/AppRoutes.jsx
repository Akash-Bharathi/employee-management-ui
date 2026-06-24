import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "../components/layout/AdminRoute";
import ForecastDashboard from "../pages/forecast/ForecastDashboard";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
import Members from "../pages/members/Members";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeProfile from "../pages/employees/EmployeeProfile";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import DashboardRouter from "../pages/dashboard/DashboardRouter";
import Subscription from "../pages/subscription/Subscription";
import SecurityMonitoring from "../pages/security/SecurityMonitoring";
import Settings from "../pages/settings/Settings";
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
              <DashboardRouter />
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
      <Route
        path="/forecast"
        element={
          <ProtectedRoute>
            <ForecastDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <SecurityMonitoring />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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