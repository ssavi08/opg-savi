import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← Use this, not useUser

export default function NavBar() {
  const navigate = useNavigate();
  const { token, role, username, logout } = useAuth();
  const isLoggedIn = !!token;

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            OPG Savi
          </span>
        </Link>

        <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/products" className="hover:text-blue-600">Products</Link></li>

          {isLoggedIn ? (
            <>
              {role === "user" && (
                <>
                  <li><Link to="/basket" className="hover:text-blue-600">Basket</Link></li>
                  <li><Link to="/order/history" className="hover:text-blue-600">My Orders</Link></li>
                </>
              )}

              {role === "admin" && (
                <>
                  <li><Link to="/admin" className="hover:text-blue-600">Admin Panel</Link></li>
                  <li><Link to="/admin/all" className="hover:text-blue-600">Orders</Link></li>
                </>
              )}

              <li>
                <span className="text-white-500">
                  Welcome {username}.
                </span>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="hover:text-red-800 cursor-pointer bg-transparent border-none p-0 text-inherit"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
