import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useLogin } from "../hooks/useLogin";
import { AuthLayout } from "../layouts/AuthLayout";
import { ApiError } from "../types";

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      await login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
      const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";
      navigate(nextPath);
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
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
