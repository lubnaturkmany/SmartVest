import { useEffect, useRef } from "react";
import { useModal } from "./useModal";

export function useDangerAlerts(alerts, enabled = true, showPopup = true) {
  const { openModal } = useModal();
  const seen = useRef(new Set());

  useEffect(() => {
    if (!enabled || !alerts?.length || !showPopup) return;

    // نرتب حسب الأولوية: Danger أولاً
    const sorted = [...alerts].sort((a, b) => {
      const priority = (type) => {
        if (type === "Danger") return 2;
        if (type === "Warning") return 1;
        return 0;
      };

      return priority(b.type) - priority(a.type);
    });

    // نجيب أعلى واحد فقط
    const alert = sorted[0];

    if (!alert || seen.current.has(alert._id)) return;

    seen.current.add(alert._id);

    openModal({
      title: `${alert.type} Alert`,
      message: alert.message,
      type: alert.type.toLowerCase(), // danger / warning
      confirmText: "Acknowledge",
      hideCancel: true
    });

  }, [alerts, enabled, openModal]);
}