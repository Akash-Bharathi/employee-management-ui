import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getEmployees,
} from "../services/employeeService";

const EmployeeContext =
  createContext();

export function EmployeeProvider({
  children,
}) {
  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const storedEmployees =
        localStorage.getItem(
          "employees"
        );

      if (storedEmployees) {
        setEmployees(
          JSON.parse(storedEmployees)
        );

        return;
      }

      const apiEmployees =
        await getEmployees();

      setEmployees(apiEmployees);

      localStorage.setItem(
        "employees",
        JSON.stringify(
          apiEmployees
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = (
    employee
  ) => {
    const updatedEmployees = [
      employee,
      ...employees,
    ];

    setEmployees(
      updatedEmployees
    );

    localStorage.setItem(
      "employees",
      JSON.stringify(
        updatedEmployees
      )
    );
  };

  const getEmployeeById = (
    id
  ) => {
    return employees.find(
      (employee) =>
        String(employee.id) ===
        String(id)
    );
  };

  const updateEmployee = (
    id,
    updatedData
  ) => {
    const updatedEmployees =
      employees.map(
        (employee) =>
          employee.id === id
            ? {
                ...employee,
                ...updatedData,
              }
            : employee
      );

    setEmployees(
      updatedEmployees
    );

    localStorage.setItem(
      "employees",
      JSON.stringify(
        updatedEmployees
      )
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,

        addEmployee,
        getEmployeeById,
        updateEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export const useEmployees =
  () =>
    useContext(
      EmployeeContext
    );