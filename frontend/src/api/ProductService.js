import axiosClient from "./axiosClient";

class ProductService {
    async getAll(page = 1, pageSize = 3, search = "", sort = "asc") {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("pageSize", pageSize);
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);

    const res = await axiosClient.get(`/product?${params.toString()}`);
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