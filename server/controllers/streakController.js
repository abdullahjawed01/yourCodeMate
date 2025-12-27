import User from "../models/User.js";

export const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date().toDateString();
  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate).toDateString()
    : null;

  if (lastActive === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive === yesterday.toDateString()) {
    user.streak += 1;
  } else {
    user.streak = 1;
  }

  user.lastActiveDate = new Date();
  await user.save();
  await updateStreak(user._id);
};
