import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CodingTest from './models/CodingTest.js';
import User from './models/User.js';
import Progress from './models/Progress.js';
import JavascriptTopic from './models/JavascriptTopic.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedFullData = async () => {
  try {
    await mongoose.connect(process.env.DBURI);
    console.log('Connected to DB');

    // --- 1. Fix JS Curriculum Tests (Schema Match) ---
    const jsCurriculum = [
        {
          title: "JS Basics Test",
          testCases: [{ input: "", expectedOutput: "Hello World" }],
          codeTemplate: `console.log("Hello World");`
        },
        {
          title: "Data Types Challenge",
          testCases: [{ input: "", expectedOutput: "string number" }],
          codeTemplate: `let str = "Hello";\nlet num = 42;\nconsole.log(typeof str, typeof num);`
        },
        {
          title: "Function Master",
          testCases: [{ input: "2 3", expectedOutput: "5" }, { input: "10 5", expectedOutput: "15" }],
          codeTemplate: `function add(a, b) {\n    console.log(a + b);\n}\nadd(2, 3);`
        },
        {
          title: "ES6 Rewrite",
          testCases: [{ input: "4", expectedOutput: "16" }],
          codeTemplate: `const square = (n) => console.log(n * n);\nsquare(4);`
        },
        {
          title: "Promise Land",
          testCases: [{ input: "", expectedOutput: "Success" }],
          codeTemplate: `function check() {\n    return Promise.resolve("Success");\n}\ncheck().then(console.log);`
        }
    ];

    for (const item of jsCurriculum) {
        await CodingTest.findOneAndUpdate(
            { title: item.title },
            { testCases: item.testCases, codeTemplate: item.codeTemplate }, // Update with correct field
            { new: true }
        );
        console.log(`Updated test schema for: ${item.title}`);
    }

    // --- 2. Seed Practice Tests (Practice One) ---
    // Ensure these tests exist and have correct schema
    const practiceTests = [
        {
            title: "Palindrome Checker",
            description: "Check if a given string is a palindrome (reads same forwards and backwards). Print 'true' or 'false'.",
            difficulty: "easy",
            tags: ["string", "algorithm"],
             testCases: [
                { input: "madam", expectedOutput: "true" },
                { input: "hello", expectedOutput: "false" }
            ],
            unlockLevel: 1,
            maxScore: 100,
            passScore: 50,
            codeTemplate: "// Write your solution here\n// Input is provided as a command line argument or standard input depending on environment\n// For this platform, assume input is passed to your function or read from stdin"
        },
        {
            title: "FizzBuzz",
            description: "Print numbers 1 to n. For multiples of 3 print 'Fizz', for 5 print 'Buzz', for both print 'FizzBuzz'.",
            difficulty: "easy",
            tags: ["math", "algorithm"],
            testCases: [
               { input: "3", expectedOutput: "1\n2\nFizz" }
            ],
            unlockLevel: 1,
            maxScore: 100,
            passScore: 50
        },
         {
            title: "Array Sum",
            description: "Calculate the sum of an array of numbers.",
            difficulty: "medium",
            tags: ["array", "math"],
            testCases: [
               { input: "[1, 2, 3]", expectedOutput: "6" }
            ],
            unlockLevel: 2,
            maxScore: 100,
            passScore: 50
        }
    ];

    for (const pTest of practiceTests) {
         await CodingTest.findOneAndUpdate(
             { title: pTest.title },
             pTest,
             { upsert: true, new: true }
         );
         console.log(`Upserted practice test: ${pTest.title}`);
    }

    // --- 3. Seed Demo Users for Leaderboard ---
    const demoUsers = [
        { name: "Alice Coder", email: "alice@example.com", points: 1250, level: 12 },
        { name: "Bob Builder", email: "bob@example.com", points: 980, level: 9 },
        { name: "Charlie Dev", email: "charlie@example.com", points: 850, level: 8 },
        { name: "Diana Script", email: "diana@example.com", points: 720, level: 7 },
        { name: "Evan Loop", email: "evan@example.com", points: 650, level: 6 },
        { name: "Frank Stack", email: "frank@example.com", points: 500, level: 5 },
        { name: "Grace Hopp", email: "grace@example.com", points: 450, level: 4 },
        { name: "Henry Hash", email: "henry@example.com", points: 300, level: 3 },
        { name: "Ivy Array", email: "ivy@example.com", points: 150, level: 1 },
        { name: "Jack Node", email: "jack@example.com", points: 100, level: 1 }
    ];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    for (const u of demoUsers) {
        // Create User
        let user = await User.findOne({ email: u.email });
        if (!user) {
            user = await User.create({
                name: u.name,
                email: u.email,
                password: hashedPassword,
                points: u.points, // Update model default if needed, but progress is source of truth
                level: u.level
            });
            console.log(`Created user: ${u.name}`);
        }

        // Create/Update Progress
        let progress = await Progress.findOne({ user: user._id });
        if (!progress) {
            progress = await Progress.create({
                user: user._id,
                points: u.points,
                level: u.level,
                badges: u.level > 5 ? ["Fast Learner", "Top Coder"] : ["Newbie"],
                completedTests: []
            });
        } else {
            progress.points = u.points;
            progress.level = u.level;
            await progress.save();
        }
        console.log(`Updated progress for: ${u.name}`);
    }

    console.log('Full data seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedFullData();
