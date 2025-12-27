export const askMentor = async (req, res) => {
  const { user } = req;
  const { question } = req.body;

  const answer = `AI Mentor says: "Here's a hint: ${question.slice(0,50)}..."`;

  res.status(200).json({ answer });
};
