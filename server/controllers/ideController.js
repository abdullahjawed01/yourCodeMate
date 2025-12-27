// This is a mocked IDE endpoint for now
export const runCode = async (req, res) => {
  const { language, code } = req.body;

  
  const output = `Code received. Language: ${language}. Code length: ${code.length}`;

  res.status(200).json({ output });
};

