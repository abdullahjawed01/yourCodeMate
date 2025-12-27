import CodingTest from "../models/CodingTest.js";

// Create test
export const createTest = async (req, res) => {
  const { title, description, difficulty, testCases, maxScore, unlockLevel, hints } = req.body;
  const test = await CodingTest.create({ title, description, difficulty, testCases, maxScore, unlockLevel, hints });
  res.status(201).json({ message: "Test created", test });
};

// Update test
export const updateTest = async (req, res) => {
  const test = await CodingTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Test updated", test });
};

// Delete test
export const deleteTest = async (req, res) => {
  await CodingTest.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Test deleted" });
};
