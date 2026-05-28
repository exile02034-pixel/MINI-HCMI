import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select } from "../components/ui/Select";
import { timezoneOptions } from "../constants/timezones";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function RegisterPage() {
  const { error, message, isSubmitting, onSubmit } = useRegisterForm();
  const passwordField = usePasswordToggle();
  const confirmPasswordField = usePasswordToggle();

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
        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Create password"
          type={passwordField.inputType}
          isVisible={passwordField.isVisible}
          onToggle={passwordField.toggleVisibility}
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Confirm password"
          type={confirmPasswordField.inputType}
          isVisible={confirmPasswordField.isVisible}
          onToggle={confirmPasswordField.toggleVisibility}
        />
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
