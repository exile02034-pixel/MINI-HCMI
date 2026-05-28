import { FormEvent, useEffect, useState } from "react";
import { AttendanceRecord, ApiError } from "../types";
import { useAdminPunches } from "./useAdminPunches";
import { punchService } from "../services/api/punchService";

export function useAdminPunchManagement() {
  const punchesQuery = useAdminPunches();
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (punchesQuery.data) {
      setRecords(punchesQuery.data);
    }
  }, [punchesQuery.data]);

  const closeEditModal = () => {
    setSelected(null);
    setError(null);
    setSuccessMessage(null);
  };

  const closeSuccessModal = () => {
    setSuccessMessage(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      const timeInValue = String(formData.get("timeIn") || "");
      const timeOutValue = String(formData.get("timeOut") || "");

      const response = await punchService.edit(selected.id, {
        timeIn: timeInValue || undefined,
        timeOut: timeOutValue || undefined,
      });

      if (response.attendance) {
        setRecords((current) =>
          current.map((record) => (record.id === response.attendance.id ? response.attendance : record))
        );
      } else {
        await punchesQuery.reload();
      }

      setSelected(null);
      setSuccessMessage(response.message);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    records,
    isLoading: punchesQuery.isLoading,
    loadError: punchesQuery.error?.message || null,
    selected,
    setSelected,
    error,
    successMessage,
    isSubmitting,
    onSubmit,
    closeEditModal,
    closeSuccessModal,
    modalTitle: selected ? "Edit punch record" : "Update successful",
    isModalOpen: Boolean(selected) || Boolean(successMessage),
  };
}
