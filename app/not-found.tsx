import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import image from "@/public/404.png";

const accentStyles = {
  "--accent": "#e11d48",
  "--accent-soft": "#ffe4e6",
  "--accent-deep": "#be123c",
} as CSSProperties;

export default function NotFound() {
  return (
    <div
      className="relative isolate min-h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      style={accentStyles}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.18),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -top-24 right-[-5%] h-72 w-72 rounded-full bg-rose-200/70 blur-3xl dark:bg-rose-900/40" />
      <div className="pointer-events-none absolute -bottom-28 left-[-10%] h-80 w-80 rounded-full bg-amber-200/70 blur-3xl dark:bg-amber-900/30" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-20 lg:flex-row">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <span className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-rose-200/80 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] shadow-sm shadow-rose-200/50 dark:border-rose-900/60 dark:bg-slate-900/60 dark:text-[color:var(--accent-soft)]">
            Error 404
          </span>
          <h1
            className="animate-fade-up text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            You reached a page that does not exist.
          </h1>
          <p
            className="animate-fade-up text-base text-slate-600 dark:text-slate-300 sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            The link may be outdated or the page moved. Head back to the forge
            or explore active challenges instead.
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-[color:var(--accent-deep)]"
            >
              Back to Home
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600"
            >
              Explore Challenges
            </Link>
          </div>
          <div
            className="animate-fade-up flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400"
            style={{ animationDelay: "420ms" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              Check the URL for typos or missing characters.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Need a hand?{" "}
              <Link
                href="/contact"
                className="font-semibold text-[color:var(--accent)] hover:text-[color:var(--accent-deep)] dark:text-[color:var(--accent-soft)]"
              >
                Contact support
              </Link>
              .
            </div>
          </div>
        </div>

        <div className="animate-fade-up relative w-full max-w-md" style={{ animationDelay: "200ms" }}>
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-rose-200/60 via-white/20 to-amber-200/70 blur-2xl dark:from-rose-900/30 dark:via-transparent dark:to-amber-900/40" />
          <div className="relative rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <div className="mb-4 text-right text-6xl font-black tracking-tight text-[color:var(--accent)] opacity-20 dark:text-[color:var(--accent-soft)] dark:opacity-30">
              404
            </div>
            <div className="animate-float-slow">
              <Image
                src={image}
                alt="Illustration of a missing page"
                height={280}
                width={420}
                className="mx-auto h-auto w-full max-w-sm"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
