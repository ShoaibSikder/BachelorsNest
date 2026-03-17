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
      } catch {
        console.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-gray-600 dark:text-gray-300">
        Loading notifications...
      </p>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 transition">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No notifications yet.
        </p>
      ) : (
        <div className="space-y-5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl"
            >
              <p className="text-gray-800 dark:text-white">{n.message}</p>

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
