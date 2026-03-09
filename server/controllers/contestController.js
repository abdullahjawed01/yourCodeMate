import Contest from '../models/Contest.js';
import User from '../models/User.js';

// Get all contests
export const getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate('problems', 'title difficulty points')
      .sort({ startTime: -1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contests', error: error.message });
  }
};

// Get single contest
export const getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems', 'title currentPoints description difficulty functionName inputFormat outputFormat testCases')
      .populate('participants', 'name username avatar')
      .populate('leaderboard.user', 'name username avatar');
      
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contest', error: error.message });
  }
};

// Create contest (Admin only ideally, but keeping open for demo)
export const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;
    
    const newContest = new Contest({
      title,
      description,
      startTime,
      endTime,
      problems
    });

    await newContest.save();
    res.status(201).json(newContest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contest', error: error.message });
  }
};

// Join contest
export const joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    if (contest.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this contest' });
    }

    contest.participants.push(req.user._id);
    await contest.save();

    res.json({ message: 'Successfully joined contest', contest });
  } catch (error) {
    res.status(500).json({ message: 'Error joining contest', error: error.message });
  }
};
