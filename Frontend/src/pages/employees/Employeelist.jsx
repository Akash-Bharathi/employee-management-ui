import { useState } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import "./EmployeeList.css";
import AddEmployeeModal from "../../components/employees/AddEmployeeModal";
function EmployeeList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const {
        employees,
        loading,
        addEmployee,
    } = useEmployees();

    const handleAddEmployee = (
        newEmployee
    ) => {
        addEmployee(newEmployee);
    };
    return (
        <MainLayout>
            <div className="employee-page">

                <div className="employee-header">
                    <h2>Employees</h2>

                    <button
                        className="add-employee-btn"
                        onClick={() =>
                            setIsModalOpen(true)
                        }
                    >
                        + Add Employee
                    </button>
                </div>

                <div className="employee-card">

                    {loading ? (
                        <p>Loading employees...</p>
                    ) : (
                        <table className="employee-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        onClick={() =>
                                            navigate(
                                                `/employees/${employee.id}`
                                            )
                                        }
                                        className="employee-row"
                                    >
                                        <td>{employee.name}</td>

                                        <td>{employee.email}</td>

                                        <td>{employee.role}</td>

                                        <td>{employee.department}</td>

                                        <td>
                                            <span
                                                className={
                                                    employee.status === "active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {employee.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </div>
            </div>
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
                onSave={handleAddEmployee}
                employees={employees}
            />
        </MainLayout>
    );
}

export default EmployeeList;