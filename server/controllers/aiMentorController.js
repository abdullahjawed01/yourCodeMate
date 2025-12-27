import groq from "../utils/groqClient.js";

export const askMentor = async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}\n\nProvide a helpful, clear answer.`
      : `Answer this coding question clearly and helpfully:\n\n${question}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { 
          role: "system", 
          content: "You are an expert coding mentor. Provide clear, helpful answers to programming questions. Be concise but thorough." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";

    res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Mentor error:", error);
    res.status(500).json({ 
      message: "Failed to get mentor response",
      answer: "I'm having trouble right now. Please try again in a moment."
    });
  }
};
