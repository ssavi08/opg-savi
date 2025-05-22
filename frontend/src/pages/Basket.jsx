import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import orderService from "../api/OrderService";
import orderItemService from "../api/OrderItemService";
import { useNavigate, Link } from "react-router-dom";

export default function Basket() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchBasket = async () => {
    try {
      const order = await orderService.getCurrentOrder();
      if (!order || !order.id) {
        setItems([]);
        return;
      }

      setOrderId(order.id);
      const itemList = await orderItemService.getByOrder(order.id);
      setItems(itemList);

      const totalPrice = itemList.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(totalPrice);
    } catch (err) {
      if (err.response?.status === 404) {
        setItems([]);
      } else {
        console.error("Failed to load basket", err);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchBasket();
    }
  }, [token]);

  const updateQuantity = async (id, quantity) => {
    try {
      await orderItemService.updateQuantity(id, quantity);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
      const updatedTotal = items.reduce(
        (sum, item) =>
          item.id === id
            ? sum + item.price * quantity
            : sum + item.price * item.quantity,
        0
      );
      setTotal(updatedTotal);
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (id) => {
    try {
      await orderItemService.delete(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      const updatedTotal = items
        .filter((item) => item.id !== id)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(updatedTotal);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const confirmOrder = async () => {
    try {
      await orderService.confirmOrder(orderId);
      alert("🎉 Congratulations on your order!");
      navigate("/order/history");
    } catch (err) {
      console.error("Failed to confirm order", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Basket</h1>

      {items.length === 0 ? (
        <div>
          <p>Your basket is empty.</p>
          <br />
          <Link
            to="/order/history"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
          >
            Order history
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={`${orderId}-${item.productId}`} // ✅ Stable key
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {item.productName} — Quantity:{" "}
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="border w-16 px-2 py-1 ml-1"
                    />
                  </p>
                  <p className="text-sm text-gray-600">
                    Unit: €{item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right font-semibold">
            <div className="mb-4">Total: €{total.toFixed(2)}</div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              onClick={confirmOrder}
            >
              Confirm Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
