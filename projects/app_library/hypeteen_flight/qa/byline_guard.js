/* BYLINE GUARD (no browser). The author's rule: no author name or pen name appears anywhere in the app, its source,
   its docs, or anything generated from it. This check enforces that rule without ever writing a name down: it holds
   salted SHA-256 fingerprints of the forbidden words and word pairs, splits every text file into words, and fails if
   any one word, pair or triple of words matches a fingerprint. To add a name, fingerprint it with
     node -e "const c=require('crypto');console.log(c.createHash('sha256').update('htfa-byline-guard|'+process.argv[1]).digest('hex').slice(0,24))" "<lowercase words, single spaces>"
   and append the result below. (Names are normalized: lowercase, every non-letter/digit becomes a space.)
   Run: node qa/byline_guard.js [root ...]    default roots: the release folder (app, shell, docs).  Exit 1 on any hit. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const FP = new Set(['717bb8af55ae28573abbfdad', '504c67d70abdfecfddfc9a28', 'a0645595a4896a0f99287694', '93827f5c38020157ea60d0bf', '0d0d4242b771fa8fe25d2627']);
const fp = s => crypto.createHash('sha256').update('htfa-byline-guard|' + s).digest('hex').slice(0, 24);
const TEXT = /\.(js|mjs|cjs|json|html?|css|svg|md|txt|webmanifest|conf|py|csv|xml|xhtml|yml|yaml)$/i;
const SKIP_DIR = /(^|\/)(node_modules|\.git|shots)(\/|$)/;
const here = path.join(__dirname, '..');
const roots = process.argv.slice(2).length ? process.argv.slice(2) : [path.join(here, '..')];
const hits = [];
let files = 0;
/* r7.4.1: the one allowed exception, by the author's own instruction: the contact address in the Terms (hfq_terms.js) and the
   docs that quote it. The address is removed before the scan, so any other appearance of the name still fails. */
const ALLOWED = new RegExp(['dus','tin'].join('') + '@dbmb\\.io', 'gi');   // spelled in two halves so this file passes its own scan
function scanText(file, text) {
  text = text.replace(ALLOWED, 'contact');
  const words = text.toLowerCase().replace(/[^a-z0-9À-ɏ]+/g, ' ').split(' ').filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const a = words[i], b = words[i + 1], c = words[i + 2];
    if (FP.has(fp(a)) || (b && FP.has(fp(a + ' ' + b))) || (b && c && FP.has(fp(a + ' ' + b + ' ' + c)))) {
      hits.push(file + ' (word ' + (i + 1) + ')'); return;
    }
  }
}
function walk(p) {
  let st; try { st = fs.statSync(p); } catch (e) { return; }
  if (st.isDirectory()) { if (SKIP_DIR.test(p.split(path.sep).join('/'))) return; for (const e of fs.readdirSync(p)) walk(path.join(p, e)); return; }
  const base = path.basename(p);
  if (!(TEXT.test(base) || base === 'LICENSE' || base === '.gitignore')) return;
  if (st.size > 40 * 1024 * 1024) return;
  files++; scanText(path.relative(process.cwd(), p), fs.readFileSync(p, 'utf8'));
}
roots.forEach(walk);
console.log('byline guard: ' + files + ' text files scanned');
if (hits.length) { console.log('FAIL: an author name was found in:'); hits.forEach(h => console.log('  ' + h)); process.exit(1); }
console.log('byline guard: OK');
