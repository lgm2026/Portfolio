/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE TERMS GATE SCREEN (r7.4): the accessible HTML screen behind G.go('terms', {kind, next, nextArgs, guest, acct}).
   The rules for WHEN it appears live in hfq_terms.js (every way into the academy, guests included). This file is the screen:
   - kind 'lead'     the first adult on the device (or a new Terms version at sign-in): the privacy summary in plain words, the
                     Cadet Pledge, then the full Terms in a scrolling box. ACCEPT stays disabled until the full text has been
                     scrolled to its end AND both boxes are ticked (an adult of 18+, responsible for the cadets; has read and
                     agrees to this version). The boxes start unticked; nothing is implied.
   - kind 'guardian' the same screen for a guest visit on a device with no Family Lead yet: a parent or guardian accepts for
                     guest visits on this device (G.roster.guestTerms), and the guest's pledge is recorded with it.
   - kind 'pledge'   a cadet (a new one enrolling, a guest, or a cadet signing in after the Terms changed): the six pledge
                     lines, who accepted the full Terms and when, the full text one tap away, and one unticked box.
   Every acceptance writes a receipt (version, date, text fingerprint): see hfq_terms.js. NOT NOW / BACK returns to the title
   (or the sign-in list), and Escape does the same. The screen reader hears the title, the status line and every control. */
(function(){
const H=G.HFQ, UI=H.UI, h=UI.h;
UI.host('terms',a=>({view:'gate',args:{kind:a.kind||(a.lead?'lead':'pledge'),next:a.next||'title',nextArgs:a.nextArgs||{},guest:!!a.guest,acct:a.acct||null},root:true,back:null}));
function fullTerms(){ const T=H.TERMS, box=h('div',{class:'termsbox',tabindex:'0',role:'region','aria-label':'The full Terms of Use, version '+T.version+'. Scroll to the end.'});
 box.appendChild(h('p',{class:'small muted',text:'Version '+T.version+' • '+T.date+' • Publisher: '+T.operator+' • Contact: '+T.contact}));
 if(T.notice) box.appendChild(h('p',{},h('b',{text:'Notice: '}),T.notice));
 for(const sec of T.sections){ box.appendChild(h('h3',{text:sec.h})); sec.p.forEach(p=>box.appendChild(h('p',{text:p}))); }
 box.appendChild(h('p',{class:'small muted end',text:'End of the Terms of Use.'}));
 return box; }
function pledgeList(){ const ol=h('ol',{class:'pledge'}); H.TERMS.pledge.forEach(l=>ol.appendChild(h('li',{text:l}))); return ol; }
function check(id,label){ const i=h('input',{type:'checkbox',id}); return {box:h('label',{class:'check',for:id},i,h('span',{text:label})),input:i}; }
function leave(a){ AUDIO.sfx('back'); UI.reset(); G.go(G.roster.accounts.length&&a.next==='login'?'login':'title',{gateSeen:true}); }
/* on to where the cadet was going: sign-up and sign-in learn that the gate was passed (termsOk; pledged for a cadet's sign-up).
   The Family Lead accepting at ENROLL is the first profile, so no pledge follows for them. */
function proceed(a){ AUDIO.sfx('ok'); UI.reset(); const args=Object.assign({},a.nextArgs,a.next==='signup'||a.next==='login'?{termsOk:true}:{},a.next==='signup'&&a.kind==='pledge'?{pledged:true}:{});
 G.go(a.next,args,true); }
UI.define('gate',{ back:false,
 title:a=>a.kind==='pledge'?'The Cadet Pledge':'Before you start',
 sub:a=>a.kind==='pledge'?'Read it, then promise':(a.kind==='guardian'?'For a parent or guardian':'For an adult • Terms version '+H.TERMS.version),
 onEscape:a=>{ leave(a); return true; },
 render(a){ const T=H.TERMS, M=h('main',{class:'gate'}), r=G.roster&&G.roster.terms;
  if(a.kind==='pledge'){
   M.appendChild(h('p',{class:'lede',text:a.guest?'Welcome, guest cadet! Before you look around, read the Cadet Pledge. These are the academy’s rules, in your words.':'Read every line. When you have read them all, tick the box and tap I promise.'}));
   M.appendChild(pledgeList());
   const who=a.guest&&!H.termsAccepted()&&G.roster.guestTerms?('A parent or guardian accepted the full Terms of Use (version '+G.roster.guestTerms.v+') for guest visits on this device on '+UI.date(G.roster.guestTerms.at)+'.'):(r?('Your Family Lead accepted the full Terms of Use (version '+r.v+') on '+UI.date(r.at)+'.'):'');
   const det=h('details',{class:'note'},h('summary',{text:'Read the full Terms of Use'}),fullTerms());
   if(T.notice) M.appendChild(h('div',{class:'note warn',role:'note',style:{marginTop:'12px'}},h('b',{text:'Please read first. '}),T.notice));
   M.appendChild(h('div',{class:'note',style:{marginTop:'12px'}},who+' You can read them any time in Settings.'));
   M.appendChild(det);
   const c1=check('gate-pledge','I read the Cadet Pledge and I promise to follow it.');
   const go=h('button',{class:'btn primary',type:'button',disabled:true,onclick:()=>{ if(!c1.input.checked) return;
     if(a.guest) H.recordGuestPledge('pledge'); else if(a.next==='signup') H.recordPledge('CADET'); else if(a.acct){ const A=G.roster.accounts.find(x=>x.id===a.acct)||G.activeAcct; H.recordAcctTerms(A,'cadet'); H.recordPledge(A?A.name:'CADET'); }
     proceed(a); }},'I promise');
   const status=h('p',{class:'status small',role:'status','aria-live':'polite',text:'Tick the box to continue.'});
   c1.input.addEventListener('change',()=>{ go.disabled=!c1.input.checked; status.textContent=c1.input.checked?'Ready. Tap I promise.':'Tick the box to continue.'; });
   M.appendChild(h('section',{class:'card flat',style:{marginTop:'14px'}},c1.box,status,h('div',{class:'row'},go,h('button',{class:'btn ghost',type:'button',onclick:()=>leave(a)},a.next==='signup'?'Back':'Not now'))));
   return M; }
  // the adult's screen: lead or guardian. The accuracy notice comes first (r7.4.1).
  if(T.notice) M.appendChild(h('div',{class:'note warn',role:'note',style:{marginBottom:'12px'}},h('b',{text:'Please read first. '}),T.notice));
  M.appendChild(h('p',{class:'lede',text:a.kind==='guardian'?'Someone wants to visit as a guest, and no Family Lead has set up this device yet. A parent or guardian should read this page and decide. Accepting covers guest visits on this device for this version of the Terms.':'HypeTeen Flight Academy is a learning game for cadets aged about 10 to 14. A parent or guardian should read this page, with the cadet if you like, and decide for the household.'}));
  M.appendChild(h('h2',{text:'Privacy, in plain words'}));
  const ul=h('ul',{class:'plain'}); H.privacyPlain.forEach(l=>ul.appendChild(h('li',{text:l}))); M.appendChild(h('div',{class:'card flat'},ul));
  M.appendChild(h('h2',{text:'The Cadet Pledge'}));
  M.appendChild(h('p',{class:'small muted',text:'What every cadet promises. '+(a.kind==='guardian'?'Please go over it with the guest.':'Each cadet reads and promises it when they join.')}));
  M.appendChild(pledgeList());
  M.appendChild(h('h2',{text:'The full Terms of Use'}));
  const box=fullTerms(); M.appendChild(box);
  const status=h('p',{class:'status small',role:'status','aria-live':'polite'});
  const c1=check('gate-adult',a.kind==='guardian'?'I am a parent or legal guardian, 18 or older, and I am responsible for the guest using this device.':'I am 18 or older, and I am the parent or legal guardian of (or otherwise responsible for) the cadets who use this app on this device.');
  const c2=check('gate-agree','I have read the privacy information and the Terms of Use (version '+T.version+') above, and I agree to them'+(a.kind==='guardian'?' for guest visits on this device.':' for our household.'));
  let read=false;
  const go=h('button',{class:'btn primary',type:'button',disabled:true,onclick:()=>{ if(!(read&&c1.input.checked&&c2.input.checked)) return;
    if(a.kind==='guardian'){ H.acceptGuestTerms(); H.recordGuestPledge('guardian'); } else { H.acceptTerms('FAMILY LEAD','lead'); if(G.activeAcct&&G.activeAcct.owner) H.recordAcctTerms(G.activeAcct,'lead'); }
    proceed(a); }},'Accept and continue');
  const sync=()=>{ const need=[]; if(!read) need.push('scroll to the end of the Terms'); if(!c1.input.checked||!c2.input.checked) need.push('tick both boxes');
   go.disabled=need.length>0; status.textContent=need.length?'To continue, '+need.join(' and ')+'.':'Ready. Accepting is recorded on this device only.'; };
  const atEnd=()=>box.scrollTop+box.clientHeight>=box.scrollHeight-8;
  box.addEventListener('scroll',()=>{ if(!read&&atEnd()){ read=true; AUDIO.sfx('ok'); sync(); } },{passive:true});
  c1.input.addEventListener('change',sync); c2.input.addEventListener('change',sync);
  M.appendChild(status);
  M.appendChild(h('section',{class:'card flat'},c1.box,c2.box,h('div',{class:'row'},go,h('button',{class:'btn ghost',type:'button',onclick:()=>leave(a)},'Not now'))));
  M.appendChild(h('p',{class:'tiny muted',style:{marginTop:'14px'},text:'Accepting is recorded on this device only: the version, the date and a fingerprint of the exact text. Nothing is sent anywhere. Accepting these Terms does not replace your own judgment about what is right for your family, and the Publisher does not collect personal information from children.'}));
  setTimeout(()=>{ if(!read&&atEnd()){ read=true; } sync(); },60);   // a tall screen can show it all at once
  return M; }
});

/* r7.4.1: the welcome page is gone, so its two-line caution (call signs and PINs; parents enroll first) sits on the title
   screen itself, in the band under SETTINGS. Drawn by this rendition file so the shell's title scene stays untouched. */
(function(){ const T=G.scenes.title, C=G.C; if(!T||T._caution) return; T._caution=true; const od=T.draw;
 T.draw=function(c){ od.call(this,c); const W=(G.CFG.welcome||[]).map(l=>String(l).replace(/\*\*/g,'')); if(!W.length) return;
  const L=this.layout(), last=L.btns[L.btns.length-1], top=last?last.y+last.h+8:G.VH-80, size=5.6, lh=8.2;
  const lines=[]; W.forEach(t=>G.wrap(t,size,G.VW-56,600).forEach(x=>lines.push(x)));
  const h=lines.length*lh+12, first=L.btns[0], room=first&&L.plateH?first.y-L.plateH:0;
  const y=room>=h+16?first.y-h-10:top;   // above ENROLL when the painting leaves room for it (tall phones), else right under SETTINGS
  G.rrect(18,y,G.VW-36,h,8); c.fillStyle=G.rgba(C.bg,.55); c.fill(); c.strokeStyle=G.rgba(C.accent,.45); c.lineWidth=1; c.stroke();
  lines.forEach((t,i)=>G.txt(t,G.VW/2,y+6+i*lh+1,size,C.sub,'center',G.VW-52,600)); }; })();

/* the Terms stay readable afterwards: Settings > Terms of Use and privacy shows the receipts and the full text */
UI.host('termsRead',a=>({view:'termsread',args:{},back:a.back||'settings'}));
UI.define('termsread',{ title:'Terms of Use', sub:()=>'Version '+H.TERMS.version+' • '+H.TERMS.date,
 render(){ const M=h('main',{});
  M.appendChild(h('h2',{text:'What was accepted on this device'}));
  const pre=h('div',{class:'card flat receipt'}); H.termsReceipt().split('\n').forEach(l=>pre.appendChild(h('p',{class:'small',text:l}))); M.appendChild(pre);
  M.appendChild(h('h2',{text:'Privacy, in plain words'})); const ul=h('ul',{class:'plain'}); H.privacyPlain.forEach(l=>ul.appendChild(h('li',{text:l}))); M.appendChild(h('div',{class:'card flat'},ul));
  M.appendChild(h('h2',{text:'The Cadet Pledge'})); M.appendChild(pledgeList());
  M.appendChild(h('h2',{text:'The full Terms of Use'})); const box=fullTerms(); box.classList.add('open'); M.appendChild(box);
  return M; }
});
})();
