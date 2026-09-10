/**
 * QuizPulse - Question Bank
 * Diverse question dataset covering Web Tech, CS Concepts, and Tech Trivia.
 * Types supported:
 *  - 'single'  : Multiple choice, single correct answer
 *  - 'multi'   : Multiple choice, multiple correct answers ("Select all that apply")
 *  - 'blank'   : Fill-in-the-blank text input
 *  - 'boolean' : True or False statement
 */

const QUESTION_BANK = [
  // --- Web Development: JavaScript, CSS, HTML & Web APIs ---
  {
    id: "web-1",
    category: "web-dev",
    difficulty: "easy",
    type: "single",
    question: "Which keyword is used to declare a block-scoped variable that cannot be reassigned in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: 2, // Index of "const"
    hint: "Introduced in ES6, its name stands for constant.",
    explanation: "`const` declares a block-scoped identifier that cannot be reassigned once initialized."
  },
  {
    id: "web-2",
    category: "web-dev",
    difficulty: "medium",
    type: "multi",
    question: "Which of the following are valid JavaScript data types as per ECMAScript specifications? (Select all that apply)",
    options: ["Symbol", "BigInt", "Float", "Undefined", "Decimal"],
    correctAnswer: [0, 1, 3], // Symbol, BigInt, Undefined
    hint: "JavaScript does not have dedicated 'Float' or 'Decimal' primitive types—numbers are 64-bit floats under 'Number'.",
    explanation: "JavaScript primitives include: string, number, bigint, boolean, undefined, symbol, and null. 'Float' and 'Decimal' are not distinct JavaScript data types."
  },
  {
    id: "web-3",
    category: "web-dev",
    difficulty: "easy",
    type: "blank",
    question: "In CSS Flexbox, what property is used to align items along the primary (main) axis?",
    acceptableAnswers: ["justify-content", "justify content", "justifycontent"],
    hint: "It pairs with 'align-items' (which aligns along the cross axis).",
    explanation: "`justify-content` aligns flex items along the main axis of the current line."
  },
  {
    id: "web-4",
    category: "web-dev",
    difficulty: "medium",
    type: "boolean",
    question: "In JavaScript, `NaN === NaN` evaluates to `true`.",
    options: ["True", "False"],
    correctAnswer: 1, // False
    hint: "NaN is the only value in JavaScript that is not strictly equal to itself.",
    explanation: "In JavaScript, `NaN` is not equal to any value, including itself (`NaN === NaN` is `false`). Use `Number.isNaN()` to check for NaN."
  },
  {
    id: "web-5",
    category: "web-dev",
    difficulty: "hard",
    type: "single",
    question: "What will the following code output to the console?",
    codeSnippet: `console.log(typeof null);\nconsole.log([] == false);`,
    options: [
      "'null' and false",
      "'object' and true",
      "'undefined' and true",
      "'object' and false"
    ],
    correctAnswer: 1, // 'object' and true
    hint: "Consider JavaScript's historical bug with null, and implicit type coercion on arrays.",
    explanation: "`typeof null` returns `'object'` due to a legacy bug in JS. `[] == false` evaluates to `true` because `[]` coerces to `\"\"`, which coerces to `0`, and `false` coerces to `0`."
  },
  {
    id: "web-6",
    category: "web-dev",
    difficulty: "medium",
    type: "multi",
    question: "Which HTTP status codes indicate client-side errors? (Select all that apply)",
    options: ["401 Unauthorized", "502 Bad Gateway", "403 Forbidden", "404 Not Found", "301 Moved Permanently"],
    correctAnswer: [0, 2, 3],
    hint: "4xx codes indicate client errors, while 5xx represent server errors and 3xx represent redirections.",
    explanation: "HTTP 401, 403, and 404 belong to the 4xx class representing client error responses."
  },
  {
    id: "web-7",
    category: "web-dev",
    difficulty: "easy",
    type: "blank",
    question: "Which HTML5 element is used to specify independent, self-contained article-like content?",
    acceptableAnswers: ["article", "<article>"],
    hint: "It has the exact same name as an editorial publication piece.",
    explanation: "The `<article>` HTML element represents a complete, or self-contained, composition in a document."
  },
  {
    id: "web-8",
    category: "web-dev",
    difficulty: "hard",
    type: "single",
    question: "In the JavaScript Event Loop, which queue has the highest execution priority right after synchronous call stack execution?",
    options: ["MacroTask Queue (setTimeout)", "MicroTask Queue (Promises)", "RequestAnimationFrame Queue", "I/O Callbacks Queue"],
    correctAnswer: 1, // MicroTask Queue
    hint: "Promise callbacks and `queueMicrotask()` are processed before setTimeout callbacks.",
    explanation: "The MicroTask queue (Promises, `MutationObserver`, `queueMicrotask`) is drained completely before the event loop moves to the next MacroTask."
  },
  {
    id: "web-9",
    category: "web-dev",
    difficulty: "medium",
    type: "boolean",
    question: "The CSS `position: sticky` requires at least one threshold (top, right, bottom, or left) specified to take effect.",
    options: ["True", "False"],
    correctAnswer: 0, // True
    hint: "Without a defined offset boundary, the browser cannot compute when it becomes sticky.",
    explanation: "An element with `position: sticky` will behave as `relative` until at least one threshold (e.g. `top: 0`) is defined."
  },
  {
    id: "web-10",
    category: "web-dev",
    difficulty: "hard",
    type: "multi",
    question: "Which of the following methods mutate the original array in JavaScript? (Select all that apply)",
    options: ["Array.prototype.push()", "Array.prototype.map()", "Array.prototype.splice()", "Array.prototype.filter()", "Array.prototype.reverse()"],
    correctAnswer: [0, 2, 4],
    hint: "`map` and `filter` create new arrays, while others modify in-place.",
    explanation: "`push()`, `splice()`, and `reverse()` mutate the caller array in-place. `map()` and `filter()` return brand-new arrays."
  },

  // --- Computer Science & Python ---
  {
    id: "cs-1",
    category: "cs-python",
    difficulty: "easy",
    type: "single",
    question: "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    hint: "Each step cuts the remaining search space roughly in half.",
    explanation: "A balanced BST halves the search space at each branch comparison, resulting in O(log n) time complexity."
  },
  {
    id: "cs-2",
    category: "cs-python",
    difficulty: "medium",
    type: "multi",
    question: "Which of the following data structures follow the LIFO (Last-In, First-Out) principle or utilize it natively? (Select all that apply)",
    options: ["Call Stack in program execution", "Breadth-First Search queue", "Undo/Redo history stack", "Priority Queue"],
    correctAnswer: [0, 2],
    hint: "Think about which processes require the most recent item to be popped first.",
    explanation: "Program call stacks and Undo mechanisms rely on LIFO (Stack). BFS uses FIFO (Queue), and Priority Queue orders by priority."
  },
  {
    id: "cs-3",
    category: "cs-python",
    difficulty: "easy",
    type: "blank",
    question: "In Python, which built-in function returns the number of items in an object or list?",
    acceptableAnswers: ["len", "len()"],
    hint: "Three-letter function abbreviation for length.",
    explanation: "`len()` is Python's built-in function to query the length or item count of sequences and collections."
  },
  {
    id: "cs-4",
    category: "cs-python",
    difficulty: "medium",
    type: "single",
    question: "What is the output of the following Python snippet?",
    codeSnippet: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))`,
    options: ["3", "4", "Error", "None"],
    correctAnswer: 1, // 4
    hint: "In Python, lists are mutable objects, and variable assignment copies the reference, not the list.",
    explanation: "Assigning `y = x` assigns the reference. When `y.append(4)` modifies the list, `x` reflects the change, so `len(x)` is 4."
  },
  {
    id: "cs-5",
    category: "cs-python",
    difficulty: "medium",
    type: "boolean",
    question: "In Python, tuples are immutable, meaning their elements cannot be changed or reassigned after creation.",
    options: ["True", "False"],
    correctAnswer: 0, // True
    hint: "Tuples are defined with parentheses and cannot have elements reassigned in place.",
    explanation: "Python tuples are immutable. Once created, you cannot append, replace, or delete items inside the tuple."
  },
  {
    id: "cs-6",
    category: "cs-python",
    difficulty: "hard",
    type: "multi",
    question: "Which sorting algorithms have a worst-case time complexity of O(n log n)? (Select all that apply)",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"],
    correctAnswer: [0, 2],
    hint: "Quick Sort's worst case degrades to O(n²) when poor pivots are chosen.",
    explanation: "Merge Sort and Heap Sort guarantee O(n log n) even in the worst case. Quick Sort's worst case is O(n²)."
  },
  {
    id: "cs-7",
    category: "cs-python",
    difficulty: "medium",
    type: "blank",
    question: "What is the name of the special method in Python used to initialize a new instance of a class?",
    acceptableAnswers: ["__init__", "init", "__init__()"],
    hint: "It has two leading and two trailing underscores.",
    explanation: "`__init__` is the constructor/initializer method called automatically when an object is instantiated."
  },
  {
    id: "cs-8",
    category: "cs-python",
    difficulty: "hard",
    type: "single",
    question: "Which cryptographic algorithm is classified as an asymmetric (public-key) cipher?",
    options: ["AES (Advanced Encryption Standard)", "DES (Data Encryption Standard)", "RSA (Rivest–Shamir–Adleman)", "ChaCha20"],
    correctAnswer: 2, // RSA
    hint: "It uses a mathematical trapdoor based on the difficulty of factoring large prime products.",
    explanation: "RSA uses a public key for encryption and a private key for decryption. AES, DES, and ChaCha20 are symmetric ciphers."
  },

  // --- Tech Trivia & General Computing ---
  {
    id: "tech-1",
    category: "general-tech",
    difficulty: "easy",
    type: "single",
    question: "Who is widely recognized as the world's first computer programmer for writing an algorithm for the Analytical Engine?",
    options: ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Charles Babbage"],
    correctAnswer: 0, // Ada Lovelace
    hint: "She worked closely with Charles Babbage in the 19th century.",
    explanation: "Ada Lovelace wrote the first algorithm intended for implementation on Charles Babbage's mechanical computer."
  },
  {
    id: "tech-2",
    category: "general-tech",
    difficulty: "medium",
    type: "multi",
    question: "Which of the following are open-source relational database management systems (RDBMS)? (Select all that apply)",
    options: ["PostgreSQL", "Oracle Database", "MySQL", "MongoDB", "SQLite"],
    correctAnswer: [0, 2, 4],
    hint: "MongoDB is NoSQL/document-based, and Oracle is proprietary.",
    explanation: "PostgreSQL, MySQL, and SQLite are open-source relational databases. MongoDB is a document database."
  },
  {
    id: "tech-3",
    category: "general-tech",
    difficulty: "easy",
    type: "blank",
    question: "What protocol is standard for securely serving web pages over encrypted TLS connections?",
    acceptableAnswers: ["https", "https://"],
    hint: "It is the secure version of HTTP.",
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts communication over a computer network using TLS/SSL."
  },
  {
    id: "tech-4",
    category: "general-tech",
    difficulty: "medium",
    type: "boolean",
    question: "RAM (Random Access Memory) is non-volatile memory that retains stored data even when the computer is turned off.",
    options: ["True", "False"],
    correctAnswer: 1, // False
    hint: "When you shut down your PC without saving to storage, memory contents are cleared.",
    explanation: "RAM is volatile memory and loses its stored information immediately when power is lost."
  },
  {
    id: "tech-5",
    category: "general-tech",
    difficulty: "hard",
    type: "single",
    question: "Which year was the Git version control system initially released by Linus Torvalds?",
    options: ["1999", "2005", "2008", "2012"],
    correctAnswer: 1, // 2005
    hint: "It was created following the BitKeeper dispute while maintaining the Linux kernel in the mid-2000s.",
    explanation: "Linus Torvalds released Git in 2005 to manage development of the Linux kernel."
  },
  {
    id: "tech-6",
    category: "general-tech",
    difficulty: "easy",
    type: "single",
    question: "How many bits make up a single standard byte?",
    options: ["4", "8", "16", "32"],
    correctAnswer: 1, // 8
    hint: "A nibble is 4 bits, and double that makes a byte.",
    explanation: "A standard byte consists of 8 bits."
  },
  {
    id: "tech-7",
    category: "general-tech",
    difficulty: "hard",
    type: "multi",
    question: "Which of the following ports are traditionally reserved by standard networking protocols? (Select all that apply)",
    options: ["Port 22 - SSH", "Port 53 - DNS", "Port 80 - HTTP", "Port 443 - FTP"],
    correctAnswer: [0, 1, 2],
    hint: "Port 443 is HTTPS, while standard FTP uses ports 20 & 21.",
    explanation: "Port 22 is SSH, Port 53 is DNS, Port 80 is HTTP. Port 443 is HTTPS (FTP uses ports 20 and 21)."
  },
  {
    id: "tech-8",
    category: "general-tech",
    difficulty: "medium",
    type: "blank",
    question: "What acronym stands for the open-source operating system kernel created by Linus Torvalds combined with GNU tools?",
    acceptableAnswers: ["linux", "gnu/linux", "gnu linux"],
    hint: "Starts with an 'L' and has a penguin mascot named Tux.",
    explanation: "Linux is the widely used open-source Unix-like operating system kernel."
  }
];

// Categories definition
const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "sparkles" },
  { id: "web-dev", name: "Web & Frontend", icon: "code" },
  { id: "cs-python", name: "CS & Python", icon: "terminal" },
  { id: "general-tech", name: "Tech & Trivia", icon: "cpu" }
];

// Question Types definition
const QUESTION_TYPES = [
  { id: "all", label: "All Formats" },
  { id: "single", label: "Single Choice" },
  { id: "multi", label: "Multi-Select" },
  { id: "blank", label: "Fill-in-the-Blank" },
  { id: "boolean", label: "True / False" }
];
