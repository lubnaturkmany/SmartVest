import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useModal } from "../hooks/useModal";
import { useFactories } from "../hooks/useFactories";
import { useAuth } from "../hooks/useAuth";

const initial = {
  username: "",
  email: "",
  password: "",
  role: "SECURITY",
  workerID: "",
  factoryId: "",   
  factoryName: ""
};

export default function UsersPage() {
  const { users, loading, error, registerUser, loadUsers, totalUsers, page, totalPages, goNext, goPrev } = useUsers();
  const { openModal } = useModal();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [showPanel, setShowPanel] = useState(false); // <<< التحكم باللوحة الجانبي

  if (authLoading) return <p>Loading...</p>;
  if (!user) return <p>No user logged in.</p>;
  
  
  
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
       
      const payload = { ...form };
      if (form.role === "FACTORY_MANAGER") {
        payload.factoryName = form.factoryName;
        delete payload.factoryId;
      }

      await registerUser(form);
      setPage(1);
      setForm(initial);
      setShowPanel(false); // إخفاء اللوحة بعد الإضافة
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
    <div className="grid" style={{ position: "relative" }}>
      <h2 style={{ margin: 0 }}>Users</h2>

      {/* Total Users */}
      {totalUsers !== undefined && (
        <div style={{ margin: "10px 0", fontWeight: "bold" }}>
          Total Users: {totalUsers}
          </div>
        )}

      {/* زر Add User أعلى يمين الشاشة */}
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
        Add User
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

        <h3>Add User</h3>

        <form className="grid two" onSubmit={submit}>
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
              {user?.role === "ADMIN" && (
              <option value="FACTORY_MANAGER">FACTORY_MANAGER</option>
              )}
              <option value="SECURITY">SECURITY</option>
              <option value="SAFETY">SAFETY</option>
            </select>
          </div>

          {/* إذا Factory Manager → حقل اسم المصنع */}
          {form.role === "FACTORY_MANAGER" && (
          <div>
            <label>Factory Name</label>
            <input
              value={form.factoryName}
              onChange={(e) => setForm((p) => ({ ...p, factoryName: e.target.value }))}
              required
            />
          </div>
          )}
          <div>
            <label>Worker ID (optional)</label>
            <input
              value={form.workerID}
              onChange={(e) => setForm((p) => ({ ...p, workerID: e.target.value }))}
            />
          </div>
          <div style={{ alignSelf: "end", gridColumn: "1 / -1" }}>
            <button type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* جدول المستخدمين */}
      <div className="card">
        {loading ? <p>Loading users...</p> : null}
        {error ? <p>{error}</p> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...users]
            .sort((a, b) => (a._id === user?._id ? -1 : b._id === user?._id ? 1 : 0)) // 👈 رح نشرحها تحت
            .map((u) => (
            <tr
            key={u._id || u.email}
            style={user?._id === u._id ? { background: "#f0fdf4" } : {}}
            >
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
          {user?._id === u._id && (
            <span style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              👤 You
            </span>
          )}
        </td>
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
      {/* Pagination */}
      {users.length > 0 && totalPages > 1 && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={goPrev} disabled={page === 1}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={goNext} disabled={page === totalPages}>Next</button>
          </div>
        )}
        </div>
        );
      }