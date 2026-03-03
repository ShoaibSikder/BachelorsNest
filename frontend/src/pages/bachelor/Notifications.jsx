import { useEffect, useState } from "react";
import { getNotifications } from "../../api/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-4 shadow rounded">
              <p>{n.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
