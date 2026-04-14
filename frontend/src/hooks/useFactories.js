import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useFactories() {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFactories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.get("/api/factories");
      setFactories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFactories();
  }, [loadFactories]);

  const createFactory = async (name) => {
    const response = await apiClient.post("/api/factories", { name });
    setFactories((prev) => [response.data.factory, ...prev]);
    return response.data;
  };

  return { factories, loading, error, loadFactories, createFactory };
}