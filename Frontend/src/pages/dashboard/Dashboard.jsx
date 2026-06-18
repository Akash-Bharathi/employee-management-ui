import MainLayout from "../../components/layout/MainLayout";
import { useAuthContext } from "../../context/AuthContext";
import "./Dashboard.css";
import { useEmployees } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
function Dashboard() {
    const { user } = useAuthContext();
    const { employees } = useEmployees();

    const departmentData =
        Object.values(
            employees.reduce(
                (acc, employee) => {
                    const department =
                        employee.department ||
                        "Unknown";

                    if (!acc[department]) {
                        acc[department] = {
                            department,
                            employees: 0,
                        };
                    }

                    acc[department]
                        .employees++;

                    return acc;
                },
                {}
            )
        );
    const statusCounts =
        employees.reduce(
            (acc, employee) => {
                const status =
                    employee.status ||
                    "Unknown";

                acc[status] =
                    (acc[status] || 0) + 1;

                return acc;
            },
            {}
        );

    const statusData =
        Object.entries(
            statusCounts
        ).map(
            ([name, value]) => ({
                name,
                value,
            })
        );

    const STATUS_COLORS = [
        "#22c55e", // green
        "#f59e0b", // orange
        "#ef4444", // red
    ];
    const ROLE_COLORS = [
        "#2563eb",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#f59e0b",
    ];
    const attendanceData = [
        { name: '06-10', absent: 3, onLeave: 4, present: 16 },
        { name: '06-11', absent: 4, onLeave: 6, present: 13 },
        { name: '06-12', absent: 4, onLeave: 4, present: 15 },
        { name: '06-13', absent: 2, onLeave: 4, present: 17 },
        { name: '06-14', absent: 4, onLeave: 5, present: 14 },
        { name: '06-15', absent: 4, onLeave: 6, present: 13 },
        { name: '06-16', absent: 2, onLeave: 4, present: 17 },
    ];
    const totalEmployees =
        employees?.length || 0;

    const activeEmployees =
        employees?.filter(
            (employee) =>
                employee.status
                    ?.toLowerCase() === "active"
        ).length || 0;

    const totalDepartments =
        new Set(
            employees?.map(
                (employee) =>
                    employee.department
            )
        ).size;
    const navigate = useNavigate();
    const roleData =
        Object.values(
            employees.reduce(
                (acc, employee) => {
                    const role =
                        employee.role ||
                        "Unknown";

                    if (!acc[role]) {
                        acc[role] = {
                            role,
                            count: 0,
                        };
                    }

                    acc[role].count++;

                    return acc;
                },
                {}
            )
        );

    return (
        <MainLayout>
            <div className="dashboard-page">

                {/* HEADER */}

                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Welcome back,{" "}
                            {user?.fullname || user?.email?.split("@")[0]}!
                            Viewing analytics for Company A.
                        </p>
                    </div>

                    <div className="dashboard-date">
                        📅 June 16, 2026
                    </div>
                </div>

                {/* KPI CARDS */}

                <div className="stats-grid">

                    <div className="stat-card">
                        <h4>Total Employees</h4>
                        <h2>{totalEmployees}</h2>
                        <h4>Company workforce</h4>
                    </div>

                    <div className="stat-card">
                        <h4>Active Employees</h4>
                        <h2>{activeEmployees}</h2>
                        <h4>Currently active</h4>
                    </div>

                    <div className="stat-card">
                        <h4>Total Departments</h4>
                        <h2>{totalDepartments}</h2>
                        <h4>Organization units</h4>
                    </div>

                    <div className="stat-card">
                        <h4>Pending Requests</h4>
                        <h2>1</h2>
                        <h4>Role change approvals</h4>
                    </div>

                </div>

                {/* CHARTS */}

                <div className="charts-grid">

                    <div className="chart-card">
                        <h3>
                            Employee Distribution by Department
                        </h3>

                        <div className="chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={260}
                            >
                                <BarChart
                                    data={departmentData}
                                    layout="vertical"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis type="number" />

                                    <YAxis
                                        dataKey="department"
                                        type="category"
                                        width={90}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="employees"
                                        fill="#2563eb"
                                        radius={[0, 6, 6, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>
                            Employee Count by Role
                        </h3>

                        <div className="chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={260}
                            >
                                <BarChart data={roleData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="role" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="count"
                                        radius={[6, 6, 0, 0]}
                                    >
                                        {roleData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        ROLE_COLORS[
                                                        index %
                                                        ROLE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>
                            Employee Status Overview
                        </h3>

                        <div
                            className="chart-container"
                            style={{ height: "260px" }}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>

                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                    >
                                        {statusData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        STATUS_COLORS[index]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                    />

                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW */}

                <div className="bottom-grid">

                    <div className="chart-card">
                        <h3 className="chart-title">Attendance Analytics</h3>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={attendanceData}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={true}
                                        stroke="#e2e8f0"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={{ stroke: '#64748b' }}
                                        tick={{ fill: '#64748b', fontSize: 14 }}
                                    />

                                    <YAxis
                                        domain={[0, 20]}
                                        tickCount={5}
                                        tickLine={false}
                                        axisLine={{ stroke: '#64748b' }}
                                        tick={{ fill: '#64748b', fontSize: 14 }}
                                    />

                                    <Tooltip />

                                    <Legend
                                        iconType="circle"
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        iconSize={8}
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />

                                    {/* Absent (Red Line) */}
                                    <Line
                                        type="stepAfter"
                                        dataKey="absent"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={{ stroke: '#ef4444', strokeWidth: 2, fill: '#fff', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />

                                    {/* On Leave (Yellow Line) */}
                                    <Line
                                        type="stepAfter"
                                        dataKey="onLeave"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ stroke: '#f59e0b', strokeWidth: 2, fill: '#fff', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />

                                    {/* Present (Green Line) */}
                                    <Line
                                        type="stepAfter"
                                        dataKey="present"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ stroke: '#10b981', strokeWidth: 2, fill: '#fff', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="chart-card">

                        <div className="recent-header">

                            <h3>Recent Employees</h3>

                            <button
                                className="view-all-btn"
                                onClick={() =>
                                    navigate("/employees")
                                }
                            >
                                View All
                            </button>

                        </div>

                        {employees
                            ?.slice(0, 4)
                            .map((employee) => (
                                <div
                                    key={employee.id}
                                    className="employee-item"
                                >
                                    <div className="employee-avatar">
                                        {employee.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="employee-info">

                                        <h4>{employee.name}</h4>

                                        <p>
                                            {employee.role} •{" "}
                                            {employee.department}
                                        </p>

                                    </div>

                                </div>
                            ))}

                    </div>


                </div>

            </div>
        </MainLayout>
    );
}

export default Dashboard;