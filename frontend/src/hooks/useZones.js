import { useState, useCallback } from "react";
import { apiClient } from "../lib/apiClient";
import { useModal } from "./useModal"; // إذا حابب تعرض رسائل

export function useZones() {
  const { openModal } = useModal();

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب الزونات لمصنع معين
  const loadZones = useCallback(async (factoryId) => {
    if (!factoryId) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get(`/api/factories/${factoryId}`);
      setZones(res.zones || []);
    } catch (err) {
      setError(err.message || "Failed to load zones");
      openModal({
        title: "Error",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
    } finally {
      setLoading(false);
    }
  }, [openModal]);

  // إضافة Zone جديد
  const addZone = async (factoryId, payload) => {
    try {
      const res = await apiClient.post(`/api/factories/${factoryId}/zones`, payload);
      setZones(res.zones);
      return res;
    } catch (err) {
      openModal({
        title: "Add failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
      throw err;
    }
  };

  // حذف Zone
  const deleteZone = async (factoryId, zoneId) => {
    try {
      const res = await apiClient.delete(`/api/factories/${factoryId}/zones/${zoneId}`);
      setZones(res.zones);
      return res;
    } catch (err) {
      openModal({
        title: "Delete failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
      throw err;
    }
  };

  return {
    zones,
    loading,
    error,
    loadZones,
    addZone,
    deleteZone
  };
}