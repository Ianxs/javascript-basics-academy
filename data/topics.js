/* ==========================================================================
   CURRICULUM TOPIC DATA (Strictly JavaScript Basics)
   ========================================================================== */

export const TOPICS_DATA = [
  {
    id: "variables",
    number: "01",
    title: "JavaScript Variables",
    subtitle: "Storing and managing data values in computer memory",
    badge: "Basics #1",
    estimatedTime: "8 mins",
    icon: "📦",
    
    definition: "Variables are named containers used to store data values in JavaScript. Think of declaring a variable as reserving a labeled space in computer memory where you can keep numbers, text, or any other information for your program to use later.",

    analogy: {
      title: "The Labeled Storage Box Analogy",
      subtitle: "How computer memory stores and updates information",
      icon: "📦",
      description: "Imagine having a storage room full of physical boxes. You write a label on the outside of a box (the variable name) and place an item inside (the stored value).",
      items: [
        {
          label: "let (Standard Box)",
          desc: "A box with an open lid. You can take out the contents and put something new inside anytime (e.g., updating a game score)."
        },
        {
          label: "const (Sealed Lockbox)",
          desc: "A locked glass display case. Once you put an item inside and lock it, you cannot replace the item with a completely different one (e.g., your birthday or Pi value)."
        },
        {
          label: "var (Old Vintage Box)",
          desc: "The original way JavaScript declared variables before modern standards. Avoid using it in modern code because it has confusing scope rules."
        }
      ]
    },

    sections: [
      {
        title: "1. Declaring vs. Assigning Variables",
        content: `
          <p>In JavaScript, creating a variable involves two key concepts:</p>
          <ul>
            <li><strong>Declaration:</strong> Telling JavaScript that a variable exists using a keyword (<code>let</code>, <code>const</code>, or <code>var</code>).</li>
            <li><strong>Assignment:</strong> Storing a value into that variable using the assignment operator (<code>=</code>).</li>
          </ul>
          <p>You can declare and assign a variable in a single line, which is standard practice:</p>
        `,
        codeExample: `// 1. Declare and Assign in one step
let studentName = "Alex";
const maxScore = 100;

// 2. Re-assigning a 'let' variable
studentName = "Jordan"; // Perfectly valid!

// 3. Trying to re-assign a 'const' variable will cause an error
// maxScore = 150; // TypeError: Assignment to constant variable`
      },
      {
        title: "2. The Key Differences: let vs const vs var",
        content: `
          <p>Always follow this modern JavaScript best practice: <strong>Use <code>const</code> by default</strong>, and only use <code>let</code> when you know the variable's value will change later. Never use <code>var</code>.</p>
        `,
        table: {
          headers: ["Keyword", "Can be Reassigned?", "Can be Redeclared?", "Scope"],
          rows: [
            ["const", "❌ No (Immutable binding)", "❌ No", "Block Scope { }"],
            ["let", "✅ Yes", "❌ No", "Block Scope { }"],
            ["var", "✅ Yes (Legacy)", "✅ Yes (Causes bugs)", "Function / Global"]
          ]
        }
      },
      {
        title: "3. Variable Naming Rules & Best Practices",
        content: `
          <p>When naming variables in JavaScript, keep these fundamental rules in mind:</p>
          <ul>
            <li>Names must begin with a letter, underscore (<code>_</code>), or dollar sign (<code>$</code>). They <strong>cannot start with a number</strong>.</li>
            <li>Variable names are <strong>case-sensitive</strong> (<code>myScore</code> and <code>myscore</code> are two completely different variables).</li>
            <li>Use <strong>camelCase</strong> for variable names (e.g., <code>totalPrice</code>, <code>isUserLoggedIn</code>, <code>studentGrade</code>).</li>
            <li>JavaScript reserved keywords (like <code>let</code>, <code>class</code>, <code>function</code>, <code>return</code>) cannot be used as variable names.</li>
          </ul>
        `
      }
    ],

    keyTakeaways: [
      "Use `const` for values that should not change throughout your program.",
      "Use `let` for variables that will be reassigned (like loop counters and scores).",
      "The `=` sign is for assignment, not mathematical equality."
    ],

    starterCode: `// 📦 Topic 1: Variables Practice
// Try editing the values below and click "Run Code" (or press Ctrl+Enter)

let playerName = "CodeMaster";
let playerLevel = 1;
const maxHealth = 100;

console.log("Welcome player:", playerName);
console.log("Starting Level:", playerLevel);
console.log("Max Health:", maxHealth);

// Leveling up the player!
playerLevel = playerLevel + 1;
console.log("🎉 Level Up! New Level:", playerLevel);

// Try changing playerName to your own name above and re-running!`
  },

  {
    id: "datatypes",
    number: "02",
    title: "JavaScript Data Types",
    subtitle: "Understanding primitive values and data representations",
    badge: "Basics #2",
    estimatedTime: "10 mins",
    icon: "🏷️",

    definition: "Data types define the kind of value a variable can hold in JavaScript. JavaScript is a dynamically-typed language, meaning variables do not need their data types explicitly declared, and types can be checked using the built-in typeof operator.",

    analogy: {
      title: "The Specialized Item Container Analogy",
      subtitle: "Different kinds of information require different formats",
      icon: "🏷️",
      description: "Think of data types like items in your backpack:",
      items: [
        {
          label: "String (A Letter / Text)",
          desc: "Words and sentences wrapped in quotes (e.g. \"Hello World\"). Like a written note on a piece of paper."
        },
        {
          label: "Number (A Calculator Value)",
          desc: "Numeric values, including whole integers (42) and decimals (3.14). No quotes needed."
        },
        {
          label: "Boolean (A Light Switch)",
          desc: "Only two possible values: true (ON) or false (OFF). Used for conditions and logic."
        },
        {
          label: "Undefined vs Null",
          desc: "Undefined = An unassigned box (created but not filled yet). Null = An explicitly empty box (intentional emptiness)."
        }
      ]
    },

    sections: [
      {
        title: "1. The 5 Core Primitive Data Types",
        content: `
          <p>In basic JavaScript, you will work with 5 primary primitive data types:</p>
        `,
        table: {
          headers: ["Data Type", "Description", "Example Value", "typeof Output"],
          rows: [
            ["String", "Text data enclosed in quotes", '"JavaScript"', '"string"'],
            ["Number", "Integers and floating-point decimals", "42 or 3.14", '"number"'],
            ["Boolean", "Logical true or false value", "true or false", '"boolean"'],
            ["Undefined", "A variable declared but not assigned a value", "let x;", '"undefined"'],
            ["Null", "An intentional representation of no value", "let y = null;", '"object" (legacy JS quirk)']
          ]
        }
      },
      {
        title: "2. The typeof Operator",
        content: `
          <p>You can inspect the type of any variable or expression using the <code>typeof</code> keyword:</p>
        `,
        codeExample: `let courseTitle = "Intro to JavaScript";
let totalLessons = 5;
let isEnrolled = true;
let certificate; // not assigned
let completedDate = null;

console.log(typeof courseTitle);   // "string"
console.log(typeof totalLessons);  // "number"
console.log(typeof isEnrolled);    // "boolean"
console.log(typeof certificate);   // "undefined"
console.log(typeof completedDate); // "object" (historic JS design quirk)`
      },
      {
        title: "3. Common Beginner Pitfall: Numbers vs Strings",
        content: `
          <p>When quotes surround a number, JavaScript treats it as a <strong>String</strong>! This causes concatenation (joining text) rather than mathematical addition:</p>
        `,
        codeExample: `let numA = 10;
let numB = 20;
console.log(numA + numB); // 30 (Numeric Addition)

let strA = "10";
let strB = "20";
console.log(strA + strB); // "1020" (String Concatenation!)`
      }
    ],

    keyTakeaways: [
      "Always put quotes around Strings: `\"Hello\"` or `'Hello'`.",
      "Numbers never use quotes: `let age = 18;`.",
      "Use `typeof` anytime you need to debug unexpected data behavior."
    ],

    starterCode: `// 🏷️ Topic 2: Data Types Practice
// Inspect each type and test type coercion

let courseName = "JavaScript Basics";
let studentCount = 35;
let isCourseActive = true;
let finalProjectGrade;
let optionalNotes = null;

console.log("Value:", courseName, "| Type:", typeof courseName);
console.log("Value:", studentCount, "| Type:", typeof studentCount);
console.log("Value:", isCourseActive, "| Type:", typeof isCourseActive);
console.log("Value:", finalProjectGrade, "| Type:", typeof finalProjectGrade);
console.log("Value:", optionalNotes, "| Type:", typeof optionalNotes);

// Experiment with adding number + string:
let score = 95;
let scoreText = "Total Score: " + score;
console.log(scoreText);
console.log("Type of scoreText:", typeof scoreText);`
  },

  {
    id: "functions",
    number: "03",
    title: "JavaScript Functions",
    subtitle: "Reusable blocks of code designed to perform specific tasks",
    badge: "Basics #3",
    estimatedTime: "12 mins",
    icon: "⚡",

    definition: "A function is a reusable block of code designed to perform a specific task. You define a function once, and then you can 'call' or 'invoke' it as many times as you want with different inputs, eliminating repetitive code.",

    analogy: {
      title: "The Kitchen Recipe & Vending Machine Analogy",
      subtitle: "Input ingredients -> Processing steps -> Output result",
      icon: "⚡",
      description: "Think of a function like a Vending Machine or a Blender:",
      items: [
        {
          label: "Parameters (The Input Slot)",
          desc: "The coins or buttons you press on the vending machine (e.g., selecting snack B4)."
        },
        {
          label: "Function Body (The Internal Mechanism)",
          desc: "The gears inside that locate the snack and drop it into the dispenser tray."
        },
        {
          label: "Return Value (The Dispensed Snack)",
          desc: "The final item delivered out of the machine back into your hands using the return keyword."
        }
      ]
    },

    sections: [
      {
        title: "1. Function Declaration Anatomy",
        content: `
          <p>A standard JavaScript function declaration consists of:</p>
          <ol>
            <li>The <code>function</code> keyword</li>
            <li>The function name (e.g., <code>calculateTotal</code>)</li>
            <li>A pair of parentheses <code>( )</code> containing optional <strong>parameters</strong></li>
            <li>A code block enclosed in curly braces <code>{ }</code></li>
            <li>An optional <code>return</code> statement that sends data back to the caller</li>
          </ol>
        `,
        codeExample: `// Declaring the function
function calculateTotal(price, taxRate) {
  let tax = price * taxRate;
  let finalPrice = price + tax;
  return finalPrice; // Send result back
}

// Calling (invoking) the function
let laptopCost = calculateTotal(1000, 0.08);
console.log("Total Cost: $" + laptopCost); // Total Cost: $1080`
      },
      {
        title: "2. Parameters vs. Arguments",
        content: `
          <p>These two terms are often confused, but the distinction is simple:</p>
          <ul>
            <li><strong>Parameters</strong> are the placeholder variable names listed in the function definition (e.g., <code>name</code> in <code>function greet(name)</code>).</li>
            <li><strong>Arguments</strong> are the actual real values passed into the function when you call it (e.g., <code>"Sarah"</code> in <code>greet("Sarah")</code>).</li>
          </ul>
        `
      },
      {
        title: "3. The Power of the return Statement",
        content: `
          <p>The <code>return</code> keyword stops the execution of a function immediately and returns a value to where the function was called. If a function doesn't have a <code>return</code> statement, it returns <code>undefined</code> by default.</p>
        `,
        codeExample: `function isPassing(grade) {
  if (grade >= 75) {
    return "Passed 🎉";
  } else {
    return "Needs Improvement 📚";
  }
}

console.log(isPassing(88)); // Passed 🎉
console.log(isPassing(62)); // Needs Improvement 📚`
      }
    ],

    keyTakeaways: [
      "Functions let you write code once and reuse it across your entire program (DRY: Don't Repeat Yourself).",
      "Parameters receive inputs, and `return` delivers the output.",
      "A function must be called (e.g. `myFunction()`) to actually run its code."
    ],

    starterCode: `// ⚡ Topic 3: Functions Practice
// Create a function that calculates student GPA average

function calculateAverage(score1, score2, score3) {
  let sum = score1 + score2 + score3;
  let average = sum / 3;
  return average;
}

// Test with different scores:
let student1Avg = calculateAverage(85, 90, 95);
let student2Avg = calculateAverage(70, 80, 75);

console.log("Student 1 Average:", student1Avg);
console.log("Student 2 Average:", student2Avg);

// Helper function to create custom greetings:
function createWelcomeMessage(studentName, course) {
  return "Hello " + studentName + "! Welcome to " + course + ".";
}

let message = createWelcomeMessage("Taylor", "JavaScript Basics");
console.log(message);`
  },

  {
    id: "arrays",
    number: "04",
    title: "JavaScript Arrays",
    subtitle: "Ordered lists of values stored under a single variable",
    badge: "Basics #4",
    estimatedTime: "10 mins",
    icon: "📚",

    definition: "An array is a special type of variable that can hold an ordered collection of multiple values under a single name. Instead of creating 10 separate variables for 10 students, you can store all 10 students inside one array.",

    analogy: {
      title: "The Numbered School Locker Row Analogy",
      subtitle: "Zero-based indexed slots in consecutive order",
      icon: "📚",
      description: "Imagine a long hallway with a row of student lockers numbered in sequence:",
      items: [
        {
          label: "Zero-Based Indexing (0, 1, 2...)",
          desc: "In programming, counting starts at 0! The very first locker is Locker #0, the second is Locker #1."
        },
        {
          label: ".length Property",
          desc: "The total count of lockers in the row. If there are 3 items, length is 3, and the last item index is 2."
        },
        {
          label: ".push() and .pop()",
          desc: ".push() adds a new locker onto the end of the row. .pop() removes the very last locker."
        }
      ]
    },

    sections: [
      {
        title: "1. Creating Arrays and Accessing Elements",
        content: `
          <p>Arrays are created using square brackets <code>[ ]</code> with items separated by commas:</p>
        `,
        codeExample: `// Creating an array of strings
let fruits = ["Apple", "Banana", "Cherry"];

// Accessing items by index (starts at 0!)
console.log(fruits[0]); // "Apple" (First item)
console.log(fruits[1]); // "Banana" (Second item)
console.log(fruits[2]); // "Cherry" (Third item)

// Checking total number of items
console.log(fruits.length); // 3`
      },
      {
        title: "2. Common Array Methods: push(), pop(), and Updating",
        content: `
          <p>Arrays are dynamic—you can add, remove, and change items anytime:</p>
        `,
        table: {
          headers: ["Method / Operation", "What it does", "Example Code"],
          rows: [
            ["fruits.push('Mango')", "Adds an item to the END of the array", 'fruits.push("Mango");'],
            ["fruits.pop()", "Removes and returns the LAST item", "let last = fruits.pop();"],
            ["fruits[0] = 'Avocado'", "Modifies the element at index 0", 'fruits[0] = "Avocado";'],
            ["fruits.length", "Returns total count of items", "console.log(fruits.length);"]
          ]
        }
      },
      {
        title: "3. Looping Through an Array with a for Loop",
        content: `
          <p>To inspect or process every single item in an array, you can use a classic <code>for</code> loop:</p>
        `,
        codeExample: `let subjects = ["Math", "Science", "History", "Coding"];

for (let i = 0; i < subjects.length; i++) {
  console.log("Subject " + (i + 1) + ": " + subjects[i]);
}`
      }
    ],

    keyTakeaways: [
      "Array indexes start at 0, so the first element is `array[0]`.",
      "The last element is always at index `array.length - 1`.",
      "Use `.push()` to append to the end, and `.pop()` to remove the end element."
    ],

    starterCode: `// 📚 Topic 4: Arrays Practice
// Manage a student inventory list

let inventory = ["Notebook", "Pencil", "Calculator"];

console.log("Initial inventory:", inventory);
console.log("Item count:", inventory.length);
console.log("First item:", inventory[0]);

// Add items with .push()
inventory.push("Ruler");
inventory.push("Flash Drive");
console.log("After adding items:", inventory);

// Remove the last item with .pop()
let removedItem = inventory.pop();
console.log("Removed:", removedItem);
console.log("Updated inventory:", inventory);

// Loop through all items:
console.log("--- Current Backpack Contents ---");
for (let i = 0; i < inventory.length; i++) {
  console.log((i + 1) + ". " + inventory[i]);
}`
  },

  {
    id: "objects",
    number: "05",
    title: "JavaScript Objects",
    subtitle: "Complex data structures with named key-value property pairs",
    badge: "Basics #5",
    estimatedTime: "12 mins",
    icon: "📇",

    definition: "An object is a data structure used to store collections of related data and properties. While arrays use numbered indexes (0, 1, 2), objects use named labels called 'keys' paired with 'values' (key-value pairs).",

    analogy: {
      title: "The Student ID Card & Profile Sheet Analogy",
      subtitle: "Named fields describing an entity",
      icon: "📇",
      description: "Think of an object like a printed Student ID Card or a Gaming Character sheet:",
      items: [
        {
          label: "Keys / Properties (The Printed Form Labels)",
          desc: "The field names printed on the card: 'Name', 'Grade', 'Major', 'ID Number'."
        },
        {
          label: "Values (The Filled-in Answers)",
          desc: "The specific data written next to each label: 'Jordan Smith', 12, 'Computer Science', 1042."
        },
        {
          label: "Dot Notation vs Bracket Notation",
          desc: "Dot notation (student.name) is like pointing directly at the 'Name' box on the card."
        }
      ]
    },

    sections: [
      {
        title: "1. Creating Objects with Object Literal Syntax",
        content: `
          <p>Objects are declared using curly braces <code>{ }</code> containing <code>key: value</code> pairs separated by commas:</p>
        `,
        codeExample: `// Creating a student object
let student = {
  firstName: "Emma",
  lastName: "Watson",
  age: 17,
  isEnrolled: true,
  gpa: 3.9
};

console.log(student);`
      },
      {
        title: "2. Accessing and Modifying Object Properties",
        content: `
          <p>There are two primary ways to read and update object values:</p>
          <ul>
            <li><strong>Dot Notation:</strong> <code>object.key</code> (cleanest and most common)</li>
            <li><strong>Bracket Notation:</strong> <code>object["key"]</code> (useful when the key name is stored inside a variable)</li>
          </ul>
        `,
        codeExample: `let car = {
  brand: "Toyota",
  model: "Corolla",
  year: 2022
};

// Reading properties
console.log(car.brand);        // "Toyota" (Dot notation)
console.log(car["model"]);      // "Corolla" (Bracket notation)

// Modifying existing properties
car.year = 2024;

// Adding a brand new property
car.color = "Midnight Blue";

console.log("Updated car:", car);`
      },
      {
        title: "3. Nested Objects",
        content: `
          <p>An object's value can be another object, allowing you to model complex structured data:</p>
        `,
        codeExample: `let school = {
  name: "Tech Academy",
  address: {
    street: "123 Innovation Way",
    city: "San Francisco",
    zipCode: "94105"
  }
};

console.log(school.name);            // "Tech Academy"
console.log(school.address.city);     // "San Francisco"`
      }
    ],

    keyTakeaways: [
      "Use objects when you want to group related properties under descriptive key names.",
      "Use `object.property` to read and update values easily.",
      "Objects can hold any data type as values, including strings, numbers, booleans, arrays, and other objects."
    ],

    starterCode: `// 📇 Topic 5: Objects Practice
// Model a student course profile

let studentProfile = {
  fullName: "Morgan Lee",
  studentId: 90210,
  course: "Web Development",
  currentGrade: 88,
  isActive: true,
  contact: {
    email: "morgan@school.edu",
    campusRoom: "B-204"
  }
};

console.log("Student Name:", studentProfile.fullName);
console.log("Current Grade:", studentProfile.currentGrade);
console.log("Contact Email:", studentProfile.contact.email);

// Update grade:
studentProfile.currentGrade = 94;
console.log("🎉 Grade updated to:", studentProfile.currentGrade);

// Add new property:
studentProfile.honorsStudent = true;
console.log("Full Profile Summary:", studentProfile);`
  }
];

if (typeof window !== "undefined") {
  window.TOPICS_DATA = TOPICS_DATA;
}

export default TOPICS_DATA;
