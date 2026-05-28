import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select } from "../components/ui/Select";
import { useRegister } from "../hooks/useRegister";
import { AuthLayout } from "../layouts/AuthLayout";
import { ApiError } from "../types";

const timezoneOptions = [
  "Asia/Manila",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
];

export function RegisterPage() {
  const register = useRegister();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password,
        role: "employee",
        timezone: String(formData.get("timezone") || "Asia/Manila"),
        schedule: {
          start: String(formData.get("scheduleStart") || "09:00"),
          end: String(formData.get("scheduleEnd") || "18:00"),
        },
      });
      setMessage("Registration successful. You can now log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Create account</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Register a user</h2>
        <p className="mt-2 text-sm text-slate-500">Set the timezone and shift so attendance metrics are accurate.</p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Maria Santos" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="maria@company.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex h-10 items-center rounded-md border bg-slate-50 px-3 text-sm text-slate-600">
              Employee
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select id="timezone" name="timezone" defaultValue="Asia/Manila">
              {timezoneOptions.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="scheduleStart">Shift start</Label>
            <Input id="scheduleStart" name="scheduleStart" type="time" defaultValue="09:00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduleEnd">Shift end</Label>
            <Input id="scheduleEnd" name="scheduleEnd" type="time" defaultValue="18:00" required />
          </div>
        </div>
        {error ? <Alert tone="error" message={error} /> : null}
        {message ? <Alert tone="success" message={message} /> : null}
        <Button className="h-11 w-full rounded-lg" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already registered?{" "}
        <Link className="font-medium text-slate-900 underline underline-offset-4" to="/login">
          Go to login
        </Link>
      </p>
    </AuthLayout>
  );
}
