import { useState, useCallback } from "react";
import { apiClient } from "../lib/apiClient";
import { useModal } from "./useModal";
import { useAuth } from "./useAuth";

export function useZones() {
  const { openModal } = useModal();
  const { user } = useAuth();

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalZones, setTotalZones] = useState(0);

  // =========================
  // LOAD ZONES (pagination)
  // =========================
  const loadZones = useCallback(
    async (factoryId, newPage = 1) => {
      setLoading(true);
      setError("");

      try {
        let res;

        if (user?.role === "ADMIN") {
          res = await apiClient.get(
            `/api/factories/zones/all?page=${newPage}`
          );
        } else {
          if (!factoryId) return;

          res = await apiClient.get(
            `/api/factories/${factoryId}/zones?page=${newPage}`
          );
        }

        const data = res?.data || res;

        setZones(data?.zones || []);
        setPage(data?.page || 1);
        setTotalPages(data?.totalPages || 1);
        setTotalZones(data?.totalZones || 0);
      } catch (err) {
        setError(err.message);
        openModal({
          title: "Error",
          message: err.message,
          confirmText: "Close",
          hideCancel: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [user, openModal]
  );

  // =========================
  // PAGINATION
  // =========================
  const goNext = () => {
    if (page < totalPages) {
      loadZones(user?.factory, page + 1);
    }
  };

  const goPrev = () => {
    if (page > 1) {
      loadZones(user?.factory, page - 1);
    }
  };

  // =========================
  // ADD ZONE
  // =========================
  const addZone = async (factoryId, payload) => {
    try {
      const res = await apiClient.post(
        `/api/factories/${factoryId}/zones`,
        payload
      );

      await loadZones(factoryId, page);
      return res;
    } catch (err) {
      openModal({
        title: "Add failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true,
      });
      throw err;
    }
  };

  // =========================
  // DELETE ZONE
  // =========================
  const deleteZone = async (factoryId, zoneId) => {
    try {
      const res = await apiClient.delete(
        `/api/factories/${factoryId}/zones/${zoneId}`
      );

      await loadZones(factoryId, page);
      return res;
    } catch (err) {
      openModal({
        title: "Delete failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true,
      });
      throw err;
    }
  };

  return {
    zones,
    totalZones, 
    loading,
    error,
    page,
    totalPages,
    loadZones,
    addZone,
    deleteZone,
    goNext,
    goPrev,
  };
}