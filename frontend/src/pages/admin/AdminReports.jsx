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
        const [
          dashboardResponse,
          usersResponse,
          propertiesResponse,
          rentalsResponse,
        ] =
          await Promise.all([
            api.get("accounts/admin-dashboard/"),
            api.get("accounts/admin/users/"),
            getAllProperties(),
            api.get(API_ENDPOINTS.RENTALS_ADMIN),
          ]);

        const dashboard = dashboardResponse.data || {};
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

        const activeProperties =
          dashboard.total_properties - dashboard.pending_properties;
        const rejectedProperties = properties.filter(
          (property) => property.is_rejected,
        ).length;

        const totalWishlistSaves = properties.reduce(
          (sum, property) => sum + (property.saved_count || 0),
          0,
        );

        setStats({
          totalUsers: dashboard.total_users ?? totalUsers,
          activeUsers: dashboard.active_users ?? activeUsers,
          newRegistrations,
          totalProperties: dashboard.total_properties ?? properties.length,
          activeProperties,
          pendingProperties:
            dashboard.pending_properties ??
            properties.filter(
              (property) => !property.is_approved && !property.is_rejected,
            ).length,
          rejectedProperties,
          totalRequests: dashboard.total_requests ?? rentals.length,
          approvedRentals:
            dashboard.approved_requests ??
            rentals.filter((request) => request.status === "accepted").length,
          totalWishlistSaves,
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
    { title: "Total Properties", value: stats.totalProperties },
    { title: "Pending Properties", value: stats.pendingProperties },
    { title: "Total Rental Requests", value: stats.totalRequests },
    { title: "Approved Rentals", value: stats.approvedRentals },
    { title: "New Registrations (7d)", value: stats.newRegistrations },
    { title: "Active Properties", value: stats.activeProperties },
    { title: "Rejected Properties", value: stats.rejectedProperties },
    { title: "Wishlist Saves", value: stats.totalWishlistSaves },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden text-gray-800 dark:text-white sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 break-words text-2xl font-bold sm:text-3xl">
          Reports & Analytics
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
          Dashboard overview plus detailed admin analytics for users,
          properties, and rental activity.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="min-w-0 rounded-2xl bg-white p-5 shadow-lg transition hover:shadow-xl dark:bg-gray-800 sm:rounded-3xl sm:p-6"
          >
            <p className="break-words text-sm text-gray-500 dark:text-gray-400">
              {card.title}
            </p>
            <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {card.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
