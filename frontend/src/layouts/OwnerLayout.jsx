import { Outlet, Link } from "react-router-dom";

const OwnerLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Owner Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/owner" className="hover:text-gray-300 transition">
            Dashboard
          </Link>

          <Link to="/owner/requests" className="hover:text-gray-300 transition">
            Rent Requests
          </Link>
          <Link to="/owner/notifications" className="hover:text-gray-300 transition">
            Notifications
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerLayout;
