"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Could not sign in.");
        setPassword("");
        return;
      }

      // The session cookie is set; re-run the server component to render the
      // dashboard rather than navigating anywhere.
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-light px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl tracking-widest text-base-dark block">XHABE</span>
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-base-dark/50">
            Lodge Admin
          </span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-base-dark/10 p-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-body text-xs uppercase tracking-wider text-base-dark/50 font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-dark/30" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full font-body text-sm border border-base-dark/20 bg-white pl-10 pr-4 py-3 focus:outline-none focus:border-accent-amber"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="font-body text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent-amber text-white font-body text-xs font-bold uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-base-dark active:bg-base-dark transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>

        <p className="font-body text-[11px] text-base-dark/40 text-center mt-6 leading-relaxed">
          Shared password. Sessions last 8 hours.
        </p>
      </div>
    </main>
  );
}
