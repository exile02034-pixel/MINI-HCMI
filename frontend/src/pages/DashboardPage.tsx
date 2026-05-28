import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { KpiCard } from "../components/ui/KpiCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuthSession } from "../hooks/useAuthSession";
import { usePunchActions } from "../hooks/usePunchActions";
import { useTodayPunch } from "../hooks/useTodayPunch";
import { formatDateTime, formatHours, formatMinutes, emptyMetrics } from "../utils/format";

export function DashboardPage() {
  const { user } = useAuthSession();
  const todayPunch = useTodayPunch();
  const punchActions = usePunchActions(todayPunch.reload);

  const metrics = todayPunch.data?.computed || emptyMetrics();
  const canPunchIn = !todayPunch.data;
  const canPunchOut = todayPunch.data?.status === "open";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Today&apos;s attendance</CardTitle>
            <CardDescription>Punch in when your shift starts, then punch out once your workday ends.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button disabled={!canPunchIn || punchActions.isSubmitting} onClick={() => void punchActions.punchIn()}>
              Punch In
            </Button>
            <Button
              disabled={!canPunchOut || punchActions.isSubmitting}
              onClick={() => void punchActions.punchOut()}
              variant="secondary"
            >
              Punch Out
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {punchActions.error ? <Alert tone="error" message={punchActions.error.message} /> : null}
          {punchActions.message ? <Alert tone="success" message={punchActions.message} /> : null}

          {todayPunch.data ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Time In</p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {formatDateTime(todayPunch.data.timeIn, user?.timezone)}
                </p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Time Out</p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {formatDateTime(todayPunch.data.timeOut, user?.timezone)}
                </p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <div className="mt-2">
                  <StatusBadge value={todayPunch.data.status} />
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="No punch yet today" message="Start your shift by pressing Punch In." />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Regular Hours" value={formatHours(metrics.regularHours)} hint="Within scheduled shift" />
        <KpiCard label="Overtime" value={formatHours(metrics.overtimeHours)} hint="Beyond scheduled end" />
        <KpiCard label="Night Diff" value={formatHours(metrics.nightDiffHours)} hint="22:00 to 06:00 window" />
        <KpiCard label="Late" value={formatMinutes(metrics.lateMinutes)} hint={`Shift starts at ${user?.schedule.start}`} />
        <KpiCard label="Undertime" value={formatMinutes(metrics.undertimeMinutes)} hint={`Shift ends at ${user?.schedule.end}`} />
      </div>
    </div>
  );
}
