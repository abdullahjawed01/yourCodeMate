import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LanguageTopic from './models/LanguageTopic.js';
import CodingTest from './models/CodingTest.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const languages = [
  {
    id: 'python',
    topics: [
      {
        title: "Python Basics", slug: "python-basics", category: "basics",
        description: "Introduction to Python variables and printing.",
        content: `
# Python Basics

Python is a popular programming language created by Guido van Rossum.

## Printing
To print something to the console, use the \`print()\` function.

\`\`\`python
print("Hello, World!")
\`\`\`

## Variables
You don't need to declare types.
\`\`\`python
x = 5
y = "John"
print(x)
print(y)
\`\`\`
`,
        testTitle: "Python First Step", testCases: [{ input: "", output: "Hello World", hidden: false }],
        codeTemplate: `print("Hello World")\n`
      },
      {
        title: "Python Data Types", slug: "python-data-types", category: "basics",
        description: "Learn about Python strings, ints, floats, and lists.",
        content: `
# Python Data Types

Built-in Data Types:
- Text: \`str\`
- Numeric: \`int\`, \`float\`, \`complex\`
- Sequence: \`list\`, \`tuple\`, \`range\`
- Mapping: \`dict\`

\`\`\`python
x = "Hello World" # str
y = 20           # int
z = [1, 2, 3]    # list
\`\`\`
`,
        testTitle: "Python Type Master", testCases: [{ input: "", output: "str int list", hidden: false }],
        codeTemplate: `x = "Hello"\ny = 5\nz = []\nprint(type(x).__name__, type(y).__name__, type(z).__name__)\n`
      },
      {
        title: "Python Functions", slug: "python-functions", category: "basics",
        description: "Define and call functions in Python using def.",
        content: `
# Python Functions

A function is a block of code which only runs when it is called.

\`\`\`python
def my_function(fname):
  print(fname + " Refsnes")

my_function("Emil")
\`\`\`
`,
        testTitle: "Python Function Adder", testCases: [{ input: "", output: "8", hidden: false }],
        codeTemplate: `def add(a, b):\n    print(a + b)\n\nadd(3, 5)\n`
      },
      {
        title: "Python Lists & Loops", slug: "python-lists", category: "intermediate",
        description: "Iterate over collections of data.",
        content: `
# Lists and For Loops

A \`for\` loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
  print(x)
\`\`\`
`,
        testTitle: "Python Loop Printer", testCases: [{ input: "", output: "apple\nbanana", hidden: false }],
        codeTemplate: `fruits = ["apple", "banana"]\nfor f in fruits:\n    print(f)\n`
      },
      {
        title: "Python Dictionaries", slug: "python-dicts", category: "intermediate",
        description: "Key-value pair data structures.",
        content: `
# Dictionaries

Dictionaries are used to store data values in key:value pairs.
A dictionary is a collection which is ordered, changeable and do not allow duplicates.

\`\`\`python
thisdict = {
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
print(thisdict)
\`\`\`
`,
        testTitle: "Python Dict Reader", testCases: [{ input: "", output: "Ford", hidden: false }],
        codeTemplate: `car = {"brand": "Ford", "year": 2020}\nprint(car["brand"])\n`
      }
    ]
  },
  {
    id: 'typescript',
    topics: [
      {
        title: "TypeScript Basics", slug: "ts-basics", category: "basics",
        description: "Introduction to static typing in JS.",
        content: `
# TypeScript Basics

TypeScript is JavaScript with syntax for types.

## Type Annotations
\`\`\`typescript
let isDone: boolean = false;
let lines: number = 42;
let name: string = "Anders";
\`\`\`
`,
        testTitle: "TS Types", testCases: [{ input: "", output: "false 42", hidden: false }],
        codeTemplate: `let isDone: boolean = false;\nlet lines: number = 42;\nconsole.log(isDone, lines);\n`
      },
      {
        title: "TypeScript Interfaces", slug: "ts-interfaces", category: "intermediate",
        description: "Defining object shapes.",
        content: `
# Interfaces

Interfaces are used to shape objects.

\`\`\`typescript
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Hayes",
  id: 0,
};
\`\`\`
`,
        testTitle: "TS Objects", testCases: [{ input: "", output: "Hayes", hidden: false }],
        codeTemplate: `interface User { name: string }\nconst u: User = { name: "Hayes" };\nconsole.log(u.name);\n`
      },
      {
        title: "TypeScript Classes", slug: "ts-classes", category: "intermediate",
        description: "Object-oriented programming in TS.",
        content: `
# Classes

TypeScript adds type annotations to ES6 classes.

\`\`\`typescript
class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
\`\`\`
`,
        testTitle: "TS OOP", testCases: [{ input: "", output: "Murphy", hidden: false }],
        codeTemplate: `class User { name: string; constructor(name:string) { this.name = name; } }\nlet u = new User("Murphy");\nconsole.log(u.name);\n`
      },
      {
        title: "TypeScript Generics", slug: "ts-generics", category: "advanced",
        description: "Reusable components with type assertions.",
        content: `
# Generics

Generics provide variables to types.

\`\`\`typescript
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
\`\`\`
`,
        testTitle: "TS Generic Array", testCases: [{ input: "", output: "1", hidden: false }],
        codeTemplate: `let arr: Array<number> = [1, 2];\nconsole.log(arr[0]);\n`
      },
      {
        title: "TypeScript Enums", slug: "ts-enums", category: "advanced",
        description: "Describing a value which could be one of a set of possible named constants.",
        content: `
# Enums

Enums allow a developer to define a set of named constants.

\`\`\`typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
\`\`\`
`,
        testTitle: "TS Enum Values", testCases: [{ input: "", output: "1", hidden: false }],
        codeTemplate: `enum Direction { Up = 1 }\nconsole.log(Direction.Up);\n`
      }
    ]
  },
  {
    id: 'java',
    topics: [
      {
        title: "Java Basics", slug: "java-basics", category: "basics",
        description: "Introduction to Java syntax.",
        content: `
# Java Basics

Every line of code that runs in Java must be inside a \`class\`.

\`\`\`java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}
\`\`\`
`,
        testTitle: "Java Hello", testCases: [{ input: "", output: "Hello World", hidden: false }],
        codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}\n`
      },
      {
        title: "Java Variables", slug: "java-variables", category: "basics",
        description: "Strong typing in Java.",
        content: `
# Variables

Java variables must be declared with their type.

\`\`\`java
String name = "John";
int myNum = 15;
float myFloatNum = 5.99f;
char myLetter = 'D';
boolean myBool = true;
\`\`\`
`,
        testTitle: "Java Types", testCases: [{ input: "", output: "15", hidden: false }],
        codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    int num = 15;\n    System.out.println(num);\n  }\n}\n`
      },
      {
        title: "Java Conditionals", slug: "java-if-else", category: "intermediate",
        description: "If, Else, and Else If statements.",
        content: `
# If...Else

Java uses standard logical conditions from math.

\`\`\`java
int time = 20;
if (time < 18) {
  System.out.println("Good day.");
} else {
  System.out.println("Good evening.");
}
\`\`\`
`,
        testTitle: "Java Conditional", testCases: [{ input: "", output: "Yes", hidden: false }],
        codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    if (10 > 5) System.out.println("Yes");\n  }\n}\n`
      },
      {
        title: "Java Loops", slug: "java-loops", category: "intermediate",
        description: "While and For loops.",
        content: `
# While Loop

Loops can execute a block of code as long as a specified condition is reached.

\`\`\`java
int i = 0;
while (i < 5) {
  System.out.println(i);
  i++;
}
\`\`\`
`,
        testTitle: "Java Counter", testCases: [{ input: "", output: "0", hidden: false }],
        codeTemplate: `public class Main {\n  public static void main(String[] args) {\n    for(int i=0; i<1; i++) System.out.println(i);\n  }\n}\n`
      },
      {
        title: "Java OOP", slug: "java-oop", category: "advanced",
        description: "Classes and Objects.",
        content: `
# Java Classes/Objects

Java is an object-oriented programming language.
Everything in Java is associated with classes and objects.

\`\`\`java
public class MyClass {
  int x = 5;

  public static void main(String[] args) {
    MyClass myObj = new MyClass();
    System.out.println(myObj.x);
  }
}
\`\`\`
`,
        testTitle: "Java Object", testCases: [{ input: "", output: "5", hidden: false }],
        codeTemplate: `public class Main {\n  int x = 5;\n  public static void main(String[] args) {\n    Main obj = new Main();\n    System.out.println(obj.x);\n  }\n}\n`
      }
    ]
  },
  {
    id: 'cpp',
    topics: [
      {
        title: "C++ Basics", slug: "cpp-basics", category: "basics",
        description: "Introduction to C++ syntax and output.",
        content: `
# C++ Basics

C++ is a cross-platform language that can be used to create high-performance applications.

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}
\`\`\`
`,
        testTitle: "C++ Hello", testCases: [{ input: "", output: "Hello World", hidden: false }],
        codeTemplate: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World";\n  return 0;\n}\n`
      },
      {
        title: "C++ Variables", slug: "cpp-variables", category: "basics",
        description: "Data types in C++.",
        content: `
# Variables

\`\`\`cpp
int myNum = 5;               // Integer (whole number)
float myFloatNum = 5.99;     // Floating point number
double myDoubleNum = 9.98;   // Floating point number
char myLetter = 'D';         // Character
bool myBoolean = true;       // Boolean
string myText = "Hello";     // String
\`\`\`
`,
        testTitle: "C++ Types", testCases: [{ input: "", output: "5", hidden: false }],
        codeTemplate: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int num = 5;\n  cout << num;\n  return 0;\n}\n`
      },
      {
        title: "C++ Pointers", slug: "cpp-pointers", category: "advanced",
        description: "Memory addresses and pointers.",
        content: `
# Pointers

A pointer is a variable that stores the memory address as its value.

\`\`\`cpp
string food = "Pizza";  // A food variable of type string
string* ptr = &food;    // A pointer variable, with the name ptr, that stores the address of food

cout << food << "\\n";
cout << &food << "\\n";
cout << ptr << "\\n";
\`\`\`
`,
        testTitle: "C++ Pointer Value", testCases: [{ input: "", output: "Pizza", hidden: false }],
        codeTemplate: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string food = "Pizza";\n  string* ptr = &food;\n  cout << *ptr;\n  return 0;\n}\n`
      },
      {
        title: "C++ Functions", slug: "cpp-functions", category: "intermediate",
        description: "Creating blocks of code.",
        content: `
# Functions

A function is a block of code which only runs when it is called.

\`\`\`cpp
void myFunction() {
  cout << "I just got executed!";
}

int main() {
  myFunction();
  return 0;
}
\`\`\`
`,
        testTitle: "C++ Call Function", testCases: [{ input: "", output: "Yes", hidden: false }],
        codeTemplate: `#include <iostream>\nusing namespace std;\n\nvoid printYes() { cout << "Yes"; }\nint main() { printYes(); return 0; }\n`
      },
      {
        title: "C++ Classes", slug: "cpp-classes", category: "advanced",
        description: "OOP in C++.",
        content: `
# Classes/Objects

C++ is an object-oriented programming language.

\`\`\`cpp
class MyClass {       // The class
  public:             // Access specifier
    int myNum;        // Attribute (int variable)
    string myString;  // Attribute (string variable)
};

int main() {
  MyClass myObj;  // Create an object of MyClass
  myObj.myNum = 15;
  cout << myObj.myNum;
  return 0;
}
\`\`\`
`,
        testTitle: "C++ Object", testCases: [{ input: "", output: "15", hidden: false }],
        codeTemplate: `#include <iostream>\nusing namespace std;\nclass MyClass { public: int num; };\nint main() { MyClass obj; obj.num = 15; cout << obj.num; return 0; }\n`
      }
    ]
  },
  {
    id: 'rust',
    topics: [
      {
        title: "Rust Basics", slug: "rust-basics", category: "basics",
        description: "A language empowering everyone to build reliable and efficient software.",
        content: `
# Hello, World!

The standard first program in Rust.

\`\`\`rust
fn main() {
    println!("Hello, world!");
}
\`\`\`
`,
        testTitle: "Rust Printer", testCases: [{ input: "", output: "Hello, world!", hidden: false }],
        codeTemplate: `fn main() {\n    println!("Hello, world!");\n}\n`
      },
      {
        title: "Rust Variables", slug: "rust-variables", category: "basics",
        description: "Variables are immutable by default.",
        content: `
# Variables and Mutability

By default variables are immutable.

\`\`\`rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}
\`\`\`
`,
        testTitle: "Rust Mutability", testCases: [{ input: "", output: "6", hidden: false }],
        codeTemplate: `fn main() {\n    let mut x = 5;\n    x = 6;\n    print!("{}", x);\n}\n`
      },
      {
        title: "Rust Functions", slug: "rust-functions", category: "intermediate",
        description: "Functions map arguments to return values.",
        content: `
# Functions

Functions are prevalent in Rust code.

\`\`\`rust
fn main() {
    println!("Hello, world!");
    another_function();
}

fn another_function() {
    println!("Another function.");
}
\`\`\`
`,
        testTitle: "Rust Call", testCases: [{ input: "", output: "2", hidden: false }],
        codeTemplate: `fn get_two() -> i32 { 2 }\nfn main() { print!("{}", get_two()); }\n`
      },
      {
        title: "Rust Borrowing", slug: "rust-borrowing", category: "advanced",
        description: "References and Borrowing.",
        content: `
# References and Borrowing

We can provide a reference to the string value.

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
\`\`\`
`,
        testTitle: "Rust Reference", testCases: [{ input: "", output: "5", hidden: false }],
        codeTemplate: `fn get_len(s: &String) -> usize { s.len() }\nfn main() {\n  let s = String::from("hello");\n  print!("{}", get_len(&s));\n}\n`
      },
      {
        title: "Rust Structs", slug: "rust-structs", category: "advanced",
        description: "Custom data types.",
        content: `
# Structs

A struct, or structure, is a custom data type that lets you name and package together multiple related values.

\`\`\`rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
\`\`\`
`,
        testTitle: "Rust Struct Instantiation", testCases: [{ input: "", output: "1", hidden: false }],
        codeTemplate: `struct Point { x: i32, y: i32 }\nfn main() {\n  let p = Point { x: 1, y: 2 };\n  print!("{}", p.x);\n}\n`
      }
    ]
  },
  {
    id: 'ruby',
    topics: [
      {
        title: "Ruby Basics", slug: "ruby-basics", category: "basics",
        description: "A dynamic, open source programming language with a focus on simplicity.",
        content: `
# Ruby Basics

Ruby is an elegant language.

\`\`\`ruby
puts "Hello World!"
\`\`\`
`,
        testTitle: "Ruby Puts", testCases: [{ input: "", output: "Hello World!", hidden: false }],
        codeTemplate: `print "Hello World!"\n`
      },
      {
        title: "Ruby Types", slug: "ruby-types", category: "basics",
        description: "Data types in Ruby.",
        content: `
# Data Types

In Ruby, everything is an object.

\`\`\`ruby
a = 1
b = 2.0
c = "Hello"
d = true
\`\`\`
`,
        testTitle: "Ruby String", testCases: [{ input: "", output: "Hello", hidden: false }],
        codeTemplate: `x = "Hello"\nprint x\n`
      },
      {
        title: "Ruby Methods", slug: "ruby-methods", category: "intermediate",
        description: "Defining methods in Ruby.",
        content: `
# Methods

Methods are defined using the \`def\` keyword.

\`\`\`ruby
def simple
  puts "simple"
end
\`\`\`
`,
        testTitle: "Ruby Method Return", testCases: [{ input: "", output: "5", hidden: false }],
        codeTemplate: `def get_five\n  5\nend\nprint get_five\n`
      },
      {
        title: "Ruby Blocks", slug: "ruby-blocks", category: "advanced",
        description: "Blocks, Procs, and Lambdas.",
        content: `
# Blocks

Blocks are chunks of code that can be passed to methods.

\`\`\`ruby
5.times do
  puts "Hello"
end
\`\`\`
`,
        testTitle: "Ruby Times", testCases: [{ input: "", output: "111", hidden: false }],
        codeTemplate: `3.times { print 1 }\n`
      },
      {
        title: "Ruby Classes", slug: "ruby-classes", category: "advanced",
        description: "Object-oriented Ruby.",
        content: `
# Classes

\`\`\`ruby
class Customer
  def initialize(id, name)
    @cust_id = id
    @cust_name = name
  end
end
\`\`\`
`,
        testTitle: "Ruby Class Getter", testCases: [{ input: "", output: "John", hidden: false }],
        codeTemplate: `class User\n  attr_accessor :name\n  def initialize(name)\n    @name = name\n  end\nend\nu = User.new("John")\nprint u.name\n`
      }
    ]
  },
  {
    id: 'swift',
    topics: [
      {
        title: "Swift Basics", slug: "swift-basics", category: "basics",
        description: "The powerful programming language for iOS.",
        content: `
# Swift Basics

Swift is a fantastic way to write software.

\`\`\`swift
print("Hello, world!")
\`\`\`
`,
        testTitle: "Swift Print", testCases: [{ input: "", output: "Hello, world!", hidden: false }],
        codeTemplate: `print("Hello, world!", terminator: "")\n`
      },
      {
        title: "Swift Variables", slug: "swift-variables", category: "basics",
        description: "Var and Let.",
        content: `
# Variables and Constants

Use \`let\` to make a constant and \`var\` to make a variable.

\`\`\`swift
var myVariable = 42
myVariable = 50
let myConstant = 42
\`\`\`
`,
        testTitle: "Swift Let", testCases: [{ input: "", output: "42", hidden: false }],
        codeTemplate: `let x = 42\nprint(x, terminator: "")\n`
      },
      {
        title: "Swift Control Flow", slug: "swift-control", category: "intermediate",
        description: "If, switch, for-in.",
        content: `
# Control Flow

Use \`if\` and \`switch\` to make conditionals.

\`\`\`swift
let scores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in scores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore += 1
    }
}
\`\`\`
`,
        testTitle: "Swift Loop", testCases: [{ input: "", output: "12", hidden: false }],
        codeTemplate: `for i in 1...2 { print(i, terminator: "") }\n`
      },
      {
        title: "Swift Functions", slug: "swift-functions", category: "intermediate",
        description: "Declaring functions.",
        content: `
# Functions and Closures

Use \`func\` to declare a function.

\`\`\`swift
func greet(person: String, day: String) -> String {
    return "Hello \\(person), today is \\(day)."
}
\`\`\`
`,
        testTitle: "Swift Func", testCases: [{ input: "", output: "5", hidden: false }],
        codeTemplate: `func five() -> Int { return 5 }\nprint(five(), terminator: "")\n`
      },
      {
        title: "Swift Classes", slug: "swift-classes", category: "advanced",
        description: "Objects and Classes.",
        content: `
# Objects and Classes

Use \`class\` followed by the class's name to create a class.

\`\`\`swift
class Shape {
    var numberOfSides = 0
    func simpleDescription() -> String {
        return "A shape with \\(numberOfSides) sides."
    }
}
\`\`\`
`,
        testTitle: "Swift Class", testCases: [{ input: "", output: "3", hidden: false }],
        codeTemplate: `class Shape { var sides = 3 }\nlet s = Shape()\nprint(s.sides, terminator: "")\n`
      }
    ]
  }
];

const seedLanguages = async () => {
  try {
    await mongoose.connect(process.env.DBURI);
    console.log('Connected to DB');

    for (const lang of languages) {
      let order = 1;

      // Seed topics for each language
      for (const item of lang.topics) {
        // Create the test first
        const test = await CodingTest.create({
          title: item.testTitle,
          description: item.description,
          difficulty: 'easy',
          category: lang.id,
          tags: [lang.id, item.category],
          testCases: item.testCases,
          maxScore: 100,
          passScore: 50,
          timeLimit: 30,
          memoryLimit: 512,
          unlockLevel: 1,
          codeTemplate: item.codeTemplate
        });

        console.log(`Created test: ${item.testTitle} for ${lang.id}`);

        // Create the topic
        await LanguageTopic.findOneAndUpdate(
          { language: lang.id, slug: item.slug },
          {
            language: lang.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            content: item.content,
            order: order,
            category: item.category,
            pointsReward: order * 10,
            estimatedTime: 10 + (order * 5),
            testId: test._id,
            prerequisites: order > 1 ? [lang.topics[order - 2].slug] : []
          },
          { upsert: true, new: true }
        );
        console.log(`Upserted topic: ${item.title} for ${lang.id}`);
        order++;
      }
    }

    console.log('Language seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedLanguages();
