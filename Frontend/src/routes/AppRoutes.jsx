import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Members from "../pages/members/Members";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeProfile from "../pages/employees/EmployeeProfile";
import ProtectedRoute from "../components/layout/ProtectedRoute";

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