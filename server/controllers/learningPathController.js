import LearningPath from "../models/LearningPath.js";

export const createPath = async (req, res) => {
  const path = await LearningPath.create(req.body);
  res.status(201).json(path);
};

export const getAllPaths = async (req, res) => {
  const paths = await LearningPath.find().populate("tests");
  res.status(200).json(paths);
};
