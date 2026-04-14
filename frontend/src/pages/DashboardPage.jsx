import { useMemo } from "react";
import WorkerStatusChart from "../components/charts/WorkerStatusChart";
import { useWorkers } from "../hooks/useWorkers";
import { useAlerts } from "../hooks/useAlerts";

export default function DashboardPage() {
  const { workers } = useWorkers();
  const { alerts } = useAlerts();

  // نحسب بيانات حالة العمال لكل نوع
  const statusData = useMemo(() => {
    const dangerWorkerIDs = new Set(
      alerts.filter((a) => a.type === "Danger").map((a) => a.workerID)
    );
    const warningWorkerIDs = new Set(
      alerts.filter((a) => a.type === "Warning").map((a) => a.workerID)
    );

    let danger = 0;
    let warning = 0;
    let normal = 0;

    workers.forEach((worker) => {
      if (dangerWorkerIDs.has(worker.workerID)) {
        danger += 1;
      } else if (warningWorkerIDs.has(worker.workerID)) {
        warning += 1;
      } else {
        normal += 1;
      }
    });

    return [
      { name: "Normal", value: normal },
      { name: "Warning", value: warning },
      { name: "Danger", value: danger }
    ];
  }, [workers, alerts]);

  // حساب نسبة الخطر
  const dangerPercentage = useMemo(() => {
    const dangerCount = statusData.find(d => d.name === "Danger")?.value || 0;
    return workers.length ? ((dangerCount / workers.length) * 100).toFixed(1) : 0;
  }, [statusData, workers]);

const dangerLevel =
  dangerPercentage < 30 ? "low" :
  dangerPercentage < 70 ? "medium" : "high";

  // مثال على منطقة الخطر (تقدر تربطه بالـ alerts لاحقاً)
  const dangerZones = useMemo(() => {
  const zones = alerts
    .filter(a => a.type === "Danger" && a.zone) // فقط التنبيهات الخطرة مع منطقة محددة
    .map(a => a.zone);
  return zones.length ? [...new Set(zones)].join(", ") : null; // ← بدل "-" نحط null أو ""
}, [alerts]);

  return (
    <div className="dashboard-full">
      <div className="grid">
        {/* Top bar */}
        <div className="top-bar">
          <h2 style={{ margin: 0 }}>Dashboard</h2>
        </div>

        {/* Cards */}
        <div className="dashboard-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="card stat-card stat-card-center card-workers">
            <h4>👷 Total Workers</h4>
            <p style={{ fontSize: 28, margin: 0 }}>{workers.length}</p>
          </div>
          <div className="card stat-card stat-card-center card-alerts">
            <h4>⚠️ Total Alerts</h4>
            <p style={{ fontSize: 28, margin: 0 }}>{alerts.length}</p>
          </div>
          <div className={`card stat-card stat-card-center danger-${dangerLevel}`}>
            <h4>Danger %</h4>
            <p style={{ fontSize: 28, margin: 0 }}>{dangerPercentage}%</p>
            <div className="progress-bar">
              <div
              className="progress-fill"
              style={{ width: `${dangerPercentage}%` }}
              />
              </div>
          </div>
          <div className="card stat-card stat-card-center card-zones">
            <h4>Danger Zones</h4>
            <p style={{ fontSize: 28, margin: 0 }}>
              {dangerZones || "No danger zones"} {/* إذا ما في خطر يظهر رسالة افتراضية */}
              </p>
          </div>
        </div>

        {/* Worker status chart */}
        <div className="dashboard-chart-card">
          <WorkerStatusChart
          data={statusData}
          workerCount={workers.length}
          dangerLevel={dangerLevel}
          />
        </div>
      </div>
    </div>
  );
}