import { useEffect, useState, useMemo } from "react";

export default function useUser() {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);


  const isLoggedIn = useMemo(() => !!userId, [userId]);


  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setRole(null);
    setUsername(null);
    setToken(null);
  };

  return {
    userId,
    role,
    username,
    token,
    isLoggedIn,
    logout,
  };
}
