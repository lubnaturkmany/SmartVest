import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useModal } from "./useModal";

export function useAlerts(pollMs = 0) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);

  const { openModal } = useModal();

  // 🔥 يمنع تكرار نفس التنبيه
  const shownAlerts = useRef(new Set());

  // 🔥 لمعرفة آخر alert تمت معالجته (يمنع الفلاش)
  const lastAlertId = useRef(null);

  const loadAlerts = useCallback(async (newPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.get(
        `/api/alerts?page=${newPage}&limit=10`
      );

      console.log("ALERTS RESPONSE:", data);

      setAlerts(data?.alerts || []);
      setPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
      setTotalAlerts(data?.totalAlerts || 0);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // initial load
  // =========================
  useEffect(() => {
    loadAlerts(1);
  }, [loadAlerts]);

  // =========================
  // polling
  // =========================
  useEffect(() => {
    if (!pollMs) return;

    const timer = setInterval(() => {
      loadAlerts(page);
    }, pollMs);

    return () => clearInterval(timer);
  }, [pollMs, loadAlerts, page]);

  // =========================
  // 🔥 FIXED MODAL TRIGGER (no flicker)
  // =========================
  useEffect(() => {
    if (!alerts.length) return;

    // نفترض أول عنصر هو الأحدث
    const latestAlert = alerts[0];

    if (
      (latestAlert?.type === "Danger" || latestAlert?.type === "Warning") &&
      latestAlert._id !== lastAlertId.current
    ) {
      lastAlertId.current = latestAlert._id;

      // منع التكرار
      if (!shownAlerts.current.has(latestAlert._id)) {
        shownAlerts.current.add(latestAlert._id);

        openModal({
          title: `${latestAlert.type} Alert`,
          message: latestAlert.message,
          type: latestAlert.type?.toLowerCase()
        });
      }
    }
  }, [alerts, openModal]);

  // =========================
  // pagination
  // =========================
  const goNext = () => {
    if (page < totalPages) loadAlerts(page + 1);
  };

  const goPrev = () => {
    if (page > 1) loadAlerts(page - 1);
  };

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