import { useState } from "react";
import { useFactories } from "../hooks/useFactories";
import { useModal } from "../hooks/useModal";

export default function FactoriesPage() {
  const { factories, loading, error } = useFactories();
  console.log("Loaded factories:", factories);
  const { openModal } = useModal();
  const [name, setName] = useState("");
  const [showPanel, setShowPanel] = useState(false); // <<< التحكم باللوحة الجانبية
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setName("");
      setShowPanel(false); // إخفاء اللوحة بعد الإضافة
      openModal({
        title: "Success",
        message: "Factory added successfully.",
        confirmText: "OK",
        hideCancel: true
      });
    } catch (err) {
      openModal({
        title: "Action failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid" style={{ position: "relative" }}>
      <h2 style={{ margin: 0 }}>Factories</h2>
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Total Factories: {factories.length}
        </div>
      {/* جدول المصانع */}
      <div className="card">
        {loading ? <p>Loading factories...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>API Key</th>
              <th>Zones</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory) => (
              <tr key={factory._id}>
                <td>{ factory.name}</td>
                <td>{factory.apiKey || "-"}</td>
                <td>{factory.zoneCount || 0}</td>
              </tr>
            ))}
            {!factories.length ? (
              <tr>
                <td colSpan={3}>No factories found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}