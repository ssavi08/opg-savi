import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import orderService from "../api/OrderService";
import orderItemService from "../api/OrderItemService";

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const orderList = await orderService.getUserOrders(); // confirmed orders
      const ordersWithItems = await Promise.all(
        orderList.map(async (order) => {
            const items = await orderItemService.getByOrder(order.id);
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return { ...order, items, total };
        })
       );
       const filteredOrders = ordersWithItems.filter(order => order.items.length > 0 && order.status === "confirmed");


        setOrders(filteredOrders);

    } catch (err) {
      console.error("Failed to load order history", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Your Order History</h1>

      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-6 border rounded p-4 shadow">
            <h2 className="font-semibold mb-2">Order ID: {order.id}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Created: {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} — Unit: €{item.price.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-semibold">
              Total: €{order.total.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
