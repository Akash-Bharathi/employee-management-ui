import {
    FaChartPie,
    FaUsers,
    FaBuilding,
    FaClock,
    FaIndustry,
    FaEnvelopeOpenText,
    FaClipboardList,
    FaCog,
    FaChevronDown,
    FaSignOutAlt,
} from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Sidebar.css";

function Sidebar({
    isOpen,
    onClose,
}) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user } = useAuthContext();
    const menuItems = [
        {
            label: "Dashboard",
            icon: <FaChartPie />,
            path: "/dashboard",
        },
        {
            label: "Employees",
            icon: <FaUsers />,
            path: "/employees",
        },
        {
            label: "Departments",
            icon: <FaBuilding />,
            path: "/departments",
        },
        {
            label: "Attendance",
            icon: <FaClock />,
            path: "/attendance",
        },
        {
            label: "Companies",
            icon: <FaIndustry />,
            path: "/companies",
        },
        {
            label: "Invitations",
            icon: <FaEnvelopeOpenText />,
            path: "/invitations",
        },
        {
            label: "Audit Logs",
            icon: <FaClipboardList />,
            path: "/audit-logs",
        },
        {
            label: "Settings",
            icon: <FaCog />,
            path: "/Subscription",
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            className={`sidebar ${isOpen ? "sidebar-open" : ""
                }`}
        >
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    👥
                </div>

                <div>
                    <h3>EEMS</h3>
                    <span>
                        Employee Management
                    </span>
                </div>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        {item.icon}

                        <span>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

                <div className="sidebar-profile">

                    <div className="sidebar-avatar">
                        {user?.fullname?.charAt(0) || "U"}
                    </div>

                    <div className="sidebar-user-info">
                        <strong>
                            {user?.fullname || "User"}
                        </strong>

                        <span>
                            {user?.role || "Member"}
                        </span>
                    </div>

                    <FaChevronDown />
                </div>

            </div>
        </aside>
    );
}

export default Sidebar;