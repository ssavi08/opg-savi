import axiosClient from "./axiosClient";

class OrderService {
  async getCurrentOrder() {
    const res = await axiosClient.get("/order/current");
    return res.data;
  }

  async confirmOrder(orderId) {
    const res = await axiosClient.put(`/order/${orderId}/confirm`);
    return res.data;
  }

  async getAllOrdersForAdmin() {
    const res = await axiosClient.get("/order/admin/all");
    return res.data;
  }

  async getUserOrders() {
    const res = await axiosClient.get("/order/history");
    return res.data;
  }
}

export default new OrderService();
