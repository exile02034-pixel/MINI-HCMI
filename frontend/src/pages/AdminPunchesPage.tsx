import { AttendanceTable } from "../components/attendance/AttendanceTable";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Modal } from "../components/ui/Modal";
import { useAdminPunchManagement } from "../hooks/useAdminPunchManagement";
import { formatDate, toTimeInput } from "../utils/format";

export function AdminPunchesPage() {
  const {
    records,
    isLoading,
    loadError,
    selected,
    setSelected,
    error,
    successMessage,
    isSubmitting,
    onSubmit,
    closeEditModal,
    closeSuccessModal,
    modalTitle,
    isModalOpen,
  } = useAdminPunchManagement();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Punch management</CardTitle>
          <CardDescription>Review and correct employee punch records when needed.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadError ? <Alert tone="error" message={loadError} /> : null}
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading punch records...</p>
          ) : (
            <AttendanceTable
              records={records}
              showEmployee
              actionSlot={(record) => (
                <Button variant="ghost" size="sm" onClick={() => setSelected(record)}>
                  Edit
                </Button>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        title={modalTitle}
        description={
          selected
            ? "Update this punch using the employee's local time so the saved value matches their shift."
            : "The attendance record was saved and the table has been updated."
        }
        onClose={selected ? closeEditModal : closeSuccessModal}
      >
        {selected ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{selected.employee?.name || selected.userId}</p>
              <p className="mt-1">{formatDate(selected.date)}</p>
              <p className="mt-1">
                {selected.employee?.timezone || "Timezone unavailable"}
                {selected.employee?.schedule
                  ? ` • Shift ${selected.employee.schedule.start} - ${selected.employee.schedule.end}`
                  : ""}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeIn">Time In</Label>
                <Input
                  id="timeIn"
                  name="timeIn"
                  type="time"
                  defaultValue={toTimeInput(selected.timeIn, selected.employee?.timezone)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOut">Time Out</Label>
                <Input
                  id="timeOut"
                  name="timeOut"
                  type="time"
                  defaultValue={toTimeInput(selected.timeOut, selected.employee?.timezone)}
                />
              </div>
            </div>
            {error ? <Alert tone="error" message={error} /> : null}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {successMessage || "The attendance record has been updated successfully."}
            </p>
            <div className="flex justify-end">
              <Button onClick={closeSuccessModal}>Okay</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
