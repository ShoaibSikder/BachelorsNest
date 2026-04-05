import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Bell,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  const profilePath = "/admin/profile";

  const menuItems = [
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Properties", icon: Building2, path: "/admin/properties" },
    { name: "Requests", icon: ClipboardList, path: "/admin/requests" },
    { name: "Notifications", icon: Bell, path: "/admin/notifications" },
    { name: "Security", icon: Shield, path: "/admin/security" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${
          open ? "w-64" : "w-20"
        } fixed h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white transition-all flex flex-col justify-between z-50 ${
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : ""
        }`}
      >
        <div>
          {/* HEADER */}
          <div className="flex justify-between p-4">
            {open && <h2 className="font-bold text-xl">Admin Panel</h2>}
            <button onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>

          {/* PROFILE + DIVIDER */}
          <div className="px-4 pb-4 flex flex-col gap-4">
            {user && (
              <button
                onClick={() => handleMenuClick(profilePath)}
                className={`${
                  open ? "flex gap-3 items-center" : "flex justify-center"
                } p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/20 transition`}
              >
                <div className="h-11 w-11 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                  {user.profile_image ? (
                    <img
                      src={getImageUrl(user.profile_image)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.username?.[0]?.toUpperCase()}</span>
                  )}
                </div>

                {open && (
                  <div>
                    <p className="text-sm font-semibold">
                      {user.username || "Admin"}
                    </p>
                    <p className="text-xs text-white/70">
                      {user.role || "Admin"}
                    </p>
                  </div>
                )}
              </button>
            )}

            {open && <div className="h-px bg-white/20 rounded-full" />}
          </div>

          {/* MENU */}
          <ul className="space-y-2 px-2">
            {menuItems.map((item, i) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={i}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`flex items-center gap-3 p-3 rounded-lg w-full ${
                      isActive
                        ? "bg-white text-blue-600 font-semibold"
                        : "hover:bg-white/20"
                    }`}
                  >
                    <item.icon size={20} />
                    {open && item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full justify-center gap-2 bg-white text-red-500 py-2 rounded-lg"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-6 ${open ? "ml-64" : "ml-20"}`}>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
