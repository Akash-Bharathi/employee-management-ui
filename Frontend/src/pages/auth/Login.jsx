import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          error = "Enter a valid email address";
        }
        break;

      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 8) {
          error =
            "Password must be at least 8 characters";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.warning("Please enter your email address");
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

    if (!formData.password.trim()) {
      toast.warning("Please enter your password");
      return;
    }


    setLoading(true);

    const result = await login(formData);


    if (!result.success) {
      toast.error(
        result.error ||
        "Invalid email or password"
      );

      setLoading(false);
      return;
    }

    toast.success("Login successful");

    setTimeout(() => {
      navigate("/employees");
    }, 800);
  };
  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-icon">
          <FaLock />
        </div>

        <h2>Welcome Back</h2>
        <p>Login to access EEMS</p>

        <form onSubmit={handleSubmit}>

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
          </div>

          {errors.email && (
            <small className="error-text">
              {errors.email}
            </small>
          )}

          <label>Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />


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


          {errors.password && (
            <small className="error-text">
              {errors.password}
            </small>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <div className="signup-link">
            Don't have an account?
            <Link to="/signup"> Sign Up</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;