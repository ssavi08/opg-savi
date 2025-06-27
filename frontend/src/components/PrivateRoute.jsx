import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { token, role, showLoginModal } = useAuth();

  if (!token) {
    showLoginModal(); // trigger modal
    return null;       // don't render protected content
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;