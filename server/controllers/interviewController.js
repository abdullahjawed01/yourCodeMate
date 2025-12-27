import GroqAI from "../utils/groqClient.js"; // your Groq client wrapper
import InterviewSession from "../models/InterviewSession.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

// START INTERVIEW
export const startInterview = async (req, res) => {
  try {
    const { role, level } = req.body;

    // Create new session
    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      level,
      questions: []
    });

    // Generate first AI question
    const prompt = `Generate a ${level} ${role} coding/interview question for a beginner/intermediate user. 
Return only JSON: { "question": "question text here" }`;

    const aiResponse = await GroqAI.ask(prompt);

    const questionText = aiResponse.question || "Describe your experience with JS.";

    session.questions.push({
      question: questionText,
      answer: "",
      feedback: "",
      score: 0
    });

    await session.save();

    res.status(200).json({
      message: "Interview started",
      sessionId: session._id,
      question: questionText
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT ANSWER
export const submitInterviewAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ message: "sessionId and answer required" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Get last unanswered question
    const currentQuestion = session.questions.find(q => !q.answer);
    if (!currentQuestion) {
      return res.status(400).json({ message: "All questions already answered" });
    }

    // AI Evaluation
    const prompt = `
Question:
${currentQuestion.question}

User Answer:
${answer}

Return ONLY JSON: { "score": number between 0-100, "feedback": "text" }
`;

    const aiResult = await GroqAI.ask(prompt);

    // Parse AI result safely
    const score = Number(aiResult.score) || 50; // default 50 if missing
    const feedback = aiResult.feedback || "Good attempt";

    // Update question in session
    currentQuestion.answer = answer;
    currentQuestion.score = score;
    currentQuestion.feedback = feedback;

    // Update total score
    session.totalScore = session.questions.reduce((sum, q) => sum + q.score, 0);

    await session.save();

    // Update user progress
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: [],
        flags: 0
      });
    }

    progress.points += score;
    progress.level = Math.floor(progress.points / 100) + 1;
    progress.notifications.push({
      message: `🎤 Interview question evaluated: Score ${score}`
    });

    await progress.save();

    res.status(200).json({
      score,
      feedback,
      totalScore: session.totalScore
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
