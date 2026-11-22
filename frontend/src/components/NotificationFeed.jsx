import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "../api/notificationApi";
import PageFallback from "./common/PageFallback";

export default function NotificationFeed() {
  const [items,setItems] = useState(null);
  const [error,setError] = useState(false);
  useEffect(() => {
    let active = true;
    getNotifications().then(({data}) => { if (active) setItems(data); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return <section><h1 className="mb-6">Notifications</h1>{error ? <p role="alert">Unable to load notifications.</p> :
    !items ? <PageFallback/> : !items.length ? <div className="bn-empty"><Bell size={26}/><p>No notifications yet</p></div> :
    <ul className="bn-feed">{items.map(item=><li key={item.id}><span className="bn-feed-icon"><Bell size={17}/></span><div><p>{item.message}</p><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div></li>)}</ul>}</section>;
}
