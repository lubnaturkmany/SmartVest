import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useModal } from "./useModal";
 

export function useAlerts(pollMs = 0, enablePopup = true, mode = "paged") {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);
 
  const { openModal } = useModal();
 
  const shownAlerts = useRef(new Set());
  const lastAlertId = useRef(null);
 
  // =========================
  // LOAD ALERTS
  // =========================
  const loadAlerts = useCallback(async (newPage = 1) => {
    setLoading(true);
    setError("");
 
    try {
      const res = await apiClient.get(
        mode === "all"
    ? `/api/alerts?limit=10000`
    :`/api/alerts?page=${newPage}&limit=10`
);

      const data = res?.data || res; // 🔥 دعم axios أو fetch wrapper
 
      setAlerts(data?.alerts || []);
 
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
      setTotalAlerts(data?.totalAlerts || 0);
 
    } catch (err) {
      setError(err.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  },
   []);
 
  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadAlerts(1);
  }, [loadAlerts]);
 
  // =========================
  // POLLING (safe update)
  // =========================
  useEffect(() => {
    if (!pollMs) return;
 
    const timer = setInterval(async () => {
      try {
        const res = await apiClient.get(
          `/api/alerts?page=${page}&limit=10`
        );
 
        const data = res?.data || res;
 
        setAlerts((prev) => {
          const map = new Map();
 
          prev.forEach((a) => map.set(a._id, a));
          (data?.alerts || []).forEach((a) => map.set(a._id, a));
 
          return Array.from(map.values());
        });
 
        setTotalAlerts(data?.totalAlerts || 0);
        setTotalPages(data?.totalPages || 1);
 
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, pollMs);
 
    return () => clearInterval(timer);
  }, [pollMs, page]);
 
  // =========================
  // MODAL LOGIC (no flicker)
  // =========================
  useEffect(() => {
  if (!enablePopup) return;   // 👈 أهم سطر

  if (!alerts.length) return;

  const latestAlert = alerts[0];

  if (
    (latestAlert?.type === "Danger" || latestAlert?.type === "Warning") &&
    latestAlert._id !== lastAlertId.current
  ) {
    lastAlertId.current = latestAlert._id;

    if (!shownAlerts.current.has(latestAlert._id)) {
      shownAlerts.current.add(latestAlert._id);

      openModal({
        title: `${latestAlert.type} Alert`,
        message: latestAlert.message,
        type: latestAlert.type?.toLowerCase(),
      });
    }
  }
}, [alerts, openModal, enablePopup]);
 
  // =========================
  // PAGINATION
  // =========================
  const goNext = () => {
    if (page < totalPages) loadAlerts(page + 1);
  };
 
  const goPrev = () => {
    if (page > 1) loadAlerts(page - 1);
  };
 
  // =========================
  // RETURN
  // =========================
  return {
    alerts,
    setAlerts,
    loading,
    error,
    page,
    totalPages,
    totalAlerts,
    loadAlerts,
    goNext,
    goPrev,
  };
}