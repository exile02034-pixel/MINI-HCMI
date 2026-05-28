import { AttendanceTable } from "../components/attendance/AttendanceTable";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { useAuthSession } from "../hooks/useAuthSession";
import { useAttendanceHistory } from "../hooks/useAttendanceHistory";

export function HistoryPage() {
  const { user } = useAuthSession();
  const history = useAttendanceHistory(12);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance history</CardTitle>
        <CardDescription>Your recent punch records and computed attendance metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.error ? <Alert tone="error" message={history.error.message} /> : null}
        {history.isLoading ? (
          <p className="text-sm text-slate-500">Loading attendance history...</p>
        ) : (
          <AttendanceTable records={history.data || []} timeZone={user?.timezone} />
        )}
      </CardContent>
    </Card>
  );
}
