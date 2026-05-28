import { ReactNode } from "react";
import { AttendanceRecord } from "../../types";
import { formatDate, formatHours, formatMinutes, formatTimeOnly } from "../../utils/format";
import { EmptyState } from "../ui/EmptyState";
import { StatusBadge } from "../ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  actionSlot?: (record: AttendanceRecord) => ReactNode;
}

export function AttendanceTable({ records, actionSlot }: AttendanceTableProps) {
  if (!records.length) {
    return <EmptyState title="No attendance yet" message="Punch activity will appear here once employees start logging time." />;
  }

  const headers = [
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
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{formatTimeOnly(record.timeIn)}</TableCell>
              <TableCell>{formatTimeOnly(record.timeOut)}</TableCell>
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
