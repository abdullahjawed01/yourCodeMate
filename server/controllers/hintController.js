// Controller: Get hint
import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";
import groq from "../utils/groqClient.js";

// Helper function: generate AI hint using Groq
const generateHintAI = async (test) => {
  try {
    const prompt = `Generate a helpful hint for this coding problem without giving away the solution:

Title: ${test.title}
Description: ${test.description}

Provide a hint that guides the user toward the solution. Keep it concise (1-2 sentences).`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful coding mentor. Provide hints that guide without giving away solutions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
    });

    const hint = completion.choices[0].message.content || "💡 Hint: Try breaking the problem into smaller steps.";
    return hint.startsWith("💡") ? hint : `💡 Hint: ${hint}`;
  } catch (err) {
    console.error("Groq request failed:", err.message);
    // Fallback hint
    return "💡 Hint: Try breaking the problem into smaller steps.";
  }
};

export const getHint = async (req, res) => {
  try {
    const { testId } = req.body;

    if (!testId)
      return res.status(400).json({ message: "testId is required" });

    const test = await CodingTest.findById(testId);
    if (!test)
      return res.status(404).json({ message: "Test not found" });

    const progress = await Progress.findOne({ user: req.user._id });
    if (!progress)
      return res.status(404).json({ message: "User progress not found" });

    if (progress.points < test.hintCost) {
      return res.status(400).json({ message: "Not enough points" });
    }

    // Deduct points
    progress.points -= test.hintCost;

    // Generate AI hint (mocked for now)
    const hint = await generateHintAI(test);

    // Save notification
    progress.notifications.push({
      message: "💡 Hint unlocked using points",
      date: new Date(),
    });

    await progress.save();

    res.status(200).json({ hint, message: "💡 Hint unlocked using points" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
