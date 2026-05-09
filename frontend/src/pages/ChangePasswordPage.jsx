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
        token,
        newPassword: password
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
      <style>{`
        body {
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(155deg,#bfe8ff 0%,#d2f0ff 22%,#9fd9ff 48%,#c8e9ff 72%,#a8d9f8 100%);
          position: relative;
        }

        /* ======= Decorative circles ======= */
        .bg-circles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .bg-circles span {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          filter: blur(2px);
        }

        .bg-circles span:nth-child(1) {
          width: 220px;
          height: 220px;
          top: -50px;
          left: -60px;
        }

        .bg-circles span:nth-child(2) {
          width: 180px;
          height: 180px;
          bottom: -40px;
          right: -40px;
        }

        .bg-circles span:nth-child(3) {
          width: 140px;
          height: 140px;
          top: 20%;
          right: -30px;
        }

        .bg-circles span:nth-child(4) {
          width: 160px;
          height: 160px;
          bottom: 15%;
          left: -40px;
        }

        /* ======= Card ======= */
        .cp-container {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 48px 38px 52px 44px / 42px 56px 48px 50px;
          width: 100%;
          max-width: 420px;
          margin: auto;
          box-shadow:
            0 28px 60px rgba(60, 140, 200, 0.28),
            0 0 0 1px rgba(180, 220, 255, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .cp-container::before {
          content: "";
          position: absolute;
          inset: -40% -20% auto -20%;
          height: 120%;
          background: radial-gradient(
            ellipse at 50% 0%,
            rgba(200, 235, 255, 0.35) 0%,
            transparent 55%
          );
          pointer-events: none;
        }

        .cp-helmet {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          color: #2a96d8;
        }

        .cp-title {
          margin-bottom: 1.5rem;
          font-weight: 800;
          color: #0d3d5c;
        }

        .cp-label {
          display: block;
          margin: 0.5rem 0 0.25rem;
          text-align: left;
          color: #6a93b0;
          font-size: 0.9rem;
        }

        .cp-input {
          width: 100%;
          padding: 0.85rem;
          margin-bottom: 1rem;
          border-radius: 999px;
          border: 2px solid #c5e4f5;
          background: linear-gradient(180deg, #f8fcff 0%, #eef7ff 100%);
          color: #133a59;
          outline: none;
          box-shadow: 0 6px 18px rgba(100, 170, 210, 0.18);
        }

        .cp-input:focus {
          border-color: #4eb0e8;
        }

        .cp-btn {
          width: 100%;
          padding: 14px 24px;
          border-radius: 999px;
          border: none;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(95deg, #6ec4f5 0%, #3aa8e8 45%, #5ab8f0 100%);
          box-shadow: 0 10px 28px rgba(50, 150, 210, 0.35);
          cursor: pointer;
        }

        .cp-btn:hover {
          opacity: 0.95;
        }

        .cp-error {
          color: #e74c3c;
          margin-top: 10px;
        }

        .cp-success {
          color: #2ecc71;
          margin-top: 10px;
        }
      `}</style>

      {/* ===== Background circles ===== */}
      <div className="bg-circles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* ===== Card ===== */}
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