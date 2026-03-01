import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BachelorHome from "./pages/bachelor/Home";
import OwnerHome from "./pages/owner/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import BachelorLayout from "./layouts/BachelorLayout";

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
        </Route>

        {/* Owner Dashboard */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerHome />
            </ProtectedRoute>
          }
        />

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
