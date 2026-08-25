import React, { useState, useMemo } from "react";
import {
  Sunrise, Scale, MapPin, FileText, HandCoins, LifeBuoy, CheckCircle2,
  AlertTriangle, ArrowRight, ExternalLink, ShieldCheck, Search, ChevronRight,
  Gavel, BookOpen, Sparkles, RotateCcw, Info, Landmark,
  HeartHandshake, Phone, Activity, MessageSquare, Gamepad2, Trophy, Volume2, VolumeX,
  Wrench, Award, Trash2, X, Palette
} from "lucide-react";
import * as Tone from "tone";

/* ------------------------------------------------------------------ *
 *  SECOND CHANCE — a record-clearing resource navigator
 *  Honest by design: routes every state to authoritative, regularly
 *  updated legal sources rather than hard-coding statutes that go stale.
 * ------------------------------------------------------------------ */

// Verified Clean Slate (automatic / partial) status — sources: CCRC RRP,
// Clean Slate Initiative, state agencies (as of 2026). "none" = petition-based only.
const AUTO = {
  PA: "auto", UT: "auto", MI: "auto", CT: "auto", DE: "auto", NJ: "auto",
  OK: "auto", CO: "auto", VA: "auto", NY: "auto", MN: "auto", OR: "auto",
  CA: "partial", IL: "partial",
};

// Two general felony-relief characterizations (kept deliberately broad —
// the per-state authoritative link is the source of truth).
const FELONY_BROAD =
  "Many non-violent felony convictions become eligible to seal or expunge after a conviction-free waiting period (often ~5–10 yrs). Violent, sexual, and the most serious offenses are usually excluded. Confirm the exact eligible-offense list in the official profile.";
const FELONY_NARROW =
  "Felony-conviction relief here tends to be narrower than average, often limited to specific offenses, diversion/deferred outcomes, or pardoned cases. A governor's pardon or a set-aside may be the main route. Confirm specifics in the official profile.";

const NARROW_STATES = ["TX", "FL", "GA", "AL", "SC", "TN", "WI"];

/* ---- Per-state relief details, drafted from law current as of early 2026.
   EVERY LINE must be re-verified against the official CCRC profile before
   launch (mandatory item in the prerelease checklist). Fields:
   f = felony-conviction relief summary, w = typical wait, c = typical cost. ---- */
const STATE_DATA = {
  AL: { f: "Expungement reaches non-violent misdemeanors and pardoned non-violent felonies under the 2021 REDEEMER Act; unpardoned felony convictions generally cannot be expunged.", w: "Pardon first, then petition; misdemeanors ~3 yrs", c: "~$500 administrative fee per case" },
  AK: { f: "No general expungement of convictions. A suspended imposition of sentence that was set aside is the main relief; otherwise executive clemency.", w: "N/A, relief is largely unavailable", c: "Minimal filing costs where applicable" },
  AZ: { f: "A 2023 sealing law reaches many convictions including numerous felonies, alongside the older set-aside remedy.", w: "~2–10 yrs after completion, by offense class", c: "Generally no filing fee for sealing petitions" },
  AR: { f: "The Comprehensive Criminal Record Sealing Act covers most non-violent felonies; certain serious offenses are excluded.", w: "~5 yrs after completion for eligible felonies", c: "Low, roughly $0 to $50" },
  CA: { f: "Broad relief: 1203.4 dismissal plus SB 731 record relief reaching most felonies, with automatic relief for many; sex offenses and some serious crimes excluded.", w: "~1–4 yrs after completion for petitions; automatic relief runs on its own clock", c: "Often $0; some counties charge ~$60–$150" },
  CO: { f: "Sealing reaches many felonies (drug felonies on a shorter track); Clean Slate automation is phasing in for conviction records.", w: "~3–10 yrs by offense level", c: "~$65 filing fee; waivable" },
  CT: { f: "Clean Slate erases certain felonies automatically; absolute pardons (which erase the record) remain a strong route for others.", w: "~10 yrs conviction-free for eligible felonies; pardons ~5 yrs", c: "$0 for automatic erasure and pardons" },
  DE: { f: "Mandatory and discretionary expungement tiers; many felonies need a pardon first, after which expungement may follow. Clean Slate automation is live.", w: "~3–7+ yrs depending on tier", c: "~$75 petition fee (SBI processing)" },
  DC: { f: "The Second Chance Amendment Act expanded sealing and expungement, with broader eligibility phasing in; many felonies remain pardon-or-wait territory.", w: "~5–10 yrs for eligible convictions", c: "$0 filing fee" },
  FL: { f: "Conviction relief is very narrow: sealing/expungement generally requires adjudication withheld or a non-conviction. A felony conviction (adjudicated) is usually ineligible.", w: "N/A for adjudicated felonies", c: "~$75 FDLE certificate plus court costs" },
  GA: { f: "Record restriction reaches some misdemeanors; felony convictions generally require a pardon first, after which restriction of certain non-violent felonies is possible.", w: "~4 yrs (misd.); pardon track for felonies", c: "Modest court costs; pardon application free" },
  HI: { f: "Expungement is limited to non-convictions and a few specific categories; conviction relief runs through the pardon process.", w: "N/A for most convictions", c: "~$50 expungement application (non-convictions)" },
  ID: { f: "No general expungement or sealing of adult convictions; relief is largely limited to non-convictions, juvenile records, and commutation/pardon.", w: "N/A", c: "Minimal where applicable" },
  IL: { f: "Sealing is broad. Most felony convictions qualify (DUI, sex offenses, and some others excluded); cannabis offenses get automatic relief.", w: "~3 yrs after completing the sentence", c: "~$60–$120; waivable" },
  IN: { f: "The Second Chance Law covers most convictions: Level 6/Class D felonies as of right; higher felonies partly discretionary or needing prosecutor consent.", w: "~8 yrs for most felonies (10 for serious)", c: "Civil filing fee ~$160 for felony petitions" },
  IA: { f: "Very limited: deferred judgments and a single-misdemeanor expungement law; felony convictions generally have no expungement route.", w: "8 yrs (misdemeanor route)", c: "Court costs must be paid in full" },
  KS: { f: "Expungement is relatively broad, reaching many felonies after a clean waiting period; serious person felonies excluded.", w: "~3–5 yrs by offense", c: "~$195 docket fee" },
  KY: { f: "Class D felony expungement covers a long list of low-level felonies (and pardoned felonies); higher classes excluded.", w: "5 yrs after completion", c: "~$250 plus a ~$40 certificate" },
  LA: { f: "Expungement reaches many non-violent felonies, though the record is interdicted rather than destroyed.", w: "10 yrs conviction-free for felonies", c: "High, around $550 in standard fees" },
  ME: { f: "Essentially no adult conviction expungement; limited sealing for some young-adult Class E offenses; pardons otherwise.", w: "4 yrs (young-adult route)", c: "Minimal" },
  MD: { f: "Expungement reaches many misdemeanors and a defined list of felonies (theft, burglary, drug possession-with-intent among them); the REDEEM Act shortened waits.", w: "~5–10 yrs misd.; ~7–15 yrs listed felonies", c: "~$30 per petition; waivable" },
  MA: { f: "Sealing is the main route and reaches most felonies; expungement exists but is narrow (mostly youthful offenses).", w: "7 yrs (felony sealing) / 3 yrs (misd.)", c: "$0 to seal by mail" },
  MI: { f: "Strong relief: petition expungement up to 3 felonies, plus automatic Clean Slate sealing of up to 2 eligible felonies.", w: "~7–10 yrs depending on count/route", c: "$50 application plus fingerprinting" },
  MN: { f: "Expungement reaches a statutory list of dozens of felonies; Clean Slate automation began in 2025 for many records.", w: "~4–5 yrs conviction-free for listed felonies", c: "~$300 filing fee; routinely waived" },
  MS: { f: "One felony conviction from a defined list (largely non-violent) may be expunged once per lifetime.", w: "5 yrs after completion", c: "~$150 filing fee" },
  MO: { f: "Expansive 2021+ expungement covering most non-Class A felonies, with a long exclusion list; counts are capped.", w: "~3 yrs after completion (felonies)", c: "~$250 surcharge; waivable" },
  MT: { f: "Misdemeanor expungement only; felony relief runs through deferred-sentence dismissal or executive clemency.", w: "N/A for standard felonies", c: "Minimal where applicable" },
  NE: { f: "Set-aside (which nullifies the conviction but doesn't seal it) is widely available; sealing is generally limited to non-convictions and pardoned cases.", w: "Set-aside after sentence completion", c: "$0 for set-aside motions" },
  NV: { f: "Sealing is broad: most felonies qualify, on a sliding clock by category (Category B/C/D ~5 yrs, Category A ~10).", w: "~2–10 yrs by category", c: "~$50–$150 in agency/court costs" },
  NH: { f: "Annulment reaches most offenses including many felonies; some violent crimes excluded.", w: "~5–10 yrs by offense", c: "~$125 petition + ~$100 state report" },
  NJ: { f: "Strong relief: regular expungement (~5–6 yrs) plus a Clean Slate petition wiping nearly everything at 10 yrs; automation in progress.", w: "5–6 yrs regular; 10 yrs clean-slate", c: "$0 — filing fee eliminated" },
  NM: { f: "The Criminal Record Expungement Act reaches most convictions including many felonies; serious violent/sex offenses excluded.", w: "~2–10 yrs by offense level", c: "Modest court costs; often waived" },
  NY: { f: "Clean Slate Act automatically seals eligible felonies (Class A and sex offenses excluded); CPL 160.59 petition sealing remains for up to 2 convictions.", w: "8 yrs auto (felony); 10 yrs petition route", c: "$0, no fee on either route" },
  NC: { f: "Expunction covers up to 3 non-violent felonies, with longer waits for multiples; non-convictions get automatic expunction.", w: "10 yrs (one felony) / 20 yrs (2–3 felonies)", c: "$175 filing fee; waivable" },
  ND: { f: "A 2019 sealing law reaches most felonies after a clean waiting period; courts retain discretion.", w: "5 yrs (felony) / 3 yrs (misd.)", c: "~$30–$80 court costs" },
  OH: { f: "Sealing and expungement were broadly expanded in 2023; most non-violent felonies qualify, with caps lifted.", w: "~1–3 yrs after completion by degree", c: "$50 per application; waivable" },
  OK: { f: "Section 18 expungement reaches non-violent felonies (one after 5 yrs, two after 10, pardon sometimes required); Clean Slate automation is phasing in for misdemeanors.", w: "5–10 yrs by track", c: "~$150 court fee plus agency costs" },
  OR: { f: "Set-aside is broad after 2021 reforms. Class B and C felonies qualify on a sliding clock; filing fees were eliminated.", w: "~5 yrs (C) / ~7 yrs (B)", c: "$0 — fee eliminated" },
  PA: { f: "Clean Slate automatically seals many records, expanded in 2023 to certain drug felonies, while most other felonies route through pardon, after which expungement follows.", w: "10 yrs (auto felony track); pardons vary", c: "$0 automatic; modest petition costs" },
  RI: { f: "Expungement reaches one non-violent felony for first offenders; multiple-misdemeanor relief also exists.", w: "10 yrs after completion (felony)", c: "$100 fee" },
  SC: { f: "Narrow: mostly first-offense, low-level convictions; a limited set of felony-adjacent offenses (e.g., youthful offender) qualify.", w: "Varies; many felonies ineligible", c: "~$310 in combined fees where allowed" },
  SD: { f: "Limited: arrest-record expungement and clemency are the main routes; most felony convictions have no sealing path.", w: "N/A for most felonies", c: "Minimal where applicable" },
  TN: { f: "Expungement covers a defined list of Class E (and some D) felonies, capped at two convictions; many exclusions.", w: "5 yrs after completion", c: "~$100 (reduced from the old $280)" },
  TX: { f: "Conviction relief is narrow: expunction is for non-convictions; orders of nondisclosure (sealing) mostly cover deferred adjudication and certain misdemeanors. Straight felony convictions rarely qualify.", w: "Varies by nondisclosure category", c: "~$28 nondisclosure filing + court costs; expunction ~$300+" },
  UT: { f: "Petition expungement reaches most non-violent felonies; Clean Slate automation clears many lower-level records.", w: "~5–7 yrs by degree", c: "~$65 BCI certificate + ~$150 per-case fees" },
  VT: { f: "Expungement covers a long statutory list including many felonies, with most low-level crimes eligible.", w: "~5–10 yrs by offense", c: "$90 per petition; waivable" },
  VA: { f: "A new sealing system (2021 law, phasing in) reaches certain felonies by petition and automates some records; historically only non-convictions could be expunged.", w: "~10 yrs for petition-sealed felonies", c: "Expected modest; fee structure phasing in" },
  WA: { f: "Vacating the conviction is the main relief. Class B and C felonies qualify; vacated convictions can be lawfully denied.", w: "10 yrs (Class B) / 5 yrs (Class C)", c: "Court costs vary; no set state fee" },
  WV: { f: "A 2019 law opened expungement to many non-violent felonies after a clean waiting period.", w: "5 yrs after completion (felonies)", c: "~$200 in filing costs" },
  WI: { f: "Among the narrowest: expungement must be ordered at sentencing, for under-25 defendants and low-level offenses; pardons are the realistic after-the-fact route.", w: "N/A after sentencing; pardons ~5 yrs", c: "$0 pardon application" },
  WY: { f: "Expungement reaches a single non-violent felony after a long wait; misdemeanors on a shorter clock.", w: "10 yrs (felony)", c: "~$100 filing fee" },
};

const STATES = [
  ["Alabama", "AL"], ["Alaska", "AK"], ["Arizona", "AZ"], ["Arkansas", "AR"],
  ["California", "CA"], ["Colorado", "CO"], ["Connecticut", "CT"], ["Delaware", "DE"],
  ["District of Columbia", "DC"], ["Florida", "FL"], ["Georgia", "GA"], ["Hawaii", "HI"],
  ["Idaho", "ID"], ["Illinois", "IL"], ["Indiana", "IN"], ["Iowa", "IA"],
  ["Kansas", "KS"], ["Kentucky", "KY"], ["Louisiana", "LA"], ["Maine", "ME"],
  ["Maryland", "MD"], ["Massachusetts", "MA"], ["Michigan", "MI"], ["Minnesota", "MN"],
  ["Mississippi", "MS"], ["Missouri", "MO"], ["Montana", "MT"], ["Nebraska", "NE"],
  ["Nevada", "NV"], ["New Hampshire", "NH"], ["New Jersey", "NJ"], ["New Mexico", "NM"],
  ["New York", "NY"], ["North Carolina", "NC"], ["North Dakota", "ND"], ["Ohio", "OH"],
  ["Oklahoma", "OK"], ["Oregon", "OR"], ["Pennsylvania", "PA"], ["Rhode Island", "RI"],
  ["South Carolina", "SC"], ["South Dakota", "SD"], ["Tennessee", "TN"], ["Texas", "TX"],
  ["Utah", "UT"], ["Vermont", "VT"], ["Virginia", "VA"], ["Washington", "WA"],
  ["West Virginia", "WV"], ["Wisconsin", "WI"], ["Wyoming", "WY"],
].map(([name, abbr]) => ({
  name,
  abbr,
  cleanSlate: AUTO[abbr] || "none",
  felonyNote: NARROW_STATES.includes(abbr) ? FELONY_NARROW : FELONY_BROAD,
}));

const CCRC_HUB = "https://ccresourcecenter.org/state-restoration-profiles/";
const CCRC_50 =
  "https://ccresourcecenter.org/state-restoration-profiles/50-state-comparisonjudicial-expungement-sealing-and-set-aside-2-2/";
const NACDL_MAP = "https://www.nacdl.org/Map/ExpungementServicesMap";
const LAWHELP = "https://www.lawhelp.org/";
const LSC = "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help";
const CLEANSLATE_INIT = "https://cleanslateinitiative.org/";

const cleanSlateLabel = {
  auto: { t: "Automatic Clean Slate", c: "var(--sage)", note: "This state automatically seals/expunges some eligible records with no petition required. Rollout takes time and mistakes happen, so verify your own record." },
  partial: { t: "Partial automatic relief", c: "var(--gold)", note: "Some automatic sealing exists or is phasing in; many records still need a petition. Check what applies to your offense." },
  none: { t: "Petition-based only", c: "var(--clay)", note: "No automatic clearing yet. You (or an advocate) must file a petition with the court." },
};

const NAV = [
  ["home", "Start Here", Sunrise],
  ["state", "Your State", MapPin],
  ["eligible", "Am I Eligible?", Scale],
  ["cost", "What It Costs", HandCoins],
  ["diy", "Do It Yourself", FileText],
  ["help", "Get Help", LifeBuoy],
];

/* ---- release metadata ---- */
const APP_VERSION = "1.0.0-beta";
const DATA_ASOF = "early 2026";
const FEEDBACK_EMAIL = ""; // set before public launch to enable the in-app feedback link
const CONSENT_VERSION = 1; // bump to re-present terms after material changes
const GOVERNING_LAW = "the State of South Carolina, USA"; // confirm with your attorney
const LEGAL_UPDATED = "June 2026";
const CONTACT_LINE = FEEDBACK_EMAIL || "via the app store listing for Second Chance";

/* DB Recovery monogram: the exact provided artwork, embedded verbatim as a
   palette-compressed PNG (same design, colors, and proportions; only the file
   size is optimized for in-app use at display sizes up to ~80px). Use the
   original full-resolution PNG for the app icon and splash screen in the
   Capacitor build. */
const DB_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAELCAYAAACoD18FAAEAAElEQVR42uxddXwdVdp+3nNmrsabunubKi1OIS1ui9+giy2UhcV3+YAFmlychcXdbZEE16IVoEChBnWX1JLGk2sz57zfHzNXkhYoLFLYvPvLNkRu5s6c85xXn4fQbu3WbjuMlZaWinA4zACYQBAAbNad16xZ3v/9z6dI1vZwbcqOcaXYYGreuKHyyyMOOMK/68hdKwGskCRsDXZeLATJ5ayJiH/r9xUKhWRFRQUD0ABgkkRC2z2XL1884K1pb8YgzcHSY/ZMRBMiO5irZy+YNWvAgCF8zBGHzehf0L+BmemXeB/UvuTard12GOAjACovOxd1VfUD7i6/95BPlszZY3NDzS51W2p7NEQiPiUYFPQAEiBLQUcs5AaykR30r++cXbBiUPfeM8eP2v3Dww84aopBMqGggeJig6dOVb8FELrvCwB0wOtHS31tn9tevP/wGfPn7r15y5ZdGxPRHo1IGCwJtmUj2tSCAl8A3bJyaw7ea793Ljn7giuCFNzQDoDt1m5/cDOExLNvle/+xsdvnT93w+pDN+mW/CgUrEgcFLFBzGBTaBiCwQzYGqS0VEoBXgOGKeD3mMj3BtE7v+OCsX2Glt/2l8uflAUd1mpw0gtTv8Z7cQFLAFDMLF55p2K/8hnvnb14w+qDNtbX5TS0RGBbNsiUoIBHKaVkwCYM7dxjxYSRuz94yyVlLxPRql/6OtsBsN3a7Tf2/MrKyrjivbd2+fjzDybNXzP/sI0NDWgkQsRHUAkL3BSDbWmQ14D0SlswBNlaQDEYDIIASWIWpFkwK9aSiSnb8KCHL7dm72FjH7n3ytvvJqKNAIiZ8Ut6g67Xp01h4L2pr+9115v/ufqbjWsO3hhtRNxSkBaUaTMkCSSgSJok+mQVbirZ4+Anyi765z2mNDfa2kYoFJLl5eW/aAjfDoDt1m6/feirH3/56X031FYP75xbuKVTXl5s/aZN9Nn8r2SHgsLxqypX915fW11UFWvs0+CxEYknoFsseCEBQSAwIAggAglnWxOgFStt2crI8poo6tx79Z/HHfmPv//lopejVgy/VEiJECQqoJi54Oyy86//eP7X56yLNApNpE3TYDALaE3E0Ak7IfINLyYMHvNc+c2P3hPIzvkiGo8BgGDnAn/xkL0dANut3XZgY2YJIAjA99rkl3eaPPuzPeaunL9PdV39XhubGk1tSCJ3FxORu6MJAAPMADN7DKGCpmGACQePGf/QY1fdcQkRRUPl5bKipOTnDIklAWrylFdHT3r6/hdWNG4eXB9JsMFCE0FqwYCQUJJZaYsG5RRWnjXhuL9f+Zd/lNtObeSXA+bvSju0L7F2a7cdwxNcuHAhIRRCCMCCBQto4cKFSS+oGUBjQXbeezWNdatfqHii8ctFs4e9+PWnHbfYMZZCEhhuOEwOBrr4BxAlLG30yc7VXfIL+M05H56zx1kH9WXmE4mo9mfMCwqf6VM3Pfav08+954b783Oy/L0LOtvN8Q0GFEvNDCgGWOlsv5f3H7TrZ+VXPnQ5AqY1euBOh7dEG3yjBo36kIjqf00QbPcA263ddlwjIuLXZnzQ+dMZHx87a9n8k9bVVO+1qb4GTY0RyKyAbfo9RE4UTMxMqQ3NAJjB7ITHcSuOQQWdeZfeg2qmLZld2LNj95Wf3fvq4eTzLQqVh2RFyX8FgiLLF9CX337V32575cl7dx88Aoq1mrJ6sTQMA7A0oDW0rWE1N6Fvx65qxKAhaxZXrfVwzOrRq7AQY3uPfOOCs8/7W48OPda7b/xXAUDRvsbard12yNCXALDWOnfNoiV3r1i98uq6uvrhjQ0NG/I8wUTHvDxkeUxDSy3jkoUFphTwaQZrDbDj4RAzAl4/ltRupnfmzSw4dPhedavWrOq094XHfszMPSpKKlRpaelPwoJQKCQlCR1+6Iazb3/zqXsPGbWHjjTG9YcL50qvYYI0AwJgAfiEwC59hvKATj3p2+VL+m2q2dyjW5du0w7a79CD/n3Vv47sWdiz8tcEv3YPsN3abccHQgFAArAB5APwLPxm1sAvFy/o9/XSuT2Xrl81vC4RG7mpfku3uob6gDYNk0iA2QE+pzjivJaEQNRKwLRt+4hhu878bOW3Q7p06LTq66c/3oeIohm+43aH7eFwWD9X8eTIS5+8bc6eg0fVNNdF89+f/4WR1SEfNjRYEIgIihjdgtmqI/ll9fpN6Na12/KT/nT89eefMvFZIlIAJPOv37TdDoDt1m6/YyvIykdNU+1e709964DXprx13Jvzvhy6KRohrzRJsQYJAhNAbkgsmJDQGl5W/Oe9Dp739rxPRw/q2e/ND+566Rgi0ttbfWVmKisro7KysrwhJbvOywsUqIDHF5myaNbQYCCbNTOxAJgIwhCsTIKGRV20v/Gg4Xs+8Oj19z0S8AdWRGNRKi0tpXA4rH+THEP7Emq3dvvdhMQAgLKyMgqFQsbH33w8bvaSBafMX7507/XRhr7RhCWYoZRmoVkTExPIbY9J5gMZECQ4DpvyyEwcXLTz3MkLP9/1hH3+dOUDV95+s2It4I6rfSdoEIGZKdufxbucNv6tFdXrDyoeuNvc/yyctrOPDNZxm1gzWDt/M6HiyPIFMLbvwKem3v/6JQbJOuX8CSIiZv7tJvXac4Dt1m6/AyMiJiIuKyuja8PX6m9XLjz+y3mz7/564ZyT12yqHBCNRKWCpgSUEWNLxKQmLYUCSMMFI7ADXpqYvMLgGjvqmbly8ZA9e49Y+erUydd+MvfTMa4X+L2O0aRJk4QhDT4r/Ldjv1m45LB9++yy8K15n+0kpWDWTOz2JEIzC1vpnTr33XjtkedcXxF+6J1rn/z3mOP+cfJJDzz5wNG/Nfi1e4Dt1m6/UysvL5ehUEgAyF+xZMWIz7/9vMf0WTO6razdNLou1rzz5kh9vwYdQzQSh7ABQwiAABICTAxoxxNsaW6kg4eMXb++bmOhDPpmz3lyajEBNr4nDHYBUvQ6YuSintnd82OJuJpdu7pzMBBkxYrATshtJxR65OaiqFOP2tWbNlmNHO/sz/ahX26n+X8ae0DpeWec92oS3NsBsN3ard1+snk9HsQTCWQHstDY0tTthlvLOq2NVB89b+miCUs3rR/daCeyDb8XwpAAE6A1iAFNAMctlIzde8NHC2d2O/7go86648IbHnOjw61DYXfS45irTzn9q8ULnhjXfdSKiplT+htZfoYAQVCqikJSQNuKE80REgLoFSzYdPDe+930wJW33eOCntux3e4Btlu7tduPtGSo6o6CMJxqsQKAgpx81DTUdp2/eP7O70x/+4SZc2cd9MGahQVxYkgQJUNiASCiEhjeqWe0W1aWsWzj+lUrXp+1OxE1fEdBRDBzsO8Ju8zq0aGrrNywOWddc22hhwxmtwubBZwRPSmVDSXz2MSeXQa/WHHHEzcHc/Lm2trGz9B7+LNY+yRIu7Xb79QywckFQ/3MKy+Omjz7owM21NUcMuLP40dxxOpQV1OHRmlzImCSZEoVQ4gADYbf68P8Tev83QYPUWxg0EX//ue5pmHeWFZWJjI9tFAoJF995VX115v/fixJObBrsEP154klhV6fF9rSBHb6D4kJikiTwXJgVmHNUaP2vfi+Sbc/63k4KG1tJ9td1I5wD9sBsN3a7Y8AhiAwGE2Rhr2qa2r+vHzDipEb66owomtf7D5ijL2xsUYuq9uIZrJBmgDSYLdCDGYYpolZa9eQ15T84ZfTz0xYiXuJqDE5lub+q5iZRp40/sJungJesGltoRLkenxOwEwKiEUj7PWZYkyXAU/NeOy9i30eX33cilMS9Ih2nMCzHQDbrd3+GAjI7hTw/cz84HvvvTfopU/fPuOT2Z+FPtw4o6+RmwXD61VkawHWTnc0p7xHGACaEpZosi0V96j+tz5y+1EAnqYSh9OPysqIiPjxtx4fWdNcN4L8wNKajeQNmtCaUyw0tlK6f8cuiZK9Dnpz7Mix7xafc+SZl9505eDzTzz7ku7du0edDu3fnqE6Fc+3r5x2a7c/joXKyyUR8cEHH7z4+X8/fvnit2ft9/fQX6/pHSxcFdMJaQkQg5STNXSqwcl/BRGkkNxCGm/Pm34MM4vSolIHrBYuJGbG5M8+OSHuM4w1zTWKiCAsdiZOQNAE+IJe0bNbV7z69bT9zr33ny9olbhSMD/frVu3qBu38450v373RZCMRDC3L/92+72uYSJCaWkpDRs2jCoAABUAHGaYkpISnfTUtnedZ2iLwOvxciweKzj3yvNP/WjJ7EvXRet72pYN0zTBrF0QcMJhIYgThkafvMLYlNInR/fo339p8rWY2Rw78aAvv6nbMNqMsoLSklMoQoAAyGNwNNrCfhZi7z7D3njvwVfPI6L1P86XdRKU5eXlIn0vACCEilCJZvD/7n5nZiovL5elpcVGaWsPlsodBlnJ3F7dbrcd11zigeSM74+NwlK/V1paKn6oabltpMfM3c+75pJ788cPasTePdl3wBD2HTiEfQcP5cChRRw8fBj7jxhu5x49ki+97cr/Y2ZRXFxsAMAXn7w3tu9Je1ryyGE6cPgw7T90KPsOHsreg4aw9+Ah7D98mDaOLuLup+zOJ1x5+tXM7Ml4v9+5n9vcj590H/AT9/zvCijKy0OypE3pnJnzAJhCmtWs7e/92XZrt98y2gqFQqKiokIDYENIh7uPgbi2Oq5Yt6Lz0jUr+q6pXi9Wr16l43GFQCCA4QMHeXO8gQ2j+/av6d53SJVHGHVOwo9h69TyFqFQiLbF68fMgoj0lC+njH5nxod/X7tlPYYPHLYmUd3Y9Z2Z006Yu3md3+v3OfJzRIAgCBIqri2xV89BH85++uMDGyPNBgD7nNJzT61Y8OVTzbG4LQGDXY4/p/ILHWdbFPi80Yn7HzPxpouvf9a5ALc+0zZUd3gIAbdtx2t4wFojriwDQL/XP3w9uK6xqs+3Sxfa9U31yA5kY9Tgkeao/kWb9tlpzw0+w7uatQYTYLn73n1NjR/RW/i7AcDyUEiWVFQoZvZ8MfnZg5vqaw9taW4eqlkXgdmrrOhifzBneXZu19eKjz7tZSJS7SDYbr99yIKkuqXbn5eHD2a8M+D5D94+YNbSBaM3NlYNi1mJgXZLIheavDLggaVsKKVAhgGP14tEPGZlB4PxgOmrD5q+5Z1zcucP7zVoyeCe/aedfNTJa7L8wcaWWCQZJcrSolLOIBcgZsZ7n3+e/870VyZ+Nu+rfyxZv6KDR3gwpFvfxIKaDZ6YBCRc1hgSECBOkKKeWVlVy5/7cggR1fs8Xj7o3GOfeXfx7FOkkDZLp4DKmkEaHGtuoV55hRvevuWR64cX7VT+4HNPFPz1pDOWOy/rhKtuqE9wG6w90kTcTvjufurfw75dv/qQ+StXjt7SUDtAKO4XsaOyQ9dOAckCylJQlg3NGtHG5pgn6I+yh+d3yStcMHbgyLnH7HTwB+PGjVuVCotDIYntJHn9XQBgknZn6msPH12zfu31yk4USWlAMyMRj0MpC6YhIIWENE0I6f86r2vPKycc9ZcPy8vLZcnPS/vdbu22vXk9AqC90oNY08aeJ1536VGLV648eUtLwy7agsjxB1BYmN/i9/obpRDcKadD16ZIi4opi2obarG2dguqEi0wTEMypXKAkETwCoksYequOQWr+hR2mTJh5K6Tz/3z+R8SUYN7CTIUCqGtV8jMHS+/6ZrzX/7gtcvqpeX3FuZxXayFSCHFJA0QbCid6/eKa/50dskFp55Xwcz5e5128BdfrF0+yO/3aS0gnIE4AUvbPLagV/1hO+391szV33bR8cSwI3Y78ORzzzh3WpLpJck87YJezgP/eWCvyV9OPXRtU81+m+NNQ22VQAcziE5ZBeiSV4iaxvqF2YGg6NOl+0BohpWw9NLK1fNbYpFEv+49x9ZHGo26eBOqGmrBlh3tlt/1yz0Hj3n6pkvDryTvQRI3frcAyAwqKQmJioqX1HvP33lb05b1f49Fo0jYrEhKNoTkdAeUO/BNiryGNBgCwQ7d/vKn0/7xeLsn2G6/piU3u9/rxweT3xl9bfndF89fveII8or8Dr6cyj6de6ztkJ9HTc3NeRtqqrPro80Fm1saSbHyK62d8TTO6FRhZ8giudA1mLXWpJWSzBoej4ncYBCd/dlLhvfu/1po7PgnTiqZuCSSiDp7vBTEZcwlJSWiwomixNqlS/ucftMl186sWnli1ITwswlodhDQkRKxWSvjmJF73/H8vx6/9NsFs4Ydc90Fs5bVbPb6TA8zgZgAFgRhCPTL7xhfXrnO20F6cPK4w0+49Z83v+hOezCciTto5pz/u+OfZ3yx5Nu/LF9fOaJexWFJAFKie1aWyvL4EIslqKGpmaKxKMVsCwoOmzQYEH4v/F4vvDB0rhmwc4JBIQlU39Igq2LN8Hi86F/QZeW4gcPvuP3y2x4kIhsZ0zG/OwAsLy+XJcefoN555t/36Gjd+XX1TUozE2tmrSxhGpJ8Pi9Mj4l4zEIiEYcGlBBSQ9vS7w+IvG79j97/uHNeawfBdvs18nzuh2bmDgdOPLJ03vLFEwP+oLdo4JDqoOlZU9m0xb+mrqpnbX1jTiweB6QABMEkpyVXuKQFSKu7tdmslGJ7FgBDCmYCK61ISwi/34NCb1akb37nN4/eo/ix80+86DMiirivyK5HhhsfunFsbqcO3WvWbTrihc8/OnF5bZXXlIKcKRECMVSCLTmmS9+PvnjqvcOvvWfSLvd/9u70ukgUBjNYJyN8gEzJUY7qQn+uvGT/E8+77ryrHhg2crg5a9Ysi0DQrLNKLvvzaQs3V15c2Vw3oKklAqlJG9LQJEhAkrBZwdYKxIABAQK5YXnGBxhKa+fDtqCVAoSAz+dl0zB1ghWUUDJbejAwp/PMS4867YqTjz51imL9nSpztEODX0mJmvLqE39u2LT86abmiEVCGADYY0ihtIbXF1glPf5vE9HIGn9W1phYc+MAwXZny7ZgKVjEyvAGcxt3Oqhk5NNPD68cNqyc3JaC9paZdvslwA+mMPjyW686tGLWBw80R1p6FXXrh6DH37Jg5Qq5prnGZ/sFhJCQLCDTFH1O6wcnEcXlCUjGpOSwKjPgkhhQKsEIcglPBSBIaC2gFWtDCiAHHhR16Tn1jIOOuevPR53+FhHZYyeONQ/vergq6FlQ/MK0t55Z11TTxe8JJNbX1/ghKeUBEglOmJr6ZRWsX/yfT3e/7uEbj73zo1fubIlEbaFhuF4iiAFL23YwJ8s4csReZc+FHwjbrDzMrADgmnvKTnxj1vR/rmmsGRpRNgwtlGAQay0YGSBK6QkRdq8Byr0XGQAI7fzdZFmZiQDpuMYkCEIIbVu21gnL6JZTYB2+y17XP3TV3dfaWm1TcW6HA8AU02w4zJuYA9PuuXqJHWvsqliyECSCwSzyZuW9Xti9/+277nvkTCIRc45DCVZ2/mdvPXno5nWrroKKD21saYkHfKY3r2OfRw46+aKJmeAaCoV0e+9gu/2M+T5mZv+frzjrxslzP7/Ym+dH3/wu9pr6WllZXUVCAR7TwySdkY0UDx65uz/t3yHlhSXhgMhhdgYcjY0kWGbQ3UNQxqYmhmJtKyU0FBX6Atil/+B3w38+r3SXMft+pZyIlFcvXNj1mPD502fXrRkQDASdvj7tXBcRkBCau2bnWWsemTEwNOm0MyYvnlVmK20Tw+AkUCtWykrIA4t2e+ut+54/2gUxe/E33wy55OFr7/p87ZIDW7SCqUkRgxgsmFzASvLBgNKgn8kRw6kTIfVzRARW2gFJuKAp3NcjAgnBbCmC0spiJbK8HhrXb9jjb9714oVE1NIWBGlHWUAVFRUiwzsjAPjo1UdObNy0+j8NDU02syaPx4u8Ln3+etjJFzyaKpAAYnxpqZgQDiukUyY5bz1xy+Ox5ppjIy0t7A3mbTn+ghtGA4gCqE/egF9bg7Td/rieHzOb+5x5+BNzN608yY4rlR3wU52KC5gSXpbQtg2tXTAD4MSQ7sYWlPo86eikJjRcsUtHAN1NjLsuE4Md748olQnPyJ+7UnHQlm0TSVD37LzmfQaPuvPJ6x6+k4hqAGDpvHk9jr/97x9+G6ka7NVCw1JCaw1ywk2dZXjE3af+/eA3vpx6+itzPzvBkFIxQTo+h9BRK0o7dexTOevZj/a588kn6y8+/fTY30ovOHrykq/vWtfc0FFAKJOItGaRBFdXrdPpjkmJuTu3hMEQRI5nx+zkJTnt6cYSCQhTwhSGEs7dEknwU9BIJCxIJphCKskgS9van+U1Dh++55Rnr3vocCKKZYbDv/koXGlpqSAiLikpUSDJzBzkWs4hYXC8uWG8lJKFkMrnMWVuxx63HHbyBY+WFhcbTsMzUxjQE8Jh21mDTFOmTDGIqPHwMy4/WZj+WV6PQbFIU+5rj1w/860nb17+xmPXf/3BC3ddyczB5JB3+x5ut//2AN/5tH0f/7ph7UkWyCIhZWMsLrwwYCqCYpd4QAqQQawBbat0yMsaYGIQiFkTK2ZHYly6QEAuEGqw1qwjCQuW1oAQINfzYxcsHBp6VxBJO6TMhmGQQYZa21Cf9dLsT67e+bQJH93z6L/28EgTg0aNqrz7sIkHFgU7VkfZBoM0NMAKEDbrWHMUC1Yu27mmvsavDQEYwpn4MAQsobhbQQc689DQXwGsufj007NPu+zs+16cN/25dZGmjqYwlEEkldaCHS5+F+CTwObCIWd6wATFgMUaMIQWUmhBAkwEA4Tdu/fXPbIK4obPkAmPFnGhmQxha6U53/Rjz+4D6joIE7aVkC1WXLAhKQ7E3l781YRDzyu53Wd4NBGJHcID5NJSQeGwZmbfRy/fd1ZzXd1xsWhLP60U+YI567W2erCd6MpKCYuNb0+66MZdy8rG22VlU9X3eW5TppQaEyaE7WlvPnXQpuXz3o1Ztgr6/YZSGrZtwe81YQbyvjr8zH8eDKI6MLeP0rXbT/H8BDOLw88PPf7R2kWnwDRsaWmDFZSVSAhlK/L4Pe7GJzBIxWFLP0kEWKIxHoeQ5BY2WMUTCRk0PQgEfGiwE5BEzqgaEdtaa9u2pakIo7v3SlRFmzzrWxphSAkoxytkZHiMSWBJEr64AaaGVkqw0TUr1zp8xG43Pnv942VN0RY89szDR4dfe/TlysZ67Rem1KRBGrZlxY2jx+x+V00iuvOUtYv38rLUWmkBhpJeyH37jnrsnTtePEtplX3EhSe+8d43M8ezaSjTY5Iji0QpbzQZ2yYLKGA4eTspk1dPWmsETQ9yfT7eEG8kS2mIhGbpNRUxU7/sAj1+6C6zPD7vB18s/+awjc31YzbHGxFrjMFQbO/Srd+6vx520nMzFszu+fmKbw7ewC2dGnQCOmbFc23pPXmPQyY9fO1d111+5RUiHA5r+VutnlInbNUzppQPmP3hSx+21FadnohG+thWIlfbdo6y4j2UUjnMsIPBgPTnFV4/aOQeM8rGny76Tpjwvb09Tz45lcvKyqj3oFHrF86afnZu0J+jpaeKQZYpyNcSjcEg7r5i4Td9h771UUXR0PmyomJhOwC223ZbcXGxsXbNWrXR3jxp8oLZF8ZjlmVKw7Aksy207BLIoR5ZebylqYFM02QlWGvSsovMShy787ipNZHmXtWxZmGaho5rm4XSsk9WYcthw8Ysqqze1LHJSpAhBLTWylIJmeX3iT7ZHVYdt8uEGQpWx4U1G3xEAsJNGSqt3EDY7TN2c2MpUSTncyImYUCoRjtuLK5aO363vcfsvmjyjHk77zbuk+Vz53VatH7VbhZrJYQQJAViQtEuA4b6mlWi84razXkeFoDSbMXj1MuXt/HzxyefWMyF+NP9/3jzq82rx4PINqQ0OIP1ikik81ouIpN05TITFmLxGGkQkSRFgJaaeUyvfnUT+u30qQ+iwYpGu9kmi4TBYnNznfhm3dLuhf6smg/ufvmyHt7A056I1hyJ92yJNmcv37gyf+7qhZ0/eOj1G/967OllkaraBTKhCiMtTf02N9ZiQ1PtHk/fdtcn55x17upQKCTFbwV+ZeEwL533RY+Ni+d/lGhpHtESTVgJm5XWZFlaQSkbbCVgJ+JGNK4SOVmdpjAzVQ/7YaByBWQAIF7Yrc9H/g59Tjt6YumQ4tCFQ7v0HXqKz5+9vDkSRUtTbcmimR8NLSlxeqPat3W7be/6nTZtmv1k+aPFb82ecXV9c8SWGhRpaqJcj1fs06to+mWHHh9mKSJaazsSaaEgGXJC35HTK5/9+LC1mzbXL27YbHj83kSMLNEtN18cMny35799+KUD5q1ZGVzTWC9Mj1QxO04eSxkjcntsOXefo0vfKnv07MnzP+315sq5hZYptSLmqLKEHYtTDpmA0g4agkDkZMiSNZZkOYEBsGZp2sSxiK2mLJl/cPGFx374/vtvHn7fjfdeuGuvQYtsExIeqVkSZMCHBetWxKtramxoAVYMZSkOkiHOOPDYRwB4T/nykbeX6YbxMIQtTcNgcmY/SFOKVF8ICYJgMCkhpRKmwSTBe/UbxIcNGrthUKCgMZsNSZYy6q0W+fayWflvLJox8KS9D3lj9v1vn3D0wL1uGdd58KJ+eZ1J+j3i7SUzjz3ovOPuP+6wE2Y/eeODE+c+NXWPSw75c9mEot2WNXFs8M5/2f9RADVl513x1BcPvbX3JeNPOKm414hFtXaTb9JLD9zJzMGKiorfJv9VHgrJ419+Wb322K0VKrLluOZIzCLA1Eqxz2uQxYbt9XhXgMjQiUh/wzBROHBkr+KDT1y3Pd3dmbkZAAYRWZlfX7ZwxpjZH745xePx5HTpN+zimLngvupqiJKScKJ9e7fbdoa+cvfTDpzzdW3lUEQs27C0OaJHv6rDiw+8tvScy57Z59zjXvtkzbxiGdNiSH63lqP2OeDa+6++/V93/ufBYy579NaXqxONlsdjmsM791l79JgJl1517mWv/umCEx94f8XciVogIQR7+gYKW/buP/rhR26493YAWaNPmPDBKrumh621tqFFoT8H3fwFi0d36tM4Z9mCnb7dssGQfk+qedCplSQrK2hTVEhtEjsajxm9s/Ibbz7t4nMPGrPvgjFXlsxZZzWxX0tErJjYtUe/KiNm+z5bvTzHF/CruE7IEfld5899fvrfxpZMePSbpk0DDZ9pk62d6rB2CzXJYowhEFcJaK3h8XqgDUcoXQiCn2GPKOi5buL4Y14Y2HNg9WPvvrjbkvVrxlbp5gEbIjUQTVEct+dhT7z/wMtnrt+8wffy2y/v+uYXH5/39aJ5B61t2Zi3Z/9Rr02+95XQ+++/7z3wwAMTALy3PHDrEe8v+uy6QiP45V59djvjoosuUgBsZs49p/Siq6ct+/IfexSNuezpax687VcnRHWHs9XCuV8OmjPt1aMT0RZtSMMQBO3x+0Vel153jtj10Ie79umzFIBn/lfThq9fPveyROOWvQE8h+8Sa/kOTxCAlWx7KSsro24bN8rBI/aZ/eZTt77j4fgJvkCuZ49xYXsbecn2CnG7bcv7oxuvv0H97bqLJi2MVhcp0rpbTq55YNHuLz1xw73XB32BeatWrvjL3NrlE7Kzgti9e/8ZD19y3fl9ioo2Xn/RpMC4Uw++tKpmI3cI5Jv79N35tVfueuoCIqos9OfsN2ftsrMSiZguCGR5du9Z9O4Df7vhsj7DBi145IZ7s/f/yxEvz29Y08PUAp39uWJE/yEfX3js6f9asWJp17vfeO7mDfV10vB7GIZgZrC2bGZAsCQhSab4CFrJUDouohHwB3Slbsm56tWH/rO5ofGYw0bsetVT30y7UcW10nEF1qqTVgpsKWjWlO31qmP22r9s6GG7T1rWvGWg4TNtJJTBbkGGUi6n63PaNu8+YCD1ye28uqambi48Zg9lUPfqpi25jVZzYOb6RX3nPXrdlf937Dm3ffDEmyes21iZNeWTKWNfmfrWvgtWLz7h03kzztj31EO7eL3eQxOJxPSA1z+9pSEy6Kybzz9t4dJF/3flLddcc9Pl1117yIWHGJPvmdwM4DlmfmXSbWVXd+rZszeApRMnTjSJqMFreC+7KHzRrJWbK294Z9rUF391D3BKaakxHtAfje51xuaV3z4ai1u2EJKCfq/s0G3wZfuFzrptW4fuwoVfdCgq2q2G0x79dlfo2gCZAKCnvPLQvfWbVp/bqc+Ixw3T/Fbb9jd7/enPU7VtJ095TtL4hMNhXVpaKsrKyrisrOw3U7Fvt9/WUv1+0Wi/kX85ZO63DWuzi7r0i5y864Fn33zJtc81XTbW4LKpA4YeudsndV678Kid9r31wStvvZqIElOmTPEtXrPskH88esMrhfkdcOTo8Vc9cdtDNzZFW8DMvgPOPnbqx6vm7DYor3ukZNyBN4YvvuYWIrKlkDjnir+Fn57z9qT8rHzetWfRu8fve+T9ocOOefeaf5cd8fD0ihf69Rno3dxUp1dt2SRMwwRHLZhawhSAz+/lJmiCzU6IrN32G+EUIJgchThJQselQidvlig9/MwLHv3wtXO/Wr+8yFBCd80JkjQNWlvXqLWwxbiBRV/kikD95GXzDjZZKIAlpACkk2skJiabWbPS2tZQ2uYuPTpjWL8Bc/+yf8lDoXGHvQ7Aim7YkPvyjI/3+nLRnAO+WbFg/8ZIQ8+R3Ybc8/RdT16Y3ISaOXB/xWMTPpvx2aRRA4peiFQ33xV+KywxC5YhDMyeO7vfR19NO+LiM89/0G1xoeTI3zaf33iSmAb7hVdfOkhJ3UK/xqLJ/O+KshKzJFyRmPH+S5MqF30Zbm6Jxg3BXl9OwYLQudeOKCkhUV7OnCHQnAQw/lkWcBnRilO/7jF/2nsfczza3+/1wjAkmiNxCNM7Y/geB/69z9CxCwFIIqrLCHta/f3y8pAMhcrbm6n/lywEKV4S6oKb/n7Twx+8dMWgbv2WPPa3stN33n3vLwAYpmHap1x46gOfLZkz8eyjzzz9nxMvfsbStiguLhYzP//SHlWy5+e1zU2jLjvu/FPOP+PsV+JWQhKRKvvX1Yc9/fl7b/Xv0X962QkXXLLPuL1n21oZpaWl+qijjtr5xH+cPqOwZ9dZV55w8dWhI4/+AILwt0kXT3z47WcfihaYKAzmwDQ96BDo0Bw0fau6+PPqu3Xo/GW3nJweb8/9bL8vN6zOEyCCpQianQ0lBbFM8jMzWDEkCY5JmwpsI3bKzvt//dT0yXs0sCWCfg/BY6ApFufOgQDv03vo8jeXzR2kPYamhBKkGESktSRWkkmzFpRQMLWARwFerwcy4AH7gA7eAEZ26Pfxwbvue8ZpJaetBQBDGLCU1fmZl58Z983C+acV77XvNV9P//zbhVhoVIQrEgDg8/jw+kfvjD1o731nZRxGKZadbe317wJClEIg7ESRvxgAlpaWimHDFtK25m+//eydXao3rr5yc+XKo6KxhBX0SE92x+53H/rnyy4qLz9umzO7P0dImswfrlnw5bCm+tqRbHoT0ab63C0bVu7XUld9EukEbJhRrewNXn9AZuUVTu8xeJdJw3cpXrN8/meDajZupM49+ln9ho1dqWzLvZcQC0MhOq+oiDDe/UNTgalumF4GAGVlKCsrQ1k4zMnep3bg/J16f8w5I0/ac3lObmHLpw+8cSQRfTN24kRz1sMP259++mnXp99+7sORI3a69PyTzp4MwCgvL+eSkhL1YMUT+7324asPnnnU6aeWHHLM5wCMUCjE5eeV01+nnP9aXOhvnyi9/5rkAH8pwNeR0FfePOn5Lc1bIg9ee8857vfEo08/esR/Jr/0aqOKbhw8YOCXQ3oOmLtH/1HT9t//4GUAqgEE7vnPA6feWH7vPzfb8c6GJQDNzoLUgLJtwGdCeA02DEMLxRA2C9aaSBJHEjEaFOyIPrkd+aPVC8kMegEBWLZC75x8xJWNjbEW9nu8pLVmK5EgTtjwmRL5uTkoDOY2dQzmruqa23lJz/zO6zt17LSmW2G3WECalRGOyy111YO75Xd5e/YXsxcBSDJXKwDwmB7EE3GZFFBKToZ9V9RVWloqFi5cuE0uxO3Agl+mCJLMo7lvoGDRog8pO7u3v0ePgbXvPntnaaR+8z8SliUSlmJmrYI+j5HdsdstTa99fhVCRfK3KEbM/uTtUzcsm3VvtKXZD82GZoLP50EC5jqDjPVa26NZ2UyCWBAWZed1rNjvhPPvI6Lmdnj441txabExLTzN/sf1/zi9srn638/f9OT+Usg510y6RpSVlTER8TvT3+k4dODQYN+ufVcnGWGSh+4jLz2xV35+x8rj9jt8TXFxsTF92jTbSZOx+dW8eYN3HT16fuYhnfy7706Z0ufogw5eHUvEUVxabEy/drp92/23HV3QpQufftRJn+cGczbbWiGS5AMEcPNDdxwya8W8is0N1fP7FPRo8UoPPNIkC0pUVVdxJBEdtLmlPqeBY1l1KoaotqGaE5AKkIbBwpCIRqKUZ3oREwxNnBpaUQkFpTULKcnSFoTXRHd/jj0wv/P8MQNHTA8dcOjUXUePm5/lCSxrsaIgEIKBIKLxKJRS3+nUZHhs3zmr/2MKoD+movWze37hcFjPmjFlwKZlX12mlH1YpLEuoBjCH8iqtRItfRNxG5qh3Jq87TGF4Q3mfHzMOWUH/lqFmGXL5nTgxuZ+VZtW92qorR4stN3F9AXPzcvNElUb1iARj0MDIGXDkATLve3KSsAjCYYh0WIbW3ILClcrrWsaamvm+gNBnVfYSSiNyngkUpmb19HryQragawcS2taX7NlzfoOHXpyp759wRxo7tq1a0s7tPxuih8iHA7re595oGSnwUNX7bXr+K+2lRppG2Jt9yYOQXI5f1dKhb5HD0S4rwuUAWEK6zueeCLv4tNPFwAaAATcj2YAlnu9HgD+L2fN2G3GN1/tPHXR14NWr1+769qqqr71iaiE3wOfzwdlJSBcZpYUSYJm6LgNLwke1a+/NXLA0MUds3NeG9yvKLpi83q5dPkSUrZlKNaRPj17mzm+YENBVnb16L5F8d1223sugDoALIVs1E5HtEAoRBkEpoRfkayEfl5gKRVEYT1zcsWe61bOe1uwnReNW2Bm2LblPClpKCLBtrINn2nA5/MDQsK2bHTq2f++XgNHvtt76Nh3MtTuf5FQZtPaVSc2167fc2PlivxIU0swFmmSVjzaACLL4/USCQkrEWVt21JIaUgpPZDCSxoCzAmbNbRtBcGsiaQtBBkkBAtpahIUIxIxj8cH0xuAxxckIWWt4fPV5uQVcn7HrrbHDE7O69jx6/Zq8+/WtupG+L5wLbOg9mM8m6RgUuZeSIZ95eU/mIMmhEKCy8sLvKan2jQMNEcjvSpXrPB+NOdTf2527sCcnJx+KyvXrNdK9aprqDlo2Zrlw+dXrS5cUFcFW2nA1qmKLmlAKw3D1hjSuSty8/LsdbHa+Mb6OsPQ0qudKjGEX8LweyGlBNsKiNrIlV74hLGxU1b+2t7deizrVtDxowuOPO2rLgMGrCSiaAYeEbazy+M3B8DkAx82bBj161cn3vz7c/zXxx4r+Gzyk99EW+o7awiLhDBSFXFoNoUQAb8PUQt2MLfgi0BO3sc5BZ03xVsaZucG/Fkdew2u79p/xGxgR1N6czmH3KpZureqnWLwf80T/C4g25FA2e/1QxJh5bJvBr782Uf7frVwblFlfVXf+kRsYEsk0qOxpSkr3hIFpASbBJs0hGIEjUAiKyvg2dBSj4hlQSi3dzBJzsAMIsGWbZPNNijLBw9JcMxWgoghCDAoTVDMRACkSlgOkw00TNNAVsCPjlm5ke6FnWfu3LfovUuOOfWVfgNHLm2OtgCO0NGvco/pR4CdAEAVFSUoKfmuOJ3w2VtPXL5+6dybm2O2JaUwhRBw5gGZmRV8waz1PQaOeGjPA098gYiWb+eiM4YtXJjk+0fHjh0JAMaPH++wzf4EoGRmUVFRQQCwYMF9BADDFnbiBUVVrT4ftrATA0AFKlBR4bznUvc1ws7lkCNe6Fjq94d1YmR83bn0UOZ1crvn124/U0RDALQgAaVV3ldfzSh67v1X95tXuXzC+kjt2NrmppxYIoGE1tCGI6gkLAC2ZijWEGBIIgiSWgMaDI9hOPwyGhAMt30G0KyRMAjCMNkDKGGzZKXJ4STMoOdSyU5o13dwWHAYgjQEQYGhwFIahKDpQQF5a4Z36//JkXvu+/Bpx535HhHpHwj9f1sPUEiJVfNndmvcsqFjNBEf2Vi1KZcJe9RsWrdbpKmuj4aEIQUJwwAJgrIVB4NZKOjS8yWdSExPxFtMMryJwi69vB5/VmN9zYY5gWAuegwaLPOyum8OdOiwDiQyOMHard3aLbVxiXDcccfJiooKZQgJS9lZNz12xylTZn1y0vLKtbvXWi1mxAS0FJCatFDQwmZy1M/JZX5mQpI9xqW3T0oYMTtRjmbWiURC+EwPFDE6ZAUxqGOPyhVbNvaoaW5CrCUGj8enpCkEC06PIrvMNJQCxvRsMru6tQRiMLRiDcVKSjA6BrPRv0vPN87eL3T/eaec+15DSyPwA7T2vygAJnNUNRvWHtxYu/mktasWUnNddbYUYqhtJfp4DekRxJBCIB6Pobm5GZatIA0JwzRBQoK1htYaQgh4DQHTZZ41PV6QNJFIWGiJxmAYHvgCAcTiCVtpvd7nD0Kavlg00jTX5w1wdm4BAtkF2p+da/n82WsC2cHFvuzAJ8FgYeX35dL+lymv2r3MP6zX537Kvstuv+qvUxZ8ffaqus1FzdEIlMUwpFRSSrAkAWaHksWN21jAIRElgLTrpukMdR2Hbh+KtfZ6TdE3vwsW1a6Hx/QoIVhevG/o0bMOOeGtK++75Yj5KxaXrIzVZrVIwCdNRVpJrbT7euwSlib/nssBmEkFnU78MTO0YiWEz6AO3gB26j7wrfCZF14xdtjuCzT4F/EGtxsYqqsrB1sNDf1rtlTaLZFIjWGYRlYgaGoiJYVHsWGwaRqIt0QMy46bHjJsixMMAJZlQ0qfFMJWUnq11jrZIsPxWFyQ0EIySydM1iwlJIT02DagtSUMkh4A8Ho9DMNLPm8WGb6AFcgK1hZ2zVlOlF/fvi2+9xkLACguLqZp06Yl6Tbh6kOwcyITtqXf2m47ltfHk1ggDM3MdONjtx3/3JTX/6861rRTbcKCwaQFiKG1YHZ4qJio1ShwkjaLhMNPyAArVmQwgVUanFiz0rDlhEE7vX/HxP+7f/9//e2VRtuCjsSouy/P+uKxN0f37tJ70aZ1a4ddff9N572/eNaflzdVZ3PcVh4IoZlJaw0tAI/Pw2AmTlJ0ueJLlGRr0GkgIgAsSEFq0UGaZNhoOHrCn2647eLr/k1E+vsq7L9qCPw7Oi19ADq6LjS1Pnu2ug+6DWhk5jpFOqPR6r4lAYW28b1M09/z+5lJ7Lauvsz4/RRZeMbPU5u/kfk6CQB1PsOrlbJhQzsitUJA6a0iCgqVh0R5+3TLjn6YMTP3O/jcI/+9orryqB6du2F9Q71a21BHkiHYJTrgZOU2Kbgh3OWsHS1fAeKEZBheg7J9PjS2RCEsDVYaYFbKgCzK7/rV3P9M2c8QRlPxBUc8NnPDijP9toi3NDZ69x6w08ufPfPucc3RCAySWDZvzpDLn7v79inzZh6ypaUJhteju+TnUUEgm76tWw+/8DDbziQKkgSwIk1Tk6bKAkg6OcK+Wbmqf35nuaJ+Ezrn5r/28X1vTSSiavwIPoCfDQCTtPUAEAotYKAMySLCb2VuUWGbxYTS0lJxw/U36Etu/sct32xYc6wdSzAxSzIEMTOxAoQESDgMt6wZrJVzW2Xy5siULkMKfZxqtitQ4/x+mvgMLtW3G2qAtwG3KTWD1ClIJNLpTjfZDHJelwUcpl/O0ILIeC3N7vGp2EFO7aRaTI8H2f4A6hpqVja1tGzo1rU7ehR0irZEmuaOGzsu2DmQM3vvIWPX9Bg8dFljS5Ph9/rtWCKWXhchCFRAcztZ7I4S8lJuVo6+9/n7jrj+oTsfKcjN7tS/ey81c80KWtVSKyQEoLS7dFIkq27V1gVAdwGTxRy3EhT0eXHwqLGrZ29Y1Xt1XQ08TMS24pht8YCu3Wo/uvXJfXt16f8tmGn2Jx8NPfbuq+fqRFwOz8rhhZFGcclx5+19wSlnz6CxMDALFjMH73r0rjMefu+lWxZGqwLBnIA6e8xBH7zy1bThlVZzD79FnIjEiIRgw5TUat8ASXIGx0sQhEg8hp7+PN530Ki6+ZVLChTxuof//q/jdttp3EwNLdxx2XYP8DtMZPmDet+zD3vnjRWzDoF2gAS2AkgCJB0RLOF45azdcn8mxThndLsgzXLBlHlqud8lau3T0VaL2AE03sbdz/RLWWfIZCEtdpNsRaB0OJQZGunk9Wb4mKw1DMOAJIc63TQlhAZ8hgcmCPnB3FjA41nSu0OXjf26dv+2S7DjBxcd/9dKZHsXtyWQ+LXaEtpt2zn4oC+A8//19yte/vSdm4Z37B8HCUxe+LXX8gh4PR5opZ3CQ5IIOmPhaqWZDSJDSgjFnEgkqIPhtS886qSnX/3so4O+2rKmW8DjA2uQrWyVbXjkeYeceMaN51715LGhYyUAlJeX69Alpz/95fr5p/xt4Ij44qYt3pWN8Q+nPfn+gSUlJaKoqIjD4TB7TA/P+fqrvc+676r7ZjYsH7FLp0Hz7jn5mlsOC5/56JZok69PQSeqb2mhFttiaZpELk1+soqcVA1hl1IrGo2xoZgPG75z5drqSlUTb8p99Kq7Lzp49wOetbX9X3uCf1gATLG33H3dsXOXLxwXyM7ZedXmtcGW5siQmmiTr86KwRIMQxi21CDWTE5ASSl9hdTNEenFlKZSywQ9BrP7IMFI63llUoG3iXhTLVLICFlcAExT6Tq/KchVCeM2D82lGE83WqZEd5gcXQh2KCWYBJKzoMSORoVUrJ3CnGb4vR7k+gPIlb6GTtm5c4f16jf16AmHTZmwxwGfeQyPbSnLCa1LAS7j9haeXxH8mNm46LrL7nvhk9fO2nPQqDmrG+oGzK1cmev3B1gQSCVzfZkFBjjMLDZrzvV6yWeY2BKJaCsao145+c0vT7rzz7c+/8jRLy34/DQTUimwZNNQGkru22vYOzOfeP+w+uZGQUR60qRJoqysDLO/+GLwaY9c8fWhnbv5i3I7qKW1VbJ/0c7H/uX0y18tBYsy54Kd+glzt0MvPeGlRRuW7bH0hS/2uPOO28eVvnzfrQP69EmM6TFkyzMzPuyWn5fDMbaJDJlev5w87BnsSoCyIEQSLRjXfciyTh1yOy+rrsz59wXXTjxsz4Me+efVV/1X43H/M9VRv8eHSDyaVV9dPejRV57qs2TT6qPnrlux38qaDV1rW1pgGh5lSCG1i3Kk0o5YEpCS7nZqNIjSgLiV00eteSdbL2zH80xBWlIzgUmzACvBrMGAYsGW7XinYEAk+wlYg5xcnsP8S1qCIECUJONFsmrmgiLcEJtcZS5BrlyDZgYRMxi2VqShhRSEgOFBvunXfTt3mz+ka6+XrzzurFeLxuz5rduoCoQgUYH2LvBfOOfHzLjghsue+XDOtJMPGjmuuuKLKcYGasnPlj62LdvJtiQjhbZccRpsJWJ08p77r56xbnGP5Zs3GoP9heqeS64v2bnfkOqx5x45fW2sSZuAkB4JeAzu5M2OvXXtvbsMHzRmwaRJk1LgEgqF5Csvv6yOvOz4h/fMyT67A3kTWsU9ygisOPuKO3YpKytrSP5saWmpEQ6HbWbOP/qiE+d1Kez45gPX3H3JCZef9cLkxZ8dfV3JBXc+8E7FsY3U3GNU9wH8wdJvhN/0QlsKUOzIXmpOqcaBCGRKNLc04k9Fu8X8phmZtXpR8LnS+yfsNnK3z/+bGeE/PA18KBSSKIYRTcSIiFryO3WafdlfL3ul4rZn//zVo++OvubwM67Ys+uANR4pZEKAiQTDjUKFG0tyZqqCW0erjh9EGd8juAW4VD6j1e8kp8o57fURAG1pHU/EhSYtvQGfkZ+dZeT7/KJrIEcMzOskRnbpI0Z26UXDO/fEqO59xZDCbqJrIFfkmabI8ngMIWEk2JIxbYm4bZHt9B3ZJKQm14PM5EXXYGgwscNTLsGQJknhFSYbbKiYpex1TQ1i+qpFI5+fPS180HXnf138l0PffKT8kZOYOZAEv1AoJNuV9X5m1CMCSksFM9Olt11x1esz3j75T7vtX/fOvC87bkw05meRF7ZS1KoEp53igS0Y5BEgj9RxK4axHfosHtBzwJfLGzbKHjn56h+hMy846YiSVyY98K8zqhvr4VWs4vEodu1TVNMnL1uP6Tv41Z2H7bGAmVuBSlFRESutcdSu+9/n0UJHY1HRHLMTJhL9X3/6zuPC4bAuLy+XABAOh+3S0lIhiOrOPvLPp48aOCIKgF645dF/DO3ep2bBxpVZfz/qrEkRO0Y9OnZq7ObLsSOJGEsi2HGbodzoK8lmTQBbNrK8WfrNeTN8W2prqzoHcjf+7d+Xv8bM3ZJ8ne0e4HaGFZmsEwSCZt3trGv+dtm7i7+6eENjPXvIABEozgo+w8Ng7ZbwnfA2Ge5q1qlw1zl5KSOdx+nEbir/xxlHO6XCZaWV9gBiYOee6wd07zW7e+duSzoEsjesX7t2TtHAIk+fLn24Z7euyPb7La21Ukr5Kjdt0ktXLsWaqjX+/ILCvRdVrvDFbD12zebKDvWx5j51sRZfhG3E4nGAiQ1pKGIIYi04gyY9WdhJFVmSi8LVLyQi1gxtacswpUBhIBsDC7vNLS7a6a6yC8peIKJYMuXQniP8+dI34XBYPzv5+eP/+ehNL+zeY/iML1YtH7y2uaYgKD1QApTUCU4VOiAQU3HsNWioXt/SQGuaarhAG+Kly++8+NYXHjngs2WzDjvn4JOvvOXC0puZ2XPI2cfOmLxo5liv6VOIJ/jco055Ytqi6SddcPwl+5x5yLFz3BYp3fa6rr/+Bn3vDed/7LNbJrQkNLL8HsDwrh0++rCRb376aZNLbcVpLCfWWhvuZIe+5NYrTwD4gmeve2SvbkeOmOUNekbkyyyesXKRp39BR8Aw8O3atfAHfE5PYsqBYGe6hIij8Qidsut+K+YuW9C5sHOnzz++//UjiCjxU/KB/7Mnd9JrSeYsvIYH195z48kPvfP8kysbtshBvXoi35dFX25YBR+ZzMpu3VCVLtxn5PuSCvWtayHsAl4KbZKVLga0UtqUQhy7+36PP1V67+UAGj3STFja/lHvJzuQhcaWpgAAtX79yt7vzvhkwoezPxmxcsPa/Ta31A+pTkQQt22YkEoKQexMOIF0Wkgns7KTLPqw20ohyFGatZQiSBYdsoLol91x9hG77HPXFX+96iUiigCQzNzeRvPf5/3AzP0HHj76y/7d+0Q2R1p885oqC7O0yXbCotRUhSBnRE0zEpbF+WzG/nLQUV8++MXkfaIeW+yW32fKJw+8echeJ01YZkrPpqnPvLcfEbUwc6edj9vny+UN1b3sSBS9OnRbcuc/y+5+7I3nz3jllmd3sbW9TUYWJ68e5ndfeexYjtQdG8ztsiwRqUN2XsG+BT2H/HPwsLHTy8vLZUlJiWqDMUlHg4iIX/ngjT2OOeCILx56/qETr3/m7v8YWQF9wOh9rJlzPpXDBg+rfW7GlE5ZgSArdrTNODmP7OQEoEzJSMT18WMnrJy2ZObAkw887rKbzpt0m540SeBHHsLG/+pCy9ikKtlmUHrR1f+598HbvddUPPTw8qYtOLBD1+rhRof4/OaNvX0+PzNrgis9mHbmOF2syCwNc5tzxulAdfqfOAWe2iYthnbuseyp0nsvJqImd8GI4tJi0cmdQ0bImTYOhUJcBmCY235UUVEBwJlTbqpo1i4IAcBSKeRS1hqKdacX3nxpxPtfTfvTN+uWHrWybnPv+mgEUhjKFG4dPAl6lITwDJx3v6kdZ1Wa0gAJ0vUtMf66afWY1ZM3PzVjyTfnfTz9ncsPnnDkNCd8+3mbVf/HwI+YmfY7/6j7/N5AFsWpee7GFYVZ2dlssyKWwsmT2ZqVZDJMA2BSxAl58Ki93trS1FDV1Nw8vktuPh8+dvxNAKzdRuzaMLxo1D/d9QUAvc2gr3snKuQ6bKY9dtr19QN3P3BmfX1j3Ys3PkGpMLyNhcNhXVbGdMgxeOOjV5/Yu7Zy0RnK1oHmhhp7y4Z1k7Zs2XLMPffc09xmKivJOZ3ac8cccMTnAGjiCRNff3HK21/NrFm6S69uPcpbaocM7pbXcW2QPMfYMZsgGAmt2CPN1IZhQZAAxTxSTl/+bZ9deg2LvPTh61cprV8nouU/ll3JaF92Dhi6bSry3LMvfPyC0ov7Pj7vw6snL5lVePaI/b821nhy5zZvyPMJk1lpSmb6kiFu286WVHibDH/d6lzKE0wdi6RN0xT9Ovf4xGt4mkKhkHQpjvS08LQ0gFRUoGL7PFpqlUcCBBFVAfjI7/V9FIlFr7vl4X+f8c6XU05fuKVyWE0iBo+USjCJtI6rU0UBs9u6k8xlOmOkDAY0C8EECam3RKM8efHc3Rbdf+2HZ5b99cEHrr47TERb2r3BH29lZWUkQPqW5+8+blV15YF79R1V89JX03r5/V7WCdsJewVB2xoeBuUFs7E5HmUlteianRt79pYHXzjj6vMv41iUh/UZPvfys/4+g4h4zaY1R/bp2melK0imAWhhGIJ8BnXsVGhdfOoF5UQ0C8DXx//ANZaUlIiXXnopUf7AJK+hEz0SCQUViyDL79lv9scVF4TD4RuGLVz4vbO7zCzKysogSLSE77/h2qVTV75ZWbO+9uFJ99y6esu6vq9O/fiA5Zs35Hbr0gndOxbS7MrV8Hu8UKxS1Fw+GFi1odIcnNsFOYFA4PBLT7rU7/GdS9tC7v/lIsiPBEFtKVv++5pb/zUmr+eXZLPx/rK5I/+y/5FPFJA3koBm0szJbvtMb6/VfxK7hZNttcSkkZKd7hR4iJbF7cSPpvVue/2ZH+6fVMxMpaWlIhqPCSKqufKcy26b9thbxVccfvrfd+7ae4U0pIxDE4gcSo+MQgllgGmyxSfZB8lOc7gwpCFNaepVDXXyP19+fP74iUfMePX9lw4FoFKI2m7b4f6BwuEwK9Z5z7//yrUDuvbiedXr8uMmQUJQstVJSMFxsnmnXv0b+wYLGq2WBHtBNKbn4ArAeC8mVG4g4KMj9jzgBa/paQGA3l16r2TmZIGYAKyzlLW6MlaFDrkFn4zo339hqDwkQ24R4/usvKiImRlDR+5xW0IbltaaNbOqb2zSm9atPH/LFs4pqajQ31cYIyJdVlbGDKZrzr1yek+jU7WZoJ6B7OzJRX2Lnh7QrfvMoX17sOE1YiN7D5gv/R4ow+FvADsN3sq24fUH8Mny+UbHgg68smrVqXOXzBuKZE9aOwD+NBAJhUIgoqYzDjrmuu65hXotNwbmbFxWcPa4P/3HjFtCM2uk9nW6ANKqv4+TtWAXSygzFE5/zsxsGgZ6du5lG0Ky67Hxz/2e3GS2Qy8UYklENf838dLbZz7+3q6n7LzfDb2CefG4lRCKWRFTStM16f617T5M5WPc0EazFj4yYNnK/mTt4oF/f/TWNy+9+R9hZjaRoa7Xbt9T+KBSEkRc+sD1J9fUNQxtiMX1t3XrhN/vdZrctXP4KAKy/D7ab6c93qprbCDBWnQhv/X3E899MDuQ3dKgmjf079kzdsHp5z2TsB0yYvf+M9IHY12HrIKqeDSBbvldpxNRtOq+Kqponbvb9npyK64j9jp0OQtzhiGJlK2gNFjC7jLjnduPBcBwp8Z+YK8JQxqN48eMq8g2g3MBtBDR5r2G7fKqP8tPzYganXM6PN3VnxVJ2DYJTbAt2yGqcfIxiPoELa+rVsonAlc8dPM57FQoRTsA/kRzvTBxSuj094u69PocHslTF8099tq//P2jgbldqxNKCXL75ngb3AHJAQ6wCxzEyca8jAbndIgpiJAdCGqXHvyX9zMqHK9QO0BY+1T4/quf+dv1f9q7++C5QpBMsFYkBKfeCAGZLOUZMTaYkjAPOAlrYfikqdfU19IT09+ZdNpVE99l5g7hcFiHykOyfXV9d/oijLBWWudM/vDj05ubI7x4QyUMktBEUKRBSgMKnFAWFXXqufaAMcWftwjOFl6BXfoNm7bPLvt82xxtRmN97apB3ftOA7AJKBUZB2BmmiQxrOfABZ0tH/YZvVuVIIFp06Ztd/QxHhDMmgLZ2eWaNbTWTEIys9LNDbUXMbNEKPSDC7q8vFwrrRA64qiyw/Y/4CG3+ENXn/XPN2oammu1rY0Ddiue08eb/xniFjhuqywhSbMCCQEWBL/Xi8rGRrm2rgHLKledBKB3MvJpB8CfehqXlsKQhrVb/6Kncw0vrW+ozXrmvddGhfY95BWvKUi7OjGtvKLUodNmJO47pkCSiWGXseNXzZMRUQoI43ZC7j1+/w+mPf7mPqeMnfBwx+wsGVUWSDjdMpmzzWlFu/S/AkjNBrpN/MIrTLRYtv3irGn77jPxsMmrvvl6SEVJhSouLm7POX/3M0HF+xU7r4psGVMfT6hYNMoGyI6xpQZ06hztV9gpkUjEdUAL7D9yj5d8Pn9TjYyhsGMHHLnP4Y8LIZoIwIEjJ9CgDv0qHA9rIX1Hrpv327P4uW7Z+XZBbsEm/pEkQFNdYo+ivQ79IG5xFFoZfq/HIEghVXzU9DeeKSYiLv+BQy8Z7YwZNKZ6r9F7VSWvLa9z7vp+HbrPK1Ae3nmXcSgetusnWSwQ1wka139obZbfr7XpzAVorQFbk45qvbGhpuPND9x8oCENlJWVtQPgf2NKK1xYcsa07jKnKa4tfmna5NGTzrvyxe5ZebZlW4KIWie3UqM8vJXTlZrNbVUqST4BAiv3t0K/br7MXYAqFApJImp6JHzPuWfvdvA53byBRNRKgCB1CtpShRGXsYNaYXk6kQVAM5OU0iAS9sz1K3YuueOf05567tGdpk2bZqO4vfC2jedAWmt69/OphwmCyJUeQySUYVkJw+cz5eE77fNNNUehTE09ggXRG/52Tfni9StbhCbulV248sQjjnuXmYkBHD/+6CvOPeq05zKima2AlpnpkL0P+HjXYWNenfXN3A0/lgQtHA7rUkD071+03BcIzDI9hp3QYqYW5hxm3bR+9aJrmNlYsKBou16ZmSmjekv1TQ2yX+ee83PNIGcZvsoj9zv0nY75+TEdFMJn+N/v1aXLGtt0F6ZTEYdU4IbmFp65dP4xlm0lad5+cD+1L8Zt2LXXXqsBUGH3vpu75xQsX1C1Zqf1jZvHAjAGdOz6xeqWunEMKIBlOreXnH2j1qCYnKdLVlTbil4x4MgG/LZhf7L/jICHn6p4uu6WV594bkFNpRHw+DTbSjCccD057Zzs7Em9m5QXyG54zCAIg5jt2RtWdbr+9cfef+w/9x79l5PP/xTbyfDLzEQlJQJVFYROYFQgrTJQ1eaw6PQbchlWbePg+r7ryfz5TuDiqmIiIn3to7c8fNPw3VdtqtrUcfGKpZJ9YkxjIl7TraDgkwJ/zh1kGJ6xvYd9BWBudnZwcI4laWjHvlNMYdS7zgwPGTJkyw+mQdwGZWY+a+rUqYl/47qtz7IfDpNARJj7yTtXCtMYnYg1V0UjkQNMQashRARAsKws3Ogohn5/hJP5/VAoJIhIXXrLFV8WDSw6CMCKMWN2UwN795u3al3DbmZe1rqx3sKWRVXr/qKV1uAkdxOTZtCyzWtHAcgHUIvtKMC1A+C2Nx4ACClk/fGXnjpDsNyp0Yp0qFy+2ho9cNg7MzetHtcSiyfRrzXuMW89F5wxMMzgVt8jShP+/cZeiBMe7UzmaaHTKiZ/+LZ9+X/ufG7uptVen/BoyVokbBvSMB1uCE7xdqRnmjNfLzXyR4ZXmGpVY03hzW8889bjjz8QOusvf/vg2OOOlT9U9U56qJmvyRV/vK6aT/AJPIYHN5x7zZJYIr4OQNRjetiQEtF4DKOfKPW9dOFtU96b9/mggX36tQAw+nTrtWlwpx565yGjPn1C2630dX9IUTH5s0TU+FOvuaysjMPhMI8ad8ji1x6+9hWoeMdEPIHmlmb4A8HmmqpN6w47BVeWh0p+FJ292waGvJz8mf37DHiEiCxmFgM693j1k7XzduvTtVevP43dZ+4rUyejGVpIIQAhQEyCDINrIk2d35j80t4Een17OmLaAfC7LBSCrqigEf0GrX5/yRw0xSOyfOrr3U7Y/+iFz814H00ck5JEqt+PUtDG22Q7pQxUZE4n1Zh5h2EUcDeGxcX7GAftf+ir77//zrH/eOb2176pWmMWePw8LL8zzapZD49hsmCQdidIUmF/RtcLEzlsNM4LSw8MtbKpLveGyU+9dNcDN+13wV8v/zopHr6tSwHAW7ZsybnrhQdvjMZjBexwMEp2tWSZyQKxgoBgDSFIeJiZXN5PrVnbDlcjhEu7ozUxkyYCQYChSZDpxEmkko1LREzsuq8gaGJ2O0igiYigtYAUgsGKmJi1YhApZlLs8s6TkCYRBDGROy7JrJlJcJKLwobmqLITESseq2egvn/P/r4uHTrLF17+zwYr0vT1mgXzE10HDdoAQAf9gaZwLLwMwDJmNm97/xlPc8OKqZeeeuHBnToXzE2Gjm29qe3ysH9i/pmIktX9ukTCWsbKKoglLMUg2dxYn2VrPr+pqemO7Ozsqh/zd5I/N+ncy5cBuK28vFwSkXrhvZc+ffuLD5GIxCp333Xc6z2CBX+f37Cx0J+VxXE4c9FSCx0VWn4878v+DAZCIYEfOGTbAfC740JNRDyi7+DVpjR0i7BFXVP92J1G7nxfrultXs+NWQRy9nmSkio5EEetc4HpMLEN9d9WRNQ7iE2bZo+dONY88MBD37nz4TuPue21JysqG2vNPsF8cXDfEfTuqm/IJ72OJGiqYTrdZUZJL9oFQff9Sg8balXjlpx7p7z+9ttvv7r/YYcd/e22QDBJ1W8YPOjFqW//bXn1ZhgBL4TPhNAMiiuQIQB3QIC1BitXhtHNc0G0HVbc+lTK9NUzgvtUvSezjTHN+EOpuWmHx47cv5fZJqRTje+gjAnxNhAgiCA0IKQAffs5DJLwaMA0DNw95TVQIr6mS17n6HEXnTy3e2HXZUP69lsWaaxZdt3R533RGGkGgA/cl5Ll5eUoKSnRPyaU/W9brsY7bVv2a0/c/I7dbO2hlc0ASZKGLdnO+ur950MA7isrK5MA7B/7+qWlpSLkVpOPP/DY2nsefzAGLZcAWDG8/+DZ385ed+C4ocP1supNcsWWjfCaJidIY9HaFd0FCeiqqvYQ+KdachMO6TuopiAvj7Y0bcTyqjVBABsKcvMqaUvVEEhXZsGZlc0Y3uZW6z0FBu5OSjlMO3A0N+vhWdbYsWPNiyde/NZN99xSdtdHL9w8e9MK65CCTmLPjv0bPlu/uMDvDbJmRSlth1ZN30hPkqTyhiy9bKoVDTWdrn354VeZeQwRNbb1ENyBeuTmmiu7BQteCRiBnWrjLR3rEy1ZzYkEYAo2iSxYWqAVBbx7BSny2LRHzpmHUavRnfTh1ZbOLJXobJXJ4K1de2JAU+bJhlaKP6kiElLkn6miEhhgDVYg1gxWTCAWqxpqICF6Y8M6eExjiN/jQXCGF/965YnILmcdOH9Q1z4z9hw0csopx5w2LeANNJSUlCQjF8nlv46sQfUwR6o2t0PXaZU1VaSUlkQEISRprVBTtaEEoPvwE0kywuGwDofDyceyYuywUYt7de+5iogS19wdfj24Lu/AnOy8VUPItJfVbBwiBHHcTsDvC+ymtJJEZP+Q99leBf4BGzBk+GovUK+Isbm+CgCCXbLyNkuHo49TXgMn/QO0AoFUom8rLzBNBy2FuUO+96+//tpGKCSvOP//bj96p32eyckvMN9d9jV3CuZsHJrXpTGaiJAUItXsQ1tHwm28KYBB0oCwZ21Y0f/AC0OvM7OPiESbip0bOefVTnnyrVPnPP/hAe9e/+A+Vxx6yrkTeg55pYsvEFOSPVpBkA0Dig1ipD4EnA9iNkizgYzvgdkAs/M9sAENQzC730PqZ8EwAPdz7f6cZkMwJGmQICISLpWGcEXXlIK2bWhtO+0ZzCAmEsn5HA0STJKYZOpa3euVgDRA0kNCeEgiaHjYKwzt9Xo1SNgttm1vam5Si2s2B6atXrzrs3OnXPzPVx58fa+Jhy047rJTH3n69ScOZuZsVFQot8n4F6cpC4XKNQCM/9OpCyyNKkHaUXEQJBQT21Z81yXffNkvDOj/ohk+WbRJHHXYETcPHdBrDgAcssf4rzt7s7mhJbJ8z4EjpnpJQttgWBqVG9cRgJztefF2APye0wcA/B7vqqaWlk0cs9E1r+tYAD4FWialdALfNhUPblPhBW/Ls+AU6QAR7bAPgYiYnVSAff+kOy/apWP/WUKYxpSVC4YWDxi1pIMRVHFbpWHfFZZLts1QqnRBrTwgIjIEyP5i7eLxJ1199o2ShKJtdO+7p3cLEa0YNmz0nLKLr3nwi+c+OPbJv4bH7t1p0Kse1iIRTyjS7oMwhKPxkmzQTtF+pdt4gMxm9DQde+vnk1HQ0pw+zUyDE9Bks5I2KckmJHmFYXik4TWEETQMI8vjMbL9fiM76Dc8PtOA0NKOx6VtxaUSWkbZIpuYFKAgyCYhHAFJncoKO3lhBmmw0GDBggwSwjA8hvQaJptaqEQkYa+vq9efr1vW/eU5086a9PT9704450+fl94X/j9m7lSRAYS/5PooLYUQQtb5g1lzvF6PFtKwQIJB0vZ5pG/90rlHJcPl/6YuCQD7ji1+8YDdDqgBgD123qcpn/yUZfjUCcVHLA0k2LZsS5KlEIlFDADe7Xnh9hD4ByyaiNPoU/clNGlE4lEfAO6SXyidrLjr9aTITznNeJUKdagVLZYTRrUeoduRaVMIYLdPsO7b2bP/cuItF30xv2qt96OV83sfv8u+0x/97J0J2pSaHKExl+yhbccjb0UQK0nISCxuT1kw65JJ/75qWtml179+XOi4VvnAzMpmWVkZhcNhTlgJceCBhy9i5pIr/n3NHY+8/+r59fGY9gV8pFjBEgSTRUaeAa4+AFKksJTyyDkjLM247mRRi1tvQZst6hQI2LnC//mQPgPihjTWSkmbO+Z2QH4gR2f5AloapBSEUsqm+uZ6X3XNFk8inugcs6yuC9YtE6bfO2pLU2NODMpsseKwLAUBghRCSWdWTXCShdyVNcjsI9WsCUwSYHg0ASxZ2azW1dWJNfW1w77dvO6W9+Z8ftH//fuKe2+59KaHiKgWAG2L3+9nShYJ5rD2BbOnCEocFInGPSQE4pYW8XhCNdTXHi2kcftU/Pd/u7y8XIZCoWR4X5nn8a/O9Qa/7TNw8Es79R9y+8drFsAjTCin6sypfHA7AP6kMyfZ3WEEPD4CMxIOVEU6ZuXbpjQQY5VO/qMV3d82k97bSsnz74AroKKiQpWXl8uxu+0+7/IbLg9v+OTNm5bVbug0orH3kv2KRi94d9ncYQHDq5m1ACFNF5aiGMzMpZGjgKdBHmGKzc2NXDFzyqO6uWkmZWVt2haxaga5A5Bu3LaZ+R8B6eNb3376AjsaVfsNGoEv1q+WDToGDyR0pvYst3kAydYlTl8rsdO/6HyfkEF1phNsUR9v/orya+4/f9wue723VsyGx+NBXWO9CPoC2lY2bNtO6gUCADyGB3ErLuAIdNmJRAIJZXWc9tm0IZ8snDnkiwVzR2+sqdpvc6R+cK0VlQnLhmBShpAEgmBkiIlnvgEXmTW7NRZBhsdjAkS6MR7XX61f2W15c9WN08/99pyr7pxUes9Vtz8VDof5l5AxKCsr0+FwGF269/9s86rIYhb2Rs3sN02ziLXKUfHGcctnzxjcb9SuS5hLBdFPB8IMnkGSJJsmhs/fkBPI+tgwjHWPvvTY4wtfXHdmVbQJMMgGYGGrptt2APxJJgFAMbRDQ54A67WGIcGWjVRaPC0unkqYp6ItzlCVy8zCc9uM/I5roZKQLkEJXXvZtf+at27FMW8tn7XLe4tn7T7pyFPvW7y5stea5tqgTxisXRLLpAIeubFwGlccz4ocMk/hlaZa1ryl8MDLT7vDI40Tpk6dKvEDZfGMxu04M1+xaPOKbi/N+/TYRVUbWg7oWTTrjcVf7a28xMIlfU0XqNoKByHtZSXPvCRTbZLC0WlTYp+U4pT9jnhu3732fS/mgBoi8ah26aXSzBghkNOtXYFERSL5/dTPuLq21QA+8RkeRK14waMVjw74ZNE3JV8v/fZPGyMNg+rjEXhgKAkSmlPua6siTLLAlDxs3GhESCLhESY3NUfVV80req+prXpy3NmHHv+vP1984Yixey3nYjYw7cdXZL8nDE4yv3xeV737OZGGLV2aGmoNsJ2orarq3bhl3aGrl397EIClZWU/n56vhqb99tj3yc6FBXP/pa7D6Ueddss9rz5z3Kba6py8/J4pTe/2IsjP4gsSoAHbtgmAWrhqyQKSqbhpa6VzziBFyGSAIXf2N8NjdKqWO762EIG4tLSUiEhPOvnCCwfmd9YtZJsvfvHx+FN3P+BhnzSEDadJr1XkmJFka10mckNNSVIptr/ZvOb4q+8JnzRt2jR7e/JWbuO2IKLI8zc9fsHQzr3Wr7Lrgk1Sew4ftttbtmUJMGlqlcdLappSK5oeznD4W5PBugVerWRQetA1v8OUxpYGKi0tdRwwd4SLk2LRgEYFFCoqlOtpcfJnkIxg04QEImYnJBHVnl1y9swXr3voHwuenbL7RfuXXDy2S9+lPo9HxrUiYlJJbZptCmyRO4ZOrnYNERQzCRaGVwve0tCoPlr6zSHH33r5zJseuP5sY7q04Ygt0c8IgmyYXvXxyw/f+cXbT744b/qb/5n9yeT/bFq3+FTpD1TndemxwWWi0T/bngQ4dOBRj+wzZp9q92ubOvlzlyFuo0d+NwbQ3F4E+S+TXxn71L1TBAB2c7Q5BrcJuu2Gpwyvu1UDBjlaIq0rosDvaa4hHA5rhCDH7V38xT79Rzwd8AWwsH7T6Lp4ZP1Ohb2/srWShHQUSClvN9kfmeyhowztY4KHpKhqbuRXPv/4NjeBr7EdY0xEpEtLS4VHmhv3Hzj6Qb8/iM+rlu962K57v9U/r9O6OCnX9XMhbiud+rRwOLnXk5xoTBLdkiBoZs72BjCoW99EZl9MG/7F7wSHzO9nhPMaGXyNcTshiKiu7G9X3vXVY+/udsKYCZf1zsqvtYSWNtim1LhlurBGqSJPpi5NemFpBpnSkFILtaR2c/4d77308ClXnXFX0Ofn5Ezwz5IFLC1N6hiujMWjOhKLJpSV8MRbGkfWrF16/KIvP3qkpbq6x38jXvRdOcHkYeLzeBt7du2xwu8PwtLWV4aQNkKQP9QO1A6A31t3yvhUkFNhBMg0TAFXKwNtqK5SUpSZFWDK0NtI9ZfR75IqtLSolGNWnB6+5LrSwXldGmJa8ctfTT/zvAOPvaWTLxsJrVlwWjIg6QByZg4wsw/OadkTJkm1tH5T11OuOqdMwOGK2y5QLguzpW26/dLrX+jjya2tt2PitbmfFp+2zyH3ZQW9pERGzis1ishIy/JlPu50I3VKklE4ZSqfz4+uHXtpN/H1852zbfga4eQ36x+55o7bPvv308V79hj0odc0DZtZC05dYOv58jZBRnIdum4qmCA90uTaSIv95sKvLhx32gH/cZvXfxZPcPx4CK1s+IPBuf5AtiAhhNYasbjFzS0JS8DKm/vlezv/3Jjj5gQZAJTSKMjNXdAhOxf9+gyoVKyRHhxvB8D/bo0mP3G7/ckkzoxhuW2OPUPOL+VJZKJqRnMsARDi90OVFw6HdSgUEkaHwrX7DR37aJbhoRqKD39/wcwOY3sMeo4cbWWVCvWTB0EG+HCrHKiTzRcgGYsn9IxV88/86NOPR1dUVKjt8RZSumE+X+WwTr2/5oYYlmxYc8BV510zq6cnr8YmNoQQnCJwQIbWSYbIlavLnEEm3PrBCkkIBAIJACj75W4vw81varDs2mvA/GkPvnrYEYN3vsMnSCSgWQjK6PARGQUdahXEc0au0HE3mUxpGM2RmDVj06qT9jzz4Gc8hqF/DhCsrh7m7gc5h0kCgNCO400kBCnb5vra6gnOT0/9eW+Ym14gQRjYu7/O9fswbvjOSwUR4EQS7QD4X4bA2hGdTqsgKU3u0GkGpmV2Oac+d0/pZJN0ZoIpPb0JTrFhhX4Xt6a8vFwr1nTr5TfdMbSge13MjvO0Jd9c8a/TLvxPN09WIq4VUSpxz62r5NSmNSFZJWaQVxi8vrnee0v5Azf6TS8WLly4PWEwh0IhKYWM9erW451sw4sttbUd5y+dN3psv6EfSxB0Zu6p1RhcOhXIbdoluHWCgrRS8Alh/cIAmBkmK6d+Q9bz/3r00qOH73Vpni8gEgQWTm0nfYgmizypnlPeKmNI5BRKBEkzkbCsb2oqT97/nCOf5Qz2hJ9qoVCIAaBrn0GbbKWt1JIHQEKQ0qBopGlXIQ2Ew9PUz36vSkGWbaEl2rSps5HbcNz+R3ymmbdBTdcOgP9FMExIkjazlpRZzEhtJxLpcNnJNIPbeIO0Vc7w9+gSJ+nM5fo9Bo18LMcToM2xxr4PvfNSn3EDRzzv8RiCyfECM+f/OBV5ZrBpu5MU7itLFbf1t2uXH3Lfk/ccVFFRobanIFJUVMSaNYpH774wx+tLNHMCz7xZnhg3apfXcoUHSqnUQk85f5nvh9NkFWl3nyCESDVxC5KwhTJ+DQDMMM3M0MUwXvz3E3ccMGDMxX6QsIk1OQ0wqf7TVJN56ouOV0uCWunrMgABYSYSlvX5hmUnn/rPidf4vX793zVMO0d7QY/uK6LxeKMAyEkJkiM7S4REPDpY2VYB3MLQL3GzKivXbhnYte+MgD9Qt71bqx0At8/PbtXbKwVTcvB+mz/H3wNwbYhUmZxcDODIW/5ezKEz1/Sv8/7+cG9vXlM02sJTF82++O6LS//TwQxELdaC3LboZBKAvuNEZnBqI3tI8sbmBjw75a2rmdmoqPhh/quysjIGgCP2KK7vUJAXj3kZTVZs74mhs+qyhTehtJZow8/NRNiq03mrLd3aXbRt+tXPKyJiTIMdtxPGi7c+cteRw3e702cYUpEjOkXANnKZmXnCjPwnp++zQYbZEInaHy38KnzTPdcfvb0ph+/zEfr0GZ3weH0RrZVbHEryYbCWsPNnTa0oAoCKH9AL+dF56bJSAEDxmOLm4t33fiQai8LtWOB2APwZ1iBnyEQ6ZiNV4yXn6BWZGhqUsQC3FVZTa0rl36OAbpKCKZjXZdlOvfu/Znq8tLqpeuA7n0/L2XvwqLddhmKd6jZJfjC37n9M5gjde8KABEgtqd8w7qFnHyoG8IN6IsKZRyYEchcbpliBLA8Wrl+mACzvlJ9XnSzAJAGAMgaUU0UE2rpntjXN1299BrPSgHzm5kcvH9u170dawgBIuc/CubWaW+WaM8pOW60/DYZXGGJjcwM/+uErtzJzJ5eEgn7KWih3ijcRKxH7NuD3kZSShBRKENlMZLOyUbO5em8AWLBgwc96R8Nuc/XhBxz+4Ul/Knk1matu9wB/ziCYHdYOwM3OJFsPmNLzr8kmGG6de9lqGiGFBwRBAvQ7ywGmTt7SUihWdMaBR9/dM6eD3WhF+cn3Xjnv3xOveKarPxsJZYm21FPOveCt9OM5I1HoNUxUxVrw6tdTr/QZHlSUfL8XmAQqrzSbpDZq2bbhM339ANRqy1ogDQOcVJ3KzEdmxMTpz7mVct+2vMPf6sBxdZYTz1/270v7BfIa4mwTQXCrIZHMJh+d9q4zOx2TLeEaEB7p1asidf3PKDv//zyGyT8V7pOxSyArX5AQLIRI5GQFZZbfZwilPNFolGORpqEAMGzhwl/qhtKPHa1qB8DtuankriZ3h1jMurUGkkiHwAAyJ7eY2+wh3fqL7Po8v0dzpAMI48cfOm9Ih+5fQgjMX7dyj8K8DhjUoecnJAQB0GBOedCp4kNmgcitBKdSBERSW1ov3bRmv1feeakY28kmElcW9enQ2URzHFIavQDkD+rei0RCuXlZahVupzqSWjUuth09Q5vk4G/udcvuAwZ+c+iI3W8LCEMoZk2ZVDzc6tR2c5iZbLyUmtcmAEIKEYkn9Iyl885btGT2LviJMqYV5RWamcW4I//815KLbuu038n/6NF3bPG+2R17XeIN5k7VGtTS1LS3MEyU/Bf61z/oqtCPO63aAfD70xqtXLkkvplEoi31VRoMMxpT24ZSqRwMJTEhw6P8PaZGOanhYO05YvSTHf051KBi/vNuu3qnc4/589P5viCUS3NC28h7Z3TkoW02zpSG3tRcj+emvH6OIQ2EF4Z/CIHIa3g5xxuMI8ZobGywAKiCnLyoyCSnJWr1r5Mbo61Tudx6bI4AGMZvP7fIzFqxptv/eduDwzv2WGuxLcAuOXcr1zajb/o7ctXMTjO0xzD1mrpqf+kjd57t9/o5ycf4o6IBApWVleGrD98YVHHPFbfNeOORxxZ//clJDHTsWzT60dHjDvl7Yfd+7ygr4duR1nA7AH6335exXpxRkMxuAWadIhnZavtmUsVza5bh9Etzukfwd1gESVp5ucMJd9W5V73bw5+7JR5p4cUbVp8ZOvSYqXmmb6kWJARIt954LvxRiiwrlcx3BkUIgiFjlsXz1q881GqyeqMCP5SkJ1tZqKmrWU0gRKNRAEBVbe23wjDAqYFfRttxYG6bm0iOyLUhNiX7t3cDk7lX0zC37DNq57uzDJNsWzGlY2C3CEwptt7MlqQUKU5GjUQwSYs1vlw5/8hILNIFwI8OhYeVhygcDmuVsPb2GXRaItJwhMn2Wc01lf9c+c3nzy7++uNLVKJR19Qs8yB5We0A+DvCwrZPjNsWhzOj4HQ3ViuyhLb7xwVI/Xu+N86GFB7Ds354j96fCp8Py+o39Vi9fHnHA3fa42ODwUqwznSyqC34JItGybvmhMpkCkNtaKnPvfz+q4+VQv5QXyAxGJFYJCKEgO2U6T0+j88hLAWhVfdf5qhK20NsW4WsHWhmkZnZVjbdfNF1L/XL6VhvKcsd+eI05Rpx5pRcK4+QktM46WdABkm1JRHpdPXdYScRHfpx2NCxYxEBQH7nzlUWk23ZOl7f1KLqG5vtSDSmopHmHpEtleevW7B8dwBcUVEu2gHw9wSAlJlcUKmphnRxkzLOTU5PF7RqUG2NAL+3WeDvslAoRAk7QeOGjnq2U2Eh1UpL3Pnq46dedezE/3TwBMiylUzPU2emqJKHAqXmbzO9ZUMIUdfShDmrlpxpK1tWVFToH+ohM0wpHYfdeWpMMqXsnqljlzm6iAzuP2bOTAfusIeOOypY2a9b91c8Pg80s0oduYSMlZlcj23WGlNK0AuCYAjBTfE4f75k3hHM7EPFj1ua46c65/iWDau+isVihmbtIWYJwACRBAyLyFDRlvquDmAuaPcAfzc5QOJM9w52RhWYmVuFSpmdHpmcyNt0Igj4fbZCbx0GExFPPP2iKb3zOmxUbGPKnBl7dRs8uKl/YZfVWjAlmY9Tm5FbV4Aps/KaJk8VUMTLNq8r+nj6+8UAuKysjL77oCJoxSqtUQLliMFl9vVR6zREq8eQoeq0jQVhb4O1+reyCgcI1cG77PVhvicAS2mRunZqPYWT5BWE6xlmEiZkHMZSa1BlbdUuaGzshTRzzY+yaNyKcSrB7Ra/QCApSTHJ2uqNQQA/90RcOwD+gjlApRmATG8M6VQ3WwPaNngAneAigwihTWFRtAlFftdhcAgSQH3P/MJ3DWGgJtYyYt3y5V36dev+aFYgAAWt25SGtmriTQ0xUDI7wDCkoapbGqli2ltHA0B4avh712wkEY2TlEgRYJFDV8UZYkWUGnSjlJBpaxDc+h0yM6TU9g5z013GnLOPOP2LDsGcek0sUnW6zMZoSqdaOMMNZOLMUWgwmAQJvSXSlFv21O1FAFBSUvKj8cHn85FSCtpWrWnfyMmbe/2Boh0I/9oBcDs8QJmiJ3dJCwxJAq0qi0kPgzIkJ1qJACPZXpGejc0YUfoDWHFRMRGR3n3gsA87iACqI8247fmHdr37kps/zpVeS2mWaBOZuZzlqbaMto3HzARBJCJWAt+uXr4fMwcx7Ttq5sUODxdrMESKKMCNgznVj5mZh23ll7sd29s82QhMJKCUMna0FRrMzV/VJS9/npQCDNKt+hvdFp/0JGaGRgpa5wbBgBSkI1Yc66o378PMtD0ph7aW5c8yrYQjCpXeEsl7rBGLNBcCwLBhC7kdAH8nDo7bzQbhEiDYytZo7ehl+BTp/Ba3GXtDa/q2VAX0j2BTy6YqAPj7mRfMKDT9dYlYBKu2bDwsp6BgeQdf1iwXRnSyFYhEJtikeJ5cLyX9Xy6c8eaW+sFTPn1/CAB2eeC2aR6vx5OhQkoSrmxdpjQfteFsTIXMyfxghjva6hDbcdT7kiwoLfGoGNSz7wrTNJCE8LbkvBncrxktMpTOayfvtyaymVHVUF+UE8zmlHe/HVaWvP9ZOT7t0lUL98PN85KVSCAei3ZmZiopqdDtAPg78wiT21TpVpOi2+wZSC4szqgCM5ItNRlMJH+UU8KtBnuN3DXd8wrnw5BYumlNLwDNO/UZOsOEAENv5XpwkoWAKcNtSVdsGQzDMNQWq0W8PXPagcxMJRUV35m1MIQhoTk5tMMMrd2cIFOaJyDj77UGYLTSdubWz4pZ72j325CG7ppfsNBneqA0UyvKwEz2XbQm602t2zbz0CQElm9aE2hsafpJZSDNLDwSZDhdYwogWzu3jqKxOATJvgB8+AVJEdoB8OfNATqLnhislHPKOiy/rRlFMrV/Ww0OsEtX5LKOtJ7B+sN4gKlwUwgM69X3G4/fg3qOdXnxxRdH7Tt2t/ezTC9srYUTmqZV2YgprcGRwdmXqaksSVBzIo4lG1Yfku3P4h/keWMn3+SscANwPXdOZ/RSlVJq8xSS7NCtTjgXNZVSO9TMTigUIqUVovX1sz2anIxzG6eV2oT7yaiEW43POf0MRCQsy0ZWVu4wALn4CYUQJtnsC+bU+YNBnZuTLbMCXoNtm7RipcE6noj+oOZLOwDuoC6gm6MiKUTGsFtasKbt5k3mBVvntjhj5OqPdYPcdhgMLOw+uSAnBw0cp6nfzDjo1KNOnV/oz67XYJEKqbi1R0JpFyJVWU8SFBCxUFpjde2mMU211T236T1MyziuGNBOlkJKQLh511YnVKZUafJZJaXut3EI7pDZ2lDIadnbdaexnmyPH8pW6XYXSt9ZoowR2cx2GGYkNZeSq1FIiYbmOmpescnzY67lWpd84MCjTptz/EW37H/CxbftXbTXwfsWdOt7bVZu/nrTINMUJJRtWTtS4NMOgN/jRaR9EKeJTYhkDlxlhA68TZGPNANxmvk5kyE5nedyNCeA3x8ZQlsrLy/XzIxzjz9rVkdfTn3MjmNFTeXuAGq75BfMhUe6ZQr+Tnc7Faq1ZnIiyUJvaW4I3vfKU/uBmahs2/VzQwoJrdO7X4hWWujJZ0XcVsu0Taf2Vl3vSBHX7mjWp1uvOo8QDldCphy9q8GSvOykxGaKkIIog5ycU+nRlniclzasMDIjmx+yF9287Oxprx327uPX3/32U7dcu2z2p/sHswrWHFByzj+G7DLhUq8/eyEzd0JravTf1H6XspjMTCgrIwwbRhXp01Bvb8L2R4d2KXZb2gY+tvbquK32GX9fntD5nyD6QziDyTEtBIP1hf7cpdDrdq1urB0BIDvfnzU54PGMT0Qtpm1NxbRKJXBG76QTfkoSujESoa8Xzd0DRE+iGG1DqZTAQMbUjWodbGWEukI4DerJXc/cukKVIYyU/FWb7B3qOS1YsIABoHMgd3MikYhLw/C5S5DS6Zd0lJJ+T7z18ZPZOqM1vLapf+S1EAA0NdaP1FZkr9rqJpimud+Kms1YNGd6PLdDx4/6FO18RywRz/38888NAPaOEAL9rgCwtLRUDFu4kIhIbcuNLgXEsPJyyhBQ/llMQwNaQ+vkmpBt2EEyO+7TfX/MbTxEZG62NqSb+H3OAm9lxZCCRPSoy06dJcncdXNDXcGa5csHjB+z26Lpy79FTLEwhOOZiOQsDbdidEoXaolSbDESQsTiUarcUrU7M+cQUVMbTlNy5Iu0BrWphbpKdJzBh8dI0+ATc6s8WXrIuzW1vLkDVYEzLRKzsqVhGMmKNmW8bcrIAianXtryA2YgpgN+pokeXbsmXGdju7zAhS7FVUP1ppgVs5Sl2I5ZUcmaSRJ74031h1Yum32oL7fLCxOOONXmrUYR20Pg7w+vQiEZDod1iSMaE1y3fPbAxV+8t+/nk587YOHsj4uZuVMYpF3wo5+9wkQEaL11mJTst0j+f0aCPS2MnkmI4LbC8bY8yT8A/o0vBYPRJ79wfhZ7EJPaf8MT/8o9/5Tzvw4KI6ahBVwRm4wRjdRInNM+IVwgcpm0nM1LWgPVzfUDAHQHwJMmbU2OQMlOFpE+vCjT/SakwkJK0nFleHqcURZpRWBBO95WGTZsGAFAXaypq+nxGFornQpaUySzGTlMapN55jSdfrInU4ORl1cgc3v2/FEeYFFRFQFArKUlYGslGSwFyJBCSAgDMQtWLJrgprrqQ4Aflqts9wDTpxgRgUoqKtSC2VMHrlkw+/zXH77uYMtK9PJ6TZ+dSKBy2beY/+n7W95+6oZP8jv1vn/PQ0/9MKl7+rPe6IxNkCQz3UbKMGMaJDnp4W44kVamyHAU/1CJ2PGAngageKfd1rw8+zNsVhaqoo275fqz3u1zzNilFG8eSeTCTqZmCDJTqS6bThIcHQ+RSEhdG2sOPPjMgz0ALEoCQNsjnUmkXyzVkJvmwOPMiBBbFzgYrUWrkr8updwhictWbF7PMW276oLsOrCZ4Tu3piPbxlSS2yjNwhAkBFcDiP2YJN3ChZ0YAMyAf5fmmnon+k5rvUBpJQEmKLs+lbrYATI/YscGP6ayMmfhv//8Pf/4dvo7c+o3rrqwoWbToEhzo6++tkY3NzfqlqYGHW1uLGys2nT0hqVzPnjn8eufq6uryyMi/hmEmFltq2EvNVtJaWr1DK+eMkYKGOTmD9M9ZanJkd+hKtz3WZJL7siDQ19mB/yb4myjxbLGNkSb/R2ychcaJMHkkqQik16sdX8auxyClFG1NAyhG1UcKzat31VAoKSiZFs5REp7lABIcgr8Mhs3UyNhmR48kFlGbV0LoR2CDzDTKtx+yFnfzLJarBikFBlvIaPRnFt7gpyatU4LrDvjh8xSSqhYYrXf44u5t3O73nNRUQUTCTTVbfGy0hkz8klBLA2lLGjb3qEwR+zI4FdRUSKuvVboNx659pF446Zb49FIMK7Y1iBX75kEQQghTcEkOWZr1dTcrGKNVSfOeP3hj5k5NxwO/9cNl8kustZ9sK2V0zmTCSYjJc/JfFRrPgVwZq7rj2eU5fNvKQhmb0ZcYUtDfR8ARt8uPZcayVxUZh5gG0l5Em3HCglSSEStBKqaa3ZSrAgVW/epad0q58pEzMlGaE71/jmC52lPqHVhIFPBoPXXd6ynVVFRwaZhIhDM2iOaSEA4I8tp/j+kpReSIl4Eke5IyJgEIRckOWZhaM8BLdFETGA7+wCZmcJhaK1VvuHxDk/Ydua2cfaQm68VhtE6N9sOgN/1cEtESclL6vXHbrxfRRvOqm9oSpAQTCADEMxQitnWjjNhaxArQUTSMGVLXFl2pHanVx6+7il3pvG/eZ9EGdKO6agizXbRujZMyGh027rBIzMScU9J9ccCPwYgmmNRypbe5aQZEWX1BmAW5AY+9/s80JpFq4ncNjO6qc3BGWjk/CMUMzbUVg1Kpm9SHkqx8+MJZScywJNYu32AupXwR2ZpoJVEgdsokqrli4xxOMvasRwEAJywElS5pWpoNO4AYOsJc9ezQ6boVMb754yMJzOU0uwzTOR4fZ94DFPD0SXeDpRyXmXDkiXSike9huHJOF3cxkxyRkO8Xt8ORTS2QwJgeXm5LCmpUJ+++fQRsYaqc+sbmi0GPM7zZHgky2y/1wgEAsLjDyA7K0dk+70GaVtoZiVImC2RhOXl+JFTKx49s6SkRH3f/Oj3PNN0SipzWWUwkDtyFql4qtUUSLLdL0kVuNWJ5/6gcGbY/xhVYHflB7x+7t6560qP14O6eLPnjscfyNujz6h5HpDN5Mz3cma+7QcegtvQS8pWqGlq7AtnUmEr796yElZmjktrOy1m1VqPNC1ZTN9BWcY7LllFEpj8ppfXbt7QTztCU9RaeD6j4ttGDCqzWYtT90rJLJ9PDek/dIqlbJSWlm7n1ZQSAFTXrenvNc0sgCxyN0lmtdeQEh6vP4r2RujWJ1l5ebmcMqXUKC8PySlTSo2OHRcQM8v1qxdfF41FGUIKraG9Hq8IZOci2KHbtG4Dx141cMy+R/UbufvI3sP3OKJDjwHXB3M7rM4K+CQJCQhDNDU36botlf9k5uy6ug/FlClTjJ8QDme0giV/VQIgaE6zbWRSXrXqkUYbBbTMXJe7QJTW+AMZFxcXi1gijo65OQuz/AHYgrz10fq9jjnmFOT5smqTVEwEal2hTYEUpYdZU//NYGYSENwQbfbPnP35zluBGhyHwxGkT/HuJ/kBuW3iP6nNki4YZI7itclROqCz4zgMjpw0RxvjvTc21g5VDv29aCNQk8G4jXT7VaYaCznpABJCa5OoS0Fh5SWnnL8BSOst/3C05hSjVi1dmJcV8HkDftM0JKRSijWEYhJgDTYMA1rblYbHm/gx+cVf0n7TKnB5eUi6PX1bRYGzpo7dg6BGKkgWRBTwe4UnkDuv79DdLxhdfMgnrFrFI98CeJOZb/uw/P5L6jav+6fWtowlNJt2pO/irz8de845D08FHnbOq9JSsb26oemkVDpnxSwpLZ9IKS+GqE3Dc8Z/E2X0u/FP0O/7HVmnv3VinsboVdBhpUcT18ZiVN9UPwzAKyawVkjZiTW0e5KkZBpTXglxK9aWVN7OocvXUTsh56xY1DUjqZDaSEK6ibA0YS234X9vlX9q7fclxdszWBMyqsfmDuS5lJaVUpjD/PR7T+9eG4t0kJq1Fizc99y6CrwNwSTOJE91Dgzt8Ziid4fOHwHYjBCSe/MHLRQKaSeavnjqykVzDlw0a/pYXVd9nOmNj9VWQsaV1sysNUNqRTXKSiAUgqio+O2zP78lAFJJidPTN+fTd/Zs3LJxYM3mjbKgY0eZ26nngobaDTsbktg0TcuUwsPS+8W4o0sOKiwc1BgCZKg8BCCEUGgBV1QMowULFhARNQAom1x+36KmTWtfIJAVTyTEmqWzL/ng+buG5uQXNnYt2vvdXr161XJpqaDvA8EM8uCtp3bt1uuJM3v+XCXIjAQiZ+ZbKL3V00WVP9ZEYtGCIgaA/p07VQakx94iouaaDWs75QdyWnY948Ca+Q2bQa4WKGfgF2VM6aeYSigtU8kApBQcsxNYvWFNPwAoLi0W08LTUs9RKaVTQvVw+gBbaTanvKKk6lu6zYUzPCTGNjzTHagPOhwOEzPLk68+Z//6eAsMKTQYIonZTv9j5kghZ5C/UqsTmkBQWotcZfBho/d5j4gYpT8G7AlE4Peeu/eErNy8vMOOnfg8/P4HV8yeOWD+nI8myfrqPzU0tZAk4kBOnoazc3eIlM+vvvOSOCCkwdPfevy8Nx+7bu7q+V+837hl3X0GYnc3b6m8Y+2CL97ftHr5NY2NTYBWBoQRGTHuT6cVFg5qfOihh8wKQJWUVKiSkhJFFNYlJSUqHA7bzEwTJ441Dz7+ghelP/sFr0eacYt1Q3XlEbGmmvur1i17du77T81/74UH/0ThsN7OFplU5YLa7oi2lBvsMO2m+s4oqcyFVuXeVqEw/9FaodOh0/77n2Rl+YMNNimsr9ngq482QduJOV6PB4ozhQNaMaS2ioSTKcK0LDMhzhrLKlfkAdiKWpg161bej0ZSk651iK2RagjkzMIBZcqatn7eO8ossJvGUQAKl29ed1hMKQiQTCN5KhmYes9OXyy1ZodJ6zJrZVnUt6DrirNPPPstAOCy7Xuv7BbZq6urs2uqK++pWTP/zpcev371Gw9f+8HalXP3PPIvV140dPeDJvr8/rqAT5Ig/hoAOhYV/e9pgjCDKkpCgpnlW0/e/HTVqoX31VVvGtDYUK/r6urthqaI3dAYsVqam+xELOJnhjKlEIHcjhXDxuy5tDwUkuecc471fYnhhx46XIE1DRy9z71MZtyUQls2q8amFruhsTHWVF/TtX7jipfnTHl1fDgc/u4+wQw6rIxhYMfLIGIitKl0tK4kJrvsMz1AzmDmTdXfiHY0XXRiLhVTpkwxpkwp/Sk508yKbr3Pa25kpZCX22FsXiAHfbr12mA6hNqUImhp1TPJraJUdlXiki8pSFBC2RAki5iZpk2bpre9olMTJq3HslMidNxqkid13dz6h1NSSjtQFbisrIwECdxw/80Hra6v7mqQVJozKhoZ7UUpQS5GG8F31yPUDNtWnOXz0j4jxj5sGmYEpaVie/NzFRUlAgCvmD1lEFj7axsjVnNjPZobanau37zirpfuufzrps1r++1//F+Py+nQba3Xl9UCABj/P1gEqagIiZKKCvXuc3ddF2/Y/Of6xuYEk9AABGsWtmURoE0ppWFI6bArGh67c/e+L7BW27kRyxgAD99573lmILshPz/XNL1eaXp8RtBn+hKJuLatmLlm2cIbhDS428aNEgCVh0KSeZtgmDHS6ywlrXUbXyAj4awz2KE505tpXWckyqgrix0DAt1KOROF9YQJE+wJE8K2q0Amf2IvZbwwO68ZIKzetE7VtTRk5Xn9a4WlHGIsZFSBuS0tKVIBq6PwlppzJcUajVasCxxiTZ2ZTnXqSdzasd4qiZGWCG7NnpycFGG0GZfdCkx/S+8vHA6z0sqcvvDr82sizTDIkTriTNahVp4r0JawI5kKEIK0MrTo16nbutsuveFRW9nE21n8AICOC6oIANXXVI2XYENpTcyEhFK6sTlqR6PRgs1rF13x+ZtP3dWpd9HNnbsN/YCZafz4MvU/BYBcWipKSirU/C+njG6o2nBFXWOzLaVpEgkBIk3QIivglaYv2OQJ5K2W3mB1bk6WGY8n7KChPgXAIVeEe3sdkWB2dsKf3+WWnkPH7tZr2M47d+jev8w0vU2xmIVYLDpa2Vbncx5+2DJMD5dUVCiisObSUsEZtM3ZgaBmaJep3YnBTHLKWumNwa02W5KDLdltn0mLxRmhc3JbyuTGqvhNk+yipKREMbNcNueTYV9Pe/PkedPfOW7LlnU9KioqFBH9mIZyBiD9Hl8i3tyykkhACeQB6LHHqJ39QcPrVL4z+ROTPRwZwkXfxZhIDNTW1HgBBNqiVDJMTX5JCNFG0jQdBLYGi7Z6IYRMXizXc//Nk7UuCPOzrz513IJNa3chTZq1s49ba8y0Ge+jjAEYVwqTiKAInBvw0ZF77nenIKpDKCR+THW22hmB44aGmt2Ubbmzq86tZ9aG0uCWuG21NNePWDznkzu6Dh6cIKLvVff7QxZByjBVAODVS+edJSUTkQSBSWmtPZKE8GWt7jlk9K2dBgx/q1+/YRubmpry5n/x7oSaDWuvjik5CMBsODeNf2CBMAB89tnr6NR3xGFj99j/m4xvz/p21tTZX737wotEOvD1tNcvevOpW7v6/MGRWtnLO3QZcAdNOPQLhMMoD4VkSUWFytzTWqtWQMet0oScPl25dTk47Vm0WZhuCKaTxbAQ6DfKCxNI6E/efKrk7aduuSwaaRkjwULbCSyZO7Xx7Sdvqjj0tL9dQURbtne+uri4mKZNmwav6akhEDymr8uGDSt7Du1TtEazjhPgTfGeZtaBU2EotdKx4BSgEemYghCyLxKJXgBqSktLKTx1KoBpULatnN4+TqYA065eagaRkMnSk1llTheyWlXDHJQR6jcNgt17D2bO2vfcI/9vY3MDfNKTYuqnlLeXGc5zxtc5Nfbm3mNtcUKO7jJ4ZtlfLn8gfNYVxI7E6XavmyQ5ybN3Xr6nnbAAhky6Ve7fJMVssNLaBFry8/PjyTxxOBz+43qAzEyZH8B4gATrRGSsSwxAzNCCWXhz8heeeOFN4/c46IT7+/cfvpaIrJycnOo9Dzy+/PDT/rFvbk5htZv82O6Tady4o5rG7rH/N+XlTmhbXl4ui4th7Fp8xJuFPfp8JExv5eb1ay8iFT+9at2KMQ2b1pQsm/vx5G++mnooMweT4NcUaQkIdlgMUgtDGq00dpLhB7tdz5kzQMRtc4pbTzwwi9/M8yt1PF689/wdN1Wvnv9ic92WnaMtTbqurtaqrau1muprsyK1G//y6kO3TmtoqOxARODtKR65OZ7u3borj+lBQ0uDmjl7tjV06IiFzLqBZNv5mbRwD9PWnRtpvXkHuOqjzbRw7fJE2z+rtFLJ3FYKATmdX0Sbz1olMJgzxhNb0/QLEGD9tp1LZWVlZEhDX3f/DRfM27hmtEGGYrDMTBdQRiEks9iRYoZ2b6hg4lgsxn2zCmLXnXnpeUKIqEt9td1rsby8XADAlFcf31kn4t0TlmZnHo/SYkysAXZ6eD3+4GIisQk7SA/gLwKA5eXlstQdocn4QDgctlmrLGmaPSzLgiQiIYgMfzA6au8/nUJEax6aONF0ANOhsyovL5dEtGXgrsXrMr277QdhJ+xOVoqnTmX+9qspYzt2H7CmU8cu6zwCMUkEQQwNgs+UuRsWfPH2O0/fVvvBSw8+x8wGHBlgAWfquI3zRq0S562yfC6XHWe2lLk+IqjNjJz+9dMh5eUh+dDEiWY4HObP33n6xIaNq66oq6+Pa62Q5fcaHsMwg/6AmZOTLaI2K9ixoo9efPJRZsZUh2Z+u8Ag6A00GgxEEwnx4pSXGwBECvPypdK6FUPzVlLyGQp6KW5AcoBNkEA0EcPcmV9EtxEBCGSwIEO7vAuZY19IiZSmOPKQep7pOdkUEYN2nPrfkhA12bu68ttvhj8//f0r6qJRbQgh2JGPT9+o5NISmd5zSiEJpAHBQEJbqjA3W540/rAriscWz2Jm8WP314IF9xGA/2fvu+OkqLLvz32vqsP0JBhyRoIKJkDXhM5gWl1z6DHnnHNYV+3pNWddM6450+acYQyYEFBhyDkzeaanQ1W9d39/dHV39YC77q67P+BLfT7AADM9PVXv3Xfvueeeg6b6lQdIwSykUNmsU2vOHEJuih8IBOALBOsARiQS2WD6fsbv+5AyOJKbAfZZ+MtnqrT39rJ3n34rP3/778e++/QtNe1Njb2Vwywk6VAwaBhF5e8PH/mHaZHKSuPs8ePts8eP957LKrvR/p0TgyiqPaUDAwhaaauyftnihY6VWOIoW0np1yXdBpCUUvuLQrZhmgiFivwdlp2OxWIcDofTLISGl1oBJ5ctrJumoEBppBCO8YhS/tNi/r+7maqroyp7f1964PrLO9radCBQ5CczMKe89+Cn+gSKf3C0HUgl2/cWDatPSyXj5bCaDpte+17VuGh0IqJRTJgQltXVsX8YvTs62pYLDcCQImnbwa7FZfZWJ+7p5OZTOaPXl5dwynbOc5IlHnHSAjs3coi7AlhYN7KOMCljCuIzfGY2SGaeQQaUyot+utHMWwp75n1zjEFv2pmrmP//NEGywY+ZB+5/UfULc1vXlAalqRVrIveg1ezR4nBtXEGFwS8LxTjQjpRsHLjDHs/ceN714286/wbBWT7Lv1aOK2Y2X7j36gOVhhaCBDF7PDgze0CSAIhRFCqeDQAj6+p40wqAzAQiRKPQ37wXO6C1ccn5b46/cbd0OuUzfV+r1x7768JV82bs4KQ6YCsGCQnNjMwB5rwfiUREFYBobe2vYnr/IXCc9TiNA7jnXyzlRUblFHkBdpULZ4UBzjNEkPVj6PRaHnzGwz/7H0Lr7kmvv/5owl7J9obzP375wT62ldhOCCnMUNk3R59/0wEuoTx7vV/33RePzfz+g0+SHS39W5oazl+zdJ6v3aJpQ4cOXftrmGCPkRl9uKA0W6UQEEE/tt969Ki3O16b3NTWNM80zZ5sswazZI+CcwGOhUJZJ3abGlo5Whqm9AeLBwKYMmJmnlNmGEKuo7JDhR7OBZKnHgtOLy2GO8v1MOA49P+BN8uUmatls/ryk+76cums7UxpKGjOgQhuP8kzwMIgQblBlmxQJ2IoaMc0hLFrvxFPPX3D385wnx3/G7GdAOgpX725e5GPtkk4DAUwCaG11iKn6MOAoxzhOD6ESrrOyGDdYSAW23gCoLfc8SqrdO8+k+bOXUUra6q4hll9/MqDDyxb8P0F2rZhORpCGtB2EtqSO6SSNme02bRgZijHlsoSxMIfqKuro0EjioyJEyOorx/JYQA1M2dyTU0N/95YAU+YICe5/gVAlkc7CUAVqqo84BUmYdy4qANAsdK5WsjbBMF6yBW5aQPPqBV3wgGzJ/H/2hfuscfOMonI/jj20BGrFv7yGpihbBvatpU/VJbcZZ9jriSi1gmRiC9cAycWG0mYOVOO2HnPud9+NOGWZbO+fWj5vB8Pb1w598ji8q7Lv5/09nlE9A5zRGSz7c6Xz/QlDZ8JR1loamkiBmAlU22S3EmYghI4X8IVBkG3TcGUs7XQAkg76bLO389xHEXoZObj4g/cSXi1oMOSFbDlQrfgXEOE8D/XA4xk+Hiamc0zbjh3/PuzpxylBDkSwmDiPCbaaW7ZaxWQF8ECp5VShmRj597D//7pQ6+d53b28e8ktkTEEyZMkDuOPWy63Z48ZdWSuaf57cSeHR0dpDUrITIorwazdhxh2Tq19c57zs7Ev/AGM/xucCQiJlVV5U+2SZMwCZNQV9eDwwCqY7HOZkNqfYdB1einL0w1Lb+goyPhUOZnF1opSCHAtmIhSKgMPg2GTpv+YFoGgk55j779YrEbVQxaoVNTKBqNIgIIRCKocdV/6T/0+/j1r69FpikVXadbkZstdROAgvvBWMd/gshj7r0eNySvE9d/K2uIxWKie/eZhElA/ciRXF1drc8+e7zNzMUvPfDnvykrBSFN+Hx+lJeXSeErahq45TbfMDORICt7G5hZRwAxdMzYL5fPnyaLTB8gDbDV0W/ZnJ+e+u6T17esqbq/NRKJiJqaGpW7NzGAmY0Hnn3AJ6QESYlkOg4AKA+V0oqmNRCdb03uxpCbCXbSXCR29REIDjTaknHPJ1QCqEUynUwX0FmkpAKxU8rfewLBWx5zZ3e4zl/3PwQtwhkLCMXMgaOvOvFvH8+afoqt2DEgDCadl7ni/L0pEOh1hbGIGYKETllpdC0vNvbdesdn3rv7lTPpsf9YMZ3D4bD+/LWnD95mj72/Hnvoac9M++z1vWd8//n90PGRtoaCgGCtWBKoKFgyu0uX3is3pAYIABgUjWr8ykxsLIdb6TIA6KivL1rTvHTomiULhZPq6GL4gtu3NK42BGTv1YtmHZGMt1rC8JOQAsxQHmU8KO1oIU10qegJy07P9/v8KwLFJalkvLX8vWfvusMXCCqfP2Q5yprRq+8WTYGSrsu22Hr7BiJqQjSK/48Nc8q1iyTlM2LunPd5MBcuENFEbuqrwLT6vxf83AVWGOiFxJK503ac+8t3Y1g5FQQwCbnYV1xxRbE/2OAvKz0AmeaV0/k1o9GoPumYP8qSHv3v7zNkxAtCIzBr+jfXhnzqj917DRgTra39GLW1iEajmDBhgpw5cyZHEWUARpfybn4SBNZAIpkGAAQMk6BcdNxNV3J9oYxcdGFG46XEZO8pMTq03Sn8AUpDFQYx3WkW1i2rvdm4x6jKI6PgApP5KR9m47++cV28j2IZesnA8DWnPvXezB/HKQVlgAytdU4sNtuAY+LO8HNObIMBJ6nSRv/SMhyz2x9vuP3Sm++kG/9O/2rHdx1YCMRfvxfbvm3t/GdrX5lrv/V49GMjJO847vI79/vg+b/dXL9i3inpdBrM7ISCQeEvKfmUiOxIpNKIRmudDSYArlq1dBtOJfZsa17du37NCtXSsMaSEIMMv3+bRLyNmJ2u7zxz5xZ2KiG0Y4my0hC044AEwZAGDNuClUpCagvBYABCSJimr+Ak1VrBBuA4Cs1rlyPg949U2j8yYcVBRNDKgdWuoZSG5Wi0rlkGDdHxy7cfNb/95O0zyrv3sbv1HvBzec8BU3v3G/QmEf1PU2giuNMIHkggO/5G+TBP7FHYyH6u5k5u6Vinayz+g2G4PDxRQ5MmZQIYM4sfa986tGn10i00S+q9xbbTFtVNPv3b9184VjkKjp22QqEi6tJn6K17H3HG6+5LfQEcR7+Gn26x1a51Q7be/ZLsm6+rm37xku/fmzN7+hePT3jg2gVFpWXLth6z9/VDttlxKQBUVlYapmGmX3zvZRIQ0JqRTGWmoAQJsNaAYWTum6BOysydOIG5IJW/eRoaKTvlyd+zJ7r0spDYtmxNBerIKPAcpnWyPWC9trXM/9UuMDMTVZGMRqNOcbAYf3vyb0fsdPK+d//SvGoQCaEMZqmzUl/avWcuraUA38wdrqQc1tIXNIwduvRbcP6+R559/kkXf3bHZbf8x145sepqqo5Bv/74nDOVk9bxeFrY6Y4Dp09cdeD8H7//7E8nXnHrD1+/+90vX3/yoBDCFL6A7ta334cAMHLk+Zx/WhtAAPSRr8SiOIGoMVBUkgqVOc3kOEuFaf4cDIXAGspJpywnWCRYa60gLJiAZs22ghJ+R0CGhD/IkgGTtNZWOuWESku7CyMQSrQ3rxWa00UlAYOkJL8/4BQVlzn+YEgVBYuVZrQqO9UK1rallQbYaW1c3aETioVJJiv2p9vbSXW1DCi7A14RzE6+iOu0ZMmzef7TlMuzXqSQkgsAl879RMrrsHnIMdwJhM87cf3mTSKBGGpqZrI7x0yew4AB6La2ld3ffPK2N5xUfHcpAMMwMHfKh+hoa4ZlWZBCQPqC5AuGYARDvR577CzTt7K3HAQ4VTU1etKkSbKqqkp3PmQ6SyNtvfX2yxsXzTzZsRK+dDp+uUi3jPvpq3eGrJj/y9Vt7fEVW4/adXGmKWEKQQS2FGxH5YIqredAKKyECz2W2au87Rr0aUuv57DKNOR0J8uCvCZeXnMhixVqlyCdxfvYq2hLIg99/BeaIOEJYRmrjjERaQHhqFRi+Km3XHx95JUHT1iRjCNg+hWgpc65ZxGgGdB5ihUE5Q9gzdq2HGho2bu8i9pp6FYPvHHbc3cR0Qpk6Ev/Ea6ebcqsnDu3e+0HTxxvJ9MCYJ1IK6WVTU46uXfsoWurtth6+0tG73X4PnO++fAD1trebd9jpgDHblD4HwAYFb16fQPgG2ys13oBXFrf/4sJ4TDNHLGWRrodyoycVuZPtxO23oezrmqxkeOm5Um23tEqjyG1pwuX5SqwpztCnDFecN/NP5QI6hyEXL8T/6pV80rrFy/pJfyBQZ+88uRFVlvD7vGUrfx+PxmGCRJCFJX34G6h4tWlXbt/3HfAlp9269WvWdnil8oDjrUB2O4Ldur0FCz8ojVL5/ZKtbX2amipH/T5G08EWNkj21uat2TIUNKRgLZ2n/Jp7CsWEp+/Ov6TcUeeGX5z4ju2JAGVsiAhTZ8wIA1TcK7hkY9K3vuS66Rrzs/yav6nfqLsqhxkidDCy2lZjxVtjh7Dng4q59VTmTijWijoP1LDyh7aNTU15E5AEAAVq46pIn8QTcuWDLv2+XvOHHXeQWfPXbuy1Eo5HPSZrJSSuXLX2+HVmftBGWiGIaV2WAmWWnTxhbBD/2GTz68++ZajKg99j25/HuFwWLojjf/RdqupqZEAnB+/eed4g1VZQikHDIPAMKQJm6FUKiVWL5r1gL9r88PdBmx5QqKt9SQSojWCTFNngwqAzCwmTZoksp3P+vqRnO3wejuinWWHvFf2v0aOzPB7Zs4cQTmuzzpGZ2F0nzmT3JYrqqrqOdsRD4dnMijKNZEIXXzxSSVtbekijms2hbCV4+h0wDF6BLopOxi0uwFAN6ClxZDl5cxAlyzupd2z0slmRaY/6DhWWlev03r/B6149qB/ujAsOGzrgj3opb8w5zKIAu/ndWqw/DeQv20DyZVLFh7T0bZqSGtj44hUor2stWmtfvfZu/s7ltUrnUoWCyGCyY42KKWSPp9fmr4AZ0atCVopam9r9bW3tOy3asn8vU1/UdL0mws+e+1xLu3SjYLFxalgUZelxWXlKwPB8tqpv/wyJfu96+vruWXtiuEQsire0drNTnRUSGnAdqxAcXlFazKReCxhO1MCJV1VKFQeLCkuYfZJCSAFldm02nHQpbi0qLS4NBP3RFYVR6+TaHvvKwnyTDK4SJ7OgPumz/zVh5cdCc7WetQpY/cqcOVEWJEfZyxMTAnClEjrtAJAsViMwLzeNCobYCKRCI0cOZIemvkQ1U7KHV451rUAQbEufuOzV/d466vPjtv1imMOX9jRGGpPWfBDKp/flErnRypYeLK9jPozg0krR5GyHSEDUvYoLcOQij5f7bftrvf95awrP3JpX5KZ9W8VN/0NQVzV1NQEXrz/mgusjo6Mv31WWDrTgJFExM3xhFPkrDhP+Ip6HHVK9IIJ5VNlOFyjoxTdoPInw43IvxKV//M3yxPy8HVNTQ3V1IQzYaf+YSAGxOqB7t1HECYBNTMnUV0YfPXBB4tkXB2kk8mRHYn2gFb2YDvRXtLW3KDmp5MBQdTNcRxYyQ5tO5ZPSrOUCULbFhgwSDORJFMIk0gQv3jPVa2K1VopqcXvD1m+oqJ4SUlXHSzpkiwt79pSVtFzrekv+rpL996T1pNEMmfNj3QWVnd0roj10Diyemu5eEe5tCIrqZ4nQns2WZZg+08EItliZyo76Rnpjva3laOoR48+dspJW4J8qry8CxEJCpaXC9tRwm5P2cTaTiGJeDwhNAu/VLb2+/xgEgZrzf6AIAYZzGRY6ZQK+NIKELK0omLBuHHjOgPV091f2Y0gSJhKGAa0B4vrfL303ksZzJgBQxhg1nC0TZmGUqfMOseh7YxwUIE/B2uGAYESf1FBFx8AfD7T9IhAs9JKZyXJvO58Bc/YW1uTJxvNviFHE5jRpUuPJADOkv3/US6VtQcthC9grlm6tM/bkz8aN3XeLzuPu+DwPZa21G+1uqUZaduBzzBVgKTIjLdluXzekjeTBTqSQRIEx5HFbKBHsGvzyMHDPj28av/nzz/6rLe/SLyB686+Ktu6U78Xf3tSTY0cF406H0145BiD7SEdipUgIcmjG+EKyxIzjNbWdlUUUkdN++mTazPixxDAhmWz8l8XQ+iEN6w7AL2ePR+L7agAvABpgB27L4AedrIt2LBmVWmyrWVIW2t9P6ujrYejrH7pZLJEse4G5lAqFbfaW1oafL4gHCc9z0pb7aVduvmZrHonFV8WKukhAsGittVLFnxvlydVFyEQKivLyByQueQf5IKFXh+5XVMIZBHlS+H16R4UeN/m5aR/633UAGb9LxZFff3KMSsXzapqa2kY2tbcgPbmBlhWsidIbGclE4E3Hr+5TDmOfvep2xqlPzDd8PnmDR85SvhLun78yPhnPzu4Tx/5zsqVFI1GrcbWRuWkLQgpYfpMqzneivZ00hGmAVi6wKO3cyroVWrJpdEMaK3hEwYqSrtkHkBVvgwJ+AN+1h5+ochgeJR7Pshnk1np+CyFBB71fC/Pk8FW0qKlqxbvvmj2bO7drZvwV1TIXJvZuxAsi5YsmeesaW7tvaJ1Tdm3M6YaNuvdjr/2tGFr461DVrc0b9GUajdbHQtp2wEc1iYE+w1fLvDxOjBO5ruwUvCRRLkRSJeUFM3fof/wOVv17P/WaYeeXDt48OBVgoTFYBEOh2lCRtTgdys3OTPsoJhZvvzgX660LZsNmTnQciOE3qYfoE1DSukvnjZql30XbGj0l/9JAGRmWrFiRVckm4taWleTk9alSqmeVkc81NK4ipi5PBAqGqQdu2t7W4sAczdpmr0I1COdSpKy0kWxB68boJVD6XQKAZ8PwYAPtpUCCUJFrz7oSDjasdLTy7v14NJAz68N0/91v8FbUnF5z7UV3QetKamocAA0CcPXwP+RmEeeOiF5PeP61DmZIVAngaK8T7CrGJMd/xK/DQPMGMUXygjV1NQUSAtl1Zgz2Xb+49+G7wA1AIwWarIlT5GGb0ZRWTmZ/oC0LEv5fD5pmKZgSytNWmjbUu1tDWsMf5GlyTAgsSoajeoaZr49I5SJNY1r2EnZMKSBouJQSjMjaSWZPB1edgf1vVYgzLT+jmwGBhTQjCJpNBRgMAAMaUgv0GdIH63DEQEjHyPzT8o7FeKxDIbf76elDfUIRy94nAyZMIsCOugPkKEA4biZvCQoYiSdFNLJNAmiIpuAhJNGwrGRSqSgdIa/JyGUlJJ9EIKIhc6qiAvk5pY7v18SBFaaB3fvRdt07z935LCtPzl4jz/+uN12Y+oArHWPDADQsVgsK91F/2nTI5+UxEQ1oN6f8MCxgvXWTFIJqQzWeUUd1pnWk6scokPFxaK0oudbRKQnRiLGuGjU+T8RAD1t9iJi64hkOt0r3pakdKI9lErGu9qpVJFjJeHYaZFobzGIYNjKYWWnbWXbq7TSyyAzqipaKSEMn8/wB/xMUsQtnYYIOmBWixavSCnlpEzTH4i3twvT5y/zBYKHLpz1C5v+ebqo6JfW4rJu8T6DhiRXLp//2pdfXjF7iy32EWPeWZnBQ2pyv2WbIPyrHRVPaSaFTxZkd9Sp6ZKlyAgqHA8pME3n3ND9v5hNc6dSq2CreDJsb7b9mzZA9tOjiC4CsOg/yforI5UEAFbaKnEcBcMv0aU84weRVlpCd86i85lPnifZSZWUM6FKSCEcx0Zj49oFnixMeJsN2a+UpqRC6pGn1M1u1848Z8ozCLLBWRFjUVM9SIoi3SYAQWBHAWkn82WGAPkkyDAymGvaYVKspZQQUrAkSYaQ5KIkMlPSMjT9yhLQXFCaMwHSb9LsxpWYvXLptu/O+nHbhz5/FaXFJap7qMuanuVlP19+9zVf/HFM5cx9K/f/MRQoWpFIJ7NrU4QnhCn2T+a2/0kABADEW5rPLAkFyLIsQ7NWIJLs8bthdtUzWUuHydpym1GvuEn6Bml9+F8JgJ7Z2w4Aj/8PW8K/Yb97FkH0H+CcHk5LTlpJZH8+wXmfkPyTzUkPeeXyPeYWWaOfdUqcDexygwjFYjEKh8PZLBI17oERi8Uo07QKc+bfM1loweiim5WlbTukBADbwox5038uCYTQo2u3YcuWLUYAMi9JwFhnJGudMS3OuamQ6fPxgIFD053fu60cO4Odcf6RdaLacMH4G3sq3Sz/0A18nCnpGABJgj/g54ztJmW6EqaP2eSc3oAXIiHTB5DOmh+LLATCAGXFSNdZb7xe8MW1B80EZcPnA6SPLVvpxniC1qaScl7L2j7GGtEnNMe3/+uTP0fPp+9feeSVx3+967DRb5570rkfFQdDjbHqXKdRupp//C8GQOXimEd9MuGxM30d9jUqHS9JKnYIwiDKPCuhAQ1ogyClYX43ePuxswH8YwOyTRkDZGaBWIxiXtAvVgj4j4iB68KgMMKYOWItVbnd50nu73V1PRiI5T4v200e4X7uJEzCyLoePDMW4yiASAQYWRcmhMP5JnQ4rP/dUkC5IDTcQKi14sLNRDnaS3Y8KTdd0IkjyJS1XsxvQNK0QRmjry/TzGeI0fUB/uviu1VuX0IaPbjIhLSZnXSitS0Zl6NP37c8gxUxrZtFcy4LzP4bMeVk6gkZjl95cQl22WZM+TqJE5TyGFYRtNulZC9HeD04LuepS4V4bV5EVBlE2lHQKRvsaEAKMooDgOE2KlRWeotADgO2glYamhXIZ0IYEsTQpMFSCJAAC52xPMmlop6G2fr3U4YVJAwhwQxDE8MhhgInOM1tVlwuaWvsM71xafiz+dPDT37xev2BF4c/3WfH3V8586gzPyOiuPvaMhKJ8D+zh+V8Sm6+9fdbvgoGgt/td8KltwJ47bVHIn8Tyfb9OtK2AkgSM0Tm8GF/IIjSit6vgRkTIxEx7v9qAPzNQKwnKEb/EVM8VvjB+j43sw9jv5viBAm3HHIzkISTdPIndF5DjjwSS510YPIB0ds0wSZpCldwtSXaS5UpEPIV66P3OaoUQKCpuUUJIQrnpHPz1uSZyfXMUmcBOUEgSQia/mRZt27pdU8r17E+m7QT5TN4zptUsRfVyE70uEHQqwSTI2ETo9Twq4CvCD4foSgQhGGa6aZE65KAz9R+0weCYNIgrRQ5jg3LsuEzfaWBYKhX3E5SezoJlpAOMxLpJDQIDqvcBIcgciQECSLByFBgWOQQ6Ly5lrsmmQmsQVA6q9sK0++DIMHM0A1tHbSmtbX7zLUrj/12yZxjn5307qwr7r3mhTsvueG5gK/LUvfAytJk1rsSYxPCoppIvfP8/ZdLndqpo7V9p9ce/PNZ5d37PHjkudFTP3r54SvUygWXplJpDSJBRGwIISF8bWN2PXACcD6qamoUolH8nwyAm8IlsjQMt3YN5IB25DapV2IpyyZDPgnMedx60a7/5kzw/++r1i2BV9avEQ40iotCvMeoPc3Vq5cOciwnCM258cJsDUkFJkVeOZiCMpWlKSmVSi4FsBQAojVRzlJWfabP5zVGzylCE7lBozAQ5p6Lp9wmLjy40lYaw7v2Qc0x5xzW1twxa5sR2wRHDh+aLCvrAQBtyDgGa2S4p9L9JZDhpZoA/F/98JX68KMPuaJ/j2EJ2xo+f8WSirZUx8glq1b2jac7BrYlE307SBlJx4ayHZhSshRCCUBoNzsk7VYQHrP29fMomQBICYJJPmbFelVLM61qb9l65qolN33847dXHH/NKS9dd+oFj201dPRPRASEIXlCYSB0VX7UjB8nD6375v3rrHRSacfRyrF8yk5d9uoD1xy05xFnnPrtR28sVQ1L73U0KZDgomDAMIrK3uwxaNCqCeGw/D04iJsD4P/fotBdEdrtLAYE5zJC4Zkg4AL9uMJSiwt6JN6X1VCbYASs1cxMf7r06P4MRjzRvqRXv0Gzvv5x4t5SGsWcZk2ShO7EBcwJu7PHbCqnl58Jkkop9KjoxgDS2QOFajPZmmEYsmAeu8CfgvJNjtxR5JkG9liXektzFmCfNOmQfQ6vD4VCC/7DO7NIgD4uDhXDtmwIQYinEj3feP+d0e9898mgJfUrqta0NY9d09HSJ65tQ2kGMZSReVeyYGqms9JQ1vXNU1aoTOiXhpAgJp1IWDwzvqJ8QfOac79ZMPOUE64747knLovcLsp7LSSi3MRItknIzMbr42+8S9nJIttxFGltggTHk5YKmGp47WuPftltwPALfb4hdyVa1lzR3pG0FQP9B235dwC0IWn/bQ6A/+alO2Vpae1qzmVLEgaE8E4BUw4bZLC7BynHOyPqNJS6aZ4YGkBQCDnYcSyEfEU2gJbpM2bolJWCFASdHXnrlAh7y1Cv0KfLAWRTGDBZ1PlNX8qtcjUqAa4FtNYKRLnn4djKfUAoNFvirKpMDr9Ap5o8V5JDZLq+9StXykgkIqqqqsSkSZO02xz6pym8l4ZUV1dHsViM2zras51rJqI1AD4AgPLi0kea21t7Xnv/X7ebuWx+9ZwVi/drtOMDWqw0yAGbJDQ0y/zUipvZeueXc81sztcjDGhkhEr90mSlWM9pWBNc0t541g8X1oXPvvGCOx657oF7iMgCIJgjIIrqusP3HsrKOYC1BmexbyYSRIattHaSaVq7aNZDoS697wqGujzLTuok8gWn7Lz3YZMz+6J6gz7dNwfAf5L0Ae6qEV5kT3m8VTuDxoXClLmGI3Wav9qUr/yPaja0NhuwHfTp1YsApGctnu9LE4OkKAz/nk4t50Z380IS2SRQa2afYaC4OLTScmxURipFbTRvjq608taE7DhONsl0+TFehqZHANUbjD2de8qY+hAIME0zFY1GdU1NDcaNG6c9DaDfckc6NTM4L2Thvn5lZaWsra3VRLSGgE9MaX6SdqyeV9557b5fzf35tOXxpnGrW5skFGmfNABokZGpXE/VwYUy/96pG50BrmXAMFkrqJlrV3ZZ3t5068xzDj72kWcfuOKKs67+pKYGxoQJE2jr7feY11xfP3bVvOnPENq2TiQtR0jDcHeDUFqzSqaVnV58RXnvLd4trugzSzM9SEQqEokYzBse929zAPzXNrEQnYx7kJvqdEfacgB6gbli1ikgV37lR9/cv7vf4z+Rw9oQr0hNhFw9wDJb6X5wGI0tTdOJiM+KnDdM+yVgOdwZByXyHiPkkdfOF6tMDB8EhvQasBbAOjPqtlIOwc0u4foCF6r8eSpkr37Putl45rkCri10Jrv8vc5Xb9PB7W/U1mZ08tzgSJay4WaHzzPzC0+89kTVq7WfXP3T8gV/XJtshwGpDBIi7/eU1zDMO+NRp/ub51bqzLlsBIWPEylbfbNk3naL16z8+OgrT/x7TU3NpUQUH3PWGPPH8T/+sGbNmr0mTfjb+KBuPzjtKAcQBjRnx99lytZOy5rFB/UePPLxvcPnvhBZGBfR6IYd/DwIyebrN6zYHEieITDk67M8bYE8sk2MdRWhPf+GfOahN9Fb9uGHL8vmeFtIOIwBFb0sAmH6/DmGk2nm5poexPmP18W1OI9tgaCVpqDfjy36D17uBg3deUUX+NUJgEisZ+yXcpam2VI4Z3HqEfJ103j+X/ohucExO6NP4Uwjgc846oyJ3zz5wf5XH3TywTv0GDTZH/DJFGkCSHW2Ech17JjXSUELp3AAxUwEYZiQelW8Xb887Yszdjn9j5NeffWpraY9Ps0eMQK+nj17rj7m4tsOKano91x5aZlBgNI5HJxAQsI0TLS2NDUTCWekq+C+OQButAkgF2whIF9q+KSUOZUO72ZBvruYs3ZE3u0MBZ4UniWpN60mSN3IOgKAuauW9EkpSwqlMaTfwLhmLYrLS8fYWkF4zWvdu6G58/A0ciODWThOaxYBMuztt9hqrpstFZSXPmGY63CLyJv25ctF8lKYciIVncn0+dfSWv//qJjYJSFTJBIRrR1tdMnpF7475ZkP9zpl530v26Kka6tFSjoEJdbR7c8Ll1N+MSJrpJ7HWF3GAkGYPlNoJufH+mVjrn7l0e/ufOyW01csLbUqI5XGKy8fIQ8989qTtBn6i4CSYNvRrBkENgwpYAQ6ttt1vwcBppkzZ24UQM/mEvjXT+E8rKSzQn6Z80IKXsfVe11J8jx7g9lj9ch5xZHfQaZ1w7ximZ9tbbx9pCVYBIMBhIJF8wCUNrU2d6PskUCUI5d7szPydGvJayfAxKwVdSkq7hi1zU4zC75nbeZTfNIw8qTmzPnVGYLIf5wXXC3QJkQn6lK2aeLzif+P6zEHObsZYdpv+u79+uOPPrjkubsfmNq4dB/LUtonBIE1ZaRXsnqUOidoniVqc+fucUFVAsOnhF7U0lh678ev/f2g8w7v82L0mRtrKyuNyNjdjSPP+sstsUf+GkTzqutSlmVDGFQSChlGqMsTw7b9w7KMXWp0ozjVN2eAv+EEVllirXtydtjKyjp3Z7LCAoVNz8gBCozRc8Evj4RvkjcsFotxwBdAS3vHNu2JBIoCftWnR6+fAPg001Bl2WBAdE74CvIu7tRiysQqLQyJ7qXliwB0FNz4ysynOI5WHkFUwawoBz0U7HfOfR/OKc/k/Oewjl0TMYRQzgZyfxUzU9q25I7jxs3+8ol3Djh627H3lPt8ImGlWTPrItPIWFEIhsgWLB4Njyx2vU59nG2UMIug4ePV7S3OO7Om/PUPJ4+rMb/82onW1qpIpNI46pzrI10HbP1GKFhkSgGkFeJbjdrjDmZQeOaIjWZhbw6Av6UadidBcsmKBOAKjbqpgmt85FWFyTvdZj8nV4Js+vdMWLaFJatW9FBao9j0q627D5v64mtPFjd3tAUFZ+wYC1vAgNct3jtXzTlQgtkX8KFfj951+DXlahR0gTPE3gJ+HOdM7XOOl50I2OsY+RFBaw3O1Y4bRIXCAFTWOvPl25+4/Lgd9jp2WGk3StuWMCXpvQYORZEmpLQDclngtI7Ya2dwNH84KIB80pRprVVdR0Pk4MuOfZ6Z/dFora6qInHg8Rce7SupeLZHRVfDV1z6+JajdltRUxORG+rc7+YA+O8uNve3LEZlQGa4V+iEK3WSxmIvruQqwIDz1ItNOBAqn+lDm5XcQgmNoOFbVVVVlfhx7sxtLIKEZg1mKigxcyNwblbGXkJ05kUdpRAK+NCrvOJbItKVlZWy8wiXowubAN4w6SoWu5JkhVlnpgni9W8pbB54A2DNBnSj3VlenbTT8m/Ru1+OHnnuYUPLuq2ttzrErJbV+qhtdtZdAiFYOfpPJvCLbPeps2hlFgrI3isQSRYynXTsTxb8dPzx1501gZmLj7v8MR8R2UedGzlF+8vf6TV4q4e4UBtkcwDcVLIZIdajMkOUb2Z05l/lWLyFpk05XAn55ggYUHoT6gO7CUYinezeluoYBEkoDYRWAQjWx5u3jVtJuHP8QKFd1Lr4q5tVZ8s1DS3KzSCG9R08FQDOP//8dc4Q27adgpczhEfaKv8GvfCXl37D8Mobe4OnAFEGA6zZMO+8QiWM44478e3L9j5m72GlPVcvSTWLT1fNtSv7bjXTTDu2RZTJBLNMhHV6RYUWc9mzRRNgsDDTqbT9xpQvDj7qsuNvuvLYKxIAJBHhoJMvP2Ts3kcsoIwgxuYAuIls5PzK4kzJK4XHGL2ztLp3hoqooAT2El24c3dxExsEidRECAC+m/7FqPZ0uocpDZQGQzMAxFe3NW2nKO8k2slOypNDc86xDS70SkQMSaI8UNx04mEnrgKwXocxvymNrJx8przlTprkrnAn54NAzsjK+/jg8Qtx3eHof8mF+XeuWjhjzjrLPO+8S2bcfMRZR2zfc5izrL3B//XSmT0OHjJqiqmVdgTr/PKjHHe1IAi6N4E9foMaDIMM0wacT+dMv/DYK064wpSGqoxUSvdc3yhX8uYA+BsurTITlcIwAICV1pxXOfCUTdnuI+dljQoCHnfmYGU2qjQ2nceQpcBM/GFyn9ZUEgEyUBIs+sEkoZriHSNszRAQWfFS/OqcdCeQgDW0YRro1aViKoDlcIVePJsfBCAYLAqwZ8aXMxcKDZlpXYzDA2XkAjB3wiZte4O//z+OH29XRiqN6uqTvzlp+32P6cMl1tpEvPuCRGP/E0ZV/qSTaaFAqnOfJ1ceI5v85uGI7EPRYPiElB1aqXdmfH/zXY/dvV9ttNYJh8OCaONEdDYHwF9NAHPPU2bJBK7nthBEAh6JJe7U9vBmkeQtqTIWmJkqGRmKhxAEEsKlDIT/8XtiJteUndb5tw3kWvvQWgKAGYtmD+pghSI2eYdBIxbYrHu2JjsGZZSQNeUODk83oiD25TiTmT+VVhwUJg/q0fcbIrIrKyvF+nJ2IiE9eoCes4fXVYXOidTmMUMi5G0xKZcisiCCEmKjGNmpjdY6AIzLL7z8teN23ueOitIyTG1Y0m9Ja0Nqv0Hbf6uVI0GkKDuWlINy2MWps/xLyv1/Fq7RIPJJg+o57XvsyzfGz544sVssFtOIRMTmALiJXtJNTThDWJYdiQ7Vice7bs5C9OvlLTHIEMxCOOmUxVbacv0dY+sNeJHM4hIZQ/EcaCXgGsrlZM/DYRmJRMT/z4BYm1GBES1pa8c0aQRJtl179lXNT73y1Ji4lS6mjKFjPgaRh3fnRRQ8gYsEQWklS6SPdtt2px8AoKqqqrD8rcy8km3ZlucgyqR/gjyCClygQZH7ntmMPefrTK6YhbdM3qjKPIVwWN75l1tv3KP/lh/6tMDEWdN22W7QkDkjuvaZb0mWEKSZeT2HtvsANLy8pNwNY0BIm50F7Q0Dz4/d/wQzm+G6us0l8KZ0eTcRCZfZpzPDlTtsue0WXn4f68KA5+2N5Dd6ZpJEsNBKsUrDJjNkBAZ06UHdQxUdzEzhjEs7IRyWqIThBjyORqNaQGhmptLiUi4OhjgUKNKhQBEXB0NcUlTMfsOnY7GYikajGepHGBIR/E+Dofu9NICS5vb4Ntq20S1UshLA9E9+qB2ZYAUhKCMpQlnD80ICStZwngpLNNYC1L20vOm4A47+Cvh1FRbtOOsp7wpsf3PFHhU8MO/7yDeyyPtAYW9MS5gjI0YwEVlv3PrE2SPLezc5fqJnf/zsT+fudej4bjKQsqBZeJ2YqXOLKDMsnFMfpByMCtIwVNJ2pq9cfMi190VOj8ViKhwOb3RD7ZsnQX4TBpjZlEJIBhAoK++ygwYAkeGzkUf5NOPFlW+CZOWxSJDWrMGkRJdACIO791w5YtCwVw7b/Y/vH1p14Peui1fmzI3FFAHQzF2aV64seWXi2/1XrF299dnRC/uecu0ZI5atWqEs24IQBld06yrKi8s7mjvavt+ia69VVTvsMmPPPfeLSxL1GgyK5rLF/3p3LhaLCQDq44/f7b8m0dpXmIQuJaVTAaA12bF3RzoFHxlU4LmROT3c5CwjfU/e0MUazNCGIeTQPv1/LA2VNAO/3o9w2FGZ18vAFabhM9gVCS2AKNxpiMIZWo3szDHDpc0UhFFzo8K5otGojkQiQhSFlt73+N1Xr/z0pcdX2x3dX536xS7Hjd57/Pjv37tIAUqAJLNnPiarxcgerxbyjHRyhrLkgxSNrW36jcmf1XAi8S4VFS2PRCJiY+oEbw6Av54C5kqJrIqwUg4DKFpSvwppKAgBuIrmHg0n8tjYMohIO1qxJshepeUYXtH3+/132O3pq8+4/I2gL7D6afsBAIDf9CFlpcWaNcu2+ftbL+00ue7H7XY+4097Nra0DmnviJdarJCCDfgMsNIgO6MTTCtNQBJMLU4POIQnPn7L6vPk3fOO+fMpHx2z98GfHrz34ZMMw0gqpSgSidB/c3FWz6xmQxqYsnjmHo2pdiMgDWzVa8B3ACpWNKzdlh0N+CA054VLMmUm5cIOF3TTM785SnFpURGG9e7/5mvJRFY2ar1TGUQZFzghqaCuo87jXtks3avAwJRX63GVYMiDRTJvfKM77vOW15x/7d/3PeuQQ99b8stBU5cvPOK0vQ459av5P/8ytXn5NgEtdCbH1nl4OYuDAutwInOiSMzC5zOdxW0NPY768xnX+E3f+XV1dRtVVbm5BP4HJUQ2AZRGZlbKsWwAoKaWpmLNDBIiQ7dwT0ev6IsLIak0OaJLqEjuNWTbH/5yxBnHTHzwtbHXnHnFI0S0OmmliJnN5kWLBl1y6+UXHnBh9We7nlP99b3vvfTEpOVzLp7atHzUklRraaOVdFo6EulU0nFStsNpUyDlA1IEJFMWkikbbckkr011OMsSrcYPyxaOfOen7y87//6b3q867YBPr7r58iPKQiVZjtZ/r0yJZizI561avFvcSqKrWcRb9d3i0w8//7Bri0r1EoIYWhPl+Cd5sKGzFIG3BlOOI3v4itRpfzz6C816XfzP++lCisJRB49Jem7yozMASDlT+3xk7HwQMgxj45xdjEQinLRSuOXkS24cHuyabuEk3xL7+wkX73/0rRX+IKWV7ZnbzAe99YwE5vHAnOeKkGlH6SlL554++YvarSdMmKAjG1FDZHMG+E+ukqIQjzp5HEAEy7I0AJlK2yPstA2fYYgCvCpL3GXolJ2moqBfjuozZPERu+13y5WnXPKsFDJ9fvWZRCCUFIXwyIuPHPHed18cN7t+6d5NnC5rS6RAKQ0isjmltWblExIUCPmMUChklJCJolBRwlcUXNOtS1cYkEgmEmhsahBsiJ4dbAXa2tvR2hZHe0cH4j5LrV6T2K2uedVuY07ee9Ip4w6+5szjzvsubafF72WY3RktSDuWUXnOwdsprVAu/SvPO+OSZRfccdUJbWwLQVKxNwCz57TIefUWdnCJSJNPyAHdek8fMmTreQD+YRbrUjWhO5HLs133wuwyP6XjtWjmnMufJwqvqyq1sWWBYvSuld+fcMWpryyc/81Jy3V87/rWpvHbFvf5tLZ99j5MUgEss7eGaT3WXlzo4pwtcnyGoVal2v2Rl++7+qPdXzvF1g5tDoCbUjUsJCBFdv6y+/K1K7uyrUDCyKixUVYTTUCzdqxk2hhUWoGDd9tr/P1X3/4XImq46tRL3QktLrl7/L3Vb/406dTrJzy2W7tlQ0HD8PscnzS17bN80NosYwM9irs5g/v2m9WvZ68vt+jef/qYkdvN2mf0rnH4QrM9iLwAUISOjiHvTP64ZOrsGX+Yv2L5PrPXLBmzPN1a0eIk0ULa+b55cdWi1/7+5TnRC+596ubHriYi/J54jSviyUuXLti+Pt62JbRGr/JuMwGkF6xauleSFaQkZp2XZ84rZnMnPcWcFhYc0lxWVIQdh2/7FhGlEQ5LxH7d4FtpVeBgIITw8P7yzm95g3Rvouehwni4hFklH2Yj45G8UdYzzBYR7r3ghpu/vfbEo+oaVwRf/OrDix46p+buQ245f+9GnSafYeQI4tRpSievn8O5e5LlEAmQtKD5lzVLj/zk809vrqqqmrexYIGbA+BvymsyD930+TnV1rJNc1t7H9KUweIEZY2z2ZJaF0nT2L3/8F+uPuLsy48+6thPWpNrAszsA6Dufvzu6spzDr1qdvOqHRqtBKQmNoRUQgNWImEEiwLYoqybHt6rf+2uQ0d9eNz+B388aNDwhUX+YFvSSv3qngfQCmCq+/daZr4HQJe7nnnw4M9+mnzGzIYluzXYHViZaBPPTXr/qn1OOnDQaw+/fA4RNf9eC7WqpkYCcJ54+9nt6jvi/qD0oXdZ948BiBVNa3dRSsOEEOwaQOXFDqhTVlGgBM2O4xg9ghWp84448ZVbLqqBa+r9DzAdITOjO1SA8pBn42YbHOxVpu0kzFAwqQcmrTQbhnZxx40wBGZOadF76LC5R1964ntzViwNL1q7ZndfMPj30UO2/vKjhdP3JCLtUh4LfJGRsxDIYaGejnpG2Mwg6TSk48WPffTsecx8WXV19WZB1I0aAHTR4PZEh0+lbQFHwwz47Inf1Q6Msy2EaWhmJtgaZLNOWynqFgzJo7bb46HPH3tr1/33P/CT1nib8XTN09bkyRP33fuMwz685c1nX/x6xfwdGjviynRICaV1UqUNn18a2/Qc0HLCTns/Grv0nt2/ePTtvf5y7hV3DB685XQiaktaKRGJRAwvxy/LEXT/TsxM4QlhWVlZaRCRJqKGK0+58KkP7nlxz5oDTj/6D123qPNryOZ0Kv3R/J+qj7n85PeZuTQajfLvQZWprYsyM8tZy5fu3WKlUAafPvWgY6a//fHruzcn4v3hMGcFFdfraIb8LCrnzUG01OAtew/+eqth283N7L9fKdvdSRBBQoJ1fnohVwrnZ7cLxPE7S0F5SNHuG81509m2IzbaAJjBApFIJXHSXgf9bVBJBTciib8++8Aelxx52iPdS8uQ1g57SeKdK36vXiMXBlcIkEgm06hbufgEAGVZya7NAXDjv0xtK4LDcLTd9smULyuSQUlkCu2CICqdTIjBwa7xvxx4ygXPRR+5gIiSbpCSp9VccNvRN1/26qT5M/ZpS6W16ZA2HVCqvYPYseXIbr3aTth539t/Gv/eqCevf+jc7Xfc8du2jnaBQlKzjkajTo7jl4kEnP0FZJzHYtUxXVtbqysjlRKVlQaQ4RKeftzpEyY99Poux43e69nuviJ/h51Mv7942i5HXnbS45kTP0Pe+Y8OixgUgKIVzY17OtpBj1BZ/bjdxs1+6eN39mp2LEjK8v+8+FphFtZ5osZRCl2KQjR6yIgn2hNxCofDv2G96oLSLRdxuVCChwvwR2885FwH2Ns2lkLkktWajXQhR6NRjQhE1T4H/zCsd79vUWzyrMalh+9XtV9TH1/JPEUsMzcw62+zniYIe/ma+b4JM4SAUCs7mrvd9MitBzMzVVdXi80BcBNIBiEF4CiEZLB4zsqFu1rKghQk2BTKNhy58+CtVj937X0nXHTiBU+oygGBgC+g3/ggVrXDqfvUvjLjyytXqGTA9PmUKYRQaZtTiaQYVF4hwqOrJnxz/xu7Pfrne6+hYHCxrR3pdtA0vKTm3/Ae3TKWAejaaK0jar9wSkLFTnlpmTaEhM/na38k+reLL/7TCZE+xV387dqyJq2pq/7z/TU3+02fikQi/3YArKmpISLCi7EnRy9va+wngj707FrxIYD48vrVRyUTSQhA5EoneFjkXgK5V7BTCHZIy4HlPRoi5/x5IhHxhAkT9G9a0TIXZNkhVjl40eMXXOBzlZV+8sTDnEl6ATYoNv79UgciovSe2/5hQpdACa1MtHR5+uXn+vxp9B4fFJHM+j/lhHzXWWgugT3viZgvlU0huTWZ5O/n1x1tSpNjsdgG3zTajAH+KmSSe/opWeQDJKFrUWjET/OXmxy3oYukhg/GLr23mhq75I7DB+6ww9KLn7w1xJMWy0uiV1x68WO3R5frhGnAcPyGabBmYTm2DgYNuWufrWZfHD752tOOPPWN5297HKisNHjSJEVE6rfYLGYbDtk/5zbMLZ3z85xdW1Jxpz2eGPL1T98Va622dVJ2b58hIVjXDek/dNF3P06eee0l19xU3r3cvvW9p29Znm5z3vjhsytee+PF9w866Kgv/l08MBqNQpLA97NnHLmmrYVKQ378cdfKD5csmLPN0ua1W4LBrLUoSLXIk+t1LkNdClFRkd/YduiwVw1prEYYkoj+qcy6EIar1C0ycRQQOfSPC9wiC+u6XOWX74rk4rVL/N24BkF+Ze1McJnnK5tff2nKpzW/NC8u/ejH2iNfuvXRh5+d9O65K524ERCG64XNII+2Ze5QyB4auSw6BzFI23JoweqlY21lDyaiReB1K+bNAXBjyfwAlBSF9Jgz9gNKgljevLZ0eUsT4GhHJ5LG2L7bTpv4+Dv7EFEzANx14hXF4ctOfvijad8c0c6afQGfAtkGM1SaHdm3vIwO2na3Bx69/v6I+zUiEokgGo06/wjYZ2aqqamhaF2UEEO2CSCqaqpEOBzmLtyl94pVq899feJb+0xvWxVKmgJOMg3VngJphhk0/+if+yOer32nY3jvAbVPXXvH/Wsb1t58z6TYX+bXr8Kj77/8N2beg4ji2aD6r94rRytZefYhe6SdFAZQeetlJ1788YU3XX5FYzoBQwrFYCMrKwVPA6SAs5e1GiXiNDtySGl3fe7+x49/6oaHERkR4Sj+weFQmcEB0VlbkYmgGRDk+TbsMatCbj6YCoQB1vfWNg0PA/fwXDa0S69fZqxYNPbnFfO2gWHM3rLPwDkrFs/Yxi2DRW4k0COGQLnWPa1zgDAzSRKqMR0vu/2Je3YGsCgcC4sYYhusP8jmEvg3XNpRgM/E96sW61ZpO4YpjcpB282Y+Pg7hxNROwBwW2qrXU7d/7V3F/54RMIUjt80wZolO8qx4h1ymy69Gm8/8fLj/37DgxcRUXNmbpL0r2VcLvaXFTzIlLgxqIAvwKFAERf5g/qrv37lxGIx1b179znnHH/mYbdeHN1p974j37Eb2uB02LbBhnIAJInRKrSzuKOlaOLyuj9tf8lRH6xoXNVtz15b/azTmqevWLj9ky8/XS2F5Jqamn+pFHZLdv5q0ge7Lmteuw18EgPKu08FYE2e83NVWiDjAJd10cuq51BOrgroPHHArA1T0LA+A97eY9eqaQB+U2bKACzHsQt7G3odUnOm2SLy1EPkaR25Hki2YZIdJN5E/FuIiLPKLcN79f2q2B9AU7JtwMKFC8eMHrbl20GfD4q1zimY5w6rwgYIg9eFB5lhGpLbrCRPmfPTWJ9hIhbbXAJvrPkfgcDtiQ7f2NP/REhYSBf7FAfIHF0+eNqnD799yFqghZnNGdO/HbvzhYe8PKVpSU9JhmOYhsFaQzMrpB2jcti2c5674YGTB24x9DsNLZlZ/1o555ahICItSHAoWIS2jvbBr7z9fM9l9atH17c29124Zrll+kw9tP8g2aO465I9Ru5ct/32Y+YbwpjlaOfwg0489KHPl88+2wkItUu/Ie0JxxFrk62hFieOpFJoYBvPfv3J2WP7DW/rW1bBK9oa8frXH54R9AeeyHaFf2sWWFdXR8xM519//uGr4+1GSVERhvYf+EJi1aqtGq32nTLIHkntVl7ZzitTYRuYPWojlmNT75IufPju4+56/44XEQ6HKfYbdxK7Mp6cywTF+o95ziSHuYTGo+WY9c/IvS838yEfbRLytRNGjiQi0i++9vjnXaeVXrM21S4efv2JXicccPhbL0/+7NoVyRbpM6SnU5+3JshTlThfDuejK4ggUpZNDe0te6dtK0BEqX+zqtgcAP//xr/cYJahbYcoraD8jjmm16CV7158158oRKsB4Jt33935rL/fMuGX5pXd/cGAw1AGiKCgHZ9Jxu5b7PDhJw+/dgwRtSIzBaHWV+66i0REo1HlkybSjtXroeceOvzzH77cd9TJ++zUnE70S6aTSNkWtE+AfAbMedPgcxilrz2rehWX/3JezYWf1P3042vvPvfWFYdffOKId5b9uEdJRZeWr65+6MRnPnuv/5fTv9l36tI5R8xrX1OcFFJ9tXhOqd/vh/T7Matp2Y4fTHx3lz133etbwm/b6O57VgBCs5ctPSzZ3oGBvm7xR6+7f8rJ15wZbrCShhTCYa2NbOaQs8PMNSIo57jnSn0pFiy2rOjz/RmHnPHDmThTxGK/vYSiXI3t5n+suJO/m8dmMw/lk/c9eUzvNznJbgBZz95jjzhj6X0fvd68NNHUZf6ShbvsMHLHiT0CJU3L2pu7EgRr6EJdis53OivN5j0sSBCDsLqtacCK+fO7A1jmVhWbA+DGGguFEJrtNA/190jcd/r1J/bcZpvVAPD6S89sffozt75R17ame8D0K3a0QZJgK8fxE4zjx/zxs8drHjySiBITJkyQ1dXVv5r1EZE2panaOxqGXXjXdaeMOmWvE1c0NvRvTSbhiIwatQAUMbNIAbBtWAKIKxb1qXa5oGntDtNWLtzho18mn7Pntjvd98b9z906+Pixgz+dO73/6XddF371/ucvUFo9H2+J33F69IJLP5w++fS1HIcyBRt+oVo4bbw7+eO9mPlbVEMA+KdBp6amhhiM2BvP7rigrWEwSKBvccX3ABpmLl90QtK24GcptKfEzFeiVEh8dhuslrLRq6SMDhu7371EZIXDYfmbsr+sL7Bp+jyzqqwBzfnRDngc1wtI2AURkjopSLsHIlubRh2cHY0DsLhrcckMbhR71He0jAbQXlFS+p3Zah4AxZoIktexzOwEX1BBeQ1mJkGk4soqeu3r97cGsKxuA9YK3IwB/nomkf3QsUjp8kARXXnYmXfutvNuU0kILP6pbvQtn7702WyrpXcgEFAsSTIBjlZOwBDGSWMP/Dwb/JhZ/FrwAyCj0ahm5q7n/fWiG8acfvB3r/z05bUzmlb3b3UcLYSpAmRokwFJJAWRAc0GFBvCYUMSCX/Az/5gQNuGdOanWktemfn19Xuffci1Bw4f8y23pNR3c2ecMufnaX/oSHYY5KeZz98+/oxbTrz4vAGlXZuTpiJpGJxMp/Dzwnnbm8LorMv6jzYSDDL442nfnr4q1UahogCOP+Dwjz769N29l8QbBgoQM7TIJV0u2zAzbpWXVcorpEKxhBzRd9DkC48/L4ZIRMRe/c3ZHwOANA3pEf5y00Fv5OV1LDALAl0eAHQFLlyKjGYYQUMBGy8PsOCqhCCidJ+SbnMNMlCfaO0HgAf36vNDUEoolxBTYFCVpRGxV0LMayWQuX+SBNrTCbSmO3b2GT5syHSYzQHw1yMgA0BxUbFtCOqx1zZ/eP3M40+9beay+d20Utue+shf3vyxYWlvPwsFYgkisGJlKG0cNqpy0qPX33cUEbVms7tfaXIYANQb7760215nHVL79JfvR2etXtXFStiOT0sWQghIkgos8qwrd1pCa0Az2F2nLIUgQxoBabJl2c7EhTPHTpn906F9S7rqRS2rQw+89vihzKzOOuss01K2POuksx752+lXnTg40DWZTKaE1Z5CMpHawVJ2TwC/hcVPALSjnV7TFs/bz7KSGFDWtfG84895+aG3XzixJdEBk0lntfXys77IG/Ewg3RencXSDvUKlfIRu+59pSDS4bq6f5lAQUyU5aoVHGaF3vXu989yXdabB2a5bjmur2ka7nPc+ENguEeYCYQeoS6zi5SB1nTCN2XKN73HjhgzP0gSWrMowGbhHYFjCMqXvVTAr8y0vBytMWfZop6OcoDKDTfObA6A/+Sa9tM0/54j/vDZbRfccA4RpUf2H2offvFxj05aNKO/X0ullZYZnWhSykrLXQeP+OKFm8cfSkTNzLze7qWLnZFPms6lNZeefuVzf/ukdumsbZLMTsAwmBQbmj1TSSIv3plj3+eNNfM8LQbgMIwUiyD71JRVy8yGdFI4fsm/rFwwFoAYP368w8zasi1x4IFHfHL94WfW9FCGULaD9nSyC4Buv2kDuVMZtz9+14HLnfaeRsCHLXv1fxXAsF+WLdzDfTeC8qohOYyNC5TmstkglBQktu8z9K3LTrp0Moch/xXszxOTvf+gFDNlI1heFdqNqzmz+oLxkE45YUYt3zAkxeNWIBP+Nv4AGBsRYwZj9NbbdASkAYu0/+0vPuh//LhDpoakDyozIcQF2Z97z9hD7CMU2sC6siCUtGy0JTqGmUICtRuuV/DmAPhPrmHDhtm3XX7TscOHD68PBUM4988XXP/pzKm7GWQ4UEqyUgBBpzktdxm29fKJf3/nBCJqi0yMGOvrfHlJzOf99YK7n/7mo78vam0u8gmfEgxDaSadLREJIClAGdWtAsl4EEFn1Xs1GDaUZTs6kU5RKpkSCSspKeDXVORn7RPUnOoYDCCIvAqfJiJ1ytGn3Dlu69GvGWUBJEml8VuUoxkUi8U0M/s/++nbs9aqBHcLFtt3nx995+y/XnJwg5Pwm4apWDPlX41zxkQFyDoRSIAtbdOA0q7p20+//Jq0bVFkROTfKJsYzMTI+6TQOhamng1NBQKpnLMtoILM0ZvZ0CbTEYkgAgAIwp4cNP06SRpLWtf0QNeuS4qCRfUsyIv6ZWbd3NM3dzIzg1nnMmpyA2SGT05oibd32dBv2OYA+M9yioywgAr4A7j9wVvOfWv6l6cnbMeRGgYrhgSxBRvDuvVM3nP29ccJIZeFJ4RldFzUATrPjBOISDCzefktVz7xwnefX9bm2MoEMWst8xqeLlFXCk6xA+3K7FOBUU0mGAohtK0dYu3IHsUlYlT/IWq7nv2XjR44NNWzS5lQpAwnbbFjqR4AunrDUSQSYSLiy487+9YeoVIV8gcC+A1tT9f7l9985+Wx8xtX/4EthYGl3b7fYvjwOd/M+em0hG2BCDIjRM/5abMcq5gKczaGLgoFxe5b7XDHTqN3nxMOh//1iZTKzPvWrJXHOIqgdWc/+xy6l8WzBODdwvlpkXWC6yZCBgSAmkwWu+s2O1sVoTJylEZZqHw3AGmfECsMIo8oRafHxuseEAyPgrSL07S1twWSjiWBzRngxntSukTf2TOmjn7s0zfuWZVq136/TzJrEDMsx9FdyRSnjD34yrG7VX3JrI1YdUy9M/nTvq998v6lHlc3MLM0pKEuiFx0w/PffHJyfTxu+YQUrDXlwPZsN8BRnNY27dCrH7r6glCumXdmQ2d1GKAs2KJvaWn60B12e+6aA0/606d3vbTn1Fcm7fPlY2/vGT3ynD8ePHTMx8G4RU7aTnZeiK6xEI0Zs+tPW5jl8420bgaw8p8FwWg0Sj5p4OWvPjp3RbwFxQ7RKfsc+cz190ZOXNheX2JKw8UQPQbxOQFAyltUMoFA2mEltuzee/4zNQ/faSlb/KaZ31/pgijHUfBsXsq2lz0iMOSW3dmmMHfKUDsX1dnY6NuEMsBsAKwYNDweFBRXaQezFsxWAHoO6N5HaluBIHIYH+emdDz3m9bzANzmOisF8ps9AHT3YN6bA+DGlgBG66LEzMGz7r/+wbr4mkCwqIiZNBEArbSS0HKvYaPevPHC6EOOdqTbQCj5+tsvn2hsa/iJiNiFjMiQhrr70dvOeOWbz6+tT8SdoGGa2jXrYWQQM2EIdpQDUzMduuXoFeXBIt2S6oAkkfdiZ4IGK+GD3HPIiGnPXnrXnu8/FDvpotMv+qCiomIyEc0NhUI/nBE+5eMJtz95eHjnfZ/p26376s7BzVOi85CKgTP7VfSc6zN8LfgHslNuMFc/zfhux5+XLzjYspK8RdeeK8859szlr3792VkppVgQCS6MOfkAkwsymZIzrRzuUVxMR+6018VE1B6eEP73SLO1nUrcbNYioDPzNBmGNLvlWQEwCcr3hrnQPN3tChNA0FLrTWVhR/Ouemssx1kjpERTW7MGkCTBS2TAcAGW/EnA7FHvWRfbKXRD1BosqPy3YsqbA+CGmf2RjAl15b1/vub7hkW7SiEcQEvXX0zbdlqM6DFgeeye569P2SlCGCgrKeNTzj/t0ba1jd+cfeTJnwMQWcx85k8/7PDYR2/e16gtCvj8UlMmS9JgQGS8gi1WKIHhnLLLvh8sXrVSTlw4iyAFchJFgqAFKzIgt+vR7++f3f/6npW7VX4fT3bkfIHhZp3hCWFJRIln7nj8klMPP/k4IYTO7H9PgImAiEgPGjjkozHb7fisrWyKRCK/vnEABHx+3PHso+cvXLPa59eS/jR61+duevS2/Zd2NPUyWGjWmpB1FuucSjG7QDrApB3TJ+SYgcOev+XC6PvhcFjGqv/9udFMv0iKDEyQjVU63+voFCDzo78eRxKiTnam+UDIzJtMAMw+nCJfwIJppNgASkvKuwFoSzjpBb6AL4OoUid7V2B9+ADyZqPIcZ7slAUrHt+MAW6spW80GtVfTp74h7d//Oqq1nhCGQpSM0MIQtpxuHtRMZ2y36E3ENGMofsP9SEGdchFR16WENYuD936wB0MpkgkgmhdlEL+IJ9/f+Te2fGGkN9vKgZnqjOPMY/NDvqUlNGdZ13+2Nczf+o3bdXSXiEzADja7WIyWLFSUPIP/YZNqnth8plEFHefY84XGO7ssBtMiIhaDqv607T1nt7RTFn810uuHX/N6RdPQF5aa/3ZXzSq1yyYP+yHpfOOTrOjB5ZUtF1+zDmLXqx9/+SUcrQk7yQG5fX/csmWAEFksUtjWHmvxe/e/fJ58VSC/t3Sd/3NEDf8aeTL3YKa1iPmRCjwCCZm70BwboZlU1CDWScACIJhGIKZ0bVbt34AnOKiEl0Y4DgfM6lQKj97SGRlYwn5Mpk1e4bpaHMA3FguZiZ3JrbopucfeHDB2jWBoCOhHUVgQAOKtCN3GbrNVxeffPHr4XBYLvxoYfqux+4bu7Bp5d277rPX2UKIZISZ6urqCDGoi2+9/IzpDcurhGYHjjY0c05qnzTgpG0VVJouO+T4Cz74prbnLy0rtw36/ErbjudoJU7badqiqCL+9o1PXtGe7KCcfuA//HGYIvyPnbo86tK/nv3VRcknTVz04I1/WZBoCvpL/OKQnasev+WZB3ZZ2FZf5vf5OYf9kWfiLO8T6urJgW2luEdRCZ+231GXEFF7JBL5neZFdaHhutsEKXDs84Y2zv7pkX/JBW2X2uG+901lFnjdh68A24HBMgAABoRgx9M84rxvcy5wUF7djBiZDjEKQFV0mkrcHAA3pstn+vjmR24+/5sFdTuRgmKlJGe6s2xpmwZWdE/dc0G0RgjRGovFlNKq7JXJb00QbH516aGnTWJmWQOwSxfp9dHUb6IN7e1sgARrDdKco09BaUXakYeOqXyif0WfVZ/Pn36U9BkOg6U3c3EkdGmXkNh71M43dene40eEf5tKChFxlP7p5/1Dl7hIJCIQg5oy7Yvtvlsx+/hkMsG9RfHSk/Y79KNXv594lCbKSCiRN6PyYH6cp8BosPL7Tbnb0G1vv+qUi96qrKw0fi8DHWm4TQ+XxsGCNElZoP/nxSeps0AqsccLuBOCuSl1gfMHH+y0BShAKScNgBRr9toC5EUQ8vQs9nga5PUCCzFBwy+Fr7hYF2SMmwPghl/6EhGnrfSA1ydPvLbFTmvTyLq/EVhCFRcHxL477v741tts+xlvvbWPmY3jrzz9jhWNjb1P3u+YvwkhnAgiXFNTQ8xMN9xbc9H8xrV9TBKaGfkgQQxI0hbbckSPAUufv3H8Yze/8ugtcZNhSJl5Nm6WKKTQ2mQ5qFuvpQ//5b4HGSxcccv/VUYMZpY3PP3g7QtaG4ygMGi/kX948Jon771iVTpebEJmsr/cvnHldDxes2CANCnbsYyd+g+d9vodz0Qd1mLSpEn/uV5cZea7OEqpLJ8PAEkhRQ4E7AwYdppNzsGD3jjnbnitNAzehEbhPD+2bVkQQT9WNq6aA4BTqQ7Ok8ULQwXlT5A8nzJbBmtPig3ARzIJYIMGATcHwM5lXmaj0yk3nBOZ3bqqPOD3M8jN8AVpm1gOLOmx6tE/33ez7dgCdXXWD9O+qfp67vSzepf3nHf64cd9DAZquCY7dN7981++P7nVSrFpmgTpbk53UyrJKCsrweVHnxl9YsIT2y6ON25JEIpFppMKDUAxlKN00DSxda8BTxvC6KisrBT/K4mhmpoaEiT0488/euSUBXP2t9MOBhZ3mzV8wEBz8pLZ+5GGYtYyG+RYu7pxzC4mlBuH0ymVkltX9Gp/8OLrjxckUhlxmN/v53CUdrwiB5T75sjx/nLDH16+X3ZaxO2M5GkyxDnd6lxk3PhDYPZH6Uilyk2/v4wJ8BsiCSDoOHZRIQLq8hSI8vgBwaMrwZ2750xCQFlWPYD6zQFwI8r+AOjvv5+0/Vfzfjk5rVkTSDIyeJ2yFRdLk/4weOQ9ksSacDhMzGzWPHF/Tb1KYNettnvcb/paGSxcW0B65MVHxi2MN/Qx/IZmaOEtwQikNZToV1z+y0mHnzDxpc/fO6+tI8UGsp4MecViO5kWXR0fjq46fLJiRT169OD/0U6haDTKSqvS5798//aVVgcHNelTxh30/lOT3r+gVaXZICE0Z+aSPblFQQtBkGCbHfQsLrEP37nqoG23HDOLwyz/K3LplJ8XpAy26XJfPMKrhW3hQnJv9jVyCvAMIQSREDIT/jaJHJAAIN3e0AtC9GLLQbfS7gQgVBQo2cpKWxBuGl3ooEfrJJHr+SuTJPhNX0vQDCTwj9z8NgfADS/7u+mVx29ekmiVPhKsWLtYHWnHssQAX/mKJ27424saLGKxmBr/9COH/bBw1u7dZFHq4qNP+sxybEQiEcRiMQgQT5r54yEtTpp9QhRCSJqhNLNfAXttu/MbAAYvWLVsB9gaUFrmDlwBZGBDJSoCJY2HjTtoBgD+/Tqm//gKV1cLZsa5N1/y1+kNKwZp1jR2+Miffp5dt/OsVct7+yGZtc73VkWWYpfX2hMg2NpWQUOKE6oOuuHmS2/+ImNwjt9dKl0KKcC5Epg1oL0QfmcV/lxXmPKlu1cNJh/NBWzYm0wTpMYlQn/77ZfU3NxCJkv06tZDAUi2xdu7ZpogTGDu1MHlXw+CXBhZunXtnsh1mTZngBt6+udSSd596cipy+b/CbbS0Cyz+0Oz5pDPpL1H7/qCT5orkfHiDb35/cRL6502HtKz7w9Dh263CAC5ExZKse67aO3KvdKJFJFiiewoGzKzpQ5p2TUYsu+/+s7Xbnnk9j80JTqkQUKz41o7CgILAiRpETRQXlwyI+gPrPhfnaiuFp/64J039/r0l6kXt7W3c28j1L59ny3ib0//ZqxpGJo0C2hXNd5D6cmqvwgAtnKcQMA0Dtmp8uG/X/fAbQhD0quv/ld8ItK2ZXt3I7mkzdzMPiinPUjAeja31zEuPwqrteI8BrjxZ4BZf5UWx9k+pRQZUqC5reGbHl26xeubG8ycAV62A14gqMPrxVKz94zB7JcGgqY5x1I2EN4cADd0PIQQBTNz8QNvPH/V6ngLTBKsVWb8TBCxA0cO7tG7475r7njc1o4AoD/49J1Rs+OrdvGXFNE2g4d+LUk2A6BYLCYA4KW3n9u2vrWlJznQOkujcpV0SZASPoFupWU/A5hX+/O3Qy2DIKTIVGiKQdrtrBnEvqIAevfqtdyyLCCjLP1fL5FisRgzc+8bX374gYWtayHB+NNWYxa+/N3E0fEAsZSCmD14macBkm3yKGjH9EvjkFF7vPdC5JE/t8TbBGLQ/62Gqu3YNmVwSAZAUrpnGHukDDivXOKlv2QpjFp7VAJdpWqtlTaNTADcJCpg119qzoolfZNQVF5SgoG9+yxb29xQog1ziJMZtyx0PnLpRURZrDQ/++YNjJoBkwnD+wxaYxgGEMNmPcANvBwgAvHdT9xdPbtx1U4CQjEgsw9WESuf38C2A4dPKAmVzAdAQV+AX/n6/bOXp1qpqz+kdhs55gfFigBwdawaBMKM+XP3aE7EIU1DFxjJZMyl2ZQG+lT0mFLqCyUbrfZtrGBWcSRvIASdSRoNIeFjWigzMJT+rx8IgCgtLtEnXXPGfdOblm2tVUrvNXT7FT+vXtJnOXeEgj6/R9s/C5IXJE1gwGEoY/ueA99+IfJINRG1sdcF6b/x3nVGgkZrN8FkReu4InXC/bJBm3O3tZAFwlpDkJAJxzHcBbPRr/nKykoBAAuWLeqV0DaE1on9dtx14eefv7tFayJuSpc6REAhvcW1DvVCBXmVC8qMaToOBU0/yoMlU23l4B9NFm0OgBtA9heNRlmzLn1nyhfXNaY72BSSsqNnQhBs1qJfWVd1Yfjkl+KJOJhZJ9LJgT/Pn3Og3ZJENxlMHPSHvb8iIo5EIoQYuLgohCVrVw5JsYYwRAZKl3nChXY0GSkHsJzJbVZHKG6n+uUYpV7rQWbA0RAaSKeTLfp/QEWrqqqSANTZ15xz1iezp1Ynkwk1us8Q9oHMKS1LugcNH7OjiNij6+cO2ubKSoIDCWOrrj3f/+bx98NElIh4NeZ+/y2dyT4UZ+s1QmYYwRVHQJ546QnBnm6xe7+zqj1e8J8hhYBQSm4qCWBtbS0zM9XHW0aknRTK/MFk5S4H+WYsnTc2qSwIkGLyCPjAa2vAuckkzyiNKycG1syi2PDbf9h2zOwNnTr5fz4AUg2RIMG3PHHHqTMblg82hNRaa5HLwIiUGTDEln0HTdpl1NhaAIYQku984s7w8jX1XURSQ6T0/OJevVo8+0m3dbQXO5JH2qQhBAlyy4csB1BrjQBM7LVjpQTQVyjqqS0FCCJksb8svmJrqA4LJUWlPaX47z6ycDgsv6j9wom9/dx+b/785UOrk+2qW3GZ6B8ql58vn9PTJ33MtiLvGFkuRdCcdXyz4Sejd6Dk9Z9f+PJIIrIjkYiIEulIJCKYWfCECXLixInGxIkTDZ4wQTKz+D0UQyzbcgrc1kV2g3Kej+2lJuYVZZFXTc3vevIU91pKc5OBfDKeL92bE/ERrB2UBUqWAVjww9yZIzocCzKD6uYRA4/clSfnz5wzOq8UzUTMAtQtVLqqcpfKZW6FtbkE3mAXQg1YaVX65pefXdQUT7BBknL2iAzYWlGXQBAH7lT1NBFZLiAuP/v+671atA1yNAb36ucA8HUq7ez6eItBkkDaHXvLnoaZxgYCwSB22Hr7YrS2ltjtKVBa5ySHiCjzdFyBTsd2kNaqP/8Xu2qRCEQsFlNrFs8dfcOLjz05r6XBCMCgskCQPlkwC7Zls1Ca1l/FkoufOQ4kmVuUVry5KPZdmIhSEyZMEO5ao2g0qolIU3W1GjdunDNu3DiHqquVq7vIEyaEJTP/2+tSQalMBzg7zSEpL6PjwQCRF/os+BmyPiXreKABzNYmMQmS9X6u+2ly39Xx1j5kmqgIhn4a0LNvalVzwx/SlgPhHfMgQsETz6ufev1cXMkz1kbAQO/u3X4AkAAgNlQKzP/5AEhEJIXgS2698rS5jau2MCE0M7tqIpmzzbFtMTDUdcV51We/7j52B0gNXpVsHeuYgqVfoKQ4uDS7PrKnXdD0p9va2+0MgK4LEwwCyCeFNhkANYLIgCaGowDlbj2BnO2gEJIcZqyuX9PL7/f/VzDAcDgso1FoZh5xzC2XvTmncXXfAEwtQGJFexsUEQwhSCvtrn0qDCgEKO042rGNURUD35v5VG01EfFjj51lVldXq2g06ghpMnOi/+xvPt1uau27h07/8p3Tvp/05mnTvnzn8OVzp49i5lB1dUy5HirEkchvXp+VuQUtvDNsRFoLdx7Yk8wRCoXdCyXfc/g+ecmCBIONTUINZhImCQB47avPtm9Ixn1F0ochPQdOXbpmxaC1bS0jtNK5jlBuVBBuyeuVxcrZPOfHHB2tURoMYnDvAZ8Qka78F57h5gD4P45/ANjRquKTuu8v6NAOG0QE7frWCkAT6yAJ7NB3+FsA0hiTsRG9/fH7R9frZIkImJZZFoQj9CIAyc6ZmUo5BNs7VJ6jZoDBWvhMNDWuCaC0tL2oqEiz4swDYQ8uRQBJIi0YjYn48PZEvAtcgYPfL/XLZH7M3Lvy7INe+GLpnP4+YSoQC5UZ18vFgkyH1dP9I0BKwbZtKam1Uf2HvT765sn3jyMiOwLQ2WePtxsbl/evffupa955PFr75mO31s2b+dVPzct+ebNh0fQnGud+/8TKGV+9/uOnr0x9/5lbZ9S+/vhDv/zw+e4Qkika1RMmTPjXOt5CZDJsdzpfaZ3VJMmFP4bOlXB5+WfKQoD5x5j3uiBmvcnIYdVGaxUzi8Urlh3SHG9DKUx14n5H/PLsq09t35CKFwkhNWtFefe+TqOB2QOwYMCaAc2stDLKzSLr9D8d/x0ATKqpUZsD4IZ4RUA+0+QLbr/8nGWptiGGEFqTFlnnKxICNmvZp7QLn3jIMS8RkcKPYGaWc5cuOqKptR0GCTaCPpSVldmmMLX3fibttPRLk9h2Mj4TgjIb01UrFiyQTKbw6XcTEwAWErCWDJGhUelMjsc5bAVCBHzcYLf3nPTVpC29Zcx/nvpBIpP5Das666D3Ji+bv4MhDAVBkt33nZU7Z62zUE8+/hlSJYWibqXF8qSqgx544da/n1lTU5MCgBpmfP7G41d9+caT0+Or5tyqkw17Jjvai9NpZ1FLa+L9ZFp9kHbos46U/bWldKu204NEuvG8xdMmffXJ83d/9PM3n25XXV2t/rUgqL3VrrIcR9O6mX/OuyK3gT3aDZ3L+pym/ybgks754Wz/7BVLRivLQUWweMWYMTv/MvHnH/7Ukk7DkEIX0J09o4G8Xp3H3G3TxEDP4vJpI4eP/Akb8ARI9vo/aYweiURETU0NowZbbHfKXld1pNIcJEnKy22CUMJHcnj/AbVjx4ydGolERDRTevaYu3TxLlbChr/Yl9Hf1FqvR+2ipHe33qZauTCXOmWMo91X10CiI4FE2h7Zpaj05RHH7baIkkZ/aGJiXVDkagEYhlTtZBkTat8YzczfVdVU/TMZrH9eNlZWGrWxWifd3LzDfhce8eZXy+cP9AlTEWupKW8nmfUiYQ2P2hEBIGUJR27RpUdreMdxZ996YfTVmppqGY3GrGQyOeT9p275u2SrSrKGLYsmbzV89PNbVh2+GjBWffJtbWN7R+ug7uXd/EMHDl/du1u3NJrrB3z12WuVHcnm801es9+yuo5dvvzgpVP3OKD69YmRiDEuGnX+OawhMi1fdi1ClMMF5t053IrWGQrOFsYFXZCsdDRlrk0F//vg41f3WJmK94cpeMue/X4CoGcvW7hv2rEREKbQrvlMLtGjzklgYRAkEBRrLjIMbN9/+IciE/ik22zZHAA3pNK3pqaGg/4AH3zh0ZfMW7u61C+k0qwlEYEz4suwtY2K0mIcsMu4pwWJBIdZ0qukvj5gz+1WtjQNIIChHOFYGm2JOPw+HxLppJdw1m6aYqbP7x/O2tXR8sgIETHbKRsNTU2jmxNt5n4XHzk1UOTfk1MOs90JXtOAEILarTRmr1l2bGlR8cPtyY5/e2G5znSitrbWee+9V3ff8YLDX6prXNXfFMIBs6EL5sXy7hoeOEzblg1TQu7Sb9i0vx5/2Qn77LlP3W0X/VVMmBBWzNz/rfE3vCtSrVt1UNHSHXfb76zBY8bNPuuOPx84/5WXrqxvXLttyraK03AAUyLg96PY51/Uq6zHV9V/POr1Uy46p/bjlx84j5Itf7KaV702+YPY0bsdEJ4wYcIE+WsG81lFfMM0TSRzZZskIfLlGuc3a85mlKlABzD/eZmPtUf5ZFPQQ62rqyMA+q1vvzxojZ0QpYEgthmw5cu//DJ91+XNDYMyzJdsE8rDgy6wNc3aj4ocqZwIbNtKDiir0OccdPxrj/zlXkQiEY5Goxv0/fg/WQITEU/55dsdvl8251QLrIlZcBbbIkBI0ppYDinvuerCY85/g8FADJAk8PmUb3ZuspIkTamgNKx4CirhdOtIJWRumYQhJAnVq2vFAr/PhPYgdkQEynSYhVKM+pbGkQAqtu63xY9BaUJxdoqMssri2SREakvpBY2rd3nixfFjspnsv1PyEhGH/EF1xR1Xn3Lpy3/7fGbT6v4+MhQxGd5Mlqkw+BGBWWmVTiRFheEX4TGVD3/96Ht777PnPnWVlZXGxEhEHH3M6+qdJ256WMcbtrKM4pXhC28de9tb7/l2OeuAr1/76bOHvlo0c9e6tauKF7U2YXUqyavTCSxsb8QvjasGfz5n2onXPXLTGwedeeRF+x1z4V+69hsRse004msXPDn9i3d3rq6uVr/eIc6EQFNICVtnwXuttdaQotDdyCPayR5v4oymHeUPKurUB9kEyl8X6+02Y/G8I5JWB/qWlLXWXHz9t3e9+PDhjU6KTClUVsUHnRK9bCmcNbSCt4kkSBsBgwb16P3FdtuNmQNA/F4aj5sD4O/Z9oiAQoEi1Dxz3/WrVKK4NBBkzUxQLlVFMRRYF4cC2H7glk8BaAuHwxIApJCYPr9u2w4nDZEppchJpkEK28FDg4mMiJAGY2ifgd+UBYJw2B1IdVWgM2uIBRmS16baBzwfe7Lr/Wdd914JzLiyHQmmDAcnixtmqjqYWui17a3Gi7Xv/dmUBkczp/lvLvsBSMSgmLnrvhcc8dRzUz9/akFroy8gTZ0VX2Vv9aczaasgYiGEsoUmwyC5Q5/Bsx68OHLKc7c8fikRNSMSEVVVVRgXjTqfvfn40ZxuOyjJsvnI827e/+Rrzz553qoZby9qb+zb0pFwTNOn/cEA+3w+GEKQoQk+LeFzSAub1IrmZmd2y6L99jluv7d33vfIx8xg14fYToZWLqx7mpmLampq/qHDmCGkwY4Cu/5FJLKDv4WCB1nCduZAyvkI5zhvBcrG7n8olwi9sV7VGWELevDpe/ZZ0LKmrySBLbr3eQ8A/7x8/pFJZUOAJNwsLzfiqPMrgz1G8vkmCWCzQnlxCHtuu+MjRGSFJ4Q3imPj/1QAjNwQEYhCP/3SE3tPnDH1kK4ioLsHiqTN2qU+MIiJbceR/UJdU3898YrniIgRzgDqKTvdZ1Vj/RjHURDsWkeDsHDV0pA3dtS4na8LT7pwZtfiknYtIXOHp9tVYwYMv6FapE2fzfjhaJSVtff1l9fBVkxgDRK5pkk2IBFDWilb/7xiwWHvffrWjojF/mmX1A0WMhqN6pKiYvXY8w8ft8Nxld9/POenU5oTCRUgyQwW8BCvs+/TrdqVDUUcEHJQt57N1bvsUzPtpc93P+mw45854KIDiJnJHXTSzFzcuGLxHZoZO+xUee1Nzz6yw7RZP91YHCpNNaxt0n4IQ7EWOhNzchuItYbWWkBCyoDPSPkNx9+nrP+ux+z15l7hs25qS2NeQNhbffPBK6dHo1E9qaZGricBZFNIBANBPxPgKIcAWJaTdgo8PzwoH3uoL3lC93rGRABsCgTAWCzGoUARfzRtypmr0+1cxoa+4OCT37zpkdv3X5JoLvcJmfGqyZdKyFOEvAo5eSjBXZdKsxZ9Q11mXn/mtW8BoP/E3GpzAPwvXa7cVfBvrz99U2Nbm7FDRW9e2xGHYQi35CRorbVha9qqa9/3u/XpMw+AGBEewQDw1XcfdW+wOwbCkMwZnpTQUiDuWEPTbW0DvCW2e2/n9uvS41tDSrBmTV40mQiSiJJa4ZcV848EwCMHDnkjKE3KKCd4cEA3a9HM5JMGL0u0yPveeObmkD/I1dXVnfWJwMxUGak0sl04v/Spb7/9bPuxp+0/IfLSYy/8snrFEG1rRypI5WjSOefHzDcVIIZmZTkWMbTsV1xu79p7yP2vXnr76OdqHo4SUXPasujDBz5MExGPrKujaDSqP3n1sYt8nBqQgu+bEXse9d7Trz7xQHlFRcPK+sYk20qwo/I07qznhmZAZSc0CL6gH6tbmo2uxV2WNFjtu5xz69XnV+196L2OZnS01V/JzMVVNTVqPVkgm4aJokAwwASIjKC2NoQIooDY7MkEc4TunPBffu/z+gyCN14UMKt1+eobL1TOql9aBdYYXtF38f57HTj7k58nX9WWTiEzApoP+QXrFdmDu1MHmAiOVig1fLTXlqMfkyTTG1Nc+T8TAMPhsBRC6OhDNx3x/Yp5u4zuO0S3J9KytaMDBovMuScIlmNTr0AJzjjwmCeISEUiEdTF6oiZ6d0fvhzbRJY0/KZ2szMS0uCmRDz4+qT3xrjNhez3IyLiPwzb5qMSMmErxfkTlbJ3XgqH9dLm+pF3P373Po/VPPBan5IuCUtolz1f6KfBmVJNwoGasmLBftc/GD076A/qcDgsOmOctdFah5nx7kcTxhx41TFPHPPA9d99tqQuXJ9O6oDp1wAbeT5fdsWT0mCVZodIkuxbXNa2/4idXhh/zi27ffXQ25eMGrXrYhXW0qtzz8xUnfE96Ve/YuFlLfEO/GncUTedcMN5Fy+zm8uGDhy4tL6luYhIgBRDkNAsyXEEHFtrR9nK0Uo7BFIkhQZloNiOeNzu0PbaST9+eUW3LUd9ZYvgD716dOv/09cfnUpEPGlSpyywEiJppbG2talJGBKGaRIA3aW8bDtHqRzrJRc2hQfgJ85z/rzZIcOL/IOtjZcHGI1GiZnp6U/funZZa6MoCxTRgbuNu+/Z15/du27NskEGiwy+6hn3YC9g4JG98KbDQpC2tSOGlPdaevfltz2voWlj4kv+nwiALvirlVLd3/z+85vgM3j0gOHqx1WL4TMMKEeBNYOIFEmIMVuNmHLAXgd9AbdjHKuOaQBYuGblIe1WGoaUyJaMBgnVAU0ffz9ppCfzw4gRmawxctY1b/YvrUg4WksSgkmK3F1nAAYLburowKsTP7i6X/fe8wZ37/G0P+QnTaRYI4NlZb0XROZrTJKivqVFPz/xnbsWLanbJRaLqWxDRJDAI88+sv0Zt158ytjTD/zg/Efu/P79WVNPW9be5heQyuczhZYQRIJJk4bDih2lbO2QEixLg0G5ZZeeKw/edpe7Hzm3ZtQnf5twwn7jxk2xj1KSmQkxKC8RLBarFgC49q0nT/ZxukIj+F1g6KiV3y34+TzbFGyCGpRBEgLKtiyylSWMgGGUloSMilDIKPH5DAMwHKGkZWihwY5kqdeuWdviN3zty+yWwHF/Ofvk3UdX3dCRsrSVbL+qacGCsqqqaEEWWIlKMBiJVCpOhpFxgwN8i1atEAoeSo/HpJFcZZNMJ9hrjo6cR3D2cpRCW7JdABufHmDWzP7jj9/aY+rSOfvYaZt7IDj7urOv+fpvbz17cVMqwRJEmgutQkFeUXzk+KDeVNnWDleUldC+o3e9TgjRHA6HxYbO/fs/FwCppoZ80uQzrzvnwulrlw4aN3xU/Oe1i1VKKsiMgDAIQNq20LdLNxy198F3E1HcfZjZtL/n7GWLR6mMUq7IDH4DUgpKwsHC5tX7M3MxMvwAikajGhGIUKBowajBw98IlAaIKcPbI6Ycr46ZJbHQC9rWVl5+61W7333GdbdXkD9tayVJM4M7860ADSa/NDFz1Yri4yIXj2dmMxqN6kgkYiitaP7yRae+//Pkp76uX/jH5W2tRGl2/JzxdWKDHJZQNimy2BZa2bJISDmwrCK+e//h759RefCpdS9M2vH125664qB9D1qYsFIi6wjXeWEzM4WrY5qZAx2tjaeYPj/+tO9hj55x0/nnrmhpDJoOkd/wKxUQtiySsk9RaXrXAVt/XtVvq8jJY8adf/n+x5x/auUB5+8zbLur9tpi23eGl/dcURIImk4qJQzTYEMIMyGZZ6yef3bZyNHzWtsSM0tDvn6r65eeSISCLDBLgyktKy1mv8yqiPWOxzvKtNIF2V2O29apis7OYHMn3I9IwHZsrG5Ylfl+G1f8y2Z/4t53no8uSjSL4oCPLjn69Gf/ck/NCXOaVg/ykdSaWeTn0POFAeVmfqnAQcAFihUk5Jbd+31660XRl5lZxmIbB/b3fyYAZs28v5sy+Q/v//zDZV2MkD2otKv948oFgYA/kDnRMqIDikjLUf2HTD3ugKNfByBc2XkiIr7/2YcPW5OId5cKCq4EvFvKCjB4Wf2aUZO//2I0gIwkFoAIIkikk7j0qBNvHxjqYqeVImLijNBCHlMxhOQ2Q4mXvnjnxv33P3jpsOJeTwtLESMj5eRF4vMnNAm/6VNfL5+37aFXnxhjZiMajeqqmip597V3XLJ96RaX9EAQIE22bRvptCXStiVIwigOBWTvklJs1a3X4qqtdnj7goOPveyTu54dOfWpTw68/aLo00S0SoFlFjf6NTrDpEk1kgCeXvv2IRWloaFGoHRajx12nzNtzowT0h1pDUthdVPjymGlve09Bu/w8M/vTB056cYHXnzvnpefuPfKOx+++uyrH7776jsffvvh2J3fP/3JIXVPTRx20LBdD9u6rNeiwb0H9VcGfJIMWtbeVHxm9JIzth+x/e1Ka8Q7ms5kZqOqyjNmVVvLBkls0WfASMeyYZLUAIZq0DBWKtMNdjktObF+r7mPJ+R5518zOIWgZDqNlWvrfUBOS3SjgX4AqLvG33XBtLWLqrQBDK3oNe3wHavmvDz5w0sSlq0EIHP8SE+bKB/n8oPs+UxacFrZ6BfqYt9w3AVXuIo/G12vaJMOgNkSiZkDVz1yy19XNq4NHTRyp+aJddOKtWbAzoxNCUGwSKFf12584h+Puo6IrEgk4iEjs/n51K8ObUknIbMYSN7tlHzC0KvjLeKZDyaEQ8EiuKbqFI1GdTgcljuO3vOXMb2GvOZjElprBc732ggACZLQUIuTLeOOv/LUMz5/8u17+vvLEmnHIUEuepXtmHo6lGRIyYKcL5bMPPS0my94npmpNlrrAJBfPPPO/Zfsc/SVPX2hpt5lXfTwrn0adu4zdOY+A0c+eeTWY0+7/4RrdpvxQu2YiQ+/ceht50fuHdJ3yNK2RJzcDUMA1D/jcU2aBA0iNK5dfrZhADtss/39Z9121S6rrbYin+m3ldKIJ1PD7zz1iuNeP+fie96598rH33nnpaPnLJnjO+uss8zHHnvMrIxUGuFI2NcSbxPtTStHP/XXv3X95v639x219TYTLHAvkVK6raGVp8366Yye2+76S1tHen55SWi7ub98U0VEzMzZLFD7TBO2ZXVFPIViXxDJ9vZ+a9tbioTP1ynQ5WkvBZ3NXyH8CSGQsFNoScdLDWkA0ShvLId/LBZTvLJp4HOfv3vDmrZW3c0sUredceUdR910yXWL480UME3KycDmFLCyHEBe5/5kifyKlSoOBORuw7a7+ZBxB/8UnhCWGwPvr/O1SU+CVMeqRSwaU0Xd/Yd/u3LWH0dsMaQZWrXPqV/eIxgqYa0yfjlMpHxBKUcNHv7GqYed+EEkEhHRaFRHABEFePnyxWPmrlo6zknbLE1DaHSeLACllMJ3c345Mp7oqCGipux7GDFiBMdiMbr5jItun/aXuYfPalptBAMBZmjyDmBJFtQUT3Ds60/uvA03V+0/auwtz037+KakVkpqSOas7wbDm8kYTEZHPGm/Pv2ro1PXnuFj5lNmYmYqNj7mj15ww13Ru/76ctceXYvOPObMRgDp4mAo3pFKYDz+VnAIRiIRRKNR/VtLGM6Im+rFc2eMmP/jR1WrVre3jznovPm/PDX+qVbY8AcN6Sg/5q5Y0GXn3fb85a5rTpwZkFR/wqV3DnFLaW8jRVCUNPkCrQ2rl1zcbcDASZ9N/3J6BxxIQRpk0IpUc7frH7ntD2fsNvZZIuuvze1tRwP4NBaLZSdbuCOdpH3PPoKgNLoEQ20/zZ3emjQ5JFkWzLjltO0KJPw9NBn3Y+3K4YOhhM+Qht83hjW/i3WdMDbIw58yJ0TooAuOfmZW44oKkwh/3HL0/a9P+nDc1OYlo3zSUMwZewXy/EjcWUBbAJSpkLP8SeWQNv7Qf+jkF2587NYXbxovYuHYRtkg2pQzQIpVx5iZBz35xTu3W47NB4zcafr7dVP7miXF2WcJweBUOoUBwS6pv550yc3xZEc2a6RoNMpBf5Bvfereo5e2NvpNITVrdvWFdS4IaoYwpamWppp7X3rrVWEATDWZXeRmgWLo1mOm7z1yp3tKQiHpECvhjniwSzXQmoVJkhcnm8r3Pv3ghx6M3v3osPLekzVBgqHIzf6yp7FXWNWENBPxlPPmj18efsC5R746EiO73njOjYm0bRnXXHzN8rOOPWsuETUSUbwjlZCVkUrDLW+zM036Xz29J02qEQBQv3zu/mUlIVFS1r029tnr/Ze1rB1GEJoFDDIlp0htNXP+/BHdevabWtZrYE1WIssbQFz5K5SUVMyYvqKhEsCS+ta2A9OOgjAEfEV+NMHmb+p+OHXg9mPfXbW2Xtnp1EEZ+axq5RGGMBo72kiWhdDY0fxNbNIHMm0CQpDK6tZRvq/p4f95xe/yMANB5MRgLKXwfd0U4WhnoyD4EpE0hFTn11x861crZ1fakjCia5/vtu0zaO1r0748SyntCOFavnqZBp47wN4OOGXXH7TFthxW0avhtlOvOImILC4YHdkcADeEhw8AVBQI6iMuOi4yZ/ni/odsO7Zu6uzZvRrTHQGfMDNCo5LgEKuSgE+O23LMw6NG7PQjwuGCEZ5EKjHg67m/nJDUDiQgoDmv0uIBzw0QtSXTPGnW1MuZuQei+RI8NiGmldbygZp7b9++z6CZGtogIp0VXSWd+QVmYRimM6Vpye7HXnna6VOe/fiYnsrXlnJsMOXlS3LVnNuu05phQBhaw/l05tR99zrzoI+XLJi1vYBwABiuCjNllYBro7WO+zP+24s2W/6mkom9SJrYZqsd3niv9qMDmtra2VDMWjOkhm5OJox7nrhz+z3HHfRxjz4DtwSALp82618r2fbdccdWxJu3aWht28dK2ACThCSpAVrWtPYPy5YtM0iYP5aWBHstqps6BgCqqqqy63hIoCw0TPsIO223fWDm8gUHdKQtSJ2DXPNsl066sgUpovuJ2aRQMMiBxtq2Fm/2uiHDPlKScC6JXn7Zy998ekFrIoFBpd2ajtx1zyl3vP/K9S3plPaxIfM+zlQoAuGZ/8txoBmQRGwph3uFSp2Txx168tgdxy4Ih8NyY+r6/p8IgDfccIMQRPpvzz982OcLpp0yuEff5i0qeq39asmsrQPCp7WtMn6nJLQibWzXd/C8R6+//zbFmuD67VZXVwtBgi+59YqzFyebu5mGqXSWdsGc55HlD09hQOqFbWuHnnfjJRcHfAFdU1OTCToEDk8Ig4harzjktFMGBrvYCSutBYRHbiCzhgySMqmU+mzB9Nvf+OiNg6LHX3BzmfRJB1oRiXzjMksi1tk5VkBIaUi/X32xZM62f4yc8dFt42871BSGE0UU1dXVvxs9IYtvstZ+x0mPbutIpyu23e3zn5Yu2MFmRdBaQDNIgRJpC/NWLTlhix12/6ytYeWRC2ZMGVAdi+n1zTFHM9Z84rrx9+1aH28rMxQUKyatNKStVZuVMJ77KDa6T8/+H5cWhzidiO/pLWuXLp3bfU28ucgkgbJAMc1ftnQXTjlg1Xl+eP3pCq/7c+a+QGlgTXvTDszcBf9lU6r/sOyVEkL99cFbL3512qS7m5wklcLXceiWO84c//mHpzezHfAJQYp13spofe5HrrVptltORJzWtioPBeU+I3c88drTLn+/srLS2Ni6vpt8AMxuTtXc3OXet565o8MAn7TPgZOe//bzbVWRj0kQaTAEE6esNA8s6cIXHnr82URUH+FIRqYlyxtsbRnx8cwfz46n09ogIXIcUCFyc6Q5xRQCBAnRnkrrT2Z8f/Hc6d9uE41GdbY8i1VnuHrVh4SnHLrt2Ju6+AKGxUoJV8CT3YxUE8hUJFqsJF/yyM33HbnvgWuO3mmf5wRgKAkndy7nYrF7dru8RGFK6Tf8al5zQ897Pnr5jWOvPfVBruGu7kKVkd9HoZcAoHXNmr6s7J4g0Ww3NvaIa2sgG8Kd7tAAIIxggOe1rR7x1YwZSdMXnPrjlx88CBCPHLnOHDMhCi4tKtaTF/x8TJwUJIncfLbQ4HgyiWlzpo/o16NvHViTdqytAeDnn1+XDMYbX35Q1uHYoZBjpNasXTtiaXN9F1MYnB31pVxWl8H5OpN6CysIKtwnDnNje9uWH9V+tGM2W93QGh5EBL/hcy645YqLHv/qrfsWp+pVcSDYUdl/y59fmlI7akWyJRAgI4N9ezJh9kADBeBf3sGB08pSpaGgceKeh9z96m3PvIxwWNbW1jobe7wQm1rwcwe+iw6tOe+hmauXDDtqm92/rJ02rddKu71bwDCZRUYyzlKOU+bzyUNHVd574qGnTgyHwzJKUZ1xBCNREirm6psvvHFR69oKkwXnTkyiQgQ8e45qzvDzhMGL2xpCZ9wfHc/MJe74XQ4PtMbaxj033HHT2L5bviY0G0rAIUF5/hlneH6mFrw80WrudN5htzx2zZ337t5n2LuCydBEThaT6bxZ8/w1lqYW3JRM4PVfJp8/6qRxE+9+/O79Q/6ibGdX/ieK0rFYjACgpX1NeSjoF4aQy5e2tWzNzGWkXDs794cxDanbfSwiD//lvMNOvfKydLrj4K/ef3G/6urY+oRO+bGXHh41u3nFrvAZzIJlNgsjIaEEYXVrYwW6dK23LBtK2wEAmDlzsmZmmrFk8W4NiTZs07O/mrNy6Za2ARTUZ26pl8NRPQ2PdaWfXBlp92NDCNUQbzeeevelY0LBIvY+1w2h5I1Go5qZS4+75oyHnv76vfsXt9ar/l16ykNH7pT+tANX0gAAZMRJREFUZuWCUY0yXRzwmay0Js5KX3u8P5nXX9kTiNOOxRUlJcYp4w6958m/3HdFRzopsZFnfptkACQiEYvF1C2P3Hnyp7OnHDuy24BVPYxQ65dzft7V55BWjpPJ4gQcn1+auw0a8cG919xxla3sXCp/1FFHSSmkuvPR2y+snfPzEcrWijRL4gyBOT8X7pUDL1AUloKlmrxszq6nX3/etT5paso6bgPgSayIiN9+NHbsbgO2/kmBDSY4WeHRrNWgBoTf9PPSdHufrc4c9+a719193XCzy6daKYMFnIymHeUyv/wGz7wdDZBBkpTDzoz6Vdvc/cGLH+x7wWGPJVev3sIQhnJFHuR/gmc5DpEhDUhJTkN7s2V3JAFb5feVZpBiYacVz29ZdeKKpqTpD4QebFy18Dlm9s2cOZM88laCmY3Xvvn86mYr5TcJir3cNAGIoIGkk7TBsk0aElIIBQDNzVtoAD3nrVhyBNsMhg5OW7u82OcLZOTv2SOBkPO14LwMYEHrEwW8QHI9MAQglQZ/u6juqFkzftwWIP27qXL/uzh3Jutjn+FTC2f9tGXV2Qe/Hvv5i/PiWukS8osBRWX4YO7PXZs4HfCTwTrXQ/OM/Xk0EsmDi7oOrcrSNlUEi+j4nf942RNX3Xt5W6KdNhVrgE0qAGbHfaZMnrzt+Emv3iiJUkePqfr22a8/3humwdBM7GjAYWXZKWNE994z33swdgplrBo1kFFIjsVi6osvP97zzglP39iY6NCmkMK1x8wpJGUVhbO2vV7DQCZACiGTjuN8OPO7ay6/7eojAChUZihHWe9gIrLfumV89cjSXosspQwwqewGzZVqBGFAqAXxpgGjrjnp7ftPOvemrULdfrBZG1qQkx/h9TKkOYdjZ0Z9yfCToesTcf543k9n7XDR4d+dcvUp1zJzL8Sg3C/4lywpw+EwA0BZaUlH2tZsmP7eXYuLg1IRtKOJPEoOWoOkxbo+lQiecNVR14fPvu6y1uamonefvOPmaDTquPdDMLNesGDmntMWzj3C7rA0KTayan25qERAr+69DQDaME1ASAcAXo29ql5867kDZi9dvKXJUk9duVQkrDSMHLGXcwdLvgucl7ziTkBggSZiri9K5DNNXpluLz3r/usfZ9bFWZ7n/zzji7jPK5P10ZV3XnPu/tef8/XXS+bsZTna8QkpFJi+W7wIbakE+0lCKZ2XI4d3CIY9PV8P74/YSem0HNatZ8dZex921N+uvO3etkS7dDUTeXMA3MCCn0s+Lj33mZvGL0k3VZy6x4GTn5/8yZgWPxf5Av6sO4FOpZNyx75bJF+45u7TiGhtJBKhaDSqKyOVRm1trdOxcuWOVz12x2sL2hvK/MKAdqc+2DuVRl6DMZfUzK7svdub8ElDroy3qVemfPbcZ5M+PgK1cFwxUrhlqCjr0WPuwydd9afhxd2Xp6EkmDKTH4I8iimQpk1qcVvzgOOfuPXpq6tPeWJUef8ptnIMlkJxpjFdMKxOXlyHGRosDGGQdrQzv7Wh28s/fXXzqBOqvv3zPX+5iplLDZI6mxH+xkDIANCtz6CVtuZ4MpUsHtZ38LdFRaFmNtzbldUyzHy2VCml5zetPumTb78dVNalR03r2oVXTP54whnMHIhGoxw0A3z5Q7ecu6yl0fSRZK20Nz2DVgp+JRD0+eqs+pWjfD4fDNNszaAPuvujb798cUMyAUnZ4R7KzFFrzmsdeM6IPITggvy50pg8xN984HWNsoRkoSYunrnz3hcedj8zV7iVg8gSyH/vstjzeoTKSoOIGFHo8pIyfuLVJ/bZ45yDP37ki7cfXtjRXOGTfiUAg5mhtIZhSBgkSHMhsRkeu4MCcyMiCCJt244iKYydB2456/bjL9rtpouir+tKNgikNqXgt8kEwGg0iuJAER91+Ul3TFlQt0tVz23n/jhzZve56cYBfunTGprIIJ0WjhjWu0/iL9Xnhrfeasz3OW8QQNZGa526KZNH/+nPZ7z3zYoF3QLBoNashbfLmCsV1lmlHhIpMqYxmpiKTL9Y2FxfdOXTtz9f9/O0A10x0tzkAsKQu++//+ynz645aFioYkmKHQmCkxvIzE2cQBosdCOcQVe+8uC9+47c/s09eg2tTafSUrkuQJzNGnN8Dy+1I8fgN3zSZFuT+nntioGP1r59+05n7v/dFfddcwUz95WvSpUTdIj8pqwwbkq5yu8zyuH3o7goOEsaAhDEnDV3d7MLkyQ3qJT/zqdvf+CQ0656vilhr5k/deLj33762gvMHLzrydt2nrxk1kEwpUbmFXIIPBFBOQ75NWH37Xdds6Zh5TbKUWxp/pmIcMINZ900vXHF9qZpaIBlTrQ4O8bvxfQpP/OLzo5nWatMDy8uZxWXMf2GkEKSMNQPDUtO2/O8gz968O/37lleUpYlkLOLKQov9ei3BkXv50ciEYEIhGdihVFb6zBzyV1P3vXHHU/c+91rn3vok+9WLNynw7K1TxrM5K4tzqu2eE2sOD/b5h7olPd7IoJmdlKOJXqUl8pDt9/tmcmPvbv7oX8K/4wwJGrhMDap2FeIdmysVzgclu++/a668q4/X3zvG8/c181fvmrnAVvar8yaPMAsCWkoJQik0rDkwLKuifP3Cx961elXfYqMYQsD0CVFxXj0hYcPvunFx56Y01bf3WeYirWWXrtYV9PZu1iRFUrI0gXIlVZiT3eRAJ2yEmJ03yHtD58XOWn3XaveHLvnHsakSZOywUYCUDO/+27kcQ9e994vjcsHmoIcgQxoA51/ISFIW1AioIiP3H63l+Px9PA3Zn43hgIGzMxIstvdLDQyKywjXcoMQyswa0PLkmAAfc2yxbtuuf3zt55x2Yt9B2w5K+1Y3kNyHb+0CRPCsro6pr794MWXg4Z99MBB21146fPjt3vl+0lnaCE0CBJgkM478WpJqthnyMhhZx+0U69+Az5+47GHS7v2WXvJjY/vtseZBz793eqFY02WSmst4elsEwhp28LQLt2tbx9+d78FUz8fX1YaGh4o6bNd/77dV2914XErFrY0k18xKVaZbB/5WIYM3ufK27Gr7Z+dMCQUmP907oRmP/TIZ5EUALNyHEtWyCIMrej9VvW+B7164bHnfVgWKmlIWRas/P3L38dKN+HoAYarsou1awmoBWrBWI+BUGmoBK3xNvHFd59XvfDZ27tNXzjrkGVN9Ts1pDoASJgkFVNGzbvA/T2r5pxL/nSh1qsrtus+XJV2bBkM+rFNr4FLT9370CsvOva8CbZ2stWVxiZ60cYe/GKxmHp70tsHnHHPdW9xWomqAduufHVKbW/ZpURKSQSCSrMlt+7WJ3HZ4SceeWb1OR+OCId9dbGYJYWEo5yeF9RccuWb0766bGW6nQLS1Mz/r73vjo+qSt9/33PunZ7eSELvJPTei4CAgIKaIGJdFWxr113rJPbeG9iwoSaACkiREkJvoSf0XtLrTKbde877++POJAOr+93v97dF3ZzPZ2UhyeTemXue85bnfR7JKFR+v2izMAwDlEYiVZhzVuOYVSjKYIDSq/tYl6RU783DJlz5yO2PLQ92YmU4CFacr0ib/uzt8/NPFXYBRF2RqMigtLsRCQEwRNJJotB0GN2m68F4a6R3wZ6N3XyMFKvZCkSi0fgnvE8Tfj8AwAyzcEDOpEAiXde5janQzGqvTW/V7qcJvYZ+PvO6OwvMqrkyuJkRnICURYSIMHv2bGXWrFnaznVL7kRfxXsS7CuLmf2Lme8/9WWp1y1NjLEQ+ISAiAHIgCJZN0fi4V3z1vXM/ssty4YPGpWzz13PnV+//bYXQHAFuJRGFwh5KEJBoaHOhrdJ27b6rYVPFqz65mddQuWAS6e3eWHOy9e/9NOX77kJg7Lbhpqs0DSQugBEBgoykESSMZSMMWDIgoEghqIzDF1rg+F3+CHCsJEmEhpglACoS6npOkMiiLbbICkm5nSbpOZbW8c229o5td2uay+/8mRUVJIOAGVWk8Xn0/y/+iwrwEEjnQFADAAkfLf4O9u+0we7nCk7P6bw5NFeJa7ari7UudfnB5BICuMSSPIL+dzYyEqgEAjiBelvwxnAkAhR6rrGOEdsERWnj+ra96OPHn/LiYjlFz2f0ASAv1HwO1NY2GH4039aWe6pazW1TW+5dP9uVqP5QDEpIDnouggo/Vu2r3z+uvtvuHTs5KWiszBBEQSICOcu+OSKT1YsfHbHyaPpAQQyM8VIQ0KAw8JMYCDMUvECi9iwEaLwRmM46Bh/lz7dj0n2CP9Nwy977N3H3nqj3ucJP2EZGLLy0aNum/r5zoqTl7s9Ht3CFC4RMLQJG053XUifx8s6JqRUXtKlJyzbvT3ylKdSNdvtwEJiC+HNvlDJhzHjnoRsiF6RIwCglEJKoeuKYmUQa3ZAq6j4fSO79v/hnitv+K5D556Fbm99w3MzYsQInp+fr5ecOdb96O61u7w+f+2Yq+8Y1/eWCd/trDjVxiqZlEGzqUb1GwBJIDgKfm2f0a9+/NwHz2zYviH+ltcfXXfCVZls5goIkgwIgETw4hmCYKBHRliVq7oNm/XsVTfaPa7zr1W6tJ8GX3rN5L+89NfH8w/uvFIjriMnRZcaaH4/mlVzEiBLqKv3gNfvRlQUxQsCvLoffJoGul8DXVIwmgPiwCRjQGho2qJRJUQMRYwNg7ChqdlgdG5YhpLQgZAsjHEzAzMxsEsF7KjURNkcZQ57ZHFybFzNifOntyRHx2Okw4EmRQGpS6j3+qCkukxGRkW3VkymTsdLzlgIoEuluzbSh4TugA90KQEIQUWmM0BGRCw8TqVQuSRYL20o6YUYWg3pPQACI0lCBIRQTCYFmkfGQJ/WXX66dULmM5NGTtyqSR0gI+NfQXPBIFFbNgHg/39lOERYNg28ccLmXa5zvfslpYoj50p4mctFFqZAADTdDFztntym8P0HXsjo06fPAQQESdIxb8G84fO3rbh/49H9Y8pdLjChIhhDHtqsxILRG2ssEBNdOEcaivguIEOHj/iH69mHUlgA0kBitNkCk7r1/+Szp+c8iYjFAMAQUT711FMsyOdSbn3ynvd/2Jl3W6XmA5vZIsGwEjaAJEg0RgDyBvwYrZrlxJ6D6Ex1Gd94+hCgYgIlpGMYDs4EEBACFM5ABQZSCiO1541RTTDclYIhE0JHB3CIt0fWdWjWYk3Ptu3nvfDACwUAcIIzTpIkEJF58/Jv1kTZ1cEtUtKvuvWT19qvPLP3pXqXV+eCFJISGoQciIABUEDqsrk1ClY+MrvTUz+8c8nyc/vn+AK6zjShSKJGH2IiYAzJx3XoEtvMu3/2zwO25C34PCE2qrc0xVzesefgxURkjrQ7/LqmAxEB5wzcPi8DgGQASK6srFQOn9xff76spMXJ0tKYs6VnkjWA3iUlJc3cwt+6tKYypl5q0TX1LvDpGnhBgq5phhkUY1Lh3NCPDXZIgjW6sMMPG6yFkTNJDEmSBKELRrpASRKYygERwKSqwIABCzoDBjmfIBFA1wUIkgCMBSNXBAZMcMaCjX7CYK+m4SBu3MGNn3XI1S5c6BuMyXWpCwEkBbebTJAcEaP1aNNx0a0Tp7139dir8oKH278k6guJVTRFgP+8NxOJyDHu9iu/WnmscLI9yq6TEIpP18EskDx+H0ZyBYa07rp06Zz5N8dERpdV19WkPPf+y1OW7cy76pSr+pLSgBtAA1IIiaQ0TlQGF/ifwoXMkgvlgTA8vYQLi+nhUurhISEY4gu6FNJkQt43td3e7Ol33Tp+7NTtPs2PIR3BIAiyNz5646/vr5z/xDFvldWMimASuJQylK8ZPDvOSGeEuq7BoBbtwUIEO0rPgU8SsMb9AUJKsDMFmtuj4JS7Burq3WAyW4BzDkY8EYxuQ76cDIxRQV2QjpJzK4doxQSJpsjy1nHN1o/o0S//jsnXbnAkpu7cvWH5NCvXvq2srf950PBpt3a5Y9T+w7XlERYNQMqwkasgvjJk0i/8bFBSu70bvlhxc9q1I+cddpd1MksmCYg1WIJKAkLQuQWVUa27frT4iQ+/3VWwYrVfk8cHjp+eBggBhF+dzf3VDWdVzeAJ+ExgqCFF5m/Kb1F08uDIohOHmp2vquxUWV/btcpVm1RHAUut7gOv3weakEBCApMoGSJxzgiBseDnzhpYNSGOITUckw1CAbKBhBhU+sZGIjtr6Dej8Veihl7GhR2cxsPsAs8YgoZaZrCjLQVJqQuBQgquqhwSIqKgpS3mbM/2XX64bfL0z4f3H7Wj3ucJNW3gX1LrC+pxEhFbuW39qJr+w9ZmIoomAPy/gx+LjYwRk+64au73+7fc6NOEzlSmEDMALOD3QRLavLeNy3jlmXufXDjnqzlJ+Xu2X7X/7NFLz1SWtq5DAcg5mbgiQRKjoGc5MSBgLFg3CSrvhXcDjae8kZqLxgo9mZLCpYTCUBQbARBD6aDx70IDnbeJiPNmDByd/c7jb77k8rgbTuF73r7H9OEDH/rnLZg34N0V8z7ZVnI0XfMLYSLGSEqkkJIJM9JaQASv1wtxFhtEmK1Q4vUYJLwwDCYpINkWAb1atIVajw82HykCL+lginQY9BEhkURwj/LGUT8mgYCB1Bmh0ATjgsDOFGiRlFh7ef8RM5+5K2vhpp+/PemwWlK7D5uSfvVfbrp36aGCmdInBALxC8jaQfKkRBAmBH5Dn9GPXzvumh1XPn/XsqqAR5oUhRNnSEiAksDvD8gW0dE498l3h5vOHr/bbpHTAmR+sf/YzEfznE5lVHa2/vfoI6GAPDc3lxUWFuLatWshPz9fwkXzvIaurQQGDHQScfU1Na0WrF6UUHj+RP+ymope5yrLOpbWVLatcbusLr8XfCTAL3QgI4UGDig4IrGGdxxZUPcRL7qwxucqXIE6BGAshKSNWmthjZwL3LIMO8+wj5eIhBQkhVSIA1hVFSIVM6RGxte2b95qXf/O3b99YMbdeQyxOPRIZ+Rk/Esc3IINwlBZx/LQS49/3LVHz1U3jc/4PDMzk/1WZojx9xb5Rdgc8qoHZzz93a71T2oa6QqAApyBjoJUxuSQlp1PZPQePXfD8f286HDh9HP1NZ0rUQddF6AQ0xgykiCYZMCElIwJAqnrYDKbAEwKqCYOCnJgZDCJpa4DCQIhBOgkQQZTRl3oQYoFAgOUDBkxDDZijVgSGwi3rJGG0BA4GjU9GSCNRdls0COxxYoXb3rwySGDxm7XhNbQewQAQURxM/4y862VB3bMKK+vA4tiFsiD2qyh7qQ0XlMXAkASKJw31CtDY04ICAGhA2cIg1q2h/SklrT/1Elty/kjpoAZQAWVuAAiNGwyG7rboU40R2CARLqUQggZEH51WJv0w+s+XtK9YMOSu5NjIl4trXR/5MbIV2994y8HjlSXgdlsYhfb7Iaa5QEmZJLZIU59sfqy21/KunLeluV3EqJAhfFgj15oPi+/rGv/NT+++e0jS79+c6OqcGzdsX+vjr0HFhE5GeL/LWoJp6ZkZWVhdnZ2+H4QF30vAwAVvN7EH9f/PKTo5NH0vScONnN56vuUuaoSXMLf3K37oN7rh/r6epBEoHMEVDiQkJIjByRJQQdio0ndYMJOQaHlCyvL4Qp9ocmLUF3ZSMIJSBITUmAQb8CkcIgw2yEKzZAYHXOyVWLKuqHp/fPvmH7Liih7xLk644AFyADuTHPSv7C7iwCAHLk8fu543wee+8u8ji075Lzwl2eegN+YliL+jsAPIu0RdNsTdz71+a7V2bV+v1B04lJIkCQh2myCYe3S/HUB7fzesyeauUGzen1+IAQdGEoICBNKAhPnYFNNYLPbIMbiAAV4SUpMvKZrvqKUZi0oPjo64HLV7i+vrCxmQJIh4xEWW2RsdFw7ySCpxuPmxVWlQkpsU+N1x9S6XHEu3aPW+33gZxJ8ug4yIAAJJVe4VJEjILLQfGyowRIqSge7upJQ8uYmh3diryEfvv3Em28wZGcIiPWZ2YcXzCnQ7GYrZL/53L3zNv709P6Ks5GCM2FlChOhpg2FivLGsyWJjMgwPP00fh9IBPD5vRBpsdKQlp2rO8Y3rywoOWHZff5YC3fADww5qKoiggV3AwWlAYAYSr0lga7pIt5u5w9PuTHj/j/dv7xg7Q+nOJKt54ip/TLvvC5r0ZHtV6GiCKPL3egxFroaZCh1FVm6LXbn7nnrL+udOWrZ3rrzvcxMkYDI/KjJVHMEW/ji3Mnn1i2/jovaaUpU0pfjr/nzDSEazr/qeQMAyMzNZWWF72F+dr4I37QcOQgSEGFzQF29K7VoT0Hzlbs2tzlZera1V/MPP1tyLtLDZLvSqgqz5CymurYapC7BDxIEByNyDHbGEBnoug6ga431ilD7WRpNIG4yGeAnJajIQFVUUBkHq6JCpMUOdsVcnBITW5yc0OxgkiNu3eUDRxf16TOgiCFWhg/4ZeTksJyMjH9ZZxcR4eqrr+a5ubkiyh4BT7z3bOZXy777KiE24c0Nn6x4xBfw8V+i+jQB4D8Q+UVHRslZj9/59KcbVjxZTQFhQmRCGqoWJAjMnIGuBchLOoJFAQgIUCQDm80MMTYHxHC7O94ecbhZTOKhzi3bn2ib2nxr787dijt16ro/GGn5AIBH2iMCPp8PNKlfkB6pqgImkwnq3C5TcDMoAACnjhxps/fEwXZHzh0fsO/YoYTzroou5ZVVXSt9dTFVAQ/4NB0EEHDgQmUMEJE1+GqFPBYM8BJ+PcCtjEHnpJTDM0ZNeeP+m+6dE+yaIaSlqVRYqATKazpf8/zdj2+tOH5laX0dmCQXTBKXQWe7C8/gINkjmHYhUEPEyJGBThL8nnqIt0X4hnXouiO9VYcjBUcOphWcONivimtM5wgmVATXCUFKRuHkagRAQhFQdDasZZddm2Yv65O3Muf5lCjzo2U19fPbp43KGnT35B1HPVUmC3CUIDGcqRbi3xEDoZiAX91l8IefP/bhwtbXD/nprKeGm7kihUkql7TqmrP0tdw5H2T9aZndYZO9J13Xq2vXgQdzc3NZZmam+Hc9gw2RolGkBRgBDPJB/4Xv5cFnQwEX2Dbv39Bj18GdVqaa+p8sKzYdPn1URkfF9qty1ylVnhpwud1oVdR4uzWihSZ0pktBAACcMTApKhJRfY279pTJZPK0TExFC+MVfi2wv2+X3uZYR8Tm7h3TS/t077MXACA6IspT664LvxxuXBLRv7oJEdqnwZQ3IfORm1/YebLolrQWbWf//PbC2/164DcHfr95AAy9qZH2CHnro7Oyv9iw4qkqn09YbGYmkYJYAiR0XQZ8AYUpCA67FaIUCyRYHZWtYpP3tWvZanOXVp3W/+nqG88BwAGOTAsWpC9+HxpmOvv0AWzbNg1drpYYEXGaCgEACgGKiorCRUQv+DBNigk0PQA2sw3cvvq0uQvnttx1uGj4yfLzI09Wnk8vc9dF1vi8EBACGDKhMB5qDBtPZqgWSSSFSjzKZoXOsSlrrug58vWHZj60AQDck7NmmZdkz/FE2BzwzAcv3PjV5qXZ+0tPtwp4dDIBlwjAGyKLYJQJF/VmQjPMIYoPBwYBoYMuNUiOiK6+os/Q1cPb9di6fO+2HltPFU0+U18d5fX6AXQilasSgYwmJkNAzkBXQMZFRrAHx2RMe+iK+/O2bJp3nIG09x933chpD90y4aeDW/+qa0IgZ9wgluAFXWEEBI1LPcFiVT65I3vq+t272r636tvX3EzX29qjcevcjYMXvf3Yw+QpuTqubbd5U27+ywyAC00qggTw/0xaRYDOLCcCAMsuKqJfo48w4w0HCQQqUxomdFRVAbfPEwUAzQDAdBF/QAcANwAUW1WzTkSgCwECJHDGQci/+VXodDo5GArf9O9INYkIMRMZ5IKItEfAa7Nfn/b2si+fPOuuSJ/S85LcBa/MzazzuBUi+k2O0f2WARABgBxWB2TcP/3xRYXbn612e4SVKUwyIIFEOgfOFIQIpkIS2kRqXOKuLq3arxvRc+DWqydevREAKlSu+PXGB0VJS0tjQSD7p2iZOUeMUIo7ubGgAAD6ABTMKZAhcFSYAprQVKj0JH64+uvL8ndtG3uo+NSoYk9NfJWnHnQhQeVc52Rwu4DIqLMpXOoogIBYjFCgc1zyuqlDL337yT87F7i87lC/WlI9NZ/1wt0vLt+1acY5Tx0g58KkqkgAjILRZYNeIIYVpxv+JAizeZUaCEYkIFlxVF3afcCXj11z16oVezcP/nb1D+NOFJ/rXexxgVQQmFmVnCvEGGNMYdIvNNY7Ivnw1i9W9ixYt/ThODt7+lRx+U8jJl0/q3fmiP27Ks5F2mwWkBhUfgk1AWRoCgOlX2isgzW25OAPW6Zfdt/0rLxTu0Zkdhv9zid3Prby3dcf+t4eEeWbdOsD/ZKTO54CABFpj/C7QjWti6MdCBVj//0b7uKxt2B9MRT4IowYgWA0YcKX/Af2QthMMCDkGz/jJIKsC+0F6N8WnASBjwEDT1lJxxuefzhr3cm90z0UgOl9xy748Ik3piOi+HdEoH8oAAyRg4nIfM1fb3IuPbLrUR+iUDWigMfPpaah3WyGhJhYrXNqyz1dWrRbeO3oqSt7d+tdiIhebBz/Csk9XQh2yICkSDl5slB6yko7VlWcM9dV1tgjY+MGBvwei99Xj1LoEgCAqxYwqSpYbI5AXV3tDqvVUpOY3Dpgc0QebtWlDyKy8xcftBkAPM3p5EuKl1DBnAKtIUrkKvj1QNu35r7bf3NRwXV7zh4fdd5Ta6v3+wAkCpPCARF4aOyOpBQioCGhZDF2O3RObr56TLd+bz95R1a+xWypzd200Ta5Tx/b2rWrx7zw9Tt37Sw+PrRC94GJq4JT0HQEw2eUIZxsYRgYh5ozjTQeoQmdc0nQzOyomNB78JcfPPXuxuOnD1pe/fj9iZsP7xpSLOtbVqMGGkngkkmugW7VhemBy2Y89eS9j7+wbfX3B+xmaN+mbdqUx+Z8FvPVruWfuUgXChg0nhAru4G7RgSgSaHrGp/Utf/y79/99vHJd0//dPG739w95/l7XjPprv7WxHbP3P7XN5+6dNbl2yvc1WqrxJSNvdt03DZj7JUnY5Jb7GSIrot3WEZGBk9LS6PfwShXGLfwF2trvxnwICLELETIDvoiEsU8/MqjDyzetu72Q+6yeDNTYFKH/i/Of/Pzx8JGRX+z0yS/OQAMTXgQEbvhoZu//+nE3svrpB4AFCaOCAlggbaRSYcHpfdalDF24vw+PQbuUBgXwmiUhSK8xkFMxoGEnnCwYHXXMyeO9Am4XV01v6eFpmndA36vYjabo4EM8ivnDEiKhuJ040twYIyDELqBJFyBgM9fp5gsPrNZ2WeyOo5bI2KLYpNTCroPGL8bkbvCD/XZs2eq588nUzASEADGjOfO7eu7zl624Mr1+7ZnnHZXdS3zu4AIyASKRElcSkMchnMuNAUYqRLjmBk6R6bsHd1jwFeP3/XkUgA4iYj1RKS8+tEbty7asvLhPSWn2tYJHSxMFRyREQYtbYIoeIEISNjMKDZOjxBIkprUuSIlNFOtNWP6Dlv6wZOvfq+YbVsWLll4yVd5CyedLC8eU1xXFVPtcoPf74GeLdp7d32T33LnppU97My3vLyy+tjQiTcMHnrr5MVbq08ONgVAkJCN3etQc0VKAEEgQOoRNosyo+fIu9/OfvujH+a+8WT18T1PsMjY3Tc+9Prg+59/5MlP96x81OP3gykA4EAOsVaHJzk+/kByXNyGgZ177p40dPzmNm06HwO4yMh9BCiQDyIcaP7oY17/qhpf8O9RL3340jW5+SvuOu6r7lbtcUFqbDyM79Q3e272B1kCJPstR36/VQDkYNA+kkfdMnH2+hOHJgshISrKAc1iYuq7t+i4fHzPYXP/dPUNm0yKqSpIF+F9+gArKAAt7MNK3LXhx+7VJefH1tVUDQz4Pemka3FIEnQtAFISaEIAMg5SSimJQqUzYowBMgxrKGCwm2qoapIx/YCMIZNCgFlRQFUVUFQVAkIC50qx1RG5LyIqYU2zFh3XdOo3ohARPWHRrZKSkoKzZs3SodEWMvL9r2Zfvmh73s0HK85ecra6AkiTZFJUyTga+vtG80Jo/gBSQGMRignaJSQX9+qY9s2s8dNzR44av8XtrQciir33iXtv3XSy8MGDrtLEeqmDmSmCC2SSQo0Iavzww7UOg1xFCvqMMOMbpS41rqgIiY4YrXvLtsuvH3n57IyJ07cCQOKHc98bsm7vtiv2nTk8vHVqqzOL3/y27+ZVOZlRFtMnNe76qsHjZ7RcvnxRu9s/fn7v2boqsHAVJTMIHeH8NiIAzhkFTEitbVHakqc/Hb43b9F0qD59H1mjdmTc9czAR1598p5PNi993eX1BlSBTCdikhMDCwObWQU7qhDFLPWJkTFHOiW3LEyOS/jpzgnX709q2/YkIro4MhCNWp6YkZHB0tLSKCsri5rA8O9mYxAOfG/Pezdj0aa8+/aePZ5e4fcCIkKriCjPrSOnPPLCg8++5/bW/y7A7zcDgKHTxcRVefRgUfurnrt90e7Ks12iyALtoxLPDO7RL+eezJs+TevUo8jj9wIAQFpGmqkotzHSq6+vSN2Rt3isq7xsoqfeNUQGvMlAAjRdgBAShIFygoK69oxhaL7JIDGH5mIbzGAazRH/ZqwNAIQUBssVQSICIUOQQnKGhArjYDKbDUMz1XQoMjL25+Q2nRZ1GzpxHSKGrpnl5TlZVtZaCHkrEBFbtPanS+evXfrApv27xp7xVAFxBiamCpTApRBAQgISSUEEGgpmt1sgxRqpdU5svuLS7sMW3vmnu3NiI2Pqq+qqk+5/6bGnVu/fPONYXXmUV0gwSSZYsPECQaXjkEBC+IQBBUUBGka8GCNkKDWUnHGAWDBDG2tM4aAufea/+sTLPwDAgZqasi7R0Ynlx/Zvbl117uhqRVHNrdv0Hv70l3NaX3Hp+OLP5udcumDfuocFY4IxxhskODHMiwcRUGEiQDrv70jdtfGrlUM+f/Pxxc2jzaPrNOXLWx9584apt2d8/8WWn6cw1SS4CTlyTmCMn0mpSyakYAhBTpzNBjGKxRdniziQHBW/eUSvQQcm9x+e17J92hEA0C7aoDx4NlDDAfFfCoph0R4AgDQpJvBr/ujn33s+Y9WBgjsPlJ3tWeGqA0kUUDmY0uJTDz0y+frbp2fcvDZUn/693Cv+Rk4YqaACz85+IXPumtx51aTzzgmttw5p3e3D5x7MWmu32k96jJEdZebMPjgnWFcjIseWFfPGVZedy6yrqhgDUo+VQoA/EAAhQTCGegjWJEmkkJcvGHw4ozF3oSE2IgMCRBbSxWsMlIKce9kAEA31tDA6vvFCIIMdXUXlDMwmDoAcTFb74YiY+B/bd+/3bbvuI3YK3Qha85xOZS0AZAenGohIXbdp3SXv//jFnVtPHZhQHKhTdY9GZlAkAfEwbToikEaqauIQY7ZCq6iEE12T2y6/YtDYuZPGTT0EAKn3PvPI3T/vXH/NqdryGC8QqBazUBhHkMQozCTIuD1qkK9qmCuFBt4igQSp+TWUusYcTIHkyJj6Hh26rPru1c+vBgDYuuKb/dFWpVNtgL0aNeDSl668fUK53eLYs+2T5Vf1nj561d7a863MxInAGD9Ejg0KNQZBGkEIXTerijKhY++Xv33183cWzn56b5SFx7Do1HtHXXHTl8NmXLZpY+WxzlarTZLUGcjgBxRUEgxKZJOQEnSQHIDAzDjYkEOszeFrFh1/tH1Ki90dElrkTRo2bl/Xrr3OMGQliAwkXdBZZRk5GZiTkSP/C8AQg+LADdGezWyF4rOnOz3+0QvX7Dxx6IaDZafb1ug6MOIBEroaazLhiI49f8x99fM7ELF4xAhDVPh3ddO/kRPHkvnn6c8dLDnxQFR8/M93Tr3to+mXXvEjImoAhlR9YmI+5RoS7lB6en/7wm0bZriqy2cEvK4Ofq8HPB4vMMY15IiccQUJwGRSQEgJiAiKqgZPdQbI4EJZ02ARTApp0AykAIUrIIKKKZougEBKRCbREI5kIXGNRlMiCtMEvEA50Bi7kpKrCkOTSQVCRZrtkRsSUlp/NmTi9fMR0R0CwvL0dMrMzJQAQBE2B/y4ZMGAD1d898iO4weuPFVZBsAYmVRVIkMewm4GSMBRaiBRgGA2rkAiWqF1RGLBoK59fnrmwewVAGDPev3pyfPzl009I13NXYxAIUaqNOQfiC6U+MKGOl3Dh9QgF4USAAVIXdd0SZppQreB85e8l5OxZfWCN+Ps6r3l1XWHB42fMWHkbZO/2VB6pH+E2Qz3jMy4vU1S60MPzX05ry7gFwrnvEFn7yJBCZQAARR6alSUcs+Ya8dc2qlL5PnD2xYKZJ5OAyb0rHVT1HXvP7ThkLtctQiOUtMRQwdSGP2nQRzFiOqklJIJIAYIYOIMIi0WiFasWqIj6liCLXpH747p+4d177t++PBxewDAx5GJMLoUQgYwyAXpdDoxKKT7u40UG0YFgwKuodq0zWyFep/H8cl3n4xZXbB++u7zJy47565x1GsaKFzRpdCJSaG2iU6subT7oEffevTljxFRD9Xuf3eo/x8Os+GNr97tcfLosVdLXdXKyKGjn5k15bo1oQdq5syZanLyIcrOztcBGRzdvX700cIdt9ZWlY5XEKJ9Hg/oWgAYIzCrJsNFh6sgCUutdodf8/v3xsQnAXJe4qqp2WmLjAKz2Qqq2UqMGbQ/KTUQfh/4An5W76ohmyOyMyK2ra0o07iqdhEBX3TA709SOSJHCVpAg4CmgZAEgCiRc0kSkIiMpDosYjI0KBsH1IPxlSQpFYtJBZPFAsAtxxKSW37RbcSEz+Limp8BAMjJyOCFd6Zh9qhsCQAyOiIKFi6bf8W7C764Z/PxwksqdC8AgTQZ424sTJYQgEhKKUnTNI5SQoSqQrwt0p3Wuv32qcPHL7zx8usqn3n7mYgVRQW37T93vG+t5gduMoHKODEJQEH3O2TBLnGD0ogx/UEh+01g0ut2seFt0k/lz13aaef6xUNV0lcGhO7tMyqjz/QHb5y+4uCup3xS18jGlWTFXn38uy3jpv35hicXHth8uWo2C0DiFxwe0DhLzRgjP+rQxRZXte+7jcNXff9JVpSqZdR4adMVNzw85JEXHnng3c1LXqvz+YSiyyD/MVwJmRplq8I634BIhpYGkU4SpBQckEDlHOxcgSiLDZKi4060bZa6p01CyrbOyW23zLjqxpJIm+OAy1vfMAUSvodGOEfwkTBShkDxtwqIRIRZWVlYVFSE4WDFAEGQjP55/dL079etuLLo7PGpR8qK21T5vaBJAAtTdAlEAelX4+wO6J3UavHHD7z6RMt27fYS/LbVXn6TAEhkED2OHT8Wue3Q7sfOVJ5d/fB196wMybFnZGRgWloahlLCY/u29Tu2b+OT1WXnJqPUgJABcBMgMDdX1BOKxXLY7ojeFxEVvTcupUNZu6599wRrPH5gCoD8X0blyAFIhGZALSeL9nSqqTiZUlle2sfrqunk93i6+P2eDgqSA0iCpukQ0HUgYIIz4x4MLTwC/JvRRwJERoAGF1tRGLdZbaBLrI6Mi/8qvc+Ij1p26bsv1DBJTy+izMxcQ3WOyPTVkm/Gf/TTd3cdqjx/aYXfDSoqQiFgQhCClI2G6QSEHEkikOTEQUqIYCZItEVWtU9OXX5Zj+G7APWYnwu2Dtl69kiPMuGJ1qUABVUwMW4IixpwDSGbuuBuAaZy8jNBLS3R2kf3PjN59MDRx7Ys/Xq7w67GqlGJ9/+0e++Wd1Z/u/lsdY1uJqYQAxkI+Nnkjn02LHzn2z93zhiy6KhW09xCnKQuWINwJzZ2ogkIUJAQWoCPa99z7aLZC67L+/Gzta1SmrUvqfU8OmTs1S9m3HfDsoX7t4xXFEUgAx4SEQj3jr+IQQdIIbmohhonISARkZRAKBhxQAAFGdjNJog22SDKaq9OsDmKmsclbR3Qsefx3m3S9/QZOHQPAOhRjkhvXb3rwufH6DgTgBEtAgD8uyLGX5hxDpVyKLw2R0QmALDk/vjN6NV7N4/ce/b46NK66vQKjxvqtQAw5KQEXfc0oSs2qxk6xSUfnzLwkudf+vPTn9R5XAAZwCnn9y2aiv/pE+mCN8/pZHkjR7JRo0bpAABHCzd3OLAt7ymFxHVSaFDr9lZa7REFVkfMHpPZkd9r8Kii6GatziOi/5fri8CyswEyMgDvTDMeRBjZ8J/gWnvB/32/qIhyc3MpIyMDfy2kJyLFW1WVvH3dkjSft26ku65qoN/r6cWRooAE+P0B0IWQBEwiEjMQmxoFSBEaoxVAKUlKlEKxmFUgbgrEJjX/pkv/ka+06tCr0LiPEUp6+l0UGv2KdkTC0+8+P33B9jVP7ik92cXlrgeVuOCITIY2AFKDn0aw5SqFEKCR4IrKwK4DxJodVWntOh1Ma96qvNLlitl//nSHIxXnEitctRwIQOUKcAzzlgjWTYUKeqTDpszoPebetx588e11P81bHmvDcZX1/vzhE2+8sf9t4zfuqjmfYtaRpCYY6BJ0vyYcCucv3HDvrLjYhIq7v351QbWnXqia5FLIRotPCEMvSaDrmh6lWpRJaQPumfvaJ3l71v+4GxF0TY0a2WfAyKoeU4Zs3FtXFmezWijk4RJq3hgaA40q2A0pfrieX7j8QMP7hZKISAKBAMmIATKGYFEUsCKHSG6GaGtEaXJM3OHUuMSi1NjEncN6DNo/fPAllQBwmiF6EQw2wS9Ma0DokDdU8TMgAwAKCwspaOz1P2/aYJMuNzeXAQDkQi7k5uYC5F4IcgAAnHEgKcGkqODV/C1XrV3Wctn2/F5nKkrGHy8737PEXZ1SE/CBVxeAEkjliuCAKKQAjXRuVU3QMiK2eESP/nPef+TljxDxHPwr5bP+62qATmBOcEI4FaGqqipq89JPnvG7av8shaxyRMfnRsSnLO/Ra9QWR1JyycVNpowM4HemOXEkgIQsAIB/TirSeJpmIWQBrAVgQYC88KlmHCpOnWx+eP+6QdXlxaPra2vG6gFvWwQjZdaklAiMggNkBh5Rg8h64zyXYdOhRDjsQMzki4yJ/7R978FvdOg6+CgAQF6eU3n//SLKzc0NSpdS5EOvP35T3p4djx0sPpXkJwmqYhIMgVNw44ensA0K/whSGKKdnBiA2aJCojmiunNCc0+b6MTIWk+9/UjxaXaiqgxqhQZMUYDxkOoMCR11PrnHkNVLXv56zNpV82fGmGB2ZV1NxdAJN1xy+R2ZT68+e2AKMCYIJQchgXQC1En6SYOOcc3KDny3oc/w2y5/dlvp0ZtRAx0AlEanspBcVDBKY0g+FNQ+Oh4/uP3prvFcXmbh3leqa+pPDRw3vdc7H745+bmFn35eDn7doihKqLMcVt9q4DqGhpGJjFQeEf8GWMLHBxGCI4UYZEYCka4LFCQ4EAFDAFVVIcJmgwjVApHcVJ7giCm3qOqOtoktSrp1TD+faInaPvGScWfAai0Ldpp1i2oO+P/WM+T/e1lNVvD4PbZgPS9q64afW+wvPjN078mDbU9XFLcvravpXlpd1bw24IW6gB8MPSMkDkwowBCIQEiBgiSzmUzQIjLu/IBO3T799M4XZ6uJkWd1Kf5VatH/3U2QENgcOXLEVHZi9/TasjPXMNI91sj4L0dc8acV4Tw6CPK3MjIyoLCw8D/F4cLQCZybmwshQAq7F8fmVQsGVpWcvsJTW3Upaf6OUmjg8fmBAAUaxiIMwrrJoeaJEaygRJLcYlYAmakuPqXF7EGTb33TbrefvwgIBUcOutS73vXsA7cu27FhxnmtPl6XAsxMFYiGsxtBSIDT2NAhmS401BhIgkRN11H4/KDoAM2j4yA1JhasJgXKfPVw0l0LPk0HjiC9Hi92S2xVueKNeX1LzxxzqMK1QUotql27nlc88+2n7T7NW/RGjc+rq6qiSLhQDRo4CjIBH5nc6bvl7y18tcPU/j8fc1dHWU3mkLloo15eqHTAEVBhUjcR6xfbfO/GD5f3W7vky5VJUZbhFW7tu2ETrr3+jsfvzvl0y4opzGwWjCGXjTQW40/Z0Alp6LcgQwgjABjXGM4Q/6WGFgWrokGNeUKQFEzghZSG+rWUoCoKmDkHm8UKFkCIt0dritRPxscmeaKtllJkysH2Ka20qpqKDa1SW3n6pfUzJ0fEFzdPSKg3x8WZAUADY3opxBXlwTSWAYACLpc4WXzadLq6MnX7ru2BsqriCGtM9NBDJ46qiqL2PFdT6XD761tXueqi3IEAekCHAEjQdAEgCDgynTNuCAsDkZACdKFzpjCIUczQNi756PDu/ee9cm/2xypTzuhGzfMP6RHyW+IB0rFjx5JqS45Oq/eU/DBs7I2nQ1/PycngABmQ8S+U8vln3IORkuRCuEwTEZm3rvpmTOnpU9PddTWTmAxEaZoGAV1IoyJlgFSIfxjakUYuRAKkUCIcdlCs0eWxSc1fHDH1lg9DB0Ke06mMKsomyAXhsNnhROH+zg9/9srjG47um37aVcWlJFCBGWI0QI0bHoNzuBQ2Lx/U1SIEDEgdJElQVAVsJjNIANCEBM3nE3FmO3955l/vuOmK6R/vWDV/V2JcRNdKj3jWz2Pfvfndv544XFlisqLCZEjkIawGhxxBRyGiSOXvzXpq5qmzJ9hzi7/40AskFEGcLhTLavhZZAyIgTBZFH55m16zv3zh0483LP1yVYTFFOVXo+/sP2xczvA/TdqwsfJ4ZyuqUgjBCMDQcJQSGLIGiwBjEzNinAGwoDqZxBAdEsHokEBI7LZR4PaXuaGNyjgNH1sQGBGk0VDiUujAGAMSEjgzokYzV0DlHMwWC0SoVtC9fo2kdJstVrSqKqiKCmZFNbSihQRBAgJSgF9oUO/zktR1q2I2WVwBL/iFBgEhwB/QQNMEkGIQvpEYcETBGCcOGC7rL4WUIMCYyjErCjS3R4vmCUnLR6UPzH1i5kOLrGZrtS/ggyD4SgD4Q9KAfrNiCBkZwDMycn7ToPc/gmFuLmSGpQv19RXNNyz59kpXZdn1ms/TV+oB8AU0AEABhi8IIgJISRDUwAQEJGQgOGOKw+4AZrIeSmze+vXBE2+cGyRVY57TyUdlZwsAILvFBqs3rBn28vw5d289su/KUr9HASGliXEAICZDPRlJYe5NoRQZG2RYGWdACCCEDDmjCfD5+ZXdh89b+M43M9Yv//btGAv9uayu/sjgcTNGjph1xYIt5ScGqhoIKQVv8CMJqVYHVWgUhct63Qs9HSnFu77JHzjqjqmzN5woukxFRQAQJwzztYAGNzlAZOAXmp5isSuPTLx5+rSxY+WZo7u/C+hU2br7yLRTp462veGDJ9cdc1Vws2TIhMRYxQo2iw38QvPVuOsC0q9ZOeOqVAA0FYApCui6DlpAN7w4kEBKApWrIHVJBhMICRkaE0Iy2GJmyMJqdYYkW5Bj2tCRZyyo4UfAsHESERApTHEcJUkDrBhyBGMUk0KvE3K4l6EwFYExBGaYd4GQQjBkgIw1sNuZwV1CDPdHJZASCYRxh4xxDjamQBQzB1rGN9ub3rLj4lsmTlvWr1e/gpBp0QjnCGVt1lr5WzMx+kMDIBEh5OYy+B2C3v8EhsFUWQT/jW9c9u3oyuITM101VZMU0s3+gAa6JAEISFKyBhl9hOBcstGpVBhxi9kEZkfs7pROPZz9L7l6ERj+rUq6wSEkAJCRNgd88vVngz9amfNEUeWZCcV11YCAUmUKAAWtAPDiYz0summk5gHjKL2osUHN2p3eNHtp952bVw0y+euW+jRfoO/Ya0fd+tRdVyws3PIXjxbQmSQlvOZI4R1YA9gEQ+ITOw94L/flz56oPH+6/8DbMxYcdVfY7CYLChbUeQ8zN8YGnw2Qfr8P0mKSq/blbhhVsG7pU7F2nlFW61k8cPSVl9/33F8em7tr5XP1AZ+uaqg0M9mpc4uWaFLUozG2iNNtk1JPt23exlTv8hx26z62Ydfmc1a7vTOhkn6s+CTnKk8FxpqdKT0vzBZLnFcI8Gg+0HUBfl0HwQDQrIIkASTBaBAJEka51ZB2ZhAaJTJIog2CshfsNmw0rG+Qtw9iXoMPe6h5g42d8TBln+AYITYQ1zHY1zZiUJIAKJlxoDBBoBJAhNUOsVZbbbPohC3dWnZcN23spHVD+wzdajNbNW8w2gvy+QLwX7IQmta/GQwzWUOKjAwOF6xNO3Zg15/qKs5lkh5o4fP5QRNSGNuIsQuE0oMpnBA6qQrjFosdHDEJq1M7d3+q95BJm0JpcXkYEEbZI+DtLz+4Mmf9sgd3nT48uLS+DpBQmhgnQGASLvTOCDdPx2AEGmBCptoi8OXp9102bcq1+dtWzT8YY1NbMWvMU4Uu38b73stafaquSrdwhUvDNhgaR24bPTCQM+nzebFXQouTO7/Nv+SlR66fP/KSy3M2FJcpTy94/zkfgeAhXcYwWwzDXt5QuyZJQkqdX9qux5rFH86fVpD3w9aEuJi256pdN44cc9UXl95+1c6fThT0MumK0AMaF1IDZlPBajaBxSshSjHXJiQkFLdp2fJUy/hma4Z37X9o4qjLEQDKAOAUAFgBgDbv2Nxs696tkQdPHYmNi04aduj0UTOo2Pl46TmQQK08eiDGVe8yETDm8XpB4wBSZaCDACkJuGQgAroxxq1wQADBOAs5bSIL664DSgKJiAyN+cxQzRQxeO412NQEnbWMOq4AQSSISUFMSgGGMTKAiXGwcAXsJitEW22VCY6YI11btjnQJrnN8odmzNoFZvPRsAADoQ8oUAACGud9zWt3bJrcKjV5e9uUtqd+zzy/JgD8jb7vOTk5rDAzk7IbH7rold+9e1NtZeldmtfdXg8EICCERKYQEPG/LcGQJCnBZjUzVMwUFZ/yeee+Q19s26X/oYuAMNQx5nPmz71yft7S+4vKTg0q87iCPQYmEJFRUCgBw+w0kQAEkjBZOL+m54jXPna+99C2/CVzUmIdt50tLV8xYPTVfx5x2+SVm84caWnmCgmS7MLiWJCIHIxcdCFEjMnM5zrfmiEOHe5duHXpg2pEzMkHX/h84NBbJs3dVndmvOoTQgYVYy58IWhARF1oIsZq5ZPSB9366WMvnjh4YNtqTdNqouI79CmtqIi68d1HNx2sLTPZQEEiQFAYSUNym5EmAE0IaFfBYbGARSBYBYe4mNjzsfaoPW1jkg5365B26pJufZd37Nr7MABQSkKy9Pv94PV5wa/5QZCM3bdvX/NTZ481r3DXddy6Z4efWUw9jxefVH1MT1VUU7vTZ8+SSTG19GgBU63PDdxiggAS+IUGUpMghWgwemNBczld1xuEKhrMuDgDk8UMDBCkpgPpRkmCmzhYrRZQJAAXAFEmq24zWU9HWx0lkfbIonbNWhQN6zX4zBWDJ2yNjHOcqfO4w0GMQxpwKAINGgU5cOWW/ParNq65xmI3d0tr333XpX2GvB8TE1P3z2BUNAFg0/rF5XQ6WXpREWY2pse2/B8+m1JddvZuf33tIKlr4PFrAAACEVhDFBCsByEyQUDMYbMhcFN9dGyzdwePnfa2PSGhoWNcXn4BEJo++/6LSfPWLL2p8PyxCZW+ekXXCUwK1zkikxDsTksJIEH6NR8b2j7twLo5S/oXbFoxJsaifO/2+iq6D5nYbeodmS+sOll4kw4kEIFTOOk7bLY4WOwSoBAf3bnvx0te//qZdx+/uZB0v8NsNoE5JuXtG+9//s3W0wbuPeuts5kEYiiSDLnINZqTIzAA8jEpuyaliBVPfd255Oyee+Mcyr0llXUbB4y5eujTb2U/8Xr+wmfcXr9QJHDgjeN2zJjgIVC5lEgkAjoKITkwAkXhYJYAFsUE0Q47xJodpYkRcSWxsZE74iwRO9NbdTlz5ejJ56Pi44tUpniJgsbtYVy/IHm+BQCYq0vPWnYfKVIX5y0PpLZo0b1e11scPH4AImyR7QBYi3Ol56na66Yqd6UfCC2JcUmtrRZrtKFPJAEZQ5LSd66i9DABeZJjEi2JEXEYFxmj13lqC9q3bOdWgB9G4T1yzaRrlLbN29YCQAVHVi+NaRqQUgIAqNCoYC4BGqY/2PEzZ/q88eWbo0pLSjMclojo5GZJP/Xskf5K5pjMc00pcNP6j6XHRIQ7Vy0cd+rovjvq62ouRzBEHgC5DoAckJAha+hbEIBgRNxmMQEq5vKElBbvjrjqzg8QsTwUEa6FRsEFh8UOXyz8ZsR3eYvvLjh5YFyxcEX4pQAmQXJCQiGZx+uVraPi+Jz7nxvfuU3n7VWn9u51WNXUiJiUq79ctUJ7c8W3Pxa7a3UzVxURsvu8wPvNYDoyQunze6FDTGLpoQVbBnz1xl9nmwM1E8CeNL+qqniggpR6ww0PDr1/7seT5xas+KsupEAyJjIaJWPCSMsIwBQudAvwwfEt8/LeW5KxbfXCgjiHpVWdzh7vNWT8yxPvyFi74uCuISaTRaCCnDheKMCK4bxAo4YmjWkQkgDBiRDD0tdiNYODqWAnFRxo9sbY7KcT45OKk2Nid3Vo1vp46+at900eO7kwCDLu0Az7xSsEOtA4mYHRjkjd4/EAIoJfaCoYsvgSGl0BpZmrHiklOBwOqHbVhgQ6pMoU0kn87a9pDyocBT0M9MBusYHbW28BgPj5y78f/PP2DYOKTh4a53bXdnGYzXXprbt+du/N977RrW27UxIInHlOJXtUtt4EgE3rP1snBAabV3w3oPzcsT/XVJRMUpCifH4NAFEwhkjBKZNGDoYQIKVit9tAsTiK45JavjPyqplzELHyIiCUYIzXsePHD6Y/M+/9jIJTh64urqvqUutxgy4lmRHw+n5j585/45ubly/8OLdZjO3qMpd3Ud/hU27uO/2Swl3V55IsTA1OYDTO24aaJxT0BBckhUNV+RPX3HPvkOgo/7F9+R9Kph697pG30r95P+tPVFv8gUeaim59/J1re2QO/2ZfXWlnK1eCIg2hBihCI63GkEfUVdAjrRblpu6jnnrlwWe27d64dCkg9ya0696HNIwZ/+CMtQeqylSrw4aShSwCJIEI160P0mPCLhxDXdzg3LMgIiEECL/GpJQMmSGSa1NVsJlMEBUZCQ6TtSrO7ChPsEedTLRHn46OidnXIbnlgWH9h2ktWrTZBwBulSkBQQI446BL8b/dpxgGjL+YjiqMA2ccAnoAImwOqK13td++fXPq6h35nc5Ul/U7VV7S9WTpuW7VXrcdNQmJcfGHurbp9OYXWe8u4MjLZTA4/L1o+TUB4B985eTk8PA6YeHG1a2OHtx+l9ddewvKQGzAHwBNkAjyLXjQ1N1wVpJSqgryCLsDQLWUxCSmzL7k6js/RMQSgKDggjFvLQFAqsghIPWI1z9/f+ryLXlTj1SdujTG4fDs/GRNx6LtqwfygHtpjcdTM2Ds9P5X33/D00uP7byGBAkg4A0zz6GQKtgECfYvhI4675nQ6vvtc1c+P+eZO1YrJCKbdeo7deI1s34gInXuyw+ssUjP0MiUjtne1C4Fd739+KJKv0eYkHHZQLnDC5zuDFtNRj7NLztGxUPOYx/25t7SmRFWfldJpfunYeMyJ9325Kw3P9uy+h6fEDo3K6oGOjBkwAUCaZox6xxSpCEAENIYHzQpQBxB13XgyAECApggiYxJBkQIQVVFBiARmWDEJBqEES4kmBDBEREBVpVDhGqTXNCZlOhEnena3latWtcn2GPKHFb70XbN23rB4ypo0aJVbZ8+QwEM4nNVpN3hq6t3mwHADI2SbCFrTl/w+yIAIPr88eNQdHxfXK2u99h/8pDZ5/P3PnTmpNUv9e5ltVXNqutdSdWBenAFPMAZh0Q1MtAmOeX7KwaN+fL+6+782ayatICu/SHmepsA8A9cJywqysaQHFhFRUXq9hVfT6utKLmdk9bB7/eDLxCQgNygzRGFmsfEGAoEUiwmFZjZXhGT1HxOh+5DPm7dueeJUMo0e/ZsPmvVLAnB1yci08aNa9osX7McnnO+dmjXukVrI80wHC3xj8/bsfnQ+0u/XlDm8wiVgBucxSAZLqRmEKStMEDyg06tImP0499u6TDvrcdelPXl03Vz/I83PfjC1KyskTw7O1/flre468HNy7dLkOzGR9/vf+U9192+7GjB7UAsKHIQ/sQ21vOIJKAgEZA6H94mvWDN7O/v2rNh6Y9mk5pki03tGnA4IPOvt+0vcVUDkqxrltRM6kKc87vrzydExvDYyGiIsDlQURQIaAHw+fzg9ntlRV2N9GpeW3REVHpJRRloPl+03x8AL+igA4DfHwDkHNDEgZtUYIA6BwYoUYYiX4ESCYELqTMINjDMigLMxMFEDFTkYLfZgIEEhZu0SJMdLIqi6XqgRApZazaZwWa2oYlzg9DHAIQuqM7vEX4tYFK5Egecx9e63ej1e1QyKVAvNfDqGmhCB6/fB4AANlIgEi2u1s1Stg1I77nomevu+bllm3YHaxrtM/+rIr4mAPy9p8eZmSysYWLP+/6zq6tKjt8c8NSPELoG/oAGwJhuxDUGq8LoRQjBEZXIiAgQqLjtEdELWrfv9knXEZPXk9CDQDtCWQsA+dn5Ehq705YdqxecBqnF9x17zZjht0x6d/3Zw53sZjNIKRlJgL/luYWatiRMKvJL2nS/77M7HziUt/zbZR6/XpE+5pq+ffoMOe10OjE9PR0zM6eJ7957Kgs95U4PmVfe+PDrM3tcO3LL/qrSRCtXqMFN7sJ3I5T5gyZ1ER9h4/dcesN1MwYPGmUz8z/VevGO9t37zX7l07ev7NCqfXTn1Bb7OnXqeg4AShRkUlFUIxrkLMizNPqvuqaBpmugcgW8eiDx/MmTsccqznTdXrjbduj0keSSysrmvkCge0VtXawP/C2rNU9EQAp0u+oNJVyOwFQOkgAUYEQkBRJKZoydBWNORCkFCpCAjCtSCJCaDkAEjLNgV5galbmD6T/jBumZCEBoOoAUEhSFGRVFAsWkgEU1QSSpkGCPKk50RG/q077rhsxhEzf26tdvh0U1U3AGmYETIGRs9N+8mgDwd1snbDQGR6bA1hXfjjl3vPC2+rraKxgKs8/vBylRMMYM+/EglwsZkwiSKwwBuQns0XFrE5u3/mjQuBk/IWJtY/rtNFVXF9PMmbPlzvxFmxwm6teibc8b7n3/9V45+/If8AU0wQB4w6RYiKYStNtkiNIX8GHflNbHtn2++tp5bzw0z85le4xKnXXFTQ/NyXM6lVHZ2ToRYRYiZhGZP3vx3p1mDHTu1HX4vT+cPl32wcrvvnH5/UJBw1M4qO8CUjZ2mhlD8rEAdI1NLtvxxtLJ+3at/Co60t6R2xPHtO7cYzU2gnGIBqKMHz+eL1++PDTe1QD2v7AvGkzKgcAYD2QKBIRmA4Bo8HqV175831ZPYmRFTVW3o6Wn4yvdNa1r/N54f0Br4fa4VcEAAlJAQOhAHIEkgNSMVJwxQ1uQJAgenM4mBhS0TgYiQ6QXiFBhTNF1IwtmFhUYAdhNZlCRgU0xk8NsOZUYFbMvvXXHA22ik1c9eOu9hwDgPCKGNzJCqs+yaRc1AeAfCQgbZjUP7tjY+cCu9TO87pprUfrbCqGD1xcAZKgzxhgCMiIgIYUEEsxms6HZYgNd0tnI6KTl7bv1y+3Qc8iasI2Dx/Zsms5F/delVa6t/UdPvb7H9Zds31txLtLK1eCMW1BhRTZMr5COUsZbLPzpGx4Z3cFXe1n1uaIHfWjbPv2+FwdlZmZeICCRk5PDMzMzxarc2RPOHt652BeAmllZH04cc+fUV/LPHBpmBi4Jg8KvwYgzZPMpGIqISDO/vNPABz598NnjJWcO/lBaXr2tx9DLhs2ZM4vmzZtD+fm/5gGNgJyD1DUVABQwOrAEAD7VZA4QQdAJUP7a3jEAEhnoUlgjbA4vSQlun8e0Z09B/61Fu2MPnT/ZZsverSwpMWVgTX1dbLW71mE1WzuWV1VSrddDlghbnGI2odfjBSGMxggF2ZQMEUxcBYUQ6utclYlRMeCwOeqFlEeTomNLrcy8tXfnbpVDe/SvHDpw6Ea72VbHOILb62m8xqCKdTigN60mAPwDNkwyuDFu11DHs6/J+fDymprSm+pra8YojJguBGgCRHD2lxkWKFwYDnCCK4wBqiawRsTsjU1M/bpthwELW3brfpSkYHs2Ld8WE2nr07J979F/euqh4QsPbnJ6pRQcQ1FgUIgVAAhRkAX5wOR2H+S/++MH377xwBaSwtSu16WjB4yetC7kA3Px9Wdm5orv3n58vvBWXqXYmuX0n3rrW0PvmZJXEqhXzMBQgqFmGjJsQgDpkxp2T2pRvOvz1d32bVm1NjY6olsALOPbdum5IvSIE8mY44Ub0mtLi9vW1Na2qK0qs5rN9q6BgC8q4Km3IcMoQGZGZFYAIJKiFpDcnCk+k93hURgcsNgiTkdFxxckt+19OqllyzO/QnXBXwMas2ICn+Y3BZsXdqivD/yQm+uL7pjS3CX8SYePHmcurwt1n878wi8ZUzHaEYEtUlrI+Mhol6Iph8eMGWMKgnSNzWytDY6v/c3vD0n2h8ofTbujCQD/qxomAGtZdnbQnIZx2Lfppx4nD+7L8NZVTxPC314P+CHg1wEYE8g5kJQsOGcnha5zs1lFm90OwBS/xRHz86QbH55ycM+msZFmtry0smZLryHjp/W9bvTugsrz0TauQIPdZnC63y80aB+TWHs4Z1PagjnPfOxQ9In10vLWVbc9dl8I6H7purOzs2nX5rxWO1fn7OYoo2bc8NfLrn7tiWErT+19lHQSICQPKzCCrusiUlX5jKHj73tl1v3V1dUln5dV1m7sPnDM0K3Lvh7k99beWFdT097v83YP+HwJIAPAGQPkCghpRHdSF6AJHZBxAJLA0Zgos1gtRpMFAMxmQ50FFRX8mgC/Di5FNe02W2z7HRHRWyITW+6Kad7paMuWLb1hkSECAIwYMYLnAwDk58uwYsE/Y7ERzhEsH0ZKCAqpBqX+scniswkAm9LjX0iPiciyYcnnEyrOn76+zlV9qUXhdl3XwOsLABHpaEyoMsaQEFECSR4fF4uWmBa3jcmc9fHu9Uu3xkbb+8fHt8587NP3232+ZcULbp9XcM54iKssdF2YAflNY6964L5hl1TtK1g1V2Omk5dMu7fHO+/EuwF+XUk4ZKyTO/u5+8lV/LrOHAXT73/h8u7Xj9peWFWSbAVOAiUDQmCSpNfnxf7N253b8uWqKbvyF/0QGx3ZXHDb5LZd+//8/exnTivSk+QL6OD3a+D3+0kCCSQQTFEIGVNASoUzAFXhwBQFJDAgScWqyVTn9/n3JqQ0ByHxlM/rPmmxmIEZsjaKpgsT6ZpF6roJGWqpbdNb22KabU/rM+QjRBS/BnLhcvVGCRMh1AjKzc395Q8yw9CMzszIlARNpu5NANi0/g9g6GRZWWFRIQAc2rut7dlDBaNrK8qudLmqRyggrVJKEJJAEghkDBhDQpLIFGvJjAdfHnCicHsf6av+sarOc6DfqCmTh9wwbtOms0firRYrSgRkjEm/7mfd41MP7Poy77oFHzi/F56alrEtu143NnPm16Fa3997HnMyMlhGTg59/dqDWyLM0K9F274PLTp+ruLNpZ/O9RAJrnIOBCClFJFWM//z+BkPzBp1qVJXdfblWq9+oO+IK9J+/ubtu+urS99xuT1+BsSkUcvjQIIZKs4mIMYBgFUqJkuhIyJik8UesTOxdefzXfuO2gsAvl+b5mhaTQDYtH6Dae/IkcCCM7/if4oKw8nVAAwO71vX7kTR3on11RWTAn5vf5VTlO73gdfnA13KgFlR1PiWXV+bcN3dD+9atyQ/OSlmuKJG3vJSztfs8y3LPqr2eYWCnAc4iXi7ld8w/MrhN6R3He2rPes8euLshmvueX5EbmYmZv4DUuohkFy/5OsxZcd3rUBUXFPvfmHqwBljnt9Re3agRTEJQkAfFzg0uUNh/js/jN66av7O6AhbqmpPuLpt136bc9/+6y6f1xMjEbiZK8xkMQXFBqiCq+bdkfFJmyIiY9akDZ64Lz6xWZX+t7U0Q4Q3GJTlGoFY8D+Nq7Awl4qKMjAjAyDjv8M7uAkAm9YfCDQB2NrsbJkdRgM5ffpQ6rGd64e5ykum1rtrLxF6IF7lDHRQ9Iik9sndeg5oAcK1w+WuP9Vt0Lg+o26funbd6cJuZlB1TQTUAS06LNrw8dKHVs//YLeJk5rYOn1I594jt/8D0d8F4JOZmSsWffJcTpSqZ3B7ypeVCe1m3/HOI/kVfi8SECXHRPHbR2WMm95rcLrVCq8Xl1Wu6jV04tif573xcX3J8VvqNQBiClisjgNmi21FbFLKyg79h+9MSmpbclGGik7nCJ6efhdlZBTS3/OTIXIapkvYRCNpWk3rNwFiAAD7169suXnJ589tXPbtuF+qNTUAS0YG/6WvOZ1OlpOTw53G2FXD2UhEzdctnzd+8edvZC365NmNK7577w0AgL1bVn5dfXInndyz5a63PvtwfKvpgwgmtNdaTOml7Tp4cMi6Hz79bsdPc2jdj59/BGDMH/9vU3YCwEN717ddMffZmlVfvuQjoj6T777ma9vkrmS6rKMcM2vyRiJqvWfD0vLDBasC508c6rIl/8c2Cz98qnL+u49tXP71O8/sWPPDACLiF708M94HJ7v4vSAizMnJ4f9T/S70vjetptW0/mN1PcLg/6w/fvT0rhUfPUVLPnlRHN29rWt4tBL2/Q0b++8BEhFhntOpZGTA3wDB7o0rEokIa8vPdjqwdbmvYM33LiJKv/T+aaut13SiKY9e/xYRDV4973Va+sXLlacOHEhxOp3s/wIYoWtcu3COc8eP79LKb99ZUlvrGdRsYre61Kk9aem6n0cf2rb6tTN71lDBup/mAgDs2LGy5ZmjhR2AKRcB/AglJyeH/9rB8PcOjfBMadvqZZ22rV7WqSl7alpN6zcAgGDoBTsWfpB1atE7D9Hij56lQ/u39gx+nYVqagSAG39e8FDe/DkfVhNF/4ObviEiCoIRhkc/hdtWf3ZuXx4d3rLq7We++nD4qLsn1p/weluv/eHjH3Yu/Zjyvv/0IQAA+pWI6h+5P6fTyYjIvnTui8fXfPMqUcAzYvxdGV9Mvmf6FiLqVrBmfmDHmlx/+bkTnS+6F8zJyeDkdLIwn/RfBLbwnyMi+671SzKIyNyYjhvXv2XFvKu//yArsOC9x/0/57x/efjXmtbvdzWF8r/ThYjkdDoREd2tOqdfldAqPTcyLuWmTl0H7A5ywQwFmcJCQgCqLT3V0V9xbFb+7KePr/r2/QeJSAnxxv7e78jMzBSjDA1BIiLMysoiIsLk1NbOGre/RoC85bZBI6qvH3DV+Joda/tHOyxX1HrFgZFTbn6HnE4GGZny/3p/6enpiIj1EfHNn1M4gxW5H73y+n3Pf/DYbY/dvHfj8scS4mNUbnK8k5Da5mBubi4LgSYAUGZmrsDsbBnuiX5BOcAALwqZwJ05c7TD8s9f3H7u+KGHwVBeMYC+8D0EAKitrrkSdK8qfC6Tq6ZmGgBAQvBrTasJAJvWf2CF+HR9RmXsGHT5zZkjrvzT5xD04glFUdnZ2XTm8OHmdZXnM2v8wpXSKv1ev8d1T37OOxuOHdubBIANUd3fq4GFQCn42iw2td1pbo16LCm5ma24+MxTM2+etb667PRLQugQnZiahYj+tSNHsl8DoH9kZWRkSKfTyYZOnPG1W6PdkWbqp5875ujetq3LZrNOq3Frp3oOGf+00+lkIffAf3TONTMzUxAR7tqc1xoRKCKiXaVfEzZPXfmPiKg7nSOCe2OkJCKMaZbwCpodp5k16nxyq7bvExGuhZFNzZCm1bT+8+mwk+XkZPCLwStUR1v8xWsv/Dz3aVo9f/aLAACninaO3fjNK7T8y1ffAkDIyci4GPQwz+lU6FdqdyGgJCK+f/uanUd2riWXy9/952/ePr9mwQfHiUgJpq//3xFS6J7WLvnoyvzv3tI8dXXDdm9e+X3Z0Z10tLBgdPB6+P+UxodKAkSEhw8fNv/01ZvXfv/eYzuXffH6qtDPf//xS1t++OTFvwIYVgINrxFM/8uJIogosqkG2BQBNq3fVDqcLTMzc0U4zYScTjYqO1s/e6yoo89dfbfHr0Pzdt0WAgCcPrq3R3VNhR7w+dsia6C7wakDG1L2b8/vD4A0Kjtbx+xs6Qwat18cCQb/FJypt/k1UepwmA5ExTX7KiIq8SVE1LOM9PX/mxcXitRapbdfGpHS6Y3qqtJOLZMTp5RV133VPr3P6pycHB6cvvgb0MvJyeChNB4RpdPpZFlZWRgREaEg4+kBTevpqTg5etHs5xYSUarFZouNjEkwBSO/xvsNpv8JiC5ErAul2U1P3h9g7zS9BX/M5XQCe+55s1z48XML9bqyqSZHwjGfp0412WzF/rrKAWaLFVI69Lmu7yVTvs7Ly1NGjRqll5091nHr6h8O6j7XNovZ/mNq18Hfd+879OCv7fXQ3Onx44Wt2rRJKwn+s34xIP1zolxCxjkdLdx1tYlTz+YdejwNWVk6GEP/9Hd+Tj20K7+n2R7nbtOp24Hwrx07cKDbvvW579i5PqJeV0tUi9URGZf8p2GTZszPc+bxUdmj9IuvIfwAaFq//6U0vQV/wJTY6WRZALB1dZ/RR3fkXYaK+fzUmx66edEnzy+Vmp4Yldz6PUdU4uo+o674gQAwt7ycCAB3nzzaGgNuEppI0RV5y5Ety55d9slzPzXr2OvRXsMmFIUG7oMREAtKZmHbtumnCH7BZ/2fGuUarkjtuvSYDwDzg2k6Xxts9kCYveO+LVsSPe7zfWvLTly+4stXxgGwVowELP381Xcn3PDgA5CVJdYCsHZduuzjqmlk3sI5d9SfPfm85qpw6JFxFgCg8qL36VeuoWk1pcBN67cb+TkZZGXRXXfdlXTuxKHXY6Ic5qSWHd4BgD1C1wmRl1467b67B4/L/D4rK8sArdxcQAAqPXPkepPCMLldt8cz732+fad+I65XTOpkCcICAJSVlYUhKavs7GxdMVnAbHVQY5r492uGf48PGOI1XvRv7CL+HoXVOWlUdraeDSCRK4auYEYGR2RUVXLovrqzhUtcNTXT4lPbz2zRuW9vl6v2iKLX3b1v0/JLMTtbjgSQTqeTXTnlCj588k0ftO89YjpDhMrzJ51EZM7MzRX/jBpm02qKAJvWv3FlZ2fLrKwsTEhIKOk79ooxhRtWPa5arLsBQJVSZ153jYmkFpWbm+vOyMiQAMAys7OFm9zNVsx+7QqSAjq177XT666F9P5j1qDFcVl6j0EF4a+/adXi1MqzRXdrmjaNEfNZrOZvu46a9h5i88pwOaaQhH8wJRah1PxiRRgjsMRfirj+psuamZkpKioqIk/uX9+jpvTsYHdt9RCmqMmTb/7rOACsdmY52YgpNz7//Zynp6qqOaV1j+GF8fHx53768rUfwV/zkNvligYAyE1Px+xgfTErK0tJ7z9y1aHd67ehp7p/Xu7su3Jyct4KjsU1RX1NEWDT+j2tEF0lJaVj+djMO+8bPP7a5QCgM5PZq3CeDACWzMxMkZWVhenpRQgAULB4wU1c+iIAedm2VfOWr533yta1ue9ek95j0LI8p1MhMiK/HRuWDas8uWdPfV3NX4XEfG4y5Xk97llFq77cvWPV9zcBNtJqEJGCkVTUsV35/c+cOdw8Oxtkdna2DI+uEI0mAxE5QhEeEbEDW/P67lu7oN+OvK/jAQyryrzv575VsOyzQ+ePFS3y+/wzmcnGhR5I3Jv/QzoiUDqAgoguR3Sz3Ei7KWLvhh9v2r9lVZq/rvyK2gDfOWhcxrKcnBweBH9ARBpp/KkntWz3XURsLNTWVQ9IS0uzZmU1PUtNEWDT+v3WAoPqLxmFhYSItft2rh5TfuLIs3vWLe8JACuy0tMRM7MlV0xQWXI6UwGCtj2GTXNVlZGv5nxOVHTClpycHF4OQIiZ5HK5ElfOe/MrhXxxSW27TRg16drlwd/z+I9zsqtNVSWJCEBOAG78M1lWzHvryUWfPPdnVVEsoGu06stXFye27vEwIh4P+YKsmPf+PUs/e3E6N1ubpaX1mAoAuwFAOX5w14uk+y5p3XNcRwCoICnBEhm1wlN+7B5uiVx92fUPTkRU/EQ6P7jxRxsAAKSnCyLC/dvzFx3atvJx7/mSv1SeOZGNgXpujo2dDwDuzMxMEd7JHZkFErIBFLOaH90q/bJLR129DOjRpgeoCQCb1u89EgylngAA3XqP3gMAkxt4c4WFBABUuGtDv6J1P3QNoOVAr0Gj1iEiFRO1S0asD0VjAEBHdq29ShWelhqat1561Z+WO51OZUBsLEfEmrzF8+632WzLDAxKJyLCxXNf/caC/ivQZL+3z7grfzq5e2P38jPH5p05vGPA7t27e/fo8X0FZAOmtuu+bnf+gucVjvbUzgP8wZQ48MOH2ZWgmFd07dPn6OyZM9VZc+ZoAy+ZsnXenk0es8A+AJCydcU3UZt+zpkyZNy0rGBUKYMTLrsObF192Myw06AJmXdsWpE7XA1UTf/xw+xmO7esm9V74PCixvfJSMcHXpIZSvWxKfVtSoGb1h8uInQypxMYIhq1LwPczCf3FzxgsZhVKYUjb/HXmURk8xesi1y7+OsOAABz5sziAADl50+kcpSU0Cz1aMDnxezsbDnhnnsCRISjJl/7Zv/RUw5RUPZq409fTyZ3xRV17sDPl9/8l7eTklodHzDu2u+VyIQ7bSqlntu18k7EbPmZ80Zz1wFDd8ektn41OioKTu3fekUwJbZpQk602aOWEwFCnz6h23BZrdbD0uuJ/uGTl5acP31wS/nZk3fTObJlZWUhIkKG0QzRYxJTllgtKh3Zvyci865nrgVr8oucAkPP7svftzN/yUMADaNzYNQnDVWcJvBrAsCm9YeMCLNldtALtmFsDCHQY+SUWxPa9b3U5ojaWHHywNz57zxasqdg9fnI6Oj2AAAtfOkMAEA12aRqtgIw7kFEmD1zJkdEyMrKMiZHiDArOB9bVX5uHIIuI2Pi1pDu5zmvvWbJycnhCUnNjtV762XA7xlHRGhP92hOp5N16Tn0s/qA8Afq6+4iIvPGn74egCDtrbr2/xkRaObMmcLpdDLGlYDFFrXbZjWT2WLZ1KJD9wmJrdr9BZQyFqotpqWlEQBBu649c72CqOT0oXvXr8xpOeGGex81J3W8Iql1pxss9oivAZCys7MbwC47O1v+o5qFTasJAJvWHwEUASk5Obm+38iJKyfd9ND0jD8/2zIyPvkFxRL1au9hk5YREbqTk3UAgIQW7dYQt2B1RUknQIVmzZmjAQBlZ2fLUdnZOiJSUVGiYRVpsqQqZiuLjEsUiCihRZ0wJjIYEiDjJnMkALCgQRJrm97nFHHTHIcFmhdtXTvBXVM+RlFNp7v0GnjAwGuUIwEYSQGqIyLP6ohEuyP2VN+RU/IGj7n6k0PnznXZtmbJTABoaOyokZFV9tjU8pi4+L02bkvIycngl15106IBYzO/Tus7ojgUGDc9BU01wKb1X75ycnJ4bm4uIGI5ALzQWEY06og5GRm8W/9L1v70xRtf2kze6xfPfemjpNZ9n05slaCf3r3xNm6NXThk3FX7MzLSeG4uCJSywGy2TK6urJAAQL5TbhWAtLrquYlmVZEuTd+JiMLpdCrp6ekEANi2y8APj+1ceXfgwI4HOYco1Wz9Ruoa5DmdfFR2tl5ufB8kNGuz79zB8oCsLht1+vShz04V7hq8b8ui9y22yGLESXNCs816RaB81JXX9bPZ4s403mcGB8iAkHhC0yffFAE2raYFmZmZIjdI/nU6nYoBFI3RUUZOjnQ+Reyy6+6dFVAcL+ve2utP7P35yJZFXx6uqaq8r1lqYh0RYUKCoZCS3K7Lcq8/gO7q0mlEZLnh4dfqgalUU37uTl3zs8SU5gsBALLSDR8TJwD2Gjb6ECiWdT5X+aCA5uvcom3nXACAkVlZEsBQhwEAiGnevLTe5zOBXn/J5kVfHT5/bP8XFovpqDUy6mUAgMK0NAIAaNOrV43NFnfG6WycZw7NTDeBX9NqWk3r/7yIKHbv2kWD9uQvGX6xQorRWED46au3Xlg65wn6fs6zO1d8894tP3z87ILFsx+n+XOee49xfoG0fBBwYeOyr8ct/SSb5s/OPkpEJggTLQ19/4ZlOZ3yfvh0dv6PX9y0f9Py/kSUAMh/6RqxSb6+aTWtpvXPBD78BfmsBsmo0HI6nQyQwebl30xb8eWrmxZ/9uLpZV+8smfd4s9vA8YbwPLi1yYitmr+nCXrlnz5VCg1/wcvDZsUmpvW/3b9P7cUkN9DAQJSAAAAAElFTkSuQmCC";
function DBMark({ size = 44 }) {
  return (
    <img
      src={DB_LOGO}
      width={size}
      style={{ height: "auto", display: "block" }}
      alt="DB Recovery"
      draggable={false}
    />
  );
}

/* ---- legal documents (drafts for attorney review before public launch) ---- */
const LEGAL = {
  terms: {
    title: "Terms of Service",
    sections: [
      ["Agreement to these Terms", "By accessing or using Second Chance (the \"App\"), you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the App."],
      ["What the App is (and isn't)", "The App provides general information, educational content, and self-help tools relating to recovery support and criminal-record relief, for informational purposes only. Nothing in the App constitutes legal, medical, psychological, financial, or other professional advice, and no attorney-client, provider-patient, or other professional relationship is created by your use of it."],
      ["Your responsibility and assumption of risk", "You use the App voluntarily, at your own discretion, and at your own risk. You are solely responsible for your decisions and actions, including any legal filings, health choices, and physical activities. Exercises offered in the App are optional; consult a physician before beginning any exercise program and stop if you feel pain or distress."],
      ["Emergencies", "The App is not an emergency service and does not monitor your safety. If you are in crisis or danger, call 911, or call or text 988 in the United States."],
      ["No guarantees", "We make no promises about outcomes, including record clearing, eligibility, sobriety results, savings, or any other result. Laws, fees, procedures, and third-party resources change frequently and vary by jurisdiction, and information may be outdated or incomplete despite our efforts. Verify all critical information independently with official sources or a licensed professional before acting on it."],
      ["AI-assisted content", "Portions of the App's informational content were prepared with the assistance of artificial-intelligence tools together with human review. AI-assisted content can contain errors and is provided for general information only; it must be independently verified."],
      ["Acceptable use", "You agree to use the App only for lawful, personal, non-commercial purposes; not to copy, resell, reverse engineer, or interfere with the App; and not to use it in a way that harms you or others."],
      ["Your content", "Content you enter (such as journal entries, logs, contacts, and photos) is stored on your device, remains yours, and is your responsibility. We do not receive it."],
      ["Intellectual property", "The App, including its design, text, graphics, games, and code, is owned by us or our licensors and is protected by law. We grant you a limited, revocable, non-exclusive, non-transferable license for personal use. Third-party names (for example AA, NA, and SMART Recovery) belong to their respective owners; no affiliation or endorsement is implied."],
      ["Third-party services and links", "The App links to independent organizations and resources for your convenience. We do not control or endorse them; your use of them is governed by their own terms and subject to their availability."],
      ["Availability, changes, and force majeure", "The App may be modified, suspended, or discontinued at any time without notice. We are not liable for delays or failures caused by events beyond our reasonable control."],
      ["Disclaimer of warranties", "TO THE FULLEST EXTENT PERMITTED BY LAW, THE APP IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT."],
      ["Limitation of liability", "TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST DATA OR LOST OPPORTUNITIES, ARISING FROM OR RELATING TO THE APP. OUR TOTAL LIABILITY WILL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID FOR THE APP IN THE PRIOR 12 MONTHS OR TEN U.S. DOLLARS (US $10). Some jurisdictions do not allow certain limitations; where that is the case, these limits apply to the fullest extent permitted."],
      ["Indemnification", "You agree to defend, indemnify, and hold us harmless from claims and costs (including reasonable attorneys' fees) arising from your misuse of the App or your violation of these Terms."],
      ["Dispute resolution, arbitration, and class-action waiver", "Please contact us first; most concerns can be resolved informally. Otherwise, any dispute will be resolved by binding individual arbitration rather than in court, and YOU AND WE EACH WAIVE ANY RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION. Either party may instead bring an individual claim in small-claims court. You may opt out of arbitration by written notice within 30 days of first accepting these Terms."],
      ["Governing law", `These Terms are governed by the laws of ${GOVERNING_LAW}, without regard to conflict-of-law rules.`],
      ["Age requirements", "The App is intended for adults. It is not directed to children under 13, and users under 18 may use it only with a parent's or guardian's involvement and consent."],
      ["Copyright complaints", "If you believe content in the App infringes your copyright, contact us with the details required by applicable law (including the DMCA) and we will respond appropriately."],
      ["Termination", "We may suspend or terminate access for violation of these Terms. Sections that by their nature should survive termination (including Your content through Governing law) will survive."],
      ["Changes to these Terms", "We may update these Terms. Material changes will be presented in the App for renewed acceptance, and continued use after acceptance constitutes agreement."],
      ["Severability and entire agreement", "If any provision is found unenforceable, the remainder stays in effect. These Terms and the Privacy Policy are the entire agreement between you and us regarding the App."],
      ["Contact", `Questions about these Terms: ${CONTACT_LINE}.`],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["The short version", "Second Chance is built privacy-first. We do not collect, transmit, sell, or share your personal information. There are no accounts, no analytics, no advertising, and no tracking of any kind."],
      ["What we collect", "Nothing. The App has no servers of ours behind it and sends no personal data to us or to anyone else."],
      ["What stays on your device", "Anything you choose to enter, including your sobriety date, \"why\" text and photo, contacts, urge logs, diary entries, check-ins, preferences, game scores, and your consent record, is stored locally on your device only."],
      ["Cookies, analytics, and ads", "None. The App uses no cookies, advertising identifiers, analytics SDKs, or crash-reporting services."],
      ["AI", "The App does not send your information to any AI service. Some informational content was prepared in advance with AI assistance, as described in the Terms of Service."],
      ["Photos", "If you add a \"why\" photo, it is resized and stored on your device only and is never uploaded."],
      ["Third-party links", "Links in the App open independent websites and services (for example 988, AA, NA, and government sites). Their own privacy practices apply once you leave the App."],
      ["Your rights and controls", "You can export everything or permanently erase everything at any time in My Toolkit. Uninstalling the App also removes locally stored data, except any copies your own device backup settings create."],
      ["GDPR and CCPA/CPRA", "Because we do not collect or process your personal data, most data-subject obligations do not arise. We never \"sell\" or \"share\" personal information as those terms are defined by the CCPA/CPRA. Access and deletion rights are satisfied directly by the in-app export and erase controls."],
      ["Children", "The App is not directed to children under 13, and we do not knowingly collect information from anyone, as described above."],
      ["Security", "Because your data lives on your device, its security depends on your device. We recommend using a passcode or biometric lock. Note that the export file contains your private entries, so store it somewhere safe."],
      ["Retention", "Your data remains until you delete it in the App or uninstall the App."],
      ["Changes", "Material changes to this policy will be presented in the App."],
      ["Contact", `Privacy questions: ${CONTACT_LINE}.`],
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    sections: [
      ["If you're in crisis", "The App is not an emergency service. Call 911, or call or text 988 (US), any hour, for immediate help."],
      ["Not legal advice", `State-by-state information is general education reflecting law current as of ${DATA_ASOF}. Laws, waiting periods, and fees change and vary by case. Nothing here creates an attorney-client relationship. Confirm everything with the linked official sources or a licensed attorney before filing anything.`],
      ["Not medical or clinical care", "Recovery tools, urge techniques, breathing, games, and workouts are self-help patterns, not treatment, therapy, or diagnosis. They are used at your own discretion and risk. Consult qualified professionals about your health, and a physician before starting exercise."],
      ["No guaranteed outcomes", "Record relief, recovery progress, savings figures, and every other result depend on your circumstances. Estimates and trackers in the App are planning aids based on what you enter."],
      ["Independent organizations", "AA, NA, SMART Recovery, SAMHSA, 988, and every other linked resource are independent organizations. We are not affiliated with them and do not control their services."],
      ["AI-assisted content", "Some informational content was drafted with AI assistance and human review, and may contain errors. Verify critical information independently."],
    ],
  },
};

function LegalModal({ doc, onClose }) {
  const d = LEGAL[doc];
  if (!d) return null;
  return (
    <div className="legalveil" onClick={onClose}>
      <div className="legalcard" onClick={(e) => e.stopPropagation()}>
        <div className="legalhead">
          <div>
            <h3>{d.title}</h3>
            <span className="legaldate">Last updated {LEGAL_UPDATED} · v{APP_VERSION}</span>
          </div>
          <button className="gameclose legalclose" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>
        <div className="legalbody">
          {d.sections.map(([h, t], i) => (
            <section key={h}>
              <h4>{i + 1}. {h}</h4>
              <p>{t}</p>
            </section>
          ))}
        </div>
        <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function ConsentGate({ onAccept, openDoc }) {
  return (
    <div className="consentveil">
      <div className="rewardcard consentcard">
        <div style={{ display: "grid", placeItems: "center", marginBottom: 6 }}><DBMark size={72} full /></div>
        <h3 className="calmh">Before you begin</h3>
        <p className="calmsub" style={{ textAlign: "left" }}>
          Second Chance offers information and self-help tools for recovery and record clearing. It
          is not legal advice, medical care, or an emergency service.
        </p>
        <p className="calmsub" style={{ textAlign: "left", marginTop: 10 }}>
          By selecting "I Agree" and continuing to use this application, you acknowledge that you
          have read and agree to the Terms of Service and Privacy Policy. You understand that you
          are using this application voluntarily and at your own discretion, and you accept
          responsibility for your own decisions and use of the application.
        </p>
        <div className="legallinks">
          <button onClick={() => openDoc("terms")}>Terms of Service</button>
          <button onClick={() => openDoc("privacy")}>Privacy Policy</button>
          <button onClick={() => openDoc("disclaimer")}>Disclaimer</button>
        </div>
        <button className="btn primary" style={{ width: "100%", justifyContent: "center" }} onClick={onAccept}>
          I Agree &amp; Continue <ArrowRight size={16} />
        </button>
        <p className="consentcrisis">
          In crisis right now? You don't need to agree to anything to get help: call or text{" "}
          <a href="tel:988">988</a>, free and confidential, any hour.
        </p>
      </div>
    </div>
  );
}

/* roundRect polyfill: older Android WebViews lack it; without this Snake and
   Breakthrough would crash on those devices. Falls back to plain rects. */
try {
  if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); return this; };
  }
} catch (e) {}

/* monotonic timestamp: prevents duplicate keys when entries are added in the same millisecond */
let __lastT = 0;
const nextT = () => { const t = Math.max(Date.now(), __lastT + 1); __lastT = t; return t; };

/* ---- on-device persistence (no accounts, no servers, no tracking) ---- */
// Uses localStorage in the deployed app; falls back silently to in-memory
// in environments that block it (e.g. this preview).
const store = (() => {
  const mem = {};
  let ok = false;
  try { window.localStorage.setItem("sc_t", "1"); window.localStorage.removeItem("sc_t"); ok = true; } catch (e) {}
  return {
    persistent: ok,
    get(k, d) {
      if (k in mem) return mem[k];
      if (ok) { try { const v = window.localStorage.getItem("sc_" + k); if (v != null) return JSON.parse(v); } catch (e) {} }
      return d;
    },
    set(k, v) {
      mem[k] = v;
      if (ok) { try { window.localStorage.setItem("sc_" + k, JSON.stringify(v)); } catch (e) {} }
    },
    clear() {
      for (const k of Object.keys(mem)) delete mem[k];
      if (ok) {
        try {
          const ks = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith("sc_")) ks.push(k);
          }
          ks.forEach((k) => window.localStorage.removeItem(k));
        } catch (e) {}
      }
    },
  };
})();

const MILESTONES = [
  [1, "24 Hours"], [7, "1 Week"], [30, "30 Days"], [60, "60 Days"], [90, "90 Days"],
  [180, "6 Months"], [365, "1 Year"], [730, "2 Years"], [1825, "5 Years"],
];

const soberDays = (dateStr) => {
  if (!dateStr) return null;
  const d = Math.floor((Date.now() - new Date(dateStr + "T00:00:00").getTime()) / 86400000);
  return d >= 0 ? d : null;
};

function shrinkImage(file, cb) {
  try {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        const s = Math.min(1, 360 / Math.max(img.width, img.height));
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.72));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  } catch (e) {}
}

const ROAD = [
  ["recovery", "Get Support", "Find your program and your people", HeartHandshake],
  ["pressure", "Stay Steady", "Beat cravings, 15 minutes at a time", Gamepad2],
  ["eligible", "Check Your Case", "See how strong your clearing case is", Scale],
  ["diy", "Clear the Record", "File it yourself or get free legal help", Gavel],
  ["help", "Rebuild", "Jobs, reentry, and legal-aid resources", Trophy],
];

function Pill({ children, color }) {
  return (
    <span className="pill" style={{ "--pc": color }}>{children}</span>
  );
}

function ExtLink({ href, children }) {
  return (
    <a className="extlink" href={href} target="_blank" rel="noopener noreferrer">
      {children} <ExternalLink size={13} strokeWidth={2.2} />
    </a>
  );
}

/* ---- Recovery & support resources (verified, current as of 2026) ---- */
const SUBNAV = [
  ["recovery", "Recovery Tools", Activity],
  ["pressure", "Beat the Pressure", Gamepad2],
  ["hobby", "Find a Hobby", Palette],
];

// Crisis lines shown atop every recovery section.
const CRISIS = [
  { name: "988 Suicide & Crisis Lifeline", note: "24/7 free, confidential. Mental health, suicide, or substance crisis.", call: "988", text: "988" },
  { name: "SAMHSA National Helpline", note: "24/7 free treatment referral & info, English & Spanish.", call: "1-800-662-4357" },
  { name: "Crisis Text Line", note: "Text-based crisis support, 24/7.", text: "HOME to 741741" },
];

const RESOURCES = {
  recovery: {
    title: "Recovery tools",
    intro: "Free, reputable programs and tools for building and protecting long-term recovery, whatever path fits you. Many are online and available 24/7.",
    cards: [
      ["SMART Recovery", "Free, science-based meetings (in-person & online) plus self-help tools. A secular alternative to 12-step.", "https://smartrecovery.org", null],
      ["In The Rooms", "Free online recovery meetings around the clock across many fellowships. Join from anywhere.", "https://www.intherooms.com", null],
      ["FindTreatment.gov", "SAMHSA's confidential locator for treatment programs near you. Filter by type, payment, and more.", "https://findtreatment.gov", null],
      ["Recovery Dharma", "Free peer-led recovery rooted in Buddhist/mindfulness practice; in-person & online meetings.", "https://recoverydharma.org", null],
      ["Faces & Voices of Recovery", "Connects you to local Recovery Community Organizations and peer support nationwide.", "https://facesandvoicesofrecovery.org", null],
      ["Women for Sobriety", "A supportive recovery program designed by and for women, online and in person.", "https://womenforsobriety.org", null],
      ["LifeRing Secular Recovery", "Abstinence-based, secular peer-support meetings, online and in person.", "https://lifering.org", null],
      ["988 Lifeline Chat", "Prefer typing? Chat online with a trained crisis counselor, 24/7.", "https://988lifeline.org/chat", null],
    ],
  },
  addicts: {
    title: "Narcotics addiction",
    intro: "Meetings, free treatment referral, and help for families. You don't have to do this alone, and it's free to reach out.",
    cards: [
      ["Narcotics Anonymous (NA)", "Worldwide 12-step fellowship for anyone recovering from drug addiction. Find local & online meetings.", "https://www.na.org", null],
      ["SAMHSA National Helpline", "Free, confidential, 24/7 treatment referral & information. English & Spanish.", "https://www.samhsa.gov/find-help/helplines/national-helpline", "1-800-662-4357"],
      ["FindTreatment.gov", "Search verified treatment programs near you, including medication-assisted treatment.", "https://findtreatment.gov", null],
      ["Partnership to End Addiction", "Free, personalized support for individuals and families navigating addiction.", "https://drugfree.org", null],
      ["Nar-Anon Family Groups", "Support for the family and friends of someone with a drug problem.", "https://www.nar-anon.org", null],
      ["SMART Recovery", "Science-based, secular meetings and tools for overcoming addictive behaviors.", "https://smartrecovery.org", null],
    ],
  },
  alcoholics: {
    title: "Alcoholism",
    intro: "Peer fellowships, a government tool for finding good treatment, and help for loved ones. Reaching out is free and confidential.",
    cards: [
      ["Alcoholics Anonymous (AA)", "The original 12-step fellowship. Find local and online meetings worldwide.", "https://www.aa.org", null],
      ["NIAAA Alcohol Treatment Navigator", "A free government tool to find and choose quality, evidence-based alcohol treatment.", "https://alcoholtreatment.niaaa.nih.gov", null],
      ["SAMHSA National Helpline", "Free, confidential, 24/7 treatment referral & information. English & Spanish.", "https://www.samhsa.gov/find-help/helplines/national-helpline", "1-800-662-4357"],
      ["Al-Anon Family Groups", "Support for families and friends affected by someone else's drinking.", "https://al-anon.org", null],
      ["Women for Sobriety", "A recovery program designed by and for women, online and in person.", "https://womenforsobriety.org", null],
      ["SMART Recovery", "Science-based, secular meetings and tools that work for alcohol too.", "https://smartrecovery.org", null],
    ],
  },
};

const FELLOWSHIPS = {
  na: { name: "Narcotics Anonymous", short: "NA", site: "https://www.na.org", find: "https://www.na.org/meetingsearch/" },
  aa: { name: "Alcoholics Anonymous", short: "AA", site: "https://www.aa.org", find: "https://www.aa.org/find-aa" },
};
const fellowshipsFor = (focus) =>
  focus === "both" ? [FELLOWSHIPS.na, FELLOWSHIPS.aa] : FELLOWSHIPS[focus] ? [FELLOWSHIPS[focus]] : [];

function ResourceSection({ which }) {
  const sec = RESOURCES[which];
  const focus = store.get("focus", null);
  const fellows = fellowshipsFor(focus);
  return (
    <div className="page">
      <h2 className="page-h">{sec.title}</h2>
      <p className="page-sub">{sec.intro}</p>

      <div className="crisisbox">
        <div className="crisis-h"><LifeBuoy size={17} /> If you're in crisis right now</div>
        <div className="crisisgrid">
          {CRISIS.map((c) => (
            <div key={c.name} className="crisiscard">
              <div className="crisisname">{c.name}</div>
              <div className="crisisnote">{c.note}</div>
              <div className="crisisactions">
                {c.call && <a className="callbtn" href={`tel:${c.call.replace(/[^0-9]/g, "")}`}><Phone size={13} /> Call {c.call}</a>}
                {c.text && <span className="textbtn"><MessageSquare size={13} /> Text {c.text}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {which === "recovery" && fellows.map((f) => (
        <div className="fellowcard" key={f.short}>
          <span className="whylabel">Your fellowship</span>
          <h4>{f.name}</h4>
          <p>Front and center because of what you're working on. Meetings run every day, many online.</p>
          <div className="datarow">
            <a className="btn primary sm" href={f.find} target="_blank" rel="noopener noreferrer">Find a meeting</a>
            <a className="btn ghost sm" href={f.site} target="_blank" rel="noopener noreferrer">Visit the site</a>
          </div>
        </div>
      ))}

      <div className="resgrid">
        {sec.cards.map(([name, desc, url, phone]) => (
          <div key={name} className="rescard">
            <a className="resmain" href={url} target="_blank" rel="noopener noreferrer">
              <h4>{name} <ExternalLink size={14} /></h4>
              <p>{desc}</p>
            </a>
            {phone && (
              <a className="callbtn small" href={`tel:${phone.replace(/[^0-9]/g, "")}`}>
                <Phone size={12} /> Call {phone}
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="verify-note recovery">
        <HeartHandshake size={13} /> These are independent national organizations, free to contact and listed
        for your convenience. They aren't endorsements or a substitute for professional care. Recovery looks
        different for everyone; the right fit is the one you'll keep coming back to.
      </p>
    </div>
  );
}

/* ================= BEAT THE PRESSURE — arcade ================= */
// Cravings crest and pass, usually within 10–20 minutes. These three
// original 8-bit games hold your hands and mind for those minutes.

/* ---- chiptune audio cues (square wave, fits the 8-bit theme) ---- */
let audioReady = false;
let soundOn = { v: true };
async function ensureAudio() {
  try { if (!audioReady) { await Tone.start(); audioReady = true; } } catch (e) {}
}
function cue(seq) {
  try {
    if (!audioReady || !soundOn.v) return;
    const s = new Tone.Synth({ oscillator: { type: "square" }, volume: -16,
      envelope: { attack: 0.005, decay: 0.08, sustain: 0.25, release: 0.12 } }).toDestination();
    let t = Tone.now();
    seq.forEach(([note, dur, gap]) => { s.triggerAttackRelease(note, dur, t); t += gap; });
    setTimeout(() => s.dispose(), 2500);
  } catch (e) {}
}
const CUES = {
  workStart: [["C5", "16n", 0.12], ["E5", "16n", 0.12], ["G5", "8n", 0.2]],
  restStart: [["G4", "16n", 0.14], ["E4", "8n", 0.2]],
  tick: [["A5", "32n", 0.1]],
  workoutDone: [["C5", "16n", 0.13], ["E5", "16n", 0.13], ["G5", "16n", 0.13], ["C6", "4n", 0.4]],
  reward: [["C5", "16n", 0.12], ["C5", "16n", 0.12], ["G5", "16n", 0.15], ["E5", "16n", 0.15], ["G5", "16n", 0.15], ["C6", "2n", 0.5]],
};

function useLoop(fn, ms, on) {
  const ref = React.useRef(fn);
  ref.current = fn;
  React.useEffect(() => {
    if (!on || ms == null) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms, on]);
}

function useKeys(handler, on) {
  React.useEffect(() => {
    if (!on) return;
    const f = (e) => {
      const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", " ": "action" };
      if (map[e.key]) { e.preventDefault(); handler(map[e.key]); }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [handler, on]);
}

function DPad({ onInput, actionLabel }) {
  const rep = React.useRef(null);
  const stop = () => clearInterval(rep.current);
  React.useEffect(() => stop, []);
  const press = (dir, repeat) => (e) => {
    e.preventDefault();
    onInput(dir);
    if (repeat) {
      stop();
      rep.current = setInterval(() => onInput(dir), 110);
    }
  };
  const B = (dir, label, repeat) => (
    <button
      aria-label={{ up: "Up", down: "Down", left: "Left", right: "Right" }[dir]}
      onPointerDown={press(dir, repeat)}
      onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
    >{label}</button>
  );
  return (
    <div className="dpad">
      <div className="dpad-grid">
        <span />
        {B("up", "▲", false)}
        <span />
        {B("left", "◀", true)}
        <button className="dpad-act" onPointerDown={(e) => { e.preventDefault(); onInput("action"); }}>{actionLabel}</button>
        {B("right", "▶", true)}
        <span />
        {B("down", "▼", true)}
        <span />
      </div>
    </div>
  );
}

/* ---- GAME 1: FOUNDATION — stack steady blocks, clear lines ---- */
const TET_W = 10, TET_H = 16, TET_CS = 16;
const TET_PIECES = [
  { s: 4, c: "#5FD3BC", cells: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  { s: 2, c: "#F2C14E", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { s: 3, c: "#B07CC6", cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  { s: 3, c: "#7CC66B", cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { s: 3, c: "#E2725B", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { s: 3, c: "#6B9AC6", cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { s: 3, c: "#E2A05B", cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
];

function FoundationGame() {
  const cvs = React.useRef(null);
  const g = React.useRef(null);
  const [hud, setHud] = useState({ score: 0, lines: 0, over: false, speed: 560 });
  const [best, setBest] = useState(store.get("hs_foundation", 0));
  React.useEffect(() => {
    if (hud.score > best) { setBest(hud.score); store.set("hs_foundation", hud.score); }
  }, [hud.score]); // eslint-disable-line

  const fits = (board, cells, px, py) =>
    cells.every(([x, y]) => {
      const nx = px + x, ny = py + y;
      return nx >= 0 && nx < TET_W && ny < TET_H && (ny < 0 || !board[ny][nx]);
    });

  const spawn = (G) => {
    const p = TET_PIECES[(Math.random() * TET_PIECES.length) | 0];
    G.piece = { cells: p.cells.map((c) => [...c]), s: p.s, c: p.c, x: 3, y: -1 };
    if (!fits(G.board, G.piece.cells, G.piece.x, G.piece.y)) G.over = true;
  };

  const reset = () => {
    g.current = {
      board: Array.from({ length: TET_H }, () => Array(TET_W).fill(null)),
      score: 0, lines: 0, over: false, speed: 560, piece: null,
    };
    spawn(g.current);
    setHud({ score: 0, lines: 0, over: false, speed: 560 });
    draw();
  };

  const lock = (G) => {
    G.piece.cells.forEach(([x, y]) => {
      const ny = G.piece.y + y;
      if (ny >= 0) G.board[ny][G.piece.x + x] = G.piece.c;
    });
    let cleared = 0;
    G.board = G.board.filter((row) => {
      if (row.every(Boolean)) { cleared++; return false; }
      return true;
    });
    while (G.board.length < TET_H) G.board.unshift(Array(TET_W).fill(null));
    if (cleared) {
      G.lines += cleared;
      G.score += [0, 40, 100, 300, 500][cleared];
      G.speed = Math.max(180, 560 - G.lines * 14);
      cue(CUES.workStart);
    }
    spawn(G);
  };

  const step = () => {
    const G = g.current;
    if (!G || G.over) return;
    if (fits(G.board, G.piece.cells, G.piece.x, G.piece.y + 1)) G.piece.y++;
    else lock(G);
    setHud({ score: G.score, lines: G.lines, over: G.over, speed: G.speed });
    draw();
  };

  const input = (dir) => {
    const G = g.current;
    if (!G || G.over) { if (dir === "action") reset(); return; }
    const P = G.piece;
    if (dir === "left" && fits(G.board, P.cells, P.x - 1, P.y)) P.x--;
    if (dir === "right" && fits(G.board, P.cells, P.x + 1, P.y)) P.x++;
    if (dir === "down") step();
    if (dir === "up") {
      const rot = P.cells.map(([x, y]) => [P.s - 1 - y, x]);
      if (fits(G.board, rot, P.x, P.y)) P.cells = rot;
      else if (fits(G.board, rot, P.x - 1, P.y)) { P.cells = rot; P.x--; }
      else if (fits(G.board, rot, P.x + 1, P.y)) { P.cells = rot; P.x++; }
    }
    if (dir === "action") { while (fits(G.board, P.cells, P.x, P.y + 1)) P.y++; step(); }
    draw();
  };

  const draw = () => {
    const ctx = cvs.current?.getContext("2d");
    const G = g.current;
    if (!ctx || !G) return;
    ctx.fillStyle = "#171420";
    ctx.fillRect(0, 0, TET_W * TET_CS, TET_H * TET_CS);
    const cell = (x, y, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(x * TET_CS + 1, y * TET_CS + 1, TET_CS - 2, TET_CS - 2);
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.fillRect(x * TET_CS + 1, y * TET_CS + 1, TET_CS - 2, 3);
    };
    G.board.forEach((row, y) => row.forEach((c, x) => c && cell(x, y, c)));
    if (!G.over) {
      // ghost landing preview
      let gy = G.piece.y;
      while (fits(G.board, G.piece.cells, G.piece.x, gy + 1)) gy++;
      if (gy > G.piece.y) {
        ctx.strokeStyle = "rgba(242,227,198,.35)";
        ctx.lineWidth = 1.5;
        G.piece.cells.forEach(([x, y]) => {
          if (gy + y >= 0)
            ctx.strokeRect((G.piece.x + x) * TET_CS + 2, (gy + y) * TET_CS + 2, TET_CS - 4, TET_CS - 4);
        });
      }
      G.piece.cells.forEach(([x, y]) => G.piece.y + y >= 0 && cell(G.piece.x + x, G.piece.y + y, G.piece.c));
    }
    if (G.over) {
      ctx.fillStyle = "rgba(23,20,32,.78)";
      ctx.fillRect(0, 0, TET_W * TET_CS, TET_H * TET_CS);
    }
  };

  React.useEffect(reset, []);
  useLoop(step, hud.over ? null : hud.speed, true);
  useKeys(input, true);

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>SCORE {hud.score}</span>
        <span>ROWS {hud.lines}</span>
        <span className="besttag">BEST {Math.max(best, hud.score)}</span>
        {hud.over && <span className="gameover-tag">NICE RUN!</span>}
      </div>
      <canvas ref={cvs} width={TET_W * TET_CS} height={TET_H * TET_CS} className="gamecanvas tall" />
      <p className="gamehint">One steady block at a time. Build the base, clear the noise. ▲ rotates, DROP slams it down.</p>
      <DPad onInput={input} actionLabel={hud.over ? "RESTART" : "DROP"} />
    </div>
  );
}

/* ---- GAME 2: ROAD HOME — cross the lanes, dodge the triggers ---- */
const FR_COLS = 9, FR_ROWS = 8, FR_CS = 26;
const FR_LANES = [
  { row: 1, dir: 1, gap: 4, em: "🌩️", spd: 0.055 },
  { row: 2, dir: -1, gap: 5, em: "🪨", spd: 0.07 },
  { row: 3, dir: 1, gap: 4, em: "🚧", spd: 0.085 },
  { row: 4, dir: -1, gap: 4, em: "🌪️", spd: 0.065 },
  { row: 5, dir: 1, gap: 5, em: "⚡", spd: 0.08 },
  { row: 6, dir: -1, gap: 4, em: "🌫️", spd: 0.06 },
];

function RoadHomeGame() {
  const cvs = React.useRef(null);
  const g = React.useRef(null);
  const [hud, setHud] = useState({ score: 0, lives: 3, over: false });
  const [best, setBest] = useState(store.get("hs_roadhome", 0));
  React.useEffect(() => {
    if (hud.score > best) { setBest(hud.score); store.set("hs_roadhome", hud.score); }
  }, [hud.score]); // eslint-disable-line

  const reset = (full = true) => {
    if (full) {
      g.current = {
        p: { c: 4, r: 7 }, score: 0, lives: 3, over: false, boost: 1,
        lanes: FR_LANES.map((l) => ({ ...l, off: Math.random() * FR_COLS })),
      };
      setHud({ score: 0, lives: 3, over: false });
    } else g.current.p = { c: 4, r: 7 };
    draw();
  };

  const hazardCols = (l) => {
    const cols = [];
    const n = Math.ceil(FR_COLS / l.gap);
    for (let i = 0; i < n; i++) cols.push(((Math.floor(l.off) + i * l.gap) % FR_COLS + FR_COLS) % FR_COLS);
    return cols;
  };

  const collide = (G) =>
    G.lanes.some((l) => l.row === G.p.r && hazardCols(l).includes(G.p.c));

  const hit = (G) => {
    G.lives--;
    if (G.lives <= 0) G.over = true;
    else G.p = { c: 4, r: 7 };
  };

  const step = () => {
    const G = g.current;
    if (!G || G.over) return;
    G.lanes.forEach((l) => { l.off += l.dir * l.spd * G.boost; });
    if (collide(G)) hit(G);
    setHud({ score: G.score, lives: G.lives, over: G.over });
    draw();
  };

  const input = (dir) => {
    const G = g.current;
    if (!G || G.over) { if (dir === "action") reset(true); return; }
    if (dir === "left") G.p.c = Math.max(0, G.p.c - 1);
    if (dir === "right") G.p.c = Math.min(FR_COLS - 1, G.p.c + 1);
    if (dir === "down") G.p.r = Math.min(FR_ROWS - 1, G.p.r + 1);
    if (dir === "up") G.p.r = Math.max(0, G.p.r - 1);
    if (G.p.r === 0) {
      G.score++;
      G.boost = Math.min(1.8, G.boost * 1.06);
      G.p = { c: 4, r: 7 };
      cue(CUES.workStart);
    } else if (collide(G)) hit(G);
    setHud({ score: G.score, lives: G.lives, over: G.over });
    draw();
  };

  const draw = () => {
    const ctx = cvs.current?.getContext("2d");
    const G = g.current;
    if (!ctx || !G) return;
    const W = FR_COLS * FR_CS, H = FR_ROWS * FR_CS;
    ctx.fillStyle = "#171420";
    ctx.fillRect(0, 0, W, H);
    // goal row
    ctx.fillStyle = "#234436";
    ctx.fillRect(0, 0, W, FR_CS);
    ctx.fillStyle = "#7CC66B";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("☆ MEETING · SAFE ☆", W / 2, FR_CS / 2);
    // start row
    ctx.fillStyle = "#2a2435";
    ctx.fillRect(0, (FR_ROWS - 1) * FR_CS, W, FR_CS);
    // lane stripes
    G.lanes.forEach((l, i) => {
      ctx.fillStyle = i % 2 ? "#1d1928" : "#201b2c";
      ctx.fillRect(0, l.row * FR_CS, W, FR_CS);
    });
    ctx.font = `${FR_CS - 8}px serif`;
    G.lanes.forEach((l) => {
      hazardCols(l).forEach((c) => {
        ctx.fillText(l.em, c * FR_CS + FR_CS / 2, l.row * FR_CS + FR_CS / 2 + 1);
      });
    });
    // player
    ctx.fillText("🏃", G.p.c * FR_CS + FR_CS / 2, G.p.r * FR_CS + FR_CS / 2 + 1);
    if (G.over) {
      ctx.fillStyle = "rgba(23,20,32,.78)";
      ctx.fillRect(0, 0, W, H);
    }
  };

  React.useEffect(() => reset(true), []);
  useLoop(step, 120, !hud.over);
  useKeys(input, true);

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>HOME RUNS {hud.score}</span>
        <span>{"❤".repeat(Math.max(0, hud.lives))}</span>
        <span className="besttag">BEST {Math.max(best, hud.score)}</span>
        {hud.over && <span className="gameover-tag">NICE RUN!</span>}
      </div>
      <canvas ref={cvs} width={FR_COLS * FR_CS} height={FR_ROWS * FR_CS} className="gamecanvas" />
      <p className="gamehint">Rough weather on the road, that's all it is. Time your moves and keep heading home.</p>
      <DPad onInput={input} actionLabel={hud.over ? "RESTART" : "—"} />
    </div>
  );
}

/* ---- GAME 3: CLEAN SWEEP — collect milestones, dodge cravings ---- */
const PM_MAP = [
  "1111111111111",
  "1000000000001",
  "1011101011101",
  "1000001000001",
  "1011101011101",
  "1010000000101",
  "1010110110101",
  "1010000000101",
  "1011101011101",
  "1000001000001",
  "1011101011101",
  "1000000000001",
  "1111111111111",
];
const PM_N = 13, PM_CS = 24;
const PM_POWER = [[1, 1], [11, 1], [1, 11], [11, 11]];

function CleanSweepGame() {
  const cvs = React.useRef(null);
  const g = React.useRef(null);
  const [hud, setHud] = useState({ score: 0, lives: 3, over: false, fear: false, speed: 190 });
  const [best, setBest] = useState(store.get("hs_cleansweep", 0));
  React.useEffect(() => {
    if (hud.score > best) { setBest(hud.score); store.set("hs_cleansweep", hud.score); }
  }, [hud.score]); // eslint-disable-line

  const wall = (c, r) => (PM_MAP[r]?.[c] ?? "1") === "1";

  const freshDots = () => {
    const dots = new Set();
    for (let r = 0; r < PM_N; r++)
      for (let c = 0; c < PM_N; c++)
        if (!wall(c, r) && !(c === 6 && r === 6) && !(c === 6 && r === 11)) dots.add(`${c},${r}`);
    return dots;
  };

  const reset = () => {
    g.current = {
      p: { c: 6, r: 11 }, dir: null, want: null, tickN: 0,
      score: 0, lives: 3, over: false, fear: 0, speed: 190,
      ghosts: [{ c: 6, r: 6 }, { c: 6, r: 5 }],
      dots: freshDots(),
    };
    setHud({ score: 0, lives: 3, over: false, fear: false, speed: 190 });
    draw();
  };

  const eat = (G) => {
    const k = `${G.p.c},${G.p.r}`;
    if (G.dots.has(k)) {
      G.dots.delete(k);
      const isPower = PM_POWER.some(([c, r]) => c === G.p.c && r === G.p.r);
      G.score += isPower ? 5 : 1;
      if (isPower) { G.fear = 26; cue(CUES.workStart); }
      if (G.dots.size === 0) {
        G.dots = freshDots();
        G.speed = Math.max(120, G.speed - 15);
        G.p = { c: 6, r: 11 }; G.dir = null; G.want = null;
        G.ghosts = [{ c: 6, r: 6 }, { c: 6, r: 5 }];
      }
    }
  };

  const touchCheck = (G) => {
    G.ghosts.forEach((gh) => {
      if (gh.c === G.p.c && gh.r === G.p.r) {
        if (G.fear > 0) { G.score += 10; gh.c = 6; gh.r = 6; }
        else {
          G.lives--;
          if (G.lives <= 0) G.over = true;
          else {
            G.p = { c: 6, r: 11 }; G.dir = null; G.want = null;
            G.ghosts = [{ c: 6, r: 6 }, { c: 6, r: 5 }];
          }
        }
      }
    });
  };

  const step = () => {
    const G = g.current;
    if (!G || G.over) return;
    G.tickN++;
    // take a queued turn the moment it's possible
    if (G.want && !wall(G.p.c + G.want[0], G.p.r + G.want[1])) { G.dir = G.want; G.want = null; }
    // glide forward Pac-style until a wall stops you
    if (G.dir && !wall(G.p.c + G.dir[0], G.p.r + G.dir[1])) {
      G.p.c += G.dir[0]; G.p.r += G.dir[1];
      eat(G);
      touchCheck(G);
    }
    // cravings move every other tick
    if (!G.over && G.tickN % 2 === 0) {
      if (G.fear > 0) G.fear--;
      G.ghosts.forEach((gh) => {
        const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !wall(gh.c + dx, gh.r + dy));
        if (!opts.length) return;
        let pick;
        if (Math.random() < 0.3) pick = opts[(Math.random() * opts.length) | 0];
        else {
          opts.sort((a, b) => {
            const da = Math.abs(gh.c + a[0] - G.p.c) + Math.abs(gh.r + a[1] - G.p.r);
            const db = Math.abs(gh.c + b[0] - G.p.c) + Math.abs(gh.r + b[1] - G.p.r);
            return G.fear > 0 ? db - da : da - db;
          });
          pick = opts[0];
        }
        gh.c += pick[0]; gh.r += pick[1];
      });
      touchCheck(G);
    }
    setHud({ score: G.score, lives: G.lives, over: G.over, fear: G.fear > 0, speed: G.speed });
    draw();
  };

  const input = (dir) => {
    const G = g.current;
    if (!G || G.over) { if (dir === "action") reset(); return; }
    const d = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[dir];
    if (!d) return;
    if (!wall(G.p.c + d[0], G.p.r + d[1])) { G.dir = d; G.want = null; }
    else G.want = d;
  };

  const draw = () => {
    const ctx = cvs.current?.getContext("2d");
    const G = g.current;
    if (!ctx || !G) return;
    const W = PM_N * PM_CS;
    ctx.fillStyle = "#171420";
    ctx.fillRect(0, 0, W, W);
    ctx.fillStyle = "#3a3354";
    for (let r = 0; r < PM_N; r++)
      for (let c = 0; c < PM_N; c++)
        if (wall(c, r)) ctx.fillRect(c * PM_CS + 1, r * PM_CS + 1, PM_CS - 2, PM_CS - 2);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    G.dots.forEach((k) => {
      const [c, r] = k.split(",").map(Number);
      const isPower = PM_POWER.some(([pc, pr]) => pc === c && pr === r);
      if (isPower) {
        ctx.font = `${PM_CS - 8}px serif`;
        ctx.fillText("⭐", c * PM_CS + PM_CS / 2, r * PM_CS + PM_CS / 2 + 1);
      } else {
        ctx.fillStyle = "#F2E3C6";
        ctx.fillRect(c * PM_CS + PM_CS / 2 - 2, r * PM_CS + PM_CS / 2 - 2, 4, 4);
      }
    });
    // player: chomping mouth faces direction of travel
    const d = G.dir || G.lastDir || [1, 0];
    if (G.dir) G.lastDir = G.dir;
    const ang = d[0] === 1 ? 0 : d[0] === -1 ? Math.PI : d[1] === -1 ? -Math.PI / 2 : Math.PI / 2;
    const open = G.dir && G.tickN % 2 === 0 ? 0.55 : 0.16;
    const cx = G.p.c * PM_CS + PM_CS / 2, cy = G.p.r * PM_CS + PM_CS / 2;
    ctx.fillStyle = "#7CC66B";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, PM_CS / 2 - 3, ang + open, ang - open + Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    // cravings
    ctx.font = `${PM_CS - 6}px serif`;
    G.ghosts.forEach((gh) => {
      ctx.globalAlpha = G.fear > 0 ? 0.55 : 1;
      ctx.fillText("👾", gh.c * PM_CS + PM_CS / 2, gh.r * PM_CS + PM_CS / 2 + 1);
      ctx.globalAlpha = 1;
    });
    if (G.over) {
      ctx.fillStyle = "rgba(23,20,32,.78)";
      ctx.fillRect(0, 0, W, W);
    }
  };

  React.useEffect(reset, []);
  useLoop(step, hud.over ? null : hud.speed, true);
  useKeys(input, true);

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>MILESTONES {hud.score}</span>
        <span>{"❤".repeat(Math.max(0, hud.lives))}</span>
        <span className="besttag">BEST {Math.max(best, hud.score)}</span>
        {hud.fear && <span className="fear-tag">SUPPORT ACTIVE!</span>}
        {hud.over && <span className="gameover-tag">NICE RUN!</span>}
      </div>
      <canvas ref={cvs} width={PM_N * PM_CS} height={PM_N * PM_CS} className="gamecanvas" />
      <p className="gamehint">Pick a direction and you keep rolling, just like the old arcade. Sweep the milestones, grab a ⭐ when cravings 👾 close in.</p>
      <DPad onInput={input} actionLabel={hud.over ? "RESTART" : "—"} />
    </div>
  );
}

/* ---- GAME 4: ONE DAY AT A TIME (snake) — grow one chip at a time ---- */
const SN_N = 15, SN_CS = 18;

function SnakeGame() {
  const cvs = React.useRef(null);
  const g = React.useRef(null);
  const [hud, setHud] = useState({ score: 0, over: false });
  const [best, setBest] = useState(store.get("hs_snake", 0));
  React.useEffect(() => {
    if (hud.score > best) { setBest(hud.score); store.set("hs_snake", hud.score); }
  }, [hud.score]); // eslint-disable-line

  const newFood = (body) => {
    while (true) {
      const f = [(Math.random() * SN_N) | 0, (Math.random() * SN_N) | 0];
      if (!body.some(([x, y]) => x === f[0] && y === f[1])) return f;
    }
  };

  const reset = () => {
    const body = [[7, 7], [6, 7], [5, 7]];
    g.current = { body, dir: [1, 0], queue: [], food: newFood(body), score: 0, over: false, speed: 170 };
    setHud({ score: 0, over: false });
    draw();
  };

  const step = () => {
    const G = g.current;
    if (!G || G.over) return;
    if (G.queue.length) G.dir = G.queue.shift();
    const head = [G.body[0][0] + G.dir[0], G.body[0][1] + G.dir[1]];
    const hitWall = head[0] < 0 || head[0] >= SN_N || head[1] < 0 || head[1] >= SN_N;
    const hitSelf = G.body.some(([x, y]) => x === head[0] && y === head[1]);
    if (hitWall || hitSelf) { G.over = true; setHud({ score: G.score, over: true }); draw(); return; }
    G.body.unshift(head);
    if (head[0] === G.food[0] && head[1] === G.food[1]) {
      G.score++;
      G.speed = Math.max(95, G.speed - 3);
      G.food = newFood(G.body);
      cue(CUES.tick);
    } else G.body.pop();
    setHud({ score: G.score, over: false });
    draw();
  };

  const input = (dir) => {
    const G = g.current;
    if (!G || G.over) { if (dir === "action") reset(); return; }
    const d = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[dir];
    if (!d) return;
    const last = G.queue.length ? G.queue[G.queue.length - 1] : G.dir;
    if (d[0] === -last[0] && d[1] === -last[1]) return; // no reversing
    if (d[0] === last[0] && d[1] === last[1]) return;   // ignore repeats
    if (G.queue.length < 2) G.queue.push(d);
  };

  const draw = () => {
    const ctx = cvs.current?.getContext("2d");
    const G = g.current;
    if (!ctx || !G) return;
    const W = SN_N * SN_CS;
    ctx.fillStyle = "#171420";
    ctx.fillRect(0, 0, W, W);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${SN_CS - 4}px serif`;
    ctx.fillText("⭐", G.food[0] * SN_CS + SN_CS / 2, G.food[1] * SN_CS + SN_CS / 2 + 1);
    G.body.forEach(([x, y], i) => {
      ctx.fillStyle = i === 0 ? "#9ad8c2" : i % 2 ? "#3C7A66" : "#4d937c";
      ctx.beginPath();
      ctx.roundRect(x * SN_CS + 1, y * SN_CS + 1, SN_CS - 2, SN_CS - 2, 5);
      ctx.fill();
    });
    if (G.over) { ctx.fillStyle = "rgba(23,20,32,.78)"; ctx.fillRect(0, 0, W, W); }
  };

  React.useEffect(reset, []);
  useLoop(step, hud.over ? null : (g.current?.speed ?? 170), true);
  useKeys(input, true);

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>CHIPS {hud.score}</span>
        <span className="besttag">BEST {Math.max(best, hud.score)}</span>
        {hud.over && <span className="gameover-tag">NICE RUN!</span>}
      </div>
      <canvas ref={cvs} width={SN_N * SN_CS} height={SN_N * SN_CS} className="gamecanvas" />
      <p className="gamehint">One chip at a time, and look how long the streak gets. Just don't double back on yourself.</p>
      <DPad onInput={input} actionLabel={hud.over ? "RESTART" : "—"} />
    </div>
  );
}

/* ---- GAME 5: BREAKTHROUGH (brick breaker) — knock down the old walls ---- */
const BK_W = 264, BK_H = 300;
const BK_COLORS = ["#E2725B", "#E2A05B", "#F2C14E", "#7CC66B", "#5FD3BC"];

function BreakerGame() {
  const cvs = React.useRef(null);
  const g = React.useRef(null);
  const [hud, setHud] = useState({ score: 0, lives: 3, over: false, level: 1 });
  const [best, setBest] = useState(store.get("hs_breaker", 0));
  React.useEffect(() => {
    if (hud.score > best) { setBest(hud.score); store.set("hs_breaker", hud.score); }
  }, [hud.score]); // eslint-disable-line

  const buildBricks = () => {
    const bricks = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 6; c++)
        bricks.push({ x: 6 + c * 42, y: 30 + r * 18, w: 38, h: 14, color: BK_COLORS[r], alive: true });
    return bricks;
  };

  const reset = () => {
    g.current = {
      paddle: { x: BK_W / 2 - 27, w: 54 },
      ball: { x: BK_W / 2, y: BK_H - 28, vx: 0, vy: 0, stuck: true },
      bricks: buildBricks(), score: 0, lives: 3, over: false, level: 1, speed: 3.1,
    };
    setHud({ score: 0, lives: 3, over: false, level: 1 });
    draw();
  };

  const launch = (G) => {
    if (!G.ball.stuck) return;
    G.ball.stuck = false;
    G.ball.vx = (Math.random() < 0.5 ? -1 : 1) * G.speed * 0.55;
    G.ball.vy = -G.speed;
  };

  const lastSync = React.useRef("");
  const sync = (G) => {
    const k = `${G.score},${G.lives},${G.over},${G.level}`;
    if (lastSync.current !== k) { lastSync.current = k; setHud({ score: G.score, lives: G.lives, over: G.over, level: G.level }); }
  };

  const step = () => {
    const G = g.current;
    if (!G || G.over) return;
    const B = G.ball, P = G.paddle, R = 5;
    if (B.stuck) { B.x = P.x + P.w / 2; B.y = BK_H - 28; draw(); return; }
    B.x += B.vx; B.y += B.vy;
    if (Math.abs(B.vy) < 1.2) B.vy = B.vy < 0 ? -1.2 : 1.2;
    if (B.x < R) { B.x = R; B.vx = Math.abs(B.vx); }
    if (B.x > BK_W - R) { B.x = BK_W - R; B.vx = -Math.abs(B.vx); }
    if (B.y < R) { B.y = R; B.vy = Math.abs(B.vy); }
    // paddle
    if (B.vy > 0 && B.y > BK_H - 22 - R && B.y < BK_H - 10 && B.x > P.x - R && B.x < P.x + P.w + R) {
      const off = (B.x - (P.x + P.w / 2)) / (P.w / 2);
      B.vx = off * G.speed * 0.9;
      B.vy = -Math.max(G.speed * 0.6, Math.abs(B.vy));
    }
    // bricks
    for (const br of G.bricks) {
      if (!br.alive) continue;
      if (B.x > br.x - R && B.x < br.x + br.w + R && B.y > br.y - R && B.y < br.y + br.h + R) {
        br.alive = false;
        G.score++;
        const fromSide = B.x < br.x || B.x > br.x + br.w;
        if (fromSide) B.vx = -B.vx; else B.vy = -B.vy;
        break;
      }
    }
    if (!G.bricks.some((b) => b.alive)) {
      G.level++; G.speed += 0.35;
      G.bricks = buildBricks();
      G.ball.stuck = true;
    }
    if (B.y > BK_H + 8) {
      G.lives--;
      if (G.lives <= 0) G.over = true;
      else G.ball.stuck = true;
    }
    sync(G); draw();
  };

  const input = (dir) => {
    const G = g.current;
    if (!G || G.over) { if (dir === "action") reset(); return; }
    if (dir === "left") G.paddle.x = Math.max(0, G.paddle.x - 24);
    if (dir === "right") G.paddle.x = Math.min(BK_W - G.paddle.w, G.paddle.x + 24);
    if (dir === "action" || dir === "up") launch(G);
    draw();
  };

  const pointer = (e) => {
    const G = g.current;
    if (!G || G.over) return;
    const rect = cvs.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * BK_W;
    G.paddle.x = Math.min(BK_W - G.paddle.w, Math.max(0, x - G.paddle.w / 2));
    draw();
  };

  const draw = () => {
    const ctx = cvs.current?.getContext("2d");
    const G = g.current;
    if (!ctx || !G) return;
    ctx.fillStyle = "#171420";
    ctx.fillRect(0, 0, BK_W, BK_H);
    G.bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.fillRect(b.x, b.y, b.w, 3);
    });
    ctx.fillStyle = "#F2E3C6";
    ctx.beginPath();
    ctx.roundRect(G.paddle.x, BK_H - 16, G.paddle.w, 8, 4);
    ctx.fill();
    ctx.fillStyle = "#9ad8c2";
    ctx.beginPath();
    ctx.arc(G.ball.x, G.ball.y, 5, 0, Math.PI * 2);
    ctx.fill();
    if (G.ball.stuck && !G.over) {
      ctx.fillStyle = "#9b93ab";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TAP LAUNCH OR ▲", BK_W / 2, BK_H - 44);
    }
    if (G.over) { ctx.fillStyle = "rgba(23,20,32,.78)"; ctx.fillRect(0, 0, BK_W, BK_H); }
  };

  React.useEffect(reset, []);
  useLoop(step, 16, !hud.over);
  useKeys(input, true);

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>WALLS {hud.score}</span>
        <span>{"❤".repeat(Math.max(0, hud.lives))}</span>
        <span className="besttag">BEST {Math.max(best, hud.score)}</span>
        {hud.over && <span className="gameover-tag">NICE RUN!</span>}
      </div>
      <canvas
        ref={cvs} width={BK_W} height={BK_H} className="gamecanvas"
        onPointerMove={pointer}
        onPointerDown={() => { const G = g.current; if (G && !G.over) launch(G); else if (G?.over) reset(); }}
      />
      <p className="gamehint">Old walls come down one brick at a time. Slide your finger on the board or use the pad.</p>
      <DPad onInput={input} actionLabel={hud.over ? "RESTART" : "LAUNCH"} />
    </div>
  );
}

/* ---- GAME 6: STEADY MIND (memory match) — calm focus, no clock ---- */
const MEM_EMOJI = ["🌱", "⭐", "💪", "🧘", "☀️", "🌊", "❤️", "🏆"];

function MemoryGame() {
  const shuffle = () =>
    [...MEM_EMOJI, ...MEM_EMOJI]
      .map((em, i) => ({ id: i, em }))
      .sort(() => Math.random() - 0.5);
  const [deck, setDeck] = useState(shuffle);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [best, setBest] = useState(store.get("hs_steady", 0));
  const won = matched.size === deck.length;

  React.useEffect(() => {
    if (won && moves > 0 && (!best || moves < best)) {
      setBest(moves); store.set("hs_steady", moves);
    }
  }, [won]); // eslint-disable-line

  const flip = (i) => {
    if (lock || won || matched.has(i) || flipped.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (deck[next[0]].em === deck[next[1]].em) {
        const m = new Set([...matched, ...next]);
        setMatched(m);
        setFlipped([]);
        cue(m.size === deck.length ? CUES.workoutDone : CUES.tick);
      } else {
        setLock(true);
        setTimeout(() => { setFlipped([]); setLock(false); }, 750);
      }
    }
  };

  const restart = () => {
    setDeck(shuffle()); setFlipped([]); setMatched(new Set()); setMoves(0); setLock(false);
  };

  return (
    <div className="gamebox">
      <div className="gamehud">
        <span>MOVES {moves}</span>
        <span className="besttag">BEST {best || "—"}</span>
        {won && <span className="fear-tag">ALL CLEAR!</span>}
      </div>
      <div className="memgrid">
        {deck.map((card, i) => {
          const up = flipped.includes(i) || matched.has(i);
          return (
            <button key={card.id} className={`memcard ${up ? "up" : ""} ${matched.has(i) ? "got" : ""}`}
              disabled={matched.has(i)}
              onClick={() => flip(i)} aria-label={up ? card.em : "Hidden card"}>
              {up ? card.em : "✦"}
            </button>
          );
        })}
      </div>
      <p className="gamehint">
        {won
          ? `Cleared in ${moves} moves. Want to beat it?`
          : "No clock, no enemies. Just you, sixteen cards, and a steady mind."}
      </p>
      {won && <button className="btn primary sm" onClick={restart}>Play again</button>}
    </div>
  );
}

/* ---- the Beat the Pressure page: timer, picker, reward ---- */
const ENCOURAGE = [
  "You're doing great. Keep at it. I can confirm: at least one human is proud of you right now :)",
  "Another minute down. The craving is losing, you're winning.",
  "Still here. Still clean. Still playing. That counts.",
  "Look at you, riding it out. Keep going.",
  "Every minute on this clock is a minute the urge doesn't get.",
  "Proud of you. Seriously. One more minute.",
];

const EXERCISES = [
  ["Push-ups", "💪", "Knees down is fine, just keep moving"],
  ["Squats", "🦵", "Slow down, slow up"],
  ["Jumping jacks", "🤸", "Find a rhythm and ride it"],
  ["Wall sit", "🧱", "Back flat, thighs parallel, breathe"],
  ["High knees", "🏃", "Drive those knees, pump the arms"],
  ["Lunges", "🚶", "Alternate legs, steady pace"],
  ["Plank", "🧘", "Straight line, tight core, breathe"],
  ["March in place", "👟", "Low impact, just keep moving"],
];

function SoundToggle() {
  const [on, setOn] = useState(soundOn.v);
  return (
    <button
      className="btn ghost sm soundbtn"
      onClick={() => { soundOn.v = !soundOn.v; setOn(soundOn.v); if (soundOn.v) cue(CUES.tick); }}
      title={on ? "Mute cues" : "Unmute cues"}
    >
      {on ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  );
}

function WorkoutFlow({ onClose }) {
  const WORK = 40, REST = 10;
  const [picked, setPicked] = useState([]);
  const [stage, setStage] = useState("pick"); // pick | run | done
  const [segs, setSegs] = useState([]);
  const [segIdx, setSegIdx] = useState(0);
  const [remain, setRemain] = useState(0);
  const [paused, setPaused] = useState(false);

  const togglePick = (name) => {
    setPicked((p) =>
      p.includes(name) ? p.filter((n) => n !== name) : p.length < 3 ? [...p, name] : p
    );
  };

  const start = async () => {
    await ensureAudio();
    const s = [];
    for (let round = 0; round < 2; round++)
      picked.forEach((name) => {
        s.push({ type: "work", name, dur: WORK, round: round + 1 });
        s.push({ type: "rest", dur: REST });
      });
    setSegs(s);
    setSegIdx(0);
    setRemain(s[0].dur);
    setStage("run");
  };

  // segment-change + finish cues
  React.useEffect(() => {
    if (stage === "run" && segs[segIdx])
      cue(segs[segIdx].type === "work" ? CUES.workStart : CUES.restStart);
  }, [segIdx, stage]); // eslint-disable-line
  React.useEffect(() => {
    if (stage === "done") cue(CUES.workoutDone);
  }, [stage]);
  // 3-2-1 countdown ticks
  React.useEffect(() => {
    if (stage === "run" && !paused && remain <= 3 && remain >= 1) cue(CUES.tick);
  }, [remain, stage, paused]);

  useLoop(() => {
    if (paused) return;
    setRemain((r) => {
      if (r > 1) return r - 1;
      // advance segment
      setSegIdx((i) => {
        const ni = i + 1;
        if (ni >= segs.length) { setStage("done"); return i; }
        setRemain(segs[ni].dur);
        return ni;
      });
      return 0;
    });
  }, 1000, stage === "run");

  const seg = segs[segIdx];
  const ex = seg?.type === "work" ? EXERCISES.find((e) => e[0] === seg.name) : null;
  const totalDone = segs.slice(0, segIdx).reduce((a, s) => a + s.dur, 0) + (seg ? seg.dur - remain : 0);
  const totalAll = segs.reduce((a, s) => a + s.dur, 0) || 1;

  return (
    <div className="rewardveil" onClick={stage === "pick" ? onClose : undefined}>
      <div className="rewardcard" onClick={(e) => e.stopPropagation()}>
        {stage === "pick" && (
          <>
            <div className="rewardpix">5-MINUTE RESET</div>
            <h3>What sounds good right now?</h3>
            <p>Pick any 3. You'll do 2 rounds of each, 40 seconds on and 10 off. Five minutes total.</p>
            <div className="exgrid">
              {EXERCISES.map(([name, em, tip]) => (
                <button
                  key={name}
                  className={`excard ${picked.includes(name) ? "on" : ""}`}
                  onClick={() => togglePick(name)}
                >
                  <span className="exem">{em}</span>
                  <span className="exname">{name}</span>
                </button>
              ))}
            </div>
            <button className="btn primary" disabled={picked.length !== 3} onClick={start}>
              {picked.length === 3 ? "Start the 5 minutes" : `Pick ${3 - picked.length} more`} <ArrowRight size={16} />
            </button>
            <button className="rewardskip" onClick={onClose}>Not right now</button>
          </>
        )}

        {stage === "run" && seg && (
          <>
            <div className="workhead">
              <span className={`worktype ${seg.type}`}>{seg.type === "work" ? `ROUND ${seg.round} OF 2` : "REST"}</span>
            </div>
            <div className="workex">
              <span className="workem">{seg.type === "work" ? ex?.[1] : "😮‍💨"}</span>
              <h3>{seg.type === "work" ? seg.name : "Shake it out"}</h3>
              <p className="worktip">{seg.type === "work" ? ex?.[2] : (segs[segIdx + 1] ? `Next: ${segs[segIdx + 1].name || "rest"}` : "Almost done")}</p>
            </div>
            <div className="workclock">{remain}</div>
            <div className="urgetrack" style={{ marginTop: 6 }}>
              <div className="urgefill" style={{ width: `${(totalDone / totalAll) * 100}%`, transition: "width 1s linear" }} />
            </div>
            <div className="workctrl">
              <div className="workbtnrow">
                <button className="btn ghost sm" onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</button>
                <SoundToggle />
              </div>
              <button className="rewardskip" onClick={onClose}>End workout</button>
            </div>
          </>
        )}

        {stage === "done" && (
          <>
            <div className="rewardpix">★ 15 MINUTES ★</div>
            <h3>Cycle broken.</h3>
            <p>
              Ten minutes of distraction, five minutes of movement. You just walked yourself through the
              entire arc of a craving and came out the other side with your heart pumping and your head clearer. Drink
              some water. And remember this worked, because it'll work next time too.
            </p>
            <p className="rewardfoot">
              If the pull is still strong, that's a sign to reach out. Call <a href="tel:988">988</a> or SAMHSA at{" "}
              <a href="tel:18006624357">1-800-662-4357</a>, free, confidential, 24/7.
            </p>
            <button className="btn primary" onClick={onClose}>
              Done, back to the arcade <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const GEAR_TIPS = [
  ["Build a craving kit", "Sugar-free gum or candy, a cold water bottle, and a fidget ring. Keep one in your pocket, your car, and your desk."],
  ["Stock the fridge with NA drinks", "Sparkling water, NA beer, kombucha. Having a default drink in hand removes a hundred small decisions."],
  ["Put support on speed dial", "Sponsor or sober friend on your phone's favorites. Save 988 and 1-800-662-4357 too."],
  ["Clear the house", "Remove leftover alcohol, paraphernalia, and 'just in case' stashes. Out of reach beats willpower."],
  ["Reroute the old paths", "Change the drive that passes the old bar or the dealer's block. New route, new groove."],
  ["Run a HALT check", "Hungry, Angry, Lonely, Tired. Cravings ride in on one of these. Fix the one that's true right now."],
  ["Use the 10-minute rule", "You just proved it: urges crest and pass. When one hits, delay 10 minutes before any decision."],
  ["Move your body", "A brisk walk or a set of pushups changes your brain chemistry faster than arguing with a craving."],
  ["Load a risky-moment playlist", "Headphones plus a recovery podcast or playlist for the moments you know are coming."],
  ["Plan your party exit", "Bring your own NA drink, park where you can't get blocked in, and have a one-line exit script ready."],
  ["Write it down", "Note the craving, rate it 1–10, set a 10-minute timer, rate it again. Watch the number drop."],
  ["Keep a meeting bookmarked", "AA, NA, and SMART run online meetings around the clock. One is starting within the hour."],
];

const GAMES = [
  ["foundation", "FOUNDATION", "Stack steady blocks, clear the noise", "🧱"],
  ["roadhome", "ROAD HOME", "Time your moves, get home safe", "🏃"],
  ["cleansweep", "CLEAN SWEEP", "Glide the maze, sweep the milestones", "⭐"],
  ["snake", "ONE DAY AT A TIME", "Grow your streak one chip at a time", "🐍"],
  ["breaker", "BREAKTHROUGH", "Knock the old walls down", "💥"],
  ["steady", "STEADY MIND", "Match pairs, no clock, pure calm", "🃏"],
];

function BeatThePressure() {
  const [game, setGame] = useState(null);
  const [secs, setSecs] = useState(0);
  const [rewarded, setRewarded] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [workout, setWorkout] = useState(false);
  const [toast, setToast] = useState(null);
  const toastN = React.useRef(0);
  const GOAL = 600;

  React.useEffect(() => {
    if (!game) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [game]);

  React.useEffect(() => {
    if (secs >= GOAL && !rewarded) {
      setRewarded(true); setShowReward(true); cue(CUES.reward);
      const l = store.get("urgeLog", []);
      store.set("urgeLog", [...l, { t: nextT(), kind: "win" }]);
    }
  }, [secs, rewarded]);

  // minute-by-minute encouragement while playing
  React.useEffect(() => {
    if (!game) return;
    const f = (e) => { if (e.key === "Escape") setGame(null); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [game]);

  React.useEffect(() => {
    if (!game || secs === 0 || secs % 60 !== 0 || secs >= GOAL) return;
    const why = store.get("why", null);
    const msgs = why?.text ? [...ENCOURAGE, `Don't forget your why: "${why.text}"`] : ENCOURAGE;
    setToast(msgs[toastN.current % msgs.length]);
    toastN.current++;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [secs, game]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = Math.min(100, (secs / GOAL) * 100);

  return (
    <div className="page">
      <h2 className="page-h">Beat the pressure</h2>
      <p className="page-sub">
        Most cravings peak and fade within <b>10 to 20 minutes</b>. You don't have to
        win an argument with the urge, you just have to outlast it. Play for <b>10 minutes</b> to
        ride it out, then do a <b>5-minute workout</b> to burn off the rest. Fifteen minutes and the cycle is broken.
      </p>

      <div className="urgebar-wrap">
        <div className="urgebar-head">
          <span className="urgeclock"><Gamepad2 size={15} /> URGE TIMER {mm}:{ss}</span>
          <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <SoundToggle />
            <span className="urgegoal">{rewarded ? "🏆 10:00 beaten" : "goal 10:00"}</span>
          </span>
          {rewarded && (
            <button className="subpill" onClick={() => setWorkout(true)}>
              <Activity size={13} strokeWidth={2.4} /> 5-min workout
            </button>
          )}
        </div>
        <div className="urgetrack"><div className="urgefill" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="gamepicker">
        {GAMES.map(([id, name, tag, em]) => (
          <button key={id} className={`gamecard ${game === id ? "on" : ""}`} onClick={() => { ensureAudio(); setGame(id); }}>
            <span className="gameem">{em}</span>
            <span className="gamename">{name}</span>
            <span className="gametag">{tag}</span>
          </button>
        ))}
      </div>

      <p className="gamehint center">Tap a game and it opens right here. Keyboard arrows or the on-screen pad both work inside.</p>

      {game && (
        <div className="gameveil">
          <div className="gamemodal">
            <div className="gamemodalhead">
              <span className="modaltitle">{(GAMES.find((x) => x[0] === game) || [])[1]}</span>
              <span className="modalurge">URGE {mm}:{ss}</span>
              <button className="gameclose" onClick={() => setGame(null)} aria-label="Close game"><X size={17} /></button>
            </div>
            {game === "foundation" && <FoundationGame />}
            {game === "roadhome" && <RoadHomeGame />}
            {game === "cleansweep" && <CleanSweepGame />}
            {game === "snake" && <SnakeGame />}
            {game === "breaker" && <BreakerGame />}
            {game === "steady" && <MemoryGame />}
          </div>
        </div>
      )}

      {rewarded && !showReward && (
        <button className="btn ghost" style={{ marginTop: 18 }} onClick={() => setShowReward(true)}>
          <Trophy size={16} /> See your win again
        </button>
      )}

      {showReward && (
        <div className="rewardveil" onClick={() => setShowReward(false)}>
          <div className="rewardcard" onClick={(e) => e.stopPropagation()}>
            <div className="rewardpix">★ YOU DID IT ★</div>
            <h3>Ten minutes. You outlasted it.</h3>
            <p>
              That wasn't just a game. You rode out the window where most cravings break. That's a
              real skill, and you just practiced it. Stack enough ten-minute wins and they turn into days.
            </p>
            <WhyCard small />
            <h4 className="gearhead">Gear up for the next one</h4>
            <div className="gearlist">
              {GEAR_TIPS.map(([t, d]) => (
                <div key={t} className="gearitem">
                  <CheckCircle2 size={15} />
                  <div><b>{t}.</b> {d}</div>
                </div>
              ))}
            </div>
            <p className="rewardfoot">
              Still feeling it? That's okay. Call <a href="tel:988">988</a> or SAMHSA at{" "}
              <a href="tel:18006624357">1-800-662-4357</a>, free and confidential, any hour.
            </p>
            <button className="btn primary" onClick={() => { setShowReward(false); setWorkout(true); }}>
              Next: the 5-minute workout <ArrowRight size={16} />
            </button>
            <button className="rewardskip" onClick={() => setShowReward(false)}>Skip this and go back to the arcade</button>
          </div>
        </div>
      )}

      {workout && <WorkoutFlow onClose={() => setWorkout(false)} />}

      {toast && (
        <div className="encourage-toast" onClick={() => setToast(null)}>
          <Sparkles size={15} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ================= MY TOOLKIT + PANIC SUPPORT ================= */

function WhyCard({ small }) {
  const why = store.get("why", null);
  if (!why || (!why.text && !why.img)) return null;
  return (
    <div className={`whycard ${small ? "smallw" : ""}`}>
      {why.img && <img src={why.img} alt="" />}
      <div>
        <span className="whylabel">Your why</span>
        <p>{why.text || "—"}</p>
      </div>
    </div>
  );
}

function MilestoneChips({ days }) {
  const next = MILESTONES.find(([d]) => days == null || days < d);
  return (
    <div>
      <div className="chiprow">
        {MILESTONES.map(([d, label]) => (
          <span key={d} className={`sobchip ${days != null && days >= d ? "earned" : ""}`}>
            <Award size={13} /> {label}
          </span>
        ))}
      </div>
      {days != null && next && (
        <p className="tksub" style={{ marginTop: 10 }}>
          Next chip: <b>{next[1]}</b>, {next[0] - days} day{next[0] - days === 1 ? "" : "s"} away. Keep stacking.
        </p>
      )}
    </div>
  );
}

function UrgeChart({ entries }) {
  const urges = entries.filter((e) => e.kind === "urge" && e.intensity != null);
  if (urges.length < 2)
    return <p className="tksub">Log a couple of urges and a trend chart appears here. Most people get to watch them shrink.</p>;
  const last = urges.slice(-14);
  const W = 300, H = 86, bw = W / last.length;
  let insight = null;
  if (urges.length >= 6) {
    const half = Math.floor(urges.length / 2);
    const avg = (a) => a.reduce((s, e) => s + e.intensity, 0) / a.length;
    const early = avg(urges.slice(0, half)), late = avg(urges.slice(half));
    insight = late <= early
      ? `Your recent urges average ${late.toFixed(1)}/10, down from ${early.toFixed(1)} before. They're losing strength.`
      : `Recent urges average ${late.toFixed(1)}/10, up from ${early.toFixed(1)}. Rough stretch. Lean harder on your tools and your people.`;
  }
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="urgechart" role="img" aria-label="Urge intensity over time">
        {last.map((e, i) => {
          const h = Math.max(4, (e.intensity / 10) * (H - 10));
          return (
            <rect key={e.t} x={i * bw + 3} y={H - h} width={Math.max(4, bw - 6)} height={h} rx="3"
              fill={e.intensity >= 7 ? "#B85539" : e.intensity >= 4 ? "#C9881F" : "#3C7A66"} />
          );
        })}
      </svg>
      {insight && <p className="tksub" style={{ marginTop: 8 }}>{insight}</p>}
    </div>
  );
}

function Toolkit({ onWipe }) {
  const norm = (c) => Array.from({ length: 3 }, (_, i) => (c && c[i]) || { name: "", phone: "" });
  const [soberDate, setSoberDate] = useState(store.get("soberDate", ""));
  const [why, setWhyState] = useState(store.get("why", { text: "", img: null }));
  const [contacts, setContacts] = useState(norm(store.get("contacts", [])));
  const [log, setLog] = useState(store.get("urgeLog", []));
  const [diary, setDiary] = useState(store.get("diary", []));
  const [draft, setDraft] = useState("");
  const [checkins, setCheckins] = useState(store.get("checkins", []));
  const [spend, setSpend] = useState(store.get("spendPerDay", ""));
  const [showReport, setShowReport] = useState(false);
  const [armDelete, setArmDelete] = useState(false);
  const [intensity, setIntensity] = useState(6);
  const [note, setNote] = useState("");
  const days = soberDays(soberDate);

  const todayKey = new Date().toISOString().slice(0, 10);
  const today = checkins.find((c) => c.d === todayKey) || { d: todayKey, mood: null, halt: [] };
  const upsertToday = (patch) => {
    const next = [...checkins.filter((c) => c.d !== todayKey), { ...today, ...patch }];
    setCheckins(next); store.set("checkins", next);
  };
  const streak = (() => {
    const set = new Set(checkins.map((c) => c.d));
    let n = 0; const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  })();
  const HALT = ["Hungry", "Angry", "Lonely", "Tired"];
  const HALT_TIPS = {
    Hungry: "Eat something real. Low blood sugar likes to dress up as a craving.",
    Angry: "Anger burns clean with movement or a vent to a friend, not with using.",
    Lonely: "Lonely is a cue: call, text, or hit an online meeting tonight.",
    Tired: "Tired lowers every defense. Protect sleep like it's part of the program, because it is.",
  };

  const saved = days != null && Number(spend) > 0 ? Math.round(days * Number(spend)) : null;

  const saveSpend = (v) => { setSpend(v); store.set("spendPerDay", v); };
  const wipeAll = () => {
    store.clear();
    setSoberDate(""); setWhyState({ text: "", img: null }); setContacts(norm([]));
    setLog([]); setDiary([]); setCheckins([]); setSpend(""); setArmDelete(false);
    onWipe?.();
  };

  const addDiary = () => {
    if (!draft.trim()) return;
    const d = [...diary, { t: nextT(), text: draft.trim() }];
    setDiary(d); store.set("diary", d); setDraft("");
  };
  const delDiary = (t) => { const d = diary.filter((e) => e.t !== t); setDiary(d); store.set("diary", d); };

  const exportData = () => {
    try {
      const data = {
        app: "Second Chance", exported: new Date().toISOString(),
        soberDate, daysClean: days, why, contacts, urgeLog: log, diary,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "second-chance-my-data.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {}
  };

  const saveSober = (v) => { setSoberDate(v); store.set("soberDate", v); };
  const saveWhy = (patch) => { const w = { ...why, ...patch }; setWhyState(w); store.set("why", w); };
  const saveContact = (i, field, v) => {
    const c = contacts.map((x, j) => (j === i ? { ...x, [field]: v } : x));
    setContacts(c); store.set("contacts", c);
  };
  const addUrge = () => {
    const l = [...log, { t: nextT(), kind: "urge", intensity, note: note.trim() }];
    setLog(l); store.set("urgeLog", l); setNote("");
  };
  const delEntry = (t) => { const l = log.filter((e) => e.t !== t); setLog(l); store.set("urgeLog", l); };

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Up late, or up early" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 5 ? "🌙" : hour < 17 ? "☀️" : "🌇";
  const WARM = [
    "Glad you're here.",
    "Showing up counts, and you just did.",
    "One day at a time adds up fast.",
    "Small steps, steady road.",
    "Today gets a fresh page.",
    "You're doing the work. It shows.",
    "Easy does it. You've got this.",
  ];
  const warm = WARM[new Date().getDate() % WARM.length];

  return (
    <div className="page">
      <h2 className="page-h">{greet} {greetEmoji}</h2>
      <p className="page-sub">
        {warm} This is your private corner. Your clock, your why, your people, your progress.
      </p>

      <div className="privacybar">
        <ShieldCheck size={16} />
        <span>
          <b>Everything here stays on this device.</b> No account, no cloud, no tracking. Nothing you
          enter ever leaves your phone.
          {!store.persistent && " (Heads up: this preview environment can't save between sessions; the published app stores it on-device.)"}
        </span>
        <button className="btn ghost sm exportbtn" onClick={exportData}>
          <FileText size={14} /> Export my data
        </button>
      </div>

      <div className="tkcard">
        <h4><Award size={17} /> Sobriety clock</h4>
        <p className="tksub">Set your clean date and the app keeps count and hands you your chips.</p>
        <input
          type="date" className="tkinput" style={{ maxWidth: 220 }} aria-label="Sobriety date"
          value={soberDate} max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => saveSober(e.target.value)}
        />
        <p className="tksub" style={{ marginTop: 10 }}>
          <b>If you've slipped:</b> resetting your date is a brave act, not a defeat. The days you
          stacked before still count for everything they taught you.
        </p>
        {days != null && (
          <div style={{ margin: "6px 0 14px" }}>
            <span className="daysbig">{days.toLocaleString()}</span>
            <span className="dayssub"> day{days === 1 ? "" : "s"} clean. Every one of them earned</span>
          </div>
        )}
        <MilestoneChips days={days} />
      </div>

      <div className="tkcard">
        <h4><HandCoins size={17} /> Money back in your pocket</h4>
        <p className="tksub">
          Roughly what did the habit cost per day? Count the drinks, the product, the cover charges, the rides.
          Then watch what staying clean is paying you back.
        </p>
        <div className="tkrow" style={{ alignItems: "center" }}>
          <span style={{ fontWeight: 700 }}>$</span>
          <input className="tkinput" style={{ maxWidth: 120 }} inputMode="decimal" placeholder="per day" aria-label="Daily cost of the habit in dollars"
            value={spend} onChange={(e) => saveSpend(e.target.value.replace(/[^0-9.]/g, ""))} />
          <span className="tksub" style={{ margin: 0 }}>per day</span>
        </div>
        {saved != null && (
          <div style={{ marginTop: 12 }}>
            <span className="savedbig">${saved.toLocaleString()}</span>
            <span className="dayssub"> saved so far, about ${Math.round(Number(spend) * 30).toLocaleString()}/month back in your pocket</span>
          </div>
        )}
        {saved == null && Number(spend) > 0 && (
          <p className="tksub" style={{ marginTop: 10 }}>Set your sobriety date above and the savings counter starts.</p>
        )}
      </div>

      <div className="tkcard">
        <h4><CheckCircle2 size={17} /> Daily check-in</h4>
        <p className="tksub">
          Thirty seconds, once a day. Mood plus a HALT scan, the four states cravings ride in on.
          {streak >= 2 && <b>{" "}🔥 {streak}-day check-in streak.</b>}
        </p>
        <label className="tksub" style={{ marginBottom: 6, display: "block" }}>How's today?</label>
        <div className="moodrow" role="group" aria-label="How's today?">
          {["😞", "😕", "😐", "🙂", "😄"].map((em, i) => (
            <button key={em} className={`moodbtn ${today.mood === i + 1 ? "on" : ""}`}
              aria-label={["Rough", "Not great", "Okay", "Good", "Great"][i]}
              aria-pressed={today.mood === i + 1}
              onClick={() => upsertToday({ mood: i + 1 })}>{em}</button>
          ))}
        </div>
        <label className="tksub" style={{ margin: "14px 0 0", display: "block" }}>Any of these true right now?</label>
        <div className="haltrow">
          {HALT.map((h) => (
            <button key={h} className={`haltchip ${today.halt?.includes(h) ? "on" : ""}`}
              onClick={() => upsertToday({ halt: today.halt?.includes(h) ? today.halt.filter((x) => x !== h) : [...(today.halt || []), h] })}>
              {h}
            </button>
          ))}
        </div>
        {(today.halt || []).map((h) => (
          <p key={h} className="tksub" style={{ margin: "10px 0 0" }}><b>{h}:</b> {HALT_TIPS[h]}</p>
        ))}
      </div>

      <div className="tkcard">
        <h4><HeartHandshake size={17} /> My why</h4>
        <p className="tksub">
          A sentence and a photo that matter to you. It shows up mid-craving, when generic
          encouragement isn't enough but your own reason is.
        </p>
        <textarea
          className="tkinput" placeholder={'e.g. "My daughter\'s graduation, June 2028. I\'ll be there clear-eyed."'}
          value={why.text || ""} onChange={(e) => saveWhy({ text: e.target.value })}
        />
        <div className="tkrow" style={{ marginTop: 10, alignItems: "center" }}>
          <label className="btn ghost sm" style={{ cursor: "pointer" }}>
            {why.img ? "Change photo" : "Add a photo"}
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) shrinkImage(f, (d) => saveWhy({ img: d })); }} />
          </label>
          {why.img && <button className="rewardskip" style={{ width: "auto", margin: 0 }} onClick={() => saveWhy({ img: null })}>Remove photo</button>}
        </div>
        <WhyCard />
      </div>

      <div className="tkcard">
        <h4><Phone size={17} /> My people</h4>
        <p className="tksub">
          Add up to three numbers. Sponsor, sober friend, family. They'll appear one tap away whenever you
          hit the Struggling button, right beside 988 and SAMHSA.
        </p>
        {contacts.map((c, i) => (
          <div className="tkrow" key={i}>
            <input className="tkinput" placeholder={["Sponsor's name", "Friend's name", "Family member"][i]}
              value={c.name} onChange={(e) => saveContact(i, "name", e.target.value)} />
            <input className="tkinput" placeholder="Phone" inputMode="tel"
              value={c.phone} onChange={(e) => saveContact(i, "phone", e.target.value)} />
          </div>
        ))}
      </div>

      <div className="tkcard">
        <h4><Activity size={17} /> Urge log</h4>
        <p className="tksub">
          Logging an urge sounds small, but it's one of the most evidence-backed tools in recovery:
          rating it makes it measurable, and measurable things shrink.
        </p>
        <label className="tksub">Intensity right now: <b>{intensity}/10</b></label>
        <input type="range" min="1" max="10" value={intensity} className="slider" aria-label="Urge intensity from 1 to 10"
          onChange={(e) => setIntensity(+e.target.value)} />
        <div className="tkrow" style={{ marginTop: 8 }}>
          <input className="tkinput" placeholder="Trigger? Optional, like 'payday' or 'old friend texted'"
            value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn primary sm" style={{ flex: "none" }} onClick={addUrge}>Log it</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <UrgeChart entries={log} />
        </div>
        {log.length > 0 && (
          <div className="loglist">
            {[...log].reverse().slice(0, 30).map((e) => (
              <div className="logitem" key={e.t}>
                <span>
                  {e.kind === "win"
                    ? <><b>🏆 Rode out 10 minutes</b> in the arcade</>
                    : <><b>{e.intensity}/10</b>{e.note ? `, ${e.note}` : ""}</>}
                </span>
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <span>{new Date(e.t).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <button className="logdel" onClick={() => delEntry(e.t)} title="Delete"><Trash2 size={13} /></button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tkcard">
        <h4><BookOpen size={17} /> Notes & diary</h4>
        <p className="tksub">
          A private place to put the day down. Wins, rough patches, things you want to remember, things
          you want to tell your sponsor. Writing it out is its own kind of meeting.
        </p>
        <textarea
          className="tkinput" placeholder="What's on your mind today?"
          value={draft} onChange={(e) => setDraft(e.target.value)}
        />
        <div className="tkrow" style={{ marginTop: 10 }}>
          <button className="btn primary sm" onClick={addDiary} disabled={!draft.trim()}>Save entry</button>
        </div>
        {diary.length > 0 && (
          <div className="diarylist">
            {[...diary].reverse().map((e) => (
              <div className="diaryitem" key={e.t}>
                <div className="diaryhead">
                  <span>{new Date(e.t).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                  <button className="logdel" onClick={() => delDiary(e.t)} title="Delete"><Trash2 size={13} /></button>
                </div>
                <p>{e.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tkcard">
        <h4><ShieldCheck size={17} /> Your data, your call</h4>
        <p className="tksub">
          Export it, print a progress report to hand a counselor or PO, or erase every trace. It's
          yours either way. One heads-up: the export file contains your private entries, so store it
          somewhere safe.
        </p>
        <div className="datarow">
          <button className="btn ghost sm" onClick={exportData}><FileText size={14} /> Export JSON</button>
          <button className="btn ghost sm" onClick={() => setShowReport(true)}><FileText size={14} /> Print progress report</button>
          <button className={`btn sm dangerbtn ${armDelete ? "armed" : ""}`}
            onClick={() => (armDelete ? wipeAll() : setArmDelete(true))}
            onBlur={() => setArmDelete(false)}>
            <Trash2 size={14} /> {armDelete ? "Tap again to erase everything" : "Delete all my data"}
          </button>
        </div>
      </div>

      {showReport && (() => {
        const urges = log.filter((e) => e.kind === "urge" && e.intensity != null);
        const wins = log.filter((e) => e.kind === "win").length;
        let trend = null;
        if (urges.length >= 6) {
          const half = Math.floor(urges.length / 2);
          const avg = (a) => a.reduce((s, e) => s + e.intensity, 0) / a.length;
          trend = { early: avg(urges.slice(0, half)).toFixed(1), late: avg(urges.slice(half)).toFixed(1) };
        }
        const earned = MILESTONES.filter(([d]) => days != null && days >= d).map(([, l]) => l);
        return (
          <div className="reportveil">
            <div className="reportsheet printable">
              <h1>Second Chance Progress Report</h1>
              <p className="repmeta">Generated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · All data self-reported and stored only on the user's device.</p>
              <h2>Sobriety</h2>
              <p>{soberDate
                ? <>Clean date: <b>{new Date(soberDate + "T00:00:00").toLocaleDateString()}</b>. <b>{days?.toLocaleString()} days</b> clean. Milestones earned: {earned.length ? earned.join(", ") : "working toward the first chip"}.</>
                : "No sobriety date set."}</p>
              {saved != null && <p>Estimated money saved (self-reported ${spend}/day habit): <b>${saved.toLocaleString()}</b>.</p>}
              <h2>Urge management</h2>
              <p>
                Urges logged: <b>{urges.length}</b>. Ten-minute craving wins (urge ridden out via the in-app distraction protocol): <b>{wins}</b>.
                {trend && <> Average intensity moved from <b>{trend.early}/10</b> (earlier entries) to <b>{trend.late}/10</b> (recent entries).</>}
              </p>
              {streak >= 2 && <p>Current daily check-in streak: <b>{streak} days</b>.</p>}
              {urges.length > 0 && (
                <>
                  <h2>Urge log (most recent {Math.min(30, urges.length)})</h2>
                  <table className="reporttable">
                    <thead><tr><th>Date</th><th>Intensity</th><th>Trigger / note</th></tr></thead>
                    <tbody>
                      {[...urges].reverse().slice(0, 30).map((e) => (
                        <tr key={e.t}>
                          <td>{new Date(e.t).toLocaleDateString()}</td>
                          <td>{e.intensity}/10</td>
                          <td>{e.note || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <p className="repfoot">Generated by Second Chance. This report is self-reported personal data, not a clinical assessment.</p>
            </div>
            <div className="reportbar noprint">
              <button className="btn primary sm" onClick={() => window.print()}>Print / Save PDF</button>
              <button className="btn ghost sm" onClick={() => setShowReport(false)}>Close</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ---- panic button: 60s guided breathing, then options ---- */
function PanicOverlay({ onClose, goPlay, goWorkout }) {
  const TOTAL = 64;
  const PH = ["Breathe in", "Hold", "Breathe out", "Hold"];
  const [stage, setStage] = useState("breathe");
  const [left, setLeft] = useState(TOTAL);
  const [intensity, setIntensity] = useState(6);
  const [logged, setLogged] = useState(false);
  const phase = Math.floor((TOTAL - left) / 4) % 4;

  useLoop(() => setLeft((l) => { if (l <= 1) { setStage("choose"); return 0; } return l - 1; }), 1000, stage === "breathe");
  React.useEffect(() => { if (stage === "breathe") cue([["E4", "8n", 0.2]]); }, [phase, stage]);

  const contacts = (store.get("contacts", []) || []).filter(
    (c) => c && c.name && c.phone && c.phone.replace(/\D/g, "").length >= 7
  );
  const meets = fellowshipsFor(store.get("focus", null));
  const logIt = () => {
    const l = store.get("urgeLog", []);
    store.set("urgeLog", [...l, { t: nextT(), kind: "urge", intensity, note: "struggling button" }]);
    setLogged(true);
  };

  return (
    <div className="calmveil">
      <div className="calmcard">
        {stage === "breathe" ? (
          <>
            <span className="calmeyebrow"><HeartHandshake size={13} /> A minute for you</span>
            <h3 className="calmh">Okay. Let's slow everything down.</h3>
            <p className="calmsub">One minute of breathing. That's all this is.</p>
            <div className="breathstage">
              <div className={`breathcircle ${phase < 2 ? "bigc" : "smallc"}`}>
                <span className="breathlabel">{PH[phase]}</span>
              </div>
            </div>
            <p className="breathmeta">{left} seconds · just follow the circle</p>
            <WhyCard small />
            <button className="calmskip" onClick={() => setStage("choose")}>Skip ahead</button>
          </>
        ) : (
          <>
            <span className="calmeyebrow"><CheckCircle2 size={13} /> One minute down</span>
            <h3 className="calmh">Good. The wave is already losing steam.</h3>
            <p className="calmsub">Pick whatever helps most right now.</p>
            <div className="calmopts">
              <button className="calmopt" onClick={goPlay}><span className="calmoptem">🎮</span><span>Distract me<small>Ten minutes in the arcade</small></span><ChevronRight size={16} /></button>
              <button className="calmopt" onClick={goWorkout}><span className="calmoptem">💪</span><span>Burn it off<small>A five minute workout</small></span><ChevronRight size={16} /></button>
              <button className="calmopt" onClick={() => { setLeft(TOTAL); setStage("breathe"); }}><span className="calmoptem">🌬️</span><span>Keep breathing<small>One more quiet minute</small></span><ChevronRight size={16} /></button>
              {meets.map((f) => (
                <a className="calmopt" key={f.short} href={f.find} target="_blank" rel="noopener noreferrer">
                  <span className="calmoptem">🧭</span><span>Find a meeting<small>{f.short} meetings near you, many tonight</small></span><ChevronRight size={16} />
                </a>
              ))}
            </div>
            {contacts.length > 0 && (
              <div className="calmcontacts">
                {contacts.map((c) => (
                  <a key={c.phone} className="callbtn" href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`}>
                    <Phone size={13} /> Call {c.name}
                  </a>
                ))}
              </div>
            )}
            <p className="calmfoot">
              Or talk to someone now. <a href="tel:988">988</a> and SAMHSA at{" "}
              <a href="tel:18006624357">1-800-662-4357</a> are free, confidential, and there any hour.
            </p>
            <div className="calmlog">
              <label className="tksub">How strong is it right now? <b>{intensity}/10</b></label>
              <input type="range" min="1" max="10" value={intensity} className="slider" aria-label="Urge intensity from 1 to 10"
                onChange={(e) => setIntensity(+e.target.value)} />
              {logged
                ? <span className="loggedok"><CheckCircle2 size={14} /> Logged. Watch it shrink over time in My Toolkit</span>
                : <button className="btn ghost sm" onClick={logIt}>Log this urge</button>}
            </div>
            <button className="calmskip" onClick={onClose}>I'm okay now</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= FIND A NEW HOBBY ================= */
const INTERESTS = [
  ["hands", "Working with my hands", "🔧"],
  ["outdoors", "Being outdoors", "🌲"],
  ["move", "Moving my body", "🏃"],
  ["create", "Art, music & making things", "🎨"],
  ["calm", "Quiet & calming", "🧘"],
  ["social", "Meeting people", "👥"],
  ["food", "Cooking & food", "🍳"],
  ["nature", "Animals & nature", "🐦"],
  ["brain", "Puzzles & learning", "🧠"],
  ["treasure", "Collecting & treasure hunting", "🔍"],
];

// cost: 1 = free or nearly, 2 = modest startup, 3 = bigger buy-in
const HOBBIES = [
  ["Walking & hiking", "🥾", ["outdoors", "move", "calm"], 1, "Pick one nearby trail or loop and walk it three times this week.", "Same time of day, shoes by the door. Streaks beat distance."],
  ["Journaling", "📓", ["calm", "create", "brain"], 1, "Any notebook works. One honest page before bed.", "Don't reread for the first month. Just keep showing up to the page."],
  ["Running", "👟", ["move", "outdoors"], 1, "Run one minute, walk two, repeat. A couch-to-5K app paces it for you.", "Sign up for a 5K six weeks out. A date on the calendar does the rest."],
  ["Drawing & sketching", "✏️", ["create", "calm"], 1, "Pencil, printer paper, and one ten minute tutorial a day.", "Draw the same coffee mug every Sunday and watch yourself get better."],
  ["Library reading", "📚", ["calm", "brain"], 1, "A library card is free. Ask the librarian for one recommendation.", "Always have the next book picked before you finish the current one."],
  ["Meditation & breathwork", "🧘", ["calm"], 1, "You already do a minute of it in this app. Stretch it to five.", "Anchor it to coffee. After the first cup, five quiet minutes."],
  ["Bodyweight fitness", "💪", ["move"], 1, "Push-ups, squats, planks. Three rounds in the living room, no gear.", "Log every session in your diary here. The unbroken chain is the motivator."],
  ["Volunteering", "🤝", ["social"], 1, "Food banks and animal shelters always need hands. One shift, no commitment.", "Pick a recurring slot. Being expected somewhere is the hook."],
  ["Birdwatching", "🐦", ["nature", "outdoors", "calm"], 1, "The free Merlin app plus your backyard. Identify five birds this week.", "Keep a life list. Every new bird is a small win you can count."],
  ["Fossil & shark tooth hunting", "🦈", ["treasure", "outdoors", "nature"], 1, "Creek beds and beaches after a storm. A kitchen strainer makes a fine sieve.", "Learn one species at a time. Identifying your finds is half the fun."],
  ["Chess", "♟️", ["brain", "social"], 1, "Free apps and park tables. Learn three openings and do daily puzzles.", "Join a club night. Losing to better players is the fast lane to good."],
  ["Phone photography", "📷", ["create", "outdoors"], 1, "The camera you already have is enough. One subject a week: doors, dogs, sunsets.", "Pick a weekly favorite and save it somewhere, even just for yourself."],
  ["Cooking", "🍳", ["food", "create", "hands"], 2, "Master three cheap dinners you actually like before branching out.", "Cook one dish until it's yours, then trade recipes with somebody."],
  ["Gardening", "🌱", ["outdoors", "hands", "nature", "calm"], 2, "Start with three pots: a tomato, an herb, a flower.", "Water at the same time daily. Plants keep you honest."],
  ["Disc golf", "🥏", ["outdoors", "move", "social"], 2, "Most courses are free and a starter disc runs about ten bucks.", "Play the same course weekly and chase your own best score."],
  ["Guitar", "🎸", ["create", "hands"], 2, "A used guitar and free video lessons. Two chords the first week.", "Ten minutes daily beats an hour on Sunday. Leave it out of the case."],
  ["Fishing", "🎣", ["outdoors", "calm", "nature"], 2, "A basic rod combo and a license. Ask the bait shop where to start.", "Go at dawn. The quiet is the point, even when they're not biting."],
  ["Board game nights", "🎲", ["social", "brain"], 2, "Game stores host free open nights. Show up and they'll teach you.", "Become the person who brings snacks. Instant regular."],
  ["Home coffee brewing", "☕", ["food", "calm", "hands"], 2, "A pour-over cone costs about fifteen bucks and beats the gas station.", "Change one variable a week. It's chemistry you get to drink."],
  ["Woodworking", "🪵", ["hands", "create"], 3, "Start with hand tools and a cutting board kit before any machines.", "Build gifts. A deadline with someone's name on it finishes projects."],
  ["Climbing gym", "🧗", ["move", "social"], 3, "A day pass plus rental shoes. The bouldering wall needs no partner.", "Go the same night every week. Same-night regulars become your crew."],
];

const COST_LABEL = { 1: "Free or nearly", 2: "Modest startup", 3: "Bigger buy-in" };
const COST_SIGN = { 1: "$", 2: "$$", 3: "$$$" };

function HobbyFinder() {
  const [sel, setSel] = useState(() => store.get("hobbyInterests", []));
  const toggle = (id) => {
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    setSel(next); store.set("hobbyInterests", next);
  };
  const matches = HOBBIES
    .filter(([, , tags]) => tags.some((t) => sel.includes(t)))
    .sort((a, b) => a[3] - b[3] || a[0].localeCompare(b[0]));

  return (
    <div className="page">
      <h2 className="page-h">Find a new hobby</h2>
      <p className="page-sub">
        The hours the habit used to fill don't fill themselves. A hobby is one of the oldest
        relapse-prevention tools there is, and the best one is whichever one you'll actually do.
        Check what sounds like you, and we'll match you up, cheapest first.
      </p>

      <div className="tkcard">
        <h4><Palette size={17} /> What sounds like you?</h4>
        <div className="intgrid">
          {INTERESTS.map(([id, label, em]) => (
            <button key={id} className={`intchip ${sel.includes(id) ? "on" : ""}`} onClick={() => toggle(id)}>
              <span>{em}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {sel.length === 0 && (
        <p className="gamehint center">Check a few boxes above and your matches show up here.</p>
      )}

      {matches.length > 0 && (
        <div className="hobbygrid">
          {matches.map(([name, em, tags, cost, start, groove]) => (
            <div key={name} className="hobbycard">
              <div className="hobbyhead">
                <span className="hobbyem">{em}</span>
                <div className="hobbyname">
                  <h4>{name}</h4>
                  <span className="costbadge" data-tier={cost}>{COST_SIGN[cost]} · {COST_LABEL[cost]}</span>
                </div>
              </div>
              <div className="hobbytip"><b>Getting started:</b> {start}</div>
              <div className="hobbytip"><b>Finding the groove:</b> {groove}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= FIRST-OPEN WELCOME + PERSONAL PLAN ================= */
const GOAL_OPTS = [
  ["clean", "Staying clean", "🌱"],
  ["record", "Clearing my record", "⚖️"],
  ["hobby", "Finding a new hobby", "🎨"],
  ["support", "Supporting someone else", "🤝"],
  ["looking", "Just looking around", "👀"],
];

function Welcome({ done, go }) {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState([]);
  const [date, setDate] = useState("");
  const [st, setSt] = useState("");
  const [focusPick, setFocusPick] = useState("");
  const wantsClean = goals.includes("clean");
  const wantsRecord = goals.includes("record");
  const wantsSupport = goals.includes("support");

  const toggle = (g) => setGoals((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  const save = () => {
    store.set("onboarded", true);
    store.set("goals", goals);
    if (date) store.set("soberDate", date);
    if (st) store.set("homeState", st);
    if (focusPick) store.set("focus", focusPick);
  };
  const finish = (dest) => { save(); done(); if (dest) go(dest); };

  const plan = [];
  if (wantsClean) {
    plan.push(["Set up your toolkit", "Your clean date, your why, your people. Two minutes, all private.", "toolkit"]);
    plan.push(["Learn the 15 minute craving plan", "Three games, a timer, and a workout. Built for the moment an urge hits.", "pressure"]);
  }
  if (wantsRecord) {
    plan.push([st ? `See the rules for your state` : "Look up your state's rules", "What can be cleared, how long the wait is, and what it costs.", "state"]);
    plan.push(["Check your case strength", "Six questions, an honest read on where you stand, and your next step.", "eligible"]);
  }
  if (wantsSupport) {
    plan.push(["Browse the recovery resources", "Meetings, helplines, and family support like Al-Anon and Nar-Anon.", "recovery"]);
  }
  if (goals.includes("hobby")) {
    plan.push(["Find a new hobby", "Check what you enjoy and get matched, sorted cheapest first.", "hobby"]);
  }
  if (plan.length === 0) {
    plan.push(["Start at the beginning", "The home page lays out the whole road. Wander from there.", "home"]);
  }

  const needsSetup = wantsClean || wantsRecord;
  const next = () => {
    if (step === 1 && !needsSetup) setStep(3);
    else setStep(step + 1);
  };

  return (
    <div className="rewardveil">
      <div className="rewardcard welcomecard">
        <div className="welcomedots">
          {[0, 1, 2, 3].map((i) => <span key={i} className={`wdot ${i <= step ? "on" : ""}`} />)}
        </div>

        {step === 0 && (
          <>
            <div style={{ display: "grid", placeItems: "center", marginBottom: 10 }}><DBMark size={78} full /></div>
            <h3>Welcome to Second Chance</h3>
            <p>
              This app does two jobs. It helps you stay clean, with games that outlast cravings, a
              panic button, guided breathing, and a private toolkit. And it helps you clear an old
              record, with plain answers for all 50 states, an honest eligibility check, and free
              legal help.
            </p>
            <p>
              Nothing you do here leaves your phone. No account, no tracking, nobody watching.
            </p>
            <button className="btn primary" onClick={next}>Get started <ArrowRight size={16} /></button>
            <button className="rewardskip" onClick={() => finish(null)}>Skip the tour</button>
          </>
        )}

        {step === 1 && (
          <>
            <h3>What brings you here?</h3>
            <p>Pick everything that fits. This just shapes your starting plan.</p>
            <div className="goalgrid">
              {GOAL_OPTS.map(([id, label, em]) => (
                <button key={id} className={`goalchip ${goals.includes(id) ? "on" : ""}`} onClick={() => toggle(id)}>
                  <span className="goalem">{em}</span>{label}
                </button>
              ))}
            </div>
            <button className="btn primary" disabled={goals.length === 0} onClick={next}>
              {goals.length === 0 ? "Pick at least one" : "Next"} <ArrowRight size={16} />
            </button>
            <button className="rewardskip" onClick={() => finish(null)}>Skip the tour</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Two quick things. Both optional.</h3>
            {wantsClean && (
              <div className="welcomefield">
                <label className="tksub">When did you get clean? The day counter and milestone chips start from here.</label>
                <input type="date" className="tkinput" style={{ maxWidth: 220 }}
                  max={new Date().toISOString().slice(0, 10)}
                  value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            )}
            {wantsClean && (
              <div className="welcomefield">
                <label className="tksub">What are you mostly working on? This points the right resources at you.</label>
                <div className="datarow">
                  {[["na", "Narcotics"], ["aa", "Alcohol"], ["both", "Both"]].map(([id, l]) => (
                    <button key={id} className={`focuschip ${focusPick === id ? "on" : ""}`}
                      onClick={() => setFocusPick(focusPick === id ? "" : id)}>{l}</button>
                  ))}
                </div>
              </div>
            )}
            {wantsRecord && (
              <div className="welcomefield">
                <label className="tksub">Which state is your record in?</label>
                <select className="tkinput" style={{ maxWidth: 260 }} value={st} onChange={(e) => setSt(e.target.value)}>
                  <option value="">Choose a state</option>
                  {STATES.map((x) => <option key={x.abbr} value={x.abbr}>{x.name}</option>)}
                </select>
              </div>
            )}
            <button className="btn primary" onClick={next}>Build my plan <ArrowRight size={16} /></button>
            <button className="rewardskip" onClick={() => setStep(3)}>Skip these</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Your starting plan</h3>
            <p>Based on what you told us, start here. Tap any step to jump straight in.</p>
            <div className="planlist">
              {plan.map(([title, desc, dest]) => (
                <button key={title} className="planitem" onClick={() => finish(dest)}>
                  <div>
                    <b>{title}</b>
                    <span>{desc}</span>
                  </div>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
            <div className="welcomecrisis">
              <LifeBuoy size={15} />
              <span>One more thing. If a bad moment hits, the red <b>Struggling?</b> button is on every screen. It walks you through a minute of breathing and puts help one tap away.</span>
            </div>
            <button className="btn primary" onClick={() => finish(null)}>Let's go</button>
          </>
        )}
      </div>
    </div>
  );
}

/* Scrollable pill row with an edge cue when content overflows */
function ScrollRow({ className, children }) {
  const ref = React.useRef(null);
  const [more, setMore] = useState(false);
  const check = () => {
    const el = ref.current;
    if (!el) return;
    setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
  };
  React.useEffect(() => {
    check();
    const t = setTimeout(check, 350); // re-measure after fonts settle
    const el = ref.current;
    el?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      clearTimeout(t);
      el?.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return (
    <div className={`scrollrowwrap ${more ? "more" : ""}`}>
      <div className={`subbar ${className || ""}`} ref={ref}>{children}</div>
      <button
        className="scrollcue" aria-label="Scroll for more" tabIndex={more ? 0 : -1}
        onClick={() => ref.current?.scrollBy({ left: 170, behavior: "smooth" })}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("toolkit");
  const [focus, setFocus] = useState(() => store.get("focus", null));
  const chooseFocus = (f, dest) => { setFocus(f); store.set("focus", f); setTab(dest); };
  const [stateQuery, setStateQuery] = useState("");
  const [picked, setPicked] = useState(() => STATES.find((s) => s.abbr === store.get("homeState", "")) || null);
  const [panic, setPanic] = useState(false);
  const [panicWorkout, setPanicWorkout] = useState(false);
  const [welcome, setWelcome] = useState(() => !store.get("onboarded", false));
  const [about, setAbout] = useState(false);
  const [legal, setLegal] = useState(null);
  const [consented, setConsented] = useState(() => store.get("consentV", 0) >= CONSENT_VERSION);
  const acceptTerms = () => {
    store.set("consentV", CONSENT_VERSION);
    store.set("consentAt", new Date().toISOString());
    setConsented(true);
  };

  return (
    <div className="wrap">
      <Style />
      <div className="grain" />
      <div className="headstack">
        <header className="topbar">
          <div className="brand" onClick={() => setTab("home")}>
            <DBMark size={48} />
            <div>
              <div className="brand-name">Second Chance</div>
              <div className="brand-sub">Your Fresh Start</div>
            </div>
          </div>
          <button className={`toolkitbtn ${tab === "toolkit" ? "on" : ""}`} onClick={() => setTab("toolkit")}>
            <Wrench size={16} strokeWidth={2.3} /> My Toolkit
          </button>
          <p className="navtagline">Criminal record? Can you clear your name?</p>
          <nav className="nav">
            {NAV.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`navbtn ${tab === id ? "on" : ""}`}
                onClick={() => setTab(id)}
              >
                <Icon size={15} strokeWidth={2.2} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </header>
        <div className="pillstick">
          <ScrollRow className="focusrow">
          <span className="sublabel">I'm working on:</span>
          <button className={`focuschip ${focus === "na" || focus === "both" ? "on" : ""}`} onClick={() => chooseFocus("na", "addicts")}>
            Narcotics Addiction
          </button>
          <button className={`focuschip ${focus === "aa" || focus === "both" ? "on" : ""}`} onClick={() => chooseFocus("aa", "alcoholics")}>
            Alcoholism
          </button>
          <button className={`focuschip ${focus === "both" ? "on" : ""}`} onClick={() => chooseFocus("both", "recovery")}>
            Both
          </button>
        </ScrollRow>
        <ScrollRow>
          <a className="crisispill" href="tel:988">
            <Phone size={12} strokeWidth={2.4} /> In crisis? Call or text 988
          </a>
          <div className="subpills">
            {SUBNAV.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`subpill ${tab === id ? "on" : ""}`}
                onClick={() => setTab(id)}
              >
                <Icon size={13} strokeWidth={2.4} />
                {label}
              </button>
            ))}
          </div>
        </ScrollRow>
        </div>
      </div>

      <main className="main">
        {tab === "home" && <Home go={setTab} tour={() => setWelcome(true)} />}
        {tab === "state" && (
          <StateGuide
            query={stateQuery}
            setQuery={setStateQuery}
            picked={picked}
            setPicked={setPicked}
          />
        )}
        {tab === "eligible" && <Eligibility go={setTab} />}
        {tab === "cost" && <CostEstimator />}
        {tab === "diy" && <DIY />}
        {tab === "help" && <GetHelp />}
        {tab === "recovery" && <ResourceSection which="recovery" />}
        {tab === "addicts" && <ResourceSection which="addicts" />}
        {tab === "alcoholics" && <ResourceSection which="alcoholics" />}
        {tab === "pressure" && <BeatThePressure />}
        {tab === "toolkit" && <Toolkit onWipe={() => { setTab("toolkit"); setFocus(null); setWelcome(true); setConsented(false); }} />}
        {tab === "hobby" && <HobbyFinder />}
      </main>

      {!panic && !panicWorkout && !welcome && (
        <button className="panicfab" onClick={() => { ensureAudio(); setPanic(true); }}>
          <LifeBuoy size={16} strokeWidth={2.3} /> <span className="fablabel">Struggling?</span>
        </button>
      )}
      {!consented && <ConsentGate onAccept={acceptTerms} openDoc={setLegal} />}
      {consented && welcome && <Welcome done={() => { setWelcome(false); setFocus(store.get("focus", null)); }} go={setTab} />}
      {legal && <LegalModal doc={legal} onClose={() => setLegal(null)} />}
      {panic && (
        <PanicOverlay
          onClose={() => setPanic(false)}
          goPlay={() => { setPanic(false); setTab("pressure"); }}
          goWorkout={() => { setPanic(false); setPanicWorkout(true); }}
        />
      )}
      {panicWorkout && <WorkoutFlow onClose={() => setPanicWorkout(false)} />}

      <div className="dbwatermark" aria-hidden="true"><DBMark size={42} /></div>

      <footer className="foot">
        <AlertTriangle size={14} strokeWidth={2.2} />
        <span>
          This tool is information, not legal advice, and it cannot guarantee any outcome.
          Laws change often and outcomes depend on your specific record and a judge's discretion.
          Always confirm with the official source for your state or a licensed attorney before acting.
          Your data stays on this device. No accounts, no tracking, ever.
          {" "}
          <button className="aboutlink" onClick={() => setAbout(true)}>About · v{APP_VERSION}</button>
          {" · "}
          <button className="aboutlink" onClick={() => setLegal("terms")}>Terms</button>
          {" · "}
          <button className="aboutlink" onClick={() => setLegal("privacy")}>Privacy</button>
        </span>
      </footer>

      {about && (
        <div className="calmveil" onClick={() => setAbout(false)}>
          <div className="rewardcard" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "grid", placeItems: "center", marginBottom: 4 }}><DBMark size={66} full /></div>
            <span className="calmeyebrow"><Sunrise size={13} /> Second Chance · v{APP_VERSION}</span>
            <h3 className="calmh">About this app</h3>
            <p className="calmsub">
              Second Chance helps people in recovery stay steady and helps people with a record
              understand how to clear it, state by state. It was built around one idea: your
              recovery and your record are nobody's business but yours.
            </p>
            <p className="dbcredit">A DB Recovery project</p>
            {store.get("consentAt", null) && (
              <p className="calmsub" style={{ fontSize: 12, marginTop: -4 }}>
                You agreed to the Terms & Privacy Policy on{" "}
                {new Date(store.get("consentAt", "")).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}.
              </p>
            )}
            <div className="aboutblock">
              <b>What's in this release</b>
              <ul className="aboutlist">
                <li>Relief guides for all 50 states and DC, with waiting periods and typical costs</li>
                <li>The 15-minute craving plan: six games, an urge timer, and a guided workout</li>
                <li>A private toolkit: sobriety clock, milestone chips, urge log, diary, and savings tracker</li>
                <li>One-tap crisis support and guided breathing on every screen</li>
                <li>A hobby finder, case-strength check, and printable progress report</li>
              </ul>
            </div>
            <div className="aboutblock">
              <b>Privacy</b>
              <p className="calmsub" style={{ textAlign: "left" }}>
                No account, no cloud, no analytics. Everything you enter is stored on this device
                only, and you can export or erase all of it from My Toolkit at any time.
              </p>
            </div>
            <div className="aboutblock">
              <b>Important</b>
              <p className="calmsub" style={{ textAlign: "left" }}>
                This app offers information and self-help tools, not legal advice, medical care, or
                treatment. State details reflect law current as of {DATA_ASOF}; always confirm with
                the linked official sources. If you're in crisis, call or text 988 any time.
              </p>
            </div>
            <div className="legallinks">
              <button onClick={() => { setAbout(false); setLegal("terms"); }}>Terms of Service</button>
              <button onClick={() => { setAbout(false); setLegal("privacy"); }}>Privacy Policy</button>
              <button onClick={() => { setAbout(false); setLegal("disclaimer"); }}>Disclaimer</button>
            </div>
            {FEEDBACK_EMAIL && (
              <a className="btn ghost sm" style={{ justifyContent: "center" }}
                href={`mailto:${FEEDBACK_EMAIL}?subject=Second%20Chance%20feedback%20(v${APP_VERSION})`}>
                Send feedback or report a problem
              </a>
            )}
            <button className="btn primary" onClick={() => setAbout(false)}>Close</button>
            <button className="rewardskip" onClick={() => { setAbout(false); setWelcome(true); }}>Replay the welcome tour</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- HOME ----------------------------- */
function Home({ go, tour }) {
  const days = soberDays(store.get("soberDate", ""));
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-glow" />
        <p className="eyebrow"><Sparkles size={14} /> You did the time. The record doesn't have to be a life sentence.</p>
        <h1 className="hero-h1">
          A fresh start is a <em>legal process</em>,<br />and you can navigate it.
        </h1>
        <p className="hero-lede">
          If you've served your sentence, met your terms, and rebuilt your life, you may be able to
          seal or expunge an old non-violent felony. This tool walks you through what's possible in
          your state, whether you qualify, what it costs, and how to find free or low-cost help.
        </p>
        {days != null && (
          <div className="herodays"><Award size={15} /> <b>&nbsp;{days.toLocaleString()} day{days === 1 ? "" : "s"}&nbsp;</b> clean and counting</div>
        )}
        <div className="hero-cta">
          <button className="btn primary" onClick={() => go("state")}>
            Find your state's rules <ArrowRight size={17} />
          </button>
          <button className="btn ghost" onClick={() => go("eligible")}>
            Check if you're eligible
          </button>
        </div>
      </section>

      <section className="honest">
        <div className="honest-head"><ShieldCheck size={18} /> Straight talk before you start</div>
        <div className="honest-grid">
          <div>
            <h4>No one can promise "for certain."</h4>
            <p>Clearing a record is never guaranteed. It depends on the offense, the state, waiting periods, and often a judge's discretion. Be wary of anyone who guarantees results for a fee.</p>
          </div>
          <div>
            <h4>The words matter.</h4>
            <p>States call it different things: <b>expungement</b>, <b>sealing</b>, <b>set-aside</b>, <b>certificate of relief</b>, or <b>pardon</b>. Each does something different. Your state page explains which exist where you are.</p>
          </div>
          <div>
            <h4>Many people qualify and don't know it.</h4>
            <p>An estimated 70+ million Americans have a record; a large share are eligible for relief they never pursue. A wave of recent "Clean Slate" laws has widened the door.</p>
          </div>
          <div>
            <h4>Free help is real.</h4>
            <p>Legal-aid offices, law-school clinics, and volunteer "expungement clinics" do this work at no cost for people who qualify. You don't have to figure it out alone.</p>
          </div>
        </div>
      </section>

      <section className="path">
        <h3 className="section-h">Four steps to a clean(er) slate</h3>
        <div className="steps">
          {[
            ["01", "Pull your record", "Order your official state criminal-history report so you know exactly what's there.", "diy"],
            ["02", "Check eligibility", "Confirm the offense type, waiting period, and that all terms are complete.", "eligible"],
            ["03", "File the petition", "Submit forms to the right court, or confirm automatic Clean Slate sealing.", "diy"],
            ["04", "Get help if stuck", "Free legal aid and clinics can review, draft, and file for qualifying people.", "help"],
          ].map(([n, t, d, dest]) => (
            <button key={n} className="stepcard" onClick={() => go(dest)}>
              <span className="stepnum">{n}</span>
              <h4>{t}</h4>
              <p>{d}</p>
              <span className="steplink">Open <ChevronRight size={14} /></span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-h">Your road</h3>
        <p className="page-sub" style={{ margin: "0 0 18px" }}>
          Get clean. Stay steady. Clear your record. Rebuild. Start wherever you are.
        </p>
        <div className="road">
          {ROAD.map(([dest, title, desc, Icon], i) => (
            <button key={dest} className="roadstop" onClick={() => go(dest)}>
              <span className="roadnum"><Icon size={13} /> STOP {i + 1}</span>
              <h4>{title}</h4>
              <p>{desc}</p>
            </button>
          ))}
        </div>
        <div className="privacybar" style={{ marginTop: 18 }}>
          <ShieldCheck size={16} />
          <span><b>Private by design.</b> No account, no sign-up, no tracking. Everything you enter stays on this device. Your recovery and your record are nobody's business but yours.</span>
        </div>
        <button className="tourlink" onClick={tour}>Replay the welcome tour</button>
      </section>
    </div>
  );
}

/* -------------------------- STATE GUIDE -------------------------- */
function StateGuide({ query, setQuery, picked, setPicked }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATES;
    return STATES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase() === q
    );
  }, [query]);

  return (
    <div className="page">
      <h2 className="page-h">Your state's rules</h2>
      <p className="page-sub">
        Pick your state for a plain-language overview, then open the official, regularly-updated
        profile for the exact statutes, fees, and forms. State details reflect law current as
        of {DATA_ASOF}. (Federal convictions work differently. See the note below.)
      </p>

      <div className="searchrow">
        <Search size={17} />
        <input
          className="search"
          placeholder="Search your state…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (picked) setPicked(null); }}
        />
      </div>

      {!picked && (
        <div className="stategrid">
          {filtered.map((s) => {
            const cs = cleanSlateLabel[s.cleanSlate];
            return (
              <button key={s.abbr} className="statebtn" onClick={() => setPicked(s)}>
                <span className="abbr">{s.abbr}</span>
                <span className="sname">{s.name}</span>
                <span className="dot" style={{ background: cs.c }} title={cs.t} />
              </button>
            );
          })}
          {filtered.length === 0 && <p className="empty">No match. Check spelling or use the 2-letter code.</p>}
        </div>
      )}

      {picked && <StateDetail s={picked} back={() => setPicked(null)} />}

      <div className="fedcard">
        <div className="fed-h"><Landmark size={16} /> Federal convictions</div>
        <p>
          There is <b>no general way to expunge or seal a federal conviction</b>. The main route is a
          <b> presidential pardon</b> (eligible to apply ~5 years after release), which relieves legal
          disabilities but does not erase the record. Narrow exceptions exist (e.g., 2026 vacatur for
          human-trafficking survivors). A federal defense attorney can advise on your specific case.
        </p>
      </div>
    </div>
  );
}

function StateDetail({ s, back }) {
  const cs = cleanSlateLabel[s.cleanSlate];
  const d = STATE_DATA[s.abbr];
  return (
    <div className="detail">
      <button className="backbtn" onClick={back}><RotateCcw size={14} /> All states</button>
      <div className="detail-head">
        <div className="detail-abbr">{s.abbr}</div>
        <div>
          <h3>{s.name}</h3>
          <Pill color={cs.c}>{cs.t}</Pill>
        </div>
      </div>

      <div className="detail-block">
        <h4><Info size={15} /> Clean Slate status</h4>
        <p>{cs.note}</p>
      </div>

      <div className="detail-block">
        <h4><Gavel size={15} /> Felony-conviction relief in {s.name}</h4>
        <p>{d ? d.f : s.felonyNote}</p>
      </div>

      {d && (
        <div className="detail-block">
          <div className="factrow">
            <div className="factcell">
              <span className="factlabel">Typical waiting period</span>
              <span className="factval">{d.w}</span>
            </div>
            <div className="factcell">
              <span className="factlabel">Typical out-of-pocket</span>
              <span className="factval">{d.c}</span>
            </div>
          </div>
        </div>
      )}

      <div className="detail-block">
        <h4><BookOpen size={15} /> Relief tools that commonly exist</h4>
        <p>
          Most states offer some mix of: <b>petition-based expungement or sealing</b>, a
          <b> set-aside / vacatur</b>, a <b>certificate of relief</b> (restores rights without erasing
          the record), and a <b>governor's pardon</b>. Which ones apply to a felony, and the waiting
          periods, vary by state, so confirm in the official profile.
        </p>
      </div>

      <div className="linkrow">
        <ExtLink href={CCRC_HUB}>Official {s.name} profile (CCRC) with statutes, eligibility & forms</ExtLink>
        <ExtLink href={NACDL_MAP}>Find {s.name} legal aid & expungement clinics</ExtLink>
        <ExtLink href={LAWHELP}>LawHelp.org, the free legal-aid finder</ExtLink>
      </div>
      <p className="verify-note">
        <AlertTriangle size={13} /> Details above reflect law current as of early 2026 and are a starting
        point, not legal advice. Statutes, waits, and fees change. The linked official profile is the
        authoritative, regularly-updated source; always confirm there before you act.
      </p>
    </div>
  );
}

/* ------------------------- ELIGIBILITY -------------------------- */
// Each option carries weighted points. Score = sum(personal) × state factor.
// This is a transparent planning heuristic — NOT an empirical success rate.
const QUESTIONS = [
  { id: "type", q: "What are you trying to clear?", help: "Non-conviction records are the easiest; violent and sexual offenses are excluded almost everywhere.", a: [
      ["Arrest only / dismissed / acquitted (no conviction)", "nonconv", 30],
      ["Misdemeanor conviction", "misd", 24],
      ["Non-violent felony conviction", "nvfelony", 18],
      ["Violent or sexual offense", "violent", 4],
    ] },
  { id: "done", q: "Have you completed ALL sentence terms?", help: "Incarceration, probation/parole, plus fines and restitution. Most states require this before you can petition.", a: [
      ["Yes, fully complete", "done", 18],
      ["Almost, I still owe fines/restitution", "owe", 9],
      ["No, still on probation/parole", "notdone", 2],
    ] },
  { id: "since", q: "How long since you completed everything?", help: "Longer conviction-free stretches clear waiting periods and signal rehabilitation.", a: [
      ["10+ years", "y10", 18],
      ["5–10 years", "y5", 13],
      ["1–5 years", "y1", 7],
      ["Less than a year", "y0", 3],
    ] },
  { id: "clean", q: "Any new convictions since then?", help: "A new conviction can restart the clock or disqualify the older record in many states.", a: [
      ["None, clean record since", "none", 18],
      ["One new conviction", "one", 7],
      ["Two or more", "multi", 1],
    ] },
  { id: "priors", q: "Counting this one, how much is on your record overall?", help: "Some states limit relief to a single offense or weigh your whole history.", a: [
      ["This is my only offense", "only", 10],
      ["A few offenses", "few", 5],
      ["Many offenses", "many", 1],
    ] },
  { id: "rehab", q: "Can you document rehabilitation?", help: "Steady work, a recovery program, education, and community ties carry real weight when a judge has discretion.", a: [
      ["Yes, strong evidence (work, recovery, references)", "strong", 6],
      ["Somewhat", "some", 3],
      ["Not yet documented", "none", 0],
    ] },
];

function stateFactor(s) {
  if (!s) return 0.92;
  if (s.cleanSlate === "auto" || s.cleanSlate === "partial") return 1.0;
  return NARROW_STATES.includes(s.abbr) ? 0.8 : 0.92;
}
function stateClimate(s) {
  if (!s) return ["—", "Pick your state to factor in local law.", "var(--ink2)"];
  if (s.cleanSlate === "auto") return ["Favorable", "Automatic Clean Slate sealing widens eligibility here.", "var(--sage)"];
  if (s.cleanSlate === "partial") return ["Favorable", "Phasing-in automatic relief plus petition options.", "var(--sage)"];
  if (NARROW_STATES.includes(s.abbr)) return ["Restrictive", "Felony-conviction relief is narrower than average here.", "var(--clay)"];
  return ["Average", "Standard petition-based relief is available.", "var(--gold)"];
}

function band(score) {
  if (score >= 75) return ["Strong case", "var(--sage)", "You fit the profile these laws are written for. Confirm the specifics and move forward. Many people in your position succeed."];
  if (score >= 55) return ["Promising", "var(--gold)", "A solid case with a hurdle or two. Tighten the weak spots below, then file or get a free screening."];
  if (score >= 35) return ["Possible once the hurdles clear", "#C9701F", "Relief may be within reach once you resolve the limiting factors below. A legal-aid screening is well worth it."];
  return ["Limited for now", "var(--clay)", "Right now the blockers below outweigh the strengths. That can change with time or a different route (pardon, certificate of relief). Talk to legal aid about options."];
}

function buildFactors(ans) {
  const pros = [], cons = [];
  const f = {
    type: { nonconv: ["No conviction, the most clearable category", null], misd: ["Misdemeanors are widely eligible", null], nvfelony: ["Non-violent felony, eligible in many states with conditions", null], violent: [null, "Violent/sexual offenses are excluded almost everywhere"] },
    done: { done: ["Sentence fully complete", null], owe: [null, "Outstanding fines/restitution can block sealing until paid"], notdone: [null, "Still on supervision. Most states require completion first"] },
    since: { y10: ["10+ years clean, well past most waiting periods", null], y5: ["5–10 years clean", null], y1: [null, "1–5 years may be short of the felony waiting period"], y0: [null, "Under a year — likely before the waiting period"] },
    clean: { none: ["No new convictions since", null], one: [null, "A later conviction may restart the clock"], multi: [null, "Multiple later convictions strongly limit relief"] },
    priors: { only: ["Single offense on record", null], few: [null, "A few offenses can complicate eligibility"], many: [null, "An extensive record narrows options"] },
    rehab: { strong: ["Strong, documented rehabilitation", null], some: ["Some rehabilitation evidence", null], none: [null, "No documented rehabilitation yet, worth building"] },
  };
  for (const q of QUESTIONS) {
    const v = ans[q.id];
    if (!v || !f[q.id]?.[v]) continue;
    const [pro, con] = f[q.id][v];
    if (pro) pros.push(pro);
    if (con) cons.push(con);
  }
  return { pros, cons };
}

function Eligibility({ go }) {
  const [qState, setQState] = useState(() => STATES.find((s) => s.abbr === store.get("homeState", "")) || null);
  const [ans, setAns] = useState({});
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;

  const calc = useMemo(() => {
    if (!done) return null;
    let personal = 0;
    for (const q of QUESTIONS) {
      const opt = q.a.find((o) => o[1] === ans[q.id]);
      if (opt) personal += opt[2];
    }
    const factor = stateFactor(qState);
    let score = Math.round(personal * factor);
    if (ans.type === "violent") score = Math.min(score, 22);   // structural exclusion
    if (ans.done === "notdone") score = Math.min(score, 30);   // can't file yet
    score = Math.max(2, Math.min(100, score));
    return { score, factor };
  }, [done, ans, qState]);

  const reset = () => { setAns({}); setStep(0); setQState(null); };

  const climate = stateClimate(qState);

  return (
    <div className="page">
      <h2 className="page-h">How strong is my case?</h2>
      <p className="page-sub">
        Answer a few questions for a transparent <b>Case Strength estimate</b> built from your answers
        and adjusted for your state's laws. It's a planning heuristic to show what helps and what hurts,
        <b> not a prediction of any court's decision</b> and not a real-world success rate.
      </p>

      {/* state selector — always visible */}
      <div className="statepick">
        <MapPin size={16} />
        <select
          className="stateselect"
          value={qState?.abbr || ""}
          onChange={(e) => setQState(STATES.find((s) => s.abbr === e.target.value) || null)}
        >
          <option value="">Select your state (factors in local law)</option>
          {STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
        </select>
        {qState && (
          <span className="climatechip" style={{ "--cc": climate[2] }}>{climate[0]} laws</span>
        )}
      </div>

      {!done && (
        <div className="quiz">
          <div className="quizbar">
            {QUESTIONS.map((_, i) => (
              <span key={i} className={`qseg ${i <= step ? "on" : ""}`} />
            ))}
          </div>
          <div className="qcount">Question {step + 1} of {QUESTIONS.length}</div>
          <h3 className="qtext">{QUESTIONS[step].q}</h3>
          <p className="qhelp">{QUESTIONS[step].help}</p>
          <div className="qopts">
            {QUESTIONS[step].a.map(([label, val]) => (
              <button
                key={val}
                className={`qopt ${ans[QUESTIONS[step].id] === val ? "sel" : ""}`}
                onClick={() => {
                  setAns({ ...ans, [QUESTIONS[step].id]: val });
                  setStep(step + 1);
                }}
              >
                {label} <ChevronRight size={16} />
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="qback" onClick={() => setStep(step - 1)}>← Back</button>
          )}
        </div>
      )}

      {done && calc && (() => {
        const [label, color, blurb] = band(calc.score);
        const { pros, cons } = buildFactors(ans);
        return (
          <div className="result" style={{ "--rc": color }}>
            <div className="scorehead">
              <div className="scoreleft">
                <div className="result-badge">
                  {calc.score >= 55 ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  Case Strength
                </div>
                <div className="scorenum" style={{ color }}>{calc.score}<span>/100</span></div>
                <div className="scorelabel" style={{ color }}>{label}</div>
              </div>
              <div className="gauge">
                <div className="gaugetrack">
                  <div className="gaugemark" style={{ left: `${calc.score}%` }} />
                </div>
                <div className="gaugescale"><span>Limited</span><span>Possible</span><span>Promising</span><span>Strong</span></div>
                {qState && (
                  <div className="gaugestate" style={{ "--cc": climate[2] }}>
                    <MapPin size={12} /> {qState.name}: <b>{climate[0]}</b>. {climate[1]}
                  </div>
                )}
              </div>
            </div>

            <p className="scoreblurb">{blurb}</p>

            <div className="factorgrid">
              <div className="factorcol pro">
                <h5><CheckCircle2 size={14} /> In your favor</h5>
                {pros.length ? pros.map((p, i) => <span key={i} className="factor">{p}</span>) : <span className="factor muted">—</span>}
              </div>
              <div className="factorcol con">
                <h5><AlertTriangle size={14} /> What could limit it</h5>
                {cons.length ? cons.map((c, i) => <span key={i} className="factor">{c}</span>) : <span className="factor muted">Nothing flagged. Nice.</span>}
              </div>
            </div>

            <div className="result-actions">
              <button className="btn primary sm" onClick={reset}>
                <RotateCcw size={15} /> Start over
              </button>
              <span className="result-hint">
                Next: open <button className="inlinelink" onClick={() => go("state")}>Your State</button> for
                specifics, or <button className="inlinelink" onClick={() => go("help")}>Get Help</button> for a free screening.
              </span>
            </div>

            <p className="verify-note">
              <AlertTriangle size={13} /> This score is a planning aid from your answers and general state-law
              favorability. It is not a probability, a guarantee, or a substitute for legal advice. Confirm
              eligibility on the official source for your state or with an attorney.
            </p>
          </div>
        );
      })()}
    </div>
  );
}

/* --------------------------- COST ------------------------------ */
function CostEstimator() {
  const [route, setRoute] = useState("diy");
  const [count, setCount] = useState(1);
  const [waiver, setWaiver] = useState(false);

  const ranges = {
    diy: { lo: 0, hi: 450, perCase: true, label: "File it yourself", desc: "Court filing fee per case (often $0–$450; $0 under automatic Clean Slate). Add ~$15–$25 for your official criminal-history report." },
    aid: { lo: 0, hi: 25, perCase: false, label: "Legal aid / clinic", desc: "Free representation for those who qualify by income. You may still pay a small records fee (~$15–$25)." },
    atty: { lo: 400, hi: 5000, perCase: true, label: "Private attorney", desc: "Attorney fees per offense, plus filing fees. Typical single non-violent felony runs ~$1,000–$2,500 all-in." },
  };

  const r = ranges[route];
  const records = 20;
  const fileLo = r.perCase ? r.lo * count : r.lo;
  const fileHi = r.perCase ? r.hi * count : r.hi;
  let lo = fileLo + (route === "atty" ? 0 : records);
  let hi = fileHi + (route === "atty" ? 0 : records);
  if (waiver && route === "diy") { lo = records; hi = records; }

  const fmt = (n) => "$" + n.toLocaleString();
  const max = 5000 * count + records;
  const pct = (v) => Math.max(2, Math.min(100, (v / max) * 100));

  return (
    <div className="page">
      <h2 className="page-h">What it costs</h2>
      <p className="page-sub">
        A planning estimate from real 2026 cost ranges. Your actual fees depend on your state, county,
        and number of cases. Fee waivers are widely available for low income.
      </p>

      <div className="costgrid">
        <div className="costcontrols">
          <label className="ctl-label">How will you pursue it?</label>
          <div className="routetabs">
            {Object.entries(ranges).map(([k, v]) => (
              <button key={k} className={`routetab ${route === k ? "on" : ""}`} onClick={() => setRoute(k)}>
                {v.label}
              </button>
            ))}
          </div>
          <p className="route-desc">{r.desc}</p>

          <label className="ctl-label">How many offenses / cases?</label>
          <div className="stepper">
            <button onClick={() => setCount(Math.max(1, count - 1))}>–</button>
            <span>{count}</span>
            <button onClick={() => setCount(Math.min(10, count + 1))}>+</button>
          </div>

          {route === "diy" && (
            <label className="checkrow">
              <input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} />
              I likely qualify for a fee waiver (low income)
            </label>
          )}
        </div>

        <div className="costreadout">
          <div className="estbig">
            {lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`}
          </div>
          <div className="estsub">estimated out-of-pocket{r.perCase && count > 1 ? ` for ${count} cases` : ""}</div>

          <div className="bars">
            <div className="barrow"><span>Low end</span><div className="bartrack"><div className="barfill lo" style={{ width: `${pct(lo)}%` }} /></div><b>{fmt(lo)}</b></div>
            <div className="barrow"><span>High end</span><div className="bartrack"><div className="barfill hi" style={{ width: `${pct(hi)}%` }} /></div><b>{fmt(hi)}</b></div>
          </div>

          <div className="cost-of-not">
            <Info size={15} />
            <span>For perspective: a criminal record is estimated to cut lifetime earnings by <b>$500,000+</b>. Clearing it usually costs a tiny fraction of that, and free routes exist.</span>
          </div>
        </div>
      </div>

      <p className="verify-note">
        <AlertTriangle size={13} /> Watch for "guarantee" services charging high flat fees. Always price-check
        against your local legal-aid office first. Many do this work for free.
      </p>
    </div>
  );
}

/* ---------------------------- DIY ------------------------------ */
const DIY_STEPS = [
  ["Get your official record", "Order your state criminal-history report (often through the state police, e.g. a ~$15–$25 background check). You need exact charge names, statute codes, disposition, and dates. Get the court docket too if you can."],
  ["Confirm what you're clearing", "List each offense. Note whether it's a conviction or a non-conviction (those are easier). Identify each as misdemeanor or felony, violent or non-violent."],
  ["Check eligibility & timing", "On your state's official profile, confirm the offense is on the eligible list and that you've completed the waiting period (measured from when ALL terms ended). Confirm no outstanding fines/restitution."],
  ["See if it's automatic", "If your state has a Clean Slate law, some records seal automatically, but rollout lags. Pull a fresh report to check; if an eligible record hasn't cleared, you may need to file to prompt it."],
  ["Get and complete the forms", "Most courts publish self-help expungement/sealing petition packets online. Fill them out precisely. A wrong court, charge name, or date is the most common reason petitions stall."],
  ["File with the right court", "File in the court that handled the case (usually the county). Pay the filing fee or request a fee waiver. Keep stamped copies of everything."],
  ["Serve notice & await response", "You typically must notify the prosecutor/DA, who can object. Some cases get a hearing; many are decided on paperwork. Be ready to briefly explain your rehabilitation if asked."],
  ["Get the order & verify", "If granted, get certified copies of the order. Then re-pull your background check weeks later to confirm the record actually shows sealed/expunged across agencies."],
];

function DIY() {
  return (
    <div className="page">
      <h2 className="page-h">Do it yourself</h2>
      <p className="page-sub">
        Many people clear an eligible record without a lawyer. Here's the sequence. Your
        state page has the specific forms, fees, and court.
      </p>

      <ol className="diylist">
        {DIY_STEPS.map(([t, d], i) => (
          <li key={i} className="diystep">
            <span className="diynum">{i + 1}</span>
            <div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="tipbox">
        <h4><Sparkles size={15} /> Things that quietly trip people up</h4>
        <ul>
          <li>Filing before the waiting period is fully met. Count from the date the <i>last</i> term ended.</li>
          <li>Unpaid court costs or restitution blocking an otherwise-eligible record.</li>
          <li>Private background-check companies still showing old records after a court clears them. You may need to send them the order.</li>
          <li>Assuming automatic Clean Slate worked without verifying with a fresh report.</li>
        </ul>
      </div>
    </div>
  );
}

/* --------------------------- HELP ------------------------------ */
function GetHelp() {
  const cards = [
    [NACDL_MAP, "NACDL National Expungement Directory", "Map of ongoing legal-aid organizations and free one-time expungement clinics, searchable by state. The best single starting point for finding local help.", true],
    [LAWHELP, "LawHelp.org", "Free national finder for civil legal-aid programs and self-help resources by state and topic.", false],
    [LSC, "Legal Services Corporation (Get Legal Help)", "Locate your nearest LSC-funded legal-aid office; they often handle record-clearing for income-qualifying clients at no cost.", false],
    [CCRC_HUB, "Restoration of Rights Project (CCRC)", "Authoritative, regularly-updated state-by-state law on expungement, sealing, set-aside, certificates of relief, and pardons.", true],
    [CLEANSLATE_INIT, "Clean Slate Initiative", "Tracks which states have automatic record-clearing and how it works. Useful if you may qualify for automatic sealing.", false],
    [CCRC_50, "50-State Comparison Chart", "Side-by-side view of where automatic vs. petition-based relief exists nationwide.", false],
    ["https://nationalreentryresourcecenter.org", "National Reentry Resource Center", "Federal clearinghouse of reentry programs and resources (housing, employment, health) for people returning from incarceration.", false],
    ["https://www.careeronestop.org/ExOffender/default.aspx", "CareerOneStop Reentry Portal", "U.S. Dept. of Labor job-search hub built for people with records: local help, training, and fair-chance employers.", false],
  ];
  return (
    <div className="page">
      <h2 className="page-h">Get help</h2>
      <p className="page-sub">
        You don't have to do this alone. These are free, real, vetted national resources. Start with the
        directory to find an office or clinic near you.
      </p>

      <div className="helpgrid">
        {cards.map(([href, t, d, star]) => (
          <a key={t} className={`helpcard ${star ? "star" : ""}`} href={href} target="_blank" rel="noopener noreferrer">
            {star && <span className="starbadge">Start here</span>}
            <h4>{t} <ExternalLink size={14} /></h4>
            <p>{d}</p>
          </a>
        ))}
      </div>

      <div className="tipbox warm">
        <h4><LifeBuoy size={15} /> When you contact a legal-aid office, bring:</h4>
        <ul>
          <li>Your official criminal-history report (or the case/docket numbers).</li>
          <li>Proof your sentence is complete, like discharge papers or probation/parole termination.</li>
          <li>Any documents about fines or restitution paid.</li>
          <li>A short note on what you've built since: work, recovery, family, community.</li>
        </ul>
      </div>

      <p className="verify-note recovery">
        <CheckCircle2 size={13} /> If you came through recovery to get here, that's not a footnote. Courts
        and clinics recognize sustained rehabilitation. Your record can change to match who you've become.
      </p>
    </div>
  );
}

/* --------------------------- STYLES ----------------------------- */
function Style() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

:root{
  --paper:#FAF4EA; --paper2:#F3EADA; --ink:#241D17; --ink2:#5A4F45;
  --sage:#337059; --pine:#1E5B3C; --sand:#B49B74; --gold:#C9881F; --clay:#B85539; --line:#E3D7C4;
  --shadow:0 1px 2px rgba(60,40,20,.05),0 8px 24px rgba(60,40,20,.07);
}
*{box-sizing:border-box}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-radius:6px}
.wrap{font-family:'Hanken Grotesk',sans-serif;color:var(--ink);background:
  radial-gradient(1200px 520px at 85% -8%, #FBE7C8 0%, transparent 60%),
  radial-gradient(900px 460px at -5% 4%, #E7F0EA 0%, transparent 55%),
  var(--paper);
  min-height:100vh;position:relative;overflow-x:clip;}
.grain{position:fixed;inset:0;pointer-events:none;opacity:.35;z-index:0;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");}

/* topbar */
.headstack{position:relative;z-index:20}
.pillstick{position:sticky;top:0;z-index:25}
.topbar{display:flex;align-items:center;justify-content:space-between;
  gap:16px;padding:14px clamp(16px,4vw,40px);backdrop-filter:blur(10px);
  background:rgba(250,244,234,.82);border-bottom:1px solid var(--line);flex-wrap:wrap;}
.brand{display:flex;align-items:center;gap:11px;cursor:pointer}
.logomark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;
  background:linear-gradient(150deg,var(--gold),var(--clay));box-shadow:var(--shadow);}
.brand-name{font-family:'Fraunces',serif;font-weight:600;font-size:19px;letter-spacing:-.01em;line-height:1}
.brand-sub{font-size:11.5px;color:var(--ink2);margin-top:3px;letter-spacing:.02em}
.nav{display:flex;gap:4px;flex-wrap:wrap}
.navbtn{display:flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--ink2);
  font-family:inherit;font-size:13.5px;font-weight:600;padding:8px 12px;border-radius:9px;cursor:pointer;transition:.18s}
.navbtn:hover{background:var(--paper2);color:var(--ink)}
.navbtn.on{background:var(--ink);color:var(--paper)}
.navbtn.on svg{color:var(--gold)}

/* my toolkit corner button */
.toolkitbtn{display:inline-flex;align-items:center;gap:8px;font-family:inherit;font-size:14px;font-weight:700;
  color:#fff;background:linear-gradient(150deg,#4d937c,var(--sage));border:0;border-radius:13px;
  padding:12px 18px;cursor:pointer;transition:.18s;box-shadow:var(--shadow);flex:none;white-space:nowrap;
  margin-left:auto;order:2}
.toolkitbtn:hover{transform:translateY(-2px);background:linear-gradient(150deg,var(--sage),#2f6353)}
.toolkitbtn.on{box-shadow:0 0 0 3px color-mix(in srgb,var(--sage) 30%,transparent),var(--shadow)}
.toolkitbtn svg{color:#dff0e8}
.navtagline{flex-basis:100%;order:3;margin:2px 0 0;font-family:'Fraunces',serif;font-style:italic;
  font-size:14.5px;color:var(--clay);letter-spacing:.01em}
.nav{order:4}
@media(max-width:899px){.nav{flex-basis:100%}}
@media(min-width:900px){.nav{flex:1;justify-content:flex-end;margin-right:14px;order:1}.toolkitbtn{order:2;margin-left:0}}

/* subbar with recovery pills — single professional line */
.subbar{display:flex;align-items:center;gap:14px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;
  padding:9px clamp(16px,4vw,40px);backdrop-filter:blur(10px);
  background:linear-gradient(rgba(60,122,102,.10),rgba(60,122,102,.06));border-bottom:1px solid var(--line)}
.subbar::-webkit-scrollbar{display:none}
.sublabel{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:var(--sage);
  letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;flex:none}
.subpills{display:flex;gap:8px;flex-wrap:nowrap;flex:1;align-items:center}
.subpill{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:12.5px;font-weight:600;
  color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:99px;padding:7px 15px;cursor:pointer;
  transition:.16s;white-space:nowrap;flex:none}
.subpill svg{color:var(--sage)}
.subpill:hover{border-color:var(--sage);transform:translateY(-1px);box-shadow:var(--shadow)}
.subpill.on{background:var(--sage);color:#fff;border-color:var(--sage)}
.subpill.on svg{color:#fff}
.crisispill{display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-size:12.5px;font-weight:700;
  color:#fff;background:var(--clay);border-radius:99px;padding:7px 15px;white-space:nowrap;transition:.16s;
  box-shadow:var(--shadow);flex:none}
.crisispill:hover{background:#a4462e;transform:translateY(-1px)}
@media(max-width:680px){.sublabel{display:none}}

/* scroll cue for overflowing pill rows */
.scrollrowwrap{position:relative}
.scrollcue{position:absolute;right:0;top:0;bottom:1px;width:58px;border:0;cursor:pointer;
  display:flex;align-items:center;justify-content:flex-end;padding-right:8px;
  background:linear-gradient(90deg,rgba(250,244,234,0),rgba(250,244,234,.96) 62%);
  opacity:0;pointer-events:none;transition:opacity .25s}
.scrollrowwrap.more .scrollcue{opacity:1;pointer-events:auto}
.scrollcue svg{color:var(--ink2);background:#fff;border:1px solid var(--line);border-radius:50%;
  width:24px;height:24px;padding:4px;box-shadow:var(--shadow);animation:nudge 1.5s ease-in-out infinite}
.scrollcue:hover svg{color:var(--ink);border-color:var(--sage)}
@keyframes nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}

/* focus row (either/or) */
.focusrow{background:linear-gradient(rgba(184,85,57,.08),rgba(184,85,57,.04))}
.focusrow .sublabel{color:var(--clay)}
.focuschip{font-family:inherit;font-size:12.5px;font-weight:700;color:var(--ink2);background:#fff;
  border:1.5px solid var(--line);border-radius:99px;padding:8px 17px;cursor:pointer;transition:.15s;
  white-space:nowrap;flex:none}
.focuschip:hover{border-color:var(--clay);color:var(--ink)}
.focuschip.on{background:var(--clay);border-color:var(--clay);color:#fff}

/* fellowship spotlight */
.fellowcard{background:color-mix(in srgb,var(--sage) 8%,#fff);border:1.5px solid var(--sage);
  border-radius:16px;padding:18px 20px;margin-bottom:18px;box-shadow:var(--shadow)}
.fellowcard h4{font-family:'Fraunces',serif;font-weight:600;font-size:20px;margin:5px 0 6px}
.fellowcard p{font-size:13.5px;line-height:1.55;color:var(--ink2);margin:0 0 13px}
a.calmopt{text-decoration:none}

/* crisis box */
.crisisbox{background:#fff;border:1px solid var(--line);border-left:5px solid var(--clay);border-radius:16px;
  padding:20px;box-shadow:var(--shadow);margin-bottom:24px}
.crisis-h{display:flex;align-items:center;gap:8px;font-family:'Fraunces',serif;font-weight:600;font-size:17px;margin-bottom:14px}
.crisis-h svg{color:var(--clay)}
.crisisgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
.crisiscard{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px}
.crisisname{font-weight:700;font-size:14.5px}
.crisisnote{font-size:12.5px;line-height:1.45;color:var(--ink2);margin:4px 0 11px}
.crisisactions{display:flex;gap:8px;flex-wrap:wrap}
.callbtn{display:inline-flex;align-items:center;gap:5px;text-decoration:none;font-size:12.5px;font-weight:700;
  color:#fff;background:var(--sage);border-radius:8px;padding:6px 11px;transition:.15s}
.callbtn:hover{background:#2f6353}
.callbtn.small{margin:0 14px 14px;background:var(--ink)}
.callbtn.small:hover{background:#15110d}
.textbtn{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:700;color:var(--sage);
  background:color-mix(in srgb,var(--sage) 13%,transparent);border-radius:8px;padding:6px 11px}

/* ---- beat the pressure arcade ---- */
.urgebar-wrap{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;
  box-shadow:var(--shadow);margin-bottom:20px}
.urgebar-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.urgeclock{display:inline-flex;align-items:center;gap:8px;font-family:monospace;font-weight:700;
  font-size:15px;letter-spacing:.08em;color:var(--ink)}
.urgeclock svg{color:var(--sage)}
.urgegoal{font-size:12.5px;font-weight:700;color:var(--ink2);letter-spacing:.04em}
.urgetrack{height:12px;border-radius:99px;background:var(--paper2);overflow:hidden}
.urgefill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--sage),var(--gold));
  transition:width 1s linear}

.gamepicker{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px}
.gamecard{display:flex;flex-direction:column;align-items:center;gap:5px;font-family:inherit;cursor:pointer;
  background:#171420;border:2px solid #2a2435;border-radius:14px;padding:18px 12px;transition:.18s;text-align:center}
.gamecard:hover{transform:translateY(-3px);border-color:var(--gold)}
.gamecard.on{border-color:var(--sage);box-shadow:0 0 0 3px color-mix(in srgb,var(--sage) 30%,transparent)}
.gameem{font-size:30px;line-height:1}
.gamename{font-family:monospace;font-weight:700;font-size:14px;letter-spacing:.12em;color:#F2E3C6;margin-top:6px}
.gametag{font-size:11.5px;line-height:1.4;color:#9b93ab}

.gamebox{background:#171420;border:2px solid #2a2435;border-radius:18px;padding:18px;
  display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:var(--shadow);animation:rise .4s both}
.gamehud{display:flex;gap:18px;align-items:center;flex-wrap:wrap;justify-content:center;
  font-family:monospace;font-weight:700;font-size:13px;letter-spacing:.1em;color:#F2E3C6}
.gamehud span:nth-child(2){color:#E2725B}
.besttag{color:#F2C14E !important}
.gameover-tag{color:#F2C14E;animation:blink 1s steps(2) infinite}
.fear-tag{color:#7CC66B;animation:blink .6s steps(2) infinite}
@keyframes blink{50%{opacity:.25}}
.gamecanvas{image-rendering:pixelated;border:2px solid #3a3354;border-radius:8px;
  width:min(100%,300px);height:auto;background:#171420}
.gamecanvas.tall{width:min(100%,210px)}
.gamehint{font-size:12.5px;line-height:1.5;color:#9b93ab;text-align:center;max-width:380px;margin:0}
.gamehint.center{text-align:center;color:var(--ink2);background:#fff;border:1px dashed var(--line);
  border-radius:12px;padding:16px;max-width:100%}

.dpad{display:flex;justify-content:center}
.dpad-grid{display:grid;grid-template-columns:repeat(3,56px);grid-auto-rows:44px;gap:6px}
.dpad-grid button{font-family:monospace;font-size:17px;font-weight:700;color:#F2E3C6;background:#2a2435;
  border:2px solid #3a3354;border-radius:10px;cursor:pointer;transition:.1s;touch-action:manipulation;
  user-select:none;-webkit-user-select:none}
.dpad-grid button:active{background:#3a3354;transform:scale(.95)}
.dpad-act{font-size:11px !important;letter-spacing:.06em;color:#7CC66B !important}

.rewardveil{position:fixed;inset:0;z-index:300;background:rgba(23,20,32,.7);backdrop-filter:blur(4px);
  display:grid;place-items:center;padding:18px;animation:rise .3s both;overflow-y:auto}
.rewardcard{background:var(--paper);border:1px solid var(--line);border-radius:22px;max-width:540px;width:100%;
  max-height:88vh;overflow-y:auto;padding:clamp(22px,4vw,34px);box-shadow:0 24px 70px rgba(0,0,0,.35)}
.rewardpix{font-family:monospace;font-weight:700;font-size:clamp(19px,4vw,26px);letter-spacing:.14em;
  text-align:center;color:var(--gold);text-shadow:2px 2px 0 var(--clay);margin-bottom:14px}
.rewardcard h3{font-family:'Fraunces',serif;font-weight:600;font-size:24px;text-align:center;margin:0 0 10px}
.rewardcard>p{font-size:14.5px;line-height:1.6;color:var(--ink2);text-align:center;margin:0 0 8px}
.gearhead{font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin:20px 0 12px;text-align:center}
.gearlist{display:flex;flex-direction:column;gap:9px}
.gearitem{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.5;color:var(--ink2);
  background:#fff;border:1px solid var(--line);border-radius:11px;padding:11px 13px}
.gearitem svg{color:var(--sage);flex:none;margin-top:2px}
.gearitem b{color:var(--ink)}
.rewardfoot{font-size:13px;line-height:1.55;color:var(--ink2);text-align:center;margin:16px 0}
.rewardfoot a{color:var(--clay);font-weight:700}
.rewardcard .btn{width:100%;justify-content:center}
.rewardskip{display:block;width:100%;margin-top:10px;border:0;background:transparent;font-family:inherit;
  font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;padding:6px;text-align:center}
.rewardskip:hover{color:var(--ink)}

/* encouragement toast */
.encourage-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:340;
  display:flex;align-items:flex-start;gap:9px;max-width:min(440px,calc(100vw - 32px));
  background:var(--ink);color:var(--paper);border-radius:14px;padding:13px 17px;
  font-size:13.5px;line-height:1.5;font-weight:500;box-shadow:0 12px 36px rgba(0,0,0,.3);
  cursor:pointer;animation:toastup .4s cubic-bezier(.2,.7,.2,1) both}
.encourage-toast svg{color:var(--gold);flex:none;margin-top:2px}
@keyframes toastup{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}

/* workout flow */
.exgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:9px;margin:18px 0 20px}
.excard{display:flex;flex-direction:column;align-items:center;gap:5px;font-family:inherit;cursor:pointer;
  background:#fff;border:2px solid var(--line);border-radius:13px;padding:14px 8px;transition:.15s}
.excard:hover{border-color:var(--gold);transform:translateY(-2px)}
.excard.on{border-color:var(--sage);background:color-mix(in srgb,var(--sage) 9%,#fff);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--sage) 22%,transparent)}
.exem{font-size:26px;line-height:1}
.exname{font-size:12.5px;font-weight:700;color:var(--ink);text-align:center}
.rewardcard .btn:disabled{opacity:.45;cursor:not-allowed;transform:none}

.workhead{text-align:center;margin-bottom:6px}
.worktype{display:inline-block;font-family:monospace;font-weight:700;font-size:12px;letter-spacing:.14em;
  padding:5px 14px;border-radius:99px}
.worktype.work{color:#fff;background:var(--sage)}
.worktype.rest{color:var(--ink);background:var(--gold)}
.workex{text-align:center;margin:8px 0 0}
.workem{font-size:46px;line-height:1;display:block}
.workex h3{font-family:'Fraunces',serif;font-weight:600;font-size:26px;margin:10px 0 4px;text-align:center}
.worktip{font-size:13.5px;color:var(--ink2);margin:0;text-align:center}
.workclock{font-family:monospace;font-weight:700;font-size:74px;line-height:1;text-align:center;
  color:var(--clay);margin:14px 0 10px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.workctrl{display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:16px}
.workctrl .btn{width:auto;min-width:140px}
.workbtnrow{display:flex;gap:8px;align-items:center}
.soundbtn{min-width:0 !important;width:42px !important;padding:9px !important;justify-content:center}

/* resource grid */
.resgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:14px}
.rescard{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:16px;
  box-shadow:var(--shadow);transition:.2s;overflow:hidden}
.rescard:hover{transform:translateY(-3px);border-color:var(--sage)}
.resmain{display:block;text-decoration:none;color:inherit;padding:20px 20px 16px}
.resmain h4{display:flex;align-items:center;gap:7px;font-size:16px;margin:0 0 7px}
.resmain h4 svg{color:var(--ink2)}
.resmain p{font-size:13.5px;line-height:1.55;color:var(--ink2);margin:0}

.main{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:clamp(20px,4vw,44px) clamp(16px,4vw,40px) 40px}
.page{animation:rise .5s cubic-bezier(.2,.7,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

/* hero */
.hero{position:relative;padding:18px 0 8px}
.hero-glow{position:absolute;top:-60px;right:-40px;width:340px;height:340px;border-radius:50%;
  background:radial-gradient(circle,rgba(201,136,31,.22),transparent 65%);filter:blur(8px);z-index:-1}
.eyebrow{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--clay);
  background:#fff;border:1px solid var(--line);padding:7px 13px;border-radius:99px;box-shadow:var(--shadow)}
.hero-h1{font-family:'Fraunces',serif;font-weight:600;letter-spacing:-.02em;line-height:1.04;
  font-size:clamp(34px,6vw,60px);margin:20px 0 0}
.hero-h1 em{font-style:italic;color:var(--clay)}
.hero-lede{font-size:clamp(16px,2vw,18.5px);line-height:1.6;color:var(--ink2);max-width:660px;margin:20px 0 0}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}

.btn{display:inline-flex;align-items:center;gap:9px;font-family:inherit;font-weight:600;font-size:15px;
  border-radius:12px;padding:13px 20px;cursor:pointer;border:1px solid transparent;transition:.18s}
.btn.sm{font-size:13.5px;padding:9px 15px;border-radius:10px}
.btn.primary{background:var(--ink);color:var(--paper);box-shadow:var(--shadow)}
.btn.primary:hover{transform:translateY(-2px);background:#15110d}
.btn.ghost{background:#fff;border-color:var(--line);color:var(--ink)}
.btn.ghost:hover{border-color:var(--ink);transform:translateY(-2px)}

/* honest section */
.honest{margin-top:46px;background:#fff;border:1px solid var(--line);border-radius:20px;
  padding:clamp(20px,3vw,30px);box-shadow:var(--shadow)}
.honest-head{display:flex;align-items:center;gap:9px;font-family:'Fraunces',serif;font-size:20px;font-weight:600}
.honest-head svg{color:var(--sage)}
.honest-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px 30px;margin-top:20px}
.honest-grid h4{font-size:15.5px;margin:0 0 6px}
.honest-grid p{font-size:14px;line-height:1.55;color:var(--ink2);margin:0}
.honest-grid b{color:var(--ink)}

.section-h{font-family:'Fraunces',serif;font-weight:600;font-size:26px;margin:48px 0 18px;letter-spacing:-.01em}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}
.stepcard{text-align:left;background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;
  cursor:pointer;transition:.2s;font-family:inherit;position:relative;overflow:hidden}
.stepcard:hover{transform:translateY(-3px);border-color:var(--gold);box-shadow:var(--shadow)}
.stepnum{font-family:'Fraunces',serif;font-size:13px;font-weight:600;color:var(--gold);letter-spacing:.1em}
.stepcard h4{font-size:16px;margin:8px 0 6px}
.stepcard p{font-size:13.5px;line-height:1.5;color:var(--ink2);margin:0 0 14px}
.steplink{display:inline-flex;align-items:center;gap:3px;font-size:13px;font-weight:600;color:var(--ink)}

/* page headers */
.page-h{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(28px,4vw,40px);letter-spacing:-.02em;margin:0}
.page-sub{font-size:16px;line-height:1.6;color:var(--ink2);max-width:680px;margin:12px 0 26px}

/* search + state grid */
.searchrow{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);
  border-radius:13px;padding:12px 16px;max-width:420px;color:var(--ink2);box-shadow:var(--shadow)}
.search{border:0;background:transparent;font-family:inherit;font-size:15.5px;color:var(--ink);width:100%;outline:none}
.stategrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:22px}
.statebtn{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);
  border-radius:12px;padding:12px 13px;cursor:pointer;font-family:inherit;transition:.16s;text-align:left}
.statebtn:hover{border-color:var(--ink);transform:translateY(-2px);box-shadow:var(--shadow)}
.abbr{font-family:'Fraunces',serif;font-weight:600;font-size:14px;width:28px;color:var(--clay)}
.sname{font-size:13.5px;font-weight:500;flex:1}
.dot{width:9px;height:9px;border-radius:50%;flex:none}
.empty{color:var(--ink2);font-size:14px;grid-column:1/-1}

/* state detail */
.detail{background:#fff;border:1px solid var(--line);border-radius:20px;padding:clamp(20px,3vw,30px);
  margin-top:22px;box-shadow:var(--shadow);animation:rise .4s both}
.backbtn{display:inline-flex;align-items:center;gap:6px;border:0;background:var(--paper2);color:var(--ink2);
  font-family:inherit;font-weight:600;font-size:13px;padding:7px 13px;border-radius:8px;cursor:pointer;margin-bottom:18px}
.backbtn:hover{color:var(--ink)}
.detail-head{display:flex;align-items:center;gap:16px;margin-bottom:8px}
.detail-abbr{font-family:'Fraunces',serif;font-weight:600;font-size:30px;color:#fff;width:62px;height:62px;
  border-radius:16px;display:grid;place-items:center;background:linear-gradient(150deg,var(--ink),#3a2f24)}
.detail-head h3{font-family:'Fraunces',serif;font-weight:600;font-size:26px;margin:0 0 7px}
.detail-block{padding:16px 0;border-top:1px solid var(--line)}
.detail-block:first-of-type{border-top:0}
.detail-block h4{display:flex;align-items:center;gap:7px;font-size:14px;margin:0 0 6px;color:var(--ink)}
.detail-block h4 svg{color:var(--gold)}
.detail-block p{font-size:14.5px;line-height:1.6;color:var(--ink2);margin:0}
.detail-block b{color:var(--ink)}
.pill{display:inline-flex;align-items:center;font-size:12px;font-weight:700;color:var(--pc);
  background:color-mix(in srgb,var(--pc) 12%,transparent);border:1px solid color-mix(in srgb,var(--pc) 35%,transparent);
  padding:5px 11px;border-radius:99px;letter-spacing:.01em}
.linkrow{display:flex;flex-direction:column;gap:9px;margin-top:18px}
.extlink{display:inline-flex;align-items:center;gap:6px;font-size:14.5px;font-weight:600;color:var(--ink);
  text-decoration:none;border-bottom:2px solid var(--gold);padding-bottom:1px;width:fit-content;transition:.16s}
.extlink:hover{color:var(--clay);border-color:var(--clay)}
.verify-note{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.5;color:var(--ink2);
  margin-top:18px;background:var(--paper2);border-radius:10px;padding:11px 14px}
.verify-note svg{color:var(--clay);flex:none;margin-top:2px}
.verify-note.recovery{background:color-mix(in srgb,var(--sage) 10%,transparent)}
.verify-note.recovery svg{color:var(--sage)}

.fedcard{margin-top:26px;background:var(--paper2);border:1px dashed var(--line);border-radius:16px;padding:20px}
.fed-h{display:flex;align-items:center;gap:8px;font-family:'Fraunces',serif;font-weight:600;font-size:17px;margin-bottom:8px}
.fed-h svg{color:var(--ink2)}
.fedcard p{font-size:14px;line-height:1.6;color:var(--ink2);margin:0}
.fedcard b{color:var(--ink)}

/* quiz */
.quiz{background:#fff;border:1px solid var(--line);border-radius:20px;padding:clamp(20px,3vw,34px);box-shadow:var(--shadow);max-width:680px}
.quizbar{display:flex;gap:6px}
.qseg{height:5px;flex:1;border-radius:99px;background:var(--line);transition:.3s}
.qseg.on{background:linear-gradient(90deg,var(--gold),var(--clay))}
.qcount{font-size:12.5px;font-weight:600;color:var(--ink2);letter-spacing:.04em;margin:16px 0 6px;text-transform:uppercase}
.qtext{font-family:'Fraunces',serif;font-weight:600;font-size:23px;line-height:1.2;margin:0 0 20px}
.qopts{display:flex;flex-direction:column;gap:9px}
.qopt{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;
  background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:15px 17px;cursor:pointer;
  font-family:inherit;font-size:15px;font-weight:500;transition:.16s}
.qopt:hover{border-color:var(--ink);background:#fff;transform:translateX(3px)}
.qopt svg{color:var(--gold);flex:none}
.qback{margin-top:16px;border:0;background:transparent;color:var(--ink2);font-family:inherit;font-weight:600;cursor:pointer;font-size:14px}

.result{background:#fff;border:1px solid var(--line);border-left:5px solid var(--rc);border-radius:18px;
  padding:clamp(20px,3vw,30px);box-shadow:var(--shadow);max-width:680px;animation:rise .4s both}
.result-badge{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:14px;color:var(--rc);
  background:color-mix(in srgb,var(--rc) 12%,transparent);padding:7px 14px;border-radius:99px}
.result h3{font-family:'Fraunces',serif;font-weight:600;font-size:24px;margin:16px 0 10px;line-height:1.15}
.result p{font-size:15px;line-height:1.65;color:var(--ink2);margin:0}
.result-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:22px}
.result-hint{font-size:13px;color:var(--ink2)}
.result-hint b{color:var(--ink)}
.inlinelink{border:0;background:transparent;font-family:inherit;font-size:inherit;font-weight:700;color:var(--ink);
  cursor:pointer;padding:0;border-bottom:2px solid var(--gold);line-height:1.1;transition:.15s}
.inlinelink:hover{color:var(--clay);border-color:var(--clay)}

/* cost */
.costgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:720px){.costgrid{grid-template-columns:1fr}.honest-glow{display:none}}
.costcontrols,.costreadout{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:var(--shadow)}
.ctl-label{display:block;font-size:13px;font-weight:700;color:var(--ink2);text-transform:uppercase;letter-spacing:.04em;margin:0 0 10px}
.ctl-label:not(:first-child){margin-top:22px}
.routetabs{display:flex;flex-direction:column;gap:7px}
.routetab{text-align:left;background:var(--paper);border:1px solid var(--line);border-radius:10px;
  padding:12px 14px;font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer;transition:.15s}
.routetab:hover{border-color:var(--ink)}
.routetab.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.route-desc{font-size:13.5px;line-height:1.55;color:var(--ink2);margin:13px 0 0}
.stepper{display:inline-flex;align-items:center;gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.stepper button{width:42px;height:40px;border:0;background:var(--paper);font-size:20px;cursor:pointer;color:var(--ink);font-family:inherit}
.stepper button:hover{background:var(--paper2)}
.stepper span{width:52px;text-align:center;font-weight:700;font-size:16px}
.checkrow{display:flex;align-items:center;gap:9px;margin-top:18px;font-size:14px;color:var(--ink2);cursor:pointer}
.checkrow input{width:17px;height:17px;accent-color:var(--sage)}
.estbig{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(34px,6vw,46px);letter-spacing:-.02em;line-height:1;color:var(--clay)}
.estsub{font-size:13.5px;color:var(--ink2);margin-top:6px}
.bars{margin:24px 0 0;display:flex;flex-direction:column;gap:12px}
.barrow{display:grid;grid-template-columns:64px 1fr 64px;align-items:center;gap:10px;font-size:13px;color:var(--ink2)}
.barrow b{text-align:right;color:var(--ink);font-size:13.5px}
.bartrack{height:10px;background:var(--paper2);border-radius:99px;overflow:hidden}
.barfill{height:100%;border-radius:99px;transition:width .4s cubic-bezier(.2,.7,.2,1)}
.barfill.lo{background:var(--sage)}
.barfill.hi{background:linear-gradient(90deg,var(--gold),var(--clay))}
.cost-of-not{display:flex;gap:10px;align-items:flex-start;margin-top:22px;background:var(--paper2);border-radius:12px;padding:14px;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.cost-of-not svg{color:var(--sage);flex:none;margin-top:2px}
.cost-of-not b{color:var(--ink)}

/* diy */
.diylist{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0;counter-reset:none}
.diystep{display:flex;gap:16px;padding:20px 0;border-bottom:1px solid var(--line)}
.diystep:last-child{border-bottom:0}
.diynum{font-family:'Fraunces',serif;font-weight:600;font-size:16px;color:#fff;width:34px;height:34px;flex:none;
  border-radius:50%;display:grid;place-items:center;background:linear-gradient(150deg,var(--gold),var(--clay))}
.diystep h4{font-size:16.5px;margin:4px 0 6px}
.diystep p{font-size:14.5px;line-height:1.6;color:var(--ink2);margin:0}
.tipbox{margin-top:30px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:var(--shadow)}
.tipbox.warm{background:color-mix(in srgb,var(--sage) 7%,#fff)}
.tipbox h4{display:flex;align-items:center;gap:8px;font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin:0 0 12px}
.tipbox h4 svg{color:var(--gold)}
.tipbox ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.tipbox li{font-size:14px;line-height:1.55;color:var(--ink2)}
.tipbox i{color:var(--ink);font-style:italic}

/* help */
.helpgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.helpcard{position:relative;display:block;text-decoration:none;color:inherit;background:#fff;border:1px solid var(--line);
  border-radius:16px;padding:22px;transition:.2s;box-shadow:var(--shadow)}
.helpcard:hover{transform:translateY(-3px);border-color:var(--gold)}
.helpcard.star{border-color:var(--sage);background:color-mix(in srgb,var(--sage) 6%,#fff)}
.starbadge{position:absolute;top:-10px;left:18px;font-size:11px;font-weight:700;color:#fff;background:var(--sage);padding:4px 10px;border-radius:99px;letter-spacing:.03em}
.helpcard h4{display:flex;align-items:center;gap:7px;font-size:16px;margin:0 0 7px}
.helpcard h4 svg{color:var(--ink2)}
.helpcard p{font-size:13.5px;line-height:1.55;color:var(--ink2);margin:0}

/* eligibility additions */
.statepick{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);
  border-radius:13px;padding:6px 14px;max-width:520px;margin-bottom:18px;box-shadow:var(--shadow);color:var(--ink2);flex-wrap:wrap}
.stateselect{flex:1;min-width:180px;border:0;background:transparent;font-family:inherit;font-size:15px;font-weight:500;color:var(--ink);padding:8px 0;outline:none;cursor:pointer}
.climatechip{font-size:12px;font-weight:700;color:var(--cc);background:color-mix(in srgb,var(--cc) 13%,transparent);
  border:1px solid color-mix(in srgb,var(--cc) 35%,transparent);padding:4px 10px;border-radius:99px;white-space:nowrap}
.qhelp{font-size:13.5px;line-height:1.5;color:var(--ink2);margin:-12px 0 18px}
.qopt.sel{border-color:var(--ink);background:#fff}

.scorehead{display:flex;gap:26px;align-items:center;flex-wrap:wrap}
.scoreleft{flex:none}
.scorenum{font-family:'Fraunces',serif;font-weight:600;font-size:58px;line-height:.9;letter-spacing:-.03em;margin-top:12px}
.scorenum span{font-size:22px;color:var(--ink2);font-weight:500}
.scorelabel{font-weight:700;font-size:16px;margin-top:6px}
.gauge{flex:1;min-width:240px}
.gaugetrack{position:relative;height:12px;border-radius:99px;
  background:linear-gradient(90deg,var(--clay) 0%,#C9701F 38%,var(--gold) 60%,var(--sage) 100%)}
.gaugemark{position:absolute;top:50%;width:20px;height:20px;border-radius:50%;background:#fff;
  border:3px solid var(--ink);transform:translate(-50%,-50%);box-shadow:0 2px 6px rgba(0,0,0,.25);transition:left .5s cubic-bezier(.2,.7,.2,1)}
.gaugescale{display:flex;justify-content:space-between;font-size:11px;color:var(--ink2);margin-top:9px;font-weight:600;letter-spacing:.01em}
.gaugestate{display:flex;align-items:flex-start;gap:6px;font-size:12.5px;line-height:1.45;color:var(--ink2);
  margin-top:14px;padding:9px 12px;border-radius:10px;background:color-mix(in srgb,var(--cc) 9%,transparent)}
.gaugestate svg{color:var(--cc);flex:none;margin-top:1px}
.gaugestate b{color:var(--cc)}
.scoreblurb{font-size:15px;line-height:1.6;color:var(--ink2);margin:22px 0 0}

.factorgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px}
@media(max-width:560px){.factorgrid{grid-template-columns:1fr}.scorehead{gap:14px}}
.factorcol{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:16px}
.factorcol.pro h5{color:var(--sage)}
.factorcol.con h5{color:var(--clay)}
.factorcol h5{display:flex;align-items:center;gap:7px;font-size:13px;margin:0 0 11px;text-transform:uppercase;letter-spacing:.04em}
.factor{display:block;font-size:13.5px;line-height:1.45;color:var(--ink);padding:7px 0;border-top:1px solid var(--line)}
.factor:first-of-type{border-top:0}
.factor.muted{color:var(--ink2)}

/* ---- panic button & breathing ---- */
.panicfab{position:fixed;right:16px;bottom:16px;z-index:295;display:inline-flex;align-items:center;gap:8px;
  font-family:'Hanken Grotesk',sans-serif;font-weight:700;font-size:14px;color:#fff;background:var(--clay);
  border:0;border-radius:99px;padding:13px 19px;cursor:pointer;transition:.18s;
  box-shadow:0 10px 30px rgba(184,85,57,.45);animation:fabpulse 2.8s ease-in-out infinite}
.panicfab:hover{transform:translateY(-2px);background:#a4462e}
/* compact circle while a game page is open so it never crowds the controls */
.main:has(.gameveil) ~ .panicfab{width:48px;height:48px;padding:0;justify-content:center;right:14px;bottom:14px}
.main:has(.gameveil) ~ .panicfab .fablabel{display:none}
@keyframes fabpulse{0%,100%{box-shadow:0 10px 30px rgba(184,85,57,.45)}50%{box-shadow:0 10px 40px rgba(184,85,57,.78)}}

.breathwrap{display:flex;flex-direction:column;align-items:center;gap:22px;padding:26px 0 14px}

/* calm overlay (struggling flow) */
.calmveil{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:18px;overflow-y:auto;
  background:linear-gradient(168deg,rgba(231,240,234,.97),rgba(250,244,234,.97));
  backdrop-filter:blur(5px);animation:rise .35s both}
.calmcard{max-width:460px;width:100%;max-height:92vh;overflow-y:auto;background:#fff;
  border:1px solid var(--line);border-radius:26px;padding:30px 26px 22px;text-align:center;
  box-shadow:0 30px 80px rgba(60,40,20,.16)}
.calmeyebrow{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;
  letter-spacing:.12em;text-transform:uppercase;color:var(--sage);
  background:color-mix(in srgb,var(--sage) 9%,transparent);border-radius:99px;padding:6px 14px}
.calmh{font-family:'Fraunces',serif;font-weight:600;font-size:24px;line-height:1.15;margin:14px 0 6px;color:var(--ink)}
.calmsub{font-size:14px;line-height:1.55;color:var(--ink2);margin:0}
.breathstage{display:grid;place-items:center;padding:46px 0 38px}
.breathcircle{width:160px;height:160px;border-radius:50%;display:grid;place-items:center;text-align:center;
  background:radial-gradient(circle at 35% 28%,#9ad8c2,var(--sage));color:#fff;
  transition:transform 3.9s cubic-bezier(.45,0,.55,1);
  box-shadow:0 0 0 14px color-mix(in srgb,var(--sage) 10%,transparent),
             0 0 0 30px color-mix(in srgb,var(--sage) 5%,transparent),
             0 14px 34px color-mix(in srgb,var(--sage) 30%,transparent)}
.breathcircle.bigc{transform:scale(1.26)}
.breathcircle.smallc{transform:scale(.8)}
.breathlabel{font-family:'Fraunces',serif;font-size:19px;font-weight:600}
.breathmeta{font-size:12.5px;color:var(--ink2);letter-spacing:.03em;margin:0}
.calmskip{display:block;margin:18px auto 0;border:0;background:transparent;font-family:inherit;
  font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;padding:6px 10px;border-radius:8px}
.calmskip:hover{color:var(--ink);background:var(--paper2)}
.calmopts{display:flex;flex-direction:column;gap:9px;margin:18px 0 4px}
.calmopt{display:flex;align-items:center;gap:13px;font-family:inherit;text-align:left;cursor:pointer;
  background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:13px 15px;transition:.15s}
.calmopt:hover{border-color:var(--sage);background:#fff;transform:translateX(3px)}
.calmoptem{font-size:23px;flex:none}
.calmopt>span:not(.calmoptem){flex:1;font-size:14.5px;font-weight:700;color:var(--ink)}
.calmopt small{display:block;font-size:12px;font-weight:500;color:var(--ink2);margin-top:2px}
.calmopt svg{color:var(--sage);flex:none}
.calmcontacts{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:14px 0 2px}
.calmfoot{font-size:12.5px;line-height:1.55;color:var(--ink2);margin:12px 0 6px}
.calmfoot a{color:var(--clay);font-weight:700}
.calmlog{background:var(--paper2);border-radius:14px;padding:14px;margin:10px 0 2px;text-align:left}
.calmlog .tksub{display:block;margin-bottom:6px}
.calmcard .whycard{margin:18px 0 0}
.loggedok{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--sage);margin-top:6px}

/* ---- toolkit ---- */
.privacybar{display:flex;gap:9px;align-items:flex-start;background:color-mix(in srgb,var(--sage) 8%,#fff);
  border:1px solid var(--line);border-radius:14px;padding:13px 16px;font-size:13.5px;line-height:1.55;
  color:var(--ink2);margin-bottom:18px}
.privacybar svg{color:var(--sage);flex:none;margin-top:2px}
.privacybar b{color:var(--ink)}
.tkcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:var(--shadow);margin-bottom:16px}
.tkcard h4{display:flex;gap:9px;align-items:center;font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin:0 0 6px}
.tkcard h4 svg{color:var(--sage)}
.tksub{font-size:13px;color:var(--ink2);margin:0 0 12px;line-height:1.55}
.tksub b{color:var(--ink)}
.tkinput{font-family:inherit;font-size:14.5px;color:var(--ink);background:var(--paper);border:1px solid var(--line);
  border-radius:10px;padding:10px 12px;outline:none;width:100%;transition:.15s}
.tkinput:focus{border-color:var(--sage);background:#fff}
textarea.tkinput{resize:vertical;min-height:62px}
.tkrow{display:flex;gap:8px;margin-bottom:8px}
.daysbig{font-family:'Fraunces',serif;font-weight:600;font-size:46px;color:var(--sage);letter-spacing:-.02em}
.dayssub{font-size:13px;color:var(--ink2)}
.chiprow{display:flex;flex-wrap:wrap;gap:8px}
.sobchip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--ink2);
  background:var(--paper2);border:1px dashed var(--line);border-radius:99px;padding:7px 13px;opacity:.6}
.sobchip.earned{color:#7a5510;background:linear-gradient(150deg,#FCE9BF,#F3CE7C);border:1px solid #E0B95E;
  opacity:1;box-shadow:var(--shadow)}
.sobchip.earned svg{color:#B07C1F}
.urgechart{width:100%;max-width:340px;display:block;background:var(--paper2);border-radius:10px;padding:6px}
.loglist{display:flex;flex-direction:column;gap:6px;margin-top:14px;max-height:230px;overflow-y:auto}
.logitem{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:13px;color:var(--ink2);
  background:var(--paper);border:1px solid var(--line);border-radius:9px;padding:8px 11px}
.logitem b{color:var(--ink)}
.logdel{border:0;background:none;color:var(--clay);cursor:pointer;padding:2px;display:grid;place-items:center}
.slider{width:100%;accent-color:var(--clay)}

/* state fact cells */
.factrow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:520px){.factrow{grid-template-columns:1fr}}
.factcell{background:var(--paper2);border-radius:12px;padding:13px 15px}
.factlabel{display:block;font-size:10.5px;font-weight:800;letter-spacing:.08em;color:var(--ink2);text-transform:uppercase;margin-bottom:4px}
.factval{font-size:14px;font-weight:600;color:var(--ink);line-height:1.45}

/* diary + export */
.exportbtn{margin-left:auto;flex:none;white-space:nowrap}
@media(max-width:560px){.privacybar{flex-wrap:wrap}.exportbtn{margin-left:0;width:100%;justify-content:center}}
.diarylist{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.diaryitem{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.diaryhead{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;font-weight:700;
  letter-spacing:.04em;color:var(--ink2);text-transform:uppercase;margin-bottom:6px}
.diaryitem p{font-size:14px;line-height:1.6;color:var(--ink);margin:0;white-space:pre-wrap}

/* why card */
.whycard{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid var(--line);
  border-left:4px solid var(--gold);border-radius:13px;padding:12px 14px;margin-top:14px;text-align:left}
.whycard.smallw{margin:14px 0 6px}
.whycard img{width:56px;height:56px;border-radius:10px;object-fit:cover;flex:none}
.whylabel{font-size:10.5px;font-weight:800;letter-spacing:.1em;color:var(--gold);text-transform:uppercase}
.whycard p{font-size:14px;line-height:1.45;color:var(--ink);margin:2px 0 0;font-style:italic}

/* your road */
.road{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px}
.roadstop{text-align:left;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;
  cursor:pointer;font-family:inherit;transition:.18s}
.roadstop:hover{border-color:var(--sage);transform:translateY(-2px);box-shadow:var(--shadow)}
.roadnum{display:inline-flex;align-items:center;gap:6px;font-family:monospace;font-weight:700;font-size:10.5px;
  color:var(--sage);letter-spacing:.12em}
.roadstop h4{font-size:14.5px;margin:7px 0 4px}
.roadstop p{font-size:12.5px;color:var(--ink2);margin:0;line-height:1.45}
.herodays{display:inline-flex;align-items:center;margin-top:20px;font-size:14px;font-weight:600;color:#7a5510;
  background:linear-gradient(150deg,#FCE9BF,#F3CE7C);border:1px solid #E0B95E;border-radius:99px;
  padding:9px 17px;box-shadow:var(--shadow)}
.herodays b{font-weight:800}

/* daily check-in */
.moodrow{display:flex;gap:8px;flex-wrap:wrap}
.moodbtn{font-size:23px;background:var(--paper);border:2px solid var(--line);border-radius:12px;
  width:46px;height:46px;cursor:pointer;transition:.15s;display:grid;place-items:center}
.moodbtn:hover{border-color:var(--gold)}
.moodbtn.on{border-color:var(--sage);background:color-mix(in srgb,var(--sage) 10%,#fff);transform:scale(1.08)}
.haltrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.haltchip{font-family:inherit;font-size:12.5px;font-weight:700;padding:8px 15px;border-radius:99px;
  border:1.5px solid var(--line);background:#fff;cursor:pointer;color:var(--ink2);transition:.15s}
.haltchip:hover{border-color:var(--ink)}
.haltchip.on{border-color:var(--clay);color:var(--clay);background:color-mix(in srgb,var(--clay) 9%,#fff)}

/* savings + data controls */
.savedbig{font-family:'Fraunces',serif;font-weight:600;font-size:38px;color:#B07C1F;letter-spacing:-.02em}
.datarow{display:flex;gap:8px;flex-wrap:wrap}
.dangerbtn{background:#fff;border:1px solid var(--clay);color:var(--clay)}
.dangerbtn:hover{transform:translateY(-1px)}
.dangerbtn.armed{background:var(--clay);color:#fff;animation:none}

/* printable report */
.reportveil{position:fixed;inset:0;z-index:320;background:rgba(23,20,32,.62);backdrop-filter:blur(3px);
  display:flex;flex-direction:column;align-items:center;overflow-y:auto;padding:20px 16px 90px}
.reportsheet{background:#fff;color:#191512;max-width:660px;width:100%;border-radius:14px;
  padding:30px 32px;font-size:13px;line-height:1.55;box-shadow:0 24px 70px rgba(0,0,0,.4)}
.reportsheet h1{font-family:'Fraunces',serif;font-weight:600;font-size:22px;margin:0 0 4px;color:#191512}
.repmeta{font-size:11.5px;color:#6b6258;margin:0 0 18px;padding-bottom:12px;border-bottom:2px solid #3C7A66}
.reportsheet h2{font-family:'Fraunces',serif;font-weight:600;font-size:15px;margin:18px 0 6px;color:#3C7A66}
.reportsheet p{margin:0 0 8px}
.reporttable{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px}
.reporttable th{text-align:left;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#6b6258;
  border-bottom:1.5px solid #d8cfc0;padding:5px 8px 5px 0}
.reporttable td{border-bottom:1px solid #ece4d6;padding:6px 8px 6px 0;vertical-align:top}
.repfoot{font-size:11px;color:#6b6258;margin-top:20px;padding-top:10px;border-top:1px solid #ece4d6}
.reportbar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:321}
.reportbar .btn{box-shadow:0 8px 26px rgba(0,0,0,.35)}
@media print{
  body *{visibility:hidden !important}
  .printable,.printable *{visibility:visible !important}
  .printable{position:absolute !important;left:0;top:0;width:100%;max-width:100%;border-radius:0;
    box-shadow:none;padding:0}
  .noprint{display:none !important}
}

/* reduced motion */
@media (prefers-reduced-motion: reduce){
  .panicfab,.page,.encourage-toast,.rewardveil,.detail,.gamebox,.result{animation:none !important}
  .gameover-tag,.fear-tag{animation:none !important;opacity:1}
  .scrollcue svg{animation:none !important}
  .breathcircle{transition:none !important}
  .urgefill,.barfill,.gaugemark{transition:none !important}
  .btn:hover,.statebtn:hover,.stepcard:hover,.gamecard:hover,.roadstop:hover,.subpill:hover,
  .helpcard:hover,.rescard:hover,.excard:hover{transform:none !important}
}

/* welcome tour */
.welcomecard h3{font-family:'Fraunces',serif;font-weight:600;font-size:25px;text-align:center;margin:6px 0 12px}
.welcomecard>p{font-size:14.5px;line-height:1.65;color:var(--ink2);text-align:center;margin:0 0 12px}
.welcomelogo{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;color:#fff;
  background:linear-gradient(150deg,var(--gold),var(--clay));box-shadow:var(--shadow);margin:0 auto 14px}
.welcomedots{display:flex;gap:7px;justify-content:center;margin-bottom:16px}
.wdot{width:8px;height:8px;border-radius:50%;background:var(--line);transition:.25s}
.wdot.on{background:var(--sage);transform:scale(1.15)}
.goalgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0 20px}
@media(max-width:440px){.goalgrid{grid-template-columns:1fr}}
.goalchip{display:flex;align-items:center;gap:10px;font-family:inherit;font-size:14px;font-weight:600;
  color:var(--ink);background:#fff;border:2px solid var(--line);border-radius:13px;padding:14px;cursor:pointer;
  transition:.15s;text-align:left}
.goalchip:hover{border-color:var(--gold)}
.goalchip.on{border-color:var(--sage);background:color-mix(in srgb,var(--sage) 9%,#fff);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--sage) 22%,transparent)}
.goalem{font-size:22px}
.welcomefield{margin:0 0 16px;text-align:left}
.welcomefield .tksub{display:block;margin-bottom:8px}
.planlist{display:flex;flex-direction:column;gap:9px;margin:14px 0 16px}
.planitem{display:flex;align-items:center;justify-content:space-between;gap:10px;font-family:inherit;
  text-align:left;background:var(--paper);border:1.5px solid var(--line);border-radius:13px;padding:14px 15px;
  cursor:pointer;transition:.15s}
.planitem:hover{border-color:var(--sage);transform:translateX(3px)}
.planitem b{display:block;font-size:14.5px;color:var(--ink)}
.planitem span{display:block;font-size:12.5px;line-height:1.45;color:var(--ink2);margin-top:3px}
.planitem svg{color:var(--sage);flex:none}
.welcomecrisis{display:flex;gap:9px;align-items:flex-start;background:color-mix(in srgb,var(--clay) 8%,#fff);
  border:1px solid color-mix(in srgb,var(--clay) 25%,transparent);border-radius:12px;padding:12px 14px;
  font-size:13px;line-height:1.55;color:var(--ink2);text-align:left;margin-bottom:16px}
.welcomecrisis svg{color:var(--clay);flex:none;margin-top:2px}
.welcomecrisis b{color:var(--clay)}
.tourlink{display:block;margin:16px auto 0;border:0;background:transparent;font-family:inherit;
  font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;border-bottom:1.5px solid var(--line);padding:2px 0}
.tourlink:hover{color:var(--ink);border-color:var(--gold)}
.aboutlink{border:0;background:transparent;font-family:inherit;font-size:12.5px;font-weight:700;
  color:var(--ink2);cursor:pointer;padding:0;border-bottom:1.5px solid var(--line)}
.aboutlink:hover{color:var(--ink);border-color:var(--gold)}
.aboutblock{text-align:left;margin:14px 0}
.aboutblock>b{display:block;font-size:13px;color:var(--ink);margin-bottom:6px}
.aboutlist{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px}
.aboutlist li{font-size:13px;line-height:1.5;color:var(--ink2)}
.dbcredit{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sand);
  text-align:center;margin:2px 0 10px}
.dbwatermark{position:fixed;right:16px;bottom:86px;z-index:15;opacity:.42;pointer-events:none;
  filter:drop-shadow(0 1px 2px rgba(60,40,20,.12))}
@media print{.dbwatermark,.panicfab{display:none !important}}
/* keep the minute-by-minute toast clear of game controls */
.gameveil ~ .encourage-toast{bottom:210px}

/* consent gate */
.consentveil{position:fixed;inset:0;z-index:400;display:grid;place-items:center;padding:18px;overflow-y:auto;
  background:linear-gradient(168deg,rgba(231,240,234,.985),rgba(250,244,234,.985))}
.consentcard{max-width:470px}
.consentcrisis{font-size:12.5px;line-height:1.55;color:var(--ink2);text-align:center;margin:14px 0 0}
.consentcrisis a{color:var(--clay);font-weight:700}
.legallinks{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:14px 0 16px}
.legallinks button{font-family:inherit;font-size:12.5px;font-weight:700;color:var(--pine);background:#fff;
  border:1.5px solid var(--line);border-radius:99px;padding:8px 14px;cursor:pointer;transition:.15s}
.legallinks button:hover{border-color:var(--pine)}

/* legal document viewer */
.legalveil{position:fixed;inset:0;z-index:450;display:grid;place-items:center;padding:14px;
  background:rgba(36,29,23,.55);backdrop-filter:blur(4px);animation:rise .25s both}
.legalcard{background:var(--paper);border:1px solid var(--line);border-radius:20px;max-width:620px;width:100%;
  max-height:90vh;display:flex;flex-direction:column;padding:22px;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.legalhead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
  border-bottom:2px solid var(--pine);padding-bottom:12px;margin-bottom:4px}
.legalhead h3{font-family:'Fraunces',serif;font-weight:600;font-size:22px;margin:0}
.legaldate{font-size:11.5px;color:var(--ink2)}
.legalclose{background:var(--paper2);color:var(--ink)}
.legalclose:hover{background:var(--line)}
.legalbody{overflow-y:auto;flex:1;padding:10px 2px 14px}
.legalbody section{margin-bottom:14px}
.legalbody h4{font-size:13.5px;margin:0 0 4px;color:var(--pine)}
.legalbody p{font-size:13px;line-height:1.6;color:var(--ink2);margin:0}

/* game page (full screen, no scrolling) */
.gameveil{position:fixed;inset:0;z-index:290;background:#171420;display:flex;justify-content:center;animation:rise .25s both}
.gamemodal{width:100%;max-width:480px;height:100%;display:flex;flex-direction:column;
  padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px))}
.gamemodalhead{flex:none;display:flex;align-items:center;gap:10px;padding:4px 2px 8px;
  font-family:monospace;font-weight:700;letter-spacing:.1em;font-size:13px;color:#F2E3C6}
.modaltitle{flex:1}
.modalurge{font-size:11px;color:#9b93ab;letter-spacing:.08em}
.gameclose{border:0;background:#2a2435;color:#F2E3C6;width:38px;height:38px;border-radius:10px;
  cursor:pointer;display:grid;place-items:center;flex:none;transition:.15s}
.gameclose:hover{background:#3a3354}
.gamemodal .gamebox{flex:1;min-height:0;border:0;background:transparent;box-shadow:none;
  padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.gamemodal .gamecanvas{width:auto;height:auto;max-width:min(92vw,360px);max-height:46vh}
.gamemodal .gamecanvas.tall{max-height:52vh;max-width:min(70vw,240px)}
.gamemodal .gamehint{font-size:11.5px;line-height:1.45;max-width:340px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

/* memory match */
.memgrid{display:grid;grid-template-columns:repeat(4,64px);gap:8px;justify-content:center;padding:6px 0}
@media(max-width:380px){.memgrid{grid-template-columns:repeat(4,56px)}.memcard{height:56px !important;font-size:24px !important}}
.memcard{height:64px;font-size:28px;border-radius:12px;cursor:pointer;border:2px solid #3a3354;
  background:#2a2435;color:#5c5470;display:grid;place-items:center;transition:.18s;font-family:serif}
.memcard:hover{border-color:#F2C14E}
.memcard.up{background:#F2E3C6;border-color:#F2C14E;transform:scale(1.04)}
.memcard.got{background:color-mix(in srgb,#7CC66B 30%,#F2E3C6);border-color:#7CC66B;cursor:default}

/* hobby finder */
.intgrid{display:flex;flex-wrap:wrap;gap:9px;margin-top:6px}
.intchip{display:inline-flex;align-items:center;gap:7px;font-family:inherit;font-size:13px;font-weight:600;
  color:var(--ink2);background:#fff;border:1.5px solid var(--line);border-radius:99px;padding:9px 15px;
  cursor:pointer;transition:.15s}
.intchip:hover{border-color:var(--gold)}
.intchip.on{border-color:var(--sage);color:var(--ink);background:color-mix(in srgb,var(--sage) 9%,#fff);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--sage) 18%,transparent)}
.hobbygrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px}
.hobbycard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px 20px;
  box-shadow:var(--shadow);transition:.18s}
.hobbycard:hover{transform:translateY(-2px);border-color:var(--sage)}
.hobbyhead{display:flex;align-items:center;gap:13px;margin-bottom:12px}
.hobbyem{font-size:30px;flex:none}
.hobbyname h4{font-size:16px;margin:0 0 5px}
.costbadge{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.04em;border-radius:99px;padding:4px 10px}
.costbadge[data-tier="1"]{color:var(--sage);background:color-mix(in srgb,var(--sage) 12%,transparent)}
.costbadge[data-tier="2"]{color:#9a6b14;background:color-mix(in srgb,var(--gold) 16%,transparent)}
.costbadge[data-tier="3"]{color:var(--clay);background:color-mix(in srgb,var(--clay) 11%,transparent)}
.hobbytip{font-size:13px;line-height:1.55;color:var(--ink2);padding:8px 0;border-top:1px solid var(--line)}
.hobbytip b{color:var(--ink)}

/* footer */
.foot{position:relative;z-index:1;max-width:1080px;margin:0 auto;display:flex;gap:10px;align-items:flex-start;
  padding:20px clamp(16px,4vw,40px) 40px;border-top:1px solid var(--line);font-size:12.5px;line-height:1.55;color:var(--ink2)}
.foot svg{color:var(--clay);flex:none;margin-top:1px}
`}</style>
  );
}
