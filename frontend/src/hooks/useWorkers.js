import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 جلب العمال من السيرفر
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

  // تحميل أولي
  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  // ➕ إضافة عامل
    const addWorker = async (payload) => {
    const data = await apiClient.post("/api/workers", payload);
    setWorkers(prev => [...prev, data.worker]);  // worker هنا يحتوي على factory populated
    };

  // ❌ حذف عامل
  const deleteWorker = async (workerID) => {
    await apiClient.delete(`/api/workers/${workerID}`);

    // 🔥 بعد الحذف → تحديث البيانات
    await loadWorkers();
  };

  return {
    workers,
    loading,
    error,
    loadWorkers,
    addWorker,
    deleteWorker
  };
}