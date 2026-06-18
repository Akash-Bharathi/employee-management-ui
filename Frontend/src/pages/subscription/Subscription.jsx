import { useSubscription } from "../../context/SubscriptionContext";
import MainLayout from "../../components/layout/MainLayout";
import {
  FaRegCreditCard,
  FaCheck,
} from "react-icons/fa";
import "./Subscription.css";
import { useEmployees } from "../../context/EmployeeContext";

function Subscription() {
  const { employees } = useEmployees();
  const { currentPlan, setCurrentPlan, planDetails, plans } = useSubscription();

  const usage = {
    employees: employees?.length || 0,
    admins:
      employees?.filter(
        (employee) =>
          employee.role?.toLowerCase() === "admin"
      ).length || 0,
  };

  const selectedPlan = planDetails;
  const employeePercent =
    selectedPlan.maxEmployees === Infinity
      ? 0
      : Math.min(
          (usage.employees / selectedPlan.maxEmployees) * 100,
          100
        );

  const adminPercent =
    selectedPlan.maxAdmins === Infinity
      ? 0
      : Math.min(
          (usage.admins / selectedPlan.maxAdmins) * 100,
          100
        );

  return (
    <MainLayout>
      <div className="subscription-page">
        <div className="subscription-card">
          <div className="subscription-title">
            <FaRegCreditCard />
            <h2>Subscription & Plan</h2>
          </div>

          <div className="current-plan-card">
            <div>
              <p>Current Plan</p>
              <h3>{selectedPlan.name}</h3>
            </div>
            <span className="plan-badge">
              {selectedPlan.name.toUpperCase()}
            </span>
          </div>

          <div className="usage-section">
            <h3>Usage</h3>

            <div className="usage-row">
              <span>Employees</span>
              <span>
                {usage.employees} / {selectedPlan.maxEmployees === Infinity ? "Unlimited" : selectedPlan.maxEmployees}
              </span>
            </div>

            {selectedPlan.maxEmployees !== Infinity && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${employeePercent}%` }} />
              </div>
            )}

            <div className="usage-row">
              <span>Admins</span>
              <span>
                {usage.admins} / {selectedPlan.maxAdmins === Infinity ? "Unlimited" : selectedPlan.maxAdmins}
              </span>
            </div>

            {selectedPlan.maxAdmins !== Infinity && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${adminPercent}%` }} />
              </div>
            )}
          </div>

          <div className="change-plan-section">
            <h3>Change Plan</h3>
            <p>
              Select a plan for your admin account. Other admins in your company keep their own plans.
            </p>

            <div className="plans-grid">
              {Object.entries(plans).map(([key, plan]) => (
                <div key={key} className={`plan-card ${currentPlan === key ? "active-plan" : ""}`}>
                  <div className="plan-header">
                    <div className="plan-name">
                      {plan.icon}
                      <h4>{plan.name}</h4>
                    </div>
                    {currentPlan === key && <span className="current-label">CURRENT</span>}
                  </div>

                  <ul>
                    <li>
                      <FaCheck /> Max Employees:
                      <strong>
                        {plan.maxEmployees === Infinity ? "Unlimited" : plan.maxEmployees}
                      </strong>
                    </li>
                    <li>
                      <FaCheck /> Max Admins:
                      <strong>
                        {plan.maxAdmins === Infinity ? "Unlimited" : plan.maxAdmins}
                      </strong>
                    </li>
                    <li>
                      <FaCheck /> Analytics Access:
                      <strong>{plan.analytics ? "Yes" : "No"}</strong>
                    </li>
                    <li>
                      <FaCheck /> Audit Log Access:
                      <strong>{plan.auditLogs ? "Yes" : "No"}</strong>
                    </li>
                    <li>
                      <FaCheck /> Export Access:
                      <strong>{plan.export ? "Yes" : "No"}</strong>
                    </li>
                  </ul>

                  {currentPlan !== key && (
                    <button className="select-plan-btn" onClick={() => setCurrentPlan(key)}>
                      Select {plan.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Subscription;