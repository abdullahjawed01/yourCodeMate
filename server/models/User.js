import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    rank: { type: String, default: 'Novice' },
    
    // Profile Fields
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    country: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    
    // Social / Games
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    battlesWon: { type: Number, default: 0 },
    battlesLost: { type: Number, default: 0 },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    solvedTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodingTest",
      },
    ],
    solvedTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LanguageTopic",
      },
    ],
  },
  { timestamps: true }
);
// 🔐 HASH PASSWORD (CORRECT)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
