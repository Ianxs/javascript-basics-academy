/* ==========================================================================
   20 SINGLETON PATTERN VARIATIONS IN JAVASCRIPT
   Curriculum data for Topic 07: Singleton Design Patterns
   ========================================================================== */

export const SINGLETON_PATTERNS = [
  {
    id: "class-singleton",
    name: "1. Class Singleton",
    summary: "A class that checks on construction if an instance already exists, returning the existing instance instead of creating a new one.",
    whenToUse: "When you want consumers to be able to call `new MyClass()` without creating multiple distinct instances.",
    code: `// 1. Class Singleton
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connectionId = Math.floor(Math.random() * 10000);
    this.connected = true;
    Database.instance = this;
  }

  query(sql) {
    return \`[Conn #\${this.connectionId}] Executed: \${sql}\`;
  }
}

const db1 = new Database();
const db2 = new Database();

console.log("Same DB instance?", db1 === db2); // true
console.log(db1.query("SELECT * FROM students"));
console.log(db2.query("SELECT * FROM grades"));`
  },
  {
    id: "static-property-singleton",
    name: "2. Static Property Singleton",
    summary: "Stores the single instance in a class static property (e.g. `App.instance`) for clear, explicit reference.",
    whenToUse: "When you want clean, direct access to the instance via the class name itself.",
    code: `// 2. Static Property Singleton
class Application {
  static current = null;

  constructor(appName) {
    if (Application.current) {
      return Application.current;
    }
    this.appName = appName;
    this.startTime = Date.now();
    Application.current = this;
  }
}

const app1 = new Application("JS Basics Academy");
const app2 = new Application("Other App Name");

console.log("App 1 name:", app1.appName);
console.log("App 2 name:", app2.appName);
console.log("Static reference identical?", Application.current === app1);`
  },
  {
    id: "private-constructor-singleton",
    name: "3. Private Constructor-Style Singleton",
    summary: "Guards the constructor with a private token or throws an error if called directly, forcing consumers to use an authorized accessor.",
    whenToUse: "When you want to strictly prevent developers from inadvertently calling `new SingletonClass()`.",
    code: `// 3. Private Constructor-Style Singleton
const ENFORCER = Symbol("ENFORCER");

class SecurityVault {
  static #instance = null;

  constructor(token) {
    if (token !== ENFORCER) {
      throw new Error("Cannot call 'new SecurityVault()' directly! Use SecurityVault.acquireVault().");
    }
    this.vaultCode = "VAULT-" + Math.floor(Math.random() * 9000 + 1000);
  }

  static acquireVault() {
    if (!this.#instance) {
      this.#instance = new SecurityVault(ENFORCER);
    }
    return this.#instance;
  }
}

const vault = SecurityVault.acquireVault();
console.log("Vault Code:", vault.vaultCode);

try {
  new SecurityVault(); // Throws error
} catch (err) {
  console.log("Blocked unauthorized instantiation:", err.message);
}`
  },
  {
    id: "static-method-singleton",
    name: "4. Static Method Singleton (getInstance)",
    summary: "The classic Gang of Four (GoF) approach: access the unique instance exclusively via a static `getInstance()` method.",
    whenToUse: "The most widely recognized singleton pattern across Java, C++, TypeScript, and JavaScript.",
    code: `// 4. Static Method Singleton (getInstance)
class ApiClient {
  static #instance = null;

  constructor() {
    this.baseUrl = "https://api.school.edu/v1";
    this.requestId = 0;
  }

  static getInstance() {
    if (!ApiClient.#instance) {
      ApiClient.#instance = new ApiClient();
    }
    return ApiClient.#instance;
  }

  fetch(endpoint) {
    this.requestId++;
    return \`[Req #\${this.requestId}] GET \${this.baseUrl}\${endpoint}\`;
  }
}

const clientA = ApiClient.getInstance();
const clientB = ApiClient.getInstance();

console.log("Same client?", clientA === clientB);
console.log(clientA.fetch("/courses"));
console.log(clientB.fetch("/profile"));`
  },
  {
    id: "closure-singleton",
    name: "5. Closure Singleton",
    summary: "Hides the singleton instance completely inside a function closure, returning an accessor that retains private access.",
    whenToUse: "When you want absolute encapsulation with no static properties visible on the outside.",
    code: `// 5. Closure Singleton
const getSession = (() => {
  let instance = null;

  function createSession() {
    const token = "SESSION-" + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toLocaleTimeString();
    return { token, createdAt };
  }

  return function() {
    if (!instance) {
      instance = createSession();
    }
    return instance;
  };
})();

const session1 = getSession();
const session2 = getSession();

console.log("Session 1 Token:", session1.token);
console.log("Session 2 Token:", session2.token);
console.log("Are sessions identical?", session1 === session2);`
  },
  {
    id: "module-singleton",
    name: "6. Module Singleton",
    summary: "Leverages ES module caching: JavaScript modules are evaluated once and cached, so exporting a single object instance makes it a singleton.",
    whenToUse: "Standard in modern frontend and Node.js applications; clean, declarative, and built into ES modules.",
    code: `// 6. Module Singleton (Simulated in a single file)
// Imagine this is: export default new UserService();
const UserServiceModule = (() => {
  class UserService {
    constructor() {
      this.currentUser = { id: 101, username: "AlexCode" };
    }
    getUsername() {
      return this.currentUser.username;
    }
    setUsername(name) {
      this.currentUser.username = name;
    }
  }

  // Export one shared instance
  return new UserService();
})();

const importedA = UserServiceModule;
const importedB = UserServiceModule;

importedA.setUsername("JordanDev");
console.log("User in module B:", importedB.getUsername()); // "JordanDev"
console.log("Same reference?", importedA === importedB); // true`
  },
  {
    id: "object-literal-singleton",
    name: "7. Object Literal Singleton",
    summary: "A plain JavaScript object literal (`{}`) that inherently exists as a single unique reference in memory.",
    whenToUse: "The simplest possible JavaScript singleton for grouping related utility functions or state.",
    code: `// 7. Object Literal Singleton
const ScoreTracker = {
  score: 0,
  add(points) {
    this.score += points;
    console.log(\`Score increased by \${points}! Total: \${this.score}\`);
  },
  reset() {
    this.score = 0;
    console.log("Score reset to 0");
  }
};

ScoreTracker.add(50);
ScoreTracker.add(25);
console.log("Final tracked score:", ScoreTracker.score);`
  },
  {
    id: "iife-singleton",
    name: "8. IIFE Singleton",
    summary: "Immediately-Invoked Function Expression that executes upon definition and returns the single instance.",
    whenToUse: "When instantiation requires one-time setup code (e.g. event listener binding, DOM setup) executed immediately.",
    code: `// 8. IIFE Singleton
const AudioController = (function() {
  const defaultVolume = 80;
  let isMuted = false;

  console.log("Audio Controller hardware initialized");

  return {
    toggleMute() {
      isMuted = !isMuted;
      console.log(\`Audio is now \${isMuted ? "MUTED 🔇" : "UNMUTED 🔊"}\`);
    },
    getVolume() {
      return isMuted ? 0 : defaultVolume;
    }
  };
})();

AudioController.toggleMute();
console.log("Current Volume:", AudioController.getVolume());
AudioController.toggleMute();
console.log("Current Volume:", AudioController.getVolume());`
  },
  {
    id: "global-variable-singleton",
    name: "9. Global Variable Singleton",
    summary: "Stores the singleton on `window` (browser) or `globalThis` (universal JS) to guarantee availability across disjoint script files.",
    whenToUse: "Cross-bundle coordination, legacy script interoperability, or polyfills.",
    code: `// 9. Global Variable Singleton
(function() {
  const globalRef = typeof window !== "undefined" ? window : globalThis;

  if (!globalRef.__JS_ACADEMY_GLOBAL_STORE__) {
    globalRef.__JS_ACADEMY_GLOBAL_STORE__ = {
      version: "2.4.0",
      cache: new Map(),
      set(key, val) { this.cache.set(key, val); },
      get(key) { return this.cache.get(key); }
    };
  }
})();

const store = (typeof window !== "undefined" ? window : globalThis).__JS_ACADEMY_GLOBAL_STORE__;
store.set("activeTheme", "dark-slate");
console.log("Version:", store.version);
console.log("Retrieved:", store.get("activeTheme"));`
  },
  {
    id: "frozen-object-singleton",
    name: "10. Frozen Object Singleton",
    summary: "Uses `Object.freeze()` on the singleton instance, making its properties immutable and tamper-proof.",
    whenToUse: "Configuration constants, application settings, or immutable feature flags.",
    code: `// 10. Frozen Object Singleton
const AppConfig = Object.freeze({
  appName: "JavaScript Basics Academy",
  version: "1.0.0",
  maxQuizAttempts: 3,
  supportEmail: "support@academy.edu"
});

console.log("App Name:", AppConfig.appName);

// Attempting to mutate in strict mode will throw or fail silently
try {
  AppConfig.appName = "Hacked App";
} catch (e) {
  console.log("Mutation blocked!");
}
console.log("App Name after tamper attempt:", AppConfig.appName); // Remains unchanged`
  },
  {
    id: "symbol-singleton",
    name: "11. Symbol-Based Singleton",
    summary: "Uses a unique `Symbol()` or `Symbol.for()` key to store and retrieve the instance, preventing accidental property collisions.",
    whenToUse: "Library development where you must not pollute the global namespace with string collisions.",
    code: `// 11. Symbol-Based Singleton
const INSTANCE_KEY = Symbol.for("academy.singleton.instance");
const globalScope = typeof window !== "undefined" ? window : globalThis;

class TelemetryService {
  constructor() {
    if (globalScope[INSTANCE_KEY]) {
      return globalScope[INSTANCE_KEY];
    }
    this.events = [];
    globalScope[INSTANCE_KEY] = this;
  }

  logEvent(name) {
    this.events.push({ name, time: Date.now() });
    console.log(\`Telemetry recorded: \${name}\`);
  }
}

const t1 = new TelemetryService();
const t2 = new TelemetryService();
console.log("Symbol-keyed instance equality:", t1 === t2); // true
t1.logEvent("user_click_quiz");`
  },
  {
    id: "proxy-singleton",
    name: "12. Proxy-Based Singleton",
    summary: "Wraps a class constructor inside a `Proxy` that intercepts the `construct` trap to return the cached instance.",
    whenToUse: "Transparently turning any third-party class into a singleton without altering the original class code.",
    code: `// 12. Proxy-Based Singleton
class RawService {
  constructor(name) {
    this.name = name;
    this.id = Math.random();
  }
}

// Proxy wrapper intercepting 'new'
const SingletonService = new Proxy(RawService, {
  instance: null,
  construct(target, args) {
    if (!this.instance) {
      this.instance = new target(...args);
    }
    return this.instance;
  }
});

const s1 = new SingletonService("First");
const s2 = new SingletonService("Second");

console.log("Are proxy-constructed instances equal?", s1 === s2); // true
console.log("Name of s2:", s2.name); // "First" (since s1 was reused)`
  },
  {
    id: "lazy-singleton",
    name: "13. Lazy Singleton",
    summary: "Defers creation of the expensive instance until the very first time it is actually requested.",
    whenToUse: "Resource-intensive objects (3D canvas engines, heavy DB connections, audio decoders) that might not be needed at startup.",
    code: `// 13. Lazy Singleton
class HeavyPhysicsEngine {
  constructor() {
    console.log("⏳ Initializing 3D Physics Mesh and Collision Grids... (Heavy operation)");
    this.initialized = true;
  }
  simulate() {
    return "Physics step computed: 60 FPS";
  }
}

const PhysicsProvider = {
  instance: null,
  get() {
    if (!this.instance) {
      this.instance = new HeavyPhysicsEngine();
    }
    return this.instance;
  }
};

console.log("Application started. Physics not loaded yet.");
// Requesting physics only when game level loads:
const engine = PhysicsProvider.get();
console.log(engine.simulate());`
  },
  {
    id: "eager-singleton",
    name: "14. Eager Singleton",
    summary: "Instantiates the object immediately during module or script load time so it is instantly available without initialization latency.",
    whenToUse: "Core systems that are guaranteed to be needed immediately (system clock, environment config, primary logger).",
    code: `// 14. Eager Singleton
class SystemClock {
  constructor() {
    this.bootTimestamp = Date.now();
    console.log(\`⏰ SystemClock eagerly initialized at \${this.bootTimestamp}\`);
  }
  getUptime() {
    return \`\${Date.now() - this.bootTimestamp}ms uptime\`;
  }
}

// Created immediately upon script evaluation
const systemClockInstance = new SystemClock();

setTimeout(() => {
  console.log("Clock Uptime:", systemClockInstance.getUptime());
}, 50);`
  },
  {
    id: "factory-singleton",
    name: "15. Factory Singleton",
    summary: "A factory function that always delegates to and returns a single underlying private instance.",
    whenToUse: "When you want a functional API `getCart()` instead of `new Cart()` or `Cart.getInstance()`.",
    code: `// 15. Factory Singleton
const getShoppingCart = (() => {
  let cartInstance = null;

  class ShoppingCart {
    constructor() {
      this.items = [];
    }
    addItem(name, price) {
      this.items.push({ name, price });
      console.log(\`Added \${name} ($ \${price})\`);
    }
    getTotal() {
      return this.items.reduce((sum, item) => sum + item.price, 0);
    }
  }

  return function() {
    if (!cartInstance) {
      cartInstance = new ShoppingCart();
    }
    return cartInstance;
  };
})();

const cartA = getShoppingCart();
const cartB = getShoppingCart();
cartA.addItem("JavaScript Handbook", 29.99);
cartB.addItem("Stylus Pen", 9.99);
console.log("Total in cart A:", cartA.getTotal());
console.log("Are both carts identical?", cartA === cartB); // true`
  },
  {
    id: "registry-singleton",
    name: "16. Registry Singleton (Multiton)",
    summary: "Maintains a dictionary of singletons keyed by identifier, ensuring exactly one instance per key across the entire application.",
    whenToUse: "When you need a single instance per tenant, per topic, or per network channel.",
    code: `// 16. Registry Singleton (Multiton)
class TopicChannelRegistry {
  static #registry = new Map();

  static getChannel(topicName) {
    if (!this.#registry.has(topicName)) {
      console.log(\`Creating new channel singleton for topic: \${topicName}\`);
      this.#registry.set(topicName, {
        topic: topicName,
        messages: [],
        broadcast(msg) {
          this.messages.push(msg);
          console.log(\`[\${this.topic} Channel] \${msg}\`);
        }
      });
    }
    return this.#registry.get(topicName);
  }
}

const varChannel1 = TopicChannelRegistry.getChannel("variables");
const varChannel2 = TopicChannelRegistry.getChannel("variables");
const funcChannel = TopicChannelRegistry.getChannel("functions");

console.log("Same variables channel?", varChannel1 === varChannel2); // true
varChannel1.broadcast("Lesson 1 started!");
funcChannel.broadcast("Lesson 3 ready!");`
  },
  {
    id: "state-holding-singleton",
    name: "17. State-Holding Singleton",
    summary: "Centralized singleton that acts as the single source of truth for global application state, notifying observers of changes.",
    whenToUse: "Managing user XP, unlocked achievements, active themes, and navigation state.",
    code: `// 17. State-Holding Singleton
class AppStore {
  static #instance = null;

  constructor() {
    if (AppStore.#instance) return AppStore.#instance;
    this.state = { xp: 0, streak: 1, level: "Beginner" };
    this.listeners = [];
    AppStore.#instance = this;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  addXP(points) {
    this.state.xp += points;
    if (this.state.xp >= 100) this.state.level = "Scholar";
    this.listeners.forEach(fn => fn(this.state));
  }
}

const store = new AppStore();
store.subscribe((state) => console.log("State updated:", state));

store.addXP(60);
store.addXP(50); // Level elevates to Scholar`
  },
  {
    id: "config-singleton",
    name: "18. Config Singleton",
    summary: "Holds static and environment configuration keys, frozen against external mutations, accessible system-wide.",
    whenToUse: "Feature flags, API base URLs, pagination limits, and theme tokens.",
    code: `// 18. Config Singleton
const ConfigManager = (() => {
  const settings = {
    API_URL: "http://localhost:8000",
    DEFAULT_TIMEOUT: 5000,
    FEATURES: {
      TRY_IT_YOURSELF: true,
      CLOUD_SYNC: true,
      DARK_MODE: true
    }
  };

  return Object.freeze({
    get(key) {
      return settings[key];
    },
    isFeatureEnabled(featureName) {
      return Boolean(settings.FEATURES[featureName]);
    }
  });
})();

console.log("API Endpoint:", ConfigManager.get("API_URL"));
console.log("Cloud Sync Enabled?", ConfigManager.isFeatureEnabled("CLOUD_SYNC"));`
  },
  {
    id: "logger-singleton",
    name: "19. Logger Singleton",
    summary: "Centralized logging hub that standardizes log format, timestamps, and log levels across all files.",
    whenToUse: "Debugging, performance audits, and error reporting across complex distributed codebases.",
    code: `// 19. Logger Singleton
class Logger {
  static #instance = null;

  constructor() {
    if (Logger.#instance) return Logger.#instance;
    this.logs = [];
    Logger.#instance = this;
  }

  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }

  log(msg) {
    const entry = \`[INFO \${new Date().toLocaleTimeString()}] \${msg}\`;
    this.logs.push(entry);
    console.log(entry);
  }

  warn(msg) {
    const entry = \`[WARN \${new Date().toLocaleTimeString()}] \${msg}\`;
    this.logs.push(entry);
    console.log(entry);
  }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log("Auth session established");
logger2.warn("Network latency high: 420ms");
console.log("Same logger instance?", logger1 === logger2);`
  },
  {
    id: "event-manager-singleton",
    name: "20. Event Manager Singleton (Pub/Sub)",
    summary: "Global event hub enabling disconnected components to publish and subscribe to custom messages without direct couplings.",
    whenToUse: "Coordinating UI updates (toasts, header XP, badges) when domain events occur anywhere in the application.",
    code: `// 20. Event Manager Singleton (Pub/Sub)
const EventHub = (() => {
  const listeners = new Map();

  return {
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(handler);
    },
    emit(event, data) {
      if (!listeners.has(event)) return;
      listeners.get(event).forEach(handler => handler(data));
    }
  };
})();

// Component A listens for XP awards
EventHub.on("XP_AWARDED", (data) => {
  console.log(\`🏆 UI Header updated! Added +\${data.amount} XP for \${data.reason}\`);
});

// Component B emits an event when quiz finishes
EventHub.emit("XP_AWARDED", { amount: 100, reason: "Perfect Quiz Score" });`
  }
];

export default SINGLETON_PATTERNS;
