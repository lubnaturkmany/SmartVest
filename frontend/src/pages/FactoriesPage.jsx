import { useState } from "react";
import { useFactories } from "../hooks/useFactories";
import { useModal } from "../hooks/useModal";

export default function FactoriesPage() {
  const { factories, loading, error, createFactory } = useFactories();
  const { openModal } = useModal();
  const [name, setName] = useState("");
  const [showPanel, setShowPanel] = useState(false); // <<< التحكم باللوحة الجانبية
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createFactory(name);
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

      {/* زر Add Factory أعلى يمين الشاشة */}
      <button
        onClick={() => setShowPanel(true)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: "#4e7ea3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1001
        }}
      >
        Add Factory
      </button>

      {/* overlay خلف اللوحة */}
      {showPanel && (
        <div
          onClick={() => setShowPanel(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000
          }}
        ></div>
      )}

      {/* اللوحة الجانبية */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: showPanel ? 0 : "-400px",
          width: "400px",
          height: "100%",
          background: "#fff",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.3)",
          padding: "20px",
          transition: "right 0.3s ease",
          zIndex: 1002
        }}
      >
        <button
          onClick={() => setShowPanel(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ✖
        </button>

        <h3>Add Factory</h3>

        <form className="grid" onSubmit={submit}>
          <label>Factory Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={busy} style={{ marginTop: "10px" }}>
            {busy ? "Creating..." : "Create Factory"}
          </button>
        </form>
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
                <td>{factory.name}</td>
                <td>{factory.apiKey || "-"}</td>
                <td>{factory.zones?.length || 0}</td>
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