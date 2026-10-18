/* Content audit (advisory, never fails): quality signals the structural check can't see.
   - how often the correct multiple-choice answer is the longest option (a test-taking cue kids learn to exploit; aim for under ~40%)
   - throwaway distractors ("A song", "Nobody"...), duplicate prompts, one-sided true/false lessons.
   Run: node qa/content_audit.js */
const {H}=require('./lib/content_loader');
const per={}; let mc=0,longest=0,tfT=0,tfN=0, dupP={}, joke=0;
const jokes=/^(a song|a joke|a sandwich|a kite|nobody|nothing|never|a hat|a nap|dance|sleep|singing|painting|cooking|a boat|a cloud|snack|fuel prices|menu|menus|songs|colors|recipes|movies)$/i;
const out=[];
for(const u of H.units){ const T={mc:0,long:0,tf:0,tfT:0,joke:0};
 for(const l of H.lessons[u.id]){ let lt=0,ln=0;
  for(const q of l.qs){ const key=q.q.toLowerCase(); (dupP[key]=dupP[key]||[]).push(l.id);
   if(q.k==='mc'){ mc++; T.mc++; const len=q.a[0].length; if(q.a.slice(1).every(x=>x.length<len)){ longest++; T.long++; } q.a.slice(1).forEach(x=>{ if(jokes.test(x.trim())){ joke++; T.joke++; } }); }
   if(q.k==='tf'){ ln++; if(q.t) lt++; tfN++; if(q.t) tfT++; }
  }
  if(ln>=2&&(lt===0||lt===ln)) out.push('tf all '+(lt?'true':'false')+': '+l.id);
 } per[u.id]=T; }
console.log('mc',mc,'correct strictly longest',longest,(100*longest/mc).toFixed(1)+'%','| tf true share',(100*tfT/tfN).toFixed(1)+'%','| throwaway distractors',joke);
const d=Object.entries(dupP).filter(([k,v])=>v.length>1); console.log('duplicate prompts',d.length); d.slice(0,12).forEach(([k,v])=>console.log(' ',k.slice(0,70),v.join(',')));
console.log('lessons with one-sided tf:',out.length); 
// by stage longest rate
const st={}; for(const u of H.units){ const s=st[u.stage]=st[u.stage]||{mc:0,long:0}; s.mc+=per[u.id].mc; s.long+=per[u.id].long; } for(const k in st) console.log(k,(100*st[k].long/st[k].mc).toFixed(1)+'% longest-correct');
const oneSided=[]; for(const u of H.units) for(const l of H.lessons[u.id]){ const t=l.qs.filter(q=>q.k==='tf'); if(t.length>=2&&t.every(q=>q.t===t[0].t)) oneSided.push(l.id+':'+t[0].t); } console.log(oneSided.join(' '));
