/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE LIBRARY'S CONTENT API (moved out of content/books/books.js in r7 so every content file is pure data).
   Content files call these at load time; the r7 build ships content as data (no eval) and replays the same calls.
     H.addShelves([{id, t, icon, kind?}])          a shelf; kind:'story' makes a fiction shelf
     H.addBooks([{...book}])                       books, in reading order; a book with an existing id replaces it
     H.extendBook(id, [sections], [questions])     more chapters / questions for a book that already exists */
(function(){
const H=G.HFQ=G.HFQ||{};
H.SHELVES=H.SHELVES||[]; H.BOOKS=H.BOOKS||[];
H.addShelves=function(list){ for(const s of list){ const i=H.SHELVES.findIndex(x=>x.id===s.id); if(i<0) H.SHELVES.push(s); else Object.assign(H.SHELVES[i],s); } };
H.addBooks=function(list){ for(const b of list){ b.kind=b.kind||'guide'; b.sec=b.sec||[]; b.quiz=b.quiz||[]; const i=H.BOOKS.findIndex(x=>x.id===b.id); if(i<0) H.BOOKS.push(b); else H.BOOKS[i]=b; } };
H.extendBook=function(id,sec,quiz){ const b=H.bookById(id); if(!b) return false; if(sec) b.sec=b.sec.concat(sec); if(quiz) b.quiz=b.quiz.concat(quiz); return true; };
H.bookById=id=>H.BOOKS.find(b=>b.id===id);
H.shelfBooks=sid=>H.BOOKS.filter(b=>b.shelf===sid);
/* THE BOOK SERIES (r7): the seven HypeTeen Flight Academy novels, free to read in the app once each is released.
     H.addSeries([{n, id, t, status:'soon'|'available', accent, art, file?, chapters?, words?, blurb?}])   (content/series.js)
     H.addSeriesText(id, {chapters:[{t, blocks:[{p}|{h}|{q}|{note}|{img,alt}|{fig}], links?:[{a, t}]}]})   (one lazy file per book)
   Lazy files live in js/content/lazy/series/ and load on demand (H.loadContent), so seven novels never slow the start. */
H.SERIES=H.SERIES||[]; H.SERIES_TEXT=H.SERIES_TEXT||{};
H.addSeries=function(list){ for(const b of list){ const i=H.SERIES.findIndex(x=>x.n===b.n); if(i<0) H.SERIES.push(b); else Object.assign(H.SERIES[i],b); } H.SERIES.sort((a,b)=>a.n-b.n); };
H.addSeriesText=function(id,data){ if(!id||!data||!Array.isArray(data.chapters)) return false; H.SERIES_TEXT[id]=data; return true; };
H.seriesBook=k=>H.SERIES.find(b=>b.id===k||b.n===k||String(b.n)===String(k));
})();
