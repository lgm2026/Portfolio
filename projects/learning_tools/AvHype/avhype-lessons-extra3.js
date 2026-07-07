/* AvHype Aviation Education — Instrument Rating deep track (extra3).
   Merges into the existing LESSONS map. Pure data; JSON-serializable. */
window.__AV_LESSONS__ = Object.assign((window.__AV_LESSONS__ || {}), {

  /* ===================== Flying in the System ===================== */
  "isys-clearance": {
    title: "Copying an IFR clearance (CRAFT)",
    pathway: "airplane", cert: "Flying in the System", faa: "aim",
    acs: "IFR — clearances", time: 6,
    explain: [
      "An IFR clearance is read in a standard order you can remember with CRAFT: Clearance limit (usually your destination), Route, Altitude, Frequency for departure, and Transponder code. Copy it in shorthand and read it back.",
      "Expect phrases like 'cleared to [destination] as filed' or an amended route, an initial altitude with 'expect higher in ten minutes', a departure frequency, and a squawk code. A clean readback lets the controller catch any error before you launch.",
      "If you cannot comply with part of a clearance, say 'unable' and work out an alternative before you accept it."
    ],
    quiz: [
      { type: "mc", q: "The 'C' in the CRAFT clearance format stands for:", choices: ["Climb", "Clearance limit", "Communications", "Course"], answer: 1, why: "CRAFT = Clearance limit, Route, Altitude, Frequency, Transponder." },
      { type: "tf", q: "You should read back an IFR clearance to the controller.", answer: true, why: "A readback lets ATC verify you copied the clearance correctly before departure." }
    ]
  },
  "isys-departure": {
    title: "Departures: ODPs and SIDs",
    pathway: "airplane", cert: "Flying in the System", faa: "iph",
    acs: "IFR — departures", time: 6,
    explain: [
      "An Obstacle Departure Procedure (ODP) gives obstacle clearance when departing IFR and may be textual or graphic. A Standard Instrument Departure (SID) is an ATC procedure that simplifies the clearance and often provides obstacle clearance too.",
      "To get the standard obstacle clearance, you must cross the departure end of the runway at least 35 feet up and climb at least 200 feet per nautical mile, unless a steeper gradient is published.",
      "Check for a departure procedure even at non-towered fields. A 'diverse departure' assumption only holds if you actually meet the climb gradient and any turn requirements."
    ],
    quiz: [
      { type: "mc", q: "The standard IFR climb gradient for obstacle clearance is at least:", choices: ["100 ft/NM", "152 ft/NM", "200 ft/NM", "500 ft/NM"], answer: 2, why: "Standard is 200 feet per nautical mile unless a higher gradient is published." },
      { type: "tf", q: "A SID is primarily an ATC procedure that can simplify a departure clearance.", answer: true, why: "SIDs reduce radio workload and give a known, charted departure path." }
    ]
  },
  "isys-enroute": {
    title: "Enroute structure: airways and altitudes",
    pathway: "airplane", cert: "Flying in the System", faa: "iph",
    acs: "IFR — enroute structure", time: 6,
    explain: [
      "Victor airways (low altitude) are defined by VOR radials and run from 1,200 feet AGL up to 18,000 feet MSL. Above that the high-altitude jet routes begin, and RNAV T-routes serve GPS-equipped aircraft.",
      "Key altitudes: the MEA (Minimum Enroute Altitude) guarantees obstacle clearance and a usable navigation signal; the MOCA guarantees obstacle clearance but signal only within 22 NM of the VOR; an MCA (Minimum Crossing Altitude) requires a certain altitude crossing a fix.",
      "Fly the published minimum altitudes and stay aware of terrain within the protected area of the airway."
    ],
    quiz: [
      { type: "mc", q: "The MEA on an airway guarantees:", choices: ["Radar coverage", "Obstacle clearance and a usable navigation signal", "Weather avoidance", "VFR conditions"], answer: 1, why: "The Minimum Enroute Altitude assures both obstacle clearance and adequate nav signal along the airway." },
      { type: "mc", q: "The MOCA assures a usable navigation signal only within:", choices: ["10 NM", "22 NM", "40 NM", "100 NM"], answer: 1, why: "The MOCA guarantees obstacle clearance route-wide but nav signal only within 22 NM of the facility." }
    ]
  },
  "isys-comms": {
    title: "IFR communications and lost comms",
    pathway: "airplane", cert: "Flying in the System", faa: "aim",
    acs: "IFR — communications", time: 6,
    explain: [
      "Under IFR you maintain continuous two-way communication and read back clearances, hold-short, and altitude assignments. Comply with ATC instructions or say 'unable'.",
      "If you lose communications in IMC, the rules tell you exactly what to do. Fly the route by AVEF priority — Assigned, then Vectored, then Expected, then Filed — and fly the highest of the Minimum enroute altitude, the Expected altitude, or the Assigned altitude for each segment. Squawk 7600.",
      "If you are in VMC when the radio fails, simply continue under VFR and land as soon as practical."
    ],
    quiz: [
      { type: "mc", q: "After losing two-way radio in IMC, your route priority is:", choices: ["Filed route only", "Assigned, Vectored, Expected, Filed", "Direct to destination", "Nearest airport"], answer: 1, why: "The AVEF memory aid sets the lost-comm route order; altitude is the highest of MEA, Expected, or Assigned." },
      { type: "fill", q: "The transponder code for lost communications is ____.", answer: "7600", why: "Squawk 7600 to alert ATC of a radio failure." }
    ]
  },
  "isys-radar": {
    title: "Radar services and vectors",
    pathway: "airplane", cert: "Flying in the System", faa: "iph",
    acs: "IFR — radar services", time: 5,
    explain: [
      "ATC uses radar to separate IFR traffic, issue vectors (assigned headings), and provide traffic and safety alerts. When vectored off a published route you lose your own obstacle protection, so ATC keeps you at or above the Minimum Vectoring Altitude.",
      "Read back assigned headings and altitudes and keep your situational awareness. Know where you are even while being vectored, so a lost-comm or a questionable instruction never leaves you lost.",
      "'Radar contact' means ATC sees you; 'radar service terminated' means you are back to your own navigation and position reporting."
    ],
    quiz: [
      { type: "tf", q: "When ATC vectors you, they keep you at or above the Minimum Vectoring Altitude for obstacle clearance.", answer: true, why: "On vectors you lose airway obstacle protection, so ATC assigns altitudes at or above the MVA." },
      { type: "mc", q: "'Radar contact' means:", choices: ["You must squawk standby", "ATC has identified you on radar", "You are cleared to land", "Your transponder failed"], answer: 1, why: "It confirms radar identification; position reports are not required until radar service is terminated." }
    ]
  },

  /* ===================== Charts & Procedures ===================== */
  "ichart-enroute": {
    title: "The IFR enroute low chart",
    pathway: "airplane", cert: "Charts & Procedures", faa: "iph",
    acs: "IFR charts — enroute", time: 6,
    explain: [
      "The enroute low chart shows airways, VORs and intersections, minimum altitudes (MEA, MOCA, MAA), distances between fixes, changeover points, and communication frequencies. It is your roadmap of the low-altitude system.",
      "Intersections are named with five-letter fixes, and VOR data appears in boxes with the frequency, identifier, and Morse code. Mileage between fixes and total airway mileage support time and fuel planning.",
      "Learn the symbology so you can pull altitudes and frequencies quickly in flight without fumbling."
    ],
    quiz: [
      { type: "tf", q: "The IFR enroute low chart shows minimum enroute altitudes (MEAs) for each airway segment.", answer: true, why: "MEAs, distances, fixes, and frequencies are all depicted on the enroute low chart." },
      { type: "mc", q: "A five-letter name on an enroute chart usually identifies a(n):", choices: ["Airport", "Intersection (fix)", "Frequency", "Airway"], answer: 1, why: "Named intersections use five-letter identifiers; airways are labeled like V-2 or J-numbers." }
    ]
  },
  "ichart-approach": {
    title: "Anatomy of an approach plate",
    pathway: "airplane", cert: "Charts & Procedures", faa: "iph",
    acs: "IFR charts — approach plate", time: 6,
    explain: [
      "An instrument approach chart has distinct sections: the briefing strip and plan view (a top-down map of the approach and navaids), the profile view (a side view of altitudes and the glidepath), the minimums section (DA or MDA and visibility by aircraft category), and the airport diagram.",
      "Brief the approach before you fly it: the name and frequencies, the final approach course, key altitudes, the missed approach, and the minimums. A good brief means no surprises on final.",
      "Note the missed approach instructions prominently, because you must be ready to fly them the instant you reach minimums without the runway in sight."
    ],
    quiz: [
      { type: "mc", q: "The side-view portion of an approach plate showing altitudes and the descent path is the:", choices: ["Plan view", "Profile view", "Minimums section", "Airport diagram"], answer: 1, why: "The profile view depicts the vertical path, step-down fixes, and the missed approach climb." },
      { type: "tf", q: "You should brief the missed approach before beginning an instrument approach.", answer: true, why: "At minimums you may need to execute the miss immediately, so it must be briefed in advance." }
    ]
  },
  "ichart-mins": {
    title: "Approach minimums",
    pathway: "airplane", cert: "Charts & Procedures", faa: "iph",
    acs: "IFR charts — minimums", time: 6,
    explain: [
      "Approaches with vertical guidance use a Decision Altitude (DA): reaching it without the required visual references means going missed. Non-precision approaches use a Minimum Descent Altitude (MDA): you may descend to it and level off, but no lower, until you see the runway environment or reach the missed approach point.",
      "Minimums also list a required flight visibility, and they vary by aircraft approach category (A, B, C, D), which is set by approach speed.",
      "You may descend below DA or MDA only when you have the required visual references, the aircraft is in a position for a normal landing, and the flight visibility meets the published minimum."
    ],
    quiz: [
      { type: "mc", q: "On a non-precision approach you descend to the ____ and hold that altitude until the runway is in sight or you reach the missed approach point.", choices: ["Decision Altitude", "Minimum Descent Altitude", "Traffic pattern altitude", "Field elevation"], answer: 1, why: "MDA is a level-off floor on non-precision approaches; DA is a decision point on approaches with vertical guidance." },
      { type: "tf", q: "Aircraft approach categories (A, B, C, D) are based on approach speed.", answer: true, why: "Category is set by the reference landing speed and determines which visibility minimums apply." }
    ]
  },
  "ichart-star": {
    title: "Arrivals (STARs)",
    pathway: "airplane", cert: "Charts & Procedures", faa: "iph",
    acs: "IFR charts — arrivals", time: 5,
    explain: [
      "A Standard Terminal Arrival (STAR) is a charted route linking the enroute structure to the destination, simplifying the transition into a busy terminal area. Like SIDs, STARs reduce radio workload and give a predictable path.",
      "STARs may include crossing restrictions — cross a fix at or above or below an altitude, or at a speed. Watch for 'descend via' clearances, which authorize you to descend according to the published altitudes.",
      "Brief the arrival and have the transition to your expected approach in mind before things get busy near the airport."
    ],
    quiz: [
      { type: "mc", q: "A STAR is a charted procedure that:", choices: ["Departs the airport", "Transitions from the enroute structure to the terminal area", "Replaces the approach", "Reports the weather"], answer: 1, why: "STARs simplify the arrival into busy terminal airspace, often with crossing restrictions." },
      { type: "tf", q: "A 'descend via' clearance authorizes you to descend according to the published STAR altitudes.", answer: true, why: "'Descend via' lets you manage the descent per the charted crossing restrictions." }
    ]
  },
  "ichart-holding": {
    title: "Holding patterns",
    pathway: "airplane", cert: "Charts & Procedures", faa: "ifh",
    acs: "IFR — holding", time: 6,
    explain: [
      "A holding pattern is a racetrack that keeps you in protected airspace while you wait. Standard holds use right turns; the chart or ATC specifies the holding fix, the inbound course, the turn direction, and the leg length (often one minute at or below 14,000 feet, one and a half minutes above).",
      "Pick your entry based on your heading relative to the holding course: direct, parallel, or teardrop. Visualize the pattern, note the time, and adjust for wind to keep the inbound leg on course and on time.",
      "Slow to the holding speed before the fix, and report entering and leaving the hold if required."
    ],
    quiz: [
      { type: "mc", q: "A standard holding pattern uses:", choices: ["Left turns", "Right turns", "No turns", "Random turns"], answer: 1, why: "Standard holds are right-hand; a non-standard hold (left turns) is specified by chart or ATC." },
      { type: "mc", q: "At or below 14,000 feet, standard inbound holding leg timing is:", choices: ["30 seconds", "1 minute", "1.5 minutes", "2 minutes"], answer: 1, why: "Inbound legs are timed one minute at or below 14,000 feet and one and a half minutes above." }
    ]
  },

  /* ===================== Instrument Approaches ===================== */
  "iapp-ils": {
    title: "The ILS",
    pathway: "airplane", cert: "Instrument Approaches", faa: "iph",
    acs: "Approaches — ILS", time: 6,
    explain: [
      "The Instrument Landing System gives precise lateral guidance from the localizer and vertical guidance from the glideslope. Centered needles mean on course and on path; the localizer is more sensitive than a VOR, so corrections stay small.",
      "A full ILS (Category I) typically has minimums of a 200-foot decision height and one-half mile visibility (or RVR 2400). Fly the glideslope down to the DA, and if you do not see the runway environment, go missed.",
      "Identify the localizer by its Morse code, watch for failure flags, and never chase the needles. Small, smooth corrections keep both needles centered."
    ],
    quiz: [
      { type: "mc", q: "On an ILS, vertical guidance is provided by the:", choices: ["Localizer", "Glideslope", "Marker beacon", "DME"], answer: 1, why: "The localizer gives lateral course; the glideslope gives the vertical descent path." },
      { type: "tf", q: "A standard Category I ILS decision height is typically 200 feet above touchdown.", answer: true, why: "CAT I ILS minimums are commonly a 200-foot DH and one-half SM (RVR 2400) visibility." }
    ]
  },
  "iapp-rnav": {
    title: "RNAV (GPS) approaches",
    pathway: "airplane", cert: "Instrument Approaches", faa: "iph",
    acs: "Approaches — RNAV/GPS", time: 6,
    explain: [
      "RNAV (GPS) approaches use satellite navigation and offer different lines of minimums: LNAV (lateral only, like a non-precision approach), LNAV/VNAV (lateral plus vertical guidance), and LPV (the most precise, with WAAS, often down to 200-foot minimums like an ILS).",
      "WAAS, the Wide Area Augmentation System, improves GPS accuracy and integrity enough to support vertical guidance. The minimums you can use depend on your equipment and the approach.",
      "Load the approach, confirm the correct waypoints and sequence, and watch the annunciations (terminal, approach mode) so you know exactly what guidance you have."
    ],
    quiz: [
      { type: "mc", q: "The most precise line of minimums on an RNAV (GPS) approach, often as low as an ILS, is:", choices: ["LNAV", "LNAV/VNAV", "LPV", "Circling"], answer: 2, why: "LPV (with WAAS) provides vertical guidance and can have decision altitudes as low as 200 feet." },
      { type: "tf", q: "WAAS improves GPS accuracy enough to support vertical guidance on some approaches.", answer: true, why: "WAAS augmentation enables LPV and LNAV/VNAV vertical guidance." }
    ]
  },
  "iapp-nonprecision": {
    title: "Non-precision approaches",
    pathway: "airplane", cert: "Instrument Approaches", faa: "iph",
    acs: "Approaches — non-precision", time: 6,
    explain: [
      "Non-precision approaches (VOR, localizer, NDB, or LNAV) provide lateral guidance only, so you descend in steps to the MDA and level off, watching for the runway environment by the missed approach point.",
      "Use a calculated constant-angle descent to the MDA rather than 'dive and drive', and never descend below a step-down altitude until past that fix. Identify the missed approach point by time, distance, or a fix.",
      "Without vertical guidance, precise altitude control and timing matter, so set up early and fly the numbers."
    ],
    quiz: [
      { type: "mc", q: "On a VOR (non-precision) approach you have:", choices: ["Vertical guidance only", "Lateral guidance only", "Both lateral and vertical guidance", "Neither"], answer: 1, why: "Non-precision approaches give course guidance but no glidepath; you manage the descent to the MDA yourself." },
      { type: "tf", q: "You must not descend below a published step-down altitude until past the associated fix.", answer: true, why: "Step-down fixes protect obstacle clearance; descend only after crossing each one." }
    ]
  },
  "iapp-circling": {
    title: "Circling and the missed approach",
    pathway: "airplane", cert: "Instrument Approaches", faa: "iph",
    acs: "Approaches — circling & missed", time: 6,
    explain: [
      "A circling approach lets you fly an instrument approach to one runway and then maneuver visually to land on another. Stay within the protected circling area for your category and keep the runway environment in sight. If you lose it, begin the missed approach by turning toward the runway to stay protected.",
      "The missed approach is a published climb and route to a safe altitude and fix or hold. Fly it precisely and promptly when you reach minimums without the required references, or any time the approach becomes unsafe.",
      "Circling at night or near minimums is high-risk; many pilots set personal minimums well above the published ones."
    ],
    quiz: [
      { type: "tf", q: "If you lose the runway environment while circling, you should begin the missed approach.", answer: true, why: "Losing visual reference while circling requires an immediate missed approach to remain in protected airspace." },
      { type: "mc", q: "An instrument missed approach is:", choices: ["Optional", "A published climb and route to a safe altitude/fix", "The same as a traffic-pattern go-around", "A descent below MDA"], answer: 1, why: "The miss is a charted procedure you fly when you cannot land from the approach." }
    ]
  },
  "iapp-stabilized": {
    title: "The stabilized approach",
    pathway: "airplane", cert: "Instrument Approaches", faa: "ifh",
    acs: "Approaches — stabilized concept", time: 5,
    explain: [
      "A stabilized approach means being on speed, on path, in the landing configuration, with a normal descent rate and power setting, all by a set gate such as the final approach fix or a defined altitude. Stability dramatically reduces approach-and-landing accidents.",
      "If the approach becomes unstable — too fast, too high, off course, or with a sink rate that will not allow a normal landing — the right decision is to go missed and try again, not to salvage it.",
      "Build personal gates and honor them. A go-around is a normal, professional maneuver, not a failure."
    ],
    quiz: [
      { type: "tf", q: "If an instrument approach becomes unstabilized, the safe choice is to go missed.", answer: true, why: "Continuing an unstable approach is a leading accident cause; a go-around resets the situation safely." },
      { type: "mc", q: "A stabilized approach includes being on speed, on path, and:", choices: ["Out of fuel", "In the landing configuration with a normal descent rate", "At cruise power", "In a steep bank"], answer: 1, why: "Configuration, speed, path, and a normal descent and power define a stabilized approach." }
    ]
  },

  /* ===================== IFR Regulations ===================== */
  "ireg-currency": {
    title: "IFR currency",
    pathway: "airplane", cert: "IFR Regulations", faa: "cfr61",
    acs: "IFR regs — currency", time: 6,
    explain: [
      "To act as PIC under IFR you must have logged, within the preceding six calendar months, at least six instrument approaches, plus holding procedures and intercepting and tracking courses, in the appropriate category of aircraft (or a suitable simulator or training device).",
      "If you lapse, you have another six months to regain currency by doing those tasks with a safety pilot or in a sim. Beyond that, you need an Instrument Proficiency Check (IPC) with an authorized instructor or examiner.",
      "Currency is the legal floor; proficiency — being genuinely sharp and comfortable in IMC — is the real goal."
    ],
    quiz: [
      { type: "mc", q: "IFR recent experience requires, within the preceding six calendar months:", choices: ["Three approaches", "Six approaches, holding, and course intercepting/tracking", "One approach", "A flight review"], answer: 1, why: "14 CFR 61.57(c) sets the six-approaches-plus-holding-and-tracking requirement." },
      { type: "tf", q: "After being out of IFR currency too long, an Instrument Proficiency Check is required to regain it.", answer: true, why: "Past the grace period, an IPC with an authorized instructor or examiner is needed." }
    ]
  },
  "ireg-alternate": {
    title: "Alternates and the 1-2-3 rule",
    pathway: "airplane", cert: "IFR Regulations", faa: "cfr91",
    acs: "IFR regs — alternates", time: 6,
    explain: [
      "You must file an alternate airport for an IFR flight unless the 1-2-3 rule lets you skip it: from one hour before to one hour after your ETA, the destination forecast is at least a 2,000-foot ceiling and 3 miles visibility. If it is worse, you need an alternate.",
      "An airport qualifies as an alternate only if its forecast meets the alternate minimums. Standard is 600 and 2 with a precision approach, or 800 and 2 with a non-precision, unless otherwise published. An airport with no instrument approach must allow a descent from the MEA and a landing under basic VFR.",
      "Carry the fuel and a real plan to actually reach and land at the alternate."
    ],
    quiz: [
      { type: "mc", q: "Under the 1-2-3 rule, you need a filed alternate if the destination forecast (1 hour before to 1 hour after ETA) is below:", choices: ["1,000 ft and 2 SM", "2,000 ft and 3 SM", "3,000 ft and 5 SM", "500 ft and 1 SM"], answer: 1, why: "A 2,000-foot ceiling and 3 SM around the ETA window exempts you; worse than that requires an alternate." },
      { type: "tf", q: "Standard alternate minimums with a precision approach are 600 feet and 2 miles.", answer: true, why: "600-2 (precision) or 800-2 (non-precision) are the standard alternate minimums unless otherwise published." }
    ]
  },
  "ireg-fuel": {
    title: "IFR fuel requirements",
    pathway: "airplane", cert: "IFR Regulations", faa: "cfr91",
    acs: "IFR regs — fuel", time: 5,
    explain: [
      "For IFR you must carry enough fuel to fly to the first airport of intended landing, then to the alternate if one is required, and then for 45 minutes more at normal cruise.",
      "That is a legal minimum, not a plan. Headwinds, holding, a missed approach, re-routes, and a busy approach environment all eat fuel, so most pilots add a generous personal reserve.",
      "Running tanks to the legal minimum in weather has ended badly many times, so plan conservatively and divert early."
    ],
    quiz: [
      { type: "mc", q: "IFR fuel must be enough to reach the destination, then the alternate if required, plus:", choices: ["15 minutes", "30 minutes", "45 minutes", "60 minutes"], answer: 2, why: "14 CFR 91.167 requires destination, alternate, and 45 minutes of reserve at normal cruise." },
      { type: "tf", q: "The IFR fuel minimum already includes a comfortable margin for holding and a missed approach.", answer: false, why: "It is a legal floor only; holding, a miss, and headwinds require extra fuel beyond the minimum." }
    ]
  },
  "ireg-equipment": {
    title: "Required equipment and inspections",
    pathway: "airplane", cert: "IFR Regulations", faa: "cfr91",
    acs: "IFR regs — equipment", time: 6,
    explain: [
      "IFR flight requires the VFR equipment plus, by the GRABCARD memory aid, items such as a Generator or alternator, attitude and heading indicators, a sensitive altimeter, a clock, and radios and navigation appropriate to the route.",
      "Two inspections matter for IFR: the pitot-static system and altimeter check every 24 calendar months, and the transponder check every 24 calendar months. To use VOR for IFR, a VOR accuracy check is required within the preceding 30 days.",
      "Confirm the aircraft and its logbooks are legal before launching into the clouds; an inoperative required item can ground the IFR flight."
    ],
    quiz: [
      { type: "mc", q: "The pitot-static and altimeter system inspection for IFR is required every:", choices: ["12 months", "24 calendar months", "100 hours", "6 months"], answer: 1, why: "14 CFR 91.411 requires the static system and altimeter check every 24 calendar months for IFR." },
      { type: "fill", q: "To use VOR for IFR navigation, a VOR accuracy check must have been done within the preceding ____ days.", answer: "30", why: "14 CFR 91.171 requires a VOR check within 30 days for IFR use." }
    ]
  },
  "ireg-clearances": {
    title: "Clearance limits, void times, and PIC authority",
    pathway: "airplane", cert: "IFR Regulations", faa: "cfr91",
    acs: "IFR regs — clearances & authority", time: 5,
    explain: [
      "Your clearance limit is the point to which you are cleared. Usually it is the destination, but if it is a fix, you hold there as published or as ATC directs and await further clearance.",
      "At non-towered airports you may get a clearance with a void time ('clearance void if not off by...'). If you do not depart by then, the clearance is void and you must contact ATC. You will also get a time to call if not airborne, so ATC knows you are still on the ground.",
      "The PIC has final authority and, in an emergency, may deviate from any rule to the extent required to handle it, then report the deviation if asked."
    ],
    quiz: [
      { type: "mc", q: "A 'clearance void time' at a non-towered airport means:", choices: ["You must land by that time", "The clearance is no longer valid if you have not departed by then", "You must hold for that long", "The weather expires"], answer: 1, why: "Miss the void time and the clearance is void; you must coordinate again with ATC." },
      { type: "tf", q: "In an emergency, the PIC may deviate from a regulation to the extent required to handle it.", answer: true, why: "14 CFR 91.3 grants the PIC authority to deviate in an emergency as needed." }
    ]
  },

  /* ===================== IFR Weather & Hazards ===================== */
  "iwx-icing": {
    title: "Structural icing",
    pathway: "airplane", cert: "IFR Weather & Hazards", faa: "ifh",
    acs: "IFR weather — structural icing", time: 6,
    explain: [
      "Structural ice forms when you fly through visible moisture (cloud or rain) at or below freezing. Clear ice from large drops is heavy and hard to shed; rime ice from small drops is rough and opaque; mixed ice combines both. Ice adds weight, destroys lift, increases drag, and can jam controls.",
      "Most light aircraft are not approved for flight into known icing. If you pick up ice, change altitude or course to leave the conditions, head for warmer air or clear sky, and land as soon as practical.",
      "Visible moisture plus freezing temperatures is the warning; have an escape plan before you are in it."
    ],
    quiz: [
      { type: "mc", q: "Structural icing requires freezing temperatures and:", choices: ["High winds", "Visible moisture", "Smooth air", "Daylight"], answer: 1, why: "Ice forms in visible moisture (cloud or precip) at or below freezing; both conditions are needed." },
      { type: "tf", q: "Most light training aircraft are approved for flight into known icing.", answer: false, why: "Few light aircraft are certified for known icing; the plan is to avoid and exit icing conditions." }
    ]
  },
  "iwx-convective": {
    title: "Embedded thunderstorms",
    pathway: "airplane", cert: "IFR Weather & Hazards", faa: "ifh",
    acs: "IFR weather — convection", time: 6,
    explain: [
      "Flying IFR in clouds, you cannot see thunderstorms, so embedded storms are especially dangerous. Severe turbulence, hail, lightning, and powerful up- and downdrafts can exceed the airplane's limits.",
      "Use every tool: a thorough briefing, convective SIGMETs, onboard or datalink radar (with its limitations and lag), and ATC for deviations. Give thunderstorms a wide berth — at least 20 nautical miles from severe cells.",
      "Never try to penetrate a line of storms or sneak under a building cell. Turning around or landing to wait is the professional choice."
    ],
    quiz: [
      { type: "tf", q: "Embedded thunderstorms are hazardous because they are hidden within clouds and cannot be seen.", answer: true, why: "In IMC you cannot visually avoid embedded storms, so radar, advisories, and ATC are essential." },
      { type: "mc", q: "A recommended avoidance distance from a severe thunderstorm cell is at least:", choices: ["2 NM", "5 NM", "20 NM", "100 NM"], answer: 2, why: "Staying at least 20 NM from severe cells avoids hail and turbulence thrown well outside the visible storm." }
    ]
  },
  "iwx-freezing": {
    title: "Freezing levels and freezing rain",
    pathway: "airplane", cert: "IFR Weather & Hazards", faa: "ifh",
    acs: "IFR weather — freezing levels", time: 5,
    explain: [
      "The freezing level is the altitude where the temperature reaches 0 degrees Celsius; icing is possible in visible moisture at and above it. Multiple freezing levels can exist when warm air overruns cold air.",
      "Freezing rain is a serious hazard. It means warmer air with liquid drops lies above, falling into a below-freezing layer, so climbing may put you into even worse icing while descending may reach warmer air. Know the temperature profile.",
      "Check the freezing-level products and the temperatures aloft before and during an IFR flight in cool, moist conditions."
    ],
    quiz: [
      { type: "mc", q: "The freezing level is the altitude where the temperature is:", choices: ["Minus 10 C", "0 degrees Celsius", "Plus 10 C", "The dew point"], answer: 1, why: "At the freezing level (0 C), icing becomes possible in visible moisture." },
      { type: "tf", q: "Freezing rain indicates a layer of warmer air aloft above colder air below.", answer: true, why: "Freezing rain forms when liquid drops fall from a warm layer through a sub-freezing layer near the surface." }
    ]
  },
  "iwx-ceilings": {
    title: "Ceilings, visibility, and IFR categories",
    pathway: "airplane", cert: "IFR Weather & Hazards", faa: "aim",
    acs: "IFR weather — flight categories", time: 5,
    explain: [
      "A ceiling is the lowest broken or overcast layer, or vertical visibility into an obscuration. Together with visibility it defines the flight category: VFR, Marginal VFR, IFR, and Low IFR.",
      "IFR conditions are roughly a ceiling 500 to below 1,000 feet and/or visibility 1 to less than 3 miles; LIFR is below 500 feet and/or less than 1 mile. These categories let you size up a route at a glance.",
      "Even instrument-rated, treat low ceilings and visibility with respect and weigh them against your approach minimums and personal limits."
    ],
    quiz: [
      { type: "mc", q: "A 'ceiling' is defined as the lowest layer reported as:", choices: ["Few", "Scattered", "Broken or overcast", "Clear"], answer: 2, why: "Broken or overcast (or vertical visibility into an obscuration) defines a ceiling; few and scattered do not." },
      { type: "tf", q: "LIFR (Low IFR) means a ceiling below 500 feet and/or visibility less than 1 mile.", answer: true, why: "LIFR is the most restrictive category, below 500 feet and/or under 1 SM." }
    ]
  },
  "iwx-sources": {
    title: "IFR weather products",
    pathway: "airplane", cert: "IFR Weather & Hazards", faa: "aim",
    acs: "IFR weather — products", time: 5,
    explain: [
      "For IFR planning, lean on the full suite: METARs and TAFs, graphical forecasts, winds and temperatures aloft, AIRMETs and SIGMETs (especially Zulu for icing and convective SIGMETs), PIREPs, and prognostic charts.",
      "In flight, datalink weather (FIS-B via ADS-B) and Flight Service updates help, but remember datalink radar is delayed. Use it strategically to plan around weather, not tactically to dodge individual cells.",
      "Build a complete picture before departure and keep updating it, because weather is dynamic and the freshest data wins."
    ],
    quiz: [
      { type: "mc", q: "Which advisory specifically covers icing?", choices: ["AIRMET Sierra", "AIRMET Tango", "AIRMET Zulu", "Convective SIGMET"], answer: 2, why: "Zulu addresses icing and freezing levels; Sierra is IFR/obscuration and Tango is turbulence." },
      { type: "tf", q: "Datalink (FIS-B) radar imagery is delayed and should not be used to tactically dodge individual storm cells.", answer: true, why: "Datalink radar lag means it shows where storms were, not exactly where they are now." }
    ]
  },

  /* ===================== Attitude Instrument Flying ===================== */
  "iai-scan": {
    title: "The instrument scan",
    pathway: "airplane", cert: "Attitude Instrument Flying", faa: "ifh",
    acs: "Attitude flying — cross-check", time: 6,
    explain: [
      "Attitude instrument flying replaces the outside horizon with the instruments. The attitude indicator is the control instrument: you set a pitch-and-bank attitude and power, then cross-check the performance instruments (altimeter, airspeed, heading, VSI, turn coordinator) to confirm the result.",
      "A good scan moves continuously and keeps returning to the attitude indicator without fixating on any one instrument. Fixation, omission, and chasing the needles are the classic scan errors.",
      "Control-and-performance and primary-and-supporting are two ways to think about it; either way, smooth, small inputs and a disciplined cross-check keep you precise."
    ],
    quiz: [
      { type: "mc", q: "In attitude instrument flying, the primary 'control' instrument is the:", choices: ["Altimeter", "Attitude indicator", "Heading indicator", "VSI"], answer: 1, why: "You set attitude on the attitude indicator, then cross-check performance instruments to verify." },
      { type: "tf", q: "Fixating on a single instrument is a common instrument-scan error.", answer: true, why: "Fixation, along with omission and over-emphasis, breaks the cross-check and degrades control." }
    ]
  },
  "iai-unusual": {
    title: "Unusual attitude recovery",
    pathway: "airplane", cert: "Attitude Instrument Flying", faa: "ifh",
    acs: "Attitude flying — unusual attitudes", time: 6,
    explain: [
      "An unusual attitude is an unintended, often steep nose-high or nose-low condition. Recognize it on the instruments: nose-high shows decreasing airspeed and increasing altitude; nose-low shows increasing airspeed and decreasing altitude.",
      "For nose-high: add power, lower the nose, and level the wings. For nose-low: reduce power, level the wings, then smoothly raise the nose. Trust the instruments and avoid abrupt inputs that could overstress the airplane.",
      "Practiced recoveries build the reflexes you need if disorientation or turbulence upsets the airplane in IMC."
    ],
    quiz: [
      { type: "mc", q: "To recover from a nose-low unusual attitude you should:", choices: ["Add power and pull up hard", "Reduce power, level the wings, then raise the nose", "Maintain power and bank", "Close your eyes"], answer: 1, why: "Reducing power and leveling the wings first prevents overspeed and over-G before recovering pitch." },
      { type: "tf", q: "Decreasing airspeed with increasing altitude indicates a nose-high unusual attitude.", answer: true, why: "Nose-high shows rising altitude and falling airspeed; nose-low shows the opposite." }
    ]
  },
  "iai-partial": {
    title: "Partial panel",
    pathway: "airplane", cert: "Attitude Instrument Flying", faa: "ifh",
    acs: "Attitude flying — instrument failures", time: 6,
    explain: [
      "Instruments fail. A vacuum failure can quietly disable the attitude and heading indicators, while a blocked pitot or static port corrupts the airspeed, altimeter, and VSI. Partial-panel flying means controlling the airplane on the remaining instruments.",
      "Cross-check to catch a failure early: if the attitude indicator disagrees with the turn coordinator, compass, and altimeter, suspect it. Cover or ignore the failed instrument and fly the others; glass cockpits add their own failure modes and reversionary displays to learn.",
      "Stay calm, fly a known attitude and power, and lean on ATC while you sort it out."
    ],
    quiz: [
      { type: "mc", q: "A vacuum system failure most directly affects the:", choices: ["Altimeter and airspeed", "Attitude and heading indicators", "Turn coordinator", "Tachometer"], answer: 1, why: "Vacuum-driven gyros power the attitude and heading indicators, which fail (often subtly) when the pump quits." },
      { type: "tf", q: "A blocked pitot tube affects the airspeed indicator.", answer: true, why: "The airspeed indicator depends on pitot ram pressure; a blockage makes it misread." }
    ]
  },
  "iai-spatial": {
    title: "Spatial disorientation in IMC",
    pathway: "airplane", cert: "Attitude Instrument Flying", faa: "ifh",
    acs: "Attitude flying — disorientation", time: 6,
    explain: [
      "In cloud or at night the inner ear and seat-of-the-pants senses give false cues. The leans, the graveyard spiral, and the somatogravic illusion can all convince you the airplane is doing something it is not. The only reliable reference is the instruments.",
      "Believe the panel, not your body. Keep the scan going, make small corrections, and resist the urge to fix what your senses are telling you. Avoid sudden head movements that can trigger the Coriolis illusion.",
      "For VFR pilots the lesson is blunt: do not fly into IMC without the rating and currency, because disorientation kills quickly."
    ],
    quiz: [
      { type: "mc", q: "The only reliable way to know the airplane's attitude in the clouds is to:", choices: ["Feel it", "Trust the flight instruments", "Look outside", "Listen to the engine"], answer: 1, why: "Vestibular and tactile senses are unreliable without a visual horizon; the instruments are truth." },
      { type: "tf", q: "Sudden head movements in IMC can trigger the disorienting Coriolis illusion.", answer: true, why: "Head movement during a turn can produce a powerful tumbling sensation, so move the head slowly." }
    ]
  },
  "iai-autopilot": {
    title: "Autopilot and avionics in IFR",
    pathway: "airplane", cert: "Attitude Instrument Flying", faa: "ifh",
    acs: "Attitude flying — automation", time: 5,
    explain: [
      "A well-used autopilot is a huge workload reducer in IMC, flying headings, courses, altitudes, and even coupled approaches while you manage the bigger picture. But you must know its modes, what it is doing, and how to disconnect and hand-fly instantly if it misbehaves.",
      "Program ahead, verify the active and armed modes, and monitor. Automation surprises — a wrong mode, an unexpected level-off, or a failed capture — cause accidents when pilots stop flying the airplane. Aviate, navigate, communicate still rules.",
      "Treat the autopilot as a capable but literal assistant: it does exactly what you told it, which is not always what you wanted."
    ],
    quiz: [
      { type: "tf", q: "You should know how to disconnect the autopilot and hand-fly immediately if it does something unexpected.", answer: true, why: "Reverting to manual control resolves automation confusion and keeps you in command." },
      { type: "mc", q: "The top priority if the automation does something unexpected in IMC is to:", choices: ["Re-program it first", "Aviate — fly the airplane", "Call the manufacturer", "Ignore it"], answer: 1, why: "Aviate, navigate, communicate: maintain control first, then sort out the automation." }
    ]
  }

});
