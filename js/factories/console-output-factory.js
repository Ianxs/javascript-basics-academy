/* ==========================================================================
   CONSOLE OUTPUT FACTORY
   Patterns: Factory with Object Mapping · Factory with Dictionary/Lookup Table
   --------------------------------------------------------------------------
   Replaces a long if/else chain: the value's type is used as a key to look up
   the formatter that produces its colored HTML. Supporting a new type means
   adding one entry to the table.
   ========================================================================== */

import { escapeHtml } from "../utils/html.js";

const span = (cls, text) => `<span class="${cls}">${text}</span>`;

const VALUE_FORMATTERS = {
  null:      () => span("console-null", "null"),
  undefined: () => span("console-undefined", "undefined"),
  string:    (v) => span("console-string", `"${escapeHtml(v)}"`),
  number:    (v) => span("console-number", String(v)),
  bigint:    (v) => span("console-number", `${v}n`),
  boolean:   (v) => span("console-boolean", String(v)),
  array:     (v) => span("console-object", `[ ${v.map(formatValue).join(", ")} ]`),
  function:  (v) => span("console-log", `[Function: ${escapeHtml(v.name || "anonymous")}]`),
  object:    (v) => {
    try {
      return span("console-object", escapeHtml(JSON.stringify(v, null, 2)));
    } catch {
      return span("console-object", "[Object]"); // e.g. circular references
    }
  },
  other:     (v) => span("console-log", escapeHtml(String(v)))
};

function typeKeyOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const t = typeof value;
  return t in VALUE_FORMATTERS ? t : "other";
}

export function formatValue(value) {
  return VALUE_FORMATTERS[typeKeyOf(value)](value);
}

const ENTRY_TYPES = {
  log:   { prefix: "",    rowClass: "" },
  info:  { prefix: "ℹ️ ", rowClass: "" },
  warn:  { prefix: "⚠️ ", rowClass: "" },
  error: { prefix: "❌ ", rowClass: "console-error" }
};

/** Creates one console line: { rowClass, html } */
export function createConsoleEntry(type, args) {
  const { prefix, rowClass } = ENTRY_TYPES[type] ?? ENTRY_TYPES.log;
  return { rowClass, html: prefix + args.map(formatValue).join(" ") };
}
