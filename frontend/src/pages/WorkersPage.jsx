import { useEffect, useState } from "react";
import { useWorkers } from "../hooks/useWorkers";
import { useFactories } from "../hooks/useFactories";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";

function userFactoryId(user) {
  if (!user?.factory) return "";
  return typeof user.factory === "object" && user.factory._id
    ? String(user.factory._id)
    : String(user.factory);
}

function makeInitialForm(factoryId = "") {
  return {
    workerID: "",
    firstName: "",
    lastName: "",
    age: "",
    role: "Operator",
    factory: factoryId,
    latitude: "",
    longitude: ""
  };
}

export default function WorkersPage() {
  const { user } = useAuth();
  const { factories, loading: factoriesLoading, error: factoriesError } = useFactories();
  const { workers, loading, error, addWorker, deleteWorker } = useWorkers();
  const { openModal } = useModal();
  const [form, setForm] = useState(() => makeInitialForm(""));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = userFactoryId(user);
    if (id) {
      setForm((p) => ({ ...p, factory: id }));
    }
  }, [user]);

  const onAddWorker = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addWorker({
        ...form,
        factory: form.factory,
        age: Number(form.age),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude)
      });
      setForm(makeInitialForm(form.factory || userFactoryId(user)));
      openModal({
        title: "Success",
        message: "Added successfully",
        confirmText: "OK",
        hideCancel: true
      });
    } catch (err) {
      openModal({
        title: "Add failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
    } finally {
      setBusy(false);
    }
  };

  const onDeleteClick = (workerID) => {
    openModal({
      title: "Delete Worker",
      message: `Are you sure you want to delete worker ${workerID}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteWorker(workerID);
          openModal({
            title: "Deleted",
            message: "Worker deleted successfully.",
            confirmText: "OK",
            hideCancel: true
          });
        } catch (err) {
          openModal({
            title: "Delete failed",
            message: err.message,
            confirmText: "Close",
            hideCancel: true
          });
        }
      }
    });
  };

  return (
    <div className="grid">
      <h2 style={{ margin: 0 }}>Workers</h2>
      <form className="card grid two" onSubmit={onAddWorker}>
        <div>
          <label>Worker ID</label>
          <input
            value={form.workerID}
            onChange={(e) => setForm((p) => ({ ...p, workerID: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>First Name</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <input
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            required
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Factory</label>
          <select
            value={form.factory}
            onChange={(e) => setForm((p) => ({ ...p, factory: e.target.value }))}
            required
          >
            <option value="">Select a factory</option>
            {factories.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          {factoriesLoading ? <small style={{ color: "#4e7ea3" }}>Loading factories…</small> : null}
          {factoriesError ? <small style={{ color: "#165078" }}>{factoriesError}</small> : null}
          {!factoriesLoading && !factories.length ? (
            <small style={{ color: "#165078" }}>
              No factories yet. Create one on the Factories page first.
            </small>
          ) : null}
        </div>
        <div>
          <label>Latitude</label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Longitude</label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
            required
          />
        </div>
        <div style={{ alignSelf: "end" }}>
          <button type="submit" disabled={busy}>
            {busy ? "Adding..." : "Add Worker"}
          </button>
        </div>
      </form>

      <div className="card">
        {loading ? <p>Loading workers...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Worker ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id || w.workerID}>
                <td>{w.workerID}</td>
                <td>{w.firstName} {w.lastName}</td>
                <td>{w.age}</td>
                <td>{w.role}</td>
                <td>
                  <button className="ghost" onClick={() => onDeleteClick(w.workerID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!workers.length ? (
              <tr>
                <td colSpan={5}>No workers found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
