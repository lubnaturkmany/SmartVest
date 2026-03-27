import { useState } from "react";
import { useFactories } from "../hooks/useFactories";
import { useModal } from "../hooks/useModal";

export default function FactoriesPage() {
  const { factories, loading, error, createFactory } = useFactories();
  const { openModal } = useModal();
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createFactory(name);
      setName("");
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
    }
  };

  return (
    <div className="grid">
      <h2 style={{ margin: 0 }}>Factories</h2>
      <form className="card grid" onSubmit={submit}>
        <label>Factory Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit">Create Factory</button>
      </form>
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
