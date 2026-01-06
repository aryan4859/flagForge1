import React from "react";
import Image from "next/image";
import Link from "next/link";
import image from "@/public/404.png";

const AuthError = () => {
  return (
    <section className="relative isolate min-h-[75vh] overflow-hidden bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.16),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-rose-200/70 blur-3xl dark:bg-rose-500/20" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl dark:bg-amber-500/20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(248,113,113,0.08),rgba(255,255,255,0.55),rgba(248,113,113,0.08))] dark:bg-[linear-gradient(120deg,rgba(15,23,42,0.85),rgba(15,23,42,0.35),rgba(15,23,42,0.85))]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="inline-flex items-center gap-3">
            <span className="h-1 w-10 rounded-full bg-rose-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-rose-600 dark:text-rose-300">
              Access Denied
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl ">
            You're Not<span className="text-rose-500"> Logged In!</span>
          </h2>
          <p className="mt-3 text-lg font-semibold text-slate-600 dark:text-slate-200 sm:text-2xl">
            Sign In To Enter <span className="text-rose-500"> This Page!</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/authentication"
              className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-700"
            >
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="pointer-events-none absolute -inset-12 rounded-full bg-gradient-to-br from-rose-200/60 via-transparent to-amber-200/60 blur-3xl dark:from-rose-500/25 dark:to-amber-500/20" />
          <Image
            src={image}
            alt="Access denied illustration"
            height={420}
            width={620}
            className="animate-float-slow w-full max-w-2xl rounded-[2.25rem] object-cover shadow-[0_40px_80px_rgba(15,23,42,0.35)] ring-1 ring-black/10 dark:shadow-[0_40px_80px_rgba(2,6,23,0.7)] dark:ring-white/10"
            priority
          />
          <div className="pointer-events-none absolute -bottom-8 right-6 h-20 w-20 rounded-full border border-rose-400/40 dark:border-rose-400/50" />
          <div className="pointer-events-none absolute -top-6 left-10 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_22px_rgba(248,113,113,0.6)] dark:shadow-[0_0_22px_rgba(248,113,113,0.9)]" />
        </div>
      </div>
    </section>
  );
};

export default AuthError;
