import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const dashboardResponse = await api.get("accounts/admin-dashboard/");
        const dashboard = dashboardResponse.data || {};

        setStats({
          totalUsers: dashboard.total_users ?? 0,
          activeUsers: dashboard.active_users ?? 0,
          newRegistrations: dashboard.new_registrations ?? 0,
          totalProperties: dashboard.total_properties ?? 0,
          activeProperties: dashboard.active_properties ?? 0,
          pendingProperties: dashboard.pending_properties ?? 0,
          rejectedProperties: dashboard.rejected_properties ?? 0,
          totalRequests: dashboard.total_requests ?? 0,
          approvedRentals: dashboard.approved_requests ?? 0,
          totalWishlistSaves: dashboard.total_wishlist_saves ?? 0,
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
