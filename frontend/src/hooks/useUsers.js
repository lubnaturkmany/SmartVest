import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);            // <<< صفحة الحالية
  const [totalPages, setTotalPages] = useState(1); // <<< عدد الصفحات الكلي
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10; // <<< كم عنصر لكل صفحة

  const loadUsers = useCallback(
    async (currentPage = page) => { // <<< التعديل: استقبال الصفحة
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.get(`/api/users?page=${currentPage}&limit=${limit}`);
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || (data.users ? data.users.length : 0)); // <<< العدد الكلي
        setTotalPages(data.totalPages || 1); // <<< عدد الصفحات
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [] 
  );
  
  useEffect(() => {
    loadUsers(page); // كل مرة page يتغير → جلب الصفحة الجديدة
  }, [page, loadUsers]);

  const registerUser = async (payload) => {
    const data = await apiClient.post("/api/auth/register", payload);
    await loadUsers(page);
    setTotalUsers(prev => prev + 1);
    return data;
  };

  const goNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const goPrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return { users, loading, error, loadUsers, registerUser, page, totalPages,totalUsers, setPage, goNext, goPrev };
}
