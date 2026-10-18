/* Loads the HFQ content files (units, figures, lessons) into a stub G with no browser.
   Shared by content_check.js and content_audit.js so the load list lives in one place. */
const fs=require('fs'), path=require('path');
const W=path.join(__dirname,'..','..','web','js')+'/';
const G={HFQ:{},C:{},scenes:{},cardSub:{},cardBadge:{},worldArt:{wall:{},floor:{}},groundSchool:{reg:{},register(id,g){ this.reg[id]=g; }},
 rgba:()=>'',shade:()=>'',txt(){},rrect(){},icon(){},wrap:s=>[s],tw:(s,z)=>String(s).length*z*.62,save:{mod:{}},CFG:{}};
const load=f=>new Function('G',fs.readFileSync(W+f,'utf8'))(G);
['hfq_data.js','hfq_figs.js','hfq_figs_heli.js','hfq_lessons.js'].forEach(load);
const CL=W+'content/lessons/';
/* the three original files first (units 1-13), then one file per newer unit, A to Z */
['core_1.js','core_2.js','core_3.js'].forEach(f=>load('content/lessons/'+f));
fs.readdirSync(CL).filter(f=>f.endsWith('.js')&&!/^core_/.test(f)).sort().forEach(f=>load('content/lessons/'+f));
module.exports={G,H:G.HFQ,F:G.FIG};
