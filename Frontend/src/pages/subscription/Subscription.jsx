import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  FaRegCreditCard,
  FaCheck,
  FaCrown,
  FaBolt,
  FaMagic,
   FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import "./Subscription.css";
import { useAuthContext } from "../../context/AuthContext";
function Subscription() {
  const [currentPlan, setCurrentPlan] =
    useState("free");

  const usage = {
    employees: 23,
    admins: 13,
  };
  const { user } = useAuthContext();
  const plans = {
    free: {
      name: "Free",
      maxEmployees: 10,
      maxAdmins: 1,
      analytics: false,
      auditLogs: false,
      export: false,
      icon: <FaMagic />,
    },

    professional: {
      name: "Professional",
      maxEmployees: 50,
      maxAdmins: 3,
      analytics: true,
      auditLogs: true,
      export: true,
      icon: <FaBolt />,
    },

    enterprise: {
      name: "Enterprise",
      maxEmployees: Infinity,
      maxAdmins: Infinity,
      analytics: true,
      auditLogs: true,
      export: true,
      icon: <FaCrown />,
    },
  };

  const selectedPlan =
    plans[currentPlan];
  const {
  darkMode,
  toggleTheme,
} = useTheme();
  const employeePercent =
    selectedPlan.maxEmployees ===
      Infinity
      ? 0
      : Math.min(
        (usage.employees /
          selectedPlan.maxEmployees) *
        100,
        100
      );

  const adminPercent =
    selectedPlan.maxAdmins === Infinity
      ? 0
      : Math.min(
        (usage.admins /
          selectedPlan.maxAdmins) *
        100,
        100
      );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifyEmployee, setNotifyEmployee] = useState(true);
  return (

    <MainLayout>



      <div className="settings-header-section">
        {/* Page Title Header Area */}
        <div className="settings-intro">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage appearance, notifications, account preferences, and role access.
          </p>
        </div>

        {/* Grid Container for Cards */}
        <div className="settings-cards-grid">

          {/* Card 1: Appearance */}
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
                <span className="status-icon">☀️</span>
                <span className="status-text">Current theme: light</span>
              </div>
              <button
  className="icon-btn"
  onClick={toggleTheme}
>
  {darkMode ? (
    <FaSun />
  ) : (
    <FaMoon />
  )}
</button>
            </div>
          </div>

          {/* Card 2: Notifications */}
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

          {/* Card 3: Account */}
          <div className="settings-card">
            <div className="card-header">
              <span className="card-icon">👤</span>
              <h2 className="card-title">Account</h2>
            </div>
            <div className="account-profile-row">
              <div className="profile-avatar">
                {(user?.fullname || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-details">

                <div className="profile-name">
                  {user?.fullname ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </div>

                <div className="profile-email">
                  {user?.email}
                </div>

                <div className="profile-badge">
                  {user?.role === "admin"
                    ? "Admin"
                    : "User"}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="subscription-page">

        <div className="subscription-card">

          <div className="subscription-title">
            <FaRegCreditCard />
            <h2>Subscription & Plan</h2>
          </div>

          <div className="current-plan-card">

            <div>
              <p>Current Plan</p>

              <h3>
                {selectedPlan.name}
              </h3>
            </div>

            <span className="plan-badge">
              {selectedPlan.name.toUpperCase()}
            </span>

          </div>

          <div className="usage-section">

            <h3>Usage</h3>

            <div className="usage-row">

              <span>
                Employees
              </span>

              <span>
                {usage.employees} /{" "}
                {selectedPlan.maxEmployees ===
                  Infinity
                  ? "Unlimited"
                  : selectedPlan.maxEmployees}
              </span>

            </div>

            {selectedPlan.maxEmployees !==
              Infinity && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${employeePercent}%`,
                    }}
                  />
                </div>
              )}

            <div className="usage-row">

              <span>Admins</span>

              <span>
                {usage.admins} /{" "}
                {selectedPlan.maxAdmins ===
                  Infinity
                  ? "Unlimited"
                  : selectedPlan.maxAdmins}
              </span>

            </div>

            {selectedPlan.maxAdmins !==
              Infinity && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${adminPercent}%`,
                    }}
                  />
                </div>
              )}

          </div>

          <div className="change-plan-section">

            <h3>Change Plan</h3>

            <p>
              Select a plan for your
              admin account. Other admins
              in your company keep their
              own plans.
            </p>

            <div className="plans-grid">

              {Object.entries(plans).map(
                ([key, plan]) => (
                  <div
                    key={key}
                    className={`plan-card ${currentPlan === key
                      ? "active-plan"
                      : ""
                      }`}
                  >

                    <div className="plan-header">

                      <div className="plan-name">

                        {plan.icon}

                        <h4>
                          {plan.name}
                        </h4>

                      </div>

                      {currentPlan ===
                        key && (
                          <span className="current-label">
                            CURRENT
                          </span>
                        )}

                    </div>

                    <ul>

                      <li>
                        <FaCheck />
                        Max Employees:
                        <strong>
                          {" "}
                          {plan.maxEmployees ===
                            Infinity
                            ? "Unlimited"
                            : plan.maxEmployees}
                        </strong>
                      </li>

                      <li>
                        <FaCheck />
                        Max Admins:
                        <strong>
                          {" "}
                          {plan.maxAdmins ===
                            Infinity
                            ? "Unlimited"
                            : plan.maxAdmins}
                        </strong>
                      </li>

                      <li>
                        <FaCheck />
                        Analytics Access:
                        <strong>
                          {" "}
                          {plan.analytics
                            ? "Yes"
                            : "No"}
                        </strong>
                      </li>

                      <li>
                        <FaCheck />
                        Audit Log Access:
                        <strong>
                          {" "}
                          {plan.auditLogs
                            ? "Yes"
                            : "No"}
                        </strong>
                      </li>

                      <li>
                        <FaCheck />
                        Export Access:
                        <strong>
                          {" "}
                          {plan.export
                            ? "Yes"
                            : "No"}
                        </strong>
                      </li>

                    </ul>

                    {currentPlan !==
                      key && (
                        <button
                          className="select-plan-btn"
                          onClick={() =>
                            setCurrentPlan(
                              key
                            )
                          }
                        >
                          Select{" "}
                          {plan.name}
                        </button>
                      )}

                  </div>
                )
              )}

            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Subscription;