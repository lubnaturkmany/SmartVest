import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadWorkers = useCallback(async (newPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.get(
        `/api/workers?page=${newPage}&limit=10`
      );

      const data = res?.data || res;

      setWorkers(data?.workers || []);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkers(1);
  }, [loadWorkers]);

  const goNext = () => {
    if (page < totalPages) loadWorkers(page + 1);
  };

  const goPrev = () => {
    if (page > 1) loadWorkers(page - 1);
  };

  const addWorker = async (payload) => {
    const res = await apiClient.post("/api/workers", payload);
    await loadWorkers(page);
    return res.data;
  };

  const deleteWorker = async (workerID) => {
    await apiClient.delete(`/api/workers/${workerID}`);
    await loadWorkers(page);
  };

  return {
  workers,
  loading,
  error,
  page,
  totalPages,
  loadWorkers,
  setPage,
  goNext,
  goPrev,
  addWorker,
  deleteWorker,
};
}