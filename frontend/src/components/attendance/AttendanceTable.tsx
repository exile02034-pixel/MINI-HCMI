import { ReactNode } from "react";
import { AttendanceRecord } from "../../types";
import { formatDate, formatHours, formatMinutes, formatTimeOnly } from "../../utils/format";
import { EmptyState } from "../ui/EmptyState";
import { StatusBadge } from "../ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  actionSlot?: (record: AttendanceRecord) => ReactNode;
  showEmployee?: boolean;
  timeZone?: string;
}

export function AttendanceTable({ records, actionSlot, showEmployee = false, timeZone }: AttendanceTableProps) {
  if (!records.length) {
    return <EmptyState title="No attendance yet" message="Punch activity will appear here once employees start logging time." />;
  }

  const shouldShowEmployee = showEmployee || records.some((record) => Boolean(record.employee?.name));
  const headers = [
    ...(shouldShowEmployee ? ["Employee"] : []),
    "Date",
    "Time In",
    "Time Out",
    "Status",
    "Regular",
    "OT",
    "Late",
    "Undertime",
    ...(actionSlot ? ["Actions"] : []),
  ];

  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              {shouldShowEmployee ? <TableCell>{record.employee?.name || record.userId}</TableCell> : null}
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{formatTimeOnly(record.timeIn, record.employee?.timezone || timeZone)}</TableCell>
              <TableCell>{formatTimeOnly(record.timeOut, record.employee?.timezone || timeZone)}</TableCell>
              <TableCell><StatusBadge value={record.status} /></TableCell>
              <TableCell>{formatHours(record.computed?.regularHours)}</TableCell>
              <TableCell>{formatHours(record.computed?.overtimeHours)}</TableCell>
              <TableCell>{formatMinutes(record.computed?.lateMinutes)}</TableCell>
              <TableCell>{formatMinutes(record.computed?.undertimeMinutes)}</TableCell>
              {actionSlot ? <TableCell>{actionSlot(record)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
