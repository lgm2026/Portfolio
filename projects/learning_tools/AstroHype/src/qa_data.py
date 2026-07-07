# -*- coding: utf-8 -*-
import re, json, sys
HTML = "/mnt/user-data/outputs/AstroHype Space & Astronomy Education.html"
JSX = "/home/claude/astro/src/AstroHype.jsx"
html = open(HTML, encoding="utf-8").read()
m = re.search(r'<script type="application/json" id="sea-data">(.*?)</script>', html, re.S)
data = json.loads(m.group(1).replace("<\\/", "</"))

issues = []
warn = []
def bad(msg): issues.append(msg)
def w(msg): warn.append(msg)

L = data["__SEA_LESSONS__"]
META = data["__SEA_SPECIES_META__"]
ART = data["SEA_ART"]
UNITS_EXTRA = data["__SEA_UNITS_EXTRA__"]

# ---- counts ----
print("COUNTS: lessons=%d meta=%d art=%d units_extra=%d glossary=%d shells=%d" % (
  len(L), len(META), len(ART), len(UNITS_EXTRA), len(data["__SEA_GLOSSARY__"]), len(data["__SEA_SHELLS__"])))
if len(L) != 501: bad("lesson count %d != 501" % len(L))

# ---- engine SOURCES keys (parse from JSX) ----
sm = re.search(r'var SOURCES = \{(.*?)\n\};', open(JSX, encoding="utf-8").read(), re.S)
src_keys = set(re.findall(r'\n  (\w+): \{', sm.group(1)))
print("engine SOURCES keys:", sorted(src_keys))

# ---- per-lesson structural + correctness ----
titles = {}
qcount = 0; mc = 0; tf = 0
answer_text_problems = 0
src_ref_problems = 0
for lid, les in L.items():
    t = les.get("title", "")
    titles.setdefault(t.lower(), []).append(lid)
    # explain
    ex = les.get("explain")
    if not isinstance(ex, list) or len(ex) < 1: bad("%s: explain bad" % lid)
    if any((not isinstance(p, str)) or not p.strip() for p in ex): bad("%s: empty explain para" % lid)
    # art
    if les.get("art") not in ART: bad("%s: art key '%s' missing" % (lid, les.get("art")))
    # sources reference valid keys
    for s in les.get("sources", []):
        if "label" not in s or "url" not in s: bad("%s: source shape" % lid)
        if not str(s.get("url","")).startswith("http"): bad("%s: source url not http" % lid)
    # the lesson 'src' field(s) used to build sources - check srcKeys if present
    # quiz
    qz = les.get("quiz", [])
    if not qz: bad("%s: no quiz" % lid)
    for q in qz:
        qcount += 1
        why = q.get("why","")
        if q.get("type") == "mc":
            mc += 1
            ch = q.get("choices", [])
            a = q.get("answer")
            if not isinstance(ch, list) or len(ch) < 2: bad("%s: mc <2 choices" % lid)
            if not isinstance(a, int) or a < 0 or a >= len(ch): bad("%s: mc answer out of range" % lid); continue
            # distractor uniqueness: no duplicate choices
            norm = [str(c).strip().lower() for c in ch]
            if len(set(norm)) != len(norm):
                answer_text_problems += 1
                bad("%s: DUPLICATE choices %r" % (lid, ch))
            # blank choice
            if any(not str(c).strip() for c in ch): bad("%s: blank choice" % lid)
            if not str(why).strip(): w("%s: mc missing why" % lid)
        elif q.get("type") == "tf":
            tf += 1
            if not isinstance(q.get("answer"), bool): bad("%s: tf answer not bool" % lid)
            if not str(q.get("statement", q.get("q",""))).strip(): bad("%s: tf no statement" % lid)
            if not str(why).strip(): w("%s: tf missing why" % lid)
        else:
            bad("%s: unknown quiz type %r" % (lid, q.get("type")))

print("QUIZ: total=%d mc=%d tf=%d  | duplicate-choice questions=%d" % (qcount, mc, tf, answer_text_problems))

# ---- duplicate titles ----
dups = {k:v for k,v in titles.items() if len(v) > 1}
if dups:
    for k,v in list(dups.items())[:12]: w("duplicate title %r -> %s" % (k, v))
    print("DUPLICATE TITLES: %d" % len(dups))
else:
    print("DUPLICATE TITLES: none")

# ---- meta matches entry lessons ----
meta_not_lesson = [k for k in META if k not in L]
if meta_not_lesson: bad("meta ids not lessons: %r" % meta_not_lesson[:8])

# ---- unit coverage ----
unit_ids = set()
unit_dups = []
for u in UNITS_EXTRA:
    for i in u["ids"]:
        if i in unit_ids: unit_dups.append(i)
        unit_ids.add(i)
# concept units are in-file UNIT_PLAN; parse them too
up = re.search(r'var UNIT_PLAN = \[(.*?)\n\];', open(JSX, encoding="utf-8").read(), re.S).group(1)
plan_ids = re.findall(r'"([a-z0-9\-]+)"', up)
# plan_ids includes unit ids + lesson ids + track ids; filter to those that are lessons
plan_lesson_ids = [i for i in plan_ids if i in L]
covered = unit_ids.union(set(plan_lesson_ids))
uncovered = [lid for lid in L if lid not in covered]
unresolved = [i for i in unit_ids if i not in L]
print("UNIT COVERAGE: covered=%d uncovered=%d unresolved_ids=%d unit_dup_refs=%d" % (
  len(covered), len(uncovered), len(unresolved), len(unit_dups)))
if uncovered: bad("lessons not in any unit: %r" % uncovered[:10])
if unresolved: bad("unit ids not resolving to lessons: %r" % unresolved[:10])

# ---- art keys all referenced / orphans ----
used_art = set(les.get("art") for les in L.values())
orphan_art = [k for k in ART if k not in used_art]
print("ART: distinct used=%d total keys=%d (aliases/unused=%d)" % (len(used_art), len(ART), len(orphan_art)))

print("\n=== RESULT ===")
print("ISSUES (%d):" % len(issues))
for i in issues[:40]: print("  X", i)
print("WARNINGS (%d):" % len(warn))
for i in warn[:25]: print("  !", i)
print("\nQA", "FAILED" if issues else "PASSED (no blocking issues)")
