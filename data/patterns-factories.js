/* ==========================================================================
   20 FACTORY PATTERN VARIATIONS IN JAVASCRIPT
   Curriculum data for Topic 06: Factory Design Patterns
   ========================================================================== */

export const FACTORY_PATTERNS = [
  {
    id: "simple-factory",
    name: "1. Simple Factory",
    summary: "A single function or class that encapsulates object creation based on provided parameters, without exposing instantiation logic.",
    whenToUse: "When you have a fixed set of closely related objects and want a centralized creation point.",
    code: `// 1. Simple Factory
function createNotification(type, message) {
  if (type === "email") {
    return { type: "email", deliver: () => console.log(\`📧 Email sent: \${message}\`) };
  } else if (type === "sms") {
    return { type: "sms", deliver: () => console.log(\`📱 SMS sent: \${message}\`) };
  }
  return { type: "push", deliver: () => console.log(\`🔔 Push sent: \${message}\`) };
}

const n1 = createNotification("email", "Your invoice is ready!");
const n2 = createNotification("sms", "Code: 482910");
n1.deliver();
n2.deliver();`
  },
  {
    id: "factory-method",
    name: "2. Factory Method",
    summary: "Defines an interface or base class method for creating an object, allowing subclasses to override the type of object that will be created.",
    whenToUse: "When a core workflow is shared, but specific components need customization by specialized subclasses.",
    code: `// 2. Factory Method
class Logistics {
  // Factory method intended to be overridden
  createTransport() {
    throw new Error("createTransport() must be overridden");
  }
  planDelivery() {
    const transport = this.createTransport();
    return transport.deliver();
  }
}

class RoadLogistics extends Logistics {
  createTransport() {
    return { deliver: () => "🚚 Delivering by land in cargo truck" };
  }
}

class SeaLogistics extends Logistics {
  createTransport() {
    return { deliver: () => "🚢 Delivering by sea in container ship" };
  }
}

const road = new RoadLogistics();
console.log(road.planDelivery());
const sea = new SeaLogistics();
console.log(sea.planDelivery());`
  },
  {
    id: "abstract-factory",
    name: "3. Abstract Factory",
    summary: "Creates families of related or dependent objects without specifying their concrete classes.",
    whenToUse: "When a system must be independent of how its products are created, composed, and represented (e.g. Dark vs Light UI themes).",
    code: `// 3. Abstract Factory
const DarkThemeFactory = {
  createButton: () => ({ render: () => "Dark Button: ⬛ background, ⬜ text" }),
  createCard: () => ({ render: () => "Dark Card: 🌑 border, #1e293b surface" })
};

const LightThemeFactory = {
  createButton: () => ({ render: () => "Light Button: 🟦 background, ⬛ text" }),
  createCard: () => ({ render: () => "Light Card: ⚪ border, #ffffff surface" })
};

function renderApp(factory) {
  const btn = factory.createButton();
  const card = factory.createCard();
  console.log(btn.render());
  console.log(card.render());
}

console.log("--- Dark Mode ---");
renderApp(DarkThemeFactory);
console.log("--- Light Mode ---");
renderApp(LightThemeFactory);`
  },
  {
    id: "static-factory",
    name: "4. Static Factory",
    summary: "Uses a static class method to produce instances, often giving expressive names to multiple creation pathways.",
    whenToUse: "When constructors have ambiguous parameters or multiple creation intents (e.g. fromJson, fromCoordinates).",
    code: `// 4. Static Factory
class User {
  constructor(name, role, status) {
    this.name = name;
    this.role = role;
    this.status = status;
  }

  static createGuest() {
    return new User("Guest Learner", "guest", "anonymous");
  }

  static createStudent(name) {
    return new User(name, "student", "enrolled");
  }

  static createAdmin(name) {
    return new User(name, "admin", "privileged");
  }
}

const u1 = User.createGuest();
const u2 = User.createStudent("Maya");
const u3 = User.createAdmin("Principal Skinner");
console.log(u1);
console.log(u2);
console.log(u3);`
  },
  {
    id: "function-factory",
    name: "5. Function Factory (Higher-Order Function)",
    summary: "A function that returns customized functions configured with preset behavior or captured parameters.",
    whenToUse: "When creating math calculators, prefix loggers, validators, or event handlers with specific closures.",
    code: `// 5. Function Factory (Higher-Order Function)
function createMultiplier(multiplier) {
  return function (num) {
    return num * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenX = createMultiplier(10);

console.log("Double 7:", double(7));
console.log("Triple 7:", triple(7));
console.log("10x of 7:", tenX(7));`
  },
  {
    id: "class-based-factory",
    name: "6. Class-Based Factory",
    summary: "An object-oriented class responsible for orchestrating instantiation, keeping state or configuration within instances of the factory.",
    whenToUse: "When object creation depends on factory-level instance configuration, connection pools, or environment settings.",
    code: `// 6. Class-Based Factory
class DatabaseConnectionFactory {
  constructor(environment) {
    this.environment = environment;
  }

  createConnection(dbName) {
    const isProd = this.environment === "production";
    return {
      dbName,
      env: this.environment,
      poolSize: isProd ? 20 : 5,
      connect() {
        return \`Connected to \${this.dbName} (\${this.env}) with pool of \${this.poolSize}\`;
      }
    };
  }
}

const prodFactory = new DatabaseConnectionFactory("production");
const conn = prodFactory.createConnection("school_db");
console.log(conn.connect());`
  },
  {
    id: "constructor-factory",
    name: "7. Constructor Factory",
    summary: "Dynamically selects and returns a constructor or invokes the constructor dynamically using reflective capabilities.",
    whenToUse: "When generating specialized constructor functions on the fly based on runtime requirements.",
    code: `// 7. Constructor Factory
function createModelConstructor(modelName, defaultProps) {
  return class DynamicModel {
    constructor(customProps = {}) {
      this.modelType = modelName;
      Object.assign(this, defaultProps, customProps);
    }
    describe() {
      return \`[\${this.modelType}] \${JSON.stringify(this)}\`;
    }
  };
}

const Student = createModelConstructor("Student", { role: "student", grade: "A" });
const s1 = new Student({ name: "Alice", age: 16 });
console.log(s1.describe());`
  },
  {
    id: "switch-factory",
    name: "8. Factory Function with switch",
    summary: "Dispatches creation to different object types using a switch statement matching on a string or enum type.",
    whenToUse: "Common in Redux-style action creators, message parsers, or command runners with a known set of variants.",
    code: `// 8. Factory Function with switch
function createVehicle(type, brand, model) {
  switch (type) {
    case "car":
      return { type, wheels: 4, brand, model, drive: () => "🚗 Driving on asphalt" };
    case "motorcycle":
      return { type, wheels: 2, brand, model, drive: () => "🏍️ Zipping through traffic" };
    case "boat":
      return { type, wheels: 0, brand, model, drive: () => "🚤 Sailing on water" };
    default:
      throw new Error(\`Unknown vehicle type: \${type}\`);
  }
}

const car = createVehicle("car", "Tesla", "Model 3");
const moto = createVehicle("motorcycle", "Ducati", "Panigale");
console.log(car.brand, car.drive());
console.log(moto.brand, moto.drive());`
  },
  {
    id: "ifelse-factory",
    name: "9. Factory Function with if/else",
    summary: "Branching factory using conditional expressions, suitable for progressive fallbacks, feature detection, or range-based creation.",
    whenToUse: "When creation criteria rely on ranges, Boolean feature flags, or complex logic rather than simple enum equality.",
    code: `// 9. Factory Function with if/else
function createDiscountTier(totalPurchaseAmount) {
  if (totalPurchaseAmount >= 500) {
    return { tier: "Platinum", discountRate: 0.20, perks: "VIP lounge + Free shipping" };
  } else if (totalPurchaseAmount >= 200) {
    return { tier: "Gold", discountRate: 0.10, perks: "Free standard shipping" };
  } else if (totalPurchaseAmount >= 50) {
    return { tier: "Silver", discountRate: 0.05, perks: "Loyalty points 1x" };
  } else {
    return { tier: "Bronze", discountRate: 0.00, perks: "Standard customer" };
  }
}

console.log("Tier for $650 purchase:", createDiscountTier(650));
console.log("Tier for $120 purchase:", createDiscountTier(120));`
  },
  {
    id: "object-mapping-factory",
    name: "10. Factory with Object Mapping",
    summary: "Maps string keys directly to factory functions or class definitions, eliminating switch-case ladders.",
    whenToUse: "Clean, idiomatic JavaScript pattern for mapping inputs to handlers or instances.",
    code: `// 10. Factory with Object Mapping
const mediaHandlers = {
  video: (src) => ({ type: "video", play: () => \`▶ Playing 4K Video from \${src}\` }),
  audio: (src) => ({ type: "audio", play: () => \`🎵 Streaming Audio track from \${src}\` }),
  image: (src) => ({ type: "image", play: () => \`🖼️ Displaying Image from \${src}\` })
};

function createMedia(format, sourceUrl) {
  const handler = mediaHandlers[format];
  if (!handler) throw new Error(\`Unsupported media format: \${format}\`);
  return handler(sourceUrl);
}

const video = createMedia("video", "https://academy.edu/lesson1.mp4");
console.log(video.play());`
  },
  {
    id: "dictionary-lookup-factory",
    name: "11. Factory with Dictionary / Lookup Table",
    summary: "Uses a Map or dictionary with defaults and custom overrides to instantiate objects based on lookup records.",
    whenToUse: "When metadata, icons, badge definitions, or configurations are defined in external tabular data.",
    code: `// 11. Factory with Dictionary / Lookup Table
const BADGE_TABLE = new Map([
  ["var_master", { icon: "📦", title: "Variable Virtuoso", xp: 100 }],
  ["func_wizard", { icon: "🧙‍♂️", title: "Function Fanatic", xp: 120 }],
  ["array_ace", { icon: "📚", title: "Array Ace", xp: 150 }]
]);

function createBadgeInstance(badgeKey, dateEarned = new Date().toISOString().split("T")[0]) {
  const meta = BADGE_TABLE.get(badgeKey);
  if (!meta) throw new Error(\`Unknown badge: \${badgeKey}\`);
  return {
    ...meta,
    dateEarned,
    renderBadgeHtml: () => \`\${meta.icon} \${meta.title} (+\${meta.xp} XP) earned on \${dateEarned}\`
  };
}

const b = createBadgeInstance("var_master");
console.log(b.renderBadgeHtml());`
  },
  {
    id: "registration-factory",
    name: "12. Factory with Registration",
    summary: "Allows new types or constructors to be registered dynamically at runtime without modifying the factory source code (Open-Closed Principle).",
    whenToUse: "Plugin architectures, extensible component systems, or custom plugins added by third parties.",
    code: `// 12. Factory with Registration
class PaymentFactory {
  static #registry = new Map();

  static register(methodName, processorFn) {
    this.#registry.set(methodName, processorFn);
    console.log(\`Registered payment processor: \${methodName}\`);
  }

  static create(methodName, amount) {
    const processor = this.#registry.get(methodName);
    if (!processor) throw new Error(\`No processor registered for: \${methodName}\`);
    return processor(amount);
  }
}

// Register payment processors dynamically
PaymentFactory.register("paypal", (amount) => ({
  process: () => \`Paid $\${amount} via PayPal instant transfer\`
}));
PaymentFactory.register("stripe", (amount) => ({
  process: () => \`Charged $\${amount} via Stripe Card Processing\`
}));

const p1 = PaymentFactory.create("paypal", 45);
console.log(p1.process());`
  },
  {
    id: "di-factory",
    name: "13. Factory with Dependency Injection",
    summary: "Injects dependencies (services, loggers, caches) into created objects during instantiation rather than hardcoding them.",
    whenToUse: "For high testability, decoupling units, and swapping production services with mock test doubles.",
    code: `// 13. Factory with Dependency Injection
function createOrderService({ paymentGateway, notificationService, logger }) {
  return {
    checkout(item, price, customerEmail) {
      logger.log(\`Starting checkout for \${item} ($ \${price})\`);
      paymentGateway.charge(price);
      notificationService.sendReceipt(customerEmail, item);
      return { success: true, item };
    }
  };
}

// Mock test dependencies
const mockLogger = { log: (msg) => console.log(\`[LOG] \${msg}\`) };
const mockGateway = { charge: (amt) => console.log(\`[GATEWAY] Charged $\${amt}\`) };
const mockNotifier = { sendReceipt: (to, item) => console.log(\`[EMAIL] Receipt for \${item} sent to \${to}\`) };

const service = createOrderService({
  paymentGateway: mockGateway,
  notificationService: mockNotifier,
  logger: mockLogger
});

service.checkout("JavaScript Basics Course", 49.99, "student@school.edu");`
  },
  {
    id: "configuration-factory",
    name: "14. Factory with Configuration",
    summary: "Generates custom instances by merging default settings with a user-supplied configuration object.",
    whenToUse: "UI components, HTTP client builders, charts, and toast alerts with extensive optional properties.",
    code: `// 14. Factory with Configuration
function createToast(customConfig = {}) {
  const defaults = {
    duration: 3000,
    position: "top-right",
    theme: "dark",
    dismissible: true,
    text: "Notification"
  };

  const finalConfig = { ...defaults, ...customConfig };

  return {
    config: finalConfig,
    show() {
      console.log(\`Toast [\${finalConfig.position} | \${finalConfig.theme}]: "\${finalConfig.text}" (\${finalConfig.duration}ms)\`);
    }
  };
}

const alert1 = createToast({ text: "Quiz Completed! +100 XP", theme: "emerald" });
alert1.show();`
  },
  {
    id: "prototype-factory",
    name: "15. Factory with Prototype",
    summary: "Uses Object.create() to instantiate new objects that link back to a shared prototype object, saving memory for shared methods.",
    whenToUse: "High-performance object creation when thousands of instances share the same helper functions.",
    code: `// 15. Factory with Prototype
const robotPrototype = {
  powerOn() {
    this.isActive = true;
    console.log(\`Robot \${this.modelNumber} online. Battery: \${this.battery}%\`);
  },
  scanArea() {
    console.log(\`Robot \${this.modelNumber} scanned sector \${this.sector}\`);
  }
};

function createRobot(modelNumber, sector) {
  const robot = Object.create(robotPrototype);
  robot.modelNumber = modelNumber;
  robot.sector = sector;
  robot.battery = 100;
  robot.isActive = false;
  return robot;
}

const bot1 = createRobot("RX-78", "Alpha");
const bot2 = createRobot("EVA-01", "Tokyo-3");
bot1.powerOn();
bot2.powerOn();
console.log("Shared prototype?", Object.getPrototypeOf(bot1) === Object.getPrototypeOf(bot2));`
  },
  {
    id: "builder-factory",
    name: "16. Factory with Builder Pattern",
    summary: "Combines factory creation with a fluent step-by-step Builder interface for configuring complex entities.",
    whenToUse: "Creating queries, forms, complex characters, or reports with dozens of optional components.",
    code: `// 16. Factory with Builder Pattern
class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.conditions = [];
    this.fields = ["*"];
    this.limitVal = null;
  }

  select(...fields) {
    this.fields = fields;
    return this;
  }

  where(condition) {
    this.conditions.push(condition);
    return this;
  }

  limit(count) {
    this.limitVal = count;
    return this;
  }

  build() {
    let sql = \`SELECT \${this.fields.join(", ")} FROM \${this.table}\`;
    if (this.conditions.length) sql += \` WHERE \${this.conditions.join(" AND ")}\`;
    if (this.limitVal) sql += \` LIMIT \${this.limitVal}\`;
    return sql;
  }
}

const QueryFactory = {
  create: (table) => new QueryBuilder(table)
};

const query = QueryFactory.create("users")
  .select("id", "username", "xp")
  .where("xp > 500")
  .limit(10)
  .build();

console.log("Generated SQL:", query);`
  },
  {
    id: "factory-with-singleton",
    name: "17. Factory with Singleton",
    summary: "A factory that caches instances so requesting the same key or type always returns the exact same singleton instance.",
    whenToUse: "Managing shared database connections, caching API clients per domain, or keeping one logger per module.",
    code: `// 17. Factory with Singleton (Multiton / Cached Factory)
const DatabasePoolFactory = (() => {
  const pools = new Map();

  return {
    getPool(clusterName) {
      if (!pools.has(clusterName)) {
        console.log(\`[Factory] Creating new DB pool instance for: \${clusterName}\`);
        pools.set(clusterName, {
          cluster: clusterName,
          connectionId: Math.random().toString(36).substring(7),
          query: (sql) => \`[\${clusterName}] Executed: \${sql}\`
        });
      }
      return pools.get(clusterName);
    }
  };
})();

const p1 = DatabasePoolFactory.getPool("primary_read");
const p2 = DatabasePoolFactory.getPool("primary_read");
const p3 = DatabasePoolFactory.getPool("analytics_write");

console.log("Same primary instances?", p1 === p2); // true
console.log(p1.query("SELECT * FROM students"));
console.log(p3.query("INSERT INTO metrics VALUES (1)"));`
  },
  {
    id: "strategy-factory",
    name: "18. Factory with Strategy Pattern",
    summary: "Instantiates interchangeable strategy algorithms that can be swapped dynamically at runtime.",
    whenToUse: "Compression formats, authentication schemes, sorting algorithms, or payment strategies.",
    code: `// 18. Factory with Strategy Pattern
const ShippingStrategies = {
  standard: {
    name: "Standard Ground",
    calculate: (weightKg) => weightKg * 1.5 + 5
  },
  express: {
    name: "Express Air",
    calculate: (weightKg) => weightKg * 3.5 + 15
  },
  drone: {
    name: "Autonomous Drone 30-min",
    calculate: (weightKg) => weightKg * 5.0 + 25
  }
};

class ShippingFactory {
  static create(strategyKey) {
    const strategy = ShippingStrategies[strategyKey];
    if (!strategy) throw new Error(\`Unknown shipping strategy: \${strategyKey}\`);
    return {
      strategyName: strategy.name,
      estimateCost: (weight) => {
        const cost = strategy.calculate(weight);
        return \`[\${strategy.name}] Package (\${weight}kg) => $\${cost.toFixed(2)}\`;
      }
    };
  }
}

const standard = ShippingFactory.create("standard");
console.log(standard.estimateCost(4));
const drone = ShippingFactory.create("drone");
console.log(drone.estimateCost(4));`
  },
  {
    id: "di-container-factory",
    name: "19. Factory with Dependency Injection Container",
    summary: "A central IoC (Inversion of Control) container that resolves types, binds dependencies, and manages lifecycle.",
    whenToUse: "Enterprise JavaScript applications where dependencies form a deep dependency graph.",
    code: `// 19. Factory with DI Container
class DIContainer {
  constructor() {
    this.services = new Map();
  }

  register(name, definition, dependencies = []) {
    this.services.set(name, { definition, dependencies });
  }

  get(name) {
    const service = this.services.get(name);
    if (!service) throw new Error(\`Service \${name} not found\`);

    // Recursively resolve dependencies
    const resolvedDeps = service.dependencies.map(dep => this.get(dep));
    return service.definition(...resolvedDeps);
  }
}

const container = new DIContainer();
container.register("config", () => ({ appTitle: "JS Basics Academy" }));
container.register("logger", () => ({ log: (msg) => console.log(\`[DI-LOG] \${msg}\`) }));
container.register("appService", (config, logger) => ({
  start() {
    logger.log(\`Booting \${config.appTitle} successfully!\`);
  }
}), ["config", "logger"]);

const app = container.get("appService");
app.start();`
  },
  {
    id: "plugin-architecture-factory",
    name: "20. Factory with Plugin Architecture",
    summary: "Factory that allows third-party extensions to hook into the creation pipeline, transforming instances before they are returned.",
    whenToUse: "Extensible frameworks, build tools like Vite/Webpack, middleware pipelines, or game engine entities.",
    code: `// 20. Factory with Plugin Architecture
class EntityFactory {
  constructor() {
    this.plugins = [];
  }

  use(plugin) {
    this.plugins.push(plugin);
    return this;
  }

  create(name, baseStats = {}) {
    let entity = { name, ...baseStats, abilities: [] };

    // Pass created entity through each installed plugin pipeline
    for (const plugin of this.plugins) {
      if (typeof plugin.install === "function") {
        entity = plugin.install(entity) || entity;
      }
    }

    return entity;
  }
}

// Define plugins
const FlightPlugin = {
  install(entity) {
    entity.abilities.push("flight");
    entity.fly = () => console.log(\`🦅 \${entity.name} soars through the sky!\`);
    return entity;
  }
};

const ShieldPlugin = {
  install(entity) {
    entity.shield = 100;
    entity.defend = () => console.log(\`🛡️ \${entity.name} blocked the attack! Shield at \${entity.shield}%\`);
    return entity;
  }
};

const factory = new EntityFactory()
  .use(FlightPlugin)
  .use(ShieldPlugin);

const hero = factory.create("AeroKnight", { hp: 250 });
console.log("Hero created:", hero.name, hero.abilities);
hero.fly();
hero.defend();`
  }
];

export default FACTORY_PATTERNS;
