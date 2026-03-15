import { useEffect, useState } from "react";
import api from "../../api/axios";

const OwnerHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("accounts/owner-dashboard/");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold">Total Properties</h2>
          <p className="text-3xl font-bold">{stats.total_properties}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold">Approved Properties</h2>
          <p className="text-3xl font-bold">{stats.approved_properties}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold">Pending Properties</h2>
          <p className="text-3xl font-bold">{stats.pending_properties}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold">Rent Requests</h2>
          <p className="text-3xl font-bold">{stats.rent_requests}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold">Unread Messages</h2>
          <p className="text-3xl font-bold">{stats.unread_messages}</p>
        </div>

      </div>
    </div>
  );
};

export default OwnerHome;
