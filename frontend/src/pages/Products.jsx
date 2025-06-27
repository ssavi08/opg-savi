import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import productService from "../api/ProductService";
import orderService from "../api/OrderService.js";
import orderItemService from "../api/OrderItemService";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const { token, role } = useAuth();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc"); // "asc" or "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 3;

  const fetchProducts = async () => {
    try {
      const productData = await productService.getAll(currentPage, pageSize, search, sort);
      setProducts(productData);
      setIsLastPage(productData.length < pageSize);

    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, role, currentPage, sort, search]);

const handleAddToBasket = async (product) => {
    if (!token || role !== "user") {
      toast.error("You must be logged in to buy products.");
      return;
    }

    try {
      const order = await orderService.getCurrentOrder();
      const item = {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
      };
      await orderItemService.create(item);
      toast.success(`${product.name} added to basket!`);

      const items = await orderItemService.getByOrder(order.id);
      setBasketItems(items);
    } catch (err) {
      console.error("Failed to add item to basket", err);
      toast.error("Failed to add item to basket. Please try again.");
    }
  };

  const isInBasket = (productId) => {
    return basketItems.some((item) => item.productId === productId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="flex gap-6 p-4">
      {/* Sidebar: filters + sorting */}
      <div className="w-full md:w-1/7 border-r pr-4">
        <h2 className="font-semibold mb-2">Search a specific flower:</h2>
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <p className="font-semibold mb-2">Sort by Price:</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sort"
                value="asc"
                checked={sort === "asc"}
                onChange={() => setSort("asc")}
              />
              <span>Low to High</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="radio"
                name="sort"
                value="desc"
                checked={sort === "desc"}
                onChange={() => setSort("desc")}
              />
              <span>High to Low</span>
            </label>
          </div>
        </form>
      </div>

      {/* Main: product list */}
      <div className="w-full md:w-3/4">
        <h1 className="text-xl font-bold mb-4">Flowers for Sale</h1>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border p-4 rounded shadow flex flex-col h-full">
                <img
                  src={`/images/products/${p.imageFileName || "default.png"}`}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600">{p.description}</p>

                <div className="flex-grow justify-end" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-700 font-semibold">€{p.price.toFixed(2)}</p>

                  {role !== "admin" && (
                    isInBasket(p.id) ? (
                      <p className="text-green-600 font-semibold ml-4">In basket</p>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 w-fit ml-4"
                        onClick={() => handleAddToBasket(p)}
                      >
                        Add to basket
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={isLastPage}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}