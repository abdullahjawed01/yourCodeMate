import groq from "../utils/groqClient.js";
import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";

/**
 * Evaluate user code using Groq AI
 */
export const evaluateCode = async (req, res) => {
  try {
    const { testId, code } = req.body;
    if (!testId || !code) {
      return res.status(400).json({ message: "testId and code required" });
    }

    const test = await CodingTest.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const prompt = `
You are a strict coding test evaluator.

Problem:
${test.title}
${test.description}

Test Cases:
${JSON.stringify(test.testCases)}

User Code:
${code}

Respond ONLY in valid JSON:
{
  "score": number,
  "feedback": string,
  "improvements": string[]
}
`;

    const completion = await groq.chat.completions.create({
      model: "compound-beta",
      messages: [
        { role: "system", content: "You are an expert coding evaluator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
    });

    let aiResult;
    try {
      aiResult = JSON.parse(completion.choices[0].message.content);
    } catch {
      return res.status(500).json({
        message: "AI response parsing failed",
      });
    }
    if (typeof aiResult.score !== "number") {
  aiResult.score = test.maxScore;
}

    // 🔹 Progress handling
    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        points: 0,
        level: 1,
        badges: [],
        completedTests: [],
        notifications: [],
      });
    }
    const plagiarismResult = await checkPlagiarism(code);

if (plagiarismResult.riskLevel === "high") {
  aiResult.score = Math.floor(aiResult.score * 0.5);
  progress.flags += 1;

  progress.notifications.push({
    message: "⚠️ Possible plagiarism detected. Score reduced."
  });
}


    progress.points += aiResult.score;
    progress.level = Math.floor(progress.points / 100) + 1;

    const completed = !progress.completedTests.includes(testId);
    if (completed) progress.completedTests.push(testId);

    const badge = aiResult.score >= 80 ? "High Scorer" : null;
    if (badge && !progress.badges.includes(badge)) {
      progress.badges.push(badge);
      progress.notifications.push({
        message: `🎉 Badge earned: ${badge}`,
      });
    }

    if (completed) {
      progress.notifications.push({
        message: `✅ Test completed: ${test.title}`,
      });
    }

    await progress.save();

    // 🔒 FINAL SCORE GUARANTEE
let finalScore = Number(aiResult.score);

if (!finalScore || isNaN(finalScore)) {
  finalScore = test.maxScore; // force full score
}

// Update progress using FINAL score
progress.points += finalScore;
progress.level = Math.floor(progress.points / 100) + 1;

await progress.save();

return res.status(200).json({
  score: finalScore,
  feedback: aiResult.feedback || "Code evaluated successfully",
  improvements: aiResult.improvements || []
});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Explain code using Groq AI
 */
export const explainCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Code required" });
    }

    const prompt = `
Explain this code clearly for a beginner:

${code}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You explain code in simple terms." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    res.status(200).json({
      explanation: completion.choices[0].message.content,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const checkPlagiarism = async (code) => {
  const prompt = `
Analyze the following code and detect plagiarism.

Check:
- Copied from tutorials or common snippets
- Overly generic solutions
- Suspicious perfection

Return ONLY JSON:
{
  "plagiarismScore": number,
  "riskLevel": "low" | "medium" | "high",
  "reason": string
}

Code:
${code}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a code plagiarism detector." },
      { role: "user", content: prompt }
    ],
    temperature: 0
  });

  return JSON.parse(completion.choices[0].message.content);
};
