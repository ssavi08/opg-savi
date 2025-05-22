import axiosClient from "./axiosClient";

class UserService {
  async registerUser({ username, email, password }) {
    try {
      const response = await axiosClient.post("/user/register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error.response?.data || error;
    }
  }

  async loginUser({ email, password }) {
    try {
      const response = await axiosClient.post("/user/login", {
        email,
        password,
      });

      const { token, role, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || error;
    }
  }

  logoutUser() {
    localStorage.clear();
  }
}
export default new UserService();
