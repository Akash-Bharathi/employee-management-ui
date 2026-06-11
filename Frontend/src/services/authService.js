import * as authApi from "../api/authApi";

/**
 * Register a new user
 */
export const signupUser = async (userData) => {
  try {
    const response = await authApi.signup(userData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        "Signup failed",
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  try {
    const response = await authApi.login(credentials);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        "Login failed",
    };
  }
};