import { useCallback, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (handler) => {
    setLoading(true);
    setError("");
    try {
      return await handler(apiClient);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}
