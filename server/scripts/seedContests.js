import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contest from '../models/Contest.js';
import CodingTest from '../models/CodingTest.js';
import User from '../models/User.js';

dotenv.config();

const seedContests = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.DBURI);
        console.log('Connected.');

        console.log('Clearing existing Contests...');
        await Contest.deleteMany({});
        
        // Find existing users and problems to link
        const users = await User.find().limit(5);
        const problems = await CodingTest.find().limit(5);
        
        if (problems.length === 0) {
           console.log('No problems found. Run seed_full_data.js first if you want problems attached.');
        }

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        console.log('Seeding new contests...');
        const contestsToCreate = [
             {
                title: 'Weekly Contest 400',
                description: 'Join thousands of developers in the 400th weekly challenge.',
                startTime: now,
                endTime: tomorrow,
                problems: problems.map(p => p._id),
                participants: users.map(u => u._id),
                status: 'active'
             },
             {
                title: 'Spring Coding Sprint',
                description: 'A special event to welcome the spring season with algorithmic challenges.',
                startTime: tomorrow,
                endTime: nextWeek,
                problems: problems.slice(0, 3).map(p => p._id),
                participants: [],
                status: 'upcoming'
             },
             {
                title: 'Daily Warmup #102',
                description: 'Quick algorithm exercises for daily practice.',
                startTime: pastWeek,
                endTime: yesterday,
                problems: problems.slice(0, 2).map(p => p._id),
                participants: users.map(u => u._id),
                status: 'completed'
             }
        ];

        await Contest.insertMany(contestsToCreate);

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedContests();
