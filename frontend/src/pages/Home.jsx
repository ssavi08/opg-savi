import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { token, role, username } = useAuth();
  const isLoggedIn = !!token;

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to OPG Savi</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your platform for managing orders, baskets, and admin operations.
      </p>

      {isLoggedIn ? (
        <>
          <p className="mb-4 text-md text-gray-600">
            Logged in as <strong>{username}</strong> ({role})
          </p>

          <div className="space-x-4">
            <Link
              to="/basket"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Basket
            </Link>

            {role === "admin" && (
              <Link
                to="/admin"
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
