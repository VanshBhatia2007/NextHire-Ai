import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Video, Award, CheckCircle } from "lucide-react";
import InterviewSetup from "../components/step-1";
import Interview from "../components/step-2";
import InterviewReport from "../components/step-3";

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  const stepsList = [
    { id: 1, name: "Configure", icon: Sliders },
    { id: 2, name: "AI Interview", icon: Video },
    { id: 3, name: "Evaluation", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pt-6 pb-16">
      {/* Top Stepper Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-around">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400"
                  }`}
                >
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Render Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <InterviewSetup
              onStart={(data) => {
                setInterviewData(data);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <Interview
              interviewData={interviewData}
              onFinish={(report) => {
                setInterviewData(report);
                setStep(3);
              }}
            />
          )}

          {step === 3 && (
            <InterviewReport
              report={interviewData}
              onRetake={() => {
                setInterviewData(null);
                setStep(1);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default InterviewPage;