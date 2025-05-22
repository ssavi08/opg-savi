import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../api/UserService";

export default function RegisterForm() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!(user.username && user.email && user.password)) {
      setError("All fields are required.");
      return;
    }

    try {
      await UserService.registerUser(user);
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Try again.";
      setError(message);
    }
  };

  const handleLabelClick = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <span
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={handleLabelClick}
        >
          Login
        </span>
      </p>
    </div>
  );
}
