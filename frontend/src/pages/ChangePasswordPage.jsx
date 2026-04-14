import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/apiClient";

export default function ChangePasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

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
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const res = await apiClient.post("/api/auth/change-password", {
        token: token,        // <-- حط token هون
        newPassword: password // <-- الباسورد الجديد
        });
  

      setSuccess(res.message || "Password changed successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setBusy(false);
    }
  };

  if (!token) return <div style={{ padding: 40 }}>Invalid or missing token</div>;

  return (
    <>
      {/* 🔥 CSS نفس تبعك */}
      <style>{`
        body {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #0a3d62, #3c6382);
          margin: 0;
          color: #f0f0f0;
          height: 100vh;
          overflow: hidden;
          padding: 50px 0;
          position: relative;
        }

        .cp-container {
          background: rgba(0, 0, 0, 0.6);
          padding: 2.5rem;
          border-radius: 15px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          text-align: center;
          margin: 0 auto;
          position: relative;
        }

        .cp-helmet {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          color: #f39c12;
        }

        .cp-title {
          margin-bottom: 1.5rem;
          font-weight: 700;
          color: #f1c40f;
        }

        .cp-label {
          display: block;
          margin: 0.5rem 0 0.25rem;
          text-align: left;
        }

        .cp-input {
          width: 100%;
          padding: 0.85rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .cp-input:focus {
          outline: none;
          border-color: #f1c40f;
        }

        .cp-btn {
          width: 100%;
          padding: 1rem;
          background: #f1c40f;
          color: #0a3d62;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .cp-btn:hover {
          background: #f39c12;
        }

        .cp-error { color: #e74c3c; }
        .cp-success { color: #2ecc71; }
      `}</style>

      <div className="cp-container">
        <div className="cp-helmet">🦺</div>
        <h1 className="cp-title">Change Your Password</h1>

        <form onSubmit={submit}>
          <label className="cp-label">New Password</label>
          <input
            className="cp-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="cp-label">Confirm Password</label>
          <input
            className="cp-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="cp-btn" disabled={busy}>
            {busy ? "Saving..." : "Change Password"}
          </button>

          {error && <p className="cp-error">{error}</p>}
          {success && <p className="cp-success">{success}</p>}
        </form>
      </div>
    </>
  );
}