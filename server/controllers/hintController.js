// Controller: Get hint
import Progress from "../models/Progress.js";
import CodingTest from "../models/CodingTest.js";
import groq from "../utils/groqClient.js"; // Keep import for future use

// Helper function: generate AI hint
const generateHintAI = async (test) => {
  // If Groq AI is not working, return a fallback hint
  try {
    // Example placeholder: replace with actual Groq query when available
    // const response = await groq.query(`*[_type == "aiPrompt"]{hint}`);
    // return response[0]?.hint || "Think about breaking the problem into smaller steps.";

    // For now, mock hint
    return "💡 Hint: Try breaking the problem into smaller steps.";
  } catch (err) {
    console.error("Groq request failed:", err.message);
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
