import { useState } from "react";
import { useFactories } from "../hooks/useFactories";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";
import Pagination from "../components/Pagination";
import "../styles/factories.css";

export default function FactoriesPage() {
  const {factories,loading,error,page,totalPages,goNext,goPrev} = useFactories();
  console.log("Loaded factories:", factories);
  const { openModal } = useModal();
   const onDeleteFactory = (id) => {
    console.log("delete factory", id);};
  const [name, setName] = useState("");
  const [showPanel, setShowPanel] = useState(false); // <<< التحكم باللوحة الجانبية
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();

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
      <h2 className="page-title">🏭 Factories</h2>
      <div className="users-counter" style={{ margin: "1px 0", fontWeight: "bold" }}>
        Total Factories: {factories.length}
        </div>
      {/* جدول المصانع */}
        {loading ? <p>Loading factories...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table table--factories">
          <thead>
            <tr>
              <th>Name</th>
              <th>API Key</th>
              <th>Zones</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory) => (
              <tr key={factory._id}>
                <td>{ factory.name}</td>
                <td>{factory.apiKey || "-"}</td>
                <td>{factory.zoneCount || 0}</td>
                 <td>
                  {(user.role === "ADMIN" || user.role === "FACTORY_MANAGER") && (
                    <button
                    className="ghost"
                    onClick={() => onDeleteFactory(factory._id)}
                    >
                      Delete
                      </button>
                    )}
                    </td>
              </tr>
            ))}
            {!factories.length ? (
              <tr>
                <td colSpan={3}>No factories found.</td>
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