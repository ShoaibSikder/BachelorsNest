import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Bachelor
import BachelorHome from "./pages/bachelor/Home";
import MyRequests from "./pages/bachelor/MyRequests";
import BachelorNotifications from "./pages/bachelor/Notifications";
import BachelorLayout from "./layouts/BachelorLayout";

// Owner
import OwnerHome from "./pages/owner/Home";
import OwnerRequests from "./pages/owner/OwnerRequests";
import OwnerNotifications from "./pages/owner/Notifications";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerAddProperty from "./pages/owner/OwnerAddProperty";
import OwnerEditProperty from "./pages/owner/OwnerEditProperty";
import OwnerLayout from "./layouts/OwnerLayout";

// Admin (✅ NEW CORRECT IMPORTS)
import AdminLayout from "./layouts/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSupport from "./pages/admin/AdminSupport";

// Chat
import ChatPage from "./pages/chat/ChatPage";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= BACHELOR ================= */}
        <Route
          path="/bachelor"
          element={
            <ProtectedRoute allowedRole="bachelor">
              <BachelorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BachelorHome />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="profile" element={<div>Profile Page</div>} />
          <Route path="notifications" element={<BachelorNotifications />} />
          <Route path="chats" element={<ChatPage />} />
        </Route>

        {/* ================= OWNER ================= */}
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
          <Route path="properties" element={<OwnerProperties />} />
          <Route path="properties/add" element={<OwnerAddProperty />} />
          <Route path="properties/edit/:id" element={<OwnerEditProperty />} />
          <Route path="chats" element={<ChatPage />} />
        </Route>

        {/* ================= ADMIN (FIXED) ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout /> {/* ✅ IMPORTANT FIX */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/users" />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="support" element={<AdminSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
