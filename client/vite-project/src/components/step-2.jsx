import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Play,
  Pause,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Send,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react";
import axios from "axios";
import { ServerUrl } from "../App";

function Interview({ interviewData, onFinish }) {
  const questions = interviewData?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex] || {};

  // Responses dictionary: { [questionId]: answerString }
  const [responses, setResponses] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Speech Recognition (Mic to Text)
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Speech Synthesis (AI Reading Question)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer per question
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Hint Toggle
  const [showHint, setShowHint] = useState(false);

  // Webcam Stream
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Submitting / AI Analysis
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalText, setEvalText] = useState("Evaluating candidate responses...");

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Web Camera Stream
  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        activeStream = stream;
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera preview unavailable:", err.message);
      }
    };
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Read question automatically on question switch if sound enabled
  useEffect(() => {
    setShowHint(false);
    if (responses[currentQuestion.id] !== undefined) {
      setCurrentAnswer(responses[currentQuestion.id]);
    } else {
      setCurrentAnswer("");
    }

    if (soundEnabled && currentQuestion.question) {
      speakQuestion(currentQuestion.question);
    }
  }, [currentIndex]);

  // AI Speech Synthesis
  const speakQuestion = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle Voice Recording
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Save current answer and advance
  const saveCurrentAnswer = () => {
    if (currentQuestion.id) {
      setResponses((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswer,
      }));
    }
  };

  const handleNext = () => {
    saveCurrentAnswer();
    stopSpeaking();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    saveCurrentAnswer();
    stopSpeaking();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Final Submit & AI Evaluation Call
  const handleFinishInterview = async () => {
    saveCurrentAnswer();
    stopSpeaking();
    setIsEvaluating(true);

    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: currentAnswer,
    };

    const formattedResponses = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      userAnswer: updatedResponses[q.id] || "No response provided.",
    }));

    const evalSteps = [
      "Transcribing responses & assessing clarity...",
      "Analyzing technical accuracy & depth...",
      "Benchmarking against industry standards...",
      "Generating final score & performance report...",
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % evalSteps.length;
      setEvalText(evalSteps[stepIdx]);
    }, 1500);

    try {
      const res = await axios.post(`${ServerUrl}/api/interview/evaluate`, {
        role: interviewData?.role,
        experience: interviewData?.experience,
        type: interviewData?.type,
        questions: questions,
        responses: formattedResponses,
      });

      clearInterval(interval);

      if (res.data && res.data.evaluation) {
        onFinish({
          role: interviewData?.role,
          experience: interviewData?.experience,
          type: interviewData?.type,
          evaluation: res.data.evaluation,
        });
      } else {
        throw new Error("Evaluation payload incomplete.");
      }
    } catch (err) {
      clearInterval(interval);
      console.error("Evaluation error:", err);
      setIsEvaluating(false);
      alert("Failed to process evaluation. Please try submitting again.");
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Role & Question Progress */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            Q{currentIndex + 1}
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{interviewData?.role || "Software Developer"}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                {interviewData?.type || "Technical"}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-sm font-semibold">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) {
                stopSpeaking();
                setSoundEnabled(false);
              } else {
                setSoundEnabled(true);
                speakQuestion(currentQuestion.question);
              }
            }}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title={soundEnabled ? "Mute AI Reader" : "Enable AI Reader"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={handleFinishInterview}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold transition-all"
          >
            End Interview & Evaluate
          </button>
        </div>
      </div>

      {/* Main Grid: Left Assistant & Video, Right Question & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Avatar Visualizer & Candidate Cam */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Interviewer Avatar Card */}
          <div className="bg-gradient-to-b from-gray-900 to-indigo-950 p-6 rounded-2xl border border-indigo-900/40 text-white shadow-xl flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
            {/* Ambient Animated Glow */}
            <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-3xl" />

            {/* Avatar Pulse Rings */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {isSpeaking && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-4 rounded-full bg-indigo-500/40 blur-sm"
                  />
                )}
                <div className="w-20 h-20 rounded-full bg-indigo-600 border-4 border-indigo-400/40 flex items-center justify-center text-white shadow-inner">
                  <Sparkles className={`w-10 h-10 ${isSpeaking ? "animate-bounce" : ""}`} />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base">NextHire AI Interviewer</h4>
                <p className="text-xs text-indigo-300">
                  {isSpeaking ? "Speaking Question..." : "Listening to Candidate..."}
                </p>
              </div>

              {/* Sound Wave Animation Bars */}
              <div className="flex items-center gap-1 h-6">
                {[40, 70, 100, 60, 90, 50, 80].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isSpeaking ? [`${height * 0.3}%`, `${height}%`, `${height * 0.3}%`] : "15%",
                    }}
                    transition={{ repeat: Infinity, duration: 0.6 + i * 0.1 }}
                    className="w-1 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>

              {/* Manual Play Speech Button */}
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isSpeaking ? "Pause Audio" : "Replay Question"}
              </button>
            </div>
          </div>

          {/* Candidate Webcam Stream */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-500" /> Candidate Video Stream
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="aspect-video rounded-xl bg-gray-950 overflow-hidden relative border border-gray-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Question Card & Answer Hub */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Prompt Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {currentQuestion.category || "General Technical"}
              </span>

              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" /> {showHint ? "Hide Hint" : "Need a Hint?"}
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {currentQuestion.question || "Loading question..."}
            </h2>

            {/* Hint Box */}
            <AnimatePresence>
              {showHint && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-medium"
                >
                  <strong>💡 Hint:</strong> {currentQuestion.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Response Editor Hub */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Your Answer Response
              </label>

              {/* Speech-to-text Microphone Toggle */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                      : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? "Stop Speech Recording" : "Speak Answer (Voice)"}</span>
                </button>
              )}
            </div>

            {/* Answer Text Area */}
            <div className="relative">
              <textarea
                rows={7}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response or use voice speech-to-text recording..."
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              {isRecording && (
                <div className="absolute bottom-4 right-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Recording live speech...
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleFinishInterview}
                  disabled={isEvaluating}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{evalText}</span>
                    </>
                  ) : (
                    <>
                      <span>Submit & Evaluate Interview</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;