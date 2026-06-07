import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import SiteFooter from "../components/SiteFooter";
import { useTheme } from "../context/ThemeContext";
import { getMediaUrl } from "../config";
import {
  Home,
  FileText,
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Sun,
  X,
} from "lucide-react";

const OwnerLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024;
      setIsMobile(compact);
      if (compact) setOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;

    const handleOutsidePress = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsidePress);
    document.addEventListener("touchstart", handleOutsidePress);
    return () => {
      document.removeEventListener("mousedown", handleOutsidePress);
      document.removeEventListener("touchstart", handleOutsidePress);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    navigate("/");
  };

  const getImageUrl = (img) =>
    getMediaUrl(img);

  const handleMenuClick = (path) => {
    navigate(path);
    setProfileMenuOpen(false);
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

  const isRouteActive = (path) => {
    if (path === "/owner") return location.pathname === path;
    if (path === "/owner/properties") {
      return (
        location.pathname === path ||
        location.pathname.startsWith("/owner/properties/edit")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className="relative flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Background for sidebar */}
      <div
        className={`absolute top-0 left-0 hidden lg:block ${
          open ? "w-64" : "w-20"
        } h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 -z-10`}
      ></div>

      <aside
        className={`${
          open ? "w-64" : "w-20"
        } fixed left-0 top-0 z-50 hidden h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white transition-all duration-300 lg:flex flex-col justify-between`}
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
              const isActive = isRouteActive(item.path);

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

      <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 lg:hidden">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {menuItems.map((item) => {
            const isActive = isRouteActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                className={`flex min-w-[4.75rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon size={20} />
                <span className="max-w-full truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main
        className={`ml-0 flex min-h-screen w-full min-w-0 max-w-none flex-1 flex-col overflow-y-auto overflow-x-hidden p-3 pb-24 sm:p-5 sm:pb-24 lg:p-6 lg:pb-6 ${
          open ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src="/Logo.png"
              alt="BachelorsNest Logo"
              className="mr-2 h-10 w-10 shrink-0 sm:mr-4 sm:h-12 sm:w-12"
            />
            <h1 className="truncate text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent sm:text-4xl">
              Owner
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="relative hidden h-6 w-12 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/30 transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:from-slate-700 dark:to-indigo-700 dark:shadow-indigo-950/30 dark:ring-indigo-400/30 dark:focus:ring-indigo-400 lg:block"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
            >
              <div
                className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-amber-500 shadow-md transition-transform duration-300 ease-in-out dark:bg-slate-950 dark:text-indigo-200 ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {darkMode ? <Moon size={12} /> : <Sun size={12} />}
              </div>
            </button>

            <div className="relative lg:hidden" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-700 ring-2 ring-blue-500/30 dark:bg-slate-800 dark:text-slate-100"
                aria-label="Open profile menu"
              >
                {user?.profile_image ? (
                  <img
                    src={getImageUrl(user.profile_image)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.username?.[0]?.toUpperCase() || "O"}</span>
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => handleMenuClick(profilePath)}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>Theme</span>
                    <span className="relative h-6 w-12 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 shadow-inner ring-1 ring-amber-500/30 dark:from-slate-700 dark:to-indigo-700 dark:ring-indigo-400/30">
                      <span
                        className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-amber-500 shadow-md transition-transform duration-300 dark:bg-slate-950 dark:text-indigo-200 ${
                          darkMode ? "translate-x-6" : "translate-x-0"
                        }`}
                      >
                        {darkMode ? <Moon size={12} /> : <Sun size={12} />}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </main>
    </div>
  );
};

export default OwnerLayout;
