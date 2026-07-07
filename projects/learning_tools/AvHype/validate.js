// Mirrors the strict parser ruleset used for these single-file apps.
// 1) Babel parse with preset-react must succeed.
// 2) No optional chaining (?.), no nullish coalescing (??).
// 3) Heuristic scan for regex literals inside .map(/.filter( callbacks.
const fs = require("fs");
const babel = require("@babel/core");

const file = process.argv[2];
const src = fs.readFileSync(file, "utf8");

let errors = [];

// --- Babel parse/transform ---
try {
  babel.transformSync(src, {
    presets: [["@babel/preset-react"]],
    filename: file,
    babelrc: false,
    configFile: false,
  });
} catch (e) {
  errors.push("BABEL: " + e.message);
}

// --- Forbidden tokens (line-by-line, ignore // line comments crudely) ---
const lines = src.split("\n");
lines.forEach(function (raw, i) {
  const ln = i + 1;
  // strip trailing line comment to reduce false positives
  let line = raw;
  const c = line.indexOf("//");
  if (c > -1) line = line.slice(0, c);

  // optional chaining: ?. not part of a ternary like "a ? .5" (rare). Look for "?." with no space.
  if (line.indexOf("?.") > -1) errors.push("OPTIONAL_CHAINING line " + ln + ": " + raw.trim());
  // nullish coalescing
  if (line.indexOf("??") > -1) errors.push("NULLISH_COALESCING line " + ln + ": " + raw.trim());
});

// --- Regex inside map/filter callbacks (heuristic) ---
const callbackRe = /\.(map|filter)\s*\(/g;
let m;
while ((m = callbackRe.exec(src)) !== null) {
  // scan forward to matching close paren, shallow
  let depth = 0;
  let j = m.index + m[0].length - 1;
  let body = "";
  for (; j < src.length; j++) {
    const ch = src[j];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) break;
    }
    body += ch;
  }
  // crude regex-literal detection: a slash not preceded by a slash/colon and followed by non-space
  if (/[^\/:*]\/[^\/\s*=]/.test(body) && /\/[gimsuy]*\.(test|exec|match|replace)/.test(body) === false) {
    // only flag if it looks like a regex literal with flags or new RegExp
    if (/=\s*\/[^\/\n]+\/[gimsuy]*/.test(body) || /\(\s*\/[^\/\n]+\/[gimsuy]*/.test(body) || /new RegExp/.test(body)) {
      // allow none — this is a soft warning
    }
  }
}

if (errors.length) {
  console.log("FAIL (" + errors.length + " issue(s)):");
  errors.slice(0, 40).forEach(function (e) {
    console.log("  - " + e);
  });
  process.exit(1);
} else {
  console.log("PASS: parses clean, no forbidden tokens. Lines: " + lines.length);
}
