/* HFQ r7.4: AIRCRAFT DRAWING AUDIT. Every aircraft a cadet can meet (the hangar fleet, the Hall of Flight, Plane Spotter) is
   drawn from a profile in meters (js/hfq_profiles*.js). This suite checks the drawings against the published numbers, so a
   landing gear that is too long or a mast that is too tall shows up as a failure instead of a guess:
     A1  every aircraft has a profile, and none is still marked for review (Plane Spotter only shows reviewed ones)
     A2  drawn overall length within 6% of the published length (helicopters: rotors turning; Lx when the length is defined differently)
     A3  drawn height within 10% of the published height (15% for numbers marked approx). The height is checked two ways,
         with and without the spinning propeller disc, because manufacturers publish it both ways ("prop vertical" or to the fin)
     A4  the ID card's printed length, span or rotor, and height agree with the drawing's numbers (within 3%)
     A5  every aircraft has an ID card with a source line
   Known, documented exceptions are listed in REVIEW with the reason; they are reported but do not fail.
   Run: cd web && python3 -m http.server 8777   then   node qa/hfq_ac_audit.js */
const { chromium } = require('playwright');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
/* published height whose measuring convention is not stated, so the drawing is not bent to fit it */
const REVIEW={
 t6:'North American T-6: the published 3.56 m height does not say what it is measured to; the drawing is 3.1 m to the propeller tip in the three-point attitude. Flagged for an expert check, not altered.'
};
(async()=>{
 const b=await chromium.launch(); const page=await (await b.newContext()).newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(BASE); await page.waitForFunction(()=>window.G&&G.HFQ&&G.HFQ.ACP&&G.HFQ.ACINFO&&document.getElementById('tapstart').style.display==='block',null,{timeout:20000});
 const rows=await page.evaluate(()=>{
  const H=G.HFQ, all=H.AC.concat(H.HALL), seen={}, out=[];
  const num=s=>{ const m=String(s||'').match(/([\d.]+)\s*m\b/); return m?+m[1]:null; };
  for(const m of all){ if(seen[m.id]) continue; seen[m.id]=1;
   const P=H.ACP[m.id], card=H.ACINFO[m.id]||null, r={id:m.id,name:m.name,profile:!!P,review:!!(P&&P.review),card:!!card,src:!!(card&&card.src)};
   if(P){ const d=P.dims||{}, e=H.profileExt(m.id), e2=H.profileExt(m.id,{noProp:true});
    r.dims=d; r.L=e.x1-e.x0; r.H=e.y1-Math.min(0,e.y0); r.H2=e2.y1-Math.min(0,e2.y0);
    if(card){ r.cL=num(card.L); r.cS=num(card.S); r.cH=num(card.Ht); } }
   out.push(r); }
  return out; });
 const res=[]; const ok=(c,l)=>res.push((c?'OK   ':'FAIL ')+l); const note=[];
 const pct=x=>(x>0?'+':'')+(x*100).toFixed(1)+'%';
 let missing=rows.filter(r=>!r.profile).map(r=>r.id), review=rows.filter(r=>r.review).map(r=>r.id);
 ok(!missing.length&&!review.length,'A1 '+rows.length+' aircraft, every one drawn from a reviewed profile'+(missing.length?' | no profile: '+missing.join(', '):'')+(review.length?' | marked review: '+review.join(', '):''));
 const badL=[], badH=[], badC=[];
 for(const r of rows){ if(!r.profile) continue; const d=r.dims;
  if(d.generic||d.plan) { note.push(r.id+': skipped ('+(d.generic?'generic shape':'drawn as a plan view')+')'); continue; }
  const Lr=d.Lx||d.L, eL=r.L/Lr-1; if(Math.abs(eL)>.06) badL.push(r.id+' '+r.L.toFixed(2)+' m vs '+Lr+' ('+pct(eL)+')');
  const tol=d.approx?.15:.10, eH1=r.H/d.H-1, eH2=r.H2/d.H-1, eH=Math.abs(eH1)<=Math.abs(eH2)?eH1:eH2;
  if(Math.abs(eH)>tol){ if(REVIEW[r.id]) note.push(r.id+' height '+pct(eH)+' (documented: '+REVIEW[r.id]+')'); else badH.push(r.id+' '+(Math.abs(eH1)<=Math.abs(eH2)?r.H:r.H2).toFixed(2)+' m vs '+d.H+' ('+pct(eH)+')'); }
  if(r.card){
   const near=(a,list)=>a==null||list.filter(v=>v!=null).some(v=>Math.abs(a/v-1)<=.03);
   if(!near(r.cL,[d.L,d.Lx,d.body])) badC.push(r.id+' card length '+r.cL+' m vs drawing '+[d.L,d.Lx,d.body].filter(Boolean).join('/'));
   if(!near(r.cS,[d.span,d.rotor,d.dia])) badC.push(r.id+' card span/rotor '+r.cS+' m vs drawing '+[d.span,d.rotor,d.dia].filter(Boolean).join('/'));
   if(!near(r.cH,[d.H])) badC.push(r.id+' card height '+r.cH+' m vs drawing '+d.H);
  }
 }
 ok(!badL.length,'A2 drawn lengths match the published lengths within 6%'+(badL.length?': '+badL.join('; '):''));
 ok(!badH.length,'A3 drawn heights match the published heights within 10% (15% approx)'+(badH.length?': '+badH.join('; '):''));
 ok(!badC.length,'A4 ID cards and drawings use the same numbers'+(badC.length?': '+badC.join('; '):''));
 const noCard=rows.filter(r=>!r.card||!r.src).map(r=>r.id);
 ok(!noCard.length,'A5 every aircraft has an ID card with sources'+(noCard.length?': missing '+noCard.join(', '):''));
 ok(!errs.length,'A6 no page errors'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
 console.log(res.join('\n'));
 if(note.length) console.log('\nNOTES\n'+note.map(n=>'  '+n).join('\n'));
 const pass=res.filter(l=>l.startsWith('OK')).length; console.log('\n'+pass+' / '+res.length+' passed');
 await b.close(); process.exit(pass===res.length?0:1);
})();
