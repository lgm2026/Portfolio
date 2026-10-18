/* Generates docs/ACTIVITY_REGISTRY.md and docs/activity_registry.json from the live registry (hfq_registry.js) in a real
   browser, so the document can never drift from the code. Run: cd web && python3 -m http.server 8777  then  node qa/hfq_r7_registry_export.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const DOCS=path.join(__dirname,'..','docs'); fs.mkdirSync(DOCS,{recursive:true});
(async()=>{
 const b=await chromium.launch(); const page=await b.newPage();
 await page.goto(BASE); await page.waitForFunction(()=>window.G&&G.HFQ&&G.HFQ.REG&&G.HFQ.REG.list().length>0);
 const inv=await page.evaluate(()=>{ G.HFQ.EXPLORER; return {items:G.HFQ.REG.inventory(),version:G.HFQ.VERSION,xp:G.HFQ.xp,units:G.HFQ.units.length,lessons:G.HFQ.allLessons().length}; });
 await b.close();
 const by=k=>inv.items.reduce((o,a)=>(o[a[k]]=(o[a[k]]||0)+1,o),{});
 const kinds=by('kind'), cats=by('cat');
 const esc=s=>String(s==null?'':s).replace(/\|/g,'\\|').replace(/\n/g,' ');
 let md='# Activity Registry\n\nGenerated from `web/js/hfq_registry.js` by `qa/hfq_r7_registry_export.js` on '+new Date().toISOString().slice(0,10)+' (app '+inv.version.version+', schema '+inv.version.schema+'). Do not edit by hand; rerun the script.\n\n';
 md+='Every activity a cadet can do has one stable id, one title, a category, a location on the airfield, a curriculum objective, prerequisites, assessment rules and ONE launch function. The walkable airfield, the Flight Path, the Flight Bag and the Academy Hub all launch through `H.REG.launch(id, back)`, which is why both modes give identical results (`qa/hfq_r7_parity.js`).\n\n';
 md+='**'+inv.items.length+' activities** across '+inv.units+' units and '+inv.lessons+' lessons.\n\n';
 md+='| Kind | Count |\n|---|---|\n'+Object.keys(kinds).sort().map(k=>'| '+k+' | '+kinds[k]+' |').join('\n')+'\n\n';
 md+='| Category | Count |\n|---|---|\n'+Object.keys(cats).sort().map(k=>'| '+k+' | '+cats[k]+' |').join('\n')+'\n\n';
 md+='## Id scheme\n\n`lesson:<lessonId>`, `unit:<unitId>`, `test:<unit>`, `drill:<unit>`, `check:<unit>`, `flash:<unit>`, `book:<bookId>`, `series:<n>`, `game:<gameId>`, `place:<room>`, `crew:<npcId>`, `dest:<destinationId>`, `trivia`, `review`, and tool ids (`radio`, `flightlog`, `logflight`, `fleet`, `gallery`, `crewboard`, `news`, `locker`, `logbook`, `practice`, `path`). Ids are stable across releases; a renamed title never changes an id.\n\n';
 md+='## XP rules the registry describes\n\n'+Object.keys(inv.xp).map(k=>'- `'+k+'`: '+inv.xp[k]).join('\n')+'\n\n';
 md+='## Every activity\n\nColumns: id, kind, title, category, unit, airfield place, objective, prerequisite, assessment, est. minutes, difficulty (1 easy to 3 hard).\n\n';
 md+='| id | kind | title | cat | unit | place | objective | prereq | assess | min | diff |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
 for(const a of inv.items) md+='| `'+a.id+'` | '+a.kind+' | '+esc(a.title)+' | '+esc(a.cat)+' | '+esc(a.unit)+' | '+esc(a.place)+' | '+esc(a.objective)+' | '+esc(a.prereq)+' | '+esc(a.assess)+' | '+esc(a.est)+' | '+esc(a.diff)+' |\n';
 fs.writeFileSync(path.join(DOCS,'ACTIVITY_REGISTRY.md'),md);
 fs.writeFileSync(path.join(DOCS,'activity_registry.json'),JSON.stringify({generated:new Date().toISOString().slice(0,10),app:inv.version.version,count:inv.items.length,kinds,activities:inv.items},null,1));
 console.log('docs/ACTIVITY_REGISTRY.md + activity_registry.json: '+inv.items.length+' activities, kinds '+JSON.stringify(kinds));
})().catch(e=>{ console.error(e); process.exit(1); });
