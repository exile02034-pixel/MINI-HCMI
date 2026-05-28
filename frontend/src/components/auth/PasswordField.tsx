import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "password";
  isVisible: boolean;
  onToggle: () => void;
}

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  type,
  isVisible,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} name={name} type={type} placeholder={placeholder} className="pr-10" required />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          onClick={onToggle}
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
