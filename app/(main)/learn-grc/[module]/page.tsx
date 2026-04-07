"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getModuleBySlug } from "@/lib/grc-data";
import { GRCIcon } from "@/components/GRCIcon";
import { BookOpen, Clock, ChevronRight, ArrowLeft, Layers } from "lucide-react";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Intermediate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  Advanced: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function GRCModulePage() {
  const params = useParams();
  const moduleSlug = params.module as string;
  const mod = getModuleBySlug(moduleSlug);

  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4f1] dark:bg-[#0b0b0b]">
        <div className="text-center">
          <div className="text-red-500 mb-4 flex items-center">
            <GRCIcon name="search" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Module Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This module doesn't exist yet.</p>
          <Link href="/learn-grc" className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors">
            Back to GRC Hub
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = mod.topics.reduce((t, topic) => t + topic.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#f8f4f1] dark:bg-[#0b0b0b] transition-colors duration-300 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-48 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.18),rgba(248,113,113,0))] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.14),rgba(244,63,94,0))] blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/learn-grc" className="flex items-center gap-1 hover:text-red-500 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> GRC Hub
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 dark:text-gray-300 font-bold">{mod.title}</span>
        </div>

        {/* Module hero */}
        <div className={`relative rounded-[2rem] overflow-hidden mb-10 bg-gradient-to-br ${mod.color} p-8 md:p-10 shadow-2xl`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "18px 18px" }} />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4">
              <GRCIcon name={mod.icon} className="w-8 h-8" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-sm">
                {mod.badge}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor[mod.difficulty]}`}>
                {mod.difficulty}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{mod.title}</h1>
            <p className="text-white/80 text-lg font-medium max-w-2xl leading-relaxed mb-6">{mod.description}</p>
            <div className="flex flex-wrap gap-6 text-white/70 text-sm font-semibold">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {mod.topics.length} Topics</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {totalLessons} Lessons</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {mod.estimatedTime} estimated</span>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-6">
          {mod.topics.map((topic, topicIdx) => (
            <div key={topic.id} className="bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden">
              {/* Topic header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <GRCIcon name={topic.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      Topic {topicIdx + 1}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">{topic.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.description}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 font-semibold">
                  {topic.lessons.length} lesson{topic.lessons.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {topic.lessons.map((lesson, lessonIdx) => (
                  <Link
                    key={lesson.id}
                    href={`/learn-grc/${mod.slug}/${topic.id}/${lesson.id}`}
                    className="group flex items-center gap-4 px-6 py-4 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-black text-gray-500 dark:text-gray-400">
                      {topicIdx + 1}.{lessonIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-500 transition-colors truncate">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/learn-grc"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all modules
          </Link>
        </div>
      </div>
    </div>
  );
}
