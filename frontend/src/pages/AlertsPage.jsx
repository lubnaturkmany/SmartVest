import { useAlerts } from "../hooks/useAlerts";
import Pagination from "../components/Pagination";
import { apiClient } from "../lib/apiClient";
import "../styles/alerts.css";

export default function AlertsPage() {
  const {alerts,setAlerts,loading,error,totalAlerts,page,totalPages,goNext,goPrev,loadAlerts} = useAlerts(10000);
  const handleResolve = async (id) => {
  try {
    await apiClient.patch(`/api/alerts/${id}/resolve`);

    setAlerts(prev =>
  prev.filter(alert => alert._id !== id)
);

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="grid">
      <h2 className="page-title">🚨 Alerts</h2>
      {/* Total Alerts */}
      {totalAlerts !== undefined && (
        <div className="users-counter" style={{ margin: "1px 0", fontWeight: "bold" }}>
          Total Alerts: {totalAlerts}
        </div>
      )}
        {loading ? <p>Loading alerts...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table alerts-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Worker ID</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id}>
                <td>{alert.type}</td>
                <td>{alert.workerID}</td>
                <td>{alert.message || "-"}</td>
                <td>{alert.date ? new Date(alert.date).toLocaleString() : "-"}</td>
                <td>
                  <input
                  type="checkbox"
                  checked={alert.isResolved || false}
                  onChange={() => handleResolve(alert._id)}
                  />
                  </td>
              </tr>
            ))}
            {!alerts.length ? (
              <tr>
                <td colSpan={5}>No alerts found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <Pagination
        page={page}
        totalPages={totalPages}
        goNext={goNext}
        goPrev={goPrev}
        />
      </div>
  );
}
