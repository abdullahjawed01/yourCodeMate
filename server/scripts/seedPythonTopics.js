
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PythonTopic from '../models/PythonTopic.js';
import CodingTest from '../models/CodingTest.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const topics = [
  {
    title: "Introduction to Python",
    slug: "intro-to-python",
    description: "Learn what Python is and write your first program.",
    category: "basics",
    order: 1,
    content: `
# Welcome to Python!

Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.

### Why Python?
*   Python works on different platforms (Windows, Mac, Linux, Raspberry Pi, etc).
*   Python has a simple syntax similar to the English language.
*   Python has syntax that allows developers to write programs with fewer lines than some other programming languages.

### Your First Program
In Python, we use the \`print()\` function to output text to the screen.

\`\`\`python
print("Hello, World!")
\`\`\`
    `,
    testData: {
      title: "Hello World Test",
      description: "Write a program that prints 'Hello, World!' to the console.",
      initialCode: "# Write your code here\n",
      solutionCode: "print('Hello, World!')",
      testCases: [
        { input: "", expectedOutput: "Hello, World!\n" }
      ],
      hintCost: 5,
      hints: ["Use the print() function.", "Ensure the string is inside quotes."]
    }
  },
  {
    title: "Variables and Data Types",
    slug: "variables-and-data-types",
    description: "Understand how to store data in variables.",
    category: "basics",
    order: 2,
    prerequisites: ["intro-to-python"],
    content: `
# Variables

Variables are containers for storing data values.

### Creating Variables
Python has no command for declaring a variable.
A variable is created the moment you first assign a value to it.

\`\`\`python
x = 5
y = "John"
print(x)
print(y)
\`\`\`

### Data Types
Built-in Data Types in programming:

*   Text Type: \`str\`
*   Numeric Types: \`int\`, \`float\`, \`complex\`
*   Sequence Types: \`list\`, \`tuple\`, \`range\`
    `,
    testData: {
      title: "Variable Test",
      description: "Create a variable named 'my_city' and assign it the value 'New York', then print it.",
      initialCode: "# Create variable and print it\n",
      solutionCode: "my_city = 'New York'\nprint(my_city)",
      testCases: [
        { input: "", expectedOutput: "New York\n" }
      ],
      hintCost: 5,
      hints: ["Assign value using '='", "print(my_city)"]
    }
  },
  {
    title: "Python Lists",
    slug: "python-lists",
    description: "Work with collections of items using lists.",
    category: "data-types",
    order: 3,
    prerequisites: ["variables-and-data-types"],
    content: `
# Lists

Lists are used to store multiple items in a single variable.

Lists are one of 4 built-in data types in Python used to store collections of data.

\`\`\`python
thislist = ["apple", "banana", "cherry"]
print(thislist)
\`\`\`

### Access Items
List items are indexed, the first item has index [0], the second item has index [1] etc.

\`\`\`python
thislist = ["apple", "banana", "cherry"]
print(thislist[1]) 
# Output: banana
\`\`\`
    `,
    testData: {
      title: "List Indexing Test",
      description: "Create a list called 'fruits' with 'apple', 'banana', 'cherry'. Print the second item.",
      initialCode: "fruits = ['apple', 'banana', 'cherry']\n# Print the second item\n",
      solutionCode: "fruits = ['apple', 'banana', 'cherry']\nprint(fruits[1])",
      testCases: [
        { input: "", expectedOutput: "banana\n" }
      ],
      hintCost: 10,
      hints: ["Lists are 0-indexed.", "The second item is at index 1."]
    }
  },
   {
    title: "Python If...Else",
    slug: "python-if-else",
    description: "Control flow with conditions.",
    category: "basics",
    order: 4,
    prerequisites: ["variables-and-data-types"],
    content: `
# If...Else

Python supports the usual logical conditions from mathematics:

*   Equals: \`a == b\`
*   Not Equals: \`a != b\`
*   Less than: \`a < b\`
*   Less than or equal to: \`a <= b\`
*   Greater than: \`a > b\`
*   Greater than or equal to: \`a >= b\`

\`\`\`python
a = 33
b = 200
if b > a:
  print("b is greater than a")
\`\`\`
    `,
    testData: {
      title: "Condition Test",
      description: "Write an if statement that prints 'YES' if 10 is greater than 5.",
      initialCode: "if 10 > 5:\n    # print YES\n    pass",
      solutionCode: "if 10 > 5:\n    print('YES')",
      testCases: [
        { input: "", expectedOutput: "YES\n" }
      ],
      hintCost: 5,
      hints: ["Make sure to indent the print statement."]
    }
  },
  {
    title: "Python Functions",
    slug: "python-functions",
    description: "Learn to reuse code with functions.",
    category: "functions",
    order: 5,
    prerequisites: ["python-if-else"],
    content: `
# Functions

A function is a block of code which only runs when it is called.

You can pass data, known as parameters, into a function.

A function can return data as a result.

### Creating a Function
In Python a function is defined using the def keyword:

\`\`\`python
def my_function():
  print("Hello from a function")
\`\`\`
    `,
    testData: {
      title: "Function Test",
      description: "Create a function named 'greet' that prints 'Hello'. Then call it.",
      initialCode: "# Define function\n\n# Call function",
      solutionCode: "def greet():\n    print('Hello')\n\ngreet()",
      testCases: [
        { input: "", expectedOutput: "Hello\n" }
      ],
      hintCost: 15,
      hints: ["Use 'def greet():'", "Don't forget to call greet() at the end."]
    }
  }
];

const seedDB = async () => {
  try {
    const dbUri = process.env.DBURI || process.env.MONGO_URI;
    if (!dbUri) {
        throw new Error("DBURI is not defined in environment variables");
    }
    await mongoose.connect(dbUri);
    console.log("MongoDB Connected");

    // Clear existing
    await PythonTopic.deleteMany({});
    await CodingTest.deleteMany({});
    console.log("Cleared existing topics and tests");

    for (const topicData of topics) {
      // 1. Create Test
      const test = await CodingTest.create(topicData.testData);

      // 2. Create Topic with reference to Test
      await PythonTopic.create({
        title: topicData.title,
        slug: topicData.slug,
        description: topicData.description,
        content: topicData.content,
        order: topicData.order,
        category: topicData.category,
        prerequisites: topicData.prerequisites,
        testId: test._id,
        pointsReward: 20
      });

      console.log(`Created topic: ${topicData.title}`);
    }

    console.log("Seeding Completed Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
