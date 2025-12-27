import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JavascriptTopic from './models/JavascriptTopic.js';
import CodingTest from './models/CodingTest.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DBURI);
    console.log('Connected to DB');

    // 1. Clear existing JS topics (optional, but good for clean state)
    // await JavascriptTopic.deleteMany({});
    // console.log('Cleared existing JS topics');

    // 2. Define curriculum
    const curriculum = [
      {
        title: "JavaScript Basics",
        slug: "js-basics",
        description: "Introduction to JavaScript, variables, and outputs.",
        content: `
# JavaScript Basics

JavaScript is the programming language of the Web. It is easy to learn.

## Variables
In JavaScript, there are 3 ways to declare a variable:
- \`var\`
- \`let\`
- \`const\`

\`\`\`javascript
let x = 5;
const y = 6;
console.log(x + y);
\`\`\`
        `,
        order: 1,
        category: 'basics',
        pointsReward: 50,
        estimatedTime: 10,
        testTitle: "JS Basics Test",
        testDescription: "Test your knowledge of variables and printing.",
        testCases: [
            { input: "", output: "Hello World", hidden: false }
        ],
        codeTemplate: `// Print "Hello World" to the console
console.log("Hello World");
`
      },
      {
        title: "Data Types",
        slug: "data-types",
        description: "Strings, Numbers, Booleans, and more.",
        content: `
# Data Types

JavaScript has 8 Datatypes
1. String
2. Number
3. Bigint
4. Boolean
5. Undefined
6. Null
7. Symbol
8. Object

\`\`\`javascript
let length = 16;                               // Number
let lastName = "Johnson";                      // String
let x = {firstName:"John", lastName:"Doe"};    // Object
\`\`\`
        `,
        order: 2,
        category: 'basics',
        pointsReward: 60,
        estimatedTime: 15,
        testTitle: "Data Types Challenge",
        testDescription: "Create variables of different types and print them.",
        testCases: [
            { input: "", output: "string number", hidden: false }
        ],
        codeTemplate: `// Create a string variable and a number variable
// Print their types using typeof, separated by space
let str = "Hello";
let num = 42;
console.log(typeof str, typeof num);
`
      },
      {
        title: "Functions",
        slug: "functions",
        description: "Defining and calling functions.",
        content: `
# Functions

A JavaScript function is a block of code designed to perform a particular task.

\`\`\`javascript
function myFunction(p1, p2) {
  return p1 * p2;
}
\`\`\`
        `,
        order: 3,
        category: 'functions',
        pointsReward: 70,
        estimatedTime: 20,
        testTitle: "Function Master",
        testDescription: "Write a function to add two numbers.",
        testCases: [
            { input: "2 3", output: "5", hidden: false },
             { input: "10 5", output: "15", hidden: true }
        ],
        codeTemplate: `// Write a function called add that calls console.log with the sum
function add(a, b) {
    console.log(a + b);
}

// Do not modify below
add(2, 3);
`
      },
      {
        title: "ES6 Features",
        slug: "es6",
        description: "Arrow functions, destructuring, and let/const.",
        content: `
# ES6 Features

ES6 brought major changes to JavaScript.

## Arrow Functions
\`\`\`javascript
const x = (x, y) => x * y;
\`\`\`

## Destructuring
\`\`\`javascript
const person = {name: "John", age: 50};
const { name, age } = person;
\`\`\`
        `,
        order: 4,
        category: 'es6',
        pointsReward: 80,
        estimatedTime: 25,
        testTitle: "ES6 Rewrite",
        testDescription: "Convert a standard function to an arrow function.",
        testCases: [
            { input: "4", output: "16", hidden: false }
        ],
        codeTemplate: `// Create an arrow function named 'square' that prints the square of a number
const square = (n) => console.log(n * n);

// Test
square(4);
`
      },
      {
        title: "Async Programming",
        slug: "async-promises",
        description: "Callbacks, Promises, and Async/Await.",
        content: `
# Async & Promises

## Promises
A Promise is an object representing the eventual completion or failure of an asynchronous operation.

\`\`\`javascript
let myPromise = new Promise(function(myResolve, myReject) {
  myResolve(); // when successful
  myReject();  // when error
});
\`\`\`

## Async/Await
\`\`\`javascript
async function myFunction() {
  return "Hello";
}
\`\`\`
        `,
        order: 5,
        category: 'async',
        pointsReward: 100,
        estimatedTime: 30,
        testTitle: "Promise Land",
        testDescription: "Create a resolved promise that returns 'Success'.",
        testCases: [
            { input: "", output: "Success", hidden: false }
        ],
        codeTemplate: `// Create a function 'check' that returns a Promise resolving to "Success"
// Then call it and print the result

function check() {
    return Promise.resolve("Success");
}

check().then(console.log);
`
      }
    ];

    for (const item of curriculum) {
       // Create the test first
       const test = await CodingTest.create({
         title: item.testTitle,
         description: item.testDescription,
         difficulty: 'easy',
         category: 'javascript', // Ensure this matches specific categories if needed
         tags: ['javascript', item.category],
         testCases: item.testCases,
         maxScore: 100,
         passScore: 50,
         timeLimit: 30,
         memoryLimit: 512,
         unlockLevel: 1, // Can escalate this
         codeTemplate: item.codeTemplate
       });

       console.log(`Created test: ${item.testTitle}`);

       // Create the topic
       await JavascriptTopic.findOneAndUpdate(
         { slug: item.slug },
         {
           title: item.title,
           description: item.description,
           content: item.content,
           order: item.order,
           category: item.category,
           pointsReward: item.pointsReward,
           estimatedTime: item.estimatedTime,
           testId: test._id,
           prerequisites: item.order > 1 ? [curriculum[item.order - 2].slug] : []
         },
         { upsert: true, new: true }
       );
       console.log(`Upserted topic: ${item.title}`);
    }

    // 3. Create "Practice One" tests (Generic Coding Tests)
    const practiceTests = [
        {
            title: "Palindrome Checker",
            description: "Check if a given string is a palindrome (reads same forwards and backwards). Print 'true' or 'false'.",
            difficulty: "easy",
            tags: ["string", "algorithm"],
             testCases: [
                { input: "madam", output: "true", hidden: false },
                { input: "hello", output: "false", hidden: false }
            ],
            unlockLevel: 1
        },
        {
            title: "FizzBuzz",
            description: "Print numbers 1 to n. For multiples of 3 print 'Fizz', for 5 print 'Buzz', for both print 'FizzBuzz'.",
            difficulty: "easy",
            tags: ["math", "algorithm"],
            testCases: [
               { input: "3", output: "1\n2\nFizz", hidden: false }
            ],
            unlockLevel: 1
        },
         {
            title: "Array Sum",
            description: "Calculate the sum of an array of numbers.",
            difficulty: "medium",
            tags: ["array", "math"],
            testCases: [
               { input: "[1, 2, 3]", output: "6", hidden: false }
            ],
            unlockLevel: 2
        }
    ];

    for (const pTest of practiceTests) {
         await CodingTest.create({
             ...pTest,
             maxScore: 100,
             passScore: 50,
             timeLimit: 30,
             memoryLimit: 512,
             codeTemplate: "// Write your solution here\n"
         });
         console.log(`Created practice test: ${pTest.title}`);
    }


    console.log('Seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
