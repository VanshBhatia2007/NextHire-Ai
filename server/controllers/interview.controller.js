import fs from "fs";
import * as pdfjslib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
import { Interview } from "../models/inter.model.js";

const cleanJsonResponse = (text) => {
  if (!text) return "";
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return cleaned.trim();
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }
    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const unit8Array = new Uint8Array(fileBuffer);
    const pdf = await pdfjslib.getDocument({ data: unit8Array }).promise;
    let resumeText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }
    resumeText = resumeText.replace(/\s+/g, " ").trim();
    const messages = [
      {
        role: "system",
        content: `Extract structured data from resume. Return strictly JSON in the following format:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];
    const airesponse = await askAi(messages);
    const cleaned = cleanJsonResponse(airesponse);
    const parsedResponse = JSON.parse(cleaned);
    fs.unlinkSync(filepath);
    res.json({
      role: parsedResponse.role || "Software Developer",
      experience: parsedResponse.experience || "Intermediate",
      projects: parsedResponse.projects || [],
      skills: parsedResponse.skills || [],
      resumeText,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const {
      role = "Full Stack Developer",
      experience = "Intermediate",
      type = "Technical",
      skills = [],
      questionCount = 5,
    } = req.body;

    const messages = [
      {
        role: "system",
        content: `You are an expert technical interviewer for top Tech Companies.
Generate a high-quality interview session tailored for a ${experience} level candidate applying for a ${role} position.
Interview Type: ${type}.
Key Skills/Topics: ${skills.length > 0 ? skills.join(", ") : "Core concepts, problem solving, industry best practices"}.

Return ONLY valid JSON matching this exact structure:
{
  "role": "${role}",
  "experience": "${experience}",
  "type": "${type}",
  "questions": [
    {
      "id": 1,
      "question": "Clear, practical, and insightful question string",
      "category": "Technical / Architecture / Behavioral",
      "hint": "Short guiding hint to help candidate if stuck"
    }
  ]
}

Generate exactly ${questionCount} realistic questions ranging from baseline to progressive depth. Do not include markdown code block formatting outside valid JSON.`,
      },
      {
        role: "user",
        content: `Create ${questionCount} interview questions for a ${experience} ${role} focusing on ${type} competencies.`,
      },
    ];

    const aiResponse = await askAi(messages);
    const cleaned = cleanJsonResponse(aiResponse);
    const parsed = JSON.parse(cleaned);

    res.json({
      success: true,
      role: parsed.role || role,
      experience: parsed.experience || experience,
      type: parsed.type || type,
      questions: parsed.questions || [],
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { role, experience, type, questions, responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "No candidate responses provided" });
    }

    const messages = [
      {
        role: "system",
        content: `You are a Principal Technical Interviewer evaluating a candidate's mock interview performance.
Candidate Target Role: ${role || "Software Developer"} (${experience || "Intermediate"} level).
Interview Focus: ${type || "Technical"}.

Return ONLY a valid JSON object matching this exact structure:
{
  "overallScore": 85,
  "summary": "High level evaluation summary of candidate performance",
  "categoryScores": {
    "technical": 85,
    "communication": 80,
    "problemSolving": 90
  },
  "strengths": [
    "Key strength point 1",
    "Key strength point 2"
  ],
  "improvements": [
    "Growth recommendation 1",
    "Growth recommendation 2"
  ],
  "questionFeedback": [
    {
      "questionId": 1,
      "question": "Original question text",
      "userAnswer": "Candidate provided answer",
      "idealAnswer": "Comprehensive ideal response expected for this role",
      "score": 85,
      "feedback": "Constructive feedback detailing what was good and how to improve"
    }
  ]
}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          role,
          experience,
          questions,
          candidateResponses: responses,
        }),
      },
    ];

    const aiResponse = await askAi(messages);
    const cleaned = cleanJsonResponse(aiResponse);
    const evaluation = JSON.parse(cleaned);

    // Save to Database if connected
    let savedInterview = null;
    try {
      savedInterview = await Interview.create({
        userId: req.user?._id || null,
        role: role || "Developer",
        experience: experience || "Intermediate",
        type: type || "Technical",
        questions: questions || [],
        responses: responses || [],
        evaluation,
      });
    } catch (dbErr) {
      console.warn("MongoDB save skipped or failed:", dbErr.message);
    }

    res.json({
      success: true,
      interviewId: savedInterview?._id || null,
      evaluation,
    });
  } catch (error) {
    console.error("Error evaluating interview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to evaluate interview",
      error: error.message,
    });
  }
};
