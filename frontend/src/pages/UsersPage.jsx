import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useModal } from "../hooks/useModal";

const initial = {
  username: "",
  email: "",
  password: "",
  role: "SECURITY",
  workerID: ""
};

export default function UsersPage() {
  const { users, loading, error, registerUser } = useUsers();
  const { openModal } = useModal();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await registerUser(form);
      setForm(initial);
      openModal({
        title: "Success",
        message: "User created successfully.",
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
    <div className="grid">
      <h2 style={{ margin: 0 }}>Users</h2>
      <form className="card grid two" onSubmit={submit}>
        <div>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="FACTORY_MANAGER">FACTORY_MANAGER</option>
            <option value="SECURITY">SECURITY</option>
            <option value="SAFETY">SAFETY</option>
          </select>
        </div>
        <div>
          <label>Worker ID (optional)</label>
          <input
            value={form.workerID}
            onChange={(e) => setForm((p) => ({ ...p, workerID: e.target.value }))}
          />
        </div>
        <div style={{ alignSelf: "end" }}>
          <button type="submit" disabled={busy}>
            {busy ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
      <div className="card">
        {loading ? <p>Loading users...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.email}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td colSpan={3}>No users available from this API.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
