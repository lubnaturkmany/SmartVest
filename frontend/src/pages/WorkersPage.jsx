import { useEffect, useState } from "react";
import { useWorkers } from "../hooks/useWorkers";
import { useFactories } from "../hooks/useFactories";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";
import Pagination from "../components/Pagination";
import "../styles/workers.css";

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
    factory: factoryId,
    latitude: "",
    longitude: ""
  };
}

export default function WorkersPage() {
  const { user } = useAuth();
  const { factories, loading: factoriesLoading, error: factoriesError } = useFactories();
  const {workers,totalWorkers,loading,error,page,totalPages,goNext,goPrev,addWorker,deleteWorker} = useWorkers();
  const { openModal } = useModal();

  const [form, setForm] = useState(() => makeInitialForm(""));
  const [busy, setBusy] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const id = userFactoryId(user);
    if (id) {
      setForm((p) => ({ ...p, factory: id }));
    }
  }, [user]);

    // ✨ تعبئة المصنع تلقائيًا
  useEffect(() => {
    if (user?.factory) {
      setForm(p => ({ ...p, factory: user.factory }));
    }
  }, [user]);

  const onAddWorker = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addWorker({
        ...form,
        age: Number(form.age),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        factory: form.factory
      });
      setForm(makeInitialForm(form.factory));
      setShowPanel(false);
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
    <div className="grid" style={{ position: "relative" }}>
      <h2 className="page-title">👷 Workers</h2>
      {/* عرض عدد العمال */}
      {totalWorkers !== undefined && (
      <div className="users-counter" style={{ margin: "1px 0", fontWeight: "bold" }}>
        Total Workers: {totalWorkers}
        </div>
      )}
        {loading ? <p>Loading workers...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table workers-table">
          <thead>
            <tr>
              <th>Worker ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Factory</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workers
            .sort((a, b) => Number(a.workerID) - Number(b.workerID))
            .map((w) => (
              <tr key={w._id || w.workerID}>
                <td>{w.workerID}</td>
                <td>{w.firstName} {w.lastName}</td>
                <td>{w.age}</td>
                <td>{ w.factory}</td>
                <td>
                  {(user.role === "ADMIN" || user.role === "FACTORY_MANAGER") && (
                    <button className="ghost" onClick={() => onDeleteClick(w.workerID)}>
                      Delete
                      </button>
                    )}
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
        <Pagination
        page={page}
        totalPages={totalPages}
        goNext={goNext}
        goPrev={goPrev}
        />

      {/* زر Add Worker أعلى يمين الشاشة */}
      {user.role === "ADMIN" || user.role === "FACTORY_MANAGER" ? (
      <button
        onClick={() => setShowPanel(true)}
        style={{
          position: "fixed",
          top: "25px",
          right: "30.5px",
          padding: "10px 20px",
          background: "#4e7ea3",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1001
        }}
      >
        Add Worker
      </button>
      ) : null}

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
          background: "#ffffff",
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
            background: "#4e7ea3",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ✖
        </button>

        <h3>Add Worker</h3>

        <form className="grid two" onSubmit={onAddWorker}>
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
          <div className="add-worker-btn" style={{ gridColumn: "1 / -1", marginTop: "25px" }}>
          <button type="submit" disabled={busy} style={{ width: "100%" }}>
            {busy ? "Adding..." : "Add Worker"}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}