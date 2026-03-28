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
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/factories" element={<FactoriesPage />} />
        <Route path="/zones" element={<ZonesPage />} />
        <Route path="/users" element={<UsersPage />} />
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
