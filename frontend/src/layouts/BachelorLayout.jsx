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
  Search,
  X,
} from "lucide-react";

const BachelorLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  const profilePath = "/bachelor/profile";

  const menuItems = [
    { name: "Home Feed", icon: Home, path: "/bachelor" },
    { name: "My Requests", icon: FileText, path: "/bachelor/requests" },
    { name: "Notifications", icon: Bell, path: "/bachelor/notifications" },
    { name: "Chats", icon: MessageSquare, path: "/bachelor/chats" },
  ];

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Background for sidebar */}
      <div
        className={`absolute top-0 left-0 ${
          open ? "w-64" : "w-20"
        } h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 -z-10`}
      ></div>
      {/* Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } fixed top-0 left-0 h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white transition-all duration-300 flex flex-col justify-between z-50 ${
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : ""
        }`}
      >
        <div>
          {/* HEADER */}
          <div className="flex items-center justify-between p-4">
            {open && <h2 className="text-xl font-extrabold">Bachelor Panel</h2>}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-shadow shadow-sm hover:shadow-lg"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* PROFILE + DIVIDER + SEARCH */}
          <div className="px-4 pb-4 flex flex-col gap-4">
            {/* PROFILE CARD */}
            {user && (
              <button
                onClick={() => handleMenuClick(profilePath)}
                className={`${
                  open ? "flex gap-3 items-center" : "flex justify-center"
                } p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/20 hover:scale-[1.02] transition`}
              >
                <div className="h-11 w-11 rounded-full bg-white/20 overflow-hidden flex items-center justify-center font-semibold">
                  {user.profile_image ? (
                    <img
                      src={getImageUrl(user.profile_image)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {open && (
                  <div>
                    <p className="text-sm font-semibold">
                      {user.username || "Bachelor"}
                    </p>
                    <p className="text-xs text-white/70 capitalize">
                      {user.role}
                    </p>
                  </div>
                )}
              </button>
            )}

            {/* DIVIDER */}
            {open && <div className="h-px bg-white/20 w-full rounded-full" />}

            {/* SEARCH */}
            {open ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
                <Search size={18} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search properties..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/70 focus:outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex justify-center p-3 hover:bg-white/20 rounded-lg"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* MENU */}
          <ul className="mt-6 space-y-2 px-2">
            {menuItems.map((item, i) => {
              const isActive =
                item.path === "/bachelor"
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

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
            className="flex items-center gap-2 w-full bg-white text-red-500 py-2 px-4 rounded-lg justify-center hover:scale-[1.03] transition"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={`flex-1 p-6 ${
          open && !isMobile ? "ml-64" : "ml-20"
        } ${isMobile ? "ml-0" : ""}`}
      >
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/Logo.png"
              alt="BachelorsNest Logo"
              className="w-12 h-12 mr-4"
            />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Bachelor
            </h1>
          </div>

          <div className="flex items-center gap-4">
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

            {isMobile && (
              <button
                onClick={() => setOpen(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </header>

        <Outlet context={{ searchText }} />
      </main>
    </div>
  );
};

export default BachelorLayout;
