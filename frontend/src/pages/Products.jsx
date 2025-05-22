import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import productService from "../api/ProductService";
import orderService from "../api/OrderService.js";
import orderItemService from "../api/OrderItemService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const { token, role } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const productData = await productService.getAll();
        setProducts(productData);

        if (token && role !== "admin") {
          const order = await orderService.getCurrentOrder();
          const items = await orderItemService.getByOrder(order.id);
          setBasketItems(items);
        }
      } catch (err) {
        console.error("Failed to load products or basket", err);
      }
    };
    load();
  }, [token, role]);

  const handleAddToBasket = async (product) => {
    try {
      const order = await orderService.getCurrentOrder();
      const item = {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      };
      await orderItemService.create(item);
      alert("Added to basket!");
      const items = await orderItemService.getByOrder(order.id);
      setBasketItems(items);
    } catch (err) {
      console.error("Failed to add item to basket", err);
      alert("Could not add to basket.");
    }
  };

  const isInBasket = (productId) => {
    return basketItems.some((item) => item.productId === productId);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Flowers for Sale</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{p.name}</h2>
              <p>{p.description}</p>
              <p className="text-sm text-gray-600">€{p.price.toFixed(2)}</p>

              {role !== "admin" && (
                isInBasket(p.id) ? (
                  <p className="mt-2 text-green-600 font-semibold">In basket</p>
                ) : (
                  <button
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-600"
                    onClick={() => handleAddToBasket(p)}
                  >
                    Add to Basket
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
