import { FormEvent, useState } from "react";
import { AttendanceRecord, ApiError } from "../types";
import { AttendanceTable } from "../components/attendance/AttendanceTable";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Modal } from "../components/ui/Modal";
import { useAdminPunches } from "../hooks/useAdminPunches";
import { punchService } from "../services/api/punchService";
import { formatDate, toTimeInput } from "../utils/format";

export function AdminPunchesPage() {
  const punches = useAdminPunches();
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      await punchService.edit(selected.id, {
        timeIn: String(formData.get("timeIn") || ""),
        timeOut: String(formData.get("timeOut") || ""),
      });
      setSelected(null);
      await punches.reload();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Punch management</CardTitle>
          <CardDescription>Review and correct employee punch records when needed.</CardDescription>
        </CardHeader>
        <CardContent>
          {punches.error ? <Alert tone="error" message={punches.error.message} /> : null}
          {punches.isLoading ? (
            <p className="text-sm text-slate-500">Loading punch records...</p>
          ) : (
            <AttendanceTable
              records={punches.data || []}
              actionSlot={(record) => (
                <Button variant="ghost" size="sm" onClick={() => setSelected(record)}>
                  Edit
                </Button>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Modal open={Boolean(selected)} title="Edit punch record" onClose={() => setSelected(null)}>
        {selected ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{selected.employee?.name || selected.userId}</p>
              <p className="mt-1">{formatDate(selected.date)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeIn">Time In</Label>
                <Input id="timeIn" name="timeIn" type="time" defaultValue={toTimeInput(selected.timeIn)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOut">Time Out</Label>
                <Input id="timeOut" name="timeOut" type="time" defaultValue={toTimeInput(selected.timeOut)} />
              </div>
            </div>
            {error ? <Alert tone="error" message={error} /> : null}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </>
  );
}
