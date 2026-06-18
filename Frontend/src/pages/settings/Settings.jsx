import MainLayout from "../../components/layout/MainLayout";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import "../subscription/Subscription.css";
import { FaSun, FaMoon } from "react-icons/fa";

function Settings() {
  const { user } = useAuthContext();
  const { darkMode, toggleTheme } = useTheme();
  const [notifyEmployee, setNotifyEmployee] = useState(true);

  return (
    <MainLayout>
      <div className="settings-header-section">
        <div className="settings-intro">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage appearance, notifications, and account preferences.
          </p>
        </div>

        <div className="settings-cards-grid">
          <div className="settings-card">
            <div className="card-header">
              <span className="card-icon">💻</span>
              <h2 className="card-title">Appearance</h2>
            </div>
            <p className="card-description">
              Switch between light and dark themes across the application.
            </p>
            <div className="card-action-row">
              <div className="theme-status">
                <span className="status-icon">{darkMode ? "🌙" : "☀️"}</span>
                <span className="status-text">
                  Current theme: {darkMode ? "Dark" : "Light"}
                </span>
              </div>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div className="card-header">
              <span className="card-icon">🔔</span>
              <h2 className="card-title">Notifications</h2>
            </div>
            <p className="card-description">
              Control in-app alerts for employee and attendance activity.
            </p>
            <div className="card-action-row alignment-start">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={notifyEmployee}
                  onChange={(e) => setNotifyEmployee(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">
                  Notify when employees are added or updated
                </span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h2 className="card-title">Account</h2>
            </div>
            <div className="account-profile-row">
              <div className="profile-avatar">
                {(user?.fullname || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <div className="profile-name">
                  {user?.fullname || user?.email?.split("@")[0] || "User"}
                </div>
                <div className="profile-email">{user?.email}</div>
                <div className="profile-badge">{user?.role === "admin" ? "Admin" : "User"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
