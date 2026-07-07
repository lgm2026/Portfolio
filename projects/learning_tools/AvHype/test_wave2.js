const { JSDOM } = require("jsdom");
const fs = require("fs");

function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

(async function(){
  var html = fs.readFileSync("/mnt/user-data/outputs/FlightPathAcademy.html","utf8");
  var errors = [];
  var vc = new (require("jsdom").VirtualConsole)();
  vc.on("jsdomError", function(e){ errors.push(String(e && e.message || e)); });

  var dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "https://e.com/",
    virtualConsole: vc
  });
  var w = dom.window;
  await sleep(140);
  w.scrollTo = function(){};

  // seed an onboarded airplane learner so the roadmap + pathway are live
  var seed = {
    onboarded: true,
    profile: { name: "Test", pathways: ["airplane"], goals: [], age: "adult" },
    lessons: {}, weak: {}, log: [], endorsements: {}, personalMins: {}, surveys: {},
    arcade: { tickets: 0, xpDay: "", xpToday: 0 }, exams: {}, examLog: [],
    activePathway: null,
    settings: { theme: "dark", goalsPromptDismissed: true, favorites: [] }
  };
  try { w.localStorage.setItem("flightpath_academy_v1", JSON.stringify(seed)); } catch(e){ errors.push("seed: "+e.message); }

  if (typeof w.__fpaBoot === "function") { w.__fpaBoot(); }
  await sleep(520);

  var doc = w.document;
  function allEls(){ return Array.prototype.slice.call(doc.querySelectorAll("*")); }
  function clickEl(el){ el.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); }
  function smallestWithText(txt){
    var hit=null;
    allEls().forEach(function(el){
      var t=(el.textContent||"");
      if(t.indexOf(txt)>-1){ if(!hit || (el.textContent.length < hit.textContent.length)) hit=el; }
    });
    return hit;
  }
  function clickText(txt){ var el=smallestWithText(txt); if(el){ clickEl(el); return true; } return false; }

  function report(label, cond){ console.log((cond?"PASS":"FAIL")+" - "+label); return cond; }

  var pass = 0, total = 0;
  function check(label, cond){ total++; if(report(label,cond)) pass++; }

  // 0) booted with no errors
  check("app boots with zero runtime errors", errors.length===0);
  if(errors.length){ console.log("   errors:", errors.slice(0,4).join(" || ")); }

  // 1) data present
  var L = w.__AV_LESSONS__ || {};
  var P = w.__AV_PRONUNCIATION__ || [];
  var G = w.__AV_GLOSSARY__ || [];
  check("194 lessons loaded (got "+Object.keys(L).length+")", Object.keys(L).length===194);
  check("76 pronunciation entries (got "+P.length+")", P.length===76);
  check("60 lingo terms (got "+G.filter(function(x){return x.cat==="Lingo & Slang";}).length+")",
        G.filter(function(x){return x.cat==="Lingo & Slang";}).length===60);

  // 2) AgreementGate appears first -> agree
  var sawAgree = !!smallestWithText("I understand and agree");
  check("agreement gate shown on first load", sawAgree);
  clickText("I understand and agree");
  await sleep(300);

  // 3) roadmap shows new units (text from the new unit titles/levels)
  var bodyTxt = doc.body.textContent || "";
  check("roadmap shows 'Airspace System in Depth' unit", bodyTxt.indexOf("Airspace System in Depth")>-1);
  check("roadmap shows 'Radio Communications' unit", bodyTxt.indexOf("Radio Communications")>-1);
  check("roadmap shows 'Performance, Weight & Balance' unit", bodyTxt.indexOf("Performance, Weight & Balance")>-1);
  check("roadmap shows 'Aeronautical Decision-Making' unit", bodyTxt.indexOf("Aeronautical Decision-Making")>-1);

  // 4) open a brand-new lesson from the roadmap
  // the lesson title for as-classes
  var asClassesTitle = (L["as-classes"] && L["as-classes"].title) || "";
  var openedLesson = false;
  if (asClassesTitle) {
    var before = (doc.body.textContent||"").length;
    var hit = smallestWithText(asClassesTitle);
    if (hit) { clickEl(hit); await sleep(260); openedLesson = true; }
  }
  check("a new lesson title ("+(asClassesTitle||"?")+") is present in roadmap", !!asClassesTitle && (bodyTxt.indexOf(asClassesTitle)>-1 || openedLesson));

  // 5) open menu -> Pronunciation Guide -> verify entries
  var menuBtn = doc.querySelector('button[aria-label="Open menu"]');
  check("menu button exists", !!menuBtn);
  if (menuBtn) { clickEl(menuBtn); await sleep(220); }
  var openedPron = clickText("Pronunciation Guide");
  check("Pronunciation Guide menu item clickable", openedPron);
  await sleep(280);
  var pronTxt = doc.body.textContent || "";
  check("Pronunciation screen shows Pitot / PEE-toe", pronTxt.indexOf("Pitot")>-1 && pronTxt.indexOf("PEE-toe")>-1);
  check("Pronunciation screen shows new term Coriolis", pronTxt.indexOf("Coriolis")>-1);

  // 6) open menu -> Glossary -> verify lingo (Crabbing + a new one)
  var menuBtn2 = doc.querySelector('button[aria-label="Open menu"]');
  if (menuBtn2) { clickEl(menuBtn2); await sleep(200); }
  var openedGloss = clickText("Glossary");
  check("Glossary menu item clickable", openedGloss);
  await sleep(260);
  var glossTxt = doc.body.textContent || "";
  check("Glossary shows Crab / Crabbing lingo", glossTxt.indexOf("Crab")>-1);

  console.log("\n==== "+pass+"/"+total+" checks passed ====");
  process.exit(pass===total ? 0 : 1);
})().catch(function(e){ console.log("FATAL", e && e.stack || e); process.exit(1); });
