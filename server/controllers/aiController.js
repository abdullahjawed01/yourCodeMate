import groq from "../utils/groqClient.js";
import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";
import LanguageTopic from "../models/LanguageTopic.js";
import LearningProgress from "../models/LearningProgress.js";

/**
 * Evaluate user code using Groq AI
 */
export const evaluateCode = async (req, res) => {
  try {
    const { testId, code } = req.body;
    if (!testId || !code || !code.trim() || code.trim() === '// Write your solution here' || code.trim() === 'def twoSum(nums, target):\\n    # Your solution here\\n    pass') {
      return res.status(400).json({ message: "Empty submissions are not allowed. Please write a valid solution." });
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
    if (finalScore === undefined || finalScore === null || isNaN(finalScore) || finalScore < 0) {
      finalScore = 0; // Default to 0 for invalid scores, NEVER 50
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

    // 🚀 UNLOCK NEXT TOPIC IN LEARNING PATHS
    if (finalScore >= (test.passScore || 50)) {
       const topic = await LanguageTopic.findById(test.topicId || (await LanguageTopic.findOne({ testId: test._id }))?._id);
       
       if (topic) {
          const language = topic.language;
          let learningProgress = await LearningProgress.findOne({ user: req.user._id });
          
          if (!learningProgress) {
             learningProgress = await LearningProgress.create({
               user: req.user._id,
               languageProgress: [],
               totalPoints: 0
             });
          }

          let langProgress = learningProgress.languageProgress.find(lp => lp.language === language);
          if (!langProgress) {
             langProgress = { language, topics: [], currentTopic: topic._id };
             learningProgress.languageProgress.push(langProgress);
          }

          const topicEntry = langProgress.topics.find(t => t.topicId.toString() === topic._id.toString());
          if (topicEntry) {
             topicEntry.testPassed = true;
             topicEntry.testScore = finalScore;
             topicEntry.completed = true;
          } else {
             langProgress.topics.push({
               topicId: topic._id,
               testPassed: true,
               testScore: finalScore,
               completed: true
             });
          }

          // Unlock next topic
          const nextTopic = await LanguageTopic.findOne({ 
             language, 
             order: topic.order + 1 
          });
          
          if (nextTopic) {
             langProgress.currentTopic = nextTopic._id;
          }
          
          learningProgress.totalPoints += (topic.pointsReward || 10);
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
