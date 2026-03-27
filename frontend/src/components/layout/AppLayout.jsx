import { NavLink } from "react-router-dom";
import { APP_NAME, navItems } from "../../lib/constants";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">{APP_NAME}</div>
        <p style={{ color: "#3d7196", marginTop: 0 }}>
          {user?.username || "User"} ({user?.role || "N/A"})
        </p>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="secondary" style={{ marginTop: 10 }} onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
