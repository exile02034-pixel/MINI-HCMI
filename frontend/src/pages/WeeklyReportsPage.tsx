import { useState } from "react";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { useAdminWeeklyReports } from "../hooks/useAdminWeeklyReports";
import { formatHours, formatMinutes } from "../utils/format";

export function WeeklyReportsPage() {
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split("T")[0]);
  const reports = useAdminWeeklyReports(weekStart);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly reports</CardTitle>
        <CardDescription>Aggregate each employee&apos;s totals across the selected work week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 max-w-xs space-y-2">
          <Label htmlFor="week-start">Week start</Label>
          <Input id="week-start" type="date" value={weekStart} onChange={(event) => setWeekStart(event.target.value)} />
        </div>
        {reports.error ? <Alert tone="error" message={reports.error.message} /> : null}
        {reports.isLoading ? (
          <p className="text-sm text-slate-500">Loading weekly reports...</p>
        ) : reports.data?.length ? (
          <div className="rounded-xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Regular</TableHead>
                  <TableHead>OT</TableHead>
                  <TableHead>ND</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Undertime</TableHead>
                  <TableHead>Week Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.data.map((report) => (
                  <TableRow key={report.userId}>
                    <TableCell>{report.employee?.name || report.userId}</TableCell>
                    <TableCell>{formatHours(report.totals.regularHours)}</TableCell>
                    <TableCell>{formatHours(report.totals.overtimeHours)}</TableCell>
                    <TableCell>{formatHours(report.totals.nightDiffHours)}</TableCell>
                    <TableCell>{formatMinutes(report.totals.lateMinutes)}</TableCell>
                    <TableCell>{formatMinutes(report.totals.undertimeMinutes)}</TableCell>
                    <TableCell>{report.weekStart} to {report.weekEnd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState title="No weekly reports" message="Completed daily summaries are required before weekly totals appear." />
        )}
      </CardContent>
    </Card>
  );
}
