import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1 4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconEyeOn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-7 11-7 11 7-5 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const { openModal } = useModal();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      openModal({
        title: "Login failed",
        message: err.message,
        confirmText: "Close",
        hideCancel: true
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-screen-v2">
      <div className="login-cloud-card" role="presentation">
        <div className="login-cloud-inner">
          <div className="login-cloud-left">
            <h1 className="login-hello">Hello!</h1>
            <p className="login-sub">Sign in to your account</p>
            <form className="login-form-v2" onSubmit={submit}>
              <label className="login-field">
                <span className="login-field-icon" aria-hidden>
                  <IconMail />
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="E-mail"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </label>
              <label className="login-field">
                <span className="login-field-icon" aria-hidden>
                  <IconLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOn /> : <IconEyeOff />}
                </button>
              </label>
              <div className="login-row-options">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() =>
                    openModal({
                      title: "Forgot password",
                      message: "Please contact your administrator to reset your password.",
                      confirmText: "OK",
                      hideCancel: true
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>
              <button type="submit" className="login-signin-btn" disabled={busy}>
                {busy ? "Signing in..." : "SIGN IN"}
              </button>
            </form>
            <p className="login-create-line">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="login-create-link"
                onClick={() =>
                  openModal({
                    title: "Create account",
                    message: "Please contact your administrator to create an account.",
                    confirmText: "OK",
                    hideCancel: true
                  })
                }
              >
                Create
              </button>
            </p>
          </div>
          <div className="login-cloud-right">
            <h2 className="login-brand-title">Smart Safety System</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
