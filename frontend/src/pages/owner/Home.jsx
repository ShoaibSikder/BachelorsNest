import MetricOverview from "../../components/MetricOverview";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import PageFallback from "../../components/common/PageFallback";

const OwnerHome = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("accounts/owner-dashboard/");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) {
    return <PageFallback />;
  }

  // Dashboard items as a flat array
  const dashboardItems = [
    { title: "Total Properties", value: stats.total_properties },
    { title: "Approved Properties", value: stats.approved_properties },
    { title: "Pending Properties", value: stats.pending_properties },
    { title: "Total Rent Requests", value: stats.total_rent_requests },
    { title: "Approved Rent Requests", value: stats.approved_rent_requests },
  ];

  return <MetricOverview title="Property overview" metrics={dashboardItems} />;
};
export default OwnerHome;
