import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  FileText,
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";

const OwnerLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
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

  const profilePath = "/owner/profile";

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/owner" },
    { name: "My Properties", icon: FileText, path: "/owner/properties" },
    { name: "Add Property", icon: FileText, path: "/owner/properties/add" },
    { name: "Requests", icon: FileText, path: "/owner/requests" },
    { name: "Notifications", icon: Bell, path: "/owner/notifications" },
    { name: "Chats", icon: MessageSquare, path: "/owner/chats" },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Background for sidebar */}
      <div
        className={`absolute top-0 left-0 ${
          open ? "w-64" : "w-20"
        } h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 -z-10`}
      ></div>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${
          open ? "w-64" : "w-20"
        } fixed h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between p-4">
            {open && <h2 className="font-bold">Owner Panel</h2>}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-shadow shadow-sm hover:shadow-lg"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
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
                      {user.username || "Owner"}
                    </p>
                    <p className="text-xs text-white/70">
                      {user.role || "Owner"}
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
              const isActive = location.pathname === item.path;

              return (
                <li key={i}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`flex items-center ${open ? "gap-3 justify-start" : "justify-center"} p-3 rounded-2xl w-full text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-white/25 text-blue-200 shadow-lg shadow-white/10 ring-1 ring-white/10 font-semibold"
                        : "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white"
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
            className="flex w-full justify-center gap-2 rounded-lg bg-white py-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-6 ${open ? "ml-64" : "ml-20"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src="/Logo.png"
              alt="BachelorsNest Logo"
              className="w-12 h-12 mr-4"
            />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Owner
            </h1>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs">
                {darkMode ? "☀️" : "🌙"}
              </span>
            </div>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
