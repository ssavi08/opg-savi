import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../api/UserService";

export default function LoginModal({ onClose, onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await userService.loginUser({ email, password });

      login({
        token: res.token,
        role: res.role,
        username: res.username,
      });

      onClose(); // Close modal on success
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">Register</button>
        </p>
        <button onClick={onClose} className="block mx-auto text-red-500 mt-4 cursor-pointer">Close</button>
      </div>
    </div>
  );
}