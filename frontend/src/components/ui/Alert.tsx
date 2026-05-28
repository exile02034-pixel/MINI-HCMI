import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../lib/utils";

interface AlertProps {
  tone?: "info" | "error" | "success";
  message: string;
}

const config = {
  info: {
    icon: Info,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export function Alert({ tone = "info", message }: AlertProps) {
  const Icon = config[tone].icon;

  return (
    <div className={cn("flex items-start gap-3 rounded-md border px-3 py-3 text-sm", config[tone].className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
