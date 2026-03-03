import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BachelorHome from "./pages/bachelor/Home";
import OwnerHome from "./pages/owner/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import BachelorLayout from "./layouts/BachelorLayout";
import MyRequests from "./pages/bachelor/MyRequests";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerRequests from "./pages/owner/OwnerRequests";
import BachelorNotifications from "./pages/bachelor/Notifications";
import OwnerNotifications from "./pages/owner/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Bachelor Dashboard (Nested Layout) */}
        <Route
          path="/bachelor"
          element={
            <ProtectedRoute allowedRole="bachelor">
              <BachelorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BachelorHome />} />
          <Route path="requests" element={<div>My Requests Page</div>} />
          <Route path="profile" element={<div>Profile Page</div>} />
          <Route path="notifications" element={<BachelorNotifications />} />
        </Route>

        {/* Owner Dashboard */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerHome />} />
          <Route path="requests" element={<OwnerRequests />} />
          <Route path="notifications" element={<OwnerNotifications />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
