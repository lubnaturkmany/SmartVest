import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Backend does not expose list-users endpoint; keep current user as users data.
      const me = await apiClient.get("/api/auth/me");
      setUsers(me ? [me] : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const registerUser = async (payload) => {
    const data = await apiClient.post("/api/auth/register", payload);
    await loadUsers();
    return data;
  };

  return { users, loading, error, loadUsers, registerUser };
}
