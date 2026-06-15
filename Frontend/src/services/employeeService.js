import {
  getEmployeesApi,
  createEmployeeApi,
  getEmployeeByIdApi,
  updateEmployeeApi,
} from "../api/employeeApi";

export const getEmployees = async () => {
  const users = await getEmployeesApi();

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: "Developer",
    department: user.company?.name || "IT",
    reportingManager: "None",
    status: "active",
    joinedDate: new Date()
      .toISOString()
      .split("T")[0],
    company: "Company A",

    totalLeave: 20,
    usedLeave: 0,
    remainingLeave: 20,

    attendance: {
      present: 1,
      absent: 0,
      late: 0,
    },
  }));
};

export const createEmployee = async (
  employeeData
) => {
  return await createEmployeeApi(
    employeeData
  );
};

export const getEmployeeById = async (
  id
) => {
  return await getEmployeeByIdApi(id);
};

export const updateEmployee = async (
  id,
  employeeData
) => {
  return await updateEmployeeApi(
    id,
    employeeData
  );
};