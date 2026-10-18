/* ==========================================================================
   QUIZ DATA & QUESTION BANK
   3-5 Questions per Topic with In-Depth Explanations
   ========================================================================== */

export const QUIZZES_DATA = {
  variables: {
    topicId: "variables",
    title: "Variables Mastery Quiz",
    xpReward: 100,
    questions: [
      {
        id: "v1",
        question: "Which keyword should you use by default in modern JavaScript when declaring a variable that will NOT be reassigned?",
        options: [
          "var",
          "const",
          "let",
          "define"
        ],
        correctIndex: 1,
        explanation: "In modern JavaScript best practices, always use 'const' by default. Only use 'let' if you know the variable needs to be reassigned later. Avoid 'var' due to confusing scope behavior."
      },
      {
        id: "v2",
        question: "In our real-world analogy, what does 'const' represent?",
        options: [
          "An open cardboard box you can swap items in and out of",
          "A locked glass display case where the contents cannot be swapped",
          "A chalkboard that gets erased every hour",
          "A paper bag with a tear in the bottom"
        ],
        correctIndex: 1,
        explanation: "'const' represents a locked glass display case—once created and assigned a value, its identifier cannot be reassigned to a different value."
      },
      {
        id: "v3",
        question: "What will be the output of running this code?",
        codeSnippet: `let score = 10;
score = score + 5;
console.log(score);`,
        options: [
          "10",
          "15",
          "score + 5",
          "TypeError: Assignment to constant variable"
        ],
        correctIndex: 1,
        explanation: "Because 'score' is declared with 'let', it can be reassigned. 10 + 5 evaluates to 15, which is then stored into 'score'."
      },
      {
        id: "v4",
        question: "Which of the following variable names is INVALID in JavaScript?",
        options: [
          "studentAge",
          "_privateKey",
          "$totalAmount",
          "2ndPlaceWinner"
        ],
        correctIndex: 3,
        explanation: "JavaScript variable names cannot start with a number. They must start with a letter, an underscore (_), or a dollar sign ($)."
      }
    ]
  },

  datatypes: {
    topicId: "datatypes",
    title: "Data Types Mastery Quiz",
    xpReward: 100,
    questions: [
      {
        id: "d1",
        question: "What does the 'typeof' operator return for the value true?",
        options: [
          '"truthy"',
          '"boolean"',
          '"string"',
          '"number"'
        ],
        correctIndex: 1,
        explanation: "The typeof operator evaluates true and false as the primitive type 'boolean'."
      },
      {
        id: "d2",
        question: "What is the key difference between 'undefined' and 'null' in JavaScript?",
        options: [
          "'undefined' means an error occurred, while 'null' is a number",
          "'undefined' means a variable was declared but not given a value; 'null' is an intentional empty value",
          "They are 100% identical in every situation",
          "'null' is only used for strings"
        ],
        correctIndex: 1,
        explanation: "'undefined' is JavaScript's default for variables that have been created but not assigned. 'null' is an intentional value representing the absence of an object or value."
      },
      {
        id: "d3",
        question: "What will this code output to the console?",
        codeSnippet: `let a = "5";
let b = 10;
console.log(a + b);`,
        options: [
          "15",
          '"510"',
          "NaN",
          "Error"
        ],
        correctIndex: 1,
        explanation: "Because 'a' is a String (\"5\"), the '+' operator performs string concatenation rather than numeric addition, resulting in the string \"510\"."
      },
      {
        id: "d4",
        question: "Which of the following values is a Number data type in JavaScript?",
        options: [
          '"42"',
          "42",
          "'forty-two'",
          "true"
        ],
        correctIndex: 1,
        explanation: "The value 42 without quotes is a numeric literal. Wrapped in quotes, \"42\" becomes a String."
      }
    ]
  },

  functions: {
    topicId: "functions",
    title: "Functions Mastery Quiz",
    xpReward: 100,
    questions: [
      {
        id: "f1",
        question: "What keyword is used inside a function to deliver a result back to whoever called it?",
        options: [
          "output",
          "send",
          "return",
          "give"
        ],
        correctIndex: 2,
        explanation: "The 'return' keyword specifies the value to be passed back to the caller and immediately terminates execution of the function."
      },
      {
        id: "f2",
        question: "In the function definition 'function multiply(a, b)', what are 'a' and 'b' called?",
        options: [
          "Arguments",
          "Parameters",
          "Return items",
          "Operators"
        ],
        correctIndex: 1,
        explanation: "Parameters are the placeholder names defined in the function signature ('a' and 'b'). The real values passed when calling the function are arguments."
      },
      {
        id: "f3",
        question: "What is logged to the console by the following code snippet?",
        codeSnippet: `function double(num) {
  return num * 2;
}

let result = double(6);
console.log(result);`,
        options: [
          "6",
          "12",
          "undefined",
          "num * 2"
        ],
        correctIndex: 1,
        explanation: "Calling double(6) executes 6 * 2 which returns 12. That value is stored in 'result' and logged."
      },
      {
        id: "f4",
        question: "What happens if a JavaScript function finishes executing without a 'return' statement?",
        options: [
          "It throws a syntax error",
          "It automatically returns 0",
          "It returns 'undefined'",
          "It repeats from the beginning"
        ],
        correctIndex: 2,
        explanation: "By default, every JavaScript function that lacks an explicit return statement returns 'undefined'."
      }
    ]
  },

  arrays: {
    topicId: "arrays",
    title: "Arrays Mastery Quiz",
    xpReward: 100,
    questions: [
      {
        id: "a1",
        question: "What index represents the FIRST element in a JavaScript array?",
        options: [
          "0",
          "1",
          "-1",
          "first"
        ],
        correctIndex: 0,
        explanation: "JavaScript arrays are zero-indexed. The first item is always located at index [0]."
      },
      {
        id: "a2",
        question: "Which array method adds a new item to the END of an array?",
        options: [
          ".pop()",
          ".push()",
          ".append()",
          ".add()"
        ],
        correctIndex: 1,
        explanation: "The .push() method appends one or more elements to the end of an array and returns the new array length."
      },
      {
        id: "a3",
        question: "What is the output of this code?",
        codeSnippet: `let colors = ["Red", "Green", "Blue"];
colors.pop();
console.log(colors.length);`,
        options: [
          "3",
          "2",
          '"Blue"',
          "undefined"
        ],
        correctIndex: 1,
        explanation: "colors initially has 3 items. Calling colors.pop() removes the last element ('Blue'), leaving 2 items remaining. Therefore, colors.length is 2."
      },
      {
        id: "a4",
        question: "If an array named 'students' has 5 items, how do you access the last item?",
        options: [
          "students[5]",
          "students[students.length - 1]",
          "students.last",
          "students[4.5]"
        ],
        correctIndex: 1,
        explanation: "Since indexing starts at 0, an array with 5 items has indices 0, 1, 2, 3, and 4. The last item is at index (students.length - 1) = 4."
      }
    ]
  },

  objects: {
    topicId: "objects",
    title: "Objects Mastery Quiz",
    xpReward: 100,
    questions: [
      {
        id: "o1",
        question: "What are the two components of data inside a JavaScript object called?",
        options: [
          "Variables and Parameters",
          "Keys (or Properties) and Values",
          "Indexes and Lengths",
          "Rows and Columns"
        ],
        correctIndex: 1,
        explanation: "Objects store information in key-value pairs (e.g. { name: 'Alex' }), where 'name' is the key and 'Alex' is the value."
      },
      {
        id: "o2",
        question: "Given 'const user = { name: \"Alex\", age: 20 };', how do you access the user's age using dot notation?",
        options: [
          "user(age)",
          "user.age",
          "user->age",
          "user::age"
        ],
        correctIndex: 1,
        explanation: "Dot notation accesses object properties by writing the object name, followed by a dot, followed by the property key: user.age."
      },
      {
        id: "o3",
        question: "What will be printed to the console?",
        codeSnippet: `let hero = {
  name: "Knight",
  hp: 100
};
hero.hp = 80;
hero.shield = true;
console.log(hero.hp, hero.shield);`,
        options: [
          "100 false",
          "80 true",
          "undefined true",
          "Error: Cannot mutate object"
        ],
        correctIndex: 1,
        explanation: "hero.hp was updated to 80, and a new property hero.shield was added with value true. The console outputs '80 true'."
      },
      {
        id: "o4",
        question: "How do you access the city name in this nested object: 'let data = { user: { city: \"Tokyo\" } };'?",
        options: [
          "data.city",
          "data.user.city",
          "data[city]",
          "data->user->city"
        ],
        correctIndex: 1,
        explanation: "To navigate nested objects, chain property accessors together: data.user.city returns \"Tokyo\"."
      }
    ]
  },
  factories: {
    topicId: "factories",
    title: "Factory Patterns Mastery Quiz",
    xpReward: 150,
    questions: [
      {
        id: "f1",
        question: "What is the primary benefit of using a Factory Pattern?",
        options: [
          "It forces every object in an application to share the exact same state",
          "It decouples object creation logic from client code and encapsulates instantiation mechanics",
          "It eliminates the need to ever write functions in JavaScript",
          "It automatically saves all objects to local storage"
        ],
        correctIndex: 1,
        explanation: "Factories encapsulate creation logic so client code only asks for what it needs without worrying about constructors, subclasses, or initialization steps."
      },
      {
        id: "f2",
        question: "Which Factory variation uses a JavaScript object dictionary or Map to look up creators without large switch/if ladders?",
        options: [
          "Factory with Object Mapping / Lookup Table",
          "Abstract Factory",
          "Constructor Factory",
          "Prototype Factory"
        ],
        correctIndex: 0,
        explanation: "Factory with Object Mapping or Dictionary Lookup stores creators keyed by string (e.g. { video: () => ..., audio: () => ... }), making lookups clean and O(1)."
      },
      {
        id: "f3",
        question: "What will this Simple Factory function print?",
        codeSnippet: `function makeGreeter(lang) {
  return lang === "es" ? () => "¡Hola!" : () => "Hello!";
}
const greet = makeGreeter("es");
console.log(greet());`,
        options: [
          "Hello!",
          "¡Hola!",
          "undefined",
          "Error: greet is not a function"
        ],
        correctIndex: 1,
        explanation: "makeGreeter('es') returns the lambda function () => '¡Hola!', which prints '¡Hola!' when invoked."
      },
      {
        id: "f4",
        question: "Which pattern variation allows adding new product types at runtime without modifying the factory source code?",
        options: [
          "Factory with Registration",
          "Static Factory",
          "Function Factory with switch",
          "Object Literal Factory"
        ],
        correctIndex: 0,
        explanation: "Factory with Registration provides a register(type, constructor) method, adhering to the Open-Closed Principle (open for extension, closed for modification)."
      }
    ]
  },
  singletons: {
    topicId: "singletons",
    title: "Singleton Patterns Mastery Quiz",
    xpReward: 150,
    questions: [
      {
        id: "s1",
        question: "What is the core guarantee of a Singleton Pattern?",
        options: [
          "Every function must accept only one single parameter",
          "Only one single instance of a class/resource exists across the application lifecycle",
          "It converts all asynchronous operations into single synchronous steps",
          "It creates a separate instance for every single user thread"
        ],
        correctIndex: 1,
        explanation: "A Singleton guarantees that a class or resource has exactly one instance, and provides a global access point to that single instance."
      },
      {
        id: "s2",
        question: "In modern JavaScript (ES Modules), what is the most idiomatic way to achieve a Module Singleton?",
        options: [
          "Exporting a single instantiated object (e.g. export default new MyService())",
          "Putting every variable directly on window without modules",
          "Using eval() to prevent recreation",
          "Wrapping everything inside a while(true) loop"
        ],
        correctIndex: 0,
        explanation: "Because ES modules are evaluated once and cached by the JavaScript runtime, exporting an instantiated class or object creates a clean, built-in Singleton."
      },
      {
        id: "s3",
        question: "What is the expected output when comparing instances from a classic Static Method Singleton?",
        codeSnippet: `class Cache {
  static #inst = null;
  static getInstance() {
    if (!this.#inst) this.#inst = new Cache();
    return this.#inst;
  }
}
const a = Cache.getInstance();
const b = Cache.getInstance();
console.log(a === b);`,
        options: [
          "false",
          "true",
          "undefined",
          "ReferenceError"
        ],
        correctIndex: 1,
        explanation: "Both calls return the exact same in-memory object reference stored in the private static field #inst, so a === b evaluates to true."
      },
      {
        id: "s4",
        question: "What does Object.freeze() provide when creating a Frozen Object Singleton?",
        options: [
          "It makes the object immutable by preventing addition, deletion, or modification of properties",
          "It stores the object in the browser's IndexedDB permanently",
          "It pauses code execution until all properties have loaded",
          "It encrypts the object values using AES-256"
        ],
        correctIndex: 0,
        explanation: "Object.freeze() seals the object and makes all properties read-only, preventing tampering or accidental modification across modules."
      }
    ]
  }
};

if (typeof window !== "undefined") {
  window.QUIZZES_DATA = QUIZZES_DATA;
}

export default QUIZZES_DATA;
