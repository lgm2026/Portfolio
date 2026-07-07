/* Headless smoke test: mount the app in jsdom, drive onboarding + a lesson quiz,
   and surface any runtime error. Babel already validated syntax separately. */
const fs = require("fs");
const vm = require("vm");
const babel = require("@babel/core");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!DOCTYPE html><html><body><div id='root'></div></body></html>", {
  url: "https://example.com/",
  pretendToBeVisual: true,
});
const { window } = dom;

// minimal globals the app/React expect
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;
global.Node = window.Node;
global.Event = window.Event;
global.MouseEvent = window.MouseEvent;
global.getComputedStyle = window.getComputedStyle;
global.requestAnimationFrame = function (cb) { return setTimeout(cb, 0); };
global.cancelAnimationFrame = function (id) { clearTimeout(id); };
global.IS_REACT_ACT_ENVIRONMENT = false;
if (!window.localStorage) {
  let store = {};
  window.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = "" + v; },
    removeItem: function (k) { delete store[k]; },
    clear: function () { store = {}; },
  };
}
global.localStorage = window.localStorage;
window.scrollTo = function () {};

const React = require("react");
const ReactDOMClient = require("react-dom/client");
global.React = React;
global.ReactDOM = ReactDOMClient; // exposes createRoot

// silence noisy act warnings but KEEP real errors
const realErr = console.error;
let sawError = null;
console.error = function () {
  const msg = Array.prototype.map.call(arguments, String).join(" ");
  if (/not wrapped in act|ReactDOM.render is no longer|Not implemented:/.test(msg)) return;
  sawError = sawError || msg;
  realErr.apply(console, arguments);
};

const src = fs.readFileSync("FlightPathAcademy.jsx", "utf8");
const out = babel.transformSync(src, { presets: [["@babel/preset-react"]], filename: "FlightPathAcademy.jsx", babelrc: false, configFile: false });

const sandbox = {
  React, ReactDOM: ReactDOMClient, window, document: window.document,
  navigator: window.navigator, console, setTimeout, clearTimeout, setInterval,
  clearInterval, localStorage: window.localStorage, Blob: window.Blob, URL: window.URL,
  Math, Date, JSON, Object, Array, String, Number, parseFloat, parseInt, isNaN,
};
vm.createContext(sandbox);

function flush() { return new Promise(function (r) { setImmediate(r); }); }

function allText(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
function clickButtonByText(substr) {
  const btns = Array.prototype.slice.call(document.querySelectorAll("button"));
  let best = null;
  for (const b of btns) {
    const tx = allText(b);
    if (tx.indexOf(substr) > -1) {
      if (!best || tx.length < allText(best).length) best = b;
    }
  }
  if (!best) throw new Error("button not found: " + JSON.stringify(substr));
  best.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
  return best;
}
function clickFirstCheckbox() {
  const cb = document.querySelector("input[type=checkbox]");
  if (!cb) throw new Error("checkbox not found");
  cb.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
}
function clickDivByText(substr) {
  const divs = Array.prototype.slice.call(document.querySelectorAll("div,label"));
  let best = null;
  for (const d of divs) {
    const tx = allText(d);
    if (tx.indexOf(substr) > -1) { if (!best || tx.length < allText(best).length) best = d; }
  }
  if (!best) throw new Error("div not found: " + JSON.stringify(substr));
  best.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
  return best;
}

(async function () {
  try {
    vm.runInContext(out.code, sandbox, { filename: "FlightPathAcademy.jsx" });
    await flush();
    const root = document.getElementById("root");
    console.log("STEP mount: rendered", root.querySelectorAll("*").length, "nodes");

    // Onboarding step 0: welcome — check compliance, Get started
    clickFirstCheckbox(); await flush();
    clickButtonByText("Get started"); await flush();
    console.log("STEP 1 (welcome->pathways) ok:", root.querySelectorAll("*").length, "nodes");

    // Step 1: pathways — pick Airplane
    clickDivByText("Airplane Pilot"); await flush();
    clickButtonByText("Continue"); await flush();
    console.log("STEP 2 (pathways->goals) ok");

    // Step 2: goals — just continue/skip
    try { clickButtonByText("Continue"); } catch (e) { clickButtonByText("Skip"); }
    await flush();
    console.log("STEP 3 (goals->experience) ok");

    // Step 3: experience — pick Absolute beginner, Start flying
    clickDivByText("Absolute beginner"); await flush();
    clickButtonByText("Start flying"); await flush();
    console.log("STEP 4 (onboarding complete) ok; nodes:", root.querySelectorAll("*").length);

    // Learn screen should be visible — open the Continue/Resume lesson
    let opened = false;
    try { clickButtonByText("Resume"); opened = true; } catch (e) {}
    if (!opened) { clickDivByText("What aviation is"); }
    await flush();
    const lessonText = allText(root);
    console.log("STEP 5 (lesson open) ok; has quiz button:", lessonText.indexOf("Take the quiz") > -1);

    // Start the quiz
    clickButtonByText("Take the quiz"); await flush();
    console.log("STEP 6 (quiz started) ok");

    // Answer questions: pick first choice / True / type, then Check, then Next — loop
    for (let i = 0; i < 12; i++) {
      // try multiple choice (A) by clicking the first choice button containing single letter? choices are buttons.
      // Identify answer buttons: buttons inside the question area. Simplest: click the first non-control button that's an option.
      // Controls are "Check answer"/"Next question"/"See results". Click an option if present.
      const btns = Array.prototype.slice.call(document.querySelectorAll("button"));
      // find a choice button (has letter circle) — choose the first button whose text isn't a control and length>1
      let choice = null;
      for (const b of btns) {
        const tx = allText(b);
        if (/Check answer|Next question|See results|True|False/.test(tx)) continue;
        if (tx.length > 0) { choice = b; break; }
      }
      // True/False question?
      const tf = btns.find(function (b) { return allText(b) === "True"; });
      // fill input?
      const fill = document.querySelector("input[placeholder='Type your answer']");
      if (fill) {
        // set value via native setter then input event
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(fill, "x");
        fill.dispatchEvent(new window.Event("input", { bubbles: true }));
      } else if (tf) {
        tf.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      } else if (choice) {
        choice.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      }
      await flush();
      // Check answer
      try { clickButtonByText("Check answer"); await flush(); } catch (e) {}
      // Next / results
      let advanced = false;
      try { clickButtonByText("Next question"); advanced = true; } catch (e) {}
      if (!advanced) { try { clickButtonByText("See results"); advanced = true; } catch (e) {} }
      await flush();
      if (allText(root).indexOf("Continue") > -1 && allText(root).indexOf("correct") > -1) {
        // results screen
        break;
      }
    }
    // results -> Continue
    try { clickButtonByText("Continue"); await flush(); } catch (e) {}
    // after a lesson quiz we land back on the lesson view; return to roadmap so tabs show
    try { clickButtonByText("Back to roadmap"); await flush(); } catch (e) {}
    console.log("STEP 7 (quiz finished, applyQuiz ran) ok; nodes:", root.querySelectorAll("*").length);

    // Navigate tabs: Practice, Logbook, Library, More + each sub-view + Safety
    function tab(name) { clickDivByText(name); }
    // bottom tab labels are in buttons
    clickButtonByText("Practice"); await flush(); console.log("TAB practice ok");
    clickButtonByText("Logbook"); await flush(); console.log("TAB logbook ok");
    clickButtonByText("Library"); await flush(); console.log("TAB library ok");
    clickButtonByText("More"); await flush(); console.log("TAB more ok");
    clickDivByText("Certificates & ratings"); await flush(); console.log("SUB credentials ok");
    clickButtonByText("Back"); await flush();
    clickDivByText("Career paths"); await flush(); console.log("SUB career ok");
    clickButtonByText("Back"); await flush();
    clickDivByText("Endorsements tracker"); await flush(); console.log("SUB endorsements ok");
    clickButtonByText("Back"); await flush();
    clickDivByText("Profile & settings"); await flush(); console.log("SUB profile ok");
    clickButtonByText("Back"); await flush();
    // Learn -> Safety
    clickButtonByText("Learn"); await flush();
    clickDivByText("Preflight a real decision"); await flush(); console.log("SAFETY screen ok; nodes:", root.querySelectorAll("*").length);

    if (sawError) { console.log("\nRESULT: FAIL — runtime error surfaced:\n" + sawError); process.exit(1); }
    console.log("\nRESULT: PASS — full click-through with no runtime errors.");
  } catch (e) {
    console.log("\nRESULT: FAIL — " + (e && e.stack ? e.stack : e));
    process.exit(1);
  }
})();
