import { useState } from "react";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { useAdminDailyReports } from "../hooks/useAdminDailyReports";
import { formatHours, formatMinutes } from "../utils/format";

export function DailyReportsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const reports = useAdminDailyReports(date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily reports</CardTitle>
        <CardDescription>Review employee totals for a specific day.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 max-w-xs space-y-2">
          <Label htmlFor="report-date">Report date</Label>
          <Input id="report-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        {reports.error ? <Alert tone="error" message={reports.error.message} /> : null}
        {reports.isLoading ? (
          <p className="text-sm text-slate-500">Loading daily reports...</p>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.data.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.employee?.name || report.userId}</TableCell>
                    <TableCell>{formatHours(report.regularHours)}</TableCell>
                    <TableCell>{formatHours(report.overtimeHours)}</TableCell>
                    <TableCell>{formatHours(report.nightDiffHours)}</TableCell>
                    <TableCell>{formatMinutes(report.lateMinutes)}</TableCell>
                    <TableCell>{formatMinutes(report.undertimeMinutes)}</TableCell>
                    <TableCell><StatusBadge value={report.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState title="No daily reports" message="There are no completed summaries for the selected date yet." />
        )}
      </CardContent>
    </Card>
  );
}
