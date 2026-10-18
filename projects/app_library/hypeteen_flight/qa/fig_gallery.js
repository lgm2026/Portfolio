/* QA: renders every Ground School figure (and its tap zones) to qa/shots/figs_*.png for a visual check.
   Run with the server up: node qa/fig_gallery.js */
const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const BASE=process.env.BASE_URL||'http://localhost:8777/';
const S=path.join(__dirname,'shots')+'/'; fs.mkdirSync(S,{recursive:true});
const SPECS=[
 {f:'planeSide',labels:true},{f:'planeTop',labels:true},{f:'forces'},{f:'wing',aoa:8,angle:true,labels:true},{f:'wing',aoa:18,stall:true},
 {f:'axes'},{f:'cockpit',labels:true},{f:'gauge',g:'asi',v:100},{f:'gauge',g:'alt',v:2500},{f:'gauge',g:'ai',bank:20},{f:'gauge',g:'ai',pitch:10},
 {f:'gauge',g:'tc',turn:1,ball:0},{f:'gauge',g:'tc',turn:0,ball:-1},{f:'gauge',g:'hi',v:90},{f:'gauge',g:'vsi',v:500},{f:'gauge',g:'vsi',v:-1000},
 {f:'sixpack',labels:true},{f:'runway',num:'27',labels:true},{f:'sign',s:[{k:'mandatory',t:'9-27'},{k:'location',t:'B'},{k:'direction',t:'A',arrow:'r'}],labels:true},
 {f:'holdshort',labels:true},{f:'lights',labels:true},{f:'pattern'},{f:'sock',kts:10,arrows:true,labels:true},{f:'sock',kts:0},{f:'sock',kts:15,from:'left'},
 {f:'clouds',labels:true},{f:'clouds',only:'cirrus'},{f:'clouds',only:'cb'},{f:'fronts',labels:true},{f:'compass',hdg:225,labels:true},{f:'sectional',labels:true},
 {f:'airspace'},{f:'row'},{f:'navlights',labels:true},{f:'navlights',quiz:true},{f:'cg',shift:'aft'},{f:'hothigh'},{f:'imsafe'},
 {f:'craft',t:'heli',labels:true},{f:'craft',list:['airplane','glider','balloon','airship']},{f:'craft',list:['heli','tiltrotor','trike','ppc'],labels:true},{f:'craft',list:['gyro','glider'],labels:true}
];
(async()=>{
 const b=await chromium.launch();
 const page=await (await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2})).newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(BASE); await page.waitForFunction(()=>document.getElementById('tapstart').style.display==='block');
 await page.evaluate(()=>{ const b=document.getElementById('tapstart'); if(b&&b.offsetParent) b.click(); }); await page.waitForFunction(()=>G.sceneName==='terms'||G.sceneName==='title',null,{timeout:15000}); await page.evaluate(()=>{ if(G.sceneName==='terms'){ G.HFQ.acceptTerms('QA','lead'); G.go('title',{gateSeen:true},true); } }); await page.waitForTimeout(400);
 const per=4;
 for(let i=0;i<SPECS.length;i+=per){
  await page.evaluate(([specs,zones])=>{
   G.scenes.figqa={enter(){},update(){},draw(c){ G.backdrop(.9); specs.forEach((s,k)=>{ const y=8+k*118; G.rrect(10,y,250,112,8); c.fillStyle='rgba(255,255,255,.05)'; c.fill();
     G.FIG.draw(c,s,12,y+2,246,108,zones?G.FIG.zones(s).map(z=>({id:z[0],col:'rgba(255,80,200,.7)'})):null); G.txt(JSON.stringify(s).slice(0,60),14,y+100,4.4,'#888','left'); }); }};
   if(G.HFQ.acceptGuestTerms&&!G.HFQ.guestTermsOk()){ G.HFQ.acceptGuestTerms(); G.HFQ.recordGuestPledge('qa'); }   // r7.4: every scene past sign-in sits behind the Terms gate
   G.go('figqa',{},true);
  },[SPECS.slice(i,i+per),false]);
  await page.waitForTimeout(250); await page.screenshot({path:S+'figs_'+String(i/per).padStart(2,'0')+'.png'});
  await page.evaluate(specs=>{ G.scenes.figqa.draw=function(c){ G.backdrop(.9); specs.forEach((s,k)=>{ const y=8+k*118; G.FIG.draw(c,s,12,y+2,246,108,G.FIG.zones(s).map(z=>({id:z[0],col:'rgba(255,80,200,.8)'}))); }); }; },SPECS.slice(i,i+per));
  await page.waitForTimeout(150); await page.screenshot({path:S+'figz_'+String(i/per).padStart(2,'0')+'.png'});
 }
 console.log('figures:',SPECS.length,'errors:',errs.length?errs.join(' | '):'none');
 await b.close();
})();
