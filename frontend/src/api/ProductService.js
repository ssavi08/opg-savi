import axiosClient from "./axiosClient";

class ProductService {
  async getAll() {
    const res = await axiosClient.get("/product");
    return res.data;
  }

  async create(product) {
    const res = await axiosClient.post("/product", product);
    return res.data;
  }

  async update(id, product) {
    const res = await axiosClient.put(`/product/${id}`, product);
    return res.data;
  }

  async delete(id) {
    const res = await axiosClient.delete(`/product/${id}`);
    return res.data;
  }
}

export default new ProductService();
