import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LanguageTopic from '../models/LanguageTopic.js';
dotenv.config();

const languages = [
  {
    language: 'javascript',
    topics: [
      { order: 1, title: 'Introduction to JavaScript', slug: 'intro-to-js', category: 'Basics', description: 'What is JavaScript and how does it work?', content: '# Introduction to JavaScript\n\nJavaScript is the programming language of the web. It allows you to implement complex features on web pages, such as interactive maps, animated graphics, and much more.\n\n```javascript\nconsole.log("Hello, World!");\n```', expectedTime: 10, points: 10, defaultCode: 'console.log("Hello, JavaScript!");\n' },
      { order: 2, title: 'Variables & Data Types', slug: 'js-variables', category: 'Basics', description: 'Learn how to store data in JavaScript', content: '# Variables & Data Types\n\nVariables are containers for storing data values. In JS, we use `var`, `let`, and `const`.\n\n```javascript\nlet name = "Alice";\nconst age = 25;\n```', expectedTime: 15, points: 20, defaultCode: 'let name = "CodeMate";\nconsole.log(name);\n' },
    ]
  },
  {
    language: 'python',
    topics: [
      { order: 1, title: 'Python Basics', slug: 'python-basics', category: 'Basics', description: 'Get started with Python syntax', content: '# Python Basics\n\nPython is known for its clean syntax and readability.\n\n```python\nprint("Hello, Python!")\n```', expectedTime: 10, points: 10, defaultCode: 'print("Hello, Python!")\n' },
      { order: 2, title: 'Lists & Dictionaries', slug: 'python-data-structures', category: 'Data Structures', description: 'Python fundamental data structures', content: '# Lists & Dictionaries\n\nLists are ordered, dictionaries are key-value pairs.\n\n```python\nmy_list = [1, 2, 3]\nmy_dict = {"name": "Bot"}\n```', expectedTime: 20, points: 30, defaultCode: 'my_list = [1, 2, 3]\nprint(my_list)\n' },
    ]
  },
  {
    language: 'cpp',
    topics: [
      { order: 1, title: 'C++ Basics', slug: 'cpp-basics', category: 'Basics', description: 'Hello world in C++', content: '# C++ Basics\n\nC++ is a high-performance compiled language.\n\n```cpp\n#include <iostream>\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}\n```', expectedTime: 15, points: 15, defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, CodeMate!" << std::endl;\n    return 0;\n}\n' },
      { order: 2, title: 'Pointers', slug: 'cpp-pointers', category: 'Memory Management', description: 'Understanding memory addresses', content: '# Pointers\n\nPointers store memory addresses of variables.\n\n```cpp\nint myVar = 10;\nint* ptr = &myVar;\n```', expectedTime: 30, points: 50, defaultCode: 'int myAge = 25;\nint* ptr = &myAge;\n// Print the pointer\n' },
    ]
  },
  {
    language: 'java',
    topics: [
      { order: 1, title: 'Java Introduction', slug: 'java-intro', category: 'Basics', description: 'Understanding classes and main method', content: '# Java Intro\n\nJava is object-oriented.\n\n```java\nclass Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}\n```', expectedTime: 15, points: 15, defaultCode: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n' },
    ]
  }
];

const seedLanguages = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.DBURI);
        console.log('Connected.');

        console.log('Clearing existing LanguageTopics...');
        await LanguageTopic.deleteMany({});
        
        console.log('Seeding new curriculum...');
        for (const lang of languages) {
            for (const topic of lang.topics) {
                await LanguageTopic.create({
                    language: lang.language,
                    title: topic.title,
                    slug: topic.slug,
                    category: topic.category,
                    description: topic.description,
                    content: topic.content,
                    order: topic.order,
                    estimatedTime: topic.expectedTime,
                    pointsReward: topic.points,
                    defaultCode: topic.defaultCode,
                    unlocked: topic.order === 1
                });
            }
        }

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedLanguages();
