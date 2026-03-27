import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useAlerts(pollMs = 0) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async () => {
    setError("");
    try {
      const data = await apiClient.get("/api/alerts");
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    if (!pollMs) return;
    const timer = setInterval(loadAlerts, pollMs);
    return () => clearInterval(timer);
  }, [pollMs, loadAlerts]);

  return { alerts, loading, error, loadAlerts };
}
