import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import userService from "../api/UserService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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

      navigate("/");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    {error && <p className="text-red-500 mb-2">{error}</p>}
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
        >
          Login
        </button>
      <p>
        Don’t have an account?
      </p>
      <Link
        to="/register"
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
      >
        Register here
      </Link>
    </form>
  </div>
  );
}
