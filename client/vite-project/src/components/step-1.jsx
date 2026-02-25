import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Camera,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Award,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import axios from "axios";
import { ServerUrl } from "../App";

const PRESET_ROLES = [
  "Full Stack Developer",
  "Frontend Engineer (React)",
  "Backend Developer (Node.js)",
  "DevOps & Cloud Engineer",
  "Data Scientist / AI Engineer",
  "Product Manager",
];

const EXPERIENCE_LEVELS = ["Entry Level", "Intermediate", "Senior", "Lead / Staff"];
const INTERVIEW_TYPES = [
  { id: "Technical", label: "Technical & Coding", desc: "Core concepts, system internals, syntax & algorithms" },
  { id: "System Design", label: "System Design", desc: "Scalability, architecture, database & API design" },
  { id: "HR & Behavioral", label: "HR & Behavioral", desc: "Leadership, soft skills, STAR method scenarios" },
];

function InterviewSetup({ onStart }) {
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'resume'
  
  // Setup State
  const [role, setRole] = useState(PRESET_ROLES[0]);
  const [customRole, setCustomRole] = useState("");
  const [skills, setSkills] = useState("React, Node.js, JavaScript, REST API, Database");
  const [experience, setExperience] = useState("Intermediate");
  const [interviewType, setInterviewType] = useState("Technical");
  const [questionCount, setQuestionCount] = useState(5);

  // Resume Upload State
  const [file, setFile] = useState(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeExtracted, setResumeExtracted] = useState(null);
  const [resumeError, setResumeError] = useState("");

  // Media Permissions & Preview
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Loading state when generating questions
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing AI Interviewer...");
  const [errorMsg, setErrorMsg] = useState("");

  // Toggle Camera
  const toggleCamera = async () => {
    if (cameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);
      } catch (err) {
        console.error("Media permission error:", err);
        setErrorMsg("Unable to access camera or microphone. Please check permissions.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle Resume Parsing
  const handleResumeUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setResumeError("Please upload a PDF format resume.");
      return;
    }

    setFile(selectedFile);
    setResumeError("");
    setAnalyzingResume(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await axios.post(`${ServerUrl}/api/interview/resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data) {
        setResumeExtracted(res.data);
        if (res.data.role) {
          setRole(res.data.role);
        }
        if (res.data.skills && Array.isArray(res.data.skills)) {
          setSkills(res.data.skills.join(", "));
        }
        if (res.data.experience) {
          setExperience(res.data.experience);
        }
      }
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setResumeError("Failed to extract data from resume. You can still set up parameters manually.");
    } finally {
      setAnalyzingResume(false);
    }
  };

  // Handle Generate Questions
  const handleStartInterview = async () => {
    setIsGenerating(true);
    setErrorMsg("");

    const targetRole = role === "Custom" ? customRole : role;
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

    const steps = [
      "Analyzing role & competency profile...",
      "Generating contextual questions via OpenRouter AI...",
      "Synthesizing interview parameters & hints...",
      "Finalizing AI Mock Session environment...",
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingText(steps[stepIdx]);
    }, 1200);

    try {
      const response = await axios.post(`${ServerUrl}/api/interview/generate`, {
        role: targetRole,
        experience,
        type: interviewType,
        skills: skillList,
        questionCount: Number(questionCount),
      });

      clearInterval(interval);

      if (response.data && response.data.success && response.data.questions?.length > 0) {
        onStart({
          role: targetRole,
          experience,
          type: interviewType,
          skills: skillList,
          questions: response.data.questions,
        });
      } else {
        throw new Error(response.data?.message || "Failed to generate valid interview questions.");
      }
    } catch (err) {
      clearInterval(interval);
      console.error("Error starting interview:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Something went wrong while setting up the interview.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-4 h-4" /> Powered by OpenRouter AI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Configure Your Mock Interview
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tailor your AI interviewer to match your target job position, stack, and seniority level.
        </p>
      </motion.div>

      {/* Main Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Mode Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Mode Tabs */}
          <div className="bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "manual"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Manual Setup
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "resume"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" /> Resume AI Parser
            </button>
          </div>

          {/* Resume Upload Tab Content */}
          {activeTab === "resume" && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" /> Upload Candidate Resume (PDF)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our AI will extract your tech stack, job title, and experience level automatically.
              </p>

              <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-gray-50 dark:bg-gray-800/40">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {file ? file.name : "Click or drag & drop PDF resume here"}
                </span>
                <span className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</span>
              </label>

              {analyzingResume && (
                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing resume structure with AI...
                </div>
              )}

              {resumeError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/40 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {resumeError}
                </div>
              )}

              {resumeExtracted && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                  <div className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume Extracted Successfully
                  </div>
                  <div><strong>Detected Role:</strong> {resumeExtracted.role}</div>
                  <div><strong>Level:</strong> {resumeExtracted.experience}</div>
                  <div><strong>Skills:</strong> {resumeExtracted.skills?.join(", ")}</div>
                </div>
              )}
            </div>
          )}

          {/* Form Options */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            {/* Job Role */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Target Role
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {PRESET_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setCustomRole("");
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                      role === r
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                        : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or specify custom role (e.g. Lead Mobile App Architect)"
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  setRole("Custom");
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Tech Stack & Key Topics */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                Tech Stack & Topics (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, GraphQL, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Experience Seniority
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      experience === lvl
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Focus Type */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Interview Domain & Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInterviewType(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      interviewType === t.id
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white">{t.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      questionCount === num
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                        : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {num} Questions ({num * 3} mins)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Media Check & Start CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Media Devices Preview Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" /> Device & Media Check
              </h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                cameraActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
              }`}>
                {cameraActive ? "Live Feed Active" : "Preview Off"}
              </span>
            </div>

            {/* Video Box */}
            <div className="relative aspect-video rounded-xl bg-gray-950 overflow-hidden flex items-center justify-center border border-gray-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />
              {!cameraActive && (
                <div className="text-center p-4 text-gray-400 space-y-2">
                  <Camera className="w-10 h-10 mx-auto text-gray-600 animate-pulse" />
                  <p className="text-xs">Camera preview is currently off.</p>
                </div>
              )}

              {/* Status Badge Over Video */}
              {cameraActive && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Mic & Camera Ready</span>
                </div>
              )}
            </div>

            {/* Media Test Controls */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleCamera}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                {cameraActive ? "Disable Camera Preview" : "Enable Camera Preview"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Start CTA Button */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 p-6 rounded-2xl text-white shadow-xl shadow-indigo-600/20 space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" /> Ready to Excel?
              </h4>
              <p className="text-xs text-indigo-100 opacity-90">
                Click below to launch your AI mock interview session with real-time question synthesis and response tracking.
              </p>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <span>Start AI Interview</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InterviewSetup;