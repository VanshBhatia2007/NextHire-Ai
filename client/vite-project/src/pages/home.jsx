import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Clock,
  Zap,
  Play,
  User,
  Video,
  Award,
  Search,
  FileText,
  Check,
  HelpCircle,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  FileUp,
  MessageSquare,
  ThumbsUp,
  Volume2,
  Star,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";
import femaleAiVideo from "@/assets/Videos/female-ai.mp4";
import maleAiVideo from "@/assets/Videos/male-ai.mp4";

// Sample data for the Resume Reviewer
const sampleResumes = {
  frontend: {
    title: "Senior Frontend Engineer",
    text: "John Doe\nfrontend-dev@email.com | +1 234 567 890\n\nEXPERIENCE:\nFrontend Developer at Tech Corp (2023 - Present)\n- Developed responsive web applications using React, JavaScript, and Tailwind CSS.\n- Optimized application performance, reducing page load times by 20%.\n- Collaborated with design and backend teams to implement new features.\n\nSKILLS:\nReact, JavaScript, Redux, HTML5, CSS3, Git, REST APIs, responsive design."
  },
  data: {
    title: "Data Scientist",
    text: "Jane Smith\njanesmith@email.com | +1 987 654 321\n\nEXPERIENCE:\nData Analyst at Analytics Inc (2022 - Present)\n- Analyzed large datasets using Python, pandas, and SQL to extract business insights.\n- Created interactive dashboards in Tableau to communicate findings to stakeholders.\n- Built predictive models with scikit-learn to improve customer retention.\n\nSKILLS:\nPython, SQL, Machine Learning, Pandas, NumPy, Tableau, scikit-learn, Statistics."
  }
};

// Preset interview responses for the simulator
const interviewAnswers = {
  strong: {
    text: "In my last role, our main dashboard had a memory leak causing client browsers to crash. I profile-monitored memory usage using Chrome DevTools, isolated the issue to an uncleaned WebSocket listener in a React useEffect hook, and refactored it. This dropped crashes by 40% and improved tab load speeds.",
    score: { clarity: 94, depth: 89, match: 92, general: "Excellent" },
    feedback: "Superb structured answer using the STAR method. You clearly identified the situation, your specific diagnostic steps, the technical solution, and quantified the positive business outcome (40% crash reduction)."
  },
  weak: {
    text: "We had a bug where the website would freeze and stop working for users. It was pretty bad, so I talked to some people on our team, and we looked at the code together to see where the problem was. Eventually, we fixed the code, uploaded it, and everything worked again without freezing.",
    score: { clarity: 55, depth: 42, match: 48, general: "Needs Work" },
    feedback: "The answer is too vague. Try explaining the exact tools you used (e.g. profiling, logs) and describe your specific individual contribution. Make sure to quantify the impact of your fix at the end."
  }
};

function Home() {
  // Global theme check or dark-mode class application for this page
  // (Forces dark mode styles locally to ensure visual excellence)

  // 1. Resume Reviewer States
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisFinished, setAnalysisFinished] = useState(false);
  const [resumeResults, setResumeResults] = useState(null);

  // 2. Mock Interview States
  const [selectedAvatar, setSelectedAvatar] = useState("female"); // 'female' | 'male'
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentAnswerType, setCurrentAnswerType] = useState("strong");
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const videoRef = useRef(null);

  // 3. Pricing States
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'

  // Resume analysis step titles
  const steps = [
    "Extracting skills & experience history...",
    "Scanning keyword match and relevancy index...",
    "Benchmarking credentials against target profile...",
    "Generating optimization metrics..."
  ];

  // Resume Scorer simulation trigger
  const handleAnalyzeResume = () => {
    if (!resumeText || !targetJob) return;
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisFinished(false);
  };

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsAnalyzing(false);
            setAnalysisFinished(true);
            // Compile custom results based on input match
            const score = targetJob.toLowerCase().includes("frontend") || targetJob.toLowerCase().includes("react") ? 88 : 79;
            setResumeResults({
              score,
              strengths: [
                "Solid hands-on framework proficiency matching standard requirements.",
                "Clear documentation of job history and engineering duties."
              ],
              improvements: [
                "Inject more concrete business metrics (e.g., speed up, growth stats).",
                `Add key missing industry tags matching "${targetJob}".`
              ],
              jobs: [
                { title: `Lead ${targetJob} - AI Unicorn`, match: "94%" },
                { title: `Senior Software Engineer - SaaS Labs`, match: "83%" }
              ]
            });
            return 3;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, targetJob]);

  // Load sample resumes helper
  const loadSampleResume = (type) => {
    const sample = sampleResumes[type];
    setResumeText(sample.text);
    setTargetJob(sample.title);
  };

  // Interview Simulator trigger
  const handleStartInterview = () => {
    setInterviewStarted(true);
    setAnswerSubmitted(false);
    setInterviewFeedback(null);
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Video autoplay blocked", e));
    }
  };

  const handleSubmitAnswer = (type) => {
    setCurrentAnswerType(type);
    setIsAnalyzingAnswer(true);
    setTimeout(() => {
      setIsAnalyzingAnswer(false);
      setAnswerSubmitted(true);
      setInterviewFeedback(interviewAnswers[type]);
    }, 1500);
  };

  const handleResetInterview = () => {
    setInterviewStarted(false);
    setAnswerSubmitted(false);
    setInterviewFeedback(null);
  };

  return (
    <div className="dark bg-neutral-950 text-neutral-100 min-h-screen font-sans antialiased selection:bg-violet-600 selection:text-white pb-20">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden border-b border-neutral-900">
        <HexagonBackground className="absolute inset-0 -z-10 h-full w-full opacity-60" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-md"
            >
              <Sparkles className="size-4 text-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-neutral-300">Next-Gen AI Recruiting Engine v2.0</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent"
            >
              Land Your Dream Job <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">10x Faster with AI</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto font-medium"
            >
              Upload your resume to benchmark match scores instantly, practice real-time interactive voice mock interviews with live AI feedback, and auto-track applications.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button 
                onClick={() => window.location.href = "/auth"} 
                className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="size-5 ml-1" />
              </Button>
              <a 
                href="#live-playground" 
                className="w-full sm:w-auto h-12 px-8 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-bold transition-all hover:border-neutral-700 duration-200"
              >
                Try Interactive Demo
              </a>
            </motion.div>

            {/* Social Trust */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-10 flex flex-wrap items-center justify-center gap-8 text-neutral-500 text-sm font-semibold"
            >
              <div className="flex items-center gap-2">
                <Users className="size-5 text-violet-500" />
                <span>15,000+ Candidates Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-500" />
                <span>Enterprise Grade Security</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content / Demos & Features */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-32" id="live-playground">
        
        {/* INTERACTIVE DEMOS SECTION HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Experience our AI Engine in Real-Time</h2>
          <p className="text-neutral-400">Interact with two of our core AI features directly below. No signup required.</p>
        </div>

        {/* INTERACTIVE COMPONENT 1: AI RESUME REVIEWER & MATCH SCORER */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/50">
              <FileText className="size-4 text-violet-400" />
              <span className="text-xs font-bold text-violet-300">Feature Spotlight</span>
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight">AI Resume Matcher</h3>
            <p className="text-neutral-400 leading-relaxed">
              Upload your CV and see how closely your experience matches key job descriptions. Our AI instantly parses credentials, flags critical keyword gaps, and recommends targeted improvements.
            </p>
            <ul className="space-y-3 text-neutral-300 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 bg-emerald-950 rounded-full p-0.5" />
                Instant alignment rating scoring out of 100
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 bg-emerald-950 rounded-full p-0.5" />
                Finds missing technologies and action-verbs
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400 bg-emerald-950 rounded-full p-0.5" />
                Matches candidate profiles with live openings
              </li>
            </ul>
            
            {/* Quick Sample Selector */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 space-y-3">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Or load a sample profile:</p>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => loadSampleResume("frontend")}
                  className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-800 rounded-lg text-xs font-bold border border-neutral-700 text-neutral-300 transition duration-150 cursor-pointer"
                >
                  💻 Frontend Engineer
                </button>
                <button 
                  onClick={() => loadSampleResume("data")}
                  className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-800 rounded-lg text-xs font-bold border border-neutral-700 text-neutral-300 transition duration-150 cursor-pointer"
                >
                  📊 Data Scientist
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden min-h-[460px]">
            {/* Top Bar decoration */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Resume Evaluator
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!isAnalyzing && !analysisFinished && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="target-job" className="text-sm font-semibold text-neutral-300">Target Job Title</Label>
                    <Input 
                      id="target-job" 
                      placeholder="e.g. Senior Frontend Developer" 
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-violet-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resume-content" className="text-sm font-semibold text-neutral-300">Resume / CV Content</Label>
                    <textarea 
                      id="resume-content"
                      rows={6}
                      placeholder="Paste resume details here, or choose one of our sample profiles on the left..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 text-white p-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-600 resize-none font-mono"
                    />
                  </div>

                  <Button 
                    onClick={handleAnalyzeResume}
                    disabled={!resumeText || !targetJob}
                    className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Brain className="size-4 mr-2" />
                    Analyze Alignment
                  </Button>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div 
                  key="analyzing-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 space-y-6"
                >
                  {/* Spinning/pulsing animation */}
                  <div className="relative size-20">
                    <div className="absolute inset-0 rounded-full border-4 border-neutral-800 border-t-violet-500 animate-spin" />
                    <Brain className="absolute inset-0 m-auto size-8 text-violet-400 animate-pulse" />
                  </div>
                  
                  {/* Dynamic Status Text */}
                  <div className="space-y-2 text-center w-full max-w-sm">
                    <p className="text-sm font-semibold text-neutral-200">{steps[analysisStep]}</p>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-violet-600 h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(analysisStep + 1) * 25}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {analysisFinished && resumeResults && (
                <motion.div 
                  key="results-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
                    {/* Radial Score Gauge */}
                    <div className="relative size-24 shrink-0 flex items-center justify-center">
                      <svg className="size-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-neutral-800" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="48" cy="48" r="40" stroke="currentColor" className="text-violet-500 drop-shadow-[0_0_8px_rgba(109,40,217,0.5)]" 
                          strokeWidth="8" fill="transparent" 
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * resumeResults.score) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white leading-none">{resumeResults.score}</span>
                        <span className="text-[10px] font-bold text-neutral-400">Match %</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                        Analysis Complete
                        <CheckCircle2 className="size-5 text-emerald-400" />
                      </h4>
                      <p className="text-sm text-neutral-400">
                        Your profile matches closely but missing key specifications. Follow recommendations below to optimize impact.
                      </p>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <ThumbsUp className="size-3.5" /> Key Strengths
                      </p>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {resumeResults.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-1.5 bg-neutral-950 p-2.5 rounded-lg border border-neutral-900">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="size-3.5" /> High Impact Fixes
                      </p>
                      <ul className="space-y-1.5 text-xs text-neutral-300">
                        {resumeResults.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5 bg-neutral-950 p-2.5 rounded-lg border border-neutral-900">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Curated Jobs */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Suggested Match Openings:</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {resumeResults.jobs.map((job, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-violet-600/30 transition duration-150 group">
                          <div>
                            <p className="text-xs font-bold text-neutral-200">{job.title}</p>
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full mt-1 inline-block">
                              {job.match} Match
                            </span>
                          </div>
                          <button 
                            onClick={() => window.location.href = "/auth"}
                            className="p-1.5 bg-neutral-900 group-hover:bg-violet-600 rounded-lg transition duration-200 cursor-pointer"
                          >
                            <ArrowUpRight className="size-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-neutral-800 pt-4">
                    <Button 
                      onClick={() => setAnalysisFinished(false)}
                      variant="outline" 
                      className="flex-1 border-neutral-800 hover:bg-neutral-800 text-white cursor-pointer"
                    >
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/auth"}
                      className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer"
                    >
                      Create Optimized Resume
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* INTERACTIVE COMPONENT 2: MOCK INTERVIEW SIMULATOR */}
        <div className="grid lg:grid-cols-12 gap-8 items-center pt-10">
          <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden min-h-[500px] lg:order-1 order-2">
            
            {/* Simulation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 mb-4 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-bold text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Interviewer
                </span>
                <span className="text-xs text-neutral-500">Avatar: {selectedAvatar === "female" ? "Emma (Recruiter)" : "David (Lead)"}</span>
              </div>
              
              {/* Avatar Selector */}
              <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800 self-start">
                <button 
                  onClick={() => setSelectedAvatar("female")}
                  disabled={interviewStarted}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer disabled:opacity-50 ${selectedAvatar === "female" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}`}
                >
                  Emma
                </button>
                <button 
                  onClick={() => setSelectedAvatar("male")}
                  disabled={interviewStarted}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer disabled:opacity-50 ${selectedAvatar === "male" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"}`}
                >
                  David
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-12 gap-6 items-stretch">
              {/* Video Preview Box */}
              <div className="sm:col-span-5 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 relative flex items-center justify-center min-h-[220px]">
                <video 
                  ref={videoRef}
                  src={selectedAvatar === "female" ? femaleAiVideo : maleAiVideo}
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                />
                
                {/* Visual Indicators Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] text-white/80 font-semibold bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Volume2 className="size-3" /> AUDIO ON
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border border-white" />
                  </div>
                </div>
              </div>

              {/* Chat Dialog Control Box */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                <AnimatePresence mode="wait">
                  {!interviewStarted && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center h-full space-y-4 py-8"
                    >
                      <Video className="size-10 text-neutral-600" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Press start to begin mock practice</p>
                        <p className="text-xs text-neutral-500">The AI will query a typical situational engineering dilemma.</p>
                      </div>
                      <Button 
                        onClick={handleStartInterview}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Start Session
                      </Button>
                    </motion.div>
                  )}

                  {interviewStarted && !answerSubmitted && (
                    <motion.div 
                      key="interviewing"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest">Question 1</p>
                        <p className="text-xs font-semibold text-neutral-200 bg-neutral-950 p-3 rounded-lg border border-neutral-900 leading-relaxed italic">
                          "{selectedAvatar === "female" 
                            ? "Tell me about a challenging project you worked on. What was the issue and how did you resolve it?"
                            : "Describe a complex technical issue you encountered. How did you diagnose and deploy the solution?"
                          }"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Select your answer structure to test feedback:</p>
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleSubmitAnswer("strong")}
                            disabled={isAnalyzingAnswer}
                            className="w-full text-left p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-200 transition duration-150 disabled:opacity-50 cursor-pointer"
                          >
                            <span className="font-bold text-emerald-400">Option A: </span> Detail-rich, quantified metrics using STAR framework.
                          </button>
                          <button 
                            onClick={() => handleSubmitAnswer("weak")}
                            disabled={isAnalyzingAnswer}
                            className="w-full text-left p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-200 transition duration-150 disabled:opacity-50 cursor-pointer"
                          >
                            <span className="font-bold text-amber-400">Option B: </span> Broad summary, general team contribution descriptions.
                          </button>
                        </div>
                      </div>

                      {isAnalyzingAnswer && (
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-violet-400 py-2">
                          <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                          Analyzing response patterns...
                        </div>
                      )}
                    </motion.div>
                  )}

                  {interviewStarted && answerSubmitted && interviewFeedback && (
                    <motion.div 
                      key="feedback"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Analysis Verdict:</p>
                        <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 space-y-3">
                          
                          {/* Score metrics */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                              <span className="text-[10px] font-bold text-neutral-400 block uppercase">Clarity</span>
                              <span className={`text-base font-black ${interviewFeedback.score.clarity > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {interviewFeedback.score.clarity}%
                              </span>
                            </div>
                            <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                              <span className="text-[10px] font-bold text-neutral-400 block uppercase">Tech Depth</span>
                              <span className={`text-base font-black ${interviewFeedback.score.depth > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {interviewFeedback.score.depth}%
                              </span>
                            </div>
                            <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                              <span className="text-[10px] font-bold text-neutral-400 block uppercase">Overall</span>
                              <span className={`text-xs font-extrabold ${interviewFeedback.score.general === "Excellent" ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {interviewFeedback.score.general}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {interviewFeedback.feedback}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleResetInterview}
                          variant="outline" 
                          className="flex-1 border-neutral-800 hover:bg-neutral-800 text-white cursor-pointer"
                        >
                          Reset Demo
                        </Button>
                        <Button 
                          onClick={() => window.location.href = "/auth"}
                          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer"
                        >
                          Unlock Full Mock Suite
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:order-2 order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/50">
              <Video className="size-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">Feature Spotlight</span>
            </div>
            <h3 className="text-3xl font-bold text-white leading-tight">AI Mock Interviews</h3>
            <p className="text-neutral-400 leading-relaxed">
              Build your speaking confidence and sharpen technical arguments. Speak or chat directly with live-responsive AI interviewer avatars calibrated to specific disciplines and technical levels.
            </p>
            <ul className="space-y-3 text-neutral-300 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-indigo-400 bg-indigo-950 rounded-full p-0.5" />
                Adaptive questioning adjusted based on answers
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-indigo-400 bg-indigo-950 rounded-full p-0.5" />
                Speech clarity, pacing, and grammatical indicators
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-indigo-400 bg-indigo-950 rounded-full p-0.5" />
                Detailed STAR feedback review scores
              </li>
            </ul>
          </div>
        </div>

        {/* CORE PLATFORM FEATURES GRID */}
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-semibold">
              <Compass className="size-3.5 text-violet-400" /> Complete Features Package
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-neutral-400">Our unified suite provides end-to-end recruitment preparation and matching.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition duration-300 group hover:-translate-y-1">
              <div className="size-12 rounded-xl bg-violet-950/50 border border-violet-800/40 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                <Brain className="size-6 text-violet-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Resume Matching</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Scan your profile against live roles to extract missing technical tags and increase system visibility.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition duration-300 group hover:-translate-y-1">
              <div className="size-12 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                <Video className="size-6 text-indigo-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Mock Interviewing</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Engage in specialized, real-time practice sessions with conversational AI, and review detailed scores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition duration-300 group hover:-translate-y-1">
              <div className="size-12 rounded-xl bg-blue-950/50 border border-blue-800/40 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                <Search className="size-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Smart Job Feed</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Access a curated feed matching your skills. Focus on opportunities with the highest compatibility scores.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition duration-300 group hover:-translate-y-1">
              <div className="size-12 rounded-xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                <Award className="size-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Auto application</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Auto-generate professional emails and optimize descriptions to accelerate application rates.
              </p>
            </div>

          </div>
        </div>

        {/* METRICS & SOCIAL PROOF */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-850 p-8 sm:p-12 rounded-3xl relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500" />
          <h3 className="text-2xl font-bold text-white">Join Thousands of Professionals Fast-Tracking Their Career</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-violet-400">92%</p>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Interview Success</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">12 Days</p>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Avg. Time to Offer</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">100k+</p>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Mock Audits Runs</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">40%</p>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Salary Increase Avg.</p>
            </div>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Flexible Plans Built for Growth</h2>
            <p className="text-neutral-400">Upgrade to unlock advanced AI avatars, custom profile matches, and unlimited coaching audits.</p>
            
            {/* Toggle Billing */}
            <div className="inline-flex items-center gap-2.5 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`py-1.5 px-4 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${billingCycle === "monthly" ? "bg-violet-600 text-white shadow-md" : "text-neutral-400 hover:text-neutral-200"}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`py-1.5 px-4 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${billingCycle === "yearly" ? "bg-violet-600 text-white shadow-md" : "text-neutral-400 hover:text-neutral-200"}`}
              >
                Yearly <span className="text-[10px] text-violet-300 font-extrabold bg-violet-950 px-1.5 py-0.5 rounded-full ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-neutral-900/30 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-neutral-700 transition">
              <div className="space-y-4">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Free Starter</p>
                <div className="space-y-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-sm text-neutral-500"> / month</span>
                </div>
                <p className="text-sm text-neutral-400">Core exploration toolset for candidates discovering the platform.</p>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <ul className="space-y-3 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> 3 Resume Scans / Mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> 1 AI Interview Session
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Standard Job Board Access
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = "/auth"}
                variant="outline" 
                className="w-full h-11 border-neutral-800 text-white hover:bg-neutral-800 cursor-pointer"
              >
                Start For Free
              </Button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-neutral-900/60 border-2 border-violet-600 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:shadow-[0_0_30px_rgba(109,40,217,0.25)] transition">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full">
                Most Popular
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Career Pro</p>
                <div className="space-y-1">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === "monthly" ? "$19" : "$15"}
                  </span>
                  <span className="text-sm text-neutral-400"> / month</span>
                </div>
                <p className="text-sm text-neutral-300">Premium comprehensive tools for candidates actively seeking placements.</p>
              </div>

              <div className="border-t border-neutral-850 pt-6">
                <ul className="space-y-3 text-sm text-neutral-200">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Unlimited Resume Matches
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Unlimited AI Mock Interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Access all AI coach avatars
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Direct Resume Editor Export
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = "/auth"}
                className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-bold cursor-pointer"
              >
                Unlock Pro Access
              </Button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-neutral-900/30 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-neutral-700 transition">
              <div className="space-y-4">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Unlimited Scale</p>
                <div className="space-y-1">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === "monthly" ? "$49" : "$39"}
                  </span>
                  <span className="text-sm text-neutral-500"> / month</span>
                </div>
                <p className="text-sm text-neutral-400">Enterprise tools for agencies, universities and career placement squads.</p>
              </div>

              <div className="border-t border-neutral-800 pt-6">
                <ul className="space-y-3 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Everything in Career Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Dedicated cohort reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> API integration endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-violet-400" /> Custom branding setups
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = "/auth"}
                variant="outline" 
                className="w-full h-11 border-neutral-800 text-white hover:bg-neutral-800 cursor-pointer"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <div className="relative rounded-3xl bg-neutral-900/80 border border-neutral-800 p-8 sm:p-12 overflow-hidden text-center space-y-6">
          {/* Subtle decoration overlay */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h3 className="text-3xl font-black text-white">Accelerate Your Job Search Journey Today</h3>
            <p className="text-sm text-neutral-400">
              Sign up today and get your initial matching audit and practice question completely free.
            </p>
            <Button 
              onClick={() => window.location.href = "/auth"}
              className="h-12 px-8 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl mt-4 cursor-pointer"
            >
              Get Started Now
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;
