import groq from "../utils/groqClient.js";
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

    // Use Groq API correctly
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert technical interviewer. Generate interview questions. Return ONLY VALID JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    let aiResponse;
    const content = completion.choices[0].message.content || "";

    try {
      aiResponse = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         try {
            aiResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
         } catch(e) {}
      }
      
      if (!aiResponse) {
        aiResponse = { question: content || "Describe your experience with this technology." };
      }
    }

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
      question: questionText,
      session: {
        _id: session._id,
        role: session.role,
        level: session.level,
        questions: session.questions,
        totalScore: 0
      }
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

    // Use Groq API correctly
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert technical interviewer. Evaluate answers and provide scores and feedback. Return ONLY VALID JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    let aiResult;
    const content = completion.choices[0].message.content || "";
    
    try {
      // 1. Try direct parse
      aiResult = JSON.parse(content);
    } catch (parseError) {
      // 2. Try to extract JSON from code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          aiResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e) {
          // Fallback below
        }
      }
      
      if (!aiResult) {
         // Fallback manual extraction
        const scoreMatch = content.match(/score["']?\s*:\s*(\d+)/i) || content.match(/\b(\d{1,3})\b/);
        aiResult = {
          score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
          feedback: content.replace(/```json/g, '').replace(/```/g, '').trim() || "Good attempt. Keep practicing!"
        };
      }
    }

    // Parse AI result safely
    const score = Math.min(Math.max(Number(aiResult.score) || 50, 0), 100); // Clamp between 0-100
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
