import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useFactories() {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFactories = useCallback(async (newPage = 1) => {
  setLoading(true);
  setError("");

  try {
    const res = await apiClient.get(
      `/api/factories?page=${newPage}&limit=10`
    );

    const data = res?.data || res; 

    setFactories(data?.factories || []);
    setPage(data?.page || 1);
    setTotalPages(data?.totalPages || 1);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchFactories(1);
  }, [fetchFactories]);

  const goNext = () => {
    if (page < totalPages) {
      fetchFactories(page + 1);
    }
  };

  const goPrev = () => {
    if (page > 1) {
      fetchFactories(page - 1);
    }
  };

  const createFactory = async (name) => {
    const response = await apiClient.post("/api/factories", { name });
    fetchFactories(page); // refresh current page
    return response.data;
  };

  return {
    factories,
    loading,
    error,
    page,
    totalPages,
    goNext,
    goPrev,
    fetchFactories,
    createFactory
  };
}