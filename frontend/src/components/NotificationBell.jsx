import { useEffect, useState } from "react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`,
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
