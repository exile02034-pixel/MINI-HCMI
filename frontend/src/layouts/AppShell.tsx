import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuthSession } from "../hooks/useAuthSession";

const employeeLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/history", label: "History" },
];

const adminLinks = [
  { to: "/admin/punches", label: "Punches" },
  { to: "/admin/reports/daily", label: "Daily Reports" },
  { to: "/admin/reports/weekly", label: "Weekly Reports" },
];

export function AppShell() {
  const { user, logout } = useAuthSession();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? [...employeeLinks, ...adminLinks] : employeeLinks;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Mini HCM</p>
            <h1 className="text-lg font-semibold text-slate-950">Time Tracking Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-slate-900 text-slate-50" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-950">Welcome back, {user?.name}</h2>
          <p className="text-sm text-slate-500">
            Shift {user?.schedule.start} - {user?.schedule.end} • {user?.timezone}
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
