import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      default: "Intermediate",
    },
    type: {
      type: String,
      default: "Technical",
    },
    questions: [
      {
        id: Number,
        question: String,
        category: String,
        hint: String,
      },
    ],
    responses: [
      {
        questionId: Number,
        question: String,
        userAnswer: String,
      },
    ],
    evaluation: {
      overallScore: Number,
      summary: String,
      categoryScores: {
        technical: Number,
        communication: Number,
        problemSolving: Number,
      },
      strengths: [String],
      improvements: [String],
      questionFeedback: [
        {
          questionId: Number,
          question: String,
          userAnswer: String,
          idealAnswer: String,
          score: Number,
          feedback: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
