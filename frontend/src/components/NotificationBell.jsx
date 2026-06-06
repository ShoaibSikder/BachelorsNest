import { useEffect, useState } from "react";
import { getWebSocketUrl } from "../config";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return undefined;

    const ws = new WebSocket(
      getWebSocketUrl(`ws/notifications/?token=${encodeURIComponent(token)}`),
    );

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setNotifications((prev) => [{ message: data.message }, ...prev]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="relative">
      🔔
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">
          {notifications.length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
