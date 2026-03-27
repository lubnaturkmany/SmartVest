import { useMemo } from "react";
import WorkerStatusChart from "../components/charts/WorkerStatusChart";
import { useWorkers } from "../hooks/useWorkers";
import { useAlerts } from "../hooks/useAlerts";

export default function DashboardPage() {
  const { workers } = useWorkers();
  const { alerts } = useAlerts();

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

  return (
    <div className="grid">
      <div className="top-bar">
        <h2 style={{ margin: 0 }}>Dashboard</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Total Workers</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{workers.length}</p>
        </div>
        <div className="card">
          <h3>Total Alerts</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{alerts.length}</p>
        </div>
      </div>
      <WorkerStatusChart data={statusData} workerCount={workers.length} />
    </div>
  );
}
