import MetricOverview from "../../components/MetricOverview";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import PageFallback from "../../components/common/PageFallback";

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
    return <PageFallback />;
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

  return <MetricOverview title="Reports and analytics" metrics={cards} />;
};
export default AdminReports;
