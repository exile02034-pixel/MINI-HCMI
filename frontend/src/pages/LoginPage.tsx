import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { AuthLayout } from "../layouts/AuthLayout";

export function LoginPage() {
  const { error, isSubmitting, onSubmit } = useLoginForm();
  const passwordField = usePasswordToggle();

  return (
    <AuthLayout>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Sign in</h2>
        <p className="mt-2 text-sm text-slate-500">Use your registered email and password.</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          type={passwordField.inputType}
          isVisible={passwordField.isVisible}
          onToggle={passwordField.toggleVisibility}
        />
        {error ? <Alert tone="error" message={error} /> : null}
        <Button className="h-11 w-full rounded-lg" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        No account yet?{" "}
        <Link className="font-medium text-slate-900 underline underline-offset-4" to="/register">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
