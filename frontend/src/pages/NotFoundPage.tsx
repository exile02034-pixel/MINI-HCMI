import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">The page you requested does not exist or you may not have access to it.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
