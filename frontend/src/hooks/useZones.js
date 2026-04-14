import { useState, useCallback } from "react";
import { apiClient } from "../lib/apiClient";
import { useModal } from "./useModal"; // إذا حابب تعرض رسائل
import { useAuth } from "./useAuth";

export function useZones() {
  const { openModal } = useModal();
  const { user } = useAuth();

  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب الزونات لمصنع معين
  const loadZones = useCallback(async (factoryId) => {
    setLoading(true);
    setError(""); 
    try {
    let res;
    if (user.role === "ADMIN") {
      res = await apiClient.get("/api/factories/zones/all"); // كل الزونات للادمن
    } else {
      if (!factoryId) return;
      res = await apiClient.get(`/api/factories/${factoryId}/zones`);
    }
      setZones(res?.zones || res?.data?.zones || []);
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
      await loadZones(factoryId);
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
      console.log("FACTORY ID:", factoryId);
      console.log("RESPONSE DATA:", res.data);
      console.log("ZONES:", res.data?.zones);
      setZones(res.data?.zones || []);
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