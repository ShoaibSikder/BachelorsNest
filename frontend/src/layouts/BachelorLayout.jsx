import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, FileText, User, Bell, LogOut, Menu } from "lucide-react";

const BachelorLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Home Feed", icon: Home, path: "/bachelor" },
    { name: "My Requests", icon: FileText, path: "/bachelor/requests" },
    { name: "Profile", icon: User, path: "/bachelor/profile" },
    { name: "Notifications", icon: Bell, path: "/bachelor/notifications" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* SIDEBAR */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white transition-all duration-300 flex flex-col justify-between h-full`}
      >
        <div>
          <div className="flex items-center justify-between p-4">
            {open && <h2 className="text-xl font-extrabold">Bachelor</h2>}
            <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
          </div>

          <ul className="mt-6 space-y-2 px-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    isActive
                      ? "bg-white text-blue-600 font-semibold"
                      : "hover:bg-white/20"
                  }`}
                >
                  <item.icon size={20} />
                  {open && <span>{item.name}</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-white text-red-500 py-2 rounded-lg justify-center hover:scale-[1.03] transition"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Bachelor Home Page
        </h1>

        <Outlet />
      </div>
    </div>
  );
};

export default BachelorLayout;
