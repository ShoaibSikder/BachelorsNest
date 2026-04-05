import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  FileText,
  User,
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  X,
} from "lucide-react";

/**
 * BachelorLayout component provides a responsive bachelor dashboard layout
 * with a collapsible sidebar navigation and main content area.
 * Features industry-standard accessibility, responsiveness, and UX improvements.
 */
const BachelorLayout = () => {
  const { logout, user } = useContext(AuthContext); // Assuming user is available in context
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle responsive behavior
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
      // Optionally show a toast or alert
    }
  };

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) setOpen(false); // Close sidebar on mobile after navigation
  };

  const profilePath = "/bachelor/profile";

  const menuItems = [
    {
      name: "Home Feed",
      icon: Home,
      path: "/bachelor",
      ariaLabel: "View home feed",
    },
    {
      name: "My Requests",
      icon: FileText,
      path: "/bachelor/requests",
      ariaLabel: "View my requests",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/bachelor/notifications",
      ariaLabel: "View notifications",
    },
    {
      name: "Chats",
      icon: MessageSquare,
      path: "/bachelor/chats",
      ariaLabel: "Access chats",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } fixed top-0 left-0 h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white transition-all duration-300 flex flex-col justify-between z-50 ${
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : ""
        }`}
        role="navigation"
        aria-label="Bachelor sidebar navigation"
      >
        <div>
          <div className="flex items-center justify-between p-4">
            {open && <h2 className="text-xl font-extrabold">Bachelor Panel</h2>}
            <button
              onClick={() => setOpen(!open)}
              className="p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="px-4 pb-4">
            {user && (
              <button
                onClick={() => handleMenuClick(profilePath)}
                className={`flex items-center ${open ? "gap-3" : "justify-center"} p-3 rounded-lg w-full text-left transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white`}
                aria-label="Open profile page"
              >
                <div className="h-11 w-11 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-lg font-semibold text-white">
                  {user.profile_image ? (
                    <img
                      src={getImageUrl(user.profile_image)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.username?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </div>
                {open && (
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.username || "Bachelor"}
                    </p>
                    <p className="text-xs text-white/80 capitalize truncate">
                      {user.role || "Bachelor"}
                    </p>
                    <p className="text-xs text-white/70 truncate">My Profile</p>
                  </div>
                )}
              </button>
            )}
            {open ? (
              <div className="flex items-center gap-3 p-3 rounded-lg w-full text-left transition hover:bg-white/20 focus-within:ring-2 focus-within:ring-white bg-white/10">
                <Search
                  size={18}
                  className="text-white/90 flex-shrink-0"
                  aria-hidden="true"
                />
                <input
                  id="bachelor-search"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search properties..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/70 focus:outline-none"
                />
              </div>
            ) : (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center gap-3 p-3 rounded-lg w-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Open search"
                >
                  <Search size={20} aria-hidden="true" />
                  <span className="sr-only">Search</span>
                </button>
              </div>
            )}
          </div>

          <nav>
            <ul className="mt-6 space-y-2 px-2" role="menu">
              {menuItems.map((item, index) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <li key={index} role="none">
                    <button
                      onClick={() => handleMenuClick(item.path)}
                      className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition focus:outline-none focus:ring-2 focus:ring-white ${
                        isActive
                          ? "bg-white text-blue-600 font-semibold shadow-md"
                          : "hover:bg-white/20"
                      }`}
                      role="menuitem"
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon size={20} aria-hidden="true" />
                      {open && <span>{item.name}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="p-4">
          {user && open && (
            <div className="mb-4 text-center">
              <p className="text-sm">Welcome, {user.username || "Bachelor"}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-white text-red-500 py-2 px-4 rounded-lg justify-center hover:scale-[1.03] transition focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Logout from bachelor panel"
          >
            <LogOut size={18} aria-hidden="true" />
            {open && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          open && !isMobile ? "ml-64" : "ml-20"
        } ${isMobile ? "ml-0" : ""}`}
        role="main"
        aria-label="Main content"
      >
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Bachelor Home Page
          </h1>
          {isMobile && (
            <button
              onClick={() => setOpen(true)}
              className="mt-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
          )}
        </header>

        {!open && isSearchOpen && (
          <div className="fixed inset-x-4 top-24 z-50 rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search location, room, seat..."
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-slate-700 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Close search"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <Outlet
          context={{
            searchText,
          }}
        />
      </main>
    </div>
  );
};

export default BachelorLayout;
