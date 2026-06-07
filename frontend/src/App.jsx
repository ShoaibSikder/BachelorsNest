import { createElement, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages stay eager because they are outside the dashboard shell.
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Layouts stay eager so top bars, sidebars, and mobile tab bars render immediately.
import BachelorLayout from "./layouts/BachelorLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PageFallback from "./components/common/PageFallback";
import { SectionCacheProvider } from "./context/SectionCacheContext";

// Bachelor sections
const BachelorHome = lazy(() => import("./pages/bachelor/Home"));
const MyRequests = lazy(() => import("./pages/bachelor/MyRequests"));
const BachelorNotifications = lazy(() => import("./pages/bachelor/Notifications"));
const SavedProperties = lazy(() => import("./pages/bachelor/SavedProperties"));

// Shared dashboard sections
const Profile = lazy(() => import("./pages/Profile"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));

// Owner sections
const OwnerHome = lazy(() => import("./pages/owner/Home"));
const OwnerRequests = lazy(() => import("./pages/owner/OwnerRequests"));
const OwnerNotifications = lazy(() => import("./pages/owner/Notifications"));
const OwnerProperties = lazy(() => import("./pages/owner/OwnerProperties"));
const OwnerAddProperty = lazy(() => import("./pages/owner/OwnerAddProperty"));
const OwnerEditProperty = lazy(() => import("./pages/owner/OwnerEditProperty"));

// Admin sections
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminSecurity = lazy(() => import("./pages/admin/AdminSecurity"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const lazySection = (Component) => (
  <Suspense fallback={<PageFallback />}>
    {createElement(Component)}
  </Suspense>
);

function App() {
  return (
    <BrowserRouter>
      <SectionCacheProvider>
        <Routes>
          {/* ROOT REDIRECT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= BACHELOR ================= */}
        <Route
          path="/bachelor"
          element={
            <ProtectedRoute allowedRole="bachelor">
              <BachelorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={lazySection(BachelorHome)} />
          <Route path="requests" element={lazySection(MyRequests)} />
          <Route path="saved" element={lazySection(SavedProperties)} />
          <Route path="profile" element={lazySection(Profile)} />
          <Route path="profile/:userId" element={lazySection(Profile)} />
          <Route path="notifications" element={lazySection(BachelorNotifications)} />
          <Route path="chats" element={lazySection(ChatPage)} />
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
          <Route index element={lazySection(OwnerHome)} />
          <Route path="requests" element={lazySection(OwnerRequests)} />
          <Route path="notifications" element={lazySection(OwnerNotifications)} />
          <Route path="properties" element={lazySection(OwnerProperties)} />
          <Route path="profile" element={lazySection(Profile)} />
          <Route path="profile/:userId" element={lazySection(Profile)} />
          <Route path="properties/add" element={lazySection(OwnerAddProperty)} />
          <Route path="properties/edit/:id" element={lazySection(OwnerEditProperty)} />
          <Route path="chats" element={lazySection(ChatPage)} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/reports" />} />
          <Route path="users" element={lazySection(AdminUsers)} />
          <Route path="properties" element={lazySection(AdminProperties)} />
          <Route path="profile" element={lazySection(Profile)} />
          <Route path="profile/:userId" element={lazySection(Profile)} />
          <Route path="requests" element={lazySection(AdminRequests)} />
          <Route path="reports" element={lazySection(AdminReports)} />
          <Route path="notifications" element={lazySection(AdminNotifications)} />
          <Route path="security" element={lazySection(AdminSecurity)} />
          <Route path="settings" element={lazySection(AdminSettings)} />
        </Route>

        {/* CATCH-ALL - Redirect unmatched routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </SectionCacheProvider>
    </BrowserRouter>
  );
}

export default App;
