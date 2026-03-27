import { useEffect, useRef } from "react";
import { useAlerts } from "./useAlerts";
import { useModal } from "./useModal";

export function useDangerAlerts(enabled = true) {
  const { alerts } = useAlerts(enabled ? 6000 : 0);
  const { openModal } = useModal();
  const seen = useRef(new Set());

  useEffect(() => {
    if (!enabled) return;
    alerts
      .filter((a) => a.type === "Danger" || a.type === "Warning")
      .forEach((alert) => {
        if (seen.current.has(alert._id)) return;
        seen.current.add(alert._id);
        openModal({
          title: `${alert.type} Alert`,
          message: alert.message || `${alert.type} detected for worker ${alert.workerID}`,
          confirmText: "Acknowledge",
          hideCancel: true
        });
      });
  }, [alerts, enabled, openModal]);
}
