import { useMemo } from "react";
import WorkerStatusChart from "../components/charts/WorkerStatusChart";
import { useWorkers } from "../hooks/useWorkers";
import { useAlerts } from "../hooks/useAlerts";
import { useLocation } from "react-router-dom";
import { useDangerAlerts } from "../hooks/useDangerAlerts";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const { workers = [], totalWorkers = 0 } = useWorkers();
  const { alerts } = useAlerts(10000, false, "all");
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

useDangerAlerts(alerts, isDashboard);

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
      if (dangerWorkerIDs.has(worker.workerID)) danger += 1;
      else if (warningWorkerIDs.has(worker.workerID)) warning += 1;
      else normal += 1;
    });

    return [
      { name: "Normal", value: normal },
      { name: "Warning", value: warning },
      { name: "Danger", value: danger }
    ];
  }, [workers, alerts]);

    const hazardTypeData = useMemo(() => {
    const gas = alerts.filter(
  a =>
    a.hazardType === "gas" ||
    a.message?.includes("Multiple hazards")
).length;

const heat = alerts.filter(
  a =>
    a.hazardType === "temperature" ||
    a.message?.includes("Multiple hazards")
).length;

const flame = alerts.filter(
  a =>
    a.hazardType === "flame" ||
    a.message?.includes("Multiple hazards")
).length;

  return [
    { name: "Gas", value: gas },
    { name: "Heat", value: heat },
    { name: "Flame", value: flame }
  ];
}, [alerts]);

  const dangerPercentage = useMemo(() => {
    const dangerCount =
      statusData.find((d) => d.name === "Danger")?.value || 0;

    return workers.length
      ? ((dangerCount / workers.length) * 100).toFixed(1)
      : 0;
  }, [statusData, workers]);

  const dangerLevel =
    dangerPercentage < 30
      ? "low"
      : dangerPercentage < 70
      ? "medium"
      : "high";

  const dangerZones = useMemo(() => {
    const zones = alerts
  .filter(a => a.type === "Danger" && a.zone)
  .map(a => a.zone);

    return zones.length ? [...new Set(zones)].join(", ") : null;
  }, [alerts]);

  return (
    <div className="dashboard-full">
      <div className="grid">

        {/* Top bar */}
        <div className="top-bar">
          <h2>Dashboard</h2>
        </div>

        {/* ================= KPI SECTION  ================= */}
        <div
          className="dashboard-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px"
          }}
        >

          <div className="card stat-card stat-card-center card-workers">
            <h4>👷 Total Workers</h4>
            <p>{totalWorkers}</p>
          </div>

          <div className="card stat-card stat-card-center card-alerts">
            <h4>⚠️ Total Alerts</h4>
            <p>{alerts.length}</p>
          </div>

          <div className={`card stat-card stat-card-center danger-${dangerLevel}`}>
            <h4>Danger %</h4>
            <p>{dangerPercentage}%</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${dangerPercentage}%` }}
              />
            </div>
          </div>

          <div className="card stat-card stat-card-center card-zones">
            <h4>Danger Zones</h4>
            <p>{dangerZones || "No danger zones"}</p>
          </div>

        </div>

        {/* ================= CHART ================= */}
        <div className="dashboard-chart-card">
          <WorkerStatusChart
            data={statusData}
            hazardTypeData={hazardTypeData}
            workerCount={workers.length}
            dangerLevel={dangerLevel}
          />
        </div>

      </div>
    </div>
  );
}