import MainLayout from "../../components/layout/MainLayout";
import "./SecurityMonitoring.css";
import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { getSecuritySummary, getTopRiskUsers, getTopRiskCompanies, getRecentSecurityEvents, resolveSecurityEvent } from "../../services/securityService";

function SecurityMonitoring() {

    const [summary, setSummary] =
        useState(null);

    const [events, setEvents] =
        useState([]);

    const [riskUsers, setRiskUsers] =
        useState([]);

    const [riskCompanies, setRiskCompanies] =
        useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const EVENTS_PER_PAGE = 5;
    const handleResolveAlert = async (eventId) => {
        try {
            await resolveSecurityEvent(eventId);

            const eventsData =
                await getRecentSecurityEvents();

            const summaryData =
                await getSecuritySummary();

            setEvents(eventsData);
            setSummary(summaryData);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        const loadData = async () => {

            const summaryData =
                await getSecuritySummary();

            const usersData =
                await getTopRiskUsers();

            const companiesData =
                await getTopRiskCompanies();
            const eventsData =
                await getRecentSecurityEvents();

            setEvents(eventsData);

            setSummary(summaryData);
            setRiskUsers(usersData);
            setRiskCompanies(companiesData);
        };

        loadData();

    }, []);
    const totalPages = Math.ceil(
        events.length / EVENTS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * EVENTS_PER_PAGE;

    const currentEvents =
        events.slice(
            startIndex,
            startIndex + EVENTS_PER_PAGE
        );

    return (
        <MainLayout>

            <div className="security-page">

                <div className="security-header">
                    <h1>Security Monitoring</h1>
                    <p>
                        Track alerts, risk scores,
                        and recent security events
                        for your organization.
                    </p>
                </div>

                <div className="security-stats">

                    <div className="security-card">
                        <h4>Security Alerts Today</h4>
                        <h2>{summary?.alerts_today || 0}</h2>
                        <p>Generated today</p>
                    </div>

                    <div className="security-card">
                        <h4>Open Alerts</h4>
                        <h2 className="warning">{summary?.open_alerts || 0}</h2>
                        <p>Needs attention</p>
                    </div>

                    <div className="security-card">
                        <h4>Resolved Alerts</h4>
                        <h2>{summary?.resolved_alerts || 0}</h2>
                        <p>Closed incidents</p>
                    </div>

                    <div className="security-card">
                        <h4>Critical Alerts</h4>
                        <h2 className="danger">{summary?.critical_alerts || 0}</h2>
                        <p>Open critical issues</p>
                    </div>

                </div>

                <div className="security-risk-grid">

                    <div className="risk-card">

                        <h3>Top Risk Users</h3>

                        {riskUsers.length === 0 ? (

                            <div className="risk-sub">
                                No risk users found
                            </div>

                        ) : (

                            riskUsers.map((user, index) => (

                                <div
                                    key={index}
                                    className="risk-row"
                                >
                                    <div className="risk-user-info">

                                        <div className="risk-avatar">
                                            {user.user_email?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>

                                            <div className="risk-name">
                                                {user.user_email?.split("@")[0]}
                                            </div>

                                            <div className="risk-sub">
                                                {user.user_email}
                                            </div>

                                        </div>

                                    </div>

                                    <div className="risk-score-section">

                                        <span className="risk-score">
                                            {user.risk_score}
                                        </span>

                                        <span
                                            className={`risk-badge ${user.risk_level === "HIGH"
                                                ? "high"
                                                : user.risk_level === "MEDIUM"
                                                    ? "medium"
                                                    : "low"
                                                }`}
                                        >
                                            {user.risk_level}
                                        </span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                    <div className="risk-card">

                        <h3>Top Risk Companies</h3>

                        {riskCompanies.length === 0 ? (

                            <div className="risk-sub">
                                No risk companies found
                            </div>

                        ) : (

                            riskCompanies.map((company, index) => (

                                <div
                                    key={index}
                                    className="risk-row"
                                >
                                    <div className="risk-company-info">

                                        <div className="risk-company-icon">
                                            <FaShieldAlt />
                                        </div>

                                        <div>

                                            <div className="risk-name">
                                                {company.company}
                                            </div>

                                            <div className="risk-sub">
                                                {company.user_count} users tracked
                                            </div>

                                        </div>

                                    </div>

                                    <div className="risk-score-section">

                                        <span className="risk-score">
                                            {company.risk_score}
                                        </span>

                                        <span
                                            className={`risk-badge ${company.risk_level === "HIGH"
                                                ? "high"
                                                : company.risk_level === "MEDIUM"
                                                    ? "medium"
                                                    : "low"
                                                }`}
                                        >
                                            {company.risk_level}
                                        </span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>
                    <div className="security-events-card">

                        <div className="security-events-header">

                            <h3>
                                Recent Security Events
                            </h3>

                        </div>

                        {events.length === 0 ? (

                            <div className="security-empty-state">

                                No security events recorded.

                            </div>

                        ) : (

                            currentEvents.map((event) => (

                                <div
                                    key={event.id}
                                    className="security-event-row"
                                >

                                    <div>

                                        <div className="event-title">
                                            {event.event_type}
                                        </div>

                                        <div className="event-description">
                                            {event.description}
                                        </div>

                                    </div>


                                    <div className="event-meta">
                                        <div
                                            className={`event-status ${event.status === "OPEN"
                                                ? "status-open"
                                                : "status-resolved"
                                                }`}
                                        >
                                            {event.status}
                                        </div>
                                        {event.status === "OPEN" && (
                                            <button
                                                className="resolve-btn"
                                                onClick={() =>
                                                    handleResolveAlert(event.id)
                                                }
                                            >
                                                Resolve
                                            </button>
                                        )}


                                        <div className="event-date">
                                            {new Date(
                                                event.created_at
                                            ).toLocaleString()}
                                        </div>

                                        <div
                                            className={`event-severity ${event.severity?.toLowerCase()
                                                }`}
                                        >
                                            {event.severity}
                                        </div>

                                    </div>

                                </div>

                            ))

                        )}
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                Previous
                            </button>

                            <div className="pagination-pages">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => (
                                        <button
                                            key={index}
                                            className={`page-btn ${currentPage === index + 1
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                setCurrentPage(
                                                    index + 1
                                                )
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                className="pagination-btn"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>

            </div>

        </MainLayout>
    );
}

export default SecurityMonitoring;