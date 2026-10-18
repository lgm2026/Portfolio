/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THE APP'S IDENTITY AND VERSION (r7). One place for the user-facing name, the release, and the save-schema number.
   Internal identifiers from HypeTeen Flight Quarters are kept on purpose so every family's saved progress keeps working:
   the storage namespace (CONFIG.id 'hfq': hfq_roster_v1, hfq_acct_<id>, hfq_localdb_v1), the hfq_* file names, the G.HFQ
   object, and the made-up airport code KHFQ. See docs/04_MIGRATION_GUIDE.md. */
(function(){
const H=G.HFQ=G.HFQ||{};
H.VERSION={name:'HypeTeen Flight Academy', short:'HTFA', version:'7.4.1', schema:2, formerName:'HypeTeen Flight Quarters', released:'2026-10-17'};
H.FIELD={name:'ACADEMY FIELD', call:'ACADEMY', id:'KHFQ'};   // the made-up home airport: the name on the radio, and its identifier
})();
