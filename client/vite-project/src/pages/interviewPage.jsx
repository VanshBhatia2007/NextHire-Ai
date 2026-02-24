import React from "react";
import { useState } from "react";
import InterviewSetup from "../components/step-1";
import Interview from "../components/step-2";
import InterviewReport from "../components/step-3";

function InterviewPage() {
   const [step, setStep] = useState(1);
   const [interviewData, setInterviewData] = useState(null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {step === 1 && (<InterviewSetup onStart={(data) => { setInterviewData(data); setStep(2); }} />)}
      {step === 2 && (<Interview interviewData={interviewData} onFinish={(report) => { setInterviewData(report); setStep(3); }} />)}
      {step === 3 && (<InterviewReport report={interviewData} />)}

    </div>
  );
}