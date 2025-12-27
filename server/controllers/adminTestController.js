import CodingTest from "../models/CodingTest.js";

// Create test
export const createTest = async (req, res) => {
  try {
    const { title, description, difficulty, testCases, maxScore, unlockLevel, hintCost, hints, tags, estimatedTime } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "At least one test case is required" });
    }

    const test = await CodingTest.create({
      title,
      description,
      difficulty: difficulty || 'easy',
      testCases,
      maxScore: maxScore || 100,
      unlockLevel: unlockLevel || 1,
      hintCost: hintCost || 10,
      hints: hints || [],
      tags: tags || [],
      estimatedTime: estimatedTime || 30
    });
    
    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    console.error("Create test error:", error);
    res.status(500).json({ message: error.message || "Failed to create test" });
  }
};

// Update test
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const test = await CodingTest.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    res.status(200).json({ message: "Test updated successfully", test });
  } catch (error) {
    console.error("Update test error:", error);
    res.status(500).json({ message: error.message || "Failed to update test" });
  }
};

// Delete test
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await CodingTest.findByIdAndDelete(id);
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Delete test error:", error);
    res.status(500).json({ message: error.message || "Failed to delete test" });
  }
};
