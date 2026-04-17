import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAllProperties } from "../../api/adminPropertyApi";
import { API_ENDPOINTS } from "../../config";

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const [usersResponse, propertiesResponse, rentalsResponse] =
          await Promise.all([
            api.get("accounts/admin/users/"),
            getAllProperties(),
            api.get(API_ENDPOINTS.RENTALS_ADMIN),
          ]);

        const users = usersResponse.data || [];
        const properties = propertiesResponse.data || [];
        const rentals = rentalsResponse.data || [];

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalUsers = users.length;
        const activeUsers = users.filter((user) => user.is_active).length;
        const newRegistrations = users.filter((user) => {
          const joined = user.date_joined ? new Date(user.date_joined) : null;
          return joined && joined >= sevenDaysAgo;
        }).length;

        const activeProperties = properties.filter(
          (property) => property.is_approved,
        ).length;
        const pendingProperties = properties.filter(
          (property) => !property.is_approved && !property.is_rejected,
        ).length;
        const rejectedProperties = properties.filter(
          (property) => property.is_rejected,
        ).length;

        const totalRequests = rentals.length;
        const approvedRentals = rentals.filter(
          (request) => request.status === "accepted",
        ).length;

        setStats({
          totalUsers,
          activeUsers,
          newRegistrations,
          activeProperties,
          pendingProperties,
          rejectedProperties,
          totalRequests,
          approvedRentals,
        });
      } catch (err) {
        console.error("Failed to load reports", err);
        setError("Unable to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-800 dark:text-white">
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Active Users", value: stats.activeUsers },
    { title: "New Registrations (7d)", value: stats.newRegistrations },
    { title: "Active Properties", value: stats.activeProperties },
    { title: "Pending Properties", value: stats.pendingProperties },
    { title: "Rejected Properties", value: stats.rejectedProperties },
    { title: "Total Rental Requests", value: stats.totalRequests },
    { title: "Approved Rentals", value: stats.approvedRentals },
  ];

  return (
    <div className="text-gray-800 dark:text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of users, properties, and rental activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.title}
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
              {card.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
