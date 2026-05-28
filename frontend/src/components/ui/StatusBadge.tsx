import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  value: string;
}

const styleFor = (value: string) => {
  if (value === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value === "open") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", styleFor(value))}>{value}</span>;
}
