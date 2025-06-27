import { useState } from "react";
import UserService from "../api/UserService";

export default function RegisterModal({ onClose, onSwitch }) {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

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
      onClose();     // Close register modal
      onSwitch();    // Open login modal
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed.";
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
          <button className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">
            Go back to Login
          </button>
        </p>
      </div>
    </div>
  );
}