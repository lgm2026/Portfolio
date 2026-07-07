/* AvHype Aviation Education — second-wave airplane PPL lessons (extra2).
   Merges into the existing LESSONS map. Pure data; JSON-serializable. */
window.__AV_LESSONS__ = Object.assign((window.__AV_LESSONS__ || {}), {

  /* ===================== Airspace System in Depth ===================== */
  "as-classes": {
    title: "Class A, B, C, and D airspace",
    pathway: "airplane", cert: "Airspace System in Depth", faa: "aim",
    acs: "Airspace — controlled classes & entry", time: 6,
    explain: [
      "Class A starts at 18,000 ft MSL up to FL600 across the entire country. It is IFR-only and requires a clearance, so you will not enter it as a VFR student.",
      "Class B surrounds the busiest airports in an upside-down-wedding-cake shape. You need an explicit ATC clearance to enter (you must actually hear 'cleared into the Bravo'), plus a Mode C transponder and ADS-B Out. Some Class B airports are off-limits to student pilots, and a special endorsement is required.",
      "Class C wraps a busy airport that has a tower and radar approach control. You must establish two-way radio communication before entering and carry a transponder/ADS-B. It is typically a 5 NM core to the surface and a 10 NM shelf from 1,200 to 4,000 ft AGL.",
      "Class D is a tower-equipped airport with lighter traffic. You must establish two-way radio communication before entering, usually surface to 2,500 ft AGL within about 4 NM. When the tower closes, Class D normally reverts to Class E or G."
    ],
    quiz: [
      { type: "mc", q: "To enter Class C airspace you must, at a minimum:", choices: ["Receive an explicit clearance to enter", "Establish two-way radio communication before entering", "Be on an IFR flight plan", "Hold a private certificate"], answer: 1, why: "Class C requires two-way radio communication established (your callsign acknowledged) plus a transponder; an explicit 'cleared to enter' is a Bravo requirement." },
      { type: "tf", q: "Class B airspace requires an explicit ATC clearance to enter.", answer: true, why: "You must hear 'cleared into the Class Bravo' — merely establishing radio contact is not enough." },
      { type: "mc", q: "Class A airspace begins at:", choices: ["10,000 ft MSL", "14,500 ft MSL", "18,000 ft MSL", "FL600"], answer: 2, why: "Class A runs 18,000 ft MSL up to FL600 and is IFR-only." }
    ]
  },
  "as-eg": {
    title: "Class E, Class G, and VFR weather minimums",
    pathway: "airplane", cert: "Airspace System in Depth", faa: "aim",
    acs: "Airspace — Class E/G & VFR minimums", time: 6,
    explain: [
      "Class E is controlled airspace that is not A, B, C, or D. It fills most of the map, often starting at 1,200 ft AGL, or at 700 ft AGL near airports with instrument approaches (shown by the faded magenta shading). A magenta dashed line marks surface-based Class E around some airports.",
      "Class G is uncontrolled airspace, usually a thin layer near the surface up to 700 or 1,200 ft AGL where ATC provides no separation. No clearance or radio is required, but you still fly the VFR weather minimums and see-and-avoid.",
      "VFR minimums change with airspace and altitude. A few to know: Class B is 3 SM visibility and clear of clouds. Class C, D, and E below 10,000 ft MSL use the '3-152' rule: 3 SM visibility with 500 ft below, 1,000 ft above, and 2,000 ft horizontal cloud clearance. Daytime Class G below 1,200 ft AGL relaxes to 1 SM and clear of clouds."
    ],
    quiz: [
      { type: "mc", q: "The basic VFR cloud clearance in Class D airspace is:", choices: ["Clear of clouds", "500 ft below, 1,000 ft above, 2,000 ft horizontal", "1,000 ft below, 1,000 ft above, 1 mile", "Above the clouds only"], answer: 1, why: "The 3-152 rule: 3 SM visibility with 500 below / 1,000 above / 2,000 horizontal cloud clearance." },
      { type: "tf", q: "Class G airspace is uncontrolled and ATC provides no traffic separation there.", answer: true, why: "Class G is uncontrolled; pilots are responsible for see-and-avoid." },
      { type: "fill", q: "On a sectional, the faded magenta shading around an airport means Class E begins at ____ feet AGL.", answer: "700", why: "Faded magenta = Class E floor at 700 ft AGL near airports with instrument approaches; a magenta dashed line is surface Class E." }
    ]
  },
  "as-sua": {
    title: "Special use airspace",
    pathway: "airplane", cert: "Airspace System in Depth", faa: "aim",
    acs: "Airspace — special use areas", time: 5,
    explain: [
      "Prohibited areas (P-) ban flight entirely, such as P-56 over the U.S. Capitol and White House. Restricted areas (R-) contain hazards like artillery or missile testing; when 'hot' you may transit only with permission from the controlling agency, otherwise remain clear.",
      "Warning areas (W-) are like restricted areas but over international waters. Military Operations Areas (MOAs) separate military training from IFR traffic — VFR pilots may legally fly through but should use extreme caution and check whether the MOA is active.",
      "Alert areas (A-) warn of a high volume of pilot training or unusual activity, and controlled firing areas stop their activity when an aircraft approaches. Knowing what each color and label means keeps you out of places you should not be."
    ],
    quiz: [
      { type: "mc", q: "You may transit an active Restricted area:", choices: ["Anytime under VFR", "Only with permission from the controlling agency", "Never under any circumstances", "Only at night"], answer: 1, why: "Restricted areas contain real hazards; you need permission from the controlling agency to enter when active." },
      { type: "tf", q: "VFR aircraft are prohibited from flying through an active MOA.", answer: false, why: "VFR aircraft may legally transit an MOA but should use extreme caution and ideally request traffic advisories." }
    ]
  },
  "as-tfr": {
    title: "TFRs, NOTAMs, and other restrictions",
    pathway: "airplane", cert: "Airspace System in Depth", faa: "notams",
    acs: "Airspace — TFRs & notices", time: 5,
    explain: [
      "A NOTAM (Notice to Air Missions) is a time-critical notice about airspace or an airport — a closed runway, an out-of-service light, GPS testing, and more. Reviewing NOTAMs is part of every preflight because the rules require you to be familiar with all available information.",
      "A TFR (Temporary Flight Restriction) closes airspace for safety or security: wildfires, disaster areas, VIP and Presidential movement, and major sporting events. The standing stadium TFR restricts flight within 3 NM and up to 3,000 ft AGL during big events.",
      "An ADIZ (Air Defense Identification Zone) requires a flight plan and transponder for national security; the Washington, DC area adds a Special Flight Rules Area. Busting a TFR can lead to interception and certificate action, so check before and during every flight."
    ],
    quiz: [
      { type: "tf", q: "Checking NOTAMs and TFRs is a required part of preflight planning.", answer: true, why: "14 CFR 91.103 requires becoming familiar with all available information, including NOTAMs and TFRs." },
      { type: "mc", q: "A standing 'stadium TFR' over a large sporting event typically restricts flight within:", choices: ["1 NM and 1,000 ft", "3 NM and 3,000 ft AGL", "5 NM and 5,000 ft", "10 NM and 10,000 ft"], answer: 1, why: "The standing sports-stadium TFR is 3 NM and up to 3,000 ft AGL for events with large attendance." }
    ]
  },
  "as-equip": {
    title: "Transponder, ADS-B, and entry requirements",
    pathway: "airplane", cert: "Airspace System in Depth", faa: "aim",
    acs: "Airspace — equipment requirements", time: 5,
    explain: [
      "A Mode C transponder reports your altitude; ADS-B Out broadcasts your GPS position. Both are required in and above Class B and C, above 10,000 ft MSL (except below 2,500 ft AGL), and within the Mode C veil — the 30 NM ring around a Class B primary airport.",
      "A two-way radio is required to enter Class B, C, and D, plus surface Class E at some airports. In Class B you additionally need an explicit clearance, not just radio contact.",
      "Set the transponder to ALT (Mode C) and squawk 1200 for VFR unless ATC assigns a discrete code. Press IDENT only when a controller asks you to."
    ],
    quiz: [
      { type: "mc", q: "The 'Mode C veil' is a ____ ring around a Class B primary airport within which a transponder and ADS-B Out are required.", choices: ["10 NM", "20 NM", "30 NM", "60 NM"], answer: 2, why: "The Mode C veil extends 30 NM from the Class B primary airport, from the surface up to 10,000 ft MSL." },
      { type: "fill", q: "The standard VFR transponder code is ____.", answer: "1200", why: "Squawk 1200 for VFR flight unless ATC assigns a discrete code." }
    ]
  },

  /* ===================== Radio Communications ===================== */
  "com-basics": {
    title: "Radio basics: who, frequencies, and the phonetic alphabet",
    pathway: "airplane", cert: "Radio Communications", faa: "aim",
    acs: "Communication — basic technique", time: 5,
    explain: [
      "The phonetic alphabet (Alpha, Bravo, Charlie and so on) and the number words (niner, tree, fife) keep letters and digits from blurring over a scratchy radio.",
      "A clear initial call has four parts: who you are calling, who you are, where you are, and what you want — for example, 'Charlotte Tower, Cessna One-Two-Three-Alpha-Bravo, ten miles south, landing with information Kilo.'",
      "Listen before you key the mic so you do not block someone, keep it brief, and use standard phraseology so everyone on frequency builds the same mental picture of the traffic."
    ],
    quiz: [
      { type: "mc", q: "A complete initial radio call generally includes:", choices: ["Only your callsign", "Who you are calling, who you are, where you are, and what you want", "The weather and your fuel state", "Your home airport"], answer: 1, why: "The 'four W's' give ATC a complete picture in a single transmission." },
      { type: "tf", q: "You should listen on a frequency before transmitting.", answer: true, why: "Listening first avoids stepping on (blocking) another transmission." }
    ]
  },
  "com-phrase": {
    title: "Phraseology and readbacks",
    pathway: "airplane", cert: "Radio Communications", faa: "aim",
    acs: "Communication — phraseology", time: 5,
    explain: [
      "Read back anything ATC asks you to do — runway assignments, hold-short instructions, altitudes, and headings — so the controller can catch an error before it becomes a problem.",
      "Know the words: 'Roger' means I received your message (not yes). 'Wilco' means I will comply. 'Affirmative' and 'Negative' are yes and no. 'Unable' means you cannot do what was asked.",
      "If you miss something, say 'Say again.' If you need it slower, ask. There is no penalty for asking — runway incursions and altitude busts come from guessing instead of confirming."
    ],
    quiz: [
      { type: "mc", q: "'Roger' means:", choices: ["Yes", "No", "I received your transmission", "I will comply"], answer: 2, why: "'Roger' only acknowledges receipt; use 'Wilco' for 'will comply' and 'Affirmative' for yes." },
      { type: "tf", q: "You must read back runway hold-short instructions.", answer: true, why: "Hold-short instructions require a readback including the runway number — a key defense against runway incursions." }
    ]
  },
  "com-nontower": {
    title: "Non-towered airports: CTAF and self-announce",
    pathway: "airplane", cert: "Radio Communications", faa: "aim",
    acs: "Communication — non-towered ops", time: 5,
    explain: [
      "Most U.S. airports have no control tower. Pilots share a Common Traffic Advisory Frequency (CTAF) — sometimes called UNICOM or MULTICOM — and self-announce their position and intentions.",
      "Announce when entering the pattern and on each leg (downwind, base, final) and when clearing the runway, always finishing with the airport name: 'Smithville traffic, Cessna One-Two-Three-Alpha-Bravo, left downwind runway one-eight, Smithville.'",
      "There is no controller, so standard pattern procedures and see-and-avoid keep everyone apart. UNICOM (often the FBO) can offer advisories and the favored runway, but it is not ATC and cannot clear you to do anything."
    ],
    quiz: [
      { type: "mc", q: "At a non-towered airport, the frequency pilots use to announce position and intentions is the:", choices: ["ATIS", "CTAF", "Approach control", "Clearance delivery"], answer: 1, why: "CTAF (Common Traffic Advisory Frequency) is the self-announce frequency at non-towered fields." },
      { type: "tf", q: "UNICOM at a non-towered airport can clear you to land.", answer: false, why: "UNICOM (usually the FBO) gives advisories only; there is no ATC clearance at a non-towered airport." }
    ]
  },
  "com-tower": {
    title: "Towered operations: ATIS, ground, and tower",
    pathway: "airplane", cert: "Radio Communications", faa: "aim",
    acs: "Communication — towered ops", time: 5,
    explain: [
      "At a towered airport, get the ATIS first — recorded weather and field information tagged with a phonetic letter — then call the right controller for each phase of flight.",
      "Clearance delivery handles IFR and sometimes VFR flight following, Ground control handles taxiing to and from the runway, Tower owns the runway for takeoff and landing, and Departure or Approach (radar) work with you once airborne.",
      "'Cleared for takeoff,' 'Line up and wait,' and 'Cleared to land' all come from Tower. Tell Tower you have the current ATIS letter, as in '...with information Bravo.'"
    ],
    quiz: [
      { type: "mc", q: "Before calling Ground or Tower at a towered field, you should first:", choices: ["Take off", "Listen to the ATIS", "File a flight plan", "Call your instructor"], answer: 1, why: "The ATIS gives current weather and field conditions; controllers expect you to have the latest letter." },
      { type: "mc", q: "Which controller issues a takeoff clearance?", choices: ["Ground", "Tower", "Clearance delivery", "Approach"], answer: 1, why: "Tower owns the active runway and issues takeoff and landing clearances; Ground handles taxiing." }
    ]
  },
  "com-lost": {
    title: "Lost communications and emergency codes",
    pathway: "airplane", cert: "Radio Communications", faa: "aim",
    acs: "Communication — lost comms", time: 5,
    explain: [
      "If your radio fails under VFR at a towered airport, the tower uses light gun signals. In flight: steady green means cleared to land, flashing green means return to land, steady red means give way and keep circling, flashing red means the airport is unsafe — do not land, and flashing white means return to your starting point on the airport.",
      "Transponder emergency codes are 7500 for hijack, 7600 for lost communications, and 7700 for a general emergency. A memory aid: 7500 taken alive, 7600 cannot talk, 7700 going to heaven.",
      "Whatever happens, fly the airplane first, squawk the right code, and fall back on known procedures rather than fixating on the radio."
    ],
    quiz: [
      { type: "mc", q: "A steady green light gun signal from the tower to an aircraft in flight means:", choices: ["Cleared to land", "Return to land", "Give way to other traffic", "Airport unsafe, do not land"], answer: 0, why: "Steady green in flight = cleared to land; flashing green = return to land." },
      { type: "fill", q: "The transponder code for lost communications is ____.", answer: "7600", why: "7600 signals a radio/communications failure; 7700 is a general emergency and 7500 is hijack." }
    ]
  },

  /* ===================== Airport & Night Operations ===================== */
  "apt-markings": {
    title: "Runway and taxiway markings",
    pathway: "airplane", cert: "Airport & Night Operations", faa: "aim",
    acs: "Airport ops — markings", time: 5,
    explain: [
      "Runway markings are white: the runway number (its magnetic heading rounded to the nearest ten degrees), centerline, threshold bars, aiming point, and touchdown-zone stripes. A displaced threshold — arrows leading to a solid line — may be used for taxi and takeoff but not for landing before it.",
      "Taxiway markings are yellow: a solid taxiway centerline and the runway holding position marking, which is two solid and two dashed yellow lines. You hold on the solid side and never cross toward the runway side without a clearance at a towered field, or without confirming it is clear at a non-towered field.",
      "A closed runway or taxiway is marked with a large yellow X. Reading the paint correctly is one of the best defenses against a runway incursion."
    ],
    quiz: [
      { type: "mc", q: "The runway holding position marking is:", choices: ["A single solid white line", "Two solid and two dashed yellow lines", "A yellow X", "A red square"], answer: 1, why: "You hold on the solid side; crossing toward the dashed side enters the runway environment." },
      { type: "tf", q: "You may land in the area before a displaced threshold.", answer: false, why: "A displaced threshold may be used for taxi and takeoff but not for landing." }
    ]
  },
  "apt-signs": {
    title: "Airport signs",
    pathway: "airplane", cert: "Airport & Night Operations", faa: "aim",
    acs: "Airport ops — signs", time: 5,
    explain: [
      "Mandatory instruction signs are red with white text — runway holding positions such as '27-9' and areas you may not enter without a clearance.",
      "Location signs are black with yellow text and a yellow border; they tell you which taxiway or runway you are on, for example 'B.' Direction and destination signs are yellow with black text and point the way to taxiways or destinations.",
      "Distance-remaining signs are black with white numbers showing the thousands of feet of runway left. Together these signs help you keep a clear mental map while taxiing."
    ],
    quiz: [
      { type: "mc", q: "A red sign with white lettering at an airport is a:", choices: ["Location sign", "Direction sign", "Mandatory instruction sign", "Distance-remaining sign"], answer: 2, why: "Red signs with white text mark runway holding positions and no-entry areas — never pass without a clearance." },
      { type: "fill", q: "A black sign with yellow lettering and a yellow border that reads 'B' is a ____ sign.", answer: "location", why: "A black background with yellow text and border identifies your current taxiway or runway location." }
    ]
  },
  "apt-lighting": {
    title: "Airport lighting and approach slope aids",
    pathway: "airplane", cert: "Airport & Night Operations", faa: "aim",
    acs: "Airport ops — lighting", time: 5,
    explain: [
      "Runway edge lights are white, turning yellow in the last 2,000 ft of an instrument runway. The rotating beacon for a civilian land airport alternates green and white; if it is on in the daytime, the field may be below VFR minimums.",
      "VASI and PAPI give you a visual glidepath on approach. On a VASI, 'red over white, you're alright' means on glidepath; red over red is too low and white over white is too high. A PAPI shows two red and two white lights when you are on slope.",
      "Many non-towered airports have pilot-controlled lighting — key the microphone a set number of times on the CTAF to turn the lights on and adjust their brightness."
    ],
    quiz: [
      { type: "mc", q: "On a two-bar VASI, 'red over white' means you are:", choices: ["Too high", "On the glidepath", "Too low", "Off course"], answer: 1, why: "'Red over white, you're alright' — on glidepath; red over red is low and white over white is high." },
      { type: "tf", q: "At some airports you can turn on the runway lights by keying your microphone on the CTAF.", answer: true, why: "Pilot-controlled lighting activates when you key the mic a specified number of times." }
    ]
  },
  "apt-windlahso": {
    title: "Wind indicators, runway choice, and LAHSO",
    pathway: "airplane", cert: "Airport & Night Operations", faa: "aim",
    acs: "Airport ops — wind & LAHSO", time: 5,
    explain: [
      "Take off and land into the wind when practical. Read the wind sock (it fills from the windward side and points downwind, stiffening as the wind strengthens), the tetrahedron, or the wind tee. A runway number is its magnetic heading, so runway 27 points roughly west, about 270 degrees.",
      "If the crosswind component is beyond your skill or the airplane's demonstrated limit, choose a different runway or a different airport.",
      "LAHSO — Land and Hold Short Operations — asks you to land and stop before an intersecting runway. Any pilot, and especially a student, may decline a LAHSO clearance by simply saying 'unable' if it is not comfortable."
    ],
    quiz: [
      { type: "mc", q: "A wind sock shows the wind:", choices: ["In the direction it points toward", "Coming from the large (open) end toward the small end", "Always from the north", "Only its speed, not direction"], answer: 1, why: "The sock fills from the windward side and trails downwind, showing both direction and rough speed." },
      { type: "tf", q: "You may decline a LAHSO clearance if you are not comfortable accepting it.", answer: true, why: "Pilots can and should decline a LAHSO clearance ('unable') when in doubt; safety comes first." }
    ]
  },
  "apt-night": {
    title: "Night operations",
    pathway: "airplane", cert: "Airport & Night Operations", faa: "cfr91",
    acs: "Airport ops — night flying", time: 6,
    explain: [
      "For night flight, required equipment includes position lights (red on the left wing, green on the right, white on the tail) and an anti-collision light; aircraft for hire also need a landing light. To carry passengers at night you must have made three takeoffs and landings to a full stop within the preceding 90 days, flown during the period from one hour after sunset to one hour before sunrise.",
      "Your eyes need about 30 minutes to adapt to darkness. Use red or dim cockpit lighting and look slightly off-center at faint objects to use your more light-sensitive peripheral (rod) vision.",
      "Expect fewer visual cues, harder-to-see terrain and weather, and a higher workload. Carry a flashlight with a spare, and give yourself larger margins than you would in daylight."
    ],
    quiz: [
      { type: "mc", q: "To carry passengers at night you must have made, within the preceding 90 days, three takeoffs and landings to a full stop during:", choices: ["Daylight", "The period 1 hour after sunset to 1 hour before sunrise", "Any time at night", "A cross-country flight"], answer: 1, why: "Night passenger currency requires three full-stop takeoffs and landings in that defined night period within 90 days." },
      { type: "tf", q: "Looking slightly off-center helps you see faint objects better at night.", answer: true, why: "Off-center viewing uses peripheral rod cells, which are more light-sensitive in the dark." }
    ]
  },

  /* ===================== Performance, Weight & Balance ===================== */
  "perf-da": {
    title: "Density altitude",
    pathway: "airplane", cert: "Performance, Weight & Balance", faa: "phak",
    acs: "Performance — density altitude", time: 6,
    explain: [
      "Density altitude is pressure altitude corrected for a nonstandard temperature — the altitude the airplane actually feels. High density altitude comes from high elevation, high temperature, and high humidity, which thin the air so the wing makes less lift, the engine makes less power, and the propeller bites less. High, hot, and humid all hurt performance.",
      "The result is a longer takeoff and landing roll, weaker climb, and a higher true airspeed for the same indicated airspeed. Hot-and-high days have caused many accidents when airplanes simply ran out of runway or could not out-climb terrain.",
      "Compute density altitude before flight, especially at mountain or desert airports, and add generous margins to the book numbers."
    ],
    quiz: [
      { type: "mc", q: "Density altitude is highest on a day that is:", choices: ["Cold and dry at sea level", "Hot, high, and humid", "Cool and at high elevation", "Warm with low humidity at sea level"], answer: 1, why: "High temperature, elevation, and humidity all lower air density, raising density altitude and degrading performance." },
      { type: "tf", q: "High density altitude lengthens your takeoff roll and reduces climb performance.", answer: true, why: "Thinner air reduces lift, thrust, and engine power, so the airplane needs more runway and climbs poorly." }
    ]
  },
  "perf-wb": {
    title: "Weight and balance",
    pathway: "airplane", cert: "Performance, Weight & Balance", faa: "wbh",
    acs: "Performance — weight & balance", time: 7,
    explain: [
      "Every item aboard has a weight and an arm — its distance from a reference datum. Weight times arm equals moment. Add the moments and divide by the total weight to find the center of gravity (CG), then confirm it falls inside the manufacturer's CG envelope at or below the maximum gross weight.",
      "Too much weight lengthens the takeoff, reduces climb, and raises the stall speed. A CG too far forward makes the airplane nose-heavy and hard to flare; a CG too far aft is more dangerous because it reduces stability and can make stall or spin recovery difficult or impossible.",
      "Always run the numbers for the actual loading. An airplane that is legal when empty can be over gross or out of CG with four adults, full fuel, and bags."
    ],
    quiz: [
      { type: "mc", q: "Center of gravity is found by:", choices: ["Adding all the weights", "Dividing total moment by total weight", "Multiplying weight by fuel", "Subtracting arm from weight"], answer: 1, why: "CG equals total moment divided by total weight, then checked against the envelope." },
      { type: "tf", q: "An aft CG is generally more hazardous than a forward CG because it reduces stability.", answer: true, why: "An aft CG decreases longitudinal stability and can make stall and spin recovery very difficult." }
    ]
  },
  "perf-charts": {
    title: "Takeoff and landing performance charts",
    pathway: "airplane", cert: "Performance, Weight & Balance", faa: "phak",
    acs: "Performance — charts", time: 6,
    explain: [
      "The POH or AFM provides takeoff and landing distance charts based on weight, pressure altitude, temperature, wind, and runway slope or surface. You interpolate between the lines for your exact conditions rather than guessing.",
      "Charts usually assume a paved, level, dry runway and a specific technique. Grass, slope, contamination, or sloppy technique all add distance, so apply the regulatory and personal safety factors — many pilots add 50 percent to book landing distance.",
      "Always compare the required distance to the runway available, including clearing the 50-foot obstacle that the charts reference off the end."
    ],
    quiz: [
      { type: "mc", q: "Aircraft takeoff and landing charts are typically based on a runway that is:", choices: ["Grass and uphill", "Paved, level, and dry", "Wet and contaminated", "Any surface"], answer: 1, why: "Book numbers assume ideal paved, level, and dry conditions; real surfaces and slopes add distance." },
      { type: "tf", q: "You should add a safety margin to book landing distance rather than using it exactly.", answer: true, why: "Book distances assume perfect technique and conditions; prudent pilots add a margin, often 50 percent." }
    ]
  },
  "perf-climb": {
    title: "Climb performance: Vx and Vy",
    pathway: "airplane", cert: "Performance, Weight & Balance", faa: "phak",
    acs: "Performance — climb speeds", time: 5,
    explain: [
      "Vx is the best angle-of-climb speed — the most altitude gained per foot of ground covered. Use it to clear an obstacle just off the end of the runway.",
      "Vy is the best rate-of-climb speed — the most altitude gained per minute. Use it for an efficient climb to cruise when obstacles are not a factor.",
      "As you climb, the gap between Vx and Vy shrinks until they meet at the absolute ceiling. The service ceiling is the altitude where the airplane can still climb only 100 feet per minute."
    ],
    quiz: [
      { type: "mc", q: "To clear an obstacle just past the end of the runway, you climb at:", choices: ["Vy", "Vx", "Va", "Vne"], answer: 1, why: "Vx (best angle) gives the most altitude per unit of horizontal distance — best for obstacle clearance." },
      { type: "fill", q: "The altitude where a light airplane can climb only 100 feet per minute is its ____ ceiling.", answer: "service", why: "Service ceiling is defined as the altitude where the maximum climb rate falls to 100 fpm." }
    ]
  },
  "perf-loadcg": {
    title: "When loading goes wrong",
    pathway: "airplane", cert: "Performance, Weight & Balance", faa: "wbh",
    acs: "Performance — loading effects", time: 5,
    explain: [
      "Overweight: the wing must fly at a higher angle of attack, so stall speed rises, takeoff and landing distances grow, climb and ceiling drop, and structural margins shrink — especially in turbulence or maneuvers.",
      "Forward CG: more stable but heavy elevator forces, a higher stall speed, and a hard or impossible flare. You can run out of up-elevator on landing.",
      "Aft CG: lighter controls and a slightly faster cruise, but reduced stability, a tendency to over-control, and dangerous stall and spin behavior. Stay inside the envelope for every phase of flight, and remember the CG shifts as fuel burns."
    ],
    quiz: [
      { type: "mc", q: "Operating an airplane over its maximum gross weight will:", choices: ["Lower the stall speed", "Increase climb performance", "Increase the stall speed and takeoff distance", "Have no effect"], answer: 2, why: "Extra weight requires a higher angle of attack to fly, raising stall speed and degrading takeoff and climb." },
      { type: "tf", q: "The CG can shift during flight as fuel is burned.", answer: true, why: "Burning fuel changes weight and, depending on tank location, can move the CG — check it stays in limits throughout." }
    ]
  },

  /* ===================== Core Flight Maneuvers ===================== */
  "man-slowflight": {
    title: "Slow flight",
    pathway: "airplane", cert: "Core Flight Maneuvers", faa: "afh",
    acs: "Maneuvers — slow flight", time: 5,
    explain: [
      "Slow flight means flying at a low airspeed just above a stall warning, on the back side of the power curve — where it takes more power, not less, to hold altitude as the speed decreases. The controls feel mushy and the nose sits high.",
      "It teaches the feel of the airplane near its limits: small, smooth, coordinated inputs, leading with power, and respecting that the airplane is close to stalling.",
      "This is the regime of takeoff, landing, and the go-around, so being comfortable here pays off on every flight."
    ],
    quiz: [
      { type: "mc", q: "In slow flight, to maintain altitude as airspeed decreases you generally need:", choices: ["Less power", "More power", "No power change", "Full flaps only"], answer: 1, why: "On the back side of the power curve, more power is required to hold altitude as speed decreases." },
      { type: "tf", q: "Flight controls feel less responsive (mushy) in slow flight.", answer: true, why: "Lower airflow over the control surfaces reduces their effectiveness, so the controls feel sloppy." }
    ]
  },
  "man-stalls": {
    title: "Power-off and power-on stalls",
    pathway: "airplane", cert: "Core Flight Maneuvers", faa: "afh",
    acs: "Maneuvers — stalls", time: 6,
    explain: [
      "A power-off, or approach-to-landing, stall simulates a mishandled landing: reduce power, set the landing configuration, then raise the nose until it stalls and recover. A power-on, or departure, stall simulates a too-steep climb after takeoff using climb power.",
      "The recovery is always the same: reduce the angle of attack by lowering the nose, add power as appropriate, level the wings with coordinated rudder, and minimize altitude loss.",
      "The goal is not to fear stalls but to recognize the cues early and react automatically, because most stall accidents happen low and slow in the traffic pattern."
    ],
    quiz: [
      { type: "mc", q: "A 'departure stall' is practiced in which configuration?", choices: ["Idle power, full flaps", "Climb power, takeoff configuration", "Cruise", "Descending turn at idle"], answer: 1, why: "The power-on, or departure, stall simulates an excessively nose-high climb just after takeoff." },
      { type: "tf", q: "The first recovery action for any stall is to reduce the angle of attack.", answer: true, why: "Lowering the nose reduces AOA and reattaches the airflow; power and wing-leveling follow." }
    ]
  },
  "man-steep": {
    title: "Steep turns",
    pathway: "airplane", cert: "Core Flight Maneuvers", faa: "afh",
    acs: "Maneuvers — steep turns", time: 5,
    explain: [
      "A steep turn is a 45-degree bank (private) or 50-degree bank (commercial) 360-degree turn at constant altitude and airspeed. As bank increases, load factor and the required vertical lift rise, so you add back pressure and a little power to hold altitude.",
      "It builds smooth coordination, division of attention, and a feel for load factor: at 60 degrees of bank you pull 2 Gs and stall speed climbs about 40 percent.",
      "Watch for the nose dropping (add back pressure or reduce bank) or ballooning up (relax back pressure), and roll out on your entry heading."
    ],
    quiz: [
      { type: "mc", q: "As bank angle increases in a level turn, to hold altitude you must:", choices: ["Reduce back pressure", "Increase back pressure (and add power)", "Lower the nose", "Retract the flaps"], answer: 1, why: "Steeper banks reduce vertical lift, so more back pressure (and power) is needed to maintain altitude." },
      { type: "tf", q: "Load factor increases as bank angle increases in a level turn.", answer: true, why: "A steeper level turn requires more total lift, raising the load factor (Gs) and the stall speed." }
    ]
  },
  "man-groundref": {
    title: "Ground reference maneuvers",
    pathway: "airplane", cert: "Core Flight Maneuvers", faa: "afh",
    acs: "Maneuvers — ground reference", time: 5,
    explain: [
      "Ground reference maneuvers — the rectangular course, S-turns across a road, and turns around a point — teach you to fly a precise track over the ground while correcting for wind drift, the same skill used in the traffic pattern.",
      "The key idea is that groundspeed changes with the wind, so your bank angle must change through the turn. Steepen the bank when the wind is behind you (your highest groundspeed) and shallow it when you turn into the wind, to hold a constant radius.",
      "Pick prominent references, hold your altitude, and stay coordinated while dividing attention between the ground track and flying the airplane."
    ],
    quiz: [
      { type: "mc", q: "To hold a constant radius in a turn around a point, your bank should be steepest when the airplane is:", choices: ["Headed into the wind", "On the downwind side with the highest groundspeed", "Directly crosswind", "At its slowest groundspeed"], answer: 1, why: "Higher groundspeed (wind behind you) requires a steeper bank to hold the radius; into the wind you shallow it." },
      { type: "tf", q: "Ground reference maneuvers build the wind-correction skills used in the traffic pattern.", answer: true, why: "They train drift correction and a constant ground track — exactly what the pattern demands." }
    ]
  },
  "man-normaltl": {
    title: "Normal takeoff and landing",
    pathway: "airplane", cert: "Core Flight Maneuvers", faa: "afh",
    acs: "Maneuvers — normal takeoff & landing", time: 6,
    explain: [
      "A normal takeoff: line up, smoothly apply full power, keep straight with rudder (right rudder counters the left-turning tendencies), rotate at the recommended speed, and climb at Vy.",
      "A normal landing: fly a stabilized approach at the right speed and glidepath, reduce power in the roundout, raise the nose in the flare to bleed off speed, and touch down on the main wheels at minimum speed with the nose still up. Maintain the centerline with rudder throughout.",
      "Consistency comes from flying the numbers — pitch for airspeed, power for descent rate — and from a stabilized approach. If the approach is not stabilized, go around."
    ],
    quiz: [
      { type: "mc", q: "On landing, the airplane should ideally touch down:", choices: ["Nosewheel first", "On the main wheels at minimum controllable airspeed", "In a steep bank", "At cruise speed"], answer: 1, why: "A proper flare lands on the mains at low speed with the nose high, protecting the nosewheel and minimizing energy." },
      { type: "tf", q: "If an approach is not stabilized, the safest choice is to go around.", answer: true, why: "An unstable approach is a leading factor in landing accidents; a go-around resets the situation." }
    ]
  },

  /* ===================== Weather Services & Hazards ===================== */
  "wx-services": {
    title: "Weather briefings and sources",
    pathway: "airplane", cert: "Weather Services & Hazards", faa: "aim",
    acs: "Weather — briefings & sources", time: 6,
    explain: [
      "Before a flight, get a weather briefing — historically by phone from Flight Service at 1-800-WX-BRIEF and now mostly online through aviationweather.gov and apps. Briefings come as Standard (the full picture), Abbreviated (an update), or Outlook (for flights six or more hours away).",
      "A complete briefing covers adverse conditions, the synopsis, current and forecast weather, winds aloft, NOTAMs, and TFRs. Note who briefed you and when for your own record.",
      "Weather is a leading factor in general-aviation accidents, so a thorough briefing plus in-flight updates from FIS-B or ADS-B weather is time very well spent."
    ],
    quiz: [
      { type: "mc", q: "For a flight departing in 8 hours, the appropriate briefing type is:", choices: ["Standard", "Abbreviated", "Outlook", "None needed"], answer: 2, why: "An Outlook briefing is for departures six or more hours away; get a Standard briefing closer to flight time." },
      { type: "tf", q: "A standard weather briefing includes NOTAMs and TFRs.", answer: true, why: "Adverse conditions, the synopsis, current and forecast weather, winds aloft, NOTAMs, and TFRs are all part of a standard briefing." }
    ]
  },
  "wx-winds": {
    title: "Pressure systems and winds",
    pathway: "airplane", cert: "Weather Services & Hazards", faa: "phak",
    acs: "Weather — pressure & wind", time: 6,
    explain: [
      "Air flows from high pressure to low pressure, but the Coriolis effect turns it so that, in the Northern Hemisphere, wind circulates clockwise and outward around a high and counterclockwise and inward around a low. Highs bring sinking air and generally fair weather; lows bring rising air, clouds, and precipitation.",
      "Surface friction slows the wind and angles it across the isobars toward the low. Winds aloft, from the Winds and Temperatures Aloft Forecast, are stronger and shift direction with height.",
      "Closely spaced isobars mean a steep pressure gradient — and stronger winds."
    ],
    quiz: [
      { type: "mc", q: "In the Northern Hemisphere, air circulates around a low-pressure system:", choices: ["Clockwise and outward", "Counterclockwise and inward", "Straight across the isobars", "It does not move"], answer: 1, why: "Coriolis plus the pressure gradient produce counterclockwise, inward flow around a Northern-Hemisphere low." },
      { type: "tf", q: "Closely spaced isobars on a weather chart indicate strong winds.", answer: true, why: "Tightly packed isobars mean a steep pressure gradient, which drives stronger winds." }
    ]
  },
  "wx-fog": {
    title: "Fog and low visibility",
    pathway: "airplane", cert: "Weather Services & Hazards", faa: "phak",
    acs: "Weather — fog & visibility", time: 5,
    explain: [
      "Fog is simply a cloud at the surface, forming when air cools to its dew point or gains moisture. Radiation fog forms on clear, calm nights as the ground cools, common at dawn in valleys. Advection fog forms when warm, moist air moves over a cooler surface, common along coastlines.",
      "Upslope fog forms as air is pushed up rising terrain and cools, and steam fog rises off warm water into cold air. A small temperature/dew-point spread (within a few degrees) and light wind are warning signs that fog may form.",
      "Fog can drop visibility below VFR quickly, especially around sunrise, so always keep an out."
    ],
    quiz: [
      { type: "mc", q: "Fog that forms on clear, calm nights as the ground cools is:", choices: ["Advection fog", "Radiation fog", "Upslope fog", "Steam fog"], answer: 1, why: "Radiation (ground) fog forms from nighttime surface cooling under clear, calm conditions." },
      { type: "tf", q: "A small spread between temperature and dew point suggests fog or low clouds may form.", answer: true, why: "When temperature and dew point converge, the air is near saturation and fog or low cloud is likely." }
    ]
  },
  "wx-turb": {
    title: "Turbulence and wind shear",
    pathway: "airplane", cert: "Weather Services & Hazards", faa: "phak",
    acs: "Weather — turbulence & shear", time: 6,
    explain: [
      "Turbulence has several sources: mechanical (wind flowing over terrain or buildings), convective or thermal (rising heated air), frontal, and wake turbulence from other aircraft. Clear air turbulence occurs near the jet stream at high altitude.",
      "Wind shear is a sudden change in wind speed or direction. Low-level wind shear near thunderstorms or temperature inversions is especially dangerous on takeoff and landing, where a microburst can rob you of airspeed and lift in seconds.",
      "Slow to maneuvering speed (Va) in turbulence to protect the structure, and stay out of the area beneath and behind heavy aircraft."
    ],
    quiz: [
      { type: "mc", q: "To protect the airframe in turbulence, slow to:", choices: ["Vne", "Va (maneuvering speed)", "Vy", "Vso"], answer: 1, why: "At or below maneuvering speed, the wing stalls before a gust can exceed structural limits." },
      { type: "tf", q: "A microburst is a dangerous low-level wind shear hazard found near thunderstorms.", answer: true, why: "Microbursts create severe downdrafts and shifting winds that can cause loss of airspeed and control near the ground." }
    ]
  },
  "wx-advisories": {
    title: "AIRMETs, SIGMETs, and PIREPs",
    pathway: "airplane", cert: "Weather Services & Hazards", faa: "awc",
    acs: "Weather — advisories", time: 5,
    explain: [
      "AIRMETs warn of weather hazardous mainly to light aircraft: Sierra for IFR conditions and mountain obscuration, Tango for turbulence and strong surface winds, and Zulu for icing and freezing levels.",
      "SIGMETs cover more severe, widespread hazards such as severe turbulence and icing, dust and sandstorms, and volcanic ash. Convective SIGMETs specifically warn of thunderstorms, embedded storms, and hail.",
      "A PIREP is a pilot report — real-world weather from aircraft in flight, the freshest data there is. Giving and using PIREPs helps everyone; report what you actually encounter."
    ],
    quiz: [
      { type: "mc", q: "A Convective SIGMET specifically warns of:", choices: ["Light turbulence", "Thunderstorms and related hazards", "Routine winds aloft", "Mountain obscuration"], answer: 1, why: "Convective SIGMETs cover thunderstorms, embedded storms, severe convection, and hail." },
      { type: "mc", q: "Which AIRMET covers icing?", choices: ["Sierra", "Tango", "Zulu", "Romeo"], answer: 2, why: "AIRMET Zulu addresses icing and freezing levels; Sierra is IFR/obscuration and Tango is turbulence." }
    ]
  },

  /* ===================== Aeromedical in Depth ===================== */
  "med-vision": {
    title: "Vision and scanning for traffic",
    pathway: "airplane", cert: "Aeromedical in Depth", faa: "phak",
    acs: "Aeromedical — vision & scan", time: 5,
    explain: [
      "Your eyes are your main collision-avoidance tool. Scan the sky in small, overlapping segments of about 10 degrees, pausing to focus, because the eye sees sharply only in a narrow cone and motion is hard to detect against a still background.",
      "An aircraft on a collision course appears motionless and grows larger — a constant bearing with decreasing range. Empty-field myopia (the relaxed eye focusing a few feet ahead with nothing to look at) and a dirty windscreen both hide traffic.",
      "At night, use off-center viewing and protect your dark adaptation by avoiding bright lights before and during the flight."
    ],
    quiz: [
      { type: "mc", q: "An aircraft that stays in the same spot on your windscreen and grows larger is:", choices: ["No threat", "On a collision course", "Descending away from you", "A reflection"], answer: 1, why: "A constant relative position with increasing size means converging flight paths — take action." },
      { type: "tf", q: "An effective scan moves the eyes in small steps with brief pauses to focus.", answer: true, why: "The eye detects detail only in a small cone, so a series of short, focused fixations works best." }
    ]
  },
  "med-respir": {
    title: "Hyperventilation and carbon monoxide",
    pathway: "airplane", cert: "Aeromedical in Depth", faa: "medical",
    acs: "Aeromedical — respiration hazards", time: 5,
    explain: [
      "Hyperventilation — overbreathing from stress or fear — flushes out too much carbon dioxide and causes lightheadedness, tingling, and anxiety. Because it mimics hypoxia, treat both by getting oxygen if available and slowing the breathing rate, for example by talking aloud or breathing into cupped hands.",
      "Carbon monoxide is an odorless gas in engine exhaust that can leak through a faulty cabin heater. It binds to the blood far better than oxygen, causing headache, drowsiness, and confusion. The first smell of exhaust or a detector alarm means heater off, fresh-air vents open, and land.",
      "Both rob the brain of usable oxygen, so recognize the symptoms early and act."
    ],
    quiz: [
      { type: "mc", q: "Carbon monoxide most often enters a small airplane cabin through a faulty:", choices: ["Fuel pump", "Cabin heater (exhaust leak)", "Radio", "Landing gear"], answer: 1, why: "Cabin heat is drawn around the exhaust system; a crack can leak carbon monoxide into the cabin." },
      { type: "tf", q: "Hyperventilation can produce symptoms similar to hypoxia.", answer: true, why: "Both reduce effective brain oxygenation and cause dizziness and tingling; in flight, treat for hypoxia first." }
    ]
  },
  "med-ears": {
    title: "Ear and sinus block, scuba and altitude",
    pathway: "airplane", cert: "Aeromedical in Depth", faa: "medical",
    acs: "Aeromedical — pressure effects", time: 5,
    explain: [
      "Climbing and descending changes the air pressure in your ears and sinuses. On descent the outside pressure rises faster, and a cold or congestion can trap air, causing painful ear or sinus block. Swallowing, yawning, or the gentle Valsalva maneuver helps equalize.",
      "Flying with a bad head cold is a poor idea — blocked sinuses can be intensely painful and distracting.",
      "After scuba diving, wait before flying: at least 12 hours after a non-decompression dive, or 24 hours if you flew above about 8,000 ft cabin altitude or made decompression dives, so dissolved nitrogen can off-gas and you avoid decompression sickness."
    ],
    quiz: [
      { type: "mc", q: "After a non-decompression scuba dive, you should wait at least ____ before flying to altitudes up to 8,000 ft.", choices: ["1 hour", "4 hours", "12 hours", "No wait is needed"], answer: 2, why: "Waiting 12 hours (24 if higher cabin altitude or decompression dives) lets excess nitrogen off-gas, preventing the bends." },
      { type: "tf", q: "A head cold can cause painful ear or sinus block during descent.", answer: true, why: "Congestion blocks the passages that equalize pressure, trapping air and causing pain on descent." }
    ]
  },
  "med-spatial": {
    title: "Spatial disorientation",
    pathway: "airplane", cert: "Aeromedical in Depth", faa: "phak",
    acs: "Aeromedical — spatial disorientation", time: 6,
    explain: [
      "Without a clear visual horizon — in cloud, haze, or a dark night — your inner ear can lie. The vestibular system can make a slow roll feel level (the leans), make recovery from a turn feel like a turn the other way (Coriolis), or set up a graveyard spiral where you tighten a descending turn believing you are straight and level.",
      "A somatogravic illusion makes acceleration feel like a nose-up pitch, tempting you to push over, and deceleration feel like a descent. The cure is to trust the instruments, not your body.",
      "VFR pilots who blunder into instrument conditions and rely on feel have very little time before losing control, so the real defense is staying out of the clouds."
    ],
    quiz: [
      { type: "mc", q: "The best defense against spatial disorientation in instrument conditions is to:", choices: ["Trust your inner ear", "Trust and fly the flight instruments", "Close your eyes briefly", "Make rapid head movements"], answer: 1, why: "The vestibular system gives false cues without a horizon; the instruments are the truth." },
      { type: "tf", q: "A slow, unnoticed bank that then makes level flight feel like a turn is called 'the leans.'", answer: true, why: "The leans is a common vestibular illusion where a gradual roll goes unfelt and wings-level then feels like a bank." }
    ]
  },
  "med-o2": {
    title: "Supplemental oxygen and hypoxia",
    pathway: "airplane", cert: "Aeromedical in Depth", faa: "cfr91",
    acs: "Aeromedical — oxygen & hypoxia", time: 6,
    explain: [
      "Under Part 91, the required flight crew must use supplemental oxygen for any time over 30 minutes above 12,500 ft MSL cabin altitude, and continuously above 14,000 ft. Above 15,000 ft, oxygen must be made available to every occupant. Good practice, and better night vision, argue for using oxygen even lower.",
      "Hypoxia — too little oxygen reaching the body — comes in types: hypoxic (high altitude, less available oxygen), hypemic (the blood cannot carry it, as in carbon monoxide poisoning or anemia), stagnant (poor circulation, as under high G), and histotoxic (the cells cannot use it, as with alcohol). Insidious symptoms include euphoria, poor judgment, and a bluish tinge.",
      "Because hypoxia degrades judgment first, descend or use oxygen at the very first hint of it."
    ],
    quiz: [
      { type: "mc", q: "Above 14,000 ft MSL cabin altitude, the required flight crew must use supplemental oxygen:", choices: ["Never", "For 30 minutes only", "Continuously", "Only at night"], answer: 2, why: "Part 91 requires the crew to use oxygen continuously above 14,000 ft (and after 30 minutes above 12,500 ft)." },
      { type: "mc", q: "Carbon monoxide poisoning is which type of hypoxia?", choices: ["Hypoxic", "Hypemic", "Stagnant", "Histotoxic"], answer: 1, why: "Carbon monoxide prevents the blood from carrying oxygen — a hypemic (blood-related) hypoxia." }
    ]
  },

  /* ===================== Aeronautical Decision-Making ===================== */
  "adm-decide": {
    title: "The DECIDE model and the 3-P process",
    pathway: "airplane", cert: "Aeronautical Decision-Making", faa: "phak",
    acs: "ADM — decision models", time: 5,
    explain: [
      "Good aeronautical decision-making is a learnable, structured process, not a personality trait. The DECIDE model is Detect a change, Estimate the need to react, Choose a desirable outcome, Identify actions, Do the action, and Evaluate the result — then loop again.",
      "The FAA's 3-P process is a simpler in-flight loop: Perceive the hazards using PAVE (Pilot, Aircraft, enVironment, External pressures), Process their impact, and Perform by mitigating the risk.",
      "The point is not memorizing acronyms but building the habit of continuously spotting hazards and acting before they stack up into an accident chain."
    ],
    quiz: [
      { type: "mc", q: "In the 3-P process, the PAVE checklist is used to:", choices: ["Perform a landing", "Perceive the hazards", "Program the GPS", "Preflight the engine"], answer: 1, why: "PAVE (Pilot, Aircraft, enVironment, External pressures) helps you perceive the risks present." },
      { type: "tf", q: "The DECIDE model ends by evaluating the outcome of your action.", answer: true, why: "The final E in DECIDE is Evaluate — then you repeat the loop as conditions change." }
    ]
  },
  "adm-srm": {
    title: "Single-pilot and crew resource management",
    pathway: "airplane", cert: "Aeronautical Decision-Making", faa: "phak",
    acs: "ADM — resource management", time: 5,
    explain: [
      "Resource management means using everything available to fly safely: the autopilot, ATC, checklists, charts, passengers, and your own training. Crew Resource Management and its solo cousin Single-Pilot Resource Management turn these into a system.",
      "Maintain situational awareness — knowing where you are, what the airplane is doing, and what is coming next — manage workload by planning ahead, and do not fixate on one problem while the airplane flies into trouble.",
      "Use your resources before you are saturated: ask ATC for help, delegate to a capable passenger, and lean on automation when it lowers your workload."
    ],
    quiz: [
      { type: "mc", q: "Single-Pilot Resource Management is about:", choices: ["Flying without any instruments", "Using all available resources (ATC, automation, checklists) to manage workload", "Always hand-flying the airplane", "Avoiding ATC"], answer: 1, why: "SRM coordinates every resource — automation, ATC, checklists, people — to keep the single pilot ahead of the airplane." },
      { type: "tf", q: "Fixating on a minor problem while neglecting to fly the airplane is a resource-management failure.", answer: true, why: "Losing situational awareness through fixation (task saturation) is a classic SRM and CRM breakdown." }
    ]
  },
  "adm-auto": {
    title: "Automation and task priority",
    pathway: "airplane", cert: "Aeronautical Decision-Making", faa: "phak",
    acs: "ADM — automation management", time: 5,
    explain: [
      "Automation such as the autopilot, GPS, and glass cockpit reduces workload but adds the new task of managing the automation. Know how to turn it on, what it is doing, and how to turn it off and hand-fly when it does something unexpected.",
      "Whatever happens, prioritize Aviate, Navigate, Communicate. First keep the airplane under control, then make sure you are going the right way, then talk on the radio. Many accidents trace to pilots troubleshooting a gadget while the airplane quietly descended or wandered off course.",
      "Do not let automation complacency replace your scan and your judgment — you are still the pilot in command."
    ],
    quiz: [
      { type: "mc", q: "The correct priority order when you are busy in the cockpit is:", choices: ["Communicate, Navigate, Aviate", "Aviate, Navigate, Communicate", "Navigate, Aviate, Communicate", "Communicate, Aviate, Navigate"], answer: 1, why: "Fly the airplane first, then navigate, then communicate — always in that order." },
      { type: "tf", q: "When the autopilot does something unexpected, a safe response is to disconnect it and hand-fly.", answer: true, why: "Reverting to manual control removes the source of confusion and keeps you in command." }
    ]
  },
  "adm-fatigue": {
    title: "Fatigue, stress, and IMSAFE",
    pathway: "airplane", cert: "Aeronautical Decision-Making", faa: "phak",
    acs: "ADM — fitness & IMSAFE", time: 5,
    explain: [
      "Before every flight, run IMSAFE on yourself: Illness, Medication, Stress, Alcohol, Fatigue, and Eating or Emotion. Any one of these can make you unfit to fly even when the airplane and weather are perfect.",
      "Fatigue dulls judgment and reaction time much like alcohol, and get-there-itis plus external pressures from work, family, or money push tired pilots into bad decisions. The regulation sets 8 hours from bottle to throttle and a blood-alcohol level below 0.04 percent, but the safe personal limit is higher.",
      "Sometimes the hardest and most important decision a pilot makes is not to go. A canceled flight is always recoverable."
    ],
    quiz: [
      { type: "mc", q: "IMSAFE is a checklist used to evaluate:", choices: ["The airplane", "The weather", "The pilot's fitness to fly", "The airport"], answer: 2, why: "IMSAFE (Illness, Medication, Stress, Alcohol, Fatigue, Eating/Emotion) is a personal pre-flight self-assessment." },
      { type: "mc", q: "The regulatory minimum time from drinking alcohol to flying ('bottle to throttle') is:", choices: ["4 hours", "8 hours", "12 hours", "24 hours"], answer: 1, why: "14 CFR 91.17 requires at least 8 hours bottle-to-throttle and a blood-alcohol level below 0.04 percent — though waiting longer is wiser." }
    ]
  }

});
