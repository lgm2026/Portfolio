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
  function clickEl(el){ el.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); }
  function smallest(txt){ var hit=null; Array.prototype.slice.call(doc.querySelectorAll("*")).forEach(function(el){var t=el.textContent||""; if(t.indexOf(txt)>-1){ if(!hit||el.textContent.length<hit.textContent.length)hit=el;}}); return hit; }
  function clickText(t){ var e=smallest(t); if(e){clickEl(e);return true;} return false; }
  var pass=0,total=0; function check(l,c){ total++; console.log((c?"PASS":"FAIL")+" - "+l); if(c)pass++; }

  check("boots with zero runtime errors", errors.length===0);
  if(errors.length) console.log("  errors:", errors.slice(0,4).join(" || "));
  var L=w.__AV_LESSONS__||{}, P=w.__AV_PRONUNCIATION__||[], G=w.__AV_GLOSSARY__||[];
  check("224 lessons loaded (got "+Object.keys(L).length+")", Object.keys(L).length===224);
  check("pronunciation still 76 (regression)", P.length===76);
  check("lingo still 60 (regression)", G.filter(function(x){return x.cat==="Lingo & Slang";}).length===60);

  // agree
  clickText("I understand and agree"); await sleep(320);
  var bt=doc.body.textContent||"";
  check("roadmap shows 'Flying in the System' (IFR)", bt.indexOf("Flying in the System")>-1);
  check("roadmap shows 'Instrument Approaches'", bt.indexOf("Instrument Approaches")>-1);
  check("roadmap shows 'IFR Weather & Hazards'", bt.indexOf("IFR Weather & Hazards")>-1);
  check("roadmap shows 'Attitude Instrument Flying'", bt.indexOf("Attitude Instrument Flying")>-1);

  // open a new IFR lesson
  var ilsTitle=(L["iapp-ils"]&&L["iapp-ils"].title)||"";
  var hit=smallest(ilsTitle);
  var opened=false; if(hit){ clickEl(hit); await sleep(260); opened=true; }
  var lt=doc.body.textContent||"";
  // verify a unique phrase from the ILS lesson content rendered after opening
  check("opened IFR lesson shows ILS content (glideslope)", opened && lt.indexOf("glideslope")>-1);

  console.log("\n==== "+pass+"/"+total+" checks passed ====");
  process.exit(pass===total?0:1);
})().catch(function(e){ console.log("FATAL", e&&e.stack||e); process.exit(1); });
