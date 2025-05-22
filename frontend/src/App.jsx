import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Basket from "./pages/Basket";
import OrderHistory from "./pages/OrderHistory";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";

const PrivateRoute = ({ children, roles }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar /> {/* Rendered globally on every page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order/history" element={<OrderHistory />} />
          <Route path="/basket" element={<PrivateRoute><Basket /></PrivateRoute>}/>
          <Route path="/admin" element={<PrivateRoute roles={["admin"]}><Admin /></PrivateRoute>}/>
          <Route path="/admin/all" element={<PrivateRoute roles={["admin"]}><AdminOrders /></PrivateRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
