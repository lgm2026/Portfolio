/* Ground School content check (no browser): loads the lesson files with a stub G and checks every question.
   Run: node qa/content_check.js   Exit code 1 on any problem. */
const {G,H,F}=require('./lib/content_loader');
const probs=[], P=(where,msg)=>probs.push(where+': '+msg);
let nL=0,nQ=0; const kinds={}, ids={}, qids={};
const figOK=(where,spec)=>{ if(!spec) return; const n=typeof spec==='string'?spec:spec.f; if(!F.has(n)) P(where,'unknown figure "'+n+'"'); };
const stageIds=(H.stages||[]).map(x=>x.id), unitIds={};
for(const u of H.units){
 if(unitIds[u.id]) P(u.id,'duplicate unit id'); unitIds[u.id]=1; if(stageIds.indexOf(u.stage)<0) P(u.id,'unit has no valid stage ('+u.stage+')'); if(u.t.length>24) P(u.id,'unit title too long for the banner: '+u.t); if(u.s.length>34) P(u.id,'unit subtitle too long: '+u.s);
 const L=H.lessons[u.id];
 if(!L){ P(u.id,'no lessons'); continue; }
 if(!G.groundSchool.reg[u.id]) P(u.id,'not registered with Ground School');
 if(L.length!==u.topics.length) P(u.id,L.length+' lessons for '+u.topics.length+' topics');
 L.forEach((l,li)=>{
  nL++; const w=u.id+'/'+l.id;
  if(ids[l.id]) P(w,'duplicate lesson id'); ids[l.id]=1;
  if(!l.t) P(w,'no title');
  if(!l.cards||l.cards.length<1||l.cards.length>4) P(w,'needs 1-4 briefing cards');
  (l.cards||[]).forEach((c,ci)=>{ if(!c.t||!c.b) P(w+' card'+ci,'missing title/body'); figOK(w+' card'+ci,c.fig); const words=c.b.split(/\s+/).length; if(words>(c.fig?48:62)) P(w+' card'+ci,'body too long ('+words+' words)'); });
  if(!l.tip) P(w,'no instructor tip');
  if(!l.qs||l.qs.length<5) P(w,'needs at least 5 challenges');
  { const tfq=(l.qs||[]).filter(q=>q.k==='tf'); if(tfq.length>=2&&tfq.every(q=>q.t===tfq[0].t)) P(w,'true/false questions are all '+tfq[0].t+' (mix at least one of each)');
    tfq.forEach(q=>{ if(q.t===false&&/^(yes|true)\.?$/i.test(String(q.why).trim())) P(w,'a false statement explained with "'+q.why+'"'); }); }
  (l.qs||[]).forEach((q,qi)=>{
   nQ++; kinds[q.k]=(kinds[q.k]||0)+1; const wq=w+' q'+qi+' ('+q.k+')';
   if(qids[q.id]) P(wq,'duplicate question id'); qids[q.id]=1;
   if(!q.q) P(wq,'no prompt'); if(!q.why) P(wq,'no explanation');
   figOK(wq,q.fig);
   if(q.k==='mc'||q.k==='fill'){
    if(!Array.isArray(q.a)||q.a.length<2) P(wq,'needs 2+ options');
    else { if(new Set(q.a).size!==q.a.length) P(wq,'duplicate options'); q.a.forEach(a=>{ if(a.length>(q.k==='fill'?16:48)) P(wq,'option too long: '+a); }); }
    if(q.k==='fill'&&(q.q.match(/___/g)||[]).length!==1) P(wq,'fill needs exactly one ___');
   } else if(q.k==='tf'){ if(typeof q.t!=='boolean') P(wq,'tf needs t:true|false'); }
   else if(q.k==='match'){
    if(!q.p||q.p.length<3||q.p.length>4) P(wq,'match needs 3-4 pairs');
    else { const l0=q.p.map(p=>p[0]), r0=q.p.map(p=>p[1]); if(new Set(l0).size!==l0.length||new Set(r0).size!==r0.length) P(wq,'match labels must be unique'); [...l0,...r0].forEach(s=>{ if(s.length>27) P(wq,'match label too long: '+s); }); }
   } else if(q.k==='order'){
    if(!q.s||q.s.length<3||q.s.length>6) P(wq,'order needs 3-6 items');
    else { if(new Set(q.s).size!==q.s.length) P(wq,'order items must be unique'); q.s.forEach(s=>{ if(s.length>40) P(wq,'order item too long: '+s); }); }
   } else if(q.k==='tap'){
    if(!q.fig) P(wq,'tap needs a fig'); else { const z=F.zones(q.fig).map(z=>z[0]); if(z.indexOf(q.z)<0) P(wq,'zone "'+q.z+'" not in '+JSON.stringify(z)); }
    if(!q.zl) P(wq,'tap needs zl (what the right zone is called)');
    if(q.fig){ for(const z of F.zones(q.fig)){ const got=F.hit(q.fig,z[1]+z[3]/2,z[2]+z[4]/2,0,0,240,120); if(got!==z[0]) P(wq,'tapping the middle of zone "'+z[0]+'" lands on "'+got+'"'); } }
   } else P(wq,'unknown kind');
  });
 });
}
console.log(H.units.length+' units, '+nL+' lessons, '+nQ+' challenges. Kinds: '+JSON.stringify(kinds));
if(probs.length){ console.log('\nPROBLEMS ('+probs.length+'):\n'+probs.join('\n')); process.exit(1); }
console.log('content check: OK');
