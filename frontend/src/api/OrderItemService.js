import axiosClient from "./axiosClient";

class OrderItemService {
  async getByOrder(orderId) {
    const res = await axiosClient.get(`/orderitem/order/${orderId}`);
    return res.data;
  }

  async create(item) {
    const res = await axiosClient.post("/orderitem", item);
    return res.data;
  }

  async updateQuantity(itemId, newQuantity) {
    const res = await axiosClient.put(`/orderitem/${itemId}/quantity`, newQuantity);
    return res.data;
  }

  async delete(itemId) {
    const res = await axiosClient.delete(`/orderitem/${itemId}`);
    return res.data;
  }
}

export default new OrderItemService();
