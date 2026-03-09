// ─────────────────────────────────────────────────────────────────────────────
// Complete JavaScript Course Curriculum — 11 Modules
// Used as static fallback when backend has no topics for JavaScript
// ─────────────────────────────────────────────────────────────────────────────

export interface Lesson {
    id: string;
    title: string;
    description: string;
    content: string;
    codeExample: string;
    exercise: string;
    exerciseStarter: string;
    xp: number;
    estimatedMinutes: number;
}

export interface Module {
    id: string;
    number: number;
    title: string;
    color: string;
    icon: string;
    lessons: Lesson[];
}

export const JS_CURRICULUM: Module[] = [
    {
        id: 'basics',
        number: 1,
        title: 'JavaScript Basics',
        color: 'text-yellow-400',
        icon: '🟢',
        lessons: [
            {
                id: 'what-is-js',
                title: 'What is JavaScript?',
                description: 'Understand what JavaScript is, where it runs, and why it matters.',
                xp: 30,
                estimatedMinutes: 5,
                content: `## What is JavaScript?

JavaScript is the **world's most popular programming language**. It's a lightweight, interpreted scripting language that enables dynamic, interactive behaviour on websites.

### Where does JavaScript run?
- 🌐 **Browsers** — In Chrome, Firefox, Safari, Edge (every website)
- 🖥️ **Servers** — Via Node.js (backend development)
- 📱 **Mobile Apps** — React Native, Ionic
- 🖥️ **Desktop Apps** — Electron (VS Code is built with JS!)

### What can you build?
- Interactive websites and web apps
- REST APIs and full backends
- Real-time apps (chat, games)
- Mobile and desktop applications

> 💡 **Fun Fact**: JavaScript was created in just 10 days in 1995 by Brendan Eich at Netscape!

### Your first JavaScript program

Every programmer starts with "Hello, World!". In JavaScript, you do it with \`console.log()\`:`,
                codeExample: `// Your first JavaScript program!
console.log("Hello, World!");

// You can also show messages in the browser
// alert("Hello from JavaScript!");

// Or calculate something
let result = 2 + 2;
console.log("2 + 2 =", result);`,
                exercise: 'Modify the code to print your name and your favourite programming language to the console.',
                exerciseStarter: `// Exercise: Print your name and favourite language
// Try: console.log("My name is ...")
console.log("Hello, World!");
`,
            },
            {
                id: 'syntax',
                title: 'JavaScript Syntax',
                description: 'Learn the rules and structure of JavaScript code.',
                xp: 30,
                estimatedMinutes: 7,
                content: `## JavaScript Syntax

Syntax is the set of rules that defines a correctly structured JavaScript program.

### Statements
A JavaScript program is made up of **statements** — individual instructions:

\`\`\`js
let x = 5;         // declaration statement
x = x + 1;        // expression statement
console.log(x);   // function call statement
\`\`\`

### Case Sensitivity
JavaScript is **case-sensitive**. \`myVar\` and \`myvar\` are completely different variables.

### Semicolons (optional but recommended)
Statements can end with a semicolon \`;\`. While optional in most cases (JavaScript has Automatic Semicolon Insertion), it's good practice to include them.

### White Space
JS ignores multiple spaces and line breaks in code. Use them to make your code readable.

### Code Blocks
Related statements are grouped in **curly braces \`{ }\`**:
\`\`\`js
if (condition) {
  // block of code
  statement1;
  statement2;
}
\`\`\`

### Identifiers
Names used for variables, functions, etc. Rules:
- Must begin with a letter, \`$\`, or \`_\`
- Can contain letters, digits, \`$\`, \`_\`
- Cannot be a reserved keyword (like \`let\`, \`if\`, \`for\`)
`,
                codeExample: `// JavaScript Syntax Examples

// Variables
let userName = "Alice";   // camelCase (recommended)
let user_age = 25;        // underscore style
const MAX_SCORE = 100;    // UPPER_CASE for constants

// Statements end with semicolons (optional)
let x = 10;
let y = 20;
let sum = x + y;

// Code block
if (sum > 25) {
  console.log("Sum is greater than 25");
} else {
  console.log("Sum is 25 or less");
}

console.log("Sum:", sum);`,
                exercise: 'Create three variables: firstName, lastName, and age. Then print a sentence using all three.',
                exerciseStarter: `// Exercise: Variables and output
// Create firstName, lastName, age variables
// Then console.log a sentence using all three

let firstName = ""; // your name
let lastName = "";  // your surname
let age = 0;        // your age

// Print: "My name is [first] [last] and I am [age] years old."
`,
            },
            {
                id: 'variables',
                title: 'Variables: var, let, const',
                description: 'Master how JavaScript stores data using the three types of variable declarations.',
                xp: 40,
                estimatedMinutes: 10,
                content: `## Variables in JavaScript

Variables are **containers for storing data**. JavaScript has three ways to declare them.

### \`var\` (old way — avoid)
\`\`\`js
var name = "Alice";
var name = "Bob"; // Can re-declare — problem!
\`\`\`
- Function-scoped (not block-scoped)
- Can be re-declared and re-assigned
- Hoisted (moves to top of function) — confusing!

### \`let\` (modern — use this)
\`\`\`js
let score = 0;
score = 10; // ✅ re-assign is fine
let score = 20; // ❌ cannot re-declare
\`\`\`
- Block-scoped (\`{ }\`)
- Can be re-assigned but not re-declared in same scope
- Not hoisted in the same way as \`var\`

### \`const\` (for values that won't change)
\`\`\`js
const PI = 3.14159;
PI = 3; // ❌ TypeError — cannot re-assign
\`\`\`
- Block-scoped
- Must be initialized when declared
- Cannot be re-assigned (but object/array contents can change)

### 💡 Best Practice
- Use \`const\` by default
- Use \`let\` when you know the value will change
- Never use \`var\`
`,
                codeExample: `// var, let, const comparison

// Using let (re-assignable)
let score = 0;
score = 100;
console.log("Score:", score);  // 100

// Using const (constant)
const PI = 3.14159;
const APP_NAME = "CodeMate";
console.log("PI:", PI);
console.log("App:", APP_NAME);

// const with objects — contents can change
const user = { name: "Alice", age: 25 };
user.age = 26;  // ✅ this is allowed
console.log("User:", user.name, user.age);

// Block scope example
let x = "outside";
{
  let x = "inside";  // Different variable!
  console.log("Inside block:", x);
}
console.log("Outside block:", x);`,
                exercise: 'Create a shopping cart simulation: use const for the cart name, let for item count, and add items to increase the count.',
                exerciseStarter: `// Exercise: Shopping Cart
// Use const for the store name, let for item count

const storeName = "CodeMart";
let itemCount = 0;

// Add some items (increase itemCount)
// itemCount = ...

// Print: "storeName has itemCount items in cart"
console.log(storeName + " has " + itemCount + " items in cart");
`,
            },
            {
                id: 'data-types',
                title: 'Data Types',
                description: 'Explore JavaScript\'s primitive and object data types.',
                xp: 40,
                estimatedMinutes: 10,
                content: `## JavaScript Data Types

JavaScript has **8 basic data types**:

### Primitive Types (7)
| Type | Example | Description |
|------|---------|-------------|
| \`string\` | \`"hello"\` | Text |
| \`number\` | \`42\`, \`3.14\` | Numbers (int & float) |
| \`boolean\` | \`true\`, \`false\` | True/false values |
| \`undefined\` | \`undefined\` | Variable declared but not assigned |
| \`null\` | \`null\` | Intentional absence of value |
| \`bigint\` | \`9007199254740991n\` | Very large integers |
| \`symbol\` | \`Symbol("id")\` | Unique identifiers |

### Object Type (1)
Arrays, functions, and objects are all of type \`object\`.

### \`typeof\` operator
Use \`typeof\` to check the type of a value:
\`\`\`js
typeof "hello"   // "string"
typeof 42        // "number"
typeof true      // "boolean"
typeof undefined // "undefined"
typeof null      // "object" ← weird quirk!
typeof []        // "object"
typeof {}        // "object"
\`\`\`

### Type Coercion
JavaScript automatically converts types in some situations:
\`\`\`js
"5" + 3    // "53"  (number converted to string)
"5" - 3    // 2     (string converted to number)
true + 1   // 2
\`\`\`
`,
                codeExample: `// JavaScript Data Types

// Strings
let firstName = "Alice";
let greeting = \`Hello, \${firstName}!\`;  // template literal

// Numbers
let age = 25;
let price = 9.99;
let infinity = Infinity;
let notANumber = NaN;

// Boolean
let isActive = true;
let isAdmin = false;

// Undefined and null
let score;              // undefined
let address = null;     // intentionally empty

// Dynamic typing — types can change
let dynamic = "hello";
console.log(typeof dynamic);  // string

dynamic = 42;
console.log(typeof dynamic);  // number

// Check all types
console.log(typeof firstName);  // string
console.log(typeof age);        // number
console.log(typeof isActive);   // boolean
console.log(typeof score);      // undefined
console.log(typeof address);    // object (quirk!)
console.log(typeof [1, 2, 3]);  // object`,
                exercise: 'Create variables of each primitive data type and use typeof to verify each one.',
                exerciseStarter: `// Exercise: Data Types Explorer
// Create one variable of each type and print typeof for each

let myString = ""; // change me
let myNumber = 0;  // change me
let myBoolean = false; // change me
let myUndefined;   // leave as-is
let myNull = null; // leave as-is

// Print the type of each variable
console.log("string:", typeof myString);
// add more console.logs below...
`,
            },
        ],
    },
    {
        id: 'control-flow',
        number: 2,
        title: 'Control Flow',
        color: 'text-blue-400',
        icon: '🔀',
        lessons: [
            {
                id: 'if-else',
                title: 'if / else Statements',
                description: 'Make decisions in your code with conditional statements.',
                xp: 40,
                estimatedMinutes: 10,
                content: `## if / else Statements

Conditional statements make your code **make decisions** based on conditions.

### Basic if
\`\`\`js
if (condition) {
  // runs only when condition is true
}
\`\`\`

### if...else
\`\`\`js
if (condition) {
  // runs when true
} else {
  // runs when false
}
\`\`\`

### if...else if...else
\`\`\`js
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}
\`\`\`

### Truthy and Falsy values
In JavaScript, the following values are **falsy** (treated as false):
- \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`

Everything else is **truthy**.
`,
                codeExample: `// Conditional Statements

let age = 20;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("You cannot vote yet.");
}

// Grade calculator
let score = 85;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}

console.log("Score:", score, "→ Grade:", grade);

// Truthy / falsy
let username = "";
if (username) {
  console.log("Logged in as:", username);
} else {
  console.log("Please log in");  // runs because "" is falsy
}`,
                exercise: 'Write a function that takes a temperature in Celsius and returns "Cold" (<10), "Warm" (10-25), or "Hot" (>25).',
                exerciseStarter: `// Exercise: Temperature Classifier
let temperature = 22;  // try different values

// Write if/else to classify temperature:
// < 10 → "Cold"
// 10–25 → "Warm"  
// > 25 → "Hot"

let category = "";

// your code here...

console.log(temperature + "°C is:", category);
`,
            },
            {
                id: 'switch',
                title: 'Switch Statement',
                description: 'Use switch for elegant multi-way branching.',
                xp: 35,
                estimatedMinutes: 8,
                content: `## Switch Statement

The switch statement is a cleaner alternative to long \`if...else if\` chains when checking the same value against multiple possibilities.

\`\`\`js
switch (expression) {
  case value1:
    // code
    break;
  case value2:
    // code
    break;
  default:
    // fallback code
}
\`\`\`

### Important: \`break\`
Without \`break\`, execution **falls through** to the next case:
\`\`\`js
switch (day) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Weekday");
    break;
  case 6:
  case 7:
    console.log("Weekend");
    break;
}
\`\`\`

### Ternary Operator
A shorthand for simple if/else:
\`\`\`js
let result = condition ? "yes" : "no";
// equivalent to:
let result = condition ? "yes" : "no";
\`\`\`
`,
                codeExample: `// Switch Statement

let day = 3;
let dayName;

switch (day) {
  case 1: dayName = "Monday"; break;
  case 2: dayName = "Tuesday"; break;
  case 3: dayName = "Wednesday"; break;
  case 4: dayName = "Thursday"; break;
  case 5: dayName = "Friday"; break;
  case 6: dayName = "Saturday"; break;
  case 7: dayName = "Sunday"; break;
  default: dayName = "Invalid day";
}

console.log("Day " + day + " is: " + dayName);

// Ternary operator
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log("Status:", status);

// Nested ternary (use sparingly)
let score = 75;
let grade = score >= 90 ? "A" : score >= 70 ? "B" : "C";
console.log("Grade:", grade);`,
                exercise: 'Create a switch statement that maps a season number (1-4) to its name and typical weather.',
                exerciseStarter: `// Exercise: Season Detector
let season = 2;  // try 1, 2, 3, 4

let seasonName = "";
let weather = "";

switch (season) {
  // case 1: Spring...
  // case 2: Summer...
  // case 3: Autumn...
  // case 4: Winter...
  default:
    seasonName = "Unknown";
}

console.log("Season:", seasonName, "| Weather:", weather);
`,
            },
        ],
    },
    {
        id: 'functions',
        number: 3,
        title: 'Functions',
        color: 'text-purple-400',
        icon: '⚡',
        lessons: [
            {
                id: 'function-declaration',
                title: 'Function Declaration & Expression',
                description: 'Write reusable blocks of code with function declarations and expressions.',
                xp: 50,
                estimatedMinutes: 12,
                content: `## Functions in JavaScript

Functions are **reusable blocks of code** that perform a specific task. They are one of the fundamental building blocks of JavaScript.

### Function Declaration
\`\`\`js
function functionName(parameter1, parameter2) {
  // body
  return result;
}

// Call the function
functionName(arg1, arg2);
\`\`\`

### Function Expression
A function assigned to a variable:
\`\`\`js
const greet = function(name) {
  return "Hello, " + name + "!";
};
\`\`\`

### Arrow Functions (ES6)
Shorter syntax for function expressions:
\`\`\`js
const add = (a, b) => a + b;

const greet = (name) => {
  return "Hello, " + name + "!";
};
\`\`\`

### Default Parameters
\`\`\`js
function greet(name = "World") {
  return "Hello, " + name + "!";
}
greet();        // "Hello, World!"
greet("Alice"); // "Hello, Alice!"
\`\`\`

### Rest Parameters
Collect multiple arguments into an array:
\`\`\`js
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
\`\`\`
`,
                codeExample: `// Functions — All Styles

// 1. Function Declaration
function add(a, b) {
  return a + b;
}
console.log("add(3, 4):", add(3, 4));

// 2. Function Expression
const multiply = function(a, b) {
  return a * b;
};
console.log("multiply(3, 4):", multiply(3, 4));

// 3. Arrow Function (concise)
const square = n => n * n;
console.log("square(5):", square(5));

// 4. Arrow with block body
const greet = (name, title = "Mr.") => {
  return \`Hello, \${title} \${name}!\`;
};
console.log(greet("Smith"));
console.log(greet("Jones", "Dr."));

// 5. Rest parameters
const sumAll = (...nums) => nums.reduce((acc, n) => acc + n, 0);
console.log("sumAll(1,2,3,4,5):", sumAll(1, 2, 3, 4, 5));`,
                exercise: 'Write a function called `calculateBMI` that takes weight (kg) and height (m) and returns the BMI and category.',
                exerciseStarter: `// Exercise: BMI Calculator
// BMI = weight / (height * height)
// < 18.5: Underweight | 18.5–24.9: Normal | 25–29.9: Overweight | >= 30: Obese

function calculateBMI(weight, height) {
  // Calculate BMI
  let bmi = 0; // fix this
  
  // Determine category
  let category = "";
  
  return { bmi: bmi.toFixed(1), category };
}

let result = calculateBMI(70, 1.75);
console.log("BMI:", result.bmi, "| Category:", result.category);
`,
            },
        ],
    },
    {
        id: 'arrays',
        number: 4,
        title: 'Arrays',
        color: 'text-emerald-400',
        icon: '📦',
        lessons: [
            {
                id: 'array-basics',
                title: 'Arrays & Key Methods',
                description: 'Store and manipulate lists of data with JavaScript arrays.',
                xp: 55,
                estimatedMinutes: 15,
                content: `## JavaScript Arrays

Arrays are **ordered lists** that can hold multiple values of any type.

### Creating Arrays
\`\`\`js
let fruits = ["apple", "banana", "cherry"];
let mixed = [1, "hello", true, null];
let empty = [];
\`\`\`

### Accessing Elements
Arrays are **zero-indexed**:
\`\`\`js
fruits[0]  // "apple"
fruits[1]  // "banana"
fruits[fruits.length - 1]  // last element
\`\`\`

### Essential Methods

| Method | Description |
|--------|-------------|
| \`push(item)\` | Add to end |
| \`pop()\` | Remove from end |
| \`shift()\` | Remove from start |
| \`unshift(item)\` | Add to start |
| \`splice(i, n)\` | Remove n items at index i |
| \`slice(start, end)\` | Extract portion |
| \`indexOf(item)\` | Find index |
| \`includes(item)\` | Check existence |
| \`join(separator)\` | Convert to string |
| \`reverse()\` | Reverse array |
| \`sort()\` | Sort array |

### Higher-Order Methods (powerful!)
\`\`\`js
const nums = [1, 2, 3, 4, 5];

// map — transform each element
const doubled = nums.map(n => n * 2);  // [2,4,6,8,10]

// filter — keep elements matching condition
const evens = nums.filter(n => n % 2 === 0);  // [2,4]

// reduce — accumulate into single value
const sum = nums.reduce((acc, n) => acc + n, 0);  // 15

// find — first matching element
const first = nums.find(n => n > 3);  // 4

// every / some
const allPositive = nums.every(n => n > 0);  // true
const hasEven = nums.some(n => n % 2 === 0);  // true
\`\`\`
`,
                codeExample: `// Arrays in Action

let numbers = [1, 2, 3, 4, 5];

// Basic operations
numbers.push(6);
console.log("After push:", numbers);

numbers.pop();
console.log("After pop:", numbers);

// map: transform each item
let doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// filter: keep matching items
let evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// reduce: accumulate
let sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Chaining methods
let result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter(n => n % 2 === 0)   // keep evens
  .map(n => n * n)            // square them
  .reduce((acc, n) => acc + n, 0); // sum them

console.log("Sum of squares of evens:", result); // 220`,
                exercise: 'Given an array of student scores, use map, filter, and reduce to compute the average score of passing students (score >= 60).',
                exerciseStarter: `// Exercise: Student Grade Analysis
let scores = [45, 72, 88, 55, 91, 63, 78, 49, 95, 61];

// 1. Filter to keep only passing scores (>= 60)
let passingScores = []; // fix this

// 2. Calculate the average of passing scores
let average = 0; // fix this

// 3. Find the highest score
let highest = 0; // fix this

console.log("Passing scores:", passingScores);
console.log("Average of passing:", average.toFixed(1));
console.log("Highest score:", highest);
`,
            },
        ],
    },
    {
        id: 'objects',
        number: 5,
        title: 'Objects',
        color: 'text-orange-400',
        icon: '🧱',
        lessons: [
            {
                id: 'object-basics',
                title: 'Objects & Destructuring',
                description: 'Model real-world data using JavaScript objects.',
                xp: 55,
                estimatedMinutes: 15,
                content: `## JavaScript Objects

Objects are **collections of key-value pairs** used to model real-world entities.

### Creating Objects
\`\`\`js
const person = {
  name: "Alice",
  age: 25,
  city: "London"
};
\`\`\`

### Accessing Properties
\`\`\`js
person.name      // "Alice" (dot notation)
person["age"]    // 25 (bracket notation)
\`\`\`

### Object Methods
\`\`\`js
const user = {
  name: "Bob",
  greet() {
    return "Hello, I'm " + this.name;
  }
};
user.greet(); // "Hello, I'm Bob"
\`\`\`

### Nested Objects
\`\`\`js
const company = {
  name: "TechCorp",
  address: {
    street: "123 Main St",
    city: "Mumbai"
  }
};
company.address.city; // "Mumbai"
\`\`\`

### Destructuring
Extract properties into variables:
\`\`\`js
const { name, age } = person;
const { address: { city } } = company;
\`\`\`

### Spread Operator
\`\`\`js
const updated = { ...person, age: 26 };
\`\`\`

### Object Methods
\`\`\`js
Object.keys(person)    // ["name", "age", "city"]
Object.values(person)  // ["Alice", 25, "London"]
Object.entries(person) // [["name","Alice"], ["age",25], ...]
\`\`\`
`,
                codeExample: `// Objects in JavaScript

const user = {
  name: "Sara",
  age: 22,
  skills: ["JavaScript", "React", "Node.js"],
  address: {
    city: "Karachi",
    country: "Pakistan"
  },
  greet() {
    return \`Hi! I'm \${this.name} from \${this.address.city}\`;
  }
};

console.log(user.name);
console.log(user.address.city);
console.log(user.greet());
console.log(user.skills[0]);

// Destructuring
const { name, age, address: { city } } = user;
console.log(\`\${name} is \${age} from \${city}\`);

// Spread to create updated copy
const updatedUser = { ...user, age: 23, level: "Senior" };
console.log("Updated age:", updatedUser.age);
console.log("Level:", updatedUser.level);

// Object.entries() to loop
for (const [key, value] of Object.entries(user)) {
  if (typeof value !== 'object' && typeof value !== 'function') {
    console.log(\`\${key}: \${value}\`);
  }
}`,
                exercise: 'Create a `createProduct` function that returns an object with name, price, and a `getDiscountedPrice(percent)` method.',
                exerciseStarter: `// Exercise: Product Object
function createProduct(name, price) {
  return {
    name,
    price,
    // Add a method: getDiscountedPrice(percent)
    // It should return the price reduced by percent%
    // Example: getDiscountedPrice(20) on a $100 item → $80
  };
}

const laptop = createProduct("MacBook Pro", 1999);
console.log("Product:", laptop.name);
console.log("Original price: $" + laptop.price);
// console.log("After 15% discount: $" + laptop.getDiscountedPrice(15));
`,
            },
        ],
    },
    {
        id: 'dom',
        number: 6,
        title: 'DOM Manipulation',
        color: 'text-pink-400',
        icon: '🌐',
        lessons: [
            {
                id: 'dom-basics',
                title: 'Selecting & Modifying Elements',
                description: 'Control the browser page with the Document Object Model.',
                xp: 60,
                estimatedMinutes: 15,
                content: `## DOM Manipulation

The **Document Object Model (DOM)** is a programming interface that represents the HTML document as a tree of objects you can manipulate with JavaScript.

### Selecting Elements
\`\`\`js
// By ID (returns single element)
const btn = document.getElementById("myBtn");

// By CSS selector
const title = document.querySelector(".title");
const inputs = document.querySelectorAll("input");

// By class (returns HTMLCollection)
const cards = document.getElementsByClassName("card");
\`\`\`

### Modifying Content
\`\`\`js
element.textContent = "New text";   // plain text
element.innerHTML = "<b>Bold</b>";  // HTML (careful!)
\`\`\`

### Changing Styles
\`\`\`js
element.style.color = "red";
element.style.fontSize = "18px";
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("dark");
\`\`\`

### Event Listeners
\`\`\`js
document.getElementById("btn").addEventListener("click", function() {
  console.log("Button clicked!");
});
\`\`\`

### Creating & Inserting Elements
\`\`\`js
const div = document.createElement("div");
div.textContent = "New element";
document.body.appendChild(div);
\`\`\`
`,
                codeExample: `// DOM Manipulation Examples

// NOTE: These examples work in a real browser
// In this editor, we simulate DOM operations

// Simulating DOM concepts with plain JS

// 1. Selecting elements (browser concept)
// const btn = document.getElementById("submitBtn");
// const items = document.querySelectorAll(".item");

// 2. Modifying content
// btn.textContent = "Click Me!";
// btn.innerHTML = "<span>Click <b>Me!</b></span>";

// 3. Changing classes
// btn.classList.add("active");
// btn.classList.remove("disabled");
// btn.classList.toggle("highlighted");

// 4. Event listener
// btn.addEventListener("click", () => {
//   console.log("Button clicked!");
//   btn.textContent = "Clicked!";
// });

// 5. Creating elements
// const newDiv = document.createElement("div");
// newDiv.textContent = "Dynamic content!";
// newDiv.classList.add("card");
// document.body.appendChild(newDiv);

// Practical simulation:
const items = ["Apple", "Banana", "Cherry"];
const output = items.map((item, i) => \`\${i + 1}. \${item}\`).join("\\n");
console.log("List (DOM would show this):\\n" + output);`,
                exercise: 'Write JavaScript that would: 1) Select a button #submit, 2) Change its text, 3) Add a click event that shows an alert.',
                exerciseStarter: `// Exercise: DOM Operations (conceptual — shows logic)
// Write the code as if you were in a browser

// 1. Select the element with id "submit"
// const submitBtn = ...

// 2. Change its text to "Send Message"
// submitBtn.textContent = ...

// 3. Add a click event listener
// submitBtn.addEventListener("click", function() {
//   alert("Form submitted!");
// });

// For this editor, demonstrate the logic:
function handleButtonClick() {
  console.log("Button clicked! Logic executed.");
  console.log("In a real browser, this would manipulate the DOM.");
}

handleButtonClick();
`,
            },
        ],
    },
    {
        id: 'async',
        number: 7,
        title: 'Async JavaScript',
        color: 'text-cyan-400',
        icon: '⏳',
        lessons: [
            {
                id: 'promises-async-await',
                title: 'Promises & Async/Await',
                description: 'Handle asynchronous operations elegantly with promises and async/await.',
                xp: 70,
                estimatedMinutes: 20,
                content: `## Asynchronous JavaScript

JavaScript is **single-threaded** but non-blocking. Async code lets you handle slow operations (network requests, timers) without freezing the page.

### Callbacks (old way)
\`\`\`js
setTimeout(() => {
  console.log("After 1 second");
}, 1000);
\`\`\`

### Promises
A Promise represents a value that **will be available in the future**.
\`\`\`js
const promise = new Promise((resolve, reject) => {
  // async operation
  if (success) resolve(data);
  else reject(error);
});

promise
  .then(data => console.log("Got:", data))
  .catch(err => console.error("Error:", err))
  .finally(() => console.log("Done"));
\`\`\`

### Async/Await (modern — use this!)
Makes async code look synchronous:
\`\`\`js
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed:", error);
  }
}
\`\`\`

### Promise.all — run in parallel
\`\`\`js
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
\`\`\`
`,
                codeExample: `// Async JavaScript Examples

// 1. Simulating async with setTimeout
console.log("Start");

setTimeout(() => {
  console.log("This runs after 1 second (async)");
}, 1000);

console.log("End (runs before timeout!)");

// 2. Creating a Promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Note: await only works inside async functions
async function runDemo() {
  console.log("\\nAsync demo starting...");
  
  await delay(100); // simulating network delay
  console.log("Step 1: Data fetched");
  
  await delay(100);
  console.log("Step 2: Data processed");
  
  return "Done!";
}

// Promise chaining
const fetchUser = (id) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "User " + id }), 100);
  });

fetchUser(42)
  .then(user => {
    console.log("\\nFetched user:", user.name);
    return user.id * 2;
  })
  .then(doubled => console.log("Doubled ID:", doubled))
  .catch(err => console.error("Error:", err));`,
                exercise: 'Create an `asyncMath` function that simulates a "slow" calculation (using setTimeout/Promise) and returns the result after a delay.',
                exerciseStarter: `// Exercise: Async Math Calculator
// Create a function that waits 1 second then returns the sum

function slowAdd(a, b) {
  return new Promise((resolve) => {
    // After 100ms, resolve with a + b
    setTimeout(() => {
      // resolve(???)
    }, 100);
  });
}

async function main() {
  console.log("Calculating...");
  const result = await slowAdd(10, 25);
  console.log("Result:", result); // should print 35
}

main();
`,
            },
        ],
    },
    {
        id: 'advanced',
        number: 8,
        title: 'Advanced JavaScript',
        color: 'text-rose-400',
        icon: '🚀',
        lessons: [
            {
                id: 'closures-scope',
                title: 'Closures & Scope',
                description: 'Master closures, lexical scope, and hoisting — the heart of JavaScript.',
                xp: 80,
                estimatedMinutes: 20,
                content: `## Closures & Scope

These are some of the most important and often misunderstood concepts in JavaScript.

### Scope
Scope determines **where a variable is accessible**.
- **Global scope**: Accessible everywhere
- **Function scope**: Accessible inside a function
- **Block scope**: Accessible inside \`{ }\` (let/const)

\`\`\`js
let global = "I'm global";

function outer() {
  let outerVar = "I'm in outer";
  
  function inner() {
    let innerVar = "I'm in inner";
    console.log(global);    // ✅
    console.log(outerVar);  // ✅
    console.log(innerVar);  // ✅
  }
  
  // console.log(innerVar);  // ❌ ReferenceError
}
\`\`\`

### Closures
A **closure** is a function that "remembers" its surrounding scope even after the outer function has finished.

\`\`\`js
function makeCounter() {
  let count = 0;  // this is "closed over"
  
  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.getCount(); // 2 (count is preserved!)
\`\`\`

### Hoisting
Variable and function declarations are moved to the top of their scope:
\`\`\`js
// This works due to hoisting:
greet(); // "Hello!"
function greet() { console.log("Hello!"); }

// But not with variables:
// console.log(name); // undefined (var hoisted but not value)
// var name = "Alice";
\`\`\`
`,
                codeExample: `// Closures & Scope

// 1. Basic closure
function makeMultiplier(factor) {
  return function(number) {
    return number * factor;  // factor is "closed over"
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 2. Counter with closure
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initialValue; },
    value: () => count
  };
}

const counter = createCounter(10);
counter.increment();
counter.increment();
counter.decrement();
console.log("Counter value:", counter.value()); // 11

// 3. Private state with closures
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!
  
  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(30);
console.log("Balance:", account.getBalance()); // 120`,
                exercise: 'Create a `memoize` function that caches the results of a slow calculation to avoid recomputing the same inputs.',
                exerciseStarter: `// Exercise: Memoization with Closures
// A memoized function caches previous results

function memoize(fn) {
  const cache = {}; // Closure captures this cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      console.log("Cache hit for:", key);
      return cache[key];
    }
    console.log("Computing for:", key);
    // cache[key] = fn(...args);  // uncomment to store
    return fn(...args);
  };
}

// Slow function to memoize
function slowSquare(n) {
  return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(5));  // computes: 25
console.log(fastSquare(5));  // should be cached: 25
console.log(fastSquare(6));  // computes: 36
`,
            },
            {
                id: 'classes',
                title: 'Classes & Prototypes',
                description: 'Use classes and prototypal inheritance for object-oriented JavaScript.',
                xp: 75,
                estimatedMinutes: 18,
                content: `## Classes in JavaScript

JavaScript classes (ES6) provide a cleaner syntax for creating objects and handling inheritance.

### Class Syntax
\`\`\`js
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  
  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }
  
  static create(name, sound) {
    return new Animal(name, sound);
  }
}
\`\`\`

### Inheritance
\`\`\`js
class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");  // call parent constructor
    this.tricks = [];
  }
  
  learn(trick) {
    this.tricks.push(trick);
  }
}
\`\`\`

### Private Fields (ES2022)
\`\`\`js
class BankAccount {
  #balance = 0;  // private!
  
  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; }
}
\`\`\`

### Getters & Setters
\`\`\`js
class Circle {
  constructor(radius) { this.radius = radius; }
  get area() { return Math.PI * this.radius ** 2; }
  set diameter(d) { this.radius = d / 2; }
}
\`\`\`
`,
                codeExample: `// Classes — Object-Oriented JavaScript

class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  
  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }
  
  toString() {
    return \`Animal: \${this.name}\`;
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
    this.tricks = [];
  }
  
  learn(trick) {
    this.tricks.push(trick);
    return \`\${this.name} learned: \${trick}\`;
  }
  
  perform() {
    return \`\${this.name} knows: \${this.tricks.join(", ") || "nothing yet"}\`;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());
console.log(dog.learn("sit"));
console.log(dog.learn("roll over"));
console.log(dog.perform());

// Getters and Setters
class Temperature {
  constructor(celsius) { this._celsius = celsius; }
  get fahrenheit() { return this._celsius * 9/5 + 32; }
  get kelvin() { return this._celsius + 273.15; }
  set celsius(value) { this._celsius = value; }
}

const temp = new Temperature(100);
console.log(\`\${temp._celsius}°C = \${temp.fahrenheit}°F = \${temp.kelvin}K\`);`,
                exercise: 'Create a `Shape` base class with an `area` getter, then extend it with `Circle` and `Rectangle` classes.',
                exerciseStarter: `// Exercise: Shape Hierarchy

class Shape {
  constructor(name) {
    this.name = name;
  }
  
  get area() {
    return 0; // override in subclasses
  }
  
  describe() {
    return \`\${this.name} with area \${this.area.toFixed(2)}\`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super("Circle");
    this.radius = radius;
  }
  // Override the area getter
}

class Rectangle extends Shape {
  constructor(width, height) {
    super("Rectangle");
    // store width and height
  }
  // Override the area getter
}

const circle = new Circle(5);
const rect = new Rectangle(4, 6);

console.log(circle.describe()); // Circle with area 78.54
console.log(rect.describe());   // Rectangle with area 24.00
`,
            },
        ],
    },
    {
        id: 'modern-js',
        number: 9,
        title: 'Modern JavaScript (ES6+)',
        color: 'text-violet-400',
        icon: '✨',
        lessons: [
            {
                id: 'es6-features',
                title: 'ES6+ Essential Features',
                description: 'Master modern JavaScript syntax: spread, destructuring, template literals, and more.',
                xp: 65,
                estimatedMinutes: 18,
                content: `## Modern JavaScript (ES6+)

ES6 (2015) and later versions introduced many powerful features that define modern JavaScript.

### Template Literals
\`\`\`js
const name = "Alice";
const age = 30;
const msg = \`Hello, \${name}! You are \${age} years old.\`;
// Multi-line:
const html = \`
  <div>
    <h1>\${name}</h1>
  </div>\`;
\`\`\`

### Destructuring
\`\`\`js
// Array destructuring
const [first, , third] = [1, 2, 3];

// Object destructuring
const { name, age, city = "Unknown" } = user;

// Function parameter destructuring
function greet({ name, age }) { ... }
\`\`\`

### Spread & Rest Operators
\`\`\`js
// Spread: expand
const merged = [...arr1, ...arr2];
const updated = { ...obj, newProp: "value" };

// Rest: collect
function sum(...numbers) { }
const { a, ...rest } = obj;  // rest = everything except a
\`\`\`

### Optional Chaining (?.)
\`\`\`js
const city = user?.address?.city ?? "Unknown";
const first = arr?.[0];
const result = fn?.();
\`\`\`

### Nullish Coalescing (??)
\`\`\`js
const name = user.name ?? "Guest";  // only if null/undefined
const count = data.count ?? 0;
\`\`\`

### Short-Circuit Evaluation
\`\`\`js
const name = user && user.name;  // and
const defaultName = null || "Guest";  // or
\`\`\`
`,
                codeExample: `// Modern JavaScript Features

// Template Literals
const user = { name: "Ali", age: 28, role: "developer" };
console.log(\`👤 \${user.name} | Age: \${user.age} | Role: \${user.role}\`);

// Destructuring (arrays)
const [red, green, blue] = [255, 128, 0];
console.log(\`RGB: \${red}, \${green}, \${blue}\`);

// Destructuring (objects) with defaults
const { name, country = "Pakistan", skills = [] } = user;
console.log(\`\${name} from \${country}\`, skills);

// Spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2, 7, 8];
console.log("Combined:", combined);

// Object spread
const base = { theme: "dark", lang: "en" };
const config = { ...base, lang: "ur", debug: true };
console.log("Config:", config);

// Optional chaining + nullish coalescing
const data = null;
const value = data?.settings?.theme ?? "light";
console.log("Theme:", value); // "light"

// Computed property names
const key = "dynamicKey";
const obj = { [key]: "dynamic value", id: 1 };
console.log("Dynamic:", obj.dynamicKey);`,
                exercise: 'Use destructuring, spread, and optional chaining to safely merge and display user profile data.',
                exerciseStarter: `// Exercise: Modern JS Data Transformation

const apiResponse = {
  user: {
    id: 1,
    name: "Zara",
    profile: {
      bio: "Full stack developer",
      // social is missing (undefined)
    }
  }
};

// 1. Destructure name and bio from apiResponse
// Handle missing social safely with optional chaining (?.)

const { user: { name, profile: { bio, social } = {} } } = apiResponse;

// 2. Build a display object using spread
const defaults = { avatar: "default.png", followers: 0, verified: false };
// const displayUser = { ...defaults, ... };

// 3. Get Twitter handle safely (might not exist)
// const twitter = apiResponse.user.profile?.social?.twitter ?? "Not linked";

console.log("Name:", name);
console.log("Bio:", bio);
// console.log("Twitter:", twitter);
// console.log("Display:", displayUser);
`,
            },
        ],
    },
    {
        id: 'real-world',
        number: 10,
        title: 'JavaScript in the Real World',
        color: 'text-teal-400',
        icon: '🌍',
        lessons: [
            {
                id: 'apis-storage',
                title: 'APIs, Local Storage & Error Handling',
                description: 'Build real applications with Fetch API, Web Storage, and robust error handling.',
                xp: 80,
                estimatedMinutes: 22,
                content: `## JavaScript in Production

### Fetch API
The modern way to make HTTP requests:
\`\`\`js
async function getUser(id) {
  const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return response.json();
}
\`\`\`

### Local Storage
Persist data in the browser (survives page refresh):
\`\`\`js
// Save
localStorage.setItem("user", JSON.stringify({ name: "Alice" }));

// Read
const user = JSON.parse(localStorage.getItem("user"));

// Delete
localStorage.removeItem("user");
localStorage.clear(); // remove all
\`\`\`

### Session Storage
Like localStorage but clears when the tab closes:
\`\`\`js
sessionStorage.setItem("token", "abc123");
\`\`\`

### Error Handling
\`\`\`js
try {
  const data = JSON.parse(badJSON);
} catch (error) {
  console.error("Parse error:", error.message);
} finally {
  console.log("Always runs");
}

// Custom errors
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
\`\`\`

### Debugging Tips
- \`console.log()\` — basic output
- \`console.table()\` — display arrays/objects as table
- \`console.group()\` — group related logs
- \`console.time()\` — measure execution time
`,
                codeExample: `// Real World JavaScript

// 1. Error handling
function safeParse(jsonString) {
  try {
    return { data: JSON.parse(jsonString), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

const { data: user, error } = safeParse('{ "name": "Alice", "age": 30 }');
console.log("Parsed:", user);

const { data: bad, error: parseError } = safeParse("{ invalid }");
console.log("Error:", parseError);

// 2. Local Storage simulation (in browser, use localStorage)
const storage = {
  data: {},
  setItem(key, value) { this.data[key] = JSON.stringify(value); },
  getItem(key) {
    try { return JSON.parse(this.data[key] ?? "null"); }
    catch { return null; }
  },
  removeItem(key) { delete this.data[key]; }
};

storage.setItem("settings", { theme: "dark", lang: "en" });
const settings = storage.getItem("settings");
console.log("Stored settings:", settings);

// 3. Simulating fetch pattern
async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // const res = await fetch(url);
      // if (!res.ok) throw new Error("Request failed");
      // return res.json();
      
      // Simulation:
      if (attempt < 3) throw new Error("Network error (simulated)");
      return { success: true, data: { userId: 1 } };
    } catch (err) {
      console.log(\`Attempt \${attempt} failed: \${err.message}\`);
      if (attempt === retries) throw err;
    }
  }
}

fetchWithRetry("https://api.example.com/user")
  .then(r => console.log("Finally got:", r))
  .catch(e => console.error("All retries failed:", e.message));`,
                exercise: 'Build a simple key-value store class with get, set, delete, and getAll methods, plus automatic JSON serialization.',
                exerciseStarter: `// Exercise: Simple Key-Value Store
class Store {
  constructor(prefix = "app") {
    this.prefix = prefix;
    this._data = {};
  }
  
  _key(k) { return \`\${this.prefix}:\${k}\`; }
  
  set(key, value) {
    // Store value as JSON string
    this._data[this._key(key)] = JSON.stringify(value);
  }
  
  get(key) {
    // Return parsed value, or null if not found
    const raw = this._data[this._key(key)];
    // handle missing and parse here...
    return null;
  }
  
  delete(key) {
    delete this._data[this._key(key)];
  }
  
  getAll() {
    // Return all key-value pairs (parsed) as plain object
    return {};
  }
}

const store = new Store("myApp");
store.set("user", { name: "Alice", age: 30 });
store.set("theme", "dark");

console.log("User:", store.get("user"));
console.log("Theme:", store.get("theme"));
console.log("All:", store.getAll());
`,
            },
        ],
    },
    {
        id: 'modules',
        number: 11,
        title: 'Modules & Project Structure',
        color: 'text-indigo-400',
        icon: '📦',
        lessons: [
            {
                id: 'es-modules',
                title: 'ES Modules & Project Best Practices',
                description: 'Organize your JavaScript code using modules and best practices.',
                xp: 70,
                estimatedMinutes: 18,
                content: `## JavaScript Modules

Modules let you split code into separate files with clean, explicit imports and exports.

### Exporting
\`\`\`js
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { ... }  // default export
\`\`\`

### Importing
\`\`\`js
// main.js
import Calculator, { PI, add } from "./math.js";  // default + named
import * as MathLib from "./math.js";              // all exports
import { add as sum } from "./math.js";             // rename
\`\`\`

### Dynamic Import
\`\`\`js
// Load only when needed (code splitting)
const { heavyFunction } = await import("./heavy-module.js");
\`\`\`

### Project Structure Best Practices
\`\`\`
src/
  components/       UI components
  services/         API calls, business logic
  utils/            Helper functions
  constants/        App-wide constants
  hooks/            Custom React hooks
  types/            TypeScript types
\`\`\`

### Linting & Formatting
- ESLint — catch bugs and enforce code style
- Prettier — automatic code formatting
- TypeScript — static typing for safety

### Key Principles
- **DRY** (Don't Repeat Yourself)
- **Single Responsibility** — one concern per module
- **Separation of Concerns** — split UI, logic, data
- **Error Boundaries** — handle errors gracefully
`,
                codeExample: `// ES Modules Pattern (simulation)

// === utils/math.js ===
const mathUtils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
};

// === services/storage.js ===
const storageService = {
  save(key, data) {
    console.log(\`[Storage] Saved "\${key}"\`, data);
  },
  load(key) {
    console.log(\`[Storage] Loaded "\${key}"\`);
    return null;
  },
};

// === models/user.js ===
function createUser(name, email) {
  const created = new Date().toISOString();
  return { name, email, created, isActive: true };
}

// === main.js — using the modules ===
const { add, multiply, clamp } = mathUtils;

const user = createUser("Alice", "alice@example.com");
console.log("New user:", user);

storageService.save("current_user", user);

console.log("Math results:");
console.log("  5 + 3 =", add(5, 3));
console.log("  4 × 7 =", multiply(4, 7));
console.log("  clamp(150, 0, 100) =", clamp(150, 0, 100));`,
                exercise: 'Organize a mini e-commerce system into logically separated "modules" (user, cart, formatter) and compose them together.',
                exerciseStarter: `// Exercise: Mini E-Commerce Module System

// Module 1: User
const UserModule = {
  create(name, email) {
    return { name, email, id: Date.now() };
  },
  // Add a validate(user) method that checks name and email are non-empty
};

// Module 2: Cart
const CartModule = {
  create(userId) {
    return { userId, items: [], total: 0 };
  },
  addItem(cart, product, qty = 1) {
    // Add { product, qty } to cart.items
    // Update cart.total
    return cart;
  },
  // Add a removeItem(cart, productId) method
};

// Module 3: Formatter
const Formatter = {
  currency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  },
  // Add a summarizeCart(cart) method that returns a readable string
};

// --- Use the modules ---
const user = UserModule.create("Sara", "sara@example.com");
console.log("User:", user.name);

const cart = CartModule.create(user.id);
console.log("Cart:", cart);
`,
            },
        ],
    },
];

export default JS_CURRICULUM;
