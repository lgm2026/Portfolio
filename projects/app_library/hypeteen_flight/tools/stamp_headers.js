#!/usr/bin/env node
/* Puts the copyright header on every app source file (idempotent). Run after adding files:  node tools/stamp_headers.js
   Shell files (app-shell) get the same header in both places so shell parity holds. */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..'), HDR='/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */\n';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const dirs=[path.join(ROOT,'web','js'),path.join(ROOT,'app-shell','web','js'),path.join(ROOT,'..','app-shell','web','js')].filter(fs.existsSync);
let n=0; for(const d of dirs) for(const f of walk(d)) if(f.endsWith('.js')){ const s=fs.readFileSync(f,'utf8'); if(!s.startsWith(HDR)){ fs.writeFileSync(f,HDR+s); n++; } }
for(const h of [path.join(ROOT,'web','index.html'),path.join(ROOT,'app-shell','web','index.html'),path.join(ROOT,'..','app-shell','web','index.html')].filter(fs.existsSync)){ const s=fs.readFileSync(h,'utf8'); const c='<!-- HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary; see LICENSE. -->\n'; if(!s.includes(c)){ fs.writeFileSync(h,s.replace('<!doctype html>\n','<!doctype html>\n'+c)); n++; } }
console.log('stamped '+n+' files');
