# Executive Legal & Compliance Audit - SeaHype Marine Biology Education

**Version:** 1.0.0  **Date:** 5 July 2026  **Operator alias:** openMarineDB

> Prepared as an engineering/compliance self-assessment for release readiness. This
> is not legal advice. A licensed attorney should review before public release.

## 1. Summary of legal improvements made
- **First-launch consent gate.** The App now blocks access until the user
  affirmatively accepts the Terms and Privacy Policy ("I Agree"). Acceptance is stored
  with a version stamp and date; a version bump re-prompts on material changes. The
  gate is bypassable only to read the legal documents themselves.
- **Comprehensive in-app legal center.** A tabbed Legal & privacy screen presents
  Terms of Service, Privacy Policy, Disclaimer, and Copyright & notices, reachable
  from the consent screen and from Settings.
- **Full Terms of Service** covering acceptance, assumption of risk, no-professional-
  advice, no-guarantee, acceptable use, IP, user content, AI content, third-party and
  external-link disclaimers, availability, warranty disclaimer, limitation of
  liability, indemnification, force majeure, governing law, arbitration, class-action
  waiver, termination, changes, severability, entire agreement, and contact.
- **Privacy Policy** accurately reflecting a no-collection, offline, on-device design,
  with COPPA/GDPR/CCPA sections.
- **Context disclaimers** retained where relevant (educational purpose, verify
  critical info, safety around water/wildlife, illustrations are diagrams, no
  affiliation with cited organisations).
- **Configurable legal constants** (governing law, contact) with graceful fallbacks
  so no raw placeholder text is shown to users if left unset.
- **Standalone legal pack** (this folder) for store listings and a website.

## 2. Remaining legal risks that cannot be eliminated contractually
- **Content accuracy.** Educational statements can contain errors; disclaimers reduce
  but do not remove exposure. Mitigation: sourced content + "verify" disclaimers.
- **Downstream user conduct.** Real-world water/wildlife activity carries inherent
  risk regardless of disclaimers. Mitigation: explicit safety disclaimer + assumption
  of risk.
- **Jurisdictional variation.** Enforceability of liability caps, arbitration, and
  class-action waivers varies by jurisdiction and for minors. Mitigation: "to the
  fullest extent permitted by law" framing; attorney review required.
- **Placeholders unset.** Governing law and contact must be set before release, or
  arbitration/contact clauses are weakened.
- **Store policy drift.** App-store and platform policies change; periodic review
  needed.

## 3. Compliance checklist
| Area | Status | Notes |
|---|---|---|
| GDPR / UK GDPR | PASS (by design) | No personal data processed or transferred; no controller relationship. |
| CCPA / CPRA | PASS (by design) | No sale/share; no personal information collected. |
| COPPA (children) | PASS (by design) | No knowing collection from minors; parental acceptance flow. |
| WCAG 2.1 accessibility | STRONG | Dialog semantics, nav landmarks + aria-current, labeled controls, keyboard + screen-reader paths, contrast; independent full audit recommended. |
| CAN-SPAM | N/A | No email is sent by the App. |
| AI transparency | PASS | No runtime AI; disclosed in Terms. |
| Open-source license compliance | PASS | React/ReactDOM MIT reproduced; no other runtime deps. |
| Third-party attribution | PASS | Sources cited; no-endorsement statements included. |
| App Store Review Guidelines | ACTION | Set contact + privacy "nutrition label" = no data collected; verify age rating. |
| Google Play policies | ACTION | Complete Data safety form = no data collected/shared; Families policy if targeting children. |

## 4. Security checklist
| Item | Status |
|---|---|
| No secrets / API keys in shipped file | PASS (verified) |
| No backend / accounts / auth to attack | PASS (architecture) |
| No runtime network calls (offline) | PASS (verified: no external script/style/img) |
| XSS: user input escaped | PASS (verified: display-name payload inert) |
| Injection / CSRF / session risks | N/A (no server/session) |
| Secure local storage handling | PASS (device-local, user-erasable) |
| No sensitive logging | PASS (no telemetry) |
| Dependency currency | ACTION (keep React current) |
| HTTPS / signed distribution | ACTION (operator deployment) |

## 5. Documentation checklist
| Document | Status |
|---|---|
| Terms of Service | DONE (in-app + standalone) |
| Privacy Policy | DONE (in-app + standalone) |
| Disclaimer | DONE (in-app + standalone) |
| Cookie Policy | DONE (standalone) |
| Open-source acknowledgements / licenses | DONE (standalone) |
| Security overview | DONE (standalone) |
| About / version / release notes | DONE (in-app "What's new") |
| Contact | PLACEHOLDER (operator must set) |

## 6. Production-readiness assessment
**Legally: release-ready pending three operator actions** - (a) set governing law,
(b) set a real contact channel, (c) complete the store privacy declarations (both
stores: "no data collected"). With those set, the App presents a strong, honest,
low-exposure legal posture backed by a privacy-by-design architecture.

## 7. Recommended attorney review before public release
- Enforceability of liability limitation, arbitration, and class-action waiver in the
  chosen governing jurisdiction and for a child audience.
- Confirmation that the consent mechanism is adequate for minors in target markets
  (some jurisdictions require verifiable parental consent even absent data
  collection).
- Final review of Terms/Privacy against the specific distribution channels used.
