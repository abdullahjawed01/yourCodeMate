import groq from "../utils/groqClient.js";
import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";
import PythonTopic from "../models/PythonTopic.js";
import LearningProgress from "../models/LearningProgress.js";

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
      model: "llama-3.3-70b-versatile", // Upgraded model for better evaluation
      messages: [
        { role: "system", content: "You are an expert coding evaluator. Be strict but fair." },
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
        flags: 0
      });
    }

    // Check plagiarism (async, non-blocking)
    let plagiarismResult;
    try {
      plagiarismResult = await checkPlagiarism(code);
      if (plagiarismResult?.riskLevel === "high") {
        aiResult.score = Math.floor(aiResult.score * 0.5);
        progress.flags += 1;
        progress.notifications.push({
          message: "⚠️ Possible plagiarism detected. Score reduced."
        });
      }
    } catch (error) {
      console.error("Plagiarism check failed:", error);
      // Continue without plagiarism check
    }

    // 🔒 FINAL SCORE GUARANTEE
    let finalScore = Number(aiResult.score);
    if (!finalScore || isNaN(finalScore) || finalScore < 0) {
      finalScore = Math.min(test.maxScore, 50); // Default to 50 or maxScore
    }
    if (finalScore > test.maxScore) {
      finalScore = test.maxScore;
    }

    const wasCompleted = progress.completedTests.some(id => id.toString() === testId.toString());
    const isNewCompletion = !wasCompleted;

    // Only add points if this is a new completion
    if (isNewCompletion) {
      progress.points += finalScore;
      progress.level = Math.floor(progress.points / 100) + 1;
      progress.completedTests.push(testId);

      // Badge logic
      if (finalScore >= 80 && !progress.badges.includes("High Scorer")) {
        progress.badges.push("High Scorer");
        progress.notifications.push({
          message: `🎉 Badge earned: High Scorer`,
        });
      }

      progress.notifications.push({
        message: `✅ Test completed: ${test.title}`,
      });
    }

    await progress.save();

    // 🚀 CRITICAL FIX: Unlock Next Topic in Learning Paths
    // Check if this test is associated with any PythonTopic
    if (finalScore >= (test.passScore || 50)) { // Assuming 50 is pass
       // Check Python Topics
       const pythonTopic = await PythonTopic.findOne({ testId: test._id });
       if (pythonTopic) {
          let learningProgress = await LearningProgress.findOne({ user: req.user._id });
          if (!learningProgress) {
             learningProgress = await LearningProgress.create({
               user: req.user._id,
               pythonTopics: [],
               totalPoints: 0
             });
          }
          
          const topicProgress = learningProgress.pythonTopics.find(p => p.topicId.toString() === pythonTopic._id.toString());
          if (topicProgress) {
             topicProgress.testPassed = true;
             topicProgress.testScore = finalScore;
          } else {
             learningProgress.pythonTopics.push({
               topicId: pythonTopic._id,
               testPassed: true,
               testScore: finalScore,
               completed: true // Auto-complete if test passed? Usually yes.
             });
          }

          // Unlock next topic
          const nextTopic = await PythonTopic.findOne({ order: pythonTopic.order + 1 });
          if (nextTopic) {
            learningProgress.currentTopic = nextTopic._id;
          }
          
          await learningProgress.save();
       }
       
       // Check JavaScript Topics
       const javascriptTopic = await import("../models/JavascriptTopic.js").then(m => m.default.findOne({ testId: test._id }));
       if (javascriptTopic) {
          let learningProgress = await LearningProgress.findOne({ user: req.user._id });
          if (!learningProgress) {
             learningProgress = await LearningProgress.create({
               user: req.user._id,
               pythonTopics: [],
               javascriptTopics: [],
               totalPoints: 0
             });
          }
          if (!learningProgress.javascriptTopics) learningProgress.javascriptTopics = [];
          
          const topicProgress = learningProgress.javascriptTopics.find(p => p.topicId.toString() === javascriptTopic._id.toString());
          if (topicProgress) {
             topicProgress.testPassed = true;
             topicProgress.testScore = finalScore;
          } else {
             learningProgress.javascriptTopics.push({
               topicId: javascriptTopic._id,
               testPassed: true,
               testScore: finalScore,
               completed: true
             });
          }

          // Unlock next topic
          const nextTopic = await import("../models/JavascriptTopic.js").then(m => m.default.findOne({ order: javascriptTopic.order + 1 }));
          if (nextTopic) {
            learningProgress.currentJsTopic = nextTopic._id;
          }
          
          await learningProgress.save();
       }
    }

    return res.status(200).json({
      score: finalScore,
      feedback: aiResult.feedback || "Code evaluated successfully",
      improvements: aiResult.improvements || [],
      isNewCompletion,
      newLevel: progress.level,
      newPoints: progress.points
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



const checkPlagiarism = async (code) => {
  try {
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
${code.substring(0, 2000)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a code plagiarism detector." },
        { role: "user", content: prompt }
      ],
      temperature: 0
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Plagiarism check error:", error);
    return { riskLevel: "low", plagiarismScore: 0, reason: "Check failed" };
  }
};
