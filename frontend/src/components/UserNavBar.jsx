import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function UserNavBar() {
  const navigate = useNavigate();
  const { token, role, username, logout } = useAuth();
  const isLoggedIn = !!token && role === "user";

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              className="h-8"
              alt="Logo"
            />
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              OPG Savi
            </span>
          </Link>

          <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>

            {isLoggedIn && (
              <>
                <li><Link to="/basket" className="hover:text-blue-600">Basket</Link></li>
                <li><Link to="/order/history" className="hover:text-blue-600">My Orders</Link></li>
              </>
            )}

            {isLoggedIn ? (
              <>
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
                <li>
                  <button onClick={() => setShowLogin(true)} className="hover:text-blue-600 cursor-pointer">
                    Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }} />
      )}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }} />
      )}
    </>
  );
}