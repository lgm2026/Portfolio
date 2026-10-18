#!/usr/bin/env node
/* THE LIBRARY PIPELINE: one finished manuscript (Markdown) -> one lazy content file the reader loads on demand.
     node tools/import_book.js <book number 1-7> <manuscript.md> [--check]
   writes web/js/content/lazy/series/htfa-<n>.js, which calls G.HFQ.addSeriesText('htfa-<n>', {chapters, words}).
   Rules (docs/LIBRARY_PIPELINE.md):
   - The story text is copied verbatim. Inline *emphasis* and **strong** stay as Markdown and the reader renders them
     as runs (never as HTML). Nothing is ever parsed as HTML.
   - Every "# " heading starts a chapter (Prologue, Chapter One..., Epilogue, Ground School Notes, the Field Guide);
     "## " inside a chapter is a section heading; "* * *" is a scene break; "> " is a quotation.
   - Interior artwork is omitted: every [[IMG:...]] placeholder is dropped (the author's decision for this edition).
   - The back-matter "Continue with ..." teaser and "About the Author" are dropped: the app has its own next-book card,
     and no author name appears anywhere in the app. The import FAILS if a fingerprinted name survives (qa/byline_guard.js).
   - The Ground School Notes chapter (and Book Seven's Field Guide) gets spoiler-safe links to academy units, shown only
     at the end of that chapter, after it has been read.
   Deterministic: the same manuscript always produces the same file (no dates, no random ids). */
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const ROOT=path.join(__dirname,'..'), OUT_DIR=path.join(ROOT,'web','js','content','lazy','series');
const [,,nArg,src,...flags]=process.argv;
const n=parseInt(nArg,10);
if(!(n>=1&&n<=7)||!src){ console.error('usage: node tools/import_book.js <1-7> <manuscript.md> [--check]'); process.exit(2); }
const CHECK=flags.includes('--check');
const text=fs.readFileSync(src,'utf8').replace(/\r\n?/g,'\n');

/* ---- the forbidden names, as fingerprints (the same set as qa/byline_guard.js; never the names themselves) ---- */
const FP=new Set(['717bb8af55ae28573abbfdad','504c67d70abdfecfddfc9a28','a0645595a4896a0f99287694','93827f5c38020157ea60d0bf','0d0d4242b771fa8fe25d2627']);
const fp=s=>crypto.createHash('sha256').update('htfa-byline-guard|'+s).digest('hex').slice(0,24);
function nameHits(t){ const w=t.toLowerCase().replace(/[^a-z0-9À-ɏ]+/g,' ').split(' ').filter(Boolean); let k=0; for(let i=0;i<w.length;i++){ const a=w[i],b=w[i+1],c=w[i+2]; if(FP.has(fp(a))||(b&&FP.has(fp(a+' '+b)))||(b&&c&&FP.has(fp(a+' '+b+' '+c)))) k++; } return k; }

/* ---- units the back-matter notes can point to (keyword -> unit id); checked against the content at import ---- */
const UNIT_KEYS=[
 [/four forces|lift|drag|thrust/i,'flight'],[/pitch|roll|yaw|flight controls|rudder|aileron|elevator/i,'controls'],[/instrument|six.pack|gauge|airspeed indicator|altimeter/i,'instruments'],
 [/checklist/i,'decisions'],[/weather|forecast|metar|taf|ceiling|visibility|minimums|wind|crosswind|windsock/i,'weather'],[/route|chart|cross.country|checkpoint|pilotage|straight line|navigation|sectional/i,'nav'],
 [/how old|age|eligib|certificate|solo|endorsement|knowledge test|practical test|checkride|private pilot|student pilot/i,'ppl'],[/go.around|landing|pattern|runway/i,'landings'],
 [/radio|tower|atis|phraseology/i,'radio'],[/fuel/i,'engine'],[/airspace/i,'airspace'],[/right.of.way|rules|regulation/i,'rules'],[/weight|balance|performance/i,'perf'],
 [/decision|judgment|risk|personal minimum|pressure|say no|stay on the ground/i,'adm'],[/career|job|mechanic|controller|dispatcher|people behind/i,'careers'],[/night/i,'night'],[/diversion|divert|lost/i,'xc'],[/emergency|engine failure/i,'emergency'],
 [/preflight|walk.around|inspection/i,'preflightinsp'],[/stall|slow flight|angle of attack/i,'stalls'],[/human|fatigue|hydration|illusion|imsafe/i,'aeromed'],[/history|museum|wright/i,'history']];
let UNITS=null; try{ UNITS=require(path.join(ROOT,'qa','lib','content_loader.js')).H.units; }catch(e){ UNITS=null; }
const unitTitle=id=>{ const u=UNITS&&UNITS.find(x=>x.id===id); return u?u.t.toLowerCase().replace(/(^|[\s(\-/+])([a-z])/g,(m,a,b)=>a+b.toUpperCase()).replace(/\b(And|Of|The|A|An|To|In|On|For|At|By|Or)\b/g,(m,w,i)=>i?w.toLowerCase():w):null; };
function linksFor(heads){ const seen=new Set(), out=[]; for(const hd of heads){ for(const [re,id] of UNIT_KEYS){ if(re.test(hd)&&!seen.has(id)){ const t=unitTitle(id); if(!t) break; seen.add(id); out.push({a:'unit:'+id,t}); break; } } } return out.slice(0,6); }

/* ---- parse ---- */
const lines=text.split('\n');
const chapters=[]; let ch=null, para=[], skipping=false, dropped={img:0,sections:[]};
const flush=()=>{ if(para.length){ const p=para.join(' ').replace(/\s+/g,' ').trim(); if(p) ch.blocks.push({p}); para=[]; } };
const isBackMatterHead=t=>/^\.?\s*(about the author|continue with)\b/i.test(t.trim())||/\babout the author\b/i.test(t);   // Book Seven's last heading runs the series teaser and the author note together
for(const raw of lines){
 const line=raw.replace(/\s+$/,'');
 const h1=/^# (.+)$/.exec(line), h2=/^## ?(.*)$/.exec(line);
 if(h1){ if(ch) flush(); skipping=false; const t=h1[1].trim(); if(/about the author/i.test(t)){ skipping=true; dropped.sections.push(t); ch=null; continue; } ch={t,blocks:[]}; chapters.push(ch); continue; }
 if(!ch&&!skipping) continue;   // text before the first heading (none in these manuscripts)
 if(h2){ if(ch) flush(); const t=h2[1].trim(); if(isBackMatterHead(t)){ skipping=true; dropped.sections.push(t); continue; } skipping=false; if(t) ch.blocks.push({h:t}); continue; }
 if(skipping) continue;
 if(/^\[\[IMG:[^\]]*\]\]\s*$/.test(line)){ dropped.img++; continue; }
 if(/^\s*(\* \* \*|\*\*\*|---)\s*$/.test(line)){ flush(); ch.blocks.push({brk:1}); continue; }
 if(/^> ?/.test(line)){ flush(); ch.blocks.push({q:line.replace(/^> ?/,'').trim()}); continue; }
 if(!line.trim()){ flush(); continue; }
 para.push(line.trim());
}
if(ch) flush();
/* the back-matter chapters get their unit links */
for(const c of chapters){
 if(/field guide/i.test(c.t)){ const L=['adm','decisions'].map(id=>({a:'unit:'+id,t:unitTitle(id)})).filter(l=>l.t); if(L.length) c.links=L; }   // life habits, not aviation topics: point at the judgment units
 else if(/ground school notes/i.test(c.t)){ const heads=c.blocks.filter(b=>b.h).map(b=>b.h).concat([c.t]); const L=linksFor(heads); if(L.length) c.links=L; } }
/* drop empty chapters and trailing scene breaks */
for(const c of chapters){ while(c.blocks.length&&c.blocks[c.blocks.length-1].brk) c.blocks.pop(); }
const out=chapters.filter(c=>c.blocks.length);
const words=out.reduce((k,c)=>k+c.blocks.reduce((m,b)=>m+String(b.p||b.q||b.h||'').split(/\s+/).filter(Boolean).length,0),0);
const flat=JSON.stringify(out);
const hits=nameHits(flat);
if(hits){ console.error('IMPORT REFUSED: an author name survived in the text ('+hits+' hit'+(hits>1?'s':'')+'). Nothing written.'); process.exit(1); }
if(!out.length||words<1000){ console.error('IMPORT REFUSED: the manuscript parsed to almost nothing ('+words+' words).'); process.exit(1); }
const id='htfa-'+n;
const body='/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */\n'+
 '/* GENERATED by tools/import_book.js from the finished manuscript of Book '+n+'. Story text is the author\'s, verbatim; do not edit here. */\n'+
 '(function(){ G.HFQ.addSeriesText('+JSON.stringify(id)+','+JSON.stringify({chapters:out,words})+'); })();\n';
if(CHECK){ console.log(id+': '+out.length+' chapters, '+words+' words, '+dropped.img+' art placeholders omitted, dropped sections: '+(dropped.sections.join('; ')||'none')+', links: '+out.filter(c=>c.links).map(c=>c.t.split(' — ')[0]+' -> '+c.links.map(l=>l.a).join(',')).join(' | ')); process.exit(0); }
fs.mkdirSync(OUT_DIR,{recursive:true});
fs.writeFileSync(path.join(OUT_DIR,id+'.js'),body);
console.log('wrote web/js/content/lazy/series/'+id+'.js: '+out.length+' chapters, '+words+' words, '+Math.round(body.length/1024)+' KB; '+dropped.img+' art placeholders omitted; dropped: '+(dropped.sections.join('; ')||'none'));
