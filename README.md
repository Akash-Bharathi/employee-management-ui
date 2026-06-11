# Employee Management System (EEMS)

## Overview

Employee Management System (EEMS) is a full-stack web application built with React, FastAPI, and SQLite. The application provides secure user authentication, role-based access, company-wise member management, and user activation/deactivation functionality.

The system supports multiple companies and allows administrators to manage members while maintaining a clean and responsive user interface.

---

## Features

### Authentication

* User Registration (Signup)
* User Login
* Password Visibility Toggle
* JWT-Based Authentication
* Protected Routes
* Logout Functionality

### User Management

* View All Members
* Company-Based Member Filtering
* Activate Members
* Deactivate Members
* Role Management
* Active/Inactive Status Tracking

### Validation

#### Frontend Validation

* Full Name validation
* Email format validation
* Password length validation
* Confirm Password matching
* Real-time form validation

#### Backend Validation

* Email validation using Pydantic
* Password validation
* Company validation
* Role validation
* Request schema validation

### Notifications

* Success notifications
* Error notifications
* Warning notifications

Implemented using React Toastify.

---

## Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* React Icons
* React Toastify

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Passlib (Password Hashing)
* Python-JOSE (JWT Authentication)
* Pydantic

---

## Project Structure

### Frontend

```text
src/
│
├── api/
│   ├── authApi.js
│   └── userApi.js
│
├── components/
│   └── layout/
│       ├── Navbar.jsx
│       ├── MainLayout.jsx
│       └── ProtectedRoute.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   └── useAuth.js
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   │
│   └── members/
│       └── Members.jsx
│
├── services/
│   ├── authService.js
│   └── userService.js
│
├── App.jsx
├── main.jsx
└── index.css
```

### Backend

```text
Backend/
│
├── database.py
├── models.py
├── schemas.py
├── auth.py
├── app.py
└── employees.db
```
<img width="1920" height="913" alt="Screenshot 2026-06-11 at 17-16-47 Employee Management API - Swagger UI" src="https://github.com/user-attachments/assets/1fcd922e-3e13-458c-83c1-fe1ad6c74ac3" />
<img width="1920" height="913" alt="Screenshot 2026-06-11 at 17-16-25 employee-management" src="https://github.com/user-attachments/assets/df1937c0-1b1d-48cc-adae-df4a2d004ded" />
<img width="1920" height="913" alt="Screenshot 2026-06-11 at 17-16-37 employee-management" src="https://github.com/user-attachments/assets/d162e512-1deb-4e56-a043-3c91265080b2" />

<img width="1920" height="913" alt="Screenshot 2026-06-11 at 18-14-04 employee-management" src="https://github.com/user-attachments/assets/ab6d7702-6825-4159-b25b-0667a66f49f7" />
