import Dashboard from "./Dashboard";
import UserDashboard from "./UserDashboard";
import { useSubscription } from "../../context/SubscriptionContext";

function DashboardRouter() {
    const { planDetails } = useSubscription();

    if (!planDetails.analytics) {
        return <UserDashboard />;
    }

    return <Dashboard />;
}

export default DashboardRouter;