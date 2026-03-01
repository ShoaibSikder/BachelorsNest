import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BachelorLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5">
        <h2 className="text-xl font-bold mb-6">Bachelor Panel</h2>

        <ul className="space-y-4">
          <li>
            <Link to="/bachelor" className="hover:text-blue-500">
              Home Feed
            </Link>
          </li>
          <li>
            <Link to="/bachelor/requests" className="hover:text-blue-500">
              My Requests
            </Link>
          </li>
          <li>
            <Link to="/bachelor/profile" className="hover:text-blue-500">
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default BachelorLayout;
