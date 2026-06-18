import MainLayout from "../../components/layout/MainLayout";
import { useAuthContext } from "../../context/AuthContext";
import "./UserDashboard.css";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
function Dashboard() {
    const { user } = useAuthContext();

    const [date, setDate] = useState(
        new Date()
    );

    const formattedDate =
        date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    const [showCalendar, setShowCalendar] =
        useState(false);

    return (
        <MainLayout>
            <div className="dashboard-page">

                <div className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Welcome back,{" "}
                            {user?.fullname || user?.email}!
                            Viewing analytics for{" "}
                            {user?.company}.
                        </p>
                    </div>

                    <div className="calendar-wrapper">

                        <button
                            className="dashboard-date"
                            onClick={() =>
                                setShowCalendar(
                                    !showCalendar
                                )
                            }
                        >
                            📅 {formattedDate}
                        </button>

                        {showCalendar && (
                            <div className="calendar-popup">
                                <Calendar
                                    value={date}
                                    onChange={setDate}
                                />
                            </div>
                        )}

                    </div>

                </div>

                <div className="dashboard-grid">

                    <div className="analytics-card">

                        <h2>
                            Analytics not available on your plan
                        </h2>

                        <p>
                            Upgrade to Professional or Enterprise
                            in{" "}
                            <Link
                                to="/subscription"
                                className="settings-link"
                            >
                                Subscription
                            </Link>{" "}
                            to unlock dashboard analytics,
                            charts, and KPIs.
                        </p>

                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

export default Dashboard;