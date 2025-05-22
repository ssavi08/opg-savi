import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import OrderService from "../api/OrderService";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    OrderService
      .getAllOrdersForAdmin()
      .then(setOrders)
      .catch((err) => console.error("Failed to load admin orders", err));
  }, [token]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div
              key={o.orderId}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Order ID: {o.orderId}</p>
                <p>User: {o.username} ({o.email})</p>
                <p>Total: €{o.total.toFixed(2)}</p>
                <p>Status: <span className="capitalize">{o.status}</span></p>
                <p className="text-sm text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
