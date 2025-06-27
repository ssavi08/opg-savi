import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNavBar from "./components/UserNavBar";
import AdminNavBar from "./components/AdminNavBar";

import Products from "./pages/Products";
import Basket from "./pages/Basket";
import OrderHistory from "./pages/OrderHistory";
import Admin from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import About from "./pages/About";

// Route wrapper to protect pages
const PrivateRoute = ({ children, roles }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/" />;
  if (roles && !roles.includes(role)) return <Navigate to="/" />;
  return children;
};

// Main App
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Context-aware nav + routes
function AppContent() {
  const { role } = useAuth();

  return (
    <>
      {role === "admin" ? <AdminNavBar /> : <UserNavBar />}

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/order/history"
          element={<PrivateRoute roles={["user"]}><OrderHistory /></PrivateRoute>}
        />
        <Route
          path="/basket"
          element={<PrivateRoute roles={["user"]}><Basket /></PrivateRoute>}
        />
        <Route
          path="/admin"
          element={<PrivateRoute roles={["admin"]}><Admin /></PrivateRoute>}
        />
        <Route
          path="/admin/all"
          element={<PrivateRoute roles={["admin"]}><AdminOrders /></PrivateRoute>}
        />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}