import {
  FaBars,
  FaUsers,
  FaClipboardList,
  FaBuilding,
  FaFileAlt,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
function Navbar({
  selectedCompany,
  setSelectedCompany,
  toggleSidebar,
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const {
    darkMode,
    toggleTheme,
  } = useTheme();
  const handleLogout = () => {
    logout();

    toast.info(
      "You have been logged out"
    );

    navigate("/login");
  };
  return (
    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        <div className="brand">
          <div className="brand-logo">👥</div>

          <div>
            <h3>EEMS</h3>
            <span>Enterprise Employee Management</span>
          </div>
        </div>

        {/* <div className="company-badge">
          
          Company A
        </div> */}
      </div>
      <div className="company-tabs">

        <button
          className={
            selectedCompany === null
              ? "active-tab"
              : ""
          }
          onClick={() =>
            setSelectedCompany(null)
          }
        >
          Employees
        </button>

        <button
          className={
            selectedCompany === "Company A"
              ? "active-tab"
              : ""
          }
          onClick={() =>
            setSelectedCompany("Company A")
          }
        >
          Company A
        </button>

        <button
          className={
            selectedCompany === "Company B"
              ? "active-tab"
              : ""
          }
          onClick={() =>
            setSelectedCompany("Company B")
          }
        >
          Company B
        </button>

        <button
          className={
            selectedCompany === "Company C"
              ? "active-tab"
              : ""
          }
          onClick={() =>
            setSelectedCompany("Company C")
          }
        >
          Company C
        </button>

      </div>
      <nav className="navbar-center">

        <a href="#">
          <FaUsers />
          Team
        </a>

        <a href="#">
          <FaClipboardList />
          Attendance
        </a>

        <a href="#">
          <FaBuilding />
          Departments
        </a>

        <a href="#">
          <FaFileAlt />
          Audit Logs
        </a>

      </nav>

      <div className="navbar-right">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
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

        <button className="icon-btn">
          <FaBell />
        </button>

        <div className="profile">

          <div className="avatar">
            {user?.fullname?.charAt(0) || "U"}
          </div>

          <span>
            {user?.fullname || "User"}
          </span>


        </div>

      </div>

    </header>
  );
}

export default Navbar;