import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Star,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Target,
  Sparkles,
} from "lucide-react";

function InterviewReport({ report, onRetake }) {
  const evaluation = report?.evaluation || {};
  const {
    overallScore = 80,
    summary = "Solid technical performance with good foundational knowledge.",
    categoryScores = { technical: 85, communication: 80, problemSolving: 75 },
    strengths = ["Strong core framework understanding", "Clear explanation of concepts"],
    improvements = ["Elaborate more on edge-case handling", "Include system metric benchmarks"],
    questionFeedback = [],
  } = evaluation;

  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900";
    return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900";
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4" /> AI Mock Interview Completed
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Interview Performance Report
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base">
          Role: <strong className="text-gray-900 dark:text-white">{report?.role || "Software Developer"}</strong> ({report?.experience || "Intermediate"})
        </p>
      </motion.div>

      {/* Top Executive Scorecard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        {/* Overall Score Circle */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-850 dark:to-gray-900 rounded-2xl border border-indigo-100 dark:border-gray-800">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {overallScore}%
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Overall Score
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary & Category Gauges */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI Executive Summary
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Category Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-500" /> Technical</span>
                <span>{categoryScores.technical || 80}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${categoryScores.technical || 80}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-emerald-500" /> Communication</span>
                <span>{categoryScores.communication || 80}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${categoryScores.communication || 80}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-amber-500" /> Problem Solving</span>
                <span>{categoryScores.problemSolving || 80}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${categoryScores.problemSolving || 80}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Identified Strengths
          </h3>
          <ul className="space-y-2.5">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-amber-100 dark:border-amber-950/60 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-amber-600" /> Key Areas for Growth
          </h3>
          <ul className="space-y-2.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Detailed Breakdown Accordion */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> Question Breakdown & Ideal Answers
        </h3>

        <div className="space-y-4">
          {questionFeedback.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full p-4 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(
                      item.score
                    )}`}
                  >
                    {item.score}%
                  </span>
                  {expandedIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Details */}
              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-xs"
                  >
                    {/* Candidate Response */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[11px]">
                        Your Provided Response:
                      </h4>
                      <p className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-800 dark:text-gray-200 leading-relaxed italic border border-gray-100 dark:border-gray-800">
                        "{item.userAnswer}"
                      </p>
                    </div>

                    {/* Ideal Response */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
                        Benchmark Ideal Answer:
                      </h4>
                      <p className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl text-gray-800 dark:text-gray-200 leading-relaxed border border-indigo-100 dark:border-indigo-900/40">
                        {item.idealAnswer}
                      </p>
                    </div>

                    {/* Constructive AI Feedback */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                        AI Evaluator Feedback:
                      </h4>
                      <p className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl text-emerald-900 dark:text-emerald-300 leading-relaxed border border-emerald-100 dark:border-emerald-900/40">
                        {item.feedback}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Retake CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onRetake}
          className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Start New Mock Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewReport;