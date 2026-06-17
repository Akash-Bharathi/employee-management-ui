import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>

      <AuthProvider>
        <EmployeeProvider>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            theme="light"
          />
        </EmployeeProvider>
      </AuthProvider>
      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
);