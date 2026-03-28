import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  
   const token = params.get("token"); // ناخد التوكن من الرابط

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Please fill in both fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ newPassword: password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to change password");
      } else {
        // نخزن التوكن النهائي ونروح للداشبورد
        if (data.token) {
          localStorage.setItem("sv_token", data.token);
          localStorage.removeItem("sv_temp_token");
        }
        setSuccess(data.message || "Password changed successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError("Could not reach server.");
    } finally {
      setBusy(false);
    }
  };

  if (!token) return <div style={{ padding: 40 }}>Invalid or missing token</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <form onSubmit={submit} style={{ width: "300px", background: "rgba(0,0,0,0.6)", padding: 20, borderRadius: 15, color: "#fff" }}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8, borderRadius: 8 }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8, borderRadius: 8 }}
        />

        <button disabled={busy} style={{ width: "100%", padding: 10, background: "#f1c40f", color: "#0a3d62", border: "none", borderRadius: 8 }}>
          {busy ? "Saving..." : "Change Password"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
}