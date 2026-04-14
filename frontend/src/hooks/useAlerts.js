import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useAlerts(pollMs = 0) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAlerts, setTotalAlerts] = useState(0);

  const loadAlerts = useCallback(async () => {
    setError("");
    try {
      const data = await apiClient.get("/api/alerts");
      const alertsData = Array.isArray(data) ? data : [];
      setAlerts(alertsData);
    setTotalAlerts(alertsData.length);
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

  return { alerts, loading, error, loadAlerts, totalAlerts };
}
