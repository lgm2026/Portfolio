# Mobile Mechanic Open Source — Developer Handoff Document
**Session Date:** June 2026  
**File:** `MobileMechanic.jsx` — 1,919 lines, single-file React JSX  
**Status:** Feature-complete Phase 1 · Phase 2 ready to build

---

## 1. CRITICAL PARSER RULES — READ FIRST

The artifact renderer uses an older Babel standalone build. These rules are **non-negotiable** — violating any one of them causes the exact error `Unexpected token, expected ";" (484:69)`:

| Rule | Detail |
|---|---|
| **No `?.` optional chaining** | Any form — `?.prop`, `?.[idx]`, `?.method()` — use `(x&&x.prop)` |
| **No `??` nullish coalescing** | Use `(x !== null && x !== undefined ? x : fallback)` |
| **No regex literals in `.map()`/`.filter()` callbacks** | Use `indexOf`/`slice`/`split` instead |
| **No ternary `?` immediately before `.property`** in `.map()` | Parser reads `"text"?c.text` as optional chain attempt — use `function(){}` not arrow |
| **No unicode arrows/symbols in JSX text nodes** | `←→↑↓✕✦＋` between `>` and `<` — use `&gt;` HTML entities or ASCII |
| **Use `function(){}` not arrow functions** when ternary is adjacent to `.property` |
| **Photo upload:** use `<label htmlFor="id">` wrapping input, never `.click()` on ref |
| **`blocks` state MUST stay in AppInner** (not local to SchedulePage) |
| **No `overflow:hidden` on sidebar** — hides avatar |
| **Validate with `@babel/standalone` v7.14+** before delivering |

**Test command (run after every edit):**
```bash
npm install @babel/standalone
node -e "
const Babel=require('./node_modules/@babel/standalone');
const fs=require('fs');
const code=fs.readFileSync('MobileMechanic.jsx','utf8');
try{Babel.transform(code,{presets:['react'],filename:'test.jsx'});console.log('CLEAN - Lines:',code.split('\n').length);}
catch(e){const m=e.message.match(/\((\d+):(\d+)\)/);console.log('ERROR at',m&&m[0],'-',e.message.split('\n')[0]);}
"
```

**Renderer line offset:** The GS template literal (lines 3–52, 48 interior lines) causes renderer line count to be `file_line - 48`. Renderer line 484 = our file line ~533. Always check that position after changes.

---

## 2. ARCHITECTURE

```
Single-file React JSX  
Fonts: Barlow Condensed (--fd), Barlow (--fn), Share Tech Mono (--fm)  
CSS vars: --acc:#f97316  --grn --red --blu --ylw --pur --cyn  
All state in AppInner  
No Tailwind — inline styles only  
Babel standalone (browser) for JSX compilation  
```

**State in AppInner:**
```javascript
user, accounts, lastEmail          // Auth
page                               // Navigation
customers, vehicles, jobs          // Core data
blocks                             // Time blocks (MUST stay here)
selJob, showNewJob, newJobPrefill   // Job modals
sideOpen                           // Sidebar
archClients, archVehicles, archJobs // Archive
```

---

## 3. ID SYSTEM

### Client ID
- **Internal (full):** `0001DB765` — 4-digit sequence + initials + phone suffix
- **Display (shown in UI, invoices, all labels):** `DB765` — sequence prefix hidden
- **Phone suffix logic:** Last 3 digits of phone number, **reversed**
  - Phone `123-321-4567` → digits `1233214567` → last 3 `567` → reversed → `765`
  - Landline: `LL01`, `LL02`...
  - International/no phone: `IN01`, `IN02`...

### Vehicle ID
- **Internal:** `V01-0001DB765`
- **Display:** `V01-DB765`
- Logic: vehicle count per client + client ID

### Job ID
- **Internal:** `J001-V01-0001DB765`
- **Display:** `J001-V01-DB765`
- Logic: job count per vehicle + vehicle ID

### Display Helper Functions (already in file)
```javascript
dispCustId(id)   // strips first 4 chars
dispVehId(vid)   // strips seq from embedded client ID
dispJobId(jid)   // strips seq from embedded vehicle/client IDs
```

---

## 4. COMPLETED FEATURES

- **Login / Account System** — account registry with `accounts[]` state, password validation, quick-login card with password prompt modal, last-used account tracking
- **Dashboard** — hex nut avatar hero, New Client / New Vehicle / New Job buttons, upcoming 5 jobs chronological list, stats row
- **Schedule / Calendar** — full month grid, one line per job per day (color = vehicle type color), job ID badge + client name + hours, time blocks as BLK entries, legend, Today section below calendar (updates label on date select), chronological day detail with job cards and block cards
- **Jobs Board** — status tab filters, archive per row
- **Job Detail** — accordion sections, inline editing, services/parts/notes/photos, P&L
- **Client Roster** — search, profile cards
- **Client Profile** — vehicle table → Vehicle Report, job history
- **Vehicle Report** — lifetime stats, service history
- **Add Client Modal** — ID generation preview, phone type flags
- **Add Vehicle Modal** — 8 vehicle types, dynamic fields
- **Log New Job Modal** — 5-step wizard, personal/no-client scheduling
- **Parts Lookup** — AutoZone/O'Reilly/NAPA price comparison, ratings, store links
- **Templates** — pre-built service packages, AI Repair Planner
- **Archive Vault** — clients/vehicles/jobs, restore
- **Sidebar** — profile always visible on collapse, collapse arrow at bottom, floating overlay

---

## 5. FEATURES TO BUILD — PHASE 2

### 5A. Terms & Conditions (First Login Gate)

Show once on **first account creation**, full-screen modal, must scroll and toggle "I understand and agree" before the app unlocks. Acceptance timestamp stored on account record (`termsAcceptedAt`).

**Tone:** Advisory, not prescriptive. "We advise" not "you must."

**Full T&C Text to implement:**

---

**MOBILE MECHANIC — TERMS OF USE & DISCLAIMER**  
*Effective upon account creation*

Welcome to Mobile Mechanic Open Source. By creating an account and using this application, you acknowledge and agree to the following terms. We advise you to read this document carefully before proceeding.

**1. Nature of This Application**  
Mobile Mechanic is a productivity and record-keeping tool designed to assist independent automotive service professionals in organizing their work. It is not a substitute for professional accounting software, legal counsel, tax advisory services, or any other regulated professional service. We advise all users to maintain independent records and consult appropriate professionals for their business compliance needs.

**2. Accuracy of Information**  
The accuracy of all data entered into this application — including client information, vehicle records, service descriptions, invoices, and warranty documentation — is the sole responsibility of the user. We advise users to review all generated documents carefully before presenting them to clients or relying on them for business decisions.

**3. Warranty Templates**  
Any warranty language provided within this application is offered as a general template for informational purposes only. We strongly advise all users to review warranty terms with a licensed attorney before presenting them to clients. The developer makes no representation that the provided warranty language is legally enforceable, complete, or appropriate for any specific jurisdiction or circumstance.

**4. Tax Calculations**  
Tax rates included in this application are based on publicly available information and are provided for convenience only. Tax laws change. We advise users to verify all applicable rates with a qualified tax professional or the relevant revenue authority before issuing any invoice.

**5. Data & Privacy**  
All data entered into this application is stored locally within your session. The developer does not collect, transmit, or retain any client or business information entered into this tool. Users are solely responsible for the security and backup of their records.

**6. Limitation of Liability**  
**The developer of this application expressly disclaims all liability arising from the use of this tool. By using Mobile Mechanic, you acknowledge that you assume all risk associated with its use, including but not limited to errors in invoicing, warranty disputes, data loss, tax miscalculations, and any legal or financial consequences resulting from reliance on information generated by this application. The developer shall not be held liable for any direct, indirect, incidental, or consequential damages of any kind.**

**7. Independent Professional Responsibility**  
This application is a tool. The responsibilities of operating a legitimate, compliant, and ethical automotive service business remain entirely with the user. We advise all users to obtain appropriate business licenses, insurance, and professional advisement relevant to their jurisdiction.

*By toggling the acknowledgment below, you confirm that you have read and understood these terms, and that you voluntarily assume all risks associated with the use of this application.*

[ ] **I have read, understood, and agree to the Terms of Use. I acknowledge that the developer assumes no liability, and that I use this application at my own risk.**

---

**Implementation notes:**
- Show on `accounts.length === 0` first account creation only
- Add `termsAcceptedAt: new Date().toISOString()` to account record on acceptance
- Toggle must be checked AND user must scroll near-bottom before "Create Account" unlocks
- Not shown on subsequent sign-ins

---

### 5B. Invoicing System

**New nav item:** Invoices (receipt icon `🧾`) between Jobs and Parts

**Invoice data structure:**
```javascript
{
  id: uid(),
  invoiceId: "INV-001-DB765",      // display ID
  jobId, customerId, vehicleId,    // references
  createdAt, issuedDate,
  lineItems: [...],                 // auto-populated from job
  taxRate: 0.075,                  // 7.5% Horry County SC
  taxAppliedTo: "parts",           // SC law: labor not taxed
  payments: [                       // partial payment log
    { id, amount, date, method, note }
  ],
  status: "draft"|"issued"|"partial"|"paid"|"void",
  notes: "",
  partsWarranty: { ... },
  shopWarranty: { ... }
}
```

**Tax logic:** 7.5% (6% SC state + 1.5% Horry County LOST) on **parts/materials only**. SC Code § 12-36-910 exempts labor. Display as labeled line item with note: *"Labor not subject to SC sales tax."* Add small asterisk: *"Verify current rate with SC Department of Revenue."*

**Invoice layout (in-app preview + PDF):**
```
[Shop Logo]        [Shop Name]
                   [Address / Phone / Email from account]
─────────────────────────────────────────────────────────
Invoice #: INV-001-DB765              Date: May 6, 2026
Due Date:  May 13, 2026

Bill To:
[Client Name]
[Client Phone / Email]

Vehicle: 2019 Ford F-150 Lariat · V01-DB765
Job Ref: J001-V01-DB765
─────────────────────────────────────────────────────────
SERVICE: Oil Change & Filter
  ↳ Labor     1.5 hrs @ $95.00/hr              $142.50
  ↳ Parts:
    Motorcraft FL-500S Oil Filter × 1           $12.00
    Castrol GTX 5W-30 5qt         × 1           $28.00
                              Service Total:   $182.50

SERVICE: Front Brake Pad Replacement
  ↳ Labor     2.0 hrs @ $95.00/hr              $190.00
  ↳ Parts:
    Bosch BP1234 QuietCast Pads   × 1           $45.00
                              Service Total:   $235.00
─────────────────────────────────────────────────────────
Parts Subtotal:                                 $85.00
  Sales Tax — Parts Only (7.5% Horry Co., SC):   $6.38
Labor Subtotal:                                $332.50
  (Labor exempt — SC Code § 12-36-910)

TOTAL:                                         $424.88
Deposit / Payments Applied:                   -$100.00
BALANCE DUE:                                   $324.88
─────────────────────────────────────────────────────────
Payment History:
  May 6, 2026 · Cash · $100.00 · "Deposit on drop-off"
─────────────────────────────────────────────────────────
[Warranty Section — see below]
[Notes]
Thank you for your business.
```

**PDF generation:** Use `html2canvas` + `jsPDF` via CDN (no install). Capture preview div → export.  
**Email:** `mailto:` link with subject and body pre-filled. PDF as data URI attachment where supported.  
**Logo:** Pull from `user.pic` (account profile photo). Note in UI to upload a shop logo at registration.

---

### 5C. Warranty System (on Invoice)

#### Parts Warranty (per part line item)
```javascript
{
  partId,
  covered: true|false,           // Yes/No toggle
  supplier: "",                  // store/supplier name
  manufacturer: "",              // dropdown selection
  warrantyId: "",                // warranty tag/ID from receipt
  duration: "",                  // e.g. "12 months / 12,000 miles"
  notes: "",
  photo: null                    // base64, label-based file input
}
```

**Manufacturer dropdown:** ACDelco · Bosch · Motorcraft / Ford OEM · Monroe · Gates · Dorman · Moog · Denso · NGK · Standard Motor Products · Fel-Pro · NTK · Delphi · Cardone · Spectra Premium · Custom Entry

**Warranty ID:** User-entered tag (from receipt/sticker). Searchable/filterable across all invoices.

#### Shop Warranty (labor and workmanship — NO parts coverage)

Default terms by service type (applied as checkboxes when services are on the invoice):

| Service | Shop Warranty Term |
|---|---|
| Oil Change & Filter | This shop warrants all labor associated with this service for a period of **90 days or 3,000 miles**, whichever occurs first, against defects in workmanship. |
| Brake Pad / Shoe Replacement | This shop warrants all labor associated with brake service for a period of **12 months or 12,000 miles**, whichever occurs first. Warranty is void if vehicle is used in racing, off-road, or other extreme-duty applications. |
| Rotor / Drum Resurfacing or Replacement | Labor warranted for **12 months or 12,000 miles**. Surface glazing due to operator driving habits is excluded. |
| Tire Rotation | Labor warranted for **30 days**. Tread wear, sidewall damage, and tire integrity are subject to manufacturer warranty only. |
| Wheel Alignment | Labor and alignment specifications warranted for **6 months or 6,000 miles**, provided no subsequent suspension impact or modification has occurred. |
| Tune-Up / Spark Plug Service | Labor warranted for **6 months or 6,000 miles** against improper installation. Performance outcomes are dependent on overall engine condition. |
| Battery Service / Replacement | Installation labor warranted for **30 days**. Battery performance is subject to manufacturer warranty only. |
| Air Filter / Cabin Filter Replacement | Labor warranted for **30 days** against improper installation. |
| Coolant Flush | Labor warranted for **6 months or 6,000 miles**. Warranty is void if overheating occurs due to pre-existing conditions not disclosed prior to service. |
| Transmission Service | Labor warranted for **12 months or 12,000 miles** against workmanship defects. Warranty is void if vehicle is operated while fluid levels are knowingly depleted. |
| Diagnostic Services | Labor for diagnosis warranted for **30 days** with respect to accuracy of fault identification at time of service. Subsequent faults or recurrences unrelated to the diagnosed system are not covered. |
| General / All Other Labor | All other labor services are warranted against defects in workmanship for **90 days or 3,000 miles**, whichever occurs first, unless otherwise specified above. |

**Ironclad footer on all shop warranties (always printed):**
> *This warranty applies solely to the labor and workmanship performed by this shop on the date of service. It does not cover parts, consumables, pre-existing conditions, damage caused by misuse, neglect, accidents, unauthorized repairs, acts of nature, or normal wear and tear. This warranty is non-transferable and applies only to the original vehicle owner. To make a warranty claim, the vehicle must be returned to this shop for inspection. We reserve the right to inspect and verify the defect prior to performing any warranty repair. This warranty gives you specific legal rights; you may also have other rights that vary by jurisdiction.*
> 
> *⚠ These warranty terms are provided as a general template. We advise all users to review this language with a licensed attorney before presenting it to clients.*

---

### 5D. Invoice History Page

**Nav:** `🧾 Invoices`

**Layout:**
- Summary stats row: Total Invoiced · Total Collected · Outstanding Balance · Invoice Count
- Filter bar: Date range · Client (dropdown) · Vehicle · Service type · Status (All / Draft / Issued / Partial / Paid / Void) · Has Active Warranty
- Table columns: Invoice # · Date · Client · Vehicle · Service(s) · Total · Paid · Balance · Status chip
- Row tap → Invoice Detail view
- Checkbox column → bulk select
- Bulk action: "Export Selected as PDF" → single compiled multi-page PDF

---

### 5E. Audit Log

**New nav item:** `📋 Audit Log` (below Archive, above bottom)

**Data structure:**
```javascript
// In AppInner state:
const [auditLog, setAuditLog] = useState([]);

// Each entry:
{
  id: uid(),
  timestamp: new Date().toISOString(),
  action: "job_created",           // action-level tag
  entity: "job",                   // job | client | vehicle | invoice | payment | block | account
  entityId: "J001-V01-DB765",      // display ID
  summary: "Job J001 created for Dustin B.",  // human-readable
  fields: [                         // field-level diff (optional, per change)
    { field: "status", from: "Upcoming", to: "In Progress" },
    { field: "scheduledTime", from: "09:00", to: "10:30" }
  ],
  user: user.name                  // who made the change
}
```

**Action tags (filterable):**
- `client_created` · `client_updated` · `client_archived` · `client_restored`
- `vehicle_created` · `vehicle_updated` · `vehicle_archived`
- `job_created` · `job_updated` · `job_status_changed` · `job_archived`
- `invoice_created` · `invoice_issued` · `invoice_voided` · `payment_recorded`
- `warranty_added` · `warranty_updated`
- `block_created` · `block_deleted`
- `account_created` · `terms_accepted`

**UI:**
- Two-tab view: **Action Feed** (default) | **Field Changes**
- Action Feed: timeline list, newest first. Each entry: timestamp · colored entity chip · summary sentence
- Field Changes: filtered to only entries that have `fields[]` data, shows before/after diff per field
- Filters: date range · entity type · action tag · keyword search on summary
- Each entry expandable to show full field diff if available
- Export as CSV button

**Wire-up:** Every `setJobs`, `setCust`, `setVeh`, `setBlocks`, `setInvoices` call should be accompanied by a `logAction(...)` helper call. Write a helper:
```javascript
const logAction = (action, entity, entityId, summary, fields=[]) => {
  setAuditLog(prev => [{
    id: uid(), timestamp: new Date().toISOString(),
    action, entity, entityId, summary, fields, user: user.name
  }, ...prev]);
};
```

---

## 6. DESIGN SYSTEM REFERENCE

```css
--bg:    #0a0e11    /* page background */
--s1:    #0f1519    /* card surface 1 */
--s2:    #141b22    /* card surface 2 */
--s3:    #1a2230    /* card surface 3 (hover) */
--s4:    #1f2a38    /* card surface 4 (active) */
--bdr:   #1e2d3d    /* border */
--bdr2:  #253545    /* border stronger */
--txt:   #e8edf2    /* primary text */
--txt2:  #8fa3b8    /* secondary text */
--txt3:  #4a6075    /* muted text */
--acc:   #f97316    /* orange accent */
--acc2:  #ea6800    /* orange darker */
--grn:   #22c55e
--red:   #ef4444
--blu:   #3b82f6
--ylw:   #eab308
--pur:   #a855f7
--cyn:   #06b6d4
--fd:    'Barlow Condensed', sans-serif
--fn:    'Barlow', sans-serif
--fm:    'Share Tech Mono', monospace
--r:     8px
--r2:    12px
```

**Vehicle type colors:**
```
Car: #3b82f6 · Truck: #f97316 · SUV: #22c55e · Van: #a855f7
Motorcycle: #ef4444 · Boat: #06b6d4 · Aircraft: #8b5cf6
Golf Cart/Other: #eab308
```

---

## 7. COMPONENT LIBRARY (already built, reuse these)

```
<Btn v="primary|ghost|subtle|outline" sz="sm|md|lg" full onClick>
<Card style>...</Card>
<FG label required span>...</FG>          (form group)
<Lbl>                                      (form label)
<Chip label color small>
<Divider m>
<Modal title subtitle onClose wide>
<HexAvatar user size>                      (hex nut profile avatar)
<HexSpinner>                               (loading spinner)
<GS/>                                      (global styles injector)
<Stars rating count>                       (star rating display)
```

---

## 8. PLACEHOLDER / STYLE CONVENTIONS

- Name placeholder: `"Alex Rivera"` — never use real user's name
- Company placeholder: `"Hillside Auto Repair"`
- All section headers: `SCREAMING CAPS` in Barlow Condensed
- All IDs displayed: monospace (`className="mono"`) in accent color
- Button labels: Title Case (not ALL CAPS, not lowercase)
- Error messages: sentence case, specific
- No emoji in professional text — emoji only in nav icons and vehicle type icons
- `sideOpen` starts `false`

---

## 9. WHAT TO BUILD NEXT (PRIORITY ORDER)

1. **Terms & Conditions modal** — first login gate, text provided above in §5A
2. **Audit Log** — `auditLog` state in AppInner, `logAction()` helper, wire to all mutations, new nav page
3. **Invoice Builder** — per-job, in-app preview, PDF export, email share
4. **Warranty section** — parts warranty per line item, shop warranty by service type
5. **Invoice History page** — filterable table, bulk PDF export
6. **Partial payment tracker** — on each invoice record

---

## 10. KNOWN LIMITATIONS (SESSION-ONLY)

- All data resets on page refresh (no backend yet)
- Email share uses `mailto:` — actual attachment delivery depends on device
- PDF generation requires `html2canvas` + `jsPDF` loaded from CDN
- Logo uses account profile photo — a dedicated "shop logo" upload would be a clean improvement

---

*This document and the accompanying `MobileMechanic.jsx` contain everything needed to continue development in a new session. Load both files, read this document first, validate the JSX file with Babel standalone before making any changes, and follow the parser rules in §1 without exception.*


---
---

# PRODUCTION PUSH — BUILD LOG (this session)

**File grew 1,919 → 2,989 lines. Babel-verified clean. Zero optional chaining, balanced braces/parens, no forbidden glyphs.**

## What was built (18 features shipped)

### 1. Terms of Use gate
First-account-creation modal. Scroll-to-bottom unlocks the acknowledgment checkbox; the liability-acknowledgment toggle ("the developer assumes no liability, and I use this application at my own risk") gates "Agree & Create Account." Stores `termsAcceptedAt` on the account and logs `account_created` + `terms_accepted`. Full 7-section advisory-tone text is inline in `LoginScreen`.

### 2. Audit Log (dual-level)
`AuditPage` with two tabs — **Action Feed** (every action) and **Field Changes** (only entries carrying before/after diffs). Entity filter, keyword search, expandable per-row field diffs (red from → green to), CSV export via data-URL. Backed by `auditLog` state + `logAction(action, entity, entityId, summary, fields)` helper. Wired into job updates (field-level diffs on status/date/time/location/notes/odometer + services/parts counts), job/client archive, job/client/vehicle creation, time-block create/delete, invoices, payments, estimates, expenses, backups.

### 3. Settings page
Shop profile (name/address/phone/email), logo upload (label htmlFor pattern), default labor rate + parts tax rate with the SC Code 12-36-910 note, and the backup/restore controls.

### 4. Estimates & Quotes
`EstimatesPage` — new-estimate modal with service lines (hours/rate/parts-estimate), running total, open/converted/declined statuses, **Convert to Job** (creates a real job and navigates to it), Mark Declined.

### 5–11. Invoicing system
`InvoiceDetail` — fully printable invoice: logo header, bill-to, vehicle/job/odometer block, labor items, parts items (WARRANTY badge), totals with **7.5% parts-only tax + SC labor-exempt note**, payment history, active shop warranties + ironclad footer.
- **Partial payments:** Record-payment modal with Full Balance / Half quick-buttons, method dropdown, auto status flip (issued → partial → paid).
- **Parts warranty per line item:** covered toggle, supplier, manufacturer dropdown (18 mfrs), warranty ID, duration, notes, receipt photo (label htmlFor).
- **Shop warranty by service type:** auto-generated per unique service via `svcWarranty()` keyword engine, checkbox include, per-warranty IDs (`W01-INV-…`), printed footer.
- **Email** via mailto, **Print/PDF** via `window.print()` + print CSS, **Void** with confirm.

### 12. Invoice History
`InvoiceHistoryPage` — Invoiced/Collected/Outstanding stat cards; filters (search, client, date range, status, has-warranty); bulk-select checkboxes; "Print/Export Selected" (uses `body.print-multi` + hidden `.print-bulk` div with `pageBreakAfter`); "New Invoice" job-picker listing only jobs without an invoice.

### 13. Reports & Analytics
`ReportsPage` — Revenue/Parts-Cost/Expenses/Net-Profit headline cards, 6-month CSS revenue bar chart, top-5 clients, service-mix bars.

### 14. Expense tracking
Add-expense modal (date/category/amount/note, 9 categories), expense ledger with delete, feeds the Net-Profit math. Logs to audit.

### 15. Service reminders
`RemindersPage` — interval engine (`REMIND_RULES`: oil 90d, rotation 180d, brake/coolant/align 365d) computes the next-due window per vehicle from completed jobs, surfaces anything due within 21 days, overdue/due-soon color badges, **Book Job** (prefills client + vehicle), Dismiss.

### 16. Global search
`SearchModal` — opens from the new Search nav item; min 2 chars; searches clients, vehicles, jobs, invoices (incl. warranty IDs); tap-to-navigate.

### 17. JSON backup & restore
`exportBackup` (full workspace → data-URL .json download, NOT createObjectURL) and `importBackup` (FileReader → restores every state slice with error handling).

### 18. Odometer tracking
Number field in NewJobModal step 2 and JobDetail; flows onto invoices and supports the reminder engine.

## Navigation
Expanded to 14 items: Dashboard · Search · Schedule · Jobs · Estimates · Invoices · Reminders · Clients · Parts · Templates · Reports · Audit Log · Settings · Archive. Search is intercepted in the nav click handler (`isSearch` → opens modal, doesn't change page). Badges on Schedule (today), Jobs (active), Estimates (open), Invoices (issued+partial), Clients (count), Archive (count).

## New constants/helpers (top of file, after genJobId)
`MFRS`, `PAY_METHODS`, `EXP_CATS`, `svcWarranty(name)`, `SHOP_WARRANTY_FOOTER`, `REMIND_RULES`, `fmtDT`, `genInvId`, `genEstId`, `genWarId`, `invTotals(inv)`.

## New AppInner state
`invoices`, `selInvoice`, `estimates`, `expenses`, `auditLog`, `dismissedRem`, `showSearch`, `settings{shopName,address,phone,email,logo,laborRate:95,taxRate:7.5}`. Handlers: `logAction`, `createInvoiceFromJob`, `updateInvoice`, `convertEstimate`, `exportBackup`, `importBackup`.

## Print CSS
Appended inside the GS `<style>` template: `.print-area` shows in B/W only, `.no-print` hidden, `body.print-multi` swaps to `.print-bulk` for batch export.

---

# CHECKLIST TO THE FINISH LINE (the last 1%)

These were intentionally **not** built this session (need a backend, third-party APIs, or your product calls):

- [ ] **Signature capture** on invoices/work-authorization (canvas-based; sandbox-safe via toDataURL)
- [ ] **Supabase (or similar) backend** — currently session-only; this is the single biggest step to "real" persistence + multi-device
- [ ] **Live parts pricing API** (AutoZone/O'Reilly/NAPA are mocked in Parts Lookup)
- [ ] **SMS reminders** (Twilio) — reminder engine is built; just needs a send channel
- [ ] **VIN decode** (NHTSA vPIC API) to auto-fill year/make/model
- [ ] **GPS route optimizer** for a day's mobile jobs
- [ ] **Client communication log** (call/text/email history per client) — planned, not implemented
- [ ] **Dedicated shop-logo upload at registration** (currently set in Settings; works, just not in the signup flow)
- [ ] **Recurring/fleet maintenance schedules** for commercial accounts
- [ ] **Tax-rate lookup by ZIP** instead of the SC default


---

# UPDATE — July 2026 session: calendar function pass + downloadable local build

## Calendar (SchedulePage) upgrades — all Babel-verified
- **Month / Agenda view toggle** at top of Schedule (state `view`, default `"month"`). Month fragment wraps the calendar card + day-detail panel in `{view==="month"&&(<>...</>)}`.
- **Agenda view**: all jobs sorted by date+time; "NEEDS ATTENTION" group (past-due, not completed), then day groups labeled Today / Tomorrow / weekday. Shared row renderer `renderAgendaRow(j)` (time, vehicle-type icon, client, services, status chip, invoice total; tap → job detail). Empty state has a "+ Schedule a Job" CTA.
- **Date prefill**: `NewJobModal` now honors `prefill.scheduledDate` / `prefill.scheduledTime`. Schedule's "+ New Job" and day-detail "+ Job" pass `{scheduledDate:selDate}`, so a tapped calendar date lands in the form. AppInner passes `openNewJob` (with prefill) directly to SchedulePage.

## AI Repair Planner — works both hosted and local
- `settings.aiKey` (optional, password input) added under **Settings → AI ASSISTANT**. An AppInner effect mirrors it to `window.MM_ANTHROPIC_KEY`.
- The planner fetch adds headers only when a key is present: `x-api-key`, `anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true`. Hosted sandbox path (no key) unchanged. Error message hints at Settings key when self-hosted call fails.

## Downloadable local build — `MobileMechanic_Local.html` (~550 KB, single file)
Pipeline (repeat any session):
1. `npm install react@18 react-dom@18 '@babel/standalone@7.26.4'` (react **18** — 19 dropped UMD).
2. In the JSX source, swap the import line for `const { useState, useMemo, useRef, useEffect, Component } = React;` and `export default function App...` for plain `function App...`.
3. `Babel.transform(src,{presets:['react']})` → plain JS (no in-browser Babel; instant load).
4. Assemble HTML: charset + **viewport meta** (mobile layout depends on it), dark pre-paint style, then four inline `<script>` blocks: react UMD, react-dom UMD, **storage polyfill**, compiled app + `ReactDOM.createRoot(...).render(React.createElement(App))`.
5. Guard every inlined chunk with `.split('</script').join('<\\/script')`.

**Storage polyfill contract** (must match app's `mmSave`/`mmLoad`): installs `window.storage` ONLY if absent; backed by `localStorage` under `mmstore:` prefix; `get(k)` resolves `{key,value,shared}` or `null`; `set(k,v)` stores the string. Same file therefore behaves identically in sandbox (native storage API) and locally (polyfill).

**Verification used**: `node --check` on compiled JS; SSR smoke test (`react-dom/server` renderToString of App renders the login screen); polyfill contract round-trip test.

## New files in outputs
- `MobileMechanic_Local.html` — the downloadable app
- `README_Local.md` — end-user run instructions (offline OK, fonts fall back, backups advice, AI key note)

## Settings shape now
`{shopName,address,phone,email,logo,laborRate,taxRate,aiKey}` — remember `MM_EMPTY_SETTINGS` merge in hydrate keeps older blobs compatible.

---

# UPDATE — July 2026 session 2: manual-first feature push

**Product philosophy locked in this session:** significantly manual and user-controlled. AI appears in exactly one place (AI Repair Planner, reframed as "for the tough ones", opt-in). Everything else is structured manual workflows plus keyless factual APIs.

## New data slices (full plumbing: state → hydrate → persist deps/blob → register seed → export/import)
- `comms` — communication log entries: {id, customerId, vehicleId|null, date, channel(Call/Text/Email/In-Person), direction(in/out), summary, followUp, followUpDate, done, createdAt}
- `projects` — planner: {id, name, cat(PROJECT_CATS), status(active/hold/done), targetDate, notes, tasks:[{id,label,done}], createdAt}
- `partQuotes` — manual quote log: {id, date, part, supplier, price, partNum, vehicleId|null}

## New AppInner handlers
`addComm/updateComm/deleteComm` (audit-logged), `dueFollowUps` count → Reminders NAV badge. Comm handlers threaded AppInner → CustomersPage → ClientProfile.

## New pages/components
- **PlannerPage** (`page==="planner"`, NAV 🗂): project cards w/ category chip, status select, target date (overdue red), progress bar, checkbox tasks (add/toggle/delete), starter suggestions, audit on create/complete.
- **PlaybookPage** (`page==="playbook"`, NAV 📖): static `PLAYBOOK` constant — 5 Marketing + 5 How-To expert guides, numbered steps, copy-and-personalize templates in readOnly textareas (onFocus select). Category filter chips. Zero AI.
- **PartsLookup reworked** ("PARTS SOURCING", now takes props vehicles/customers/quotes/setQuotes/logAction): vehicle-context select + term → real supplier search links (RockAuto/AutoZone/O'Reilly/NAPA/Amazon, URL-constructed, no key), LOG A QUOTE quick-add, QUOTE LOG table w/ per-part BEST flag + 40%-margin sell col. Old mock PARTS_DB flow removed (constant remains, unused).

## Keyless factual APIs wired
- **NHTSA VIN decode** in AddVehicleModal: Decode button beside VIN (shown when idLabel contains "VIN") → `vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json` autofills year/make(title-cased)/model/engine(L + cyl + model)/fuel/drive (option-matched), user reviews before save. CORS-open, free.
- **Google Maps URLs** (`mapsUrl(addr)`, `routeUrl(stops)` top-level helpers): Navigate btn on JobDetail floating bar (job.location) + ClientProfile floating bar (client address); **Route (n)** button in Schedule day header opens multi-stop directions (waypoints %7C-joined, last stop = destination).

## UI additions in existing pages
- ClientProfile: COMMUNICATION LOG card (quick-add row: date/channel/direction/summary/vehicle-optional/follow-up+date; entries list w/ channel chips, overdue coloring, Done + delete). Card sits above floating bar, marginBottom:70 clears it.
- RemindersPage: CLIENT FOLLOW-UPS section on top (yellow; red+DUE chip when followUpDate<=TODAY; Done button), subtitle updated. New props comms/onUpdateComm.
- Templates AI banner copy → "FOR THE TOUGH ONES —" manual-first framing.

## Local build regenerated
Same pipeline as session 1 (see above). Now 597 KB. SSR smoke test + node --check pass. README_Local.md updated w/ online-vs-offline matrix.

## Parts API honesty note
No universally obtainable parts-pricing API exists (PartsTech/Nexpart etc. need dealer accounts) — deliberately shipped supplier-link + manual quote log instead of a fake integration. If Dustin lands API access later, PartsLookup is the slot.

---

# UPDATE — July 2026 session 3: production-readiness release pass (v1.0.0)

Full release-team audit + fixes. File now ~3,881 lines, Babel CLEAN, SSR smoke pass, auth logic simulated (6/6 cases).

## Security & data safety
- `APP_VERSION="1.0.0"` top-level const (near MM_EMPTY_SETTINGS).
- **Password hashing**: `mmHash(s)` (WebCrypto SHA-256, "mm.v1:" salt, "sha256:"-prefixed hex, resolves null if crypto unavailable) + `mmCheckPw(input,stored)` (hash compare, legacy plaintext fallback). Both top-level after mmLoad. LoginScreen: handleSignIn / confirmQuickLogin / finalizeCreate all async via these. **Transparent upgrade** in AppInner handleLogin: legacy plaintext accounts re-stored hashed on next sign-in.
- Register validation: email must contain "@"+"." after it; password min 4 chars (duplicate-email check already existed).
- **Save-failure banner**: persist effect now `.then(ok=>setSaveWarn(!ok))`; fixed red top banner (zIndex 4000) warns storage full/unavailable + points to backup.
- **Import guard**: importBackup validates shape (customers/jobs arrays) + window.confirm before replacing workspace.

## UX & reliability
- **Login loading**: `booting` state -> full-screen HexSpinner overlay ("LOADING YOUR SHOP...") during workspace hydration.
- **Guided onboarding**: Dashboard early-return condition changed `!jobs.length&&!customers.length` -> `jobs.length===0`; replaced welcome screen with GET ROLLING checklist (3 steps w/ done-states: shop profile via address||phone||logo, first client, first job) + Playbook bonus row. Dashboard gained props settings/goSettings/goPlaybook (route updated).
- **Modal**: Escape-to-close (useEffect keydown), role="dialog" aria-modal, accessible close button (aria-label, U+2715 via string expr, bigger hit area).
- **Error boundary**: production copy ("Something went wrong... your data is saved"), Reload App button, stack behind <details>.
- **A11y pass**: 12 tiny "x" delete buttons got aria-label="Remove"/title + fontSize 14 + padding 4px 9px (regex right-to-left tag scanner).
- Header consistency: all 5 fontSize:28 page titles -> 26.
- routeUrl caps at 10 stops (Google Maps URL limit).
- Settings **ABOUT card**: version, local-only privacy statement, v1.0.0 release notes.
- Dead code removed: PARTS_DB (4.5 KB) and unused Stars component (`const Stars = ` with spaces — note the spacing if searching).

## Verification
- Babel 7.26.4 CLEAN; no `?.`/`??`; braces/parens balanced.
- Auth sim (node webcrypto as window.crypto): hash format, correct/wrong vs hash, legacy plaintext accept/reject, empty reject — all pass.
- Local HTML rebuilt (same pipeline), SSR renderToString OK.
- README title now carries v1.0.0.

## Verdict recorded: PRODUCTION-READY for its scope (single-device, local-first). Known limits: no multi-device sync (backup/restore is the path), local hashing protects casual access only (device access = data access, by design of local-first), AI planner requires user key when self-hosted.

---

# UPDATE — July 2026 session 4: legal/compliance framework + DB monogram branding

## Legal framework (all in-app, static)
- Constants `LEGAL_VERSION="1.0"`, `LEGAL_UPDATED`, `LEGAL_DOCS` (terms/privacy/disclaimer/licenses as {title,sections:[{h,b:[]}]}) + `LegalDoc` renderer + `LegalModal` (tabbed, scrollable, reuses Modal) — inserted immediately before LoginScreen.
- **Terms**: 19 sections covering eligibility(18+), local-first nature, IP/license split, user-as-controller of client data, acceptable use, no professional advice, template disclaimer, AI content, third-party services, assumption of risk, AS-IS warranty disclaimer, liability cap ($0/free), indemnification, backups, availability, force majeure, arbitration+class waiver **[CONFIGURE: body/seat]**, governing law **[CONFIGURE]**, severability/entire agreement, contact **[CONFIGURE]**.
- **Privacy**: zero-collection model, on-device inventory (incl. hashed pw + aiKey), user-triggered third-party flows (Anthropic/NHTSA/Google/suppliers), user-as-controller duties, no cookies, security limits of local-first, retention/deletion, GDPR-CCPA framing, children 18+, contact **[CONFIGURE]**.
- **Consent gate upgrades** (registration): title → TERMS OF SERVICE & PRIVACY; acknowledgment text now the requested "voluntarily and at my own discretion" language; links to full Terms/Privacy/Disclaimers (open LegalModal); `termsVersion:LEGAL_VERSION` stored on the account alongside termsAcceptedAt (already audit-logged).
- **Access points**: sign-in screen fixed footer (v + Terms · Privacy links), Settings → LEGAL & PRIVACY card (4 doc buttons), consent gate links. SettingsPage + LoginScreen each hold local `legalTab` state.

## Disclaimers placed
AI modal: yellow DRAFT ONLY banner + subtitle tweak. Parts Sourcing: supplier-set pricing note. Playbook: "not legal, tax, or financial advice". VIN success msg: "via NHTSA — verify against the vehicle". (Invoice/warranty/tax attorney disclaimers pre-existed.)

## Security
- exportBackup now strips `aiKey` (`exportSettings` copy) — secrets never enter backup files; disclosed in Privacy §6.
- Audit confirmed: mailto bodies properly encoded; printed docs are React-rendered (auto-escaped); downloadSummary uses esc(); no logging of sensitive data.

## Branding — DB monogram
- Source PNG processed (Pillow): white→transparent w/ 200-250 alpha ramp, cropped, 220px (`MM_BRAND` data-URL const after APP_VERSION, ~61KB b64) + 96px favicon (embedded in local HTML head).
- Placements (restrained): sign-in header (116px), booting overlay (92px above HexSpinner), Settings About card (48px, card gets `borderLeft:3px solid var(--sand)`), favicon/title. `--sand:#b3a289` added to :root.
- To swap the asset later: regenerate b64 via the Pillow snippet (in transcript) and replace the MM_BRAND line + favicon href.

## Build
Local HTML now includes license header comment + favicon; 1.03 MB total (brand+favicon added ~110KB). SSR pass confirms monogram renders on login.

## [CONFIGURE] checklist before public release
1. Terms §17 arbitration body + seat; §18 governing law; §19 + Privacy §10 contact/repository.
2. Choose and attach the actual open-source code license file (Terms §3 references it).
3. Attorney review of Terms/Privacy and the warranty/invoice templates (per Fable's report).

## Branding correction (same session)
Prior white-removal punched holes through interior whites (cloud fills, wrench highlights) — looked broken on dark UI. Fixed with **edge-connected flood fill** (BFS from borders; only exterior white → transparent; interior whites preserved) + boundary-only alpha fade. Placements reduced to signature-style: **sign-in bottom-right fixed mark (42px, opacity .72, pointer-events none)** + About card (38px) + favicon. Removed: login header (116px) and booting overlay marks. MM_BRAND now 160px/28KB. Pillow flood-fill snippet is in the transcript for future asset swaps.


## Branding refinement 2 (same session)
Full cutout now: ALL near-white (>=245) transparent incl. letter counters and cloud fills, boundary-only alpha fade — pure silhouette on dark. Sign-in marks: bottom-right 30px @.7 (right:10,bottom:8) + top-left 66px @.9 (left:14,top:12), both fixed/pointer-events:none/aria-hidden. About card unchanged (38px).

---

# UPDATE — July 2026 session 5: executive production-readiness re-audit (v1.0.0)

Re-verified all prior legal/security/branding/accessibility work was intact (it was), then found and fixed genuine remaining gaps:

## Fixed this pass
- **Reverse-tabnabbing**: all 5 `window.open(url,"_blank")` call sites (job/client Navigate, day Route, 2 parts-supplier search paths) now pass `"noopener,noreferrer"` as the third argument.
- **Reduced motion**: added `@media (prefers-reduced-motion: reduce)` global rule collapsing animation/transition durations to near-zero for users with that OS preference — previously absent despite `.fade`/`.pop` animation classes.
- **Input integrity**: added `min="0"` (and `max="100"` where a percentage) to 13 previously-unguarded monetary/quantity number inputs across JobDetail services/parts, AddVehicle odometer, Estimates services/parts, Parts Sourcing quote price, Expense amount, Invoice payment amount, Settings labor rate/tax rate, and Template services — closing a negative-number data-integrity gap.
- **Login soft-lockout**: new client-side throttle in LoginScreen — 5 failed password attempts (tracked per session via `failCount`) trigger a 30-second lockout (`lockUntil`) on both the full sign-in form and the quick-login password prompt; buttons disable and show a live countdown ("LOCKED 23s"); resets on success. This is a UX/deterrence layer appropriate to local-first (device access is the real boundary) — not a substitute for server-side rate limiting, which doesn't apply here since there's no server.

## Verified unchanged / already correct (no action needed)
No dead code, no console.log/debugger/TODO/lorem-ipsum, no dangerouslySetInnerHTML/innerHTML anywhere, focus-visible input styling already present, alt-text present on every `<img>` (empty alt + aria-hidden correctly used for decorative marks, descriptive alt on user-content photos), hydration race already guarded via `hydrating.current` ref, password hashing/legal framework/branding from prior sessions all intact and Babel-clean.

## Build
4,001 lines, Babel CLEAN, SSR renderToString pass, brace/paren/optional-chaining sweep clean. Local HTML rebuilt (678 KB).

---

# UPDATE — July 2026 session 6: branding refinement + sitewide accuracy audit (v1.0.0)

## Branding
Removed the top-left monogram entirely per feedback — kept only the bottom-right signature mark, now at true half-transparent opacity (`.7` → `.5`). Single placement: 30px, `right:10,bottom:8`, fixed, pointer-events:none, aria-hidden. About card mark (38px) unchanged.

## Accuracy audit — logic/correctness findings

**Fixed — real bug:** `genVehicleId`/`genJobId` derived the next sequence number from the *active* array's `.length`, not a persistent counter. Archiving a vehicle/job and then adding a new one for the same customer/vehicle could silently mint a duplicate ID (e.g. archive V01, only V02 active → next generated ID is also "V02", colliding with the still-existing active V02). Fixed by switching both generators to parse the highest existing numeric suffix from ID strings via regex and increment from there, **and** threading `archVehicles`/`archJobs` into every ID-minting call site (AddVehicleModal via ClientProfile/CustomersPage, NewJobModal, and the estimate→job conversion) so the full history — not just what's currently visible — is considered. Verified via VM-sandboxed simulation: old logic reproducibly collided in the archive-then-recreate scenario; new logic does not, and fresh-customer numbering is unaffected (still starts at 01/001).

**Fixed — real bug:** New job service lines (`JobDetail.addSvc`) and the New Job modal's service form both hardcoded `laborRate:95` regardless of the shop's configured rate in Settings — so a shop that set e.g. $120/hr still got $95 defaults on every new line. Threaded `settings` into both components; defaults and the rate-field placeholder now read `+settings.laborRate||95`. (EstimatesPage was already correct — it already received `defaultRate={+settings.laborRate||95}` from AppInner; this fix brings JobDetail/NewJobModal to parity.)

## Verified correct, no changes needed
- `invTotals`: labor + parts + tax(parts-only, matching SC §12-36-910) − payments = due. Math confirmed by inspection.
- Margin formula `price/0.6` correctly yields a 40% margin (not markup) — verified algebraically.
- `mmSave` promise contract (`resolve(true)` on success / `resolve(false)` on failure) correctly consumed by the `saveWarn` banner effect.
- Reminder due-date math anchors on `T12:00:00` to absorb DST drift; day-count arithmetic confirmed correct.
- `TODAY` (`toISOString().slice(0,10)`) and all `scheduledDate`/`followUpDate` fields use the same `YYYY-MM-DD` string format, so lexicographic comparisons used throughout (overdue checks, sorting) are valid.

## Build
4,014 lines, Babel CLEAN, SSR renderToString pass, brace/paren/optional-chaining sweep clean, exactly 2 monogram placements confirmed (signature mark + About card). Local HTML rebuilt (679 KB).
