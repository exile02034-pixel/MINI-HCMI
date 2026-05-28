import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./layouts/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdminPunchesPage } from "./pages/AdminPunchesPage";
import { DailyReportsPage } from "./pages/DailyReportsPage";
import { WeeklyReportsPage } from "./pages/WeeklyReportsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={["admin"]} />}>
        <Route element={<AppShell />}>
          <Route path="/admin/punches" element={<AdminPunchesPage />} />
          <Route path="/admin/reports/daily" element={<DailyReportsPage />} />
          <Route path="/admin/reports/weekly" element={<WeeklyReportsPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
