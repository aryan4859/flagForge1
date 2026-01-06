'use client';

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { CSSProperties } from "react";

const accentStyles = {
  "--accent": "#f97316",
  "--accent-soft": "#ffedd5",
  "--accent-deep": "#c2410c",
  "--accent-deep-soft": "rgba(194, 65, 12, 0.2)",
} as CSSProperties;

export default function UnauthorizedPage() {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/authentication" });
  };

  return (
    <div
      className="relative isolate min-h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      style={accentStyles}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-20 left-[-10%] h-72 w-72 rounded-full bg-[color:var(--accent-soft)] opacity-80 blur-3xl dark:bg-[color:var(--accent-deep)] dark:opacity-30" />
      <div className="pointer-events-none absolute -bottom-24 right-[-8%] h-80 w-80 rounded-full bg-rose-200/60 blur-3xl dark:bg-rose-900/30" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-20 lg:flex-row">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <span className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/80 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] shadow-sm shadow-amber-200/50 dark:border-amber-900/60 dark:bg-slate-900/60">
            Restricted 403
          </span>
          <h1
            className="animate-fade-up text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            This area is locked to your account.
          </h1>
          <p
            className="animate-fade-up text-base text-slate-600 dark:text-slate-300 sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            You need elevated permissions to view this page. If you believe this
            is a mistake, sign in with an authorized account or request access.
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Return Home
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-[color:var(--accent-soft)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-deep)] transition hover:border-amber-300 hover:bg-[color:var(--accent)] hover:text-white dark:border-amber-900/60 dark:bg-slate-900/60 dark:text-[color:var(--accent)] dark:hover:bg-[color:var(--accent)] dark:hover:text-white"
            >
              Sign out and switch
            </button>
          </div>
          <div
            className="animate-fade-up text-sm text-slate-500 dark:text-slate-400"
            style={{ animationDelay: "420ms" }}
          >
            Need access?{" "}
            <Link href="/contact" className="font-semibold text-[color:var(--accent)] hover:text-[color:var(--accent-deep)]">
              Contact support
            </Link>
            .
          </div>
        </div>

        <div className="animate-fade-up relative w-full max-w-md" style={{ animationDelay: "200ms" }}>
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[color:var(--accent-soft)] via-white/40 to-rose-200/60 opacity-80 blur-2xl dark:from-[color:var(--accent-deep)] dark:via-transparent dark:to-rose-900/30 dark:opacity-70" />
          <div className="relative rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-start justify-between gap-4">
              <div className="animate-float-gentle rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-deep)] shadow-sm dark:bg-[color:var(--accent-deep-soft)] dark:text-[color:var(--accent)]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 0c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"
                  />
                </svg>
              </div>
              <div className="text-5xl font-black tracking-tight text-[color:var(--accent)] opacity-30">
                403
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                Admin or moderator role required.
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-rose-400" />
                Your session might have expired or changed.
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-400" />
                Ask a team lead to grant access.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
