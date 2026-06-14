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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardItems.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl"
          >
            <h2 className="text-gray-600 dark:text-gray-300 text-sm">
              {item.title}
            </h2>
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerHome;
