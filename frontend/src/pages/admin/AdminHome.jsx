import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("accounts/admin-dashboard/");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
    );
  }

  const cards = [
    { title: "Total Users", value: stats.total_users },
    { title: "Active Users", value: stats.active_users },
    { title: "Total Properties", value: stats.total_properties },
    { title: "Pending Properties", value: stats.pending_properties },
    { title: "Total Requests", value: stats.total_requests },
    { title: "Approved Rentals", value: stats.approved_requests },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        System Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl hover:scale-[1.02] transition"
          >
            <h2 className="text-gray-600 dark:text-gray-300 text-sm">
              {item.title}
            </h2>
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-2">
              {item.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
