import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ModalRoot from "./components/modals/ModalRoot";
import DashboardPage from "./pages/DashboardPage";
import WorkersPage from "./pages/WorkersPage";
import AlertsPage from "./pages/AlertsPage";
import FactoriesPage from "./pages/FactoriesPage";
import ZonesPage from "./pages/ZonesPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { useDangerAlerts } from "./hooks/useDangerAlerts";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function AppShell() {
  useDangerAlerts(true);
  const { user } = useAuth();
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route
        path="/factories"
        element={
          user?.role === "ADMIN" ? <FactoriesPage /> : <Navigate to="/dashboard" replace />
          }
          />
        <Route path="/zones" element={<ZonesPage />} />
        <Route
        path="/users"
        element={
        <ProtectedRoute roles={["ADMIN", "FACTORY_MANAGER"]}>
          <UsersPage />
          </ProtectedRoute>
        }
        />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ModalRoot />
    </>
  );
}
