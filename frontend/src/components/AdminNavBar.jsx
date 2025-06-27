import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavBar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/logo.png"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            Admin - OPG Savi
          </span>
        </Link>

        <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <li><Link to="/admin" className="hover:text-blue-600">Dashboard</Link></li>
          <li><Link to="/admin/all" className="hover:text-blue-600">Orders</Link></li>
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
        </ul>
      </div>
    </nav>
  );
}