import axios from "axios";

const EMPLOYEE_API =
    "https://jsonplaceholder.typicode.com/users";

export const getEmployeesApi = async () => {
    const response = await axios.get(
        EMPLOYEE_API
    );

    return response.data;
};


export const createEmployeeApi = async (
    employeeData
) => {
    const response = await axios.post(
        "http://localhost:8000/employees",
        employeeData
    );

    return response.data;
};

export const getEmployeeByIdApi = async (
    id
) => {
    const response = await axios.get(
        `http://localhost:8000/employees/${id}`
    );

    return response.data;
};

export const updateEmployeeApi = async (
    id,
    employeeData
) => {
    const response = await axios.put(
        `http://localhost:8000/employees/${id}`,
        employeeData
    );

    return response.data;
};