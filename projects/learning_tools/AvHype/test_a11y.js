const { JSDOM } = require("jsdom");
const fs = require("fs");
function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

(async function(){
  var html = fs.readFileSync("/mnt/user-data/outputs/FlightPathAcademy.html","utf8");
  var errors=[]; var vc=new (require("jsdom").VirtualConsole)();
  vc.on("jsdomError", function(e){ errors.push(String(e&&e.message||e)); });
  var dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://e.com/",virtualConsole:vc});
  var w=dom.window; await sleep(140); w.scrollTo=function(){};
  var seed={onboarded:true,profile:{name:"T",pathways:["airplane"],goals:[],age:"adult"},lessons:{},weak:{},log:[],endorsements:{},personalMins:{},surveys:{},arcade:{tickets:0,xpDay:"",xpToday:0},exams:{},examLog:[],activePathway:null,settings:{theme:"dark",goalsPromptDismissed:true,favorites:[]}};
  w.localStorage.setItem("flightpath_academy_v1",JSON.stringify(seed));
  w.__fpaBoot(); await sleep(520);
  var doc=w.document;
  function els(){ return Array.prototype.slice.call(doc.querySelectorAll("*")); }
  function clickEl(el){ el.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); }
  function smallest(txt){ var hit=null; els().forEach(function(e){ if((e.textContent||"").indexOf(txt)>-1){ if(!hit||e.textContent.length<hit.textContent.length)hit=e; } }); return hit; }
  function clickText(t){ var e=smallest(t); if(e){clickEl(e);return true;} return false; }
  var pass=0,total=0; function ck(l,c){ total++; if(c)pass++; console.log((c?"PASS":"FAIL")+" - "+l); }

  ck("boots zero errors", errors.length===0);
  if(errors.length) console.log("  errs:",errors.slice(0,5).join(" || "));
  var L=w.__AV_LESSONS__||{};
  ck("224 lessons intact", Object.keys(L).length===224);
  ck("agreement gate present", !!smallest("I understand and agree"));
  clickText("I understand and agree");
  await sleep(300);
  var bt=doc.body.textContent||"";
  ck("Home renders roadmap", bt.indexOf("Airspace System in Depth")>-1);

  var mb=doc.querySelector('button[aria-label="Open menu"]');
  ck("menu button present", !!mb);
  if(mb){ clickEl(mb); await sleep(220); }
  var gloss = smallest("Glossary of Terms");
  ck("glossary menu row found", !!gloss);
  var focusable = false;
  if(gloss){
    if (gloss.getAttribute("tabindex") === "0") focusable = true;
    if (gloss.tagName === "BUTTON") focusable = true;
    var p = gloss;
    for (var i=0; i<4 && p; i++) { if (p.getAttribute && p.getAttribute("tabindex")==="0") { focusable = true; } p = p.parentElement; }
  }
  ck("glossary row is keyboard-focusable (tabindex=0)", focusable);
  var target = gloss;
  var p2 = gloss;
  for (var j=0; j<4 && p2; j++) { if (p2.getAttribute && p2.getAttribute("tabindex")==="0") { target = p2; break; } p2 = p2.parentElement; }
  if (target) { target.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter",bubbles:true})); }
  await sleep(280);
  var bt2=doc.body.textContent||"";
  ck("Enter key opened Glossary screen", bt2.indexOf("Lingo")>-1 || bt2.indexOf("Crab")>-1);

  console.log("\n==== "+pass+"/"+total+" ====");
  process.exit(pass===total?0:1);
})().catch(function(e){console.log("FATAL",e&&e.stack||e);process.exit(1);});
