import User from "../models/User.js";
import CodingTest from "../models/CodingTest.js";

export const recommendNextTest = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const test = await CodingTest.findOne({
    _id: { $nin: user.solvedTests },
    unlockLevel: { $lte: user.level },
  }).sort({ unlockLevel: 1 });

  if (!test) {
    return res.status(200).json({
      message: "All tests completed 🎉",
    });
  }

  res.status(200).json({
    nextTest: test,
  });
};
