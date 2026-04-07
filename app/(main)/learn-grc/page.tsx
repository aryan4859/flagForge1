"use client";
import React, { useState } from "react";
import Link from "next/link";
import { grcModules, countTotalLessons } from "@/lib/grc-data";
import { GRCIcon } from "@/components/GRCIcon";
import {
  BookOpen,
  Clock,
  ChevronRight,
  Shield,
  Award,
  Target,
  Layers,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  Beginner:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/50",
  Intermediate:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/50",
  Advanced:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50",
};

export default function LearnGRCPage() {
  const totalLessons = countTotalLessons();
  const totalTopics = grcModules.reduce((t, m) => t + m.topics.length, 0);

  const whyGRC = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Fastest-Growing Cyber Discipline",
      body: "GRC roles are outpacing other cybersecurity functions — demand is up 40% year-on-year as regulators tighten requirements globally.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Deep Technical Skills Required",
      body: "GRC values analytical thinking, documentation, and communication. Technical and non-technical professionals both thrive.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Clear Certification Pathway",
      body: "Security+, CISA, CRISC, CISSP — a well-defined ladder takes you from entry-level analyst to CISO.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "C-Suite Visibility",
      body: "GRC professionals speak directly to boards and executive teams, making it one of the highest-impact roles in any organisation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f4f1] dark:bg-[#0b0b0b] transition-colors duration-300 relative overflow-hidden">
      {/* Atmospheric blobs */}
      <div className="pointer-events-none absolute -top-48 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.18),rgba(248,113,113,0))] blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.15),rgba(251,146,60,0))] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.14),rgba(244,63,94,0))] blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl shadow-[0_40px_90px_-35px_rgba(15,23,42,0.35)] p-8 md:p-12 mb-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.1),rgba(2,6,23,0))]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(239,68,68,0.15) 1px, transparent 0)", backgroundSize: "20px 20px" }} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-700/40 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
                <Star className="w-3 h-3 fill-current" /> Free Access
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 leading-tight">
              Learn{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                GRC
              </span>{" "}
              the Right Way
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mb-8 leading-relaxed">
              Governance, Risk &amp; Compliance — from fundamentals to board-level reporting.
              Structured modules, real-world context, and the FlagForge standard of depth.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: <Layers className="w-4 h-4" />, label: `${grcModules.length} Modules` },
                { icon: <Target className="w-4 h-4" />, label: `${totalTopics} Topics` },
                { icon: <BookOpen className="w-4 h-4" />, label: `${totalLessons} Lessons` },
                { icon: <Clock className="w-4 h-4" />, label: "Self-paced" },
                { icon: <CheckCircle className="w-4 h-4" />, label: "Always Free" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-sm">
                  <span className="text-red-500">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>

            <Link
              href="#modules"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 text-sm uppercase tracking-wider"
            >
              Browse Modules <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Why GRC? ── */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Why GRC?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The case for building GRC skills in {new Date().getFullYear()}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyGRC.map((item) => (
              <div
                key={item.title}
                className="bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 text-red-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Modules ── */}
        <div id="modules">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                Learning Modules
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Choose where to start — or work through them all.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grcModules.map((mod, i) => {
              const lessonCount = mod.topics.reduce((t, topic) => t + topic.lessons.length, 0);
              return (
                <Link
                  key={mod.id}
                  href={`/learn-grc/${mod.slug}`}
                  className="group relative bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:border-red-500/20 dark:hover:border-red-500/20 flex flex-col"
                >
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${mod.color} p-6 relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                        <GRCIcon name={mod.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-sm">
                          {mod.badge}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${difficultyColor[mod.difficulty]}`}>
                          {mod.difficulty}
                        </span>
                      </div>
                    </div>
                    <h3 className="relative mt-4 text-xl font-black text-white tracking-tight leading-tight">
                      {mod.title}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1">
                      {mod.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-5 font-semibold">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> {mod.topics.length} Topics
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {lessonCount} Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {mod.estimatedTime}
                      </span>
                    </div>

                    {/* Topics preview */}
                    <div className="space-y-1.5 mb-5">
                      {mod.topics.slice(0, 3).map((topic) => (
                        <div key={topic.id} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <GRCIcon name={topic.icon} className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          <span className="truncate">{topic.title}</span>
                        </div>
                      ))}
                      {mod.topics.length > 3 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 pl-5">
                          +{mod.topics.length - 3} more topics
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                        Start Learning
                      </span>
                      <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-500" />
            All GRC content is free — no sign-in required to read lessons.
          </div>
        </div>
      </div>
    </div>
  );
}
