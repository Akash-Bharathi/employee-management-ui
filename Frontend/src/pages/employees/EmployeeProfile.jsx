import {
    useParams,
    useNavigate,
} from "react-router-dom"; import { useEmployees } from "../../context/EmployeeContext";
import MainLayout from "../../components/layout/MainLayout";
import "./EmployeeProfile.css";

function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        getEmployeeById,
        updateEmployee,
        loading,
    } = useEmployees();

    const employee =
        getEmployeeById(id);
    const handleToggleStatus = () => {
        updateEmployee(id, {
            status:
                employee.status === "active"
                    ? "inactive"
                    : "active",
        });
    };
    if (loading) {
        return (
            <MainLayout>
                <p>Loading employee...</p>
            </MainLayout>
        );
    }
    if (!employee) {
        return (
            <MainLayout>
                <p>Employee not found.</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>

            <div className="profile-page">

                <div className="profile-header">

                    <div className="profile-header-left">

                        <div className="profile-avatar">
                            {employee.name.charAt(0)}
                        </div>

                        <div>
                            <h1>{employee.name}</h1>

                            <p>{employee.role}</p>

                            <span className="status-badge">
                                {employee.status}
                            </span>
                        </div>

                    </div>

                    <div className="profile-header-right">

                        <button
                            className="back-btn"
                            onClick={() =>
                                navigate("/employees")
                            }
                        >
                            Back
                        </button>

                        <button
                            className="edit-btn"
                        >
                            Edit Employee
                        </button>

                        <button
                            className="deactivate-btn"
                            onClick={handleToggleStatus}
                        >
                            {employee.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                        </button>

                    </div>

                </div>

                <div className="profile-grid">

                    <div className="info-card">

                        <h3>Employee Information</h3>

                        <div className="info-row">
                            <span>Email</span>
                            <strong>
                                {employee.email}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Phone</span>
                            <strong>
                                {employee.phone}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Department</span>
                            <strong>
                                {employee.department}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>
                                Reporting Manager
                            </span>
                            <strong>
                                {employee.reportingManager}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Joined Date</span>
                            <strong>
                                {employee.joinedDate}
                            </strong>
                        </div>

                    </div>

                    <div className="leave-card">

                        <h3>Leave Balance</h3>

                        <div className="leave-number">
                            {
                                employee.remainingLeave
                            }
                        </div>

                        <p>Remaining Leave Days</p>

                    </div>

                </div>

                <div className="stats-grid">

                    <div className="stat-card">
                        <h4>Present</h4>

                        <span>
                            {
                                employee.attendance
                                    ?.present
                            }
                        </span>
                    </div>

                    <div className="stat-card">
                        <h4>Absent</h4>

                        <span>
                            {
                                employee.attendance
                                    ?.absent
                            }
                        </span>
                    </div>

                    <div className="stat-card">
                        <h4>Late</h4>

                        <span>
                            {
                                employee.attendance
                                    ?.late
                            }
                        </span>
                    </div>

                </div>

                <div className="leave-summary">

                    <h3>Leave Summary</h3>

                    <div className="leave-grid">

                        <div className="leave-box">
                            <span>Total</span>

                            <strong>
                                {employee.totalLeave}
                            </strong>
                        </div>

                        <div className="leave-box">
                            <span>Used</span>

                            <strong>
                                {employee.usedLeave}
                            </strong>
                        </div>

                        <div className="leave-box">
                            <span>Remaining</span>

                            <strong>
                                {
                                    employee.remainingLeave
                                }
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}

export default EmployeeProfile;