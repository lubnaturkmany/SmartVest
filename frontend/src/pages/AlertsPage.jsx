import { useAlerts } from "../hooks/useAlerts";

export default function AlertsPage() {
  const { alerts, loading, error } = useAlerts(10000);

  return (
    <div className="grid">
      <h2 style={{ margin: 0 }}>Alerts</h2>
      <div className="card">
        {loading ? <p>Loading alerts...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Worker ID</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.type}</td>
                <td>{alert.workerID}</td>
                <td>{alert.message || "-"}</td>
                <td>{alert.date ? new Date(alert.date).toLocaleString() : "-"}</td>
              </tr>
            ))}
            {!alerts.length ? (
              <tr>
                <td colSpan={4}>No alerts found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
