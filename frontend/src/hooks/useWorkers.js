import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useWorkers(all = false) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalWorkers, setTotalWorkers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadWorkers = useCallback(async (newPage = 1) => {
  setLoading(true);
  setError("");

  try {
    const url = all
      ? `/api/workers?limit=10000`
      : `/api/workers?page=${newPage}&limit=10`;

    const res = await apiClient.get(url);

    const data = res?.data || res;

    setWorkers(data?.workers || []);
    setPage(data?.page || 1);
    setTotalPages(data?.totalPages || 1);
    setTotalWorkers(data?.totalWorkers || 0);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [all]);

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
  totalWorkers,
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