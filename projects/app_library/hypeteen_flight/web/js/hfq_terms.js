/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* TERMS OF USE, TERMS AND CONDITIONS, AND INTELLECTUAL PROPERTY NOTICE, the acceptance receipts, and the gate's rules.
   r7.4: THE GATE COVERS EVERY WAY IN. Until r7.3 only ENROLL and SIGN IN passed the gate; VISIT AS GUEST went straight to the
   airfield. Now any move into the academy (the airfield, the Hub, a lesson, a game...) checks first:
   - a GUEST needs a current adult acceptance on this device (the Family Lead's, or a parent's or guardian's given for guest
     visits) AND the guest's own Cadet Pledge for this version, kept in the guest save;
   - a SIGNED-IN cadet needs the household's current acceptance AND their own record for this version (the Family Lead's is
     their household acceptance; every other cadet takes the Cadet Pledge again when the version changes);
   - ENROLL still opens the full Terms for the first adult, then the Cadet Pledge for everyone after.
   Every acceptance is an explicit act: scroll the full text to its end where it is shown, tick an unticked box, then press the
   button. Receipts record the version, the date and an FNV-1a fingerprint of the exact text, so changed text asks again.
   The gate screen itself is HTML (hfq_gate.js) so it works with screen readers and the keyboard. Nothing is sent anywhere.
   Bracketed items [like this] are for the publisher to fill in before release. This text is not legal advice; have counsel review it,
   including whether the household's arrangement meets the parental-consent rules that apply where the app is offered. */
(function(){
const H=G.HFQ, C=G.C;

H.TERMS={
 version:'1.3',
 date:'October 17, 2026',
 operator:'Hype Learning Academies',
 contact:'dustin@dbmb.io (dbmb.io)',
 site:'dbmb.io',
 /* r7.4.1: shown first, before anything else, on the gate and at the top of the full text */
 notice:'The aviation content in this App was independently gathered. Validation of lesson accuracy is pending. No guarantees or assurances of accuracy, completeness or fitness for any purpose are made. This App is not flight training and not an FAA course. For anything about this App, write to dustin@dbmb.io.',

 /* THE SHORT VERSION: read aloud to cadets at the gate, in their words */
 pledge:[
  'HypeTeen Flight Academy is a game for learning about flying. It is NOT real flight training, and the checkrides here are practice only.',
  'I use a made-up call sign, never my real name. I never type my address, school or phone number. Photos in my Flight Record stay on this device, and I ask before I add a photo of someone.',
  'Only the Family Lead posts to Hangar News. I am kind to the other cadets on my crew.',
  'XP is game points. It is not money, it cannot be bought or sold, and it has no value outside the game.',
  'The pictures, characters, airplanes, lessons, books, music and sounds belong to Hype Learning Academies. I do not copy them, share them, or pretend they are mine.',
  'An adult in my family (the Family Lead) has read the full rules and agreed to them for our household.'
 ],

 /* THE FULL TERMS: accepted by the Family Lead */
 sections:[
 {h:'1. Who we are and what this is',p:[
  'HypeTeen Flight Academy (the "App", formerly HypeTeen Flight Quarters) is an educational entertainment app published by Hype Learning Academies (the "Publisher", "we", "us"), the publisher of the HypeTeen Flight Academy books. The App is designed for young people roughly 10 to 14 years old, used within a family or small group ("Household") led by an adult ("Family Lead").',
  'These Terms of Use and Conditions (the "Terms") are a binding agreement between the Publisher and the Family Lead. The Family Lead accepts them on behalf of every member of the Household who uses the App on this device ("Cadets"). A Cadet who is a minor cannot enter into this agreement; the Family Lead is responsible for each Cadet\'s use and for making sure each Cadet understands the Cadet Pledge shown at the join gate.',
  'If you do not agree to these Terms, do not accept them and do not use the App.']},
 {h:'1a. Accuracy notice (read this first)',p:[
  'The aviation content in this App (lessons, questions, figures, aircraft facts, books and the crew\'s lines) was independently gathered from public sources such as FAA handbooks and manufacturer and museum publications. Validation of lesson accuracy is pending. No guarantees or assurances of accuracy, completeness, currency or fitness for any purpose are made, and nothing in the App is flight instruction, a substitute for an FAA-approved course, or advice to rely on in or near an aircraft. If you find an error, write to dustin@dbmb.io.']},
 {h:'2. Children, parents and the Family Lead',p:[
  'The Family Lead must be at least 18 years old and the parent or legal guardian of, or otherwise responsible for, each minor Cadet in the Household.',
  'By accepting, the Family Lead confirms: (a) they have read these Terms; (b) they consent to each Cadet\'s use of the App under these Terms; (c) they will supervise that use as they see fit; and (d) they will not allow a Cadet to enter personal information into the App (see Section 4).',
  'GUESTS. Someone may try the App as a guest without a profile. Before the first guest visit on a device, and again whenever these Terms change, a parent or legal guardian reads these Terms and accepts them for guest visits on that device, and the guest takes the Cadet Pledge. Guest progress is kept on the device like any other.',
  'The App is built so that it does not ask children for personal information. It uses made-up call signs and 4-digit PINs stored as a short one-way hash. A PIN keeps family members out of each other\'s profiles; it is not a security lock, and anyone with the device and some time could get past it. There is no free-text chat, no friend requests, and no messaging between devices. Photos in the Flight Record are off until the Family Lead turns them on for the device, and they never leave the device except inside a backup file the Family Lead makes.']},
 {h:'3. Not flight instruction. Not an FAA course.',p:[
  'The App is a game. It is not flight instruction, not an FAA-approved course, not ground school for any certificate or rating, and not a substitute for training with a certificated flight instructor. "Checkrides", "patches", "solo", "certificates" and similar terms inside the App are game features with no real-world standing.',
  'Aviation facts in the App are written for young learners and simplified. They may be incomplete or out of date. Never rely on the App for any real aircraft operation, flight planning, weather decision, or regulatory question. Real pilots use current official sources and a qualified instructor.',
  'The Publisher is not affiliated with, endorsed by, or sponsored by the Federal Aviation Administration or any aviation authority, airline, manufacturer, or school named or depicted in the App.']},
 {h:'4. Your information: it stays on the device',p:[
  'Everything the App saves - call signs, PIN hashes, progress, XP, patches, flight log and Flight Record entries, places visited, optional photos, reading positions and settings - is stored in the browser storage of the device you are using. The App does not have user accounts on a server, does not transmit your information to the Publisher, and does not contain advertising, trackers, or analytics software.',
  'Because the information lives only on this device: anyone who can unlock this device and knows a PIN can use that Cadet\'s profile; clearing the browser\'s site data, or deleting the App, permanently deletes all profiles and progress unless you have saved a backup file; and the Publisher cannot restore, transfer, or recover any of it.',
  'BACKUP FILES. Settings can save a backup file of one profile or the whole Household to a place you choose, and restore it on this or another device. A backup file contains that profile\'s records, notes and any photos it includes. Keep backup files private. You may protect a backup with a passphrase; it is then encrypted on the device (AES-256-GCM, with a key derived from the passphrase), and without the passphrase the Publisher cannot open it either. A backup\'s checksum detects damage; it does not prove that a file was not changed on purpose.',
  'The App makes no third-party requests: its fonts, artwork and maps are part of the App and work offline. Links to the websites of museums and other places in the Explorer open only when you tap them, in your browser, and need the internet; those websites have their own privacy terms.',
  'Where the App is served from the Publisher\'s own web server (for example from dbmb.io), that server records ordinary access logs as every web server does: the requesting network (IP) address, the date and time, the page requested, and the browser\'s user-agent string. The Publisher keeps these logs solely to operate and secure the service, to detect and investigate abuse, unauthorized copying and attacks, and to comply with law. They are retained for no more than 90 days, are never combined with call signs or game progress, are never used to profile, contact, or advertise to any user, and are never sold or shared except as required by law. This is the "support for internal operations" permitted by the Children\'s Online Privacy Protection Act (COPPA) and its Rule.',
  'The Publisher does not knowingly collect personal information from children under 13 beyond the access logs described above. If you believe a child has provided personal information to us, contact us and we will delete it.',
  'Do not type real names, addresses, schools, phone numbers, email addresses, or any other personal information anywhere in the App, including call signs, flight log notes, and Hangar News posts. The Family Lead is responsible for anything a member of the Household enters.']},
 {h:'5. Intellectual property notice and warning',p:[
  'IMPORTANT. READ THIS SECTION CAREFULLY.',
  'The App and everything in it are protected by copyright, trademark and other intellectual property laws of the United States and other countries. This includes, without limitation: the software and source code; the academy world, places, and layouts; every character, cadet, instructor, and aircraft design; all artwork, animations, icons, patches and badges; all of the lessons, briefing cards, questions, explanations and instructor tips; the Library books and their text; all music, sound effects and radio voices; the game designs, mechanics, names, and the look and feel of the App. All of it is owned by or licensed to the Publisher. All rights are reserved.',
  '"HypeTeen", "HypeTeen Flight Academy", "HypeTeen Flight Quarters", "Hype Learning Academies", the logos, and the character and aircraft names used in the App are trademarks or trade dress of the Publisher. Nothing in these Terms gives you any right to use them.',
  'You may use the App for personal, non-commercial, educational entertainment within your Household. You may NOT, and may not help or allow anyone else to: copy, reproduce, download, extract, scrape, screenshot-compile, record, or republish the lessons, questions, books, art, audio, or code, in whole or in part; sell, rent, license, lend, or distribute the App or any of its content; modify, translate, adapt, or create derivative works from it; decompile, reverse engineer, or otherwise attempt to obtain the source of any part not already provided to you in readable form; remove or alter any copyright, trademark, or other notice; use any content to train, fine-tune, prompt, or evaluate an artificial intelligence or machine learning system; present any of the content as your own, or use it in a classroom, club, camp, product, or publication without a written license from the Publisher; or use the App for any unlawful purpose.',
  'The App contains notices, identifiers, and build fingerprints that identify copies of its content. Copies found outside the App, or content reproduced without permission, can be traced to their source. Unauthorized use is infringement and may also violate the Digital Millennium Copyright Act (17 U.S.C. 1201) and state law. The Publisher actively protects its works and will pursue remedies including injunctions, statutory damages of up to $150,000 per work for willful infringement, and recovery of attorneys\' fees, to the fullest extent the law allows.',
  'Teachers, clubs, and organizations that would like to use the App or its content with young people are welcome to ask. Write to us at the contact address below.',
  'If you believe material in the App infringes your copyright, send a notice containing the information required by 17 U.S.C. 512(c)(3) to the contact address below.']},
 {h:'6. Call signs, XP, and game rules',p:[
  'Call signs are made-up game names chosen from, or in the style of, the App\'s word lists. They are not a form of identity, carry no rights, and may be refused, changed, or reset by the Family Lead or by the Publisher in a future version. The App rejects names that look like personal information; do not try to work around that.',
  'XP, patches, badges, phases, stars, and every other score or reward in the App ("Game Items") are game features only. They have no monetary value, cannot be purchased, sold, traded, transferred, cashed out, or exchanged for anything, and may be changed, limited, or reset by an update. Game XP is capped each day by design. Nothing in the App is a wager, a prize, or a chance-based reward.',
  'You agree not to tamper with the App\'s storage, code, save files, or backup files to alter progress, Game Items, or another Cadet\'s profile, and not to use bots, scripts, or automation to play.']},
 {h:'7. Household conduct',p:[
  'Only the Family Lead may post to Hangar News. There is no free-text chat by design; do not attempt to add one. Cadets must be respectful of one another. The Family Lead may remove any Cadet profile from the device at any time.',
  'The App must not be used to bully, harass, impersonate, or frighten anyone, or to enter, store, or display content that is hateful, sexual, violent, or otherwise unsuitable for children.']},
 {h:'8. Health and safety',p:[
  'Take breaks. The App is designed for short sessions and encourages stopping. The Family Lead decides how long and how often Cadets may play.',
  'The App uses animation, moving graphics and sound. A small number of people may experience discomfort or seizures from flashing or patterned light; stop immediately and consult a doctor if a user feels dizzy, disoriented, or unwell. A reduce-motion setting is provided.',
  'Never use the App while operating any vehicle or aircraft, and never let a game distract from real-world safety.',
  'The Explorer lists real places. Cadets visit them only with a parent or guardian. Opening hours, entry rules (some places are on military bases and need ID), prices and safety information change: check with each place before you go. Some places are memorials; visit them quietly and respectfully. The App never suggests visiting crash sites, restricted areas, or private property.']},
 {h:'9. Updates, changes and availability',p:[
  'The Publisher may update, change, add to, or remove features or content of the App, or stop offering the App, at any time and without notice. Updates may change or reset Game Items and progress.',
  'The Publisher may change these Terms. When the Terms change, the App shows the new version at the next sign-in or guest visit and asks the Family Lead (or, for guest visits, a parent or guardian) to accept again before anyone continues, and each Cadet takes the Cadet Pledge again. The version and date appear at the top of the Terms.',
  'Each acceptance is recorded on the device: the version, the date and time, who accepted (the Family Lead, a guardian for guest visits, or a Cadet\'s pledge) and a fingerprint of the exact text accepted. Nothing about it is sent anywhere. Settings shows the record.']},
 {h:'10. Disclaimer of warranties',p:[
  'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE", WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, THE PUBLISHER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, NON-INFRINGEMENT, AND THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT PROGRESS WILL BE PRESERVED. THE PUBLISHER MAKES NO WARRANTY THAT ANY INFORMATION IN THE APP IS CORRECT, COMPLETE, OR SUITABLE FOR ANY REAL-WORLD AVIATION PURPOSE.',
  'Some jurisdictions do not allow certain warranty exclusions, so some of the above may not apply to you.']},
 {h:'11. Limitation of liability',p:[
  'TO THE FULLEST EXTENT PERMITTED BY LAW, THE PUBLISHER, ITS OWNERS, AUTHORS, CONTRACTORS AND LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, PROGRESS, GAME ITEMS, PROFITS, OR GOODWILL, ARISING OUT OF OR RELATED TO THE APP OR THESE TERMS, HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE PUBLISHER\'S TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE APP WILL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID THE PUBLISHER FOR THE APP IN THE TWELVE MONTHS BEFORE THE CLAIM OR TWENTY-FIVE U.S. DOLLARS ($25).',
  'Nothing in these Terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence, or for fraud.']},
 {h:'12. Responsibility for your Household',p:[
  'The Family Lead agrees to be responsible for the Household\'s use of the App and to compensate the Publisher for losses, costs and reasonable attorneys\' fees arising from a Household member\'s breach of Section 5 (Intellectual Property), Section 6 (tampering and automation), or Section 7 (conduct), or from any unlawful use of the App by a Household member.']},
 {h:'13. Termination',p:[
  'These Terms apply from acceptance until the App is removed from the device. The Publisher may suspend or end your right to use the App at any time if these Terms are breached. Sections 4 through 7 and 10 through 15 survive termination.']},
 {h:'14. Governing law and disputes',p:[
  'These Terms are governed by the laws of the State of South Carolina and applicable United States federal law, without regard to conflict-of-law rules. [Confirm state with counsel.]',
  'Before filing any claim, you agree to contact the Publisher and to try in good faith to resolve the matter informally for at least 30 days. Any claim that is not resolved informally will be brought in the state or federal courts located in Horry County, South Carolina, and you consent to their jurisdiction, except that either side may seek an injunction to protect intellectual property in any court with jurisdiction, and you may bring a qualifying claim in small-claims court where you live. [Counsel may advise adding an arbitration clause and class-action waiver; none is included here.]']},
 {h:'15. General',p:[
  'These Terms, together with any notices displayed in the App, are the entire agreement between you and the Publisher about the App. If any part of these Terms is found unenforceable, the rest remains in effect and the unenforceable part is enforced to the maximum extent permitted. The Publisher\'s failure to enforce a provision is not a waiver of it. You may not assign these Terms; the Publisher may assign them to a successor of the App or the business. Headings are for convenience only. "Including" means "including without limitation."']},
 {h:'16. Contact',p:[
  'Questions, licensing requests, privacy requests, error reports and legal notices: Hype Learning Academies, dustin@dbmb.io. Website: dbmb.io.',
  'Copyright (c) 2026 Hype Learning Academies. All rights reserved.']}
 ]
};

/* the full text as one document (what gets hashed and shown) */
H.termsText=function(){
 const T=H.TERMS, out=[];
 out.push('HYPETEEN FLIGHT ACADEMY','TERMS OF USE, TERMS AND CONDITIONS, AND INTELLECTUAL PROPERTY NOTICE','Version '+T.version+' • '+T.date+' • Publisher: '+T.operator+' • Contact: '+T.contact,'');
 if(T.notice) out.push('NOTICE: '+T.notice,'');
 out.push('THE SHORT VERSION (THE CADET PLEDGE)',''); T.pledge.forEach((l,i)=>out.push((i+1)+'. '+l)); out.push('');
 out.push('THE FULL TERMS (FOR THE FAMILY LEAD)','');
 for(const s of T.sections){ out.push(s.h.toUpperCase(),''); s.p.forEach(p=>out.push(p,'')); }
 return out.join('\n');
};
/* FNV-1a over the exact text: a cheap fingerprint of what was accepted */
H.termsHash=function(txt){ let x=2166136261>>>0; txt=txt||H.termsText(); for(let i=0;i<txt.length;i++){ x^=txt.charCodeAt(i); x=Math.imul(x,16777619)>>>0; } return ('0000000'+x.toString(16)).slice(-8); };
/* ---------- receipts ----------
   household: G.roster.terms = {v, date, hash, at, by, role:'lead', pledges:[{by, at}]}   (the Family Lead, at enrollment or a version change)
   guest visits: G.roster.guestTerms = {v, date, hash, at, role:'guardian'}               (a parent or guardian, for guest play on this device)
   the guest's own pledge: the guest save, G.save.mod.terms = {v, hash, at, kind:'pledge'|'guardian'}
   each profile: account.terms = {v, hash, at, role:'lead'|'cadet'}                       (r7.4: account-level, so every cadet re-pledges on a new version) */
const cur=r=>!!(r&&r.v===H.TERMS.version&&r.hash===H.termsHash());
H.termsAccepted=function(){ return cur(G.roster&&G.roster.terms); };                     // the household's acceptance (unchanged meaning)
H.guestDeviceOk=function(){ return H.termsAccepted()||cur(G.roster&&G.roster.guestTerms); };
H.guestPledgeOk=function(){ const t=G.save&&G.save.mod&&G.save.mod.terms; return cur(t); };
H.guestTermsOk=function(){ return H.guestDeviceOk()&&H.guestPledgeOk(); };
H.acctTermsOk=function(a){ a=a||G.activeAcct; if(!a) return H.guestTermsOk(); if(!H.termsAccepted()) return false; return cur(a.terms); };
H.acceptTerms=function(by,role){ G.roster.terms={v:H.TERMS.version,date:H.TERMS.date,hash:H.termsHash(),at:Date.now(),by:by||'',role:role||'lead',pledges:(G.roster.terms&&G.roster.terms.v===H.TERMS.version&&G.roster.terms.pledges)||[]}; return G.saveRoster(); };
H.recordPledge=function(by){ const r=G.roster.terms; if(!r) return false; r.pledges=r.pledges||[]; r.pledges.push({by,at:Date.now()}); return G.saveRoster(); };
H.acceptGuestTerms=function(){ G.roster.guestTerms={v:H.TERMS.version,date:H.TERMS.date,hash:H.termsHash(),at:Date.now(),role:'guardian'}; return G.saveRoster(); };
H.recordGuestPledge=function(kind){ G.save.mod.terms={v:H.TERMS.version,hash:H.termsHash(),at:Date.now(),kind:kind||'pledge'}; return G.persist(); };
H.recordAcctTerms=function(a,role){ a=a||G.activeAcct; if(!a) return false; a.terms={v:H.TERMS.version,hash:H.termsHash(),at:Date.now(),role:role||(a.owner?'lead':'cadet')}; const i=(G.roster.accounts||[]).findIndex(x=>x.id===a.id); if(i>=0) G.roster.accounts[i].terms=a.terms; return G.saveRoster(); };
/* what the Family Lead can show if it is ever disputed */
H.termsReceipt=function(){ const r=G.roster&&G.roster.terms, g=G.roster&&G.roster.guestTerms, out=['HTFA TERMS RECEIPT','Current version '+H.TERMS.version+' ('+H.TERMS.date+'), text fingerprint '+H.termsHash()];
 out.push(r?('Household: version '+r.v+' accepted '+new Date(r.at).toLocaleString()+' by '+(r.by||'the Family Lead')+(cur(r)?'':' (an older version: it will be asked again)')):'Household: not accepted on this device yet');
 if(r&&r.pledges&&r.pledges.length) out.push('Cadet pledges: '+r.pledges.map(p=>p.by+' ('+new Date(p.at).toLocaleDateString()+')').join(', '));
 out.push(g?('Guest visits: version '+g.v+' accepted by a parent or guardian on '+new Date(g.at).toLocaleString()+(cur(g)?'':' (an older version)')):'Guest visits: not accepted on this device');
 for(const a of (G.roster&&G.roster.accounts)||[]) out.push('Profile '+a.name+': '+(a.terms?('version '+a.terms.v+' ('+(a.terms.role==='lead'?'Family Lead':'Cadet Pledge')+', '+new Date(a.terms.at).toLocaleDateString()+')'):'no record yet (asked at the next sign-in)'));
 return out.join('\n'); };
/* plain-words privacy, shown at the top of the gate (the full Terms, section 4, is the binding text) */
H.privacyPlain=[
 'The aviation content was independently gathered; lesson accuracy validation is pending; no guarantees or assurances are made. Contact: dustin@dbmb.io.',
 'Everything a cadet does is saved on this device only. There are no accounts on a server, no ads, no trackers and no analytics.',
 'Cadets use a made-up call sign and a 4-digit PIN. The app never asks for a real name, an email address, a school or a phone number.',
 'There is no chat between cadets. Only the Family Lead posts Hangar News. Photos in the Flight Record are off until an adult turns them on, and they never leave the device.',
 'When the app is opened from a website, that web server keeps ordinary visit logs (network address, time, page) for up to 90 days, only to run and protect the service.',
 'This is a game for learning about flying. It is not flight training and not an FAA course.'];

/* ---------- the gate: every way into the academy passes it (see the header) ---------- */
const FREE={title:1,login:1,signup:1,terms:1,termsRead:1,settings:1,prefs:1,page:1,backup:1};   // screens that are not the academy itself
const realGo=G.go;
G.go=function(name,args,instant){
 const ok=H.termsAccepted(), has=!!(G.roster&&G.roster.accounts&&G.roster.accounts.length);
 /* the join gate: no Terms on this device yet (or a new version) -> the full Terms, accepted by the adult; Terms in place -> the Cadet Pledge */
 /* r7.4.1: the full Terms come first, before ENROLL or VISIT AS GUEST can be tapped: the title itself opens the adult's gate on a device
    with no current acceptance (NOT NOW returns to the title with gateSeen, where the buttons ask again) */
 if(name==='title'&&!ok&&!(args&&args.gateSeen)) return realGo('terms',{next:'title',nextArgs:{gateSeen:true},kind:'lead'},instant);
 if(name==='signup'&&!(args&&args.termsOk)){
  if(!ok) return realGo('terms',{next:'signup',nextArgs:args||{},kind:'lead'},instant);
  if(!(args&&args.pledged)&&has) return realGo('terms',{next:'signup',nextArgs:args||{},kind:'pledge'},instant);   // the first profile is the Family Lead, who accepted at the title: no pledge for them
 }
 /* a changed version is accepted again at the next sign-in (Section 9) */
 if(name==='login'&&has&&!ok&&!(args&&args.termsOk)) return realGo('terms',{next:'login',nextArgs:args||{},kind:'lead'},instant);
 /* r7.4: going INTO the academy (anything that is not a sign-in screen) */
 if(!FREE[name]&&G.scenes[name]){
  const A=G.activeAcct;
  if(!A){ if(!H.guestTermsOk()) return realGo('terms',{next:name,nextArgs:args||{},kind:H.guestDeviceOk()?'pledge':'guardian',guest:true},instant); }
  else if(!H.acctTermsOk(A)){
   if(!ok) return realGo('terms',{next:name,nextArgs:args||{},kind:'lead'},instant);
   if(A.owner) H.recordAcctTerms(A,'lead');   // the Family Lead's own acceptance is the household's
   else return realGo('terms',{next:name,nextArgs:args||{},kind:'pledge',acct:A.id},instant);
  }
 }
 return realGo(name,args,instant);
};
/* a new profile is stamped with the version its holder just accepted (the household's for the Family Lead, the pledge for a cadet) */
const oAfter=G.afterSignup; G.afterSignup=function(a){ if(H.termsAccepted()) H.recordAcctTerms(a||G.activeAcct,(a||G.activeAcct||{}).owner?'lead':'cadet'); return oAfter?oAfter.apply(this,arguments):G.home(); };
(G.CFG.settingsLinks=G.CFG.settingsLinks||[]).push({id:'terms',label:'TERMS OF USE + PRIVACY',scene:'termsRead'});
/* the cadet version: the pledge in full, then where the adult's acceptance is recorded (kept for the printable record) */
H.termsPledgeText=function(){ const T=H.TERMS, r=G.roster&&G.roster.terms; const out=['THE CADET PLEDGE','Version '+T.version+' • '+T.date,'','Read every line. When you reach the end, tick the box and tap I PROMISE.','']; T.pledge.forEach((l,i)=>out.push((i+1)+'. '+l,'')); out.push('WHO AGREED FOR OUR HOUSEHOLD',''); out.push(r?('The Family Lead accepted the full Terms of Use (version '+r.v+') on '+new Date(r.at).toLocaleDateString()+'. Ask them if you want to read the whole thing. It is also in SETTINGS.'):'The Family Lead has not accepted the Terms yet.'); return out.join('\n'); };
})();
