import { NavLink } from "react-router-dom";
import { APP_NAME, navItems } from "../../lib/constants";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

const filteredNav = navItems.filter((item) => {
  if (!user) return false; // لو ما في user ما نعرض أي شي

  if (item.to === "/users") {
    return user.role === "ADMIN" || user.role === "FACTORY_MANAGER";
  }

  // صفحة Factories فقط للـ ADMIN
  if (item.to === "/factories") {
    return user.role === "ADMIN";
  }

  // صفحات Zones مثلاً ما للـ SECURITY
  if (item.to === "/zones") {
    return user.role !== "SECURITY";
  }

  return true; // باقي الروابط للجميع
}); 

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">{APP_NAME}</div>
        <p className="user-role">
          {user?.username || "User"} ({user?.role || "N/A"})
        </p>
        <nav>
          {filteredNav.map((item) => (
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
