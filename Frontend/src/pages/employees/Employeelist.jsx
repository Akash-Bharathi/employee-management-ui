import { useState } from "react";
import { useEmployees } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import "./EmployeeList.css";
import AddEmployeeModal from "../../components/employees/AddEmployeeModal";
import { useAuthContext } from "../../context/AuthContext";

function EmployeeList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    
    // --- PAGINATION STATES ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Change this to 10, 15, etc. based on preference

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { employees, loading, addEmployee } = useEmployees();

    const handleAddEmployee = (newEmployee) => {
        addEmployee(newEmployee);
    };

    const getInitials = (name) => {
        if (!name) return "";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    // 1. Filter out empty/corrupt records first, then apply search/department filters
    const filteredEmployees = employees.filter(emp => {
        if (!emp.name || emp.name.trim() === "") return false; // Guard empty records

        const matchesSearch = emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepartment === "All Departments" || emp.department === selectedDepartment;
        return matchesSearch && matchesDept;
    });

    // --- PAGINATION LOGIC ---
    const totalItems = filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Slice data to only display the current page slice
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentPageData = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

    // Generate page numbers array (e.g., [1, 2, 3])
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset pagination to page 1 if user searches or filters
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeptChange = (e) => {
        setSelectedDepartment(e.target.value);
        setCurrentPage(1);
    };

    const uniqueDepartments = ["All Departments", ...new Set(employees.map(emp => emp.department).filter(Boolean))];

    return (
        <MainLayout>
            <div className="employee-page">
                <div className="employee-header">
                    <div className="header-text-group">
                        <h2>Employees</h2>
                        <p className="header-subtitle">Manage your team members, search, and filter by department.</p>
                    </div>

                    {user?.role === "admin" && (
                        <button className="add-employee-btn" onClick={() => setIsModalOpen(true)}>
                            + Add Employee
                        </button>
                    )}
                </div>

                <div className="employee-card">
                    <div className="table-controls-bar">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search employees..." 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="search-field"
                            />
                        </div>
                        
                        <select 
                            className="department-select"
                            value={selectedDepartment}
                            onChange={handleDeptChange}
                        >
                            {uniqueDepartments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <p className="loading-state">Loading employees...</p>
                    ) : (
                        <>
                            <div className="table-responsive-wrapper">
                                <table className="employee-table">
                                    <thead>
                                        <tr>
                                            <th>Employee <span className="sort-arrow">↑</span></th>
                                            <th>Role <span className="sort-arrow">↑↓</span></th>
                                            <th>Department <span className="sort-arrow">↑↓</span></th>
                                            <th>Status <span className="sort-arrow">↑↓</span></th>
                                            <th>Joined <span className="sort-arrow">↑↓</span></th>
                                            <th className="text-right">Actions <span className="sort-arrow">↑↓</span></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentPageData.map((employee) => {
                                            let statusClass = "status-badge status-inactive";
                                            if (employee.status === "active") statusClass = "status-badge status-active";
                                            if (employee.status === "on leave" || employee.status === "On Leave") statusClass = "status-badge status-onleave";

                                            return (
                                                <tr
                                                    key={employee.id}
                                                    onClick={() => navigate(`/employees/${employee.id}`)}
                                                    className="employee-row"
                                                >
                                                    <td>
                                                        <div className="profile-cell-block">
                                                            <div className="avatar-circle">
                                                                {getInitials(employee.name)}
                                                            </div>
                                                            <div className="user-info-text">
                                                                <div className="user-name">{employee.name}</div>
                                                                <div className="user-email">{employee.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span className="row-text-primary">{employee.role}</span></td>
                                                    <td><span className="row-text-secondary">{employee.department || "—"}</span></td>
                                                    <td><span className={statusClass}>{employee.status || "Inactive"}</span></td>
                                                    <td><span className="row-text-secondary">{employee.joinedDate || "—"}</span></td>
                                                    <td className="text-right">
                                                        <button className="action-view-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/employees/${employee.id}`);
                                                        }}>
                                                            View only
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- PAGINATION FOOTER CONTROLS --- */}
                            {totalPages > 1 && (
                                <div className="pagination-footer">
                                    <span className="pagination-info">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                                    </span>
                                    
                                    <div className="pagination-buttons">
                                        <button 
                                            className="page-nav-btn"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            &laquo; Prev
                                        </button>

                                        {pageNumbers.map(number => (
                                            <button
                                                key={number}
                                                onClick={() => handlePageChange(number)}
                                                className={`page-num-btn ${currentPage === number ? 'active' : ''}`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        <button 
                                            className="page-nav-btn"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next &raquo;
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {user?.role === "admin" && (
                <AddEmployeeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddEmployee}
                    employees={employees}
                />
            )}
        </MainLayout>
    );
}

export default EmployeeList;