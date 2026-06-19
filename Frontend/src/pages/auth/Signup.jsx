import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    company: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error =
            "Full name can only contain letters and spaces";
        } else if (value.trim().length < 2) {
          error =
            "Full name must be at least 2 characters";
        }
        break;

      case "email":
        if (
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          error = "Enter a valid email address";
        }
        break;

      case "password":
        if (value.length > 0 && value.length < 8) {
          error =
            "Password must be at least 8 characters";
        }
        break;

      case "confirmPassword":
        if (
          formData.password &&
          value &&
          value !== formData.password
        ) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname.trim()) {
      toast.warning("Please enter your full name");
      return;
    }

    if (formData.fullname.trim().length < 2) {
      toast.warning(
        "Full name must contain at least 2 characters"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.warning(
        "Please enter a valid email address"
      );
      return;
    }

    if (!formData.company) {
      toast.warning("Please select a company");
      return;
    }

    if (!formData.role) {
      toast.warning("Please select an account role");
      return;
    }

    if (!formData.password) {
      toast.warning("Please create a password");
      return;
    }

    if (formData.password.length < 8) {
      toast.warning(
        "Password must be at least 8 characters long"
      );
      return;
    }

    if (!formData.confirmPassword) {
      toast.warning(
        "Please confirm your password"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }
    

    setErrors({});

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match"); return;
    }

    setLoading(true);

    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      company: formData.company,
      role: formData.role,
      password: formData.password,
    };

    const result = await signup(payload);

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(
      "Account created successfully"
    );

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };
  return (
    <div className="signup-container">
      <div className="signup-card">

        <div className="signup-icon">
          <FaUser />
        </div>

        <h2>Create Account</h2>
        <p>Sign up to access EEMS</p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="fullname"
              placeholder="Enter your name"
              value={formData.fullname}
              onChange={handleChange}
            />
            {errors.fullname && (
              <small className="error-text">
                {errors.fullname}
              </small>
            )}
          </div>

          <label>Email</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="error-text">
                {errors.email}
              </small>
            )}

          </div>


          <label>Company</label>
          <div className="select-wrapper">
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
            >
              <option value="">Select Company</option>
              <option value="Company A">Company A</option>
              <option value="Company B">Company B</option>
              <option value="Company C">Company C</option>
            </select>
          </div>

          <label>Account Role</label>
          <div className="select-wrapper">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>

              <option value="user">
                User - Dashboard & Employees Only
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>
          <label>Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <small className="error-text">
                {errors.password}
              </small>
            )}

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <small className="error-text">
                {errors.confirmPassword}
              </small>
            )}

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="signup-btn"
          >
            Sign Up
          </button>

          <div className="login-link">
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Signup;