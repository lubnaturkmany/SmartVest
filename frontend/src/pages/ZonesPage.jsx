import { useState, useEffect } from "react";
//import { useFactories } from "../hooks/useFactories";
import { useZones } from "../hooks/useZones";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";

export default function ZonesPage() {
  const { user } = useAuth();
  //const { factories, loading: factoriesLoading, error: factoriesError } = useFactories();
  const { zones, loading, error, loadZones, addZone, deleteZone } = useZones();
  const { openModal } = useModal();

  const [showPanel, setShowPanel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    zoneName: "",
    types: "all",
    center: { lat: "", lng: "" },
    radius: "",
    threshold: "",
    factoryId: ""
  });

useEffect(() => {
  if (!user) return;

  // لو Admin → نرسل loadZones بدون factoryId
  if (user.role === "ADMIN") {
    loadZones(); // ← سيطر داخل hook على اختيار الرابط الصحيح
  } else if (user.factory) {
    setForm(p => ({ ...p, factoryId: user.factory }));
    loadZones(user.factory);
  }
}, [user, loadZones]);

  const onAddZone = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addZone(form.factoryId, {
      zoneName: form.zoneName,
      types: form.types === "all" ? ["gas", "temperature", "flame"] : [form.types],
      center: { lat: Number(form.center.lat), lng: Number(form.center.lng) },
      radius: Number(form.radius),
      threshold: Number(form.threshold)
    });


      setForm({
        zoneName: "",
        types: "all",
        center: { lat: "", lng: "" },
        radius: "",
        threshold: "",
        factoryId: form.factoryId
      });
      setShowPanel(false);
      openModal({ title: "Success", message: "Zone added", confirmText: "OK", hideCancel: true });
    } catch (_) {}
    setBusy(false);
  };

  const onDeleteZone = (zoneId) => {
    openModal({
      title: "Delete Zone",
      message: "Are you sure you want to delete this zone?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteZone(form.factoryId || zones[0]?.factory?._id, zoneId);
          openModal({ title: "Deleted", message: "Zone deleted successfully.", confirmText: "OK", hideCancel: true });
        } catch (_) {}
      }
    });
  };

  const canManageZone = ["ADMIN", "FACTORY_MANAGER", "SAFETY"].includes(user.role);

  return (
    <div className="grid" style={{ position: "relative" }}>
      <h2 style={{ margin: 0 }}>Zones</h2>
      {/* بطاقة Total Zones */}
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Total Zones: {zones.length}
        </div>

      <div className="card">
        {loading ? <p>Loading zones…</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              {user.role === "ADMIN" && <th>Factory Name</th>}
              <th>types</th>
              <th>Center</th>
              <th>Radius</th>
              <th>Threshold</th>
              {canManageZone && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(zones) && zones.map((z) => (
              <tr key={z._id}>
                <td>{z.zoneName}</td>
                {user.role === "ADMIN" && (
                  <td>{z.factory?.name || "-"}</td>
                  )}
                <td>{Array.isArray(z.types) ? z.types.join(", ") : z.types}</td>
                <td>{z.center.lat}, {z.center.lng}</td>
                <td>{z.radius}</td>
                <td>{z.threshold}</td>
                {canManageZone && (
                  <td>
                    <button className="ghost" onClick={() => onDeleteZone(z._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {!zones.length && <tr><td colSpan={canManageZone ? 6 : 5}>No zones found.</td></tr>}
          </tbody>
        </table>
      </div>

      {canManageZone && (
        <>
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
            Add Zone
          </button>

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
              style={{ position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none", fontSize: "18px", cursor: "pointer" }}
            >
              ✖
            </button>
            <h3>Add Zone</h3>
            <form className="grid two" onSubmit={onAddZone}>
              <div>
                <label>Name</label>
                <input value={form.zoneName} onChange={(e) => setForm(p => ({ ...p, zoneName: e.target.value }))} required />
              </div>
              <div>
                <label>types</label>
                <select value={form.types} onChange={(e) => setForm(p => ({ ...p, types: e.target.value }))}>
                  <option value="all">All</option>
                  <option value="gas">Gas</option>
                  <option value="temperature">Temperature</option>
                  <option value="flame">Flame</option>
                </select>
              </div>
              <div>
                <label>Latitude</label>
                <input type="number" step="any" value={form.center.lat} onChange={(e) => setForm(p => ({ ...p, center: { ...p.center, lat: e.target.value } }))} required />
              </div>
              <div>
                <label>Longitude</label>
                <input type="number" step="any" value={form.center.lng} onChange={(e) => setForm(p => ({ ...p, center: { ...p.center, lng: e.target.value } }))} required />
              </div>
              <div>
                <label>Radius (m)</label>
                <input type="number" value={form.radius} onChange={(e) => setForm(p => ({ ...p, radius: e.target.value }))} required />
              </div>
              <div>
                <label>Threshold</label>
                <input type="number" value={form.threshold} onChange={(e) => setForm(p => ({ ...p, threshold: e.target.value }))} required />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button type="submit" disabled={busy} style={{ width: "100%" }}>
                  {busy ? "Adding..." : "Add Zone"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}