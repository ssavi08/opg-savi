import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import productService from "../api/ProductService";
import { toast } from "react-toastify";

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 3;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageFileName: "", 
  });

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    imageFileName: "",
  });

  const [confirmId, setConfirmId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll(currentPage, pageSize, "");
      setProducts(data);
      setIsLastPage(data.length < pageSize);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [currentPage]);


  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      imageFileName: form.imageFileName,
    };

    try {
      await productService.create(payload);
      setForm({ name: "", description: "", price: "", stock: "", imageFileName: "" });
      fetchProducts();
      toast.success("Product added successfully!");
    } catch (err) {
      console.error("Failed to create product", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editForm.id,
      name: editForm.name,
      description: editForm.description,
      price: parseFloat(editForm.price),
      stock: parseInt(editForm.stock),
      imageFileName: editForm.imageFileName,
    };

    try {
      await productService.update(editForm.id, payload);
      setShowEditModal(false);
      setEditForm({ id: null, name: "", description: "", price: "", stock: "" });
      fetchProducts();
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const handleEdit = (product) => {
    setEditForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageFileName: product.imageFileName || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const confirmDelete = (id) => {
    handleDelete(id);
    setConfirmId(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* ADD PRODUCT FORM */}
      <h4 className="text-xl fontsize font-bold mb-4">Add flower</h4>
      <form onSubmit={handleAddSubmit} className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image file name (e.g. rose.png)"
          value={form.imageFileName}
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, imageFileName: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
          Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      <div className="grid gap-4">
        <h4 className="text-xl fontsize font-bold mb-4">List of flowers for sale</h4>
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <img
                src={`/images/products/${p.imageFileName}`}
                alt={p.name}
                className="w-60 h-40 object-cover rounded mb-2 center mx-auto"
              />
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm">{p.description}</p>
              <p className="text-mm">€{p.price.toFixed(2)} — Stock: {p.stock}</p>
            </div>
            <div className="space-x-2 flex">
              <button
                onClick={() => handleEdit(p)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmId(p.id)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
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

      {/* DELETE CONFIRMATION MODAL */}
      {confirmId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-around">
              <button
                onClick={() => confirmDelete(confirmId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL FORM */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                className="w-full border p-2 rounded"
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={editForm.description}
                className="w-full border p-2 rounded"
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={editForm.price}
                className="w-full border p-2 rounded"
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={editForm.stock}
                className="w-full border p-2 rounded"
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image file name (e.g. rose.png)"
                value={editForm.imageFileName || ""}
                onChange={(e) => setEditForm({ ...editForm, imageFileName: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditForm({ id: null, name: "", description: "", price: "", stock: "" });
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
