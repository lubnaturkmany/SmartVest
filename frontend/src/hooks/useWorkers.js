import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get("/api/workers");
      setWorkers(data.workers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const addWorker = async (payload) => {
    const data = await apiClient.post("/api/workers", payload);
    setWorkers((prev) => [data.worker, ...prev]);
    return data;
  };

  const deleteWorker = async (workerID) => {
    await apiClient.delete(`/api/workers/${workerID}`);
    setWorkers((prev) => prev.filter((w) => w.workerID !== workerID));
  };

  return { workers, loading, error, loadWorkers, addWorker, deleteWorker };
}
