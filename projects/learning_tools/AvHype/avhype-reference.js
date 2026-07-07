/* Study reference (glossary, weather, navigation, airport ops, signs & markings, flashcards)
   Part of AvHype Aviation Education. This file is loaded by the page at startup
   and MUST sit in the same folder as the .html file when deployed.
   Safe to edit this section's content directly. */
window.__AV_AIRPORT_OPS__ = [
  /* ---- Runway & taxiway ---- */
  { id: "runway-numbers", group: "Runway & taxiway", glyph: "runway", source: "cug",
    summary: "How runways get their numbers.",
    body: [
      "A runway's number is its magnetic alignment rounded to the nearest ten degrees, with the last digit dropped. A runway pointing about 268 degrees magnetic is Runway 27; the same strip flown the other way points about 088 degrees and is Runway 9. The two ends therefore always differ by 18.",
      "When an airport has parallel runways, a letter is added to tell them apart: L for left, C for center, and R for right, as in 27L and 27R."
    ],
    key: [["Basis", "Magnetic heading, rounded"], ["Last digit", "Dropped"], ["Example", "268° → 27"], ["Opposite end", "Differs by 18"], ["Parallels", "L / C / R"]] },
  { id: "runway-markings", group: "Runway & taxiway", glyph: "runway", source: "aim",
    summary: "Threshold, aiming point, and special areas.",
    body: [
      "Runway markings are white. The threshold marks the start of the landing area, the aiming point is two broad stripes roughly a thousand feet down the runway, and touchdown-zone stripes and a centerline help with alignment.",
      "A displaced threshold, shown by arrows leading to a solid bar, moves the landing area down the runway: the paved area before it can be used for taxi, takeoff, and rollout, but not for landing touchdown. Chevrons mark a blast pad or overrun and are not usable for taxi, takeoff, or landing at all."
    ],
    key: [["Color", "White"], ["Aiming point", "~1,000 ft stripes"], ["Displaced threshold", "No landing before the bar"], ["Chevrons", "Not usable"]] },
  { id: "taxiway-markings", group: "Runway & taxiway", glyph: "runway", source: "aim",
    summary: "Yellow lines and what they permit.",
    body: [
      "Taxiways are marked in yellow. A continuous centerline guides you along the taxiway, and edge markings tell you where the usable pavement ends: a solid double line means do not cross onto that surface, while a dashed line means crossing is permitted.",
      "Where a taxiway meets a runway, a runway holding position marking of two solid and two dashed yellow lines is painted across it. You hold on the side of the solid lines."
    ],
    key: [["Color", "Yellow"], ["Solid double edge", "Do not cross"], ["Dashed edge", "May cross"], ["Hold marking", "2 solid + 2 dashed"]] },
  { id: "hold-position", group: "Runway & taxiway", glyph: "sign", source: "aim",
    summary: "The line you never cross uncleared.",
    body: [
      "The runway holding position marking is where you stop before entering a runway. The two solid lines are on the side where you hold; the two dashed lines face the runway side. Crossing it puts you onto an active runway.",
      "At a towered airport you may only cross with an ATC clearance. At a non-towered airport, you self-announce and visually confirm the runway and approaches are clear before crossing or taking the runway."
    ],
    key: [["Hold side", "Solid lines"], ["Runway side", "Dashed lines"], ["Towered", "Cross only when cleared"], ["Non-towered", "Self-announce and clear"]] },

  /* ---- Signs ---- */
  { id: "mandatory-signs", group: "Signs", glyph: "sign", source: "aim",
    summary: "Red signs you must obey.",
    body: [
      "Mandatory instruction signs have a red background with white text. They mark places you may not pass without authorization, such as a runway holding position (for example 15-33), the entrance to an ILS critical area, or a NO ENTRY point.",
      "Treat a red sign as a stop: do not go past it onto a runway or restricted area without the proper clearance or, at a non-towered field, without confirming it is safe and self-announcing."
    ],
    key: [["Look", "Red background, white text"], ["Means", "Do not pass uncleared"], ["Examples", "Runway hold, ILS, NO ENTRY"]] },
  { id: "location-signs", group: "Signs", glyph: "sign", source: "aim",
    summary: "Where you are right now.",
    body: [
      "Location signs have a black background with yellow text and a yellow border. They tell you the taxiway or runway you are currently on, which helps you keep oriented on a complex airport surface.",
      "Reading location signs as you taxi, together with the airport diagram, is a core defense against getting lost or wandering toward a runway."
    ],
    key: [["Look", "Black background, yellow text"], ["Means", "Your current taxiway/runway"], ["Use with", "Airport diagram"]] },
  { id: "direction-dest-signs", group: "Signs", glyph: "sign", source: "aim",
    summary: "Which way to turn.",
    body: [
      "Direction and destination signs have a yellow background with black text and arrows. Direction signs identify the taxiways at an intersection and the way to reach them; destination signs point toward a destination such as a runway, terminal, or general aviation area.",
      "Following these signs in sequence is how you navigate a taxi route from where you are to where you are going."
    ],
    key: [["Look", "Yellow background, black text"], ["Direction sign", "Intersecting taxiways"], ["Destination sign", "Points to runways/terminals"]] },
  { id: "distance-signs", group: "Signs", glyph: "sign", source: "aim",
    summary: "Runway distance remaining.",
    body: [
      "Runway distance remaining signs have a black background with a white number. The number is the thousands of feet of runway remaining, so a 3 means about three thousand feet left.",
      "These signs help you judge takeoff and landing performance against the runway you actually have ahead of you."
    ],
    key: [["Look", "Black background, white number"], ["Number", "Thousands of feet remaining"]] },

  /* ---- Lighting ---- */
  { id: "runway-lights", group: "Lighting", glyph: "light", source: "aim",
    summary: "Edge, threshold, and end lights.",
    body: [
      "Runway edge lights are white. On an instrument runway, the last portion changes to amber when seen from the takeoff direction, marking a caution zone near the end. The threshold is lit green as you approach it, and the far end shows red as runway-end lights.",
      "Together these colors let you see the runway's outline, its beginning, and its end at night or in low visibility."
    ],
    key: [["Edge", "White (amber caution zone)"], ["Threshold", "Green on approach"], ["Runway end", "Red"]] },
  { id: "taxiway-lights", group: "Lighting", glyph: "light", source: "aim",
    summary: "Blue edges, green centerlines.",
    body: [
      "Taxiway edge lights are blue and outline the edges of the taxiway. Where taxiway centerline lights are installed, they are green and guide you along the center of the taxi route.",
      "Blue and green at night tells you that you are on taxiways, not on a runway."
    ],
    key: [["Edge lights", "Blue"], ["Centerline lights", "Green"]] },
  { id: "vasi-papi", group: "Lighting", glyph: "light", source: "aim",
    summary: "Visual glidepath: are you high or low?",
    body: [
      "A VASI uses two bars of lights: red over white means you are on the glidepath, white over white means you are too high, and red over red means you are too low. A common reminder is 'red over white, you're all right.'",
      "A PAPI is a single row of four lights. Two white and two red means on the glidepath; three or four white means too high; three or four red means too low."
    ],
    key: [["VASI on path", "Red over white"], ["VASI high", "White over white"], ["VASI low", "Red over red"], ["PAPI on path", "Two white, two red"]] },
  { id: "beacon", group: "Lighting", glyph: "light", source: "aim",
    summary: "The rotating airport beacon.",
    body: [
      "A rotating beacon identifies an airport at night. Alternating white and green flashes mark a lighted civil land airport; alternating white and yellow marks a water airport.",
      "At an airport with a control tower, a beacon operating during daylight can be a hint that the field's ceiling is below 1,000 feet or visibility is below 3 statute miles, though you should always confirm the actual weather."
    ],
    key: [["White + green", "Lighted land airport"], ["White + yellow", "Water airport"], ["On by day (towered)", "Possible weather below VFR"]] },
  { id: "pcl", group: "Lighting", glyph: "light", source: "aim",
    summary: "Turning the lights on yourself.",
    body: [
      "Many non-towered airports have pilot-controlled lighting. You key the microphone on the airport's common traffic advisory frequency a set number of times within a few seconds to turn the runway lights on and set their intensity.",
      "A common scheme is seven clicks for the highest intensity, with fewer clicks for lower settings. Always check the chart supplement for the specific frequency and procedure."
    ],
    key: [["Where", "Many non-towered fields"], ["How", "Key the mic on the CTAF"], ["Common", "7 clicks = high intensity"]] },

  /* ---- Traffic pattern ---- */
  { id: "pattern-legs", group: "Traffic pattern", glyph: "pattern", source: "aim",
    summary: "The rectangular circuit around a runway.",
    body: [
      "The traffic pattern is a standardized rectangular path flown around the runway. Its legs are the departure and upwind, the crosswind, the downwind flown parallel to the runway opposite the landing direction, the base, and the final approach.",
      "Unless an airport specifies otherwise, all turns in the pattern are to the left."
    ],
    key: [["Legs", "Upwind, crosswind, downwind, base, final"], ["Standard turns", "Left"], ["Downwind", "Parallel, opposite landing direction"]] },
  { id: "pattern-altitude", group: "Traffic pattern", glyph: "pattern", source: "aim",
    summary: "How high, and how to join.",
    body: [
      "Traffic pattern altitude is commonly about 1,000 feet above the airport elevation, though it varies by airport and aircraft type, so confirm it in the chart supplement. Larger and faster aircraft often fly a higher pattern.",
      "The recommended way to join is to enter on the downwind leg at a 45-degree angle toward its midpoint, at pattern altitude, which makes you predictable to other traffic."
    ],
    key: [["Typical altitude", "~1,000 ft AGL"], ["Verify", "Chart supplement"], ["Standard entry", "45° to midfield downwind"]] },
  { id: "right-traffic", group: "Traffic pattern", glyph: "pattern", source: "aim",
    summary: "Left is standard; right where marked.",
    body: [
      "Left traffic is the default. Some runways use right traffic instead, usually because of terrain, noise, or nearby airspace. Right-traffic runways are noted on the sectional chart and indicated at the airport.",
      "Before flying a pattern, check whether the runway uses right traffic so you turn the correct way and stay with the flow."
    ],
    key: [["Default", "Left traffic"], ["Right traffic", "Where designated"], ["Shown on", "Sectional, segmented circle"]] },

  /* ---- Communications ---- */
  { id: "towered-nontowered", group: "Communications", glyph: "radio", source: "aim",
    summary: "Tower vs. self-announce.",
    body: [
      "At a towered airport, you must establish two-way radio communication with the control tower and follow its instructions to operate in its airspace and on its runways. The tower sequences and separates traffic.",
      "At a non-towered airport there is no controller. Pilots coordinate themselves by announcing their positions and intentions on a shared frequency and by watching for each other."
    ],
    key: [["Towered", "Two-way radio with ATC required"], ["Non-towered", "Self-announce, see and avoid"]] },
  { id: "ctaf-unicom", group: "Communications", glyph: "radio", source: "aim",
    summary: "CTAF, UNICOM, and MULTICOM.",
    body: [
      "The common traffic advisory frequency, or CTAF, is the frequency pilots use to self-announce at a non-towered airport. UNICOM is a non-government air-to-ground radio station found at some fields that can provide advisories and services; its frequency often doubles as the CTAF.",
      "Where no tower or UNICOM is published, MULTICOM frequency 122.9 is used for self-announcing. Always confirm the correct frequency in the chart supplement."
    ],
    key: [["CTAF", "Self-announce frequency"], ["UNICOM", "Non-ATC air/ground station"], ["MULTICOM", "122.9 where none published"]] },
  { id: "atc-frequencies", group: "Communications", glyph: "tower", source: "aim",
    summary: "Who handles what on the radio.",
    body: [
      "At busier airports the workload is split across positions. Clearance delivery issues your initial clearance, ground control handles taxiing on the movement area, the tower controls the runways and the immediate airport airspace, and approach or departure control handles arriving and departing traffic farther out.",
      "Knowing which position to call, and in what order, keeps your radio work smooth from gate to climb-out."
    ],
    key: [["Clearance", "Initial clearance"], ["Ground", "Taxiing"], ["Tower", "Runways"], ["Approach/Departure", "Arrivals and departures"]] },
  { id: "phraseology", group: "Communications", glyph: "radio", source: "aim",
    summary: "A simple structure for radio calls.",
    body: [
      "A clear radio call answers four things: who you are calling, who you are, where you are, and what you want or intend. For example, the facility name, your call sign, your position, and your request.",
      "Read back the instructions that matter for safety, especially anything involving holding short of or entering a runway, so the controller can confirm you understood."
    ],
    key: [["Say", "Who you call, who you are"], ["Then", "Where you are, what you want"], ["Read back", "Runway and hold-short instructions"]] },
  { id: "light-signals", group: "Communications", glyph: "light", source: "aim",
    summary: "ATC light gun signals for radio-out.",
    body: [
      "If your radio fails, a tower can direct you with a light gun. On the ground, a steady green means cleared for takeoff, a flashing green means cleared to taxi, a steady red means stop, a flashing red means taxi clear of the runway in use, and a flashing white means return to your starting point.",
      "In flight, a steady green means cleared to land, a flashing green means return for landing, a steady red means give way and keep circling, and a flashing red means the airport is unsafe, do not land. In either case, alternating red and green means general warning, use extreme caution."
    ],
    key: [["Steady green", "Ground: takeoff · Air: land"], ["Flashing green", "Ground: taxi · Air: return to land"], ["Steady red", "Ground: stop · Air: give way"], ["Flashing red", "Ground: clear runway · Air: do not land"], ["Alternating R/G", "General warning"]] },

  /* ---- Airspace ---- */
  { id: "airspace-overview", group: "Airspace", glyph: "airspace", source: "aim",
    summary: "Controlled vs. uncontrolled.",
    body: [
      "US airspace is divided into classes. Classes A, B, C, D, and E are controlled airspace, where air traffic control provides at least some service; Class G is uncontrolled. Each class has its own entry, equipment, and pilot requirements.",
      "Visual flight rules also set minimum visibility and distance-from-cloud requirements that differ by class and altitude. Because the details matter, always confirm the current VFR minimums and equipment rules in the regulations and the AIM."
    ],
    key: [["Controlled", "Classes A, B, C, D, E"], ["Uncontrolled", "Class G"], ["VFR minimums", "Vary by class — verify"]] },
  { id: "class-bcd", group: "Airspace", glyph: "airspace", source: "aim",
    summary: "Airspace around airports: B, C, D.",
    body: [
      "Class B surrounds the busiest airports and is shaped like an upside-down wedding cake; you need an ATC clearance to enter it, plus the required transponder and equipment. Class C surrounds moderately busy airports with a tower and radar; you must establish two-way radio communication and have the required transponder before entering.",
      "Class D surrounds airports with an operating control tower; you must establish two-way radio communication before entering. The exact dimensions of each are shown on charts."
    ],
    key: [["Class B", "Clearance required to enter"], ["Class C", "Radio + radar, transponder"], ["Class D", "Two-way radio before entry"]] },
  { id: "class-aeg", group: "Airspace", glyph: "airspace", source: "aim",
    summary: "The rest: A, E, and G.",
    body: [
      "Class A is the high-altitude airspace from 18,000 feet up to flight level 600; all flight there is under instrument flight rules and requires a clearance. Class E is controlled airspace that is not A, B, C, or D, and it supports instrument operations with various floors.",
      "Class G is uncontrolled airspace where ATC has no authority, although pilots still must follow the visual flight rules that apply there."
    ],
    key: [["Class A", "18,000 ft+; IFR only"], ["Class E", "Controlled, not A/B/C/D"], ["Class G", "Uncontrolled"]] },

  /* ---- Runway safety ---- */
  { id: "incursions-hotspots", group: "Runway safety", glyph: "safety", source: "aim",
    summary: "Incursions and marked hot spots.",
    body: [
      "A runway incursion is any incorrect presence of an aircraft, vehicle, or person on the protected area of a runway. Most stem from confusion while taxiing, which is why holding-position markings and clearances matter so much.",
      "Hot spots are specific locations on an airport with a history or heightened risk of incursions, such as confusing intersections. They are marked on airport diagrams so you can give them extra attention."
    ],
    key: [["Incursion", "Unauthorized presence on a runway"], ["Common cause", "Taxi confusion"], ["Hot spots", "Risk areas on the diagram"]] },
  { id: "lahso", group: "Runway safety", glyph: "safety", source: "aim",
    summary: "Land and hold short operations.",
    body: [
      "In land and hold short operations, ATC may clear you to land and hold short of an intersecting runway, taxiway, or other point. You must be able to stop within the available landing distance, and you should know that distance before accepting.",
      "As pilot in command, you may decline a LAHSO clearance if you are not comfortable or the distance is marginal. Safety comes before accommodating traffic flow."
    ],
    key: [["LAHSO", "Land and hold short of a point"], ["Need", "Adequate landing distance"], ["Pilot may", "Decline the clearance"]] },
  { id: "luaw-taxi", group: "Runway safety", glyph: "runway", source: "aim",
    summary: "Line up and wait, and taxi discipline.",
    body: [
      "Line up and wait is an ATC instruction to taxi onto the departure runway and hold in position for a takeoff clearance. You are on the runway but not yet cleared to go, so you stay alert for the clearance and for any conflict.",
      "Good taxi discipline ties the whole airport surface together: brief and follow the airport diagram, keep a sterile cockpit while taxiing, and ask for progressive taxi instructions if you are ever unsure of your route."
    ],
    key: [["Line up and wait", "On the runway, await takeoff clearance"], ["Sterile cockpit", "No distractions while taxiing"], ["Unsure?", "Request progressive taxi"]] },

  /* ---- Wind & weather ---- */
  { id: "wind-indicators", group: "Wind & weather", glyph: "wind", source: "aim",
    summary: "Reading the wind on the field.",
    body: [
      "Wind direction indicators such as a windsock, wind tee, or tetrahedron show which way the wind is blowing. As a rule, aircraft take off and land into the wind, so the indicator tells you which runway is favored.",
      "A segmented circle around the wind indicator provides traffic pattern information, and pattern indicators on it show whether a runway uses left or right traffic."
    ],
    key: [["Windsock/tee/tetrahedron", "Show wind direction"], ["Rule", "Take off and land into wind"], ["Segmented circle", "Shows pattern direction"]] },
  { id: "atis-asos-awos", group: "Wind & weather", glyph: "radio", source: "aim",
    summary: "Getting the current airport weather.",
    body: [
      "ATIS (Automatic Terminal Information Service) is a continuous recorded broadcast of weather and essential airport information at busier airports. You listen to it before contacting ground or approach, then tell the controller you have the current information.",
      "ASOS (Automated Surface Observing System) and AWOS (Automated Weather Observing System) are automated weather stations at many airports that broadcast current conditions such as wind, visibility, ceiling, and altimeter setting over a published frequency."
    ],
    key: [["ATIS", "Recorded airport/weather info"], ["Get it", "Before calling ATC"], ["ASOS/AWOS", "Automated weather broadcasts"]] },
  /* ---- Taxi & ground movement ---- */
  { id: "taxi-clearance", group: "Taxi & ground movement", glyph: "tower", source: "aim",
    summary: "Getting and reading back a taxi clearance.",
    body: [
      "At a towered airport you must receive a clearance from ground control before taxiing on the movement area. A typical instruction names a route and any runways to hold short of, for example 'taxi to runway 27 via Alpha, hold short of runway 33.' You must read back all hold-short instructions and any runway-crossing clearances, along with your call sign.",
      "If you are unfamiliar with the airport or the route is complex, ask for 'progressive taxi' and the controller will give turn-by-turn directions. Writing the clearance down and tracing it on the airport diagram before you move is a simple, powerful defense against a wrong turn."
    ],
    key: [["Need a clearance?", "Yes, on the movement area"], ["Always read back", "Hold-short & crossing"], ["Unsure of route", "Request progressive taxi"], ["Before moving", "Write it, trace it"]] },
  { id: "taxi-technique", group: "Taxi & ground movement", glyph: "runway", source: "phak",
    summary: "Speed, steering, and scanning while taxiing.",
    body: [
      "Taxi at a speed that lets you stop safely - no faster than a brisk walk in congested areas, ramps, or turns, and a bit faster only on open taxiways. Steer with the rudder pedals (and nosewheel or differential braking), keeping the nosewheel tracking the yellow centerline. Test the brakes as soon as the aircraft begins to move.",
      "Keep your eyes outside, scanning for other aircraft, vehicles, signs, and markings rather than heads-down on a tablet. Slow down before you reach an intersection or a hold line, not after."
    ],
    key: [["Speed", "Stop-able; walk pace when tight"], ["Steering", "Rudder pedals / nosewheel"], ["First check", "Brakes, right away"], ["Eyes", "Outside, scanning"]] },
  { id: "wind-taxi-controls", group: "Taxi & ground movement", glyph: "runway", source: "afh",
    summary: "Positioning the flight controls for wind on the ground.",
    body: [
      "Wind can lift a wing or the tail during taxi, so position the controls to hold the airplane down. The memory aid is 'climb into the wind, dive away from it.' With a quartering headwind, turn the aileron up on the windward side (yoke toward the wind) and keep the elevator neutral. With a quartering tailwind, turn the aileron down on the windward side (yoke away from the wind) and hold the elevator down (yoke forward).",
      "The stronger the wind, the more it matters - and it matters most in tailwheel airplanes and high-wing trainers."
    ],
    key: [["Memory aid", "Climb into / dive away"], ["Quartering headwind", "Aileron into the wind"], ["Quartering tailwind", "Aileron away, elevator down"], ["Matters most", "Strong wind, tailwheel"]] },
  { id: "movement-area", group: "Taxi & ground movement", glyph: "sign", source: "aim",
    summary: "Movement vs. non-movement areas.",
    body: [
      "Taxiways and runways make up the 'movement area,' which is controlled by ATC at a towered field - you need a clearance to be there. Ramps and aprons are the 'non-movement area,' where you maneuver under your own responsibility without a clearance (though you still use caution and may need to talk to a ramp controller at some airports).",
      "The boundary between them is painted as two yellow lines: solid on the non-movement side, dashed on the movement side. Crossing from the solid side onto a taxiway puts you into ATC's territory."
    ],
    key: [["Movement area", "Taxiways & runways"], ["Non-movement", "Ramp / apron"], ["Boundary marking", "Solid + dashed yellow"], ["Solid side", "Non-movement"]] },
  { id: "airport-diagram", group: "Taxi & ground movement", glyph: "pin", source: "aim",
    summary: "Use the diagram and watch the hot spots.",
    body: [
      "Have the airport diagram out and oriented before you taxi, and keep track of where you are on it the whole time. Brief the expected route, note which runways you will cross, and identify the hold-short points.",
      "Hot spots, labeled 'HS' on the diagram, mark intersections with a history of confusion or runway incursions - complex geometry, easy-to-miss hold lines, or spots where pilots commonly get lost. Treat them with extra attention and slow down."
    ],
    key: [["Before taxi", "Diagram out & oriented"], ["Track", "Your position continuously"], ["Hot spot", "Labeled 'HS'"], ["At a hot spot", "Slow down, extra care"]] },
  { id: "crossing-runways", group: "Taxi & ground movement", glyph: "safety", source: "aim",
    summary: "Never cross a runway without a clearance.",
    body: [
      "You may not cross any runway, or its red holding-position sign and painted hold lines, without a specific clearance to do so - even a runway that is not in use. A clearance to taxi to a destination does not authorize you to cross runways along the way; the controller must issue a separate 'cross runway XX' for each one.",
      "When in doubt, hold short and ask. Read back every crossing clearance with the runway number."
    ],
    key: [["Cross a runway", "Only with a clearance"], ["Per runway", "A separate crossing clearance"], ["Taxi clearance", "Does NOT authorize crossings"], ["Read back", "'Cross runway XX'"]] },
  { id: "lost-on-airport", group: "Taxi & ground movement", glyph: "safety", source: "aim",
    summary: "What to do if you lose track of where you are.",
    body: [
      "If you become unsure of your position while taxiing, stop, hold where you are, and ask for help - at a towered field tell ground control you are unsure of your position and request progressive taxi; at a non-towered field stop clear of any runway and re-orient using the signs and the diagram.",
      "Stopping is always safer than guessing and rolling onto an active runway. Use location signs (black with a yellow letter) to confirm which taxiway you are on."
    ],
    key: [["First action", "Stop and hold"], ["Towered", "Tell ATC, ask progressive"], ["Re-orient with", "Signs + diagram"], ["Never", "Guess onto a runway"]] },

  /* ---- On the ramp & apron ---- */
  { id: "ramp-safety", group: "On the ramp", glyph: "safety", source: "phak",
    summary: "Wingtip clearance, blast, and fuel safety.",
    body: [
      "The ramp is busy and tight. Keep generous wingtip and tail clearance from other aircraft, buildings, vehicles, and people - when in doubt, shut down and have someone wing-walk. Be aware of your own propeller or jet blast and of blast from aircraft around you.",
      "During fueling, follow the FBO's procedures: bond/ground the aircraft, keep ignition sources and electronics away, have a fire extinguisher available, and verify the fuel grade and quantity."
    ],
    key: [["Clearance", "Wingtips, tail, people"], ["Unsure", "Shut down, wing-walk"], ["Watch for", "Prop & jet blast"], ["Fueling", "Bond, no ignition sources"]] },
  { id: "marshalling", group: "On the ramp", glyph: "tower", source: "aim",
    summary: "Standard marshalling hand signals.",
    body: [
      "A marshaller (lineperson) uses standardized arm and wand signals to guide you on the ramp. Common ones: arms raised and waving you forward means 'come ahead'; an arm pointing to a wingtip with the other beckoning means 'turn' toward the steady arm; arms crossed overhead means 'stop'; and a finger drawn across the throat means 'shut down.'",
      "Always follow the marshaller's directions, but you remain responsible for the safety of the aircraft - if a signal would lead you into something, stop."
    ],
    key: [["Come ahead", "Arms beckoning forward"], ["Turn", "Toward the steady arm"], ["Stop", "Arms crossed overhead"], ["Shut down", "Finger across throat"]] },

  /* ---- Runway safety (added) ---- */
  { id: "runway-incursion", group: "Runway safety", glyph: "safety", source: "aim",
    summary: "Avoiding runway incursions.",
    body: [
      "A runway incursion is any unauthorized aircraft, vehicle, or person on a runway surface - one of the FAA's top safety priorities. The defenses are situational awareness and discipline: keep the airport diagram out, know where you are, read back all hold-short and crossing clearances, and beware 'expectation bias' (hearing the clearance you expected rather than the one given).",
      "Treat the flight deck as sterile while taxiing - finish checklists and programming when stopped, not while moving - and if anything is unclear, stop and ask. A short delay is always better than an incursion."
    ],
    key: [["Definition", "Unauthorized on a runway"], ["Top defense", "Awareness + read-backs"], ["Beware", "Expectation bias"], ["While moving", "Sterile flight deck"]] },
  { id: "lahso", group: "Runway safety", glyph: "runway", source: "aim",
    summary: "Land and hold short operations (LAHSO).",
    body: [
      "ATC may clear you to land and hold short of an intersecting runway, taxiway, or other point - this is LAHSO. The clearance includes the Available Landing Distance (ALD) so you can decide whether you can safely stop in it.",
      "You are not required to accept a LAHSO clearance; if you cannot comply or simply prefer not to, decline it. Student pilots should not accept LAHSO. If you accept, you must stop before the hold-short point."
    ],
    key: [["LAHSO", "Land and hold short"], ["You get", "Available Landing Distance"], ["May decline?", "Yes, anytime"], ["Students", "Should not accept"]] },

  /* ---- Communications (added) ---- */
  { id: "nontowered-comms", group: "Communications", glyph: "tower", source: "aim",
    summary: "Self-announcing at a non-towered airport.",
    body: [
      "A non-towered airport has no controller, so pilots coordinate themselves on the Common Traffic Advisory Frequency (CTAF). You monitor and announce your position and intentions - common calls are about ten miles out, entering the downwind, turning base, turning final, and clear of the runway, each beginning and ending with the airport name.",
      "These are advisories, not clearances: you 'see and avoid' and work out sequencing with other traffic by listening and communicating."
    ],
    key: [["Frequency", "CTAF"], ["Calls", "Downwind, base, final, clear"], ["Format", "Airport name first & last"], ["Basis", "Advisories, see and avoid"]] },
  { id: "towered-comms", group: "Communications", glyph: "tower", source: "aim",
    summary: "The flow of frequencies at a towered airport.",
    body: [
      "Departing a towered airport usually means a sequence of frequencies: listen to the ATIS first, then (if required) call clearance delivery, then ground control for taxi, then the tower for takeoff. Arriving, you contact the tower for landing and, after you have fully cleared the runway, switch to ground control to taxi in.",
      "Keep transmissions brief and standard, and never enter a runway - to take off or to cross - without a clearance from the tower."
    ],
    key: [["First", "ATIS"], ["Taxi out", "Ground control"], ["Takeoff / land", "Tower"], ["After landing", "Clear runway, then ground"]] },
  { id: "light-signals", group: "Communications", glyph: "tower", source: "aim",
    summary: "Light-gun signals when radios fail.",
    body: [
      "If your radio fails, the tower directs you with a light gun. Steady green means cleared (for takeoff on the ground, to land in the air). Steady red means stop on the ground, or give way and keep circling in the air. Flashing red means taxi clear of the runway on the ground, or the airport is unsafe - do not land - in the air.",
      "Flashing green means cleared to taxi on the ground, or return for landing in the air. Flashing white means return to your starting point on the airport. Alternating red and green means use extreme caution."
    ],
    key: [["Steady green", "Cleared (takeoff / land)"], ["Steady red", "Stop / give way"], ["Flashing red", "Clear runway / unsafe"], ["Flashing white", "Return to start (ground)"]] },

  /* ---- Protocol & courtesy ---- */
  { id: "ground-rightofway", group: "Protocol & courtesy", glyph: "checklist", source: "aim",
    summary: "Courtesy and right-of-way on the ground.",
    body: [
      "Taxi defensively and give way - do not assume another aircraft sees you, and yield rather than force a conflict near intersections. After landing, exit the runway and taxi completely past the holding-position markings before you stop to clean up, so your tail is not hanging over the runway.",
      "Keep radio calls brief so others can get a word in, follow any published noise-abatement procedures, and leave room at the run-up area for others to pass."
    ],
    key: [["Taxi", "Defensively, give way"], ["After landing", "Fully clear past hold lines"], ["Radio", "Brief, share the frequency"], ["Noise", "Follow abatement procedures"]] },
  { id: "notams-ground", group: "Protocol & courtesy", glyph: "library", source: "aim",
    summary: "Check NOTAMs and the airport's status.",
    body: [
      "Before you fly, check NOTAMs (Notices to Air Missions) for the airports you will use. They flag closed or shortened runways and taxiways, out-of-service lighting or navaids, construction and cranes, and temporary procedures.",
      "A closed runway is marked with a large yellow or white 'X' (lighted at night). Knowing the airport's real-time status keeps you from taxiing toward a surface that is no longer usable."
    ],
    key: [["Check", "NOTAMs before flying"], ["They flag", "Closures, lights, construction"], ["Closed runway", "Marked with an 'X'"], ["Goal", "Know real-time status"]] },
];

window.__AV_WEATHER__ = [
  /* ---- Reading reports ---- */
  { id: "metar-basics", group: "Reading reports", glyph: "library", source: "aim",
    summary: "What a METAR is.",
    body: [
      "A METAR (Aviation Routine Weather Report) is a snapshot of the actual, observed conditions at an airport, usually issued each hour. It is the most common way pilots get current weather for a specific field.",
      "A METAR follows a fixed order — station, time, wind, visibility, weather, sky condition, temperature and dew point, and altimeter setting — which makes it quick to read once you know the format."
    ],
    key: [["Type", "Observed conditions"], ["Issued", "Typically hourly"], ["Time", "In Zulu (UTC)"], ["Order", "Wind, vis, wx, sky, temp/dew, altimeter"]] },
  { id: "metar-decode", group: "Reading reports", glyph: "library", source: "aim",
    summary: "Decoding the main fields.",
    body: [
      "Wind is given as direction and speed, for example 27015G25KT for wind from 270 degrees at 15 knots gusting 25. Visibility in the US is in statute miles, and present weather uses codes such as RA for rain or BR for mist.",
      "Sky condition uses layer codes, temperature and dew point are in Celsius separated by a slash, and the altimeter is an inches-of-mercury value beginning with A, such as A2992 for 29.92."
    ],
    key: [["Wind", "Dir/speed, G for gusts, KT"], ["Visibility", "Statute miles (US)"], ["Temp/Dew", "Celsius, slash-separated"], ["Altimeter", "A + inches Hg"]] },
  { id: "taf-basics", group: "Reading reports", glyph: "library", source: "aim",
    summary: "What a TAF forecasts.",
    body: [
      "A TAF (Terminal Aerodrome Forecast) is a forecast of expected conditions in the immediate vicinity of an airport, typically covering 24 to 30 hours. It uses much the same coding as a METAR.",
      "Change groups tell you how the forecast evolves over time, such as FM for a rapid change from a stated time, TEMPO for temporary fluctuations, BECMG for a gradual change, and PROB for a probability of conditions."
    ],
    key: [["Type", "Airport forecast"], ["Coverage", "~24–30 hours"], ["Area", "Near the airport"], ["Changes", "FM, TEMPO, BECMG, PROB"]] },
  { id: "sky-cover", group: "Reading reports", glyph: "cloud", source: "aim",
    summary: "Sky condition and ceilings.",
    body: [
      "Cloud coverage is reported in eighths of the sky as few, scattered, broken, or overcast, with a height in hundreds of feet above the ground. Clear skies are reported as clear or sky clear.",
      "The ceiling is the height of the lowest broken or overcast layer, or the vertical visibility into an obscuration. The ceiling and visibility together determine whether conditions are visual or instrument."
    ],
    key: [["Few", "1–2 eighths"], ["Scattered", "3–4 eighths"], ["Broken", "5–7 eighths"], ["Overcast", "8 eighths"], ["Ceiling", "Lowest broken/overcast"]] },
  { id: "wind-reports", group: "Reading reports", glyph: "wind", source: "aim",
    summary: "True north vs. magnetic in reports.",
    body: [
      "An important detail: the wind in a written report such as a METAR or TAF is referenced to true north. The wind a tower or an automated broadcast gives you over the radio is referenced to magnetic north.",
      "Reports also note gusts and variable directions. Knowing whether a wind is true or magnetic matters when you compare it to a runway heading, which is magnetic."
    ],
    key: [["Written reports", "True north"], ["Spoken (ATIS/tower)", "Magnetic north"], ["Gust", "G in the wind group"]] },

  /* ---- The atmosphere ---- */
  { id: "standard-atmosphere", group: "The atmosphere", glyph: "cloud", source: "phak",
    summary: "The standard reference atmosphere.",
    body: [
      "The standard atmosphere is an agreed reference: at sea level, a temperature of 15 degrees Celsius and a pressure of 29.92 inches of mercury. Temperature is assumed to fall about 2 degrees Celsius per thousand feet of altitude.",
      "Real conditions vary from this standard, but instruments, performance charts, and altitudes are all built around it, so it is the baseline every pilot works from."
    ],
    key: [["Sea-level temp", "15 °C"], ["Sea-level pressure", "29.92 inHg"], ["Lapse rate", "~2 °C / 1,000 ft"]] },
  { id: "altimetry", group: "The atmosphere", glyph: "cloud", source: "phak",
    summary: "Pressure, altitude, and the altimeter.",
    body: [
      "An altimeter measures air pressure and displays it as altitude, so it must be set to the local altimeter setting to read correctly. As you fly toward lower pressure or colder air without resetting it, your true altitude becomes lower than what the altimeter shows.",
      "A useful reminder is 'high to low, look out below': going from high pressure or warm air to low pressure or cold air means the ground is closer than the altimeter indicates."
    ],
    key: [["Altimeter", "Reads pressure as altitude"], ["Set to", "Local altimeter setting"], ["High to low", "True altitude is lower"]] },
  { id: "temp-dewpoint", group: "The atmosphere", glyph: "cloud", source: "phak",
    summary: "Temperature–dew point spread.",
    body: [
      "The dew point is the temperature to which air must cool for its moisture to condense. The smaller the spread between temperature and dew point, the more moisture is in the air and the more likely clouds or fog become.",
      "When the temperature and dew point are within a couple of degrees and cooling, fog and low clouds are a real possibility, which is why pilots watch the spread closely."
    ],
    key: [["Dew point", "Where moisture condenses"], ["Small spread", "Moist air, fog risk"], ["Watch when", "Within ~2 °C and cooling"]] },
  { id: "stability", group: "The atmosphere", glyph: "cloud", source: "phak",
    summary: "Stable vs. unstable air.",
    body: [
      "Stable air resists vertical motion. It tends to produce layered, stratiform clouds, steady precipitation, poor visibility in haze, and smooth flying. Unstable air encourages rising motion and brings puffy, cumuliform clouds, showery precipitation, good visibility, and turbulence.",
      "Knowing the stability of the air tells you what kind of clouds, precipitation, and ride to expect on a given day."
    ],
    key: [["Stable", "Layered clouds, smooth, hazy"], ["Unstable", "Cumulus, showers, bumpy"], ["Tell-tale", "Cloud shape and ride"]] },

  /* ---- Clouds & moisture ---- */
  { id: "cloud-families", group: "Clouds & moisture", glyph: "cloud", source: "phak",
    summary: "Clouds grouped by height.",
    body: [
      "Clouds are grouped by the height of their bases. High clouds carry the prefix cirro, middle clouds the prefix alto, and low clouds include stratus and nimbostratus. Clouds with great vertical development, the cumulus and towering cumulonimbus, span many levels.",
      "The family a cloud belongs to hints at the weather: thin high cirrus can signal an approaching system, while building cumulus warns of instability and possible storms."
    ],
    key: [["High", "Cirro- (e.g. cirrus)"], ["Middle", "Alto-"], ["Low", "Stratus, nimbostratus"], ["Vertical", "Cumulus, cumulonimbus"]] },
  { id: "cumulus-stratus", group: "Clouds & moisture", glyph: "cloud", source: "phak",
    summary: "Cumulus vs. stratus.",
    body: [
      "Cumulus clouds are heaped and puffy, formed by rising air in an unstable atmosphere, and they bring showery weather and turbulence. Stratus clouds are flat, featureless layers formed in stable air, bringing steady conditions and often low ceilings and drizzle.",
      "The word nimbus added to either means precipitation, as in nimbostratus, a rain-bearing layer, or cumulonimbus, a thunderstorm cloud."
    ],
    key: [["Cumulus", "Puffy, unstable, showers"], ["Stratus", "Flat layers, stable, drizzle"], ["Nimbus", "Means precipitation"]] },
  { id: "fog-types", group: "Clouds & moisture", glyph: "cloud", source: "phak",
    summary: "How fog forms.",
    body: [
      "Fog is simply a cloud at the surface, and it forms in several ways. Radiation fog forms on calm, clear, moist nights as the ground cools. Advection fog forms when moist air moves over a cooler surface and needs some wind. Upslope fog forms as air is pushed up rising terrain and cools.",
      "Because fog can lower visibility below the limits for safe flight, recognizing the conditions that create it helps you anticipate it."
    ],
    key: [["Radiation", "Calm, clear, cooling night"], ["Advection", "Moist air over cool surface"], ["Upslope", "Air cooled rising terrain"]] },
  { id: "precip", group: "Clouds & moisture", glyph: "cloud", source: "phak",
    summary: "Forms of precipitation.",
    body: [
      "Precipitation forms when cloud droplets or ice crystals grow heavy enough to fall. Steady precipitation usually comes from layered stratiform clouds, while showery precipitation comes from cumuliform clouds.",
      "Freezing rain, which falls as liquid and freezes on contact, is especially hazardous because it can quickly coat an aircraft in ice."
    ],
    key: [["Steady", "From stratiform clouds"], ["Showery", "From cumuliform clouds"], ["Freezing rain", "Severe icing hazard"]] },

  /* ---- Hazards ---- */
  { id: "thunderstorms", group: "Hazards", glyph: "bolt", source: "phak",
    summary: "Thunderstorms and how to avoid them.",
    body: [
      "A thunderstorm grows through three stages: a cumulus stage of rising air, a mature stage with both powerful updrafts and downdrafts and the heaviest weather, and a dissipating stage of sinking air. The mature stage is the most violent, with severe turbulence, lightning, hail, and strong winds.",
      "The guidance is simple and strict: avoid thunderstorms by a wide margin, commonly at least 20 nautical miles, and never attempt to fly under or through one."
    ],
    key: [["Stages", "Cumulus, mature, dissipating"], ["Most violent", "Mature stage"], ["Avoid by", "At least 20 nm"], ["Never", "Fly under or through"]] },
  { id: "icing", group: "Hazards", glyph: "bolt", source: "phak",
    summary: "Structural icing.",
    body: [
      "Structural icing needs two things at once: visible moisture, such as cloud or rain, and a temperature at or below freezing. Ice on the wings and control surfaces adds weight, disrupts lift, and increases drag, all of which degrade performance quickly.",
      "Clear ice forms from large supercooled drops and is heavy and hard to remove; rime ice forms from small droplets and is rough and brittle; mixed ice is a combination."
    ],
    key: [["Needs", "Visible moisture + freezing temp"], ["Clear ice", "Large drops, heavy"], ["Rime ice", "Small droplets, rough"], ["Effect", "Less lift, more drag and weight"]] },
  { id: "turbulence", group: "Hazards", glyph: "bolt", source: "phak",
    summary: "Types of turbulence.",
    body: [
      "Turbulence has several sources. Convective turbulence comes from rising thermals, mechanical turbulence from wind flowing over terrain and buildings, and frontal turbulence from the lifting along a front. Wake turbulence is the wingtip vortices trailing other aircraft.",
      "Clear air turbulence, often near the jet stream, can occur in cloudless sky with no visual warning, so pilot reports are valuable for finding it."
    ],
    key: [["Convective", "Rising thermals"], ["Mechanical", "Terrain and obstacles"], ["Wake", "Other aircraft's vortices"], ["Clear air", "Near the jet stream"]] },
  { id: "wind-shear", group: "Hazards", glyph: "bolt", source: "phak",
    summary: "Wind shear and microbursts.",
    body: [
      "Wind shear is a sudden change in wind speed or direction over a short distance. Near the ground, on takeoff or approach, it can rapidly change an aircraft's airspeed and performance with little time to react.",
      "A microburst is a small but intense column of sinking air, often from a thunderstorm, that spreads out violently at the surface. It is one of the most dangerous forms of low-level wind shear."
    ],
    key: [["Wind shear", "Sudden wind change"], ["Most dangerous", "Low, on takeoff/approach"], ["Microburst", "Intense localized downdraft"]] },
  { id: "mountain-wx", group: "Hazards", glyph: "bolt", source: "phak",
    summary: "Mountain weather hazards.",
    body: [
      "Wind flowing over mountains creates hazards for aircraft. On the downwind side, strong downdrafts can exceed a light aircraft's ability to climb, and mountain wave with its associated rotor can bring severe turbulence well downwind of the ridge.",
      "Mountain flying calls for extra altitude, awareness of the wind, and respect for how quickly conditions change in high terrain."
    ],
    key: [["Downdrafts", "Strong on the lee side"], ["Mountain wave", "Severe turbulence downwind"], ["Rotor", "Turbulent area under the wave"]] },

  /* ---- Fronts & systems ---- */
  { id: "air-masses", group: "Fronts & systems", glyph: "wind", source: "phak",
    summary: "Air masses and fronts.",
    body: [
      "An air mass is a large body of air with fairly uniform temperature and moisture, taking on the character of the region where it formed. A front is the boundary where two different air masses meet, and it is where much of our weather happens.",
      "As a front passes, you can expect changes in temperature, wind, pressure, and cloud and precipitation patterns."
    ],
    key: [["Air mass", "Uniform temp and moisture"], ["Front", "Boundary between air masses"], ["At a front", "Weather changes"]] },
  { id: "cold-front", group: "Fronts & systems", glyph: "wind", source: "phak",
    summary: "Cold fronts.",
    body: [
      "A cold front is the leading edge of advancing cold air. It has a steep slope and tends to move quickly, lifting the warm air ahead of it sharply. This often produces a narrow band of vigorous weather, including showers or thunderstorms and gusty wind shifts.",
      "Cold fronts usually pass relatively fast, with clearing and cooler, drier air behind them."
    ],
    key: [["Is", "Advancing cold air"], ["Weather", "Narrow, vigorous band"], ["Often", "Thunderstorms, gusty winds"], ["After", "Clearing, cooler, drier"]] },
  { id: "warm-front", group: "Fronts & systems", glyph: "wind", source: "phak",
    summary: "Warm fronts.",
    body: [
      "A warm front is the leading edge of advancing warm air that rides up gently over the cooler air ahead. Its shallow slope spreads clouds and precipitation over a wide area, often bringing extended periods of low ceilings, reduced visibility, and steady rain.",
      "Warm fronts move slowly, so their weather tends to linger compared with the quick passage of a cold front."
    ],
    key: [["Is", "Advancing warm air"], ["Weather", "Widespread, gradual"], ["Brings", "Low ceilings, steady rain"], ["Pace", "Slow-moving"]] },
  { id: "occluded-stationary", group: "Fronts & systems", glyph: "wind", source: "phak",
    summary: "Occluded and stationary fronts.",
    body: [
      "An occluded front forms when a faster cold front catches up to a warm front, lifting the warm air off the surface and combining the weather of both. A stationary front is a boundary that is barely moving.",
      "Because a stationary front does not move much, the cloud and precipitation along it can persist over the same area for a long time."
    ],
    key: [["Occluded", "Cold front overtakes warm"], ["Stationary", "Barely moving boundary"], ["Stationary brings", "Prolonged weather"]] },
  { id: "pressure-systems", group: "Fronts & systems", glyph: "wind", source: "phak",
    summary: "Highs and lows.",
    body: [
      "In a high-pressure system, air sinks and spreads out, which usually brings fair, settled weather. In a low-pressure system, air converges and rises, cooling and forming clouds and precipitation, so lows are often associated with unsettled weather.",
      "In the Northern Hemisphere, wind flows clockwise and outward around a high and counterclockwise and inward around a low."
    ],
    key: [["High", "Sinking air, fair weather"], ["Low", "Rising air, clouds/precip"], ["High flow (N. Hem.)", "Clockwise, outward"], ["Low flow (N. Hem.)", "Counterclockwise, inward"]] },

  /* ---- Wind ---- */
  { id: "wind-causes", group: "Wind", glyph: "wind", source: "phak",
    summary: "What makes the wind blow.",
    body: [
      "Wind is air moving from higher pressure toward lower pressure. The greater the pressure difference over a distance, the stronger the wind. The Earth's rotation then deflects this moving air, which is why winds curve rather than flowing straight.",
      "Closely spaced pressure patterns mean a strong pressure gradient and therefore stronger winds."
    ],
    key: [["Driven by", "Pressure differences"], ["Stronger when", "Tighter pressure gradient"], ["Curved by", "Earth's rotation"]] },
  { id: "local-winds", group: "Wind", glyph: "wind", source: "phak",
    summary: "Local and terrain winds.",
    body: [
      "Local heating and terrain create their own winds. Near coastlines, a sea breeze blows from the cooler water toward warmer land by day, and a land breeze reverses it at night. In the mountains, air flows up the slopes by day and drains back down at night.",
      "These local winds can be significant for takeoff, landing, and choosing a runway, especially at airports near water or terrain."
    ],
    key: [["Sea breeze", "Water to land, daytime"], ["Land breeze", "Land to water, night"], ["Mountains", "Up by day, down at night"]] },

  /* ---- Getting weather ---- */
  { id: "briefings", group: "Getting weather", glyph: "radio", source: "aim",
    summary: "Weather briefings before a flight.",
    body: [
      "Before a flight, pilots get a weather briefing covering the conditions and forecasts along the route. A standard briefing is the complete picture, an abbreviated briefing updates specific items, and an outlook briefing is for flights more than a few hours away.",
      "Briefings are available from flight service and from official aviation weather websites, and getting one is a basic part of preflight planning."
    ],
    key: [["Standard", "Full briefing"], ["Abbreviated", "Updates or specific items"], ["Outlook", "For later departures"]] },
  { id: "pireps", group: "Getting weather", glyph: "radio", source: "aim",
    summary: "Pilot reports (PIREPs).",
    body: [
      "A PIREP (Pilot Report) is a report of conditions actually encountered in flight by a pilot, such as cloud tops, turbulence, icing, or visibility. Because they describe the real atmosphere rather than a forecast, PIREPs are extremely valuable to other pilots and to forecasters.",
      "Filing a PIREP when you encounter notable conditions, especially hazards like icing or turbulence, helps everyone build a clearer picture of the weather."
    ],
    key: [["PIREP", "Conditions met in flight"], ["Reports", "Tops, turbulence, icing, vis"], ["Value", "Real-world, current"]] },
  { id: "airmet-sigmet", group: "Getting weather", glyph: "bolt", source: "aim",
    summary: "AIRMETs and SIGMETs.",
    body: [
      "An AIRMET (Airmen's Meteorological Information) advises of weather that may be hazardous to lighter aircraft, such as moderate turbulence, moderate icing, or widespread reduced visibility and mountain obscuration. A SIGMET (Significant Meteorological Information) warns of more severe, significant weather affecting all aircraft, such as severe turbulence or icing.",
      "A convective SIGMET specifically addresses thunderstorm-related hazards. Both are part of the in-flight advisory information you should be aware of."
    ],
    key: [["AIRMET", "Hazards to lighter aircraft"], ["SIGMET", "Severe, affects all aircraft"], ["Convective SIGMET", "Thunderstorm hazards"]] },
  { id: "wx-radar", group: "Getting weather", glyph: "radio", source: "aim",
    summary: "Weather radar and its limits.",
    body: [
      "Ground-based weather radar shows where precipitation is and how intense it is, which helps locate storms. A key limitation is that the displayed picture is not instantaneous: it can be several minutes old, and a fast-moving storm may have moved by the time you see it.",
      "Treat radar as a strategic planning tool to stay well clear of weather, not as a way to thread between cells in real time."
    ],
    key: [["Shows", "Precipitation location/intensity"], ["Limitation", "Picture can be minutes old"], ["Use for", "Staying well clear, not threading"]] },
  { id: "density-altitude", group: "The atmosphere", glyph: "cloud", source: "phak",
    summary: "Why hot, high, and humid air hurts performance.",
    body: [
      "Density altitude is pressure altitude corrected for temperature — the altitude the air 'feels like' to your wings, engine, and propeller. When air is hot, high, or humid it is less dense, so the aircraft makes less lift and thrust and needs more runway to take off and climb.",
      "On a hot day at a high-elevation airport, density altitude can sit thousands of feet above the field elevation. It is a leading factor in takeoff and climb accidents, so compute it and check your performance charts before flying in hot or high conditions."
    ],
    key: [["Definition", "Pressure altitude + temperature"], ["Low density", "Hot, high, humid"], ["Effect", "Less lift, thrust & climb"], ["Risk", "Long takeoff, weak climb"]] },
  { id: "automated-stations", group: "Getting weather", glyph: "radio", source: "aim",
    summary: "ASOS and AWOS: weather straight from the field.",
    body: [
      "Automated stations at airports continuously measure wind, visibility, clouds, temperature, dew point, and the altimeter setting, then broadcast them over a radio frequency and often a phone line. ASOS (Automated Surface Observing System) and AWOS (Automated Weather Observing System) are the backbone of surface reporting and feed many METARs.",
      "Pilots tune the station on approach to get current conditions and the altimeter setting before landing. The report is a continuously updated computer voice and is the most current picture of conditions right at that airport."
    ],
    key: [["ASOS / AWOS", "Automated surface stations"], ["Reports", "Wind, vis, sky, altimeter"], ["Access", "Radio & phone"], ["Use", "Current field conditions"]] },
  { id: "weather-sources", group: "Getting weather", glyph: "cloud", source: "aim",
    summary: "Where to get an official preflight briefing.",
    body: [
      "Official preflight weather comes from Flight Service (1-800-WX-BRIEF) and government sources such as the Aviation Weather Center, by phone and online. You can request a standard, abbreviated, or outlook briefing depending on how far ahead you are planning.",
      "Electronic flight bag apps now bring radar, satellite, METARs, TAFs, and graphical forecasts into the cockpit, but in-flight datalink can be delayed. Start with an official source and treat cockpit weather as strategic, not real-time."
    ],
    key: [["Official", "Flight Service & AWC"], ["Briefing types", "Standard, abbreviated, outlook"], ["EFB apps", "Radar, METARs, charts"], ["Caution", "Datalink can lag"]] }
];

window.__AV_NAV__ = [
  /* ---- Position & charts ---- */
  { id: "lat-long", group: "Position & charts", glyph: "pin", source: "phak",
    summary: "Latitude and longitude.",
    body: [
      "Any point on Earth is located by latitude and longitude. Lines of latitude, or parallels, run east and west and measure how far north or south of the equator a point is. Lines of longitude, or meridians, run north and south and measure how far east or west of the prime meridian a point is.",
      "Together they give a precise coordinate for any airport, fix, or waypoint, which underlies all navigation."
    ],
    key: [["Latitude", "North–south position, parallels"], ["Longitude", "East–west position, meridians"], ["Zero lines", "Equator and prime meridian"]] },
  { id: "sectional", group: "Position & charts", glyph: "pin", source: "cug",
    summary: "The VFR sectional chart.",
    body: [
      "The sectional chart is the primary visual-flight chart, drawn at a scale of 1 to 500,000. It packs in terrain, obstructions, airports, navigation aids, and airspace, and is the chart most pilots plan and fly visually with.",
      "For busy areas around major airports, a terminal area chart shows the same region in greater detail at a larger scale."
    ],
    key: [["Sectional scale", "1:500,000"], ["Shows", "Terrain, airports, airspace, aids"], ["More detail", "Terminal area chart"]] },
  { id: "chart-symbols", group: "Position & charts", glyph: "pin", source: "cug",
    summary: "Reading chart symbols.",
    body: [
      "Charts use a rich set of symbols. Airports appear as circles or outlines colored by whether they have a control tower, obstructions are marked with their heights, and terrain elevation is shown with contour lines and color shading from green at low elevations to brown at high ones.",
      "The chart legend, found in the Chart User's Guide, is the key to every symbol and color."
    ],
    key: [["Airports", "Circles/outlines, tower-colored"], ["Terrain", "Contours, green to brown"], ["Key", "Chart User's Guide legend"]] },
  { id: "airspace-on-charts", group: "Position & charts", glyph: "airspace", source: "cug",
    summary: "How airspace looks on a chart.",
    body: [
      "Airspace is drawn with distinctive lines. Class B is shown by solid blue lines, Class C by solid magenta lines, Class D by dashed blue lines, and Class E surface areas by dashed magenta lines. Numbers on the boundaries give the floors and ceilings.",
      "Reading these boundaries before and during flight is how you stay clear of, or properly enter, each kind of airspace."
    ],
    key: [["Class B", "Solid blue"], ["Class C", "Solid magenta"], ["Class D", "Dashed blue"], ["Class E surface", "Dashed magenta"]] },
  { id: "chart-supplement", group: "Position & charts", glyph: "library", source: "cug",
    summary: "The Chart Supplement.",
    body: [
      "The Chart Supplement, once known as the Airport/Facility Directory, is a companion publication listing detailed information about airports: runways, frequencies, lighting, services, and remarks that do not fit on a chart.",
      "It is the go-to reference for the specifics of an airport you plan to use, alongside the chart itself."
    ],
    key: [["Was called", "Airport/Facility Directory"], ["Lists", "Runways, frequencies, services"], ["Use for", "Airport specifics"]] },

  /* ---- Direction & compass ---- */
  { id: "true-magnetic", group: "Direction & compass", glyph: "compass", source: "phak",
    summary: "True north vs. magnetic north.",
    body: [
      "There are two norths. True north is the geographic pole, the top of the maps. Magnetic north is where a compass needle points, and it is in a different place. Charts are drawn to true north, but the compass and runway numbers are referenced to magnetic north.",
      "Because the two differ, pilots must convert between true and magnetic directions when planning and flying."
    ],
    key: [["True north", "Geographic pole; charts"], ["Magnetic north", "Where the compass points"], ["Convert", "Between the two for flight"]] },
  { id: "variation", group: "Direction & compass", glyph: "compass", source: "phak",
    summary: "Magnetic variation.",
    body: [
      "Variation is the angular difference between true north and magnetic north at a given place. It changes with location and is shown on charts by isogonic lines; the line of zero variation is the agonic line.",
      "To convert a true direction to a magnetic one, a common reminder is 'east is least, west is best': subtract easterly variation and add westerly variation."
    ],
    key: [["Variation", "Angle between true and magnetic"], ["Shown by", "Isogonic lines"], ["Rule", "East subtract, west add"]] },
  { id: "deviation", group: "Direction & compass", glyph: "compass", source: "phak",
    summary: "Compass deviation.",
    body: [
      "Deviation is a smaller error caused by the airplane's own metal and electrical systems disturbing the compass. Because it differs from aircraft to aircraft and by heading, each compass has a correction card showing the deviation on various headings.",
      "Accounting for both variation and deviation turns a true course into the actual compass heading to fly."
    ],
    key: [["Deviation", "Error from the aircraft itself"], ["Varies by", "Aircraft and heading"], ["Reference", "Compass correction card"]] },
  { id: "compass-errors", group: "Direction & compass", glyph: "compass", source: "phak",
    summary: "Magnetic compass errors.",
    body: [
      "The magnetic compass is simple but has in-flight quirks from the way it hangs and from magnetic dip. During turns through north and south it reads incorrectly for a moment, and it briefly swings when you speed up or slow down on east or west headings.",
      "Two memory aids help: for turns, undershoot north and overshoot south; for acceleration on east-west headings, the compass shows a turn toward north when accelerating and toward south when decelerating."
    ],
    key: [["Turning error", "Undershoot N, overshoot S"], ["Acceleration", "North when speeding up"], ["Deceleration", "South when slowing"], ["Cause", "Magnetic dip"]] },

  /* ---- Navigation methods ---- */
  { id: "pilotage", group: "Navigation methods", glyph: "compass", source: "phak",
    summary: "Pilotage: navigating by landmarks.",
    body: [
      "Pilotage is navigating by looking outside and matching visible landmarks, such as rivers, roads, towns, and lakes, to the chart. It is the most basic form of navigation and a core visual-flying skill.",
      "Pilotage works best with prominent, unmistakable features and is often combined with other methods for accuracy."
    ],
    key: [["Pilotage", "Navigate by visible landmarks"], ["Match", "Chart features to the ground"], ["Best with", "Prominent landmarks"]] },
  { id: "dead-reckoning", group: "Navigation methods", glyph: "compass", source: "phak",
    summary: "Dead reckoning.",
    body: [
      "Dead reckoning is computing where you are and when you will arrive from known quantities: your heading, your speed, the time flown, and the effect of the wind. From a known starting point, these let you predict your position along the route.",
      "Pilots often blend dead reckoning with pilotage, using the computed estimate and confirming it against landmarks."
    ],
    key: [["Dead reckoning", "Compute position from knowns"], ["Inputs", "Heading, speed, time, wind"], ["Paired with", "Pilotage"]] },
  { id: "wind-triangle", group: "Navigation methods", glyph: "compass", source: "phak",
    summary: "The wind triangle.",
    body: [
      "Wind pushes an aircraft off its intended path, so pilots solve a wind triangle to correct for it. Combining the desired course and speed with the wind's direction and speed gives a wind correction angle to hold and the resulting ground speed.",
      "Heading into the wind by the correction angle keeps the aircraft tracking along the intended course over the ground."
    ],
    key: [["Solves for", "Wind correction angle, ground speed"], ["Inputs", "Course, true airspeed, wind"], ["Result", "Heading to hold the course"]] },

  /* ---- Radio navigation ---- */
  { id: "vor", group: "Radio navigation", glyph: "radio", source: "ifh",
    summary: "The VOR.",
    body: [
      "A VOR is a ground-based navigation station that defines 360 courses radiating outward, called radials, one for each degree of the compass. Aircraft equipment tells you which radial you are on relative to the station.",
      "VOR signals are line-of-sight in the VHF band, so range improves with altitude and is blocked by terrain."
    ],
    key: [["VOR", "Ground station with 360 radials"], ["Radial", "A course from the station"], ["Signal", "Line-of-sight VHF"]] },
  { id: "vor-use", group: "Radio navigation", glyph: "radio", source: "ifh",
    summary: "Using a VOR.",
    body: [
      "To use a VOR you select a course on the instrument, and a needle shows whether you are left or right of that course while a flag shows whether it leads to or from the station. Centering the needle and flying the indicated heading tracks the course.",
      "Importantly, a VOR indication depends only on your position relative to the station, not on which way the aircraft is pointed."
    ],
    key: [["Select", "A course to or from the station"], ["Needle", "Left/right of course"], ["Flag", "TO or FROM"], ["Independent of", "Aircraft heading"]] },
  { id: "dme", group: "Radio navigation", glyph: "radio", source: "ifh",
    summary: "DME and slant range.",
    body: [
      "Distance measuring equipment, or DME, shows how far the aircraft is from a station. It measures the straight-line, or slant-range, distance, which is the direct line through the air to the station rather than the distance across the ground.",
      "Directly over a high station the slant range is noticeably more than the ground distance, which matters when very close and high."
    ],
    key: [["DME", "Distance to a station"], ["Measures", "Slant range (direct line)"], ["Note", "Differs from ground distance when high"]] },
  { id: "ils", group: "Radio navigation", glyph: "radio", source: "ifh",
    summary: "The ILS approach.",
    body: [
      "An instrument landing system guides an aircraft down to a runway in low visibility using two radio beams. The localizer provides left-and-right guidance aligned with the runway centerline, and the glideslope provides up-and-down guidance along the correct descent angle.",
      "Flown together, they bring the aircraft down a precise path toward the touchdown zone."
    ],
    key: [["ILS", "Precision approach guidance"], ["Localizer", "Lateral, runway centerline"], ["Glideslope", "Vertical, descent angle"]] },
  { id: "ndb-adf", group: "Radio navigation", glyph: "radio", source: "ifh",
    summary: "NDB and ADF (legacy).",
    body: [
      "An older system pairs a ground non-directional beacon with an aircraft automatic direction finder, whose needle simply points toward the station. It is largely being retired in favor of satellite navigation, but it still appears in training and in some areas.",
      "Unlike a VOR, an ADF needle points at the station regardless of your course, so interpreting it takes a little more work."
    ],
    key: [["NDB", "Non-directional ground beacon"], ["ADF", "Needle points to the station"], ["Status", "Largely being retired"]] },

  /* ---- Satellite navigation ---- */
  { id: "gps-basics", group: "Satellite navigation", glyph: "radio", source: "aim",
    summary: "How GPS finds you.",
    body: [
      "The Global Positioning System fixes your location by measuring the distance to several satellites at once and finding the single point those distances agree on. Receiving at least four satellites lets the receiver compute a three-dimensional position.",
      "GPS has become the backbone of modern navigation because it provides accurate position almost anywhere, independent of ground stations."
    ],
    key: [["GPS", "Position from satellite ranging"], ["Needs", "At least 4 satellites for 3D"], ["Strength", "Accurate, nearly worldwide"]] },
  { id: "rnav", group: "Satellite navigation", glyph: "compass", source: "aim",
    summary: "RNAV: flying point to point.",
    body: [
      "Area navigation, or RNAV, lets an aircraft fly directly between any chosen waypoints rather than only from one ground station to another. Powered largely by GPS, it frees routes from the old constraint of connecting navigation aids.",
      "This enables more direct, efficient routings and the modern approaches and procedures built around waypoints in space."
    ],
    key: [["RNAV", "Navigate point to point"], ["Enabled by", "GPS"], ["Benefit", "Direct, efficient routes"]] },
  { id: "waas-raim", group: "Satellite navigation", glyph: "radio", source: "aim",
    summary: "Accuracy and integrity.",
    body: [
      "Because safety depends on trusting the position, GPS is backed by integrity systems. The Wide Area Augmentation System sends corrections that improve accuracy and reliability, enough to support precise approaches with vertical guidance.",
      "Receiver autonomous integrity monitoring is a built-in check that warns the pilot if the GPS signals can no longer be trusted for the intended operation."
    ],
    key: [["WAAS", "Corrections for accuracy/integrity"], ["Enables", "Approaches with vertical guidance"], ["RAIM", "Warns if GPS is unreliable"]] },
  { id: "ads-b", group: "Satellite navigation", glyph: "radio", source: "aim",
    summary: "ADS-B surveillance.",
    body: [
      "Automatic dependent surveillance–broadcast has an aircraft determine its own position from GPS and broadcast it, so controllers and other aircraft can see it. ADS-B Out is required to operate in much of the busier controlled airspace.",
      "ADS-B In can also bring traffic and weather information into the cockpit, improving a pilot's awareness."
    ],
    key: [["ADS-B Out", "Broadcasts your GPS position"], ["Required in", "Much controlled airspace"], ["ADS-B In", "Traffic and weather to the cockpit"]] },

  /* ---- Planning & altitude ---- */
  { id: "course-heading-track", group: "Planning & altitude", glyph: "library", source: "phak",
    summary: "Course, heading, and track.",
    body: [
      "These three terms are easy to confuse. Course is the path you intend to fly over the ground, heading is the direction the aircraft's nose is pointed, and track is the path the aircraft actually follows over the ground.",
      "When there is wind, the heading must differ from the course so that the resulting track matches the course you intended."
    ],
    key: [["Course", "Intended path over ground"], ["Heading", "Where the nose points"], ["Track", "Actual path over ground"]] },
  { id: "airspeed-types", group: "Planning & altitude", glyph: "library", source: "phak",
    summary: "Kinds of airspeed.",
    body: [
      "Indicated airspeed is what the airspeed indicator shows. Calibrated airspeed corrects it for small instrument and installation errors. True airspeed corrects further for altitude and temperature, and increases relative to indicated as you climb.",
      "Ground speed is the true airspeed adjusted for wind, and it is what determines how long a trip actually takes."
    ],
    key: [["Indicated", "What the gauge shows"], ["Calibrated", "Corrected for instrument error"], ["True", "Corrected for altitude/temp"], ["Ground speed", "True airspeed plus wind"]] },
  { id: "altitude-types", group: "Planning & altitude", glyph: "library", source: "phak",
    summary: "Kinds of altitude.",
    body: [
      "Altitude comes in several flavors. Indicated altitude is the altimeter reading with the local setting. Pressure altitude is the height above the standard pressure datum, set when the altimeter reads 29.92. Density altitude is pressure altitude corrected for temperature and is what governs aircraft performance.",
      "True altitude is the actual height above mean sea level, and absolute altitude is the height above the ground directly below."
    ],
    key: [["Indicated", "Altimeter with local setting"], ["Pressure", "Above standard datum (29.92)"], ["Density", "Pressure alt. for performance"], ["True / Absolute", "Above sea level / above ground"]] },
  { id: "cruising-altitudes", group: "Planning & altitude", glyph: "compass", source: "phak",
    summary: "VFR cruising altitudes.",
    body: [
      "Above a few thousand feet, VFR cruising altitudes follow a hemispheric rule based on your magnetic course, which keeps opposing traffic separated. On an easterly course, from 0 up to 179 degrees, you fly odd thousands plus 500 feet, such as 3,500 or 5,500.",
      "On a westerly course, from 180 to 359 degrees, you fly even thousands plus 500 feet, such as 4,500 or 6,500."
    ],
    key: [["Eastbound (0–179°)", "Odd thousand + 500"], ["Westbound (180–359°)", "Even thousand + 500"], ["Applies above", "3,000 ft AGL"]] },
  { id: "flight-computer", group: "Planning & altitude", glyph: "library", source: "phak",
    summary: "The flight computer and TSD.",
    body: [
      "A flight computer, the classic E6B, solves the routine math of flight planning: time, speed, and distance, fuel burn, wind correction, and unit conversions. The core relationship is simple — distance equals speed multiplied by time — and the computer handles it quickly.",
      "Mechanical and electronic versions both exist, and the skill of using one underlies cross-country planning."
    ],
    key: [["Flight computer", "Solves planning math (E6B)"], ["Handles", "Time-speed-distance, fuel, wind"], ["Core", "Distance = speed × time"]] },
  { id: "gps-approaches", group: "Satellite navigation", glyph: "radio", source: "ifh",
    summary: "RNAV (GPS) approaches: LNAV, LP, and LPV.",
    body: [
      "Satellite navigation lets aircraft fly instrument approaches to runways with no ground transmitter. These RNAV (GPS) approaches carry different minimums depending on the equipment and signal: LNAV gives lateral-only guidance, LP adds tighter lateral guidance, and LPV adds vertical guidance for an ILS-like glidepath.",
      "LPV minimums, made possible by WAAS, can bring you nearly as low as an ILS at thousands of runways that never had one. The approach chart lists every line of minimums the aircraft is equipped to use."
    ],
    key: [["LNAV", "Lateral guidance only"], ["LP", "Tighter lateral (no glide)"], ["LPV", "Lateral + vertical (WAAS)"], ["Benefit", "ILS-like at many runways"]] },
  { id: "vfr-planning", group: "Planning & altitude", glyph: "compass", source: "phak",
    summary: "Building and flying a VFR cross-country.",
    body: [
      "A VFR cross-country starts on a chart: draw the course, measure headings and distances, then use winds aloft and your airspeed to work out heading, groundspeed, time, and fuel for each leg. Checkpoints along the way let you confirm you are on course and on time.",
      "In flight you match landmarks to the chart and adjust. If a checkpoint does not appear when expected, use your last known position, heading, and elapsed time to estimate where you are rather than pressing on blindly."
    ],
    key: [["Plan", "Course, heading, time, fuel"], ["Tools", "Chart, winds aloft, computer"], ["Checkpoints", "Confirm course & time"], ["Stay found", "Track position continuously"]] },
  { id: "diversions", group: "Planning & altitude", glyph: "compass", source: "phak",
    summary: "Diverting and what to do if unsure of position.",
    body: [
      "When weather, fuel, or an emergency makes continuing unwise, divert: pick a suitable alternate, turn toward it, and estimate a new heading, time, and fuel with rules of thumb rather than precise plotting. Fly the airplane first, then refine the numbers.",
      "If you become unsure of your position, the classic guidance is to climb, conserve fuel, and communicate. Climbing extends radio and radar range so ATC or Flight Service can help, and the emergency transponder code brings prompt assistance."
    ],
    key: [["Divert", "Choose alternate, turn, estimate"], ["Priority", "Fly the airplane first"], ["If unsure", "Climb, conserve, communicate"], ["Help", "ATC, Flight Service, 121.5"]] }
];

window.__AV_GLOSSARY__ = [
  /* ---------------- Weather ---------------- */
  { term: "METAR", full: "Aviation Routine Weather Report", def: "A coded report of current, observed weather at an airport, normally issued each hour.", cat: "Weather" },
  { term: "TAF", full: "Terminal Aerodrome Forecast", def: "A coded forecast of expected weather in the vicinity of an airport, usually covering 24 to 30 hours.", cat: "Weather" },
  { term: "ATIS", full: "Automatic Terminal Information Service", def: "A continuous recorded broadcast of current weather and airport information at busier airports.", cat: "Weather" },
  { term: "ASOS", full: "Automated Surface Observing System", def: "The primary U.S. automated station network that measures and reports surface weather.", cat: "Weather" },
  { term: "AWOS", full: "Automated Weather Observing System", def: "An automated weather station, often at smaller airports, that broadcasts current conditions.", cat: "Weather" },
  { term: "AIRMET", full: "Airmen's Meteorological Information", def: "An in-flight advisory of weather hazardous mainly to lighter aircraft, such as moderate turbulence or icing.", cat: "Weather" },
  { term: "SIGMET", full: "Significant Meteorological Information", def: "An advisory of weather significant to all aircraft, such as severe turbulence, severe icing, or volcanic ash.", cat: "Weather" },
  { term: "Convective SIGMET", full: "", def: "A SIGMET specifically for thunderstorm-related hazards, including embedded storms and squall lines.", cat: "Weather" },
  { term: "PIREP", full: "Pilot Report", def: "A report of weather actually encountered in flight by a pilot, such as tops, turbulence, or icing.", cat: "Weather" },
  { term: "GFA", full: "Graphical Forecasts for Aviation", def: "A set of web-based graphical aviation weather forecasts that replaced the textual Area Forecast.", cat: "Weather" },
  { term: "VMC", full: "Visual Meteorological Conditions", def: "Weather good enough to fly by outside visual reference, meeting or exceeding VFR minimums.", cat: "Weather" },
  { term: "IMC", full: "Instrument Meteorological Conditions", def: "Weather below visual minimums, requiring flight by reference to instruments.", cat: "Weather" },
  { term: "MVFR", full: "Marginal Visual Flight Rules", def: "Ceilings of 1,000 to 3,000 ft and/or visibility of 3 to 5 statute miles.", cat: "Weather" },
  { term: "Ceiling", full: "", def: "The height above the ground of the lowest broken or overcast layer, or the vertical visibility into an obscuration.", cat: "Weather" },
  { term: "Dew point", full: "", def: "The temperature to which air must cool to become saturated; a small temperature–dew point spread suggests fog or low cloud.", cat: "Weather" },
  { term: "Density altitude", full: "", def: "Pressure altitude corrected for nonstandard temperature; high density altitude reduces aircraft performance.", cat: "Weather" },
  { term: "Pressure altitude", full: "", def: "The altitude shown when the altimeter is set to 29.92 inches of mercury; used for performance computations.", cat: "Weather" },
  { term: "Standard atmosphere", full: "", def: "A reference condition of 15 °C and 29.92 inHg at sea level, used as a baseline for performance.", cat: "Weather" },
  { term: "Wind shear", full: "", def: "A sudden change in wind speed or direction over a short distance; especially dangerous near the ground.", cat: "Weather" },
  { term: "Microburst", full: "", def: "A small, intense downdraft that produces severe, short-lived wind shear.", cat: "Weather" },
  { term: "Temperature inversion", full: "", def: "A layer where temperature increases with altitude, often trapping haze and producing smooth, stable air.", cat: "Weather" },
  { term: "Front", full: "", def: "The boundary between two air masses; the passage of a front brings changing weather.", cat: "Weather" },
  { term: "Freezing level", full: "", def: "The altitude at which the air temperature is 0 °C; important for structural icing.", cat: "Weather" },
  { term: "Zulu time (UTC)", full: "Coordinated Universal Time", def: "The single time standard used throughout aviation worldwide, written with a trailing Z.", cat: "Weather" },

  /* ---------------- Airspace ---------------- */
  { term: "AGL", full: "Above Ground Level", def: "Height measured from the ground directly beneath the aircraft.", cat: "Airspace" },
  { term: "MSL", full: "Mean Sea Level", def: "Altitude measured from average sea level; what the altimeter shows when set to local pressure.", cat: "Airspace" },
  { term: "Class A airspace", full: "", def: "Airspace from 18,000 ft MSL up to FL600; operations are conducted under instrument flight rules only.", cat: "Airspace" },
  { term: "Class B airspace", full: "", def: "Controlled airspace around the busiest airports; an ATC clearance is required to enter.", cat: "Airspace" },
  { term: "Class C airspace", full: "", def: "Controlled airspace around moderately busy towered airports with radar; two-way radio and a transponder are required.", cat: "Airspace" },
  { term: "Class D airspace", full: "", def: "Controlled airspace around a towered airport; two-way radio communication is required to enter.", cat: "Airspace" },
  { term: "Class E airspace", full: "", def: "Controlled airspace that is not Class A, B, C, or D; it supports instrument operations without the stricter entry rules.", cat: "Airspace" },
  { term: "Class G airspace", full: "", def: "Uncontrolled airspace in which ATC does not separate traffic.", cat: "Airspace" },
  { term: "MOA", full: "Military Operations Area", def: "Airspace set aside for military training; VFR aircraft may transit but should use caution.", cat: "Airspace" },
  { term: "TFR", full: "Temporary Flight Restriction", def: "A temporary rule restricting flight in an area, such as for events, wildfires, or VIP movement.", cat: "Airspace" },
  { term: "SFRA", full: "Special Flight Rules Area", def: "An area with special procedures and requirements, such as the airspace around Washington, D.C.", cat: "Airspace" },
  { term: "ADIZ", full: "Air Defense Identification Zone", def: "Airspace in which aircraft must be readily identified in the interest of national security.", cat: "Airspace" },
  { term: "Prohibited area", full: "", def: "Airspace within which flight is not permitted.", cat: "Airspace" },
  { term: "Restricted area", full: "", def: "Airspace containing hazards such as artillery or guided missiles; entry requires permission.", cat: "Airspace" },
  { term: "Mode C veil", full: "", def: "The 30-nautical-mile ring around a Class B airport within which an altitude-reporting transponder is required.", cat: "Airspace" },
  { term: "Sectional chart", full: "", def: "A VFR aeronautical chart at 1:500,000 scale showing terrain, airports, and airspace.", cat: "Airspace" },
  { term: "TAC", full: "Terminal Area Chart", def: "A more detailed VFR chart (1:250,000) covering the airspace around a Class B airport.", cat: "Airspace" },

  /* ---------------- Navigation ---------------- */
  { term: "VOR", full: "VHF Omnidirectional Range", def: "A ground-based radio navigation aid that defines radials a pilot can track to or from the station.", cat: "Navigation" },
  { term: "VHF", full: "Very High Frequency", def: "The radio band (about 30 to 300 MHz) used for most aviation voice communication and VOR navigation.", cat: "Navigation" },
  { term: "GPS", full: "Global Positioning System", def: "A satellite navigation system that provides precise position information worldwide.", cat: "Navigation" },
  { term: "GNSS", full: "Global Navigation Satellite System", def: "The general term for satellite navigation systems, including GPS.", cat: "Navigation" },
  { term: "WAAS", full: "Wide Area Augmentation System", def: "A system that improves GPS accuracy and integrity enough to fly precise approaches.", cat: "Navigation" },
  { term: "DME", full: "Distance Measuring Equipment", def: "Equipment that displays the slant-range distance from the aircraft to a ground station.", cat: "Navigation" },
  { term: "ILS", full: "Instrument Landing System", def: "A precision approach providing lateral (localizer) and vertical (glideslope) guidance to a runway.", cat: "Navigation" },
  { term: "Localizer", full: "", def: "The component of an ILS that provides lateral guidance to the runway centerline.", cat: "Navigation" },
  { term: "Glideslope", full: "", def: "The component of an ILS that provides vertical guidance to the runway.", cat: "Navigation" },
  { term: "NDB", full: "Nondirectional Beacon", def: "An older ground-based radio beacon used for navigation with an ADF.", cat: "Navigation" },
  { term: "ADF", full: "Automatic Direction Finder", def: "A cockpit instrument whose needle points toward an NDB or other low-frequency station.", cat: "Navigation" },
  { term: "RNAV", full: "Area Navigation", def: "A method of navigation that permits flight on any desired path, not just directly between ground stations.", cat: "Navigation" },
  { term: "RNP", full: "Required Navigation Performance", def: "RNAV that adds on-board monitoring and alerting of navigation accuracy.", cat: "Navigation" },
  { term: "Magnetic variation", full: "", def: "The angular difference between true north and magnetic north at a given location.", cat: "Navigation" },
  { term: "Deviation", full: "", def: "Compass error caused by magnetic fields within the aircraft itself.", cat: "Navigation" },
  { term: "Pilotage", full: "", def: "Navigating by reference to visible landmarks on the ground.", cat: "Navigation" },
  { term: "Dead reckoning", full: "", def: "Navigating by computing position from a known heading, speed, and elapsed time.", cat: "Navigation" },
  { term: "Waypoint", full: "", def: "A defined geographic point used to build a route in area navigation.", cat: "Navigation" },

  /* ---------------- Regulations & certificates ---------------- */
  { term: "FAA", full: "Federal Aviation Administration", def: "The U.S. government agency that regulates civil aviation.", cat: "Regulations & certificates" },
  { term: "ICAO", full: "International Civil Aviation Organization", def: "The United Nations agency that sets international civil aviation standards.", cat: "Regulations & certificates" },
  { term: "NTSB", full: "National Transportation Safety Board", def: "The independent U.S. agency that investigates accidents and issues safety recommendations.", cat: "Regulations & certificates" },
  { term: "CFR", full: "Code of Federal Regulations", def: "The published body of U.S. federal regulations; aviation rules are in Title 14.", cat: "Regulations & certificates" },
  { term: "14 CFR", full: "", def: "Title 14 of the Code of Federal Regulations, 'Aeronautics and Space,' where the aviation rules live.", cat: "Regulations & certificates" },
  { term: "FAR", full: "Federal Aviation Regulations", def: "The common name for the aviation rules contained in 14 CFR.", cat: "Regulations & certificates" },
  { term: "AIM", full: "Aeronautical Information Manual", def: "The FAA's official guide to basic flight information and air traffic control procedures.", cat: "Regulations & certificates" },
  { term: "AC", full: "Advisory Circular", def: "Nonregulatory FAA guidance that explains acceptable ways to comply with the regulations.", cat: "Regulations & certificates" },
  { term: "ACS", full: "Airman Certification Standards", def: "The standards an applicant must meet on the knowledge test and practical test for a certificate or rating.", cat: "Regulations & certificates" },
  { term: "PIC", full: "Pilot in Command", def: "The pilot who is responsible for, and is the final authority on, the operation of the aircraft.", cat: "Regulations & certificates" },
  { term: "SIC", full: "Second in Command", def: "An additional required pilot, such as a copilot.", cat: "Regulations & certificates" },
  { term: "BasicMed", full: "", def: "An alternative to the FAA medical certificate that lets many pilots fly certain operations after a standard medical exam and online course.", cat: "Regulations & certificates" },
  { term: "AME", full: "Aviation Medical Examiner", def: "A physician authorized by the FAA to perform airman medical examinations.", cat: "Regulations & certificates" },
  { term: "ATP", full: "Airline Transport Pilot", def: "The highest pilot certificate, required to act as pilot in command of an airliner.", cat: "Regulations & certificates" },
  { term: "CFI", full: "Certificated Flight Instructor", def: "A pilot certificated to provide flight and ground instruction.", cat: "Regulations & certificates" },
  { term: "CFII", full: "Certificated Flight Instructor – Instrument", def: "A flight instructor authorized to teach the instrument rating.", cat: "Regulations & certificates" },
  { term: "MEI", full: "Multi-Engine Instructor", def: "A flight instructor authorized to teach in multi-engine airplanes.", cat: "Regulations & certificates" },
  { term: "Category", full: "", def: "A broad classification of aircraft for certification, such as airplane or rotorcraft.", cat: "Regulations & certificates" },
  { term: "Class", full: "", def: "A narrower classification within a category, such as single-engine land.", cat: "Regulations & certificates" },
  { term: "Rating", full: "", def: "An addition to a certificate that grants a specific privilege, such as the instrument rating.", cat: "Regulations & certificates" },
  { term: "Endorsement", full: "", def: "A signed entry from an instructor authorizing specific training or privileges.", cat: "Regulations & certificates" },
  { term: "Type rating", full: "", def: "An authorization required to act as pilot in command of a specific large or turbojet aircraft.", cat: "Regulations & certificates" },
  { term: "IACRA", full: "Integrated Airman Certification and Rating Application", def: "The FAA's online system for submitting airman certificate and rating applications.", cat: "Regulations & certificates" },
  { term: "Part 61", full: "", def: "The regulations covering the certification of pilots, flight instructors, and ground instructors.", cat: "Regulations & certificates" },
  { term: "Part 91", full: "", def: "The general operating and flight rules for most civil aircraft.", cat: "Regulations & certificates" },
  { term: "Part 107", full: "", def: "The rules for small commercial unmanned aircraft (drone) operations.", cat: "Regulations & certificates" },
  { term: "Part 121 / 135", full: "", def: "The rules for scheduled airlines (Part 121) and charter or commuter operators (Part 135).", cat: "Regulations & certificates" },
  { term: "MOSAIC", full: "Modernization of Special Airworthiness Certificates", def: "An FAA rulemaking that expands light-sport aircraft and sport-pilot privileges.", cat: "Regulations & certificates" },

  /* ---------------- Operations & procedures ---------------- */
  { term: "ADM", full: "Aeronautical Decision Making", def: "A systematic approach to consistently making sound decisions throughout a flight.", cat: "Operations & procedures" },
  { term: "CRM", full: "Crew Resource Management", def: "The effective use of all available resources—people, equipment, and information—by a flight crew.", cat: "Operations & procedures" },
  { term: "SRM", full: "Single-Pilot Resource Management", def: "Decision-making and resource-management concepts applied to a pilot operating alone.", cat: "Operations & procedures" },
  { term: "IMSAFE", full: "", def: "A personal fitness checklist: Illness, Medication, Stress, Alcohol, Fatigue, and Emotion.", cat: "Operations & procedures" },
  { term: "PAVE", full: "", def: "A preflight risk checklist: Pilot, Aircraft, enVironment, and External pressures.", cat: "Operations & procedures" },
  { term: "TEM", full: "Threat and Error Management", def: "Identifying and managing threats and errors before they lead to an undesired state.", cat: "Operations & procedures" },
  { term: "NOTAM", full: "Notice to Air Missions", def: "A notice of changes or hazards in the airspace system, such as a closed runway or an unlit tower (formerly Notice to Airmen).", cat: "Operations & procedures" },
  { term: "CTAF", full: "Common Traffic Advisory Frequency", def: "The radio frequency pilots use to self-coordinate at a non-towered airport.", cat: "Operations & procedures" },
  { term: "UNICOM", full: "Universal Communications", def: "A non-ATC radio station that can provide airport advisories at some fields.", cat: "Operations & procedures" },
  { term: "FBO", full: "Fixed-Base Operator", def: "A business at an airport that provides services such as fuel, parking, and maintenance.", cat: "Operations & procedures" },
  { term: "TPA", full: "Traffic Pattern Altitude", def: "The altitude flown in the airport traffic pattern, commonly about 1,000 ft above the ground.", cat: "Operations & procedures" },
  { term: "Traffic pattern", full: "", def: "The standard rectangular path flown around an airport for landing, with upwind, crosswind, downwind, base, and final legs.", cat: "Operations & procedures" },
  { term: "Go-around", full: "", def: "Discontinuing a landing approach and climbing away to set up another attempt.", cat: "Operations & procedures" },
  { term: "Runup", full: "", def: "A pre-takeoff engine check that verifies the magnetos, controls, and instruments.", cat: "Operations & procedures" },
  { term: "W&B", full: "Weight and Balance", def: "The calculation confirming an aircraft is loaded within its weight and center-of-gravity limits.", cat: "Operations & procedures" },
  { term: "LAHSO", full: "Land and Hold Short Operations", def: "Landing and stopping before an intersecting runway or point as directed by ATC.", cat: "Operations & procedures" },

  /* ---------------- Aerodynamics & performance ---------------- */
  { term: "The four forces", full: "", def: "Lift, weight, thrust, and drag—the four aerodynamic forces acting on an aircraft.", cat: "Aerodynamics & performance" },
  { term: "AOA", full: "Angle of Attack", def: "The angle between the wing's chord line and the oncoming relative wind.", cat: "Aerodynamics & performance" },
  { term: "Stall", full: "", def: "A loss of lift that occurs when the wing exceeds its critical angle of attack.", cat: "Aerodynamics & performance" },
  { term: "Spin", full: "", def: "An aggravated stall in which the aircraft descends in a corkscrew path.", cat: "Aerodynamics & performance" },
  { term: "Vmc", full: "Minimum Control Speed", def: "The minimum speed at which a multi-engine airplane can be controlled with the critical engine inoperative.", cat: "Aerodynamics & performance" },
  { term: "Vx", full: "", def: "Best angle-of-climb speed, which gains the most altitude over a given distance.", cat: "Aerodynamics & performance" },
  { term: "Vy", full: "", def: "Best rate-of-climb speed, which gains the most altitude in a given time.", cat: "Aerodynamics & performance" },
  { term: "Vne", full: "", def: "Never-exceed speed, the red line on the airspeed indicator.", cat: "Aerodynamics & performance" },
  { term: "Vso", full: "", def: "Stall speed, or the minimum steady flight speed, in the landing configuration.", cat: "Aerodynamics & performance" },
  { term: "Va", full: "", def: "Maneuvering speed, below which full deflection of a single control will not overstress the airframe.", cat: "Aerodynamics & performance" },
  { term: "Load factor", full: "", def: "The ratio of the lift acting on the aircraft to its weight, expressed in Gs.", cat: "Aerodynamics & performance" },
  { term: "Ground effect", full: "", def: "Temporarily increased lift and reduced drag that occur when flying very close to the ground.", cat: "Aerodynamics & performance" },
  { term: "P-factor", full: "", def: "A left-turning tendency caused by the descending propeller blade producing more thrust than the ascending blade.", cat: "Aerodynamics & performance" },
  { term: "Torque effect", full: "", def: "A left-turning tendency caused by the reaction to engine and propeller rotation.", cat: "Aerodynamics & performance" },
  { term: "Autorotation", full: "", def: "A descent in a helicopter or gyroplane in which airflow, not the engine, keeps the rotor turning.", cat: "Aerodynamics & performance" },
  { term: "CG", full: "Center of Gravity", def: "The point at which the aircraft's weight is considered to be concentrated and balanced.", cat: "Aerodynamics & performance" },

  /* ---------------- Aircraft & systems ---------------- */
  { term: "UAS", full: "Unmanned Aircraft System", def: "An aircraft operated without a pilot on board, together with its supporting control equipment.", cat: "Aircraft & systems" },
  { term: "sUAS", full: "Small Unmanned Aircraft System", def: "A drone weighing less than 55 pounds, including everything on board, with its control equipment.", cat: "Aircraft & systems" },
  { term: "LSA", full: "Light-Sport Aircraft", def: "A category of simple, light aircraft that a sport pilot may fly.", cat: "Aircraft & systems" },
  { term: "eVTOL", full: "Electric Vertical Take-Off and Landing", def: "An electric aircraft that takes off and lands vertically and cruises using wings or rotors.", cat: "Aircraft & systems" },
  { term: "AAM", full: "Advanced Air Mobility", def: "Emerging aircraft and operations such as electric air taxis in and around cities.", cat: "Aircraft & systems" },
  { term: "Empennage", full: "", def: "The tail assembly of an airplane, including the horizontal and vertical stabilizers.", cat: "Aircraft & systems" },
  { term: "Ailerons", full: "", def: "Control surfaces on the wings that roll the airplane about its longitudinal axis.", cat: "Aircraft & systems" },
  { term: "Elevator", full: "", def: "The control surface that pitches the airplane's nose up or down.", cat: "Aircraft & systems" },
  { term: "Rudder", full: "", def: "The control surface that yaws the airplane's nose left or right.", cat: "Aircraft & systems" },
  { term: "Flaps", full: "", def: "High-lift devices that increase lift and drag to allow slower, steeper approaches.", cat: "Aircraft & systems" },
  { term: "Trim", full: "", def: "A control that relieves the pressure a pilot would otherwise hold to maintain a control position.", cat: "Aircraft & systems" },
  { term: "Magneto", full: "", def: "An engine-driven device that supplies ignition spark independently of the aircraft's electrical system.", cat: "Aircraft & systems" },
  { term: "Carburetor ice", full: "", def: "Ice that can form inside a carburetor and reduce or stop engine power, even in warm weather.", cat: "Aircraft & systems" },
  { term: "Avionics", full: "", def: "The aircraft's electronic systems for communication, navigation, and flight management.", cat: "Aircraft & systems" },
  { term: "Glass cockpit", full: "", def: "A flight deck that uses electronic displays instead of individual mechanical instruments.", cat: "Aircraft & systems" },

  /* ---------------- Instruments & avionics ---------------- */
  { term: "Pitot-static system", full: "", def: "The system that supplies ram and static air pressure to the airspeed indicator, altimeter, and vertical speed indicator.", cat: "Instruments & avionics" },
  { term: "Altimeter", full: "", def: "An instrument that shows the aircraft's altitude based on atmospheric pressure.", cat: "Instruments & avionics" },
  { term: "ASI", full: "Airspeed Indicator", def: "An instrument that shows the aircraft's speed through the air.", cat: "Instruments & avionics" },
  { term: "VSI", full: "Vertical Speed Indicator", def: "An instrument that shows the rate of climb or descent in feet per minute.", cat: "Instruments & avionics" },
  { term: "Attitude indicator", full: "", def: "An instrument that displays the aircraft's pitch and bank relative to the horizon.", cat: "Instruments & avionics" },
  { term: "Heading indicator", full: "", def: "A gyroscopic instrument that displays the aircraft's magnetic heading.", cat: "Instruments & avionics" },
  { term: "Turn coordinator", full: "", def: "An instrument that shows the rate of turn and whether the turn is coordinated.", cat: "Instruments & avionics" },
  { term: "Transponder", full: "", def: "Equipment that replies to ATC radar with an identifying code and, with Mode C, the aircraft's altitude.", cat: "Instruments & avionics" },
  { term: "Squawk", full: "", def: "A four-digit transponder code assigned by ATC; 7500 means hijack, 7600 lost communications, 7700 emergency.", cat: "Instruments & avionics" },
  { term: "ADS-B", full: "Automatic Dependent Surveillance – Broadcast", def: "A system in which an aircraft broadcasts its GPS position; ADS-B Out is required in much controlled airspace.", cat: "Instruments & avionics" },
  { term: "TCAS", full: "Traffic Collision Avoidance System", def: "A system that detects nearby transponder-equipped traffic and advises maneuvers to avoid a collision.", cat: "Instruments & avionics" },
  { term: "EFB", full: "Electronic Flight Bag", def: "A tablet or device that holds charts, documents, and flight information in the cockpit.", cat: "Instruments & avionics" },
  { term: "FIS-B", full: "Flight Information Services – Broadcast", def: "Free weather and aeronautical information delivered to the cockpit over ADS-B.", cat: "Instruments & avionics" },

  /* ---------------- Communication & ATC ---------------- */
  { term: "ATC", full: "Air Traffic Control", def: "The service that separates, sequences, and provides information to aircraft.", cat: "Communication & ATC" },
  { term: "ARTCC", full: "Air Route Traffic Control Center", def: "A facility, called 'Center,' that controls aircraft en route between terminal areas.", cat: "Communication & ATC" },
  { term: "TRACON", full: "Terminal Radar Approach Control", def: "A facility that controls arriving and departing traffic around busier airports.", cat: "Communication & ATC" },
  { term: "FSS", full: "Flight Service Station", def: "A facility that provides weather briefings, accepts flight plans, and offers en route assistance.", cat: "Communication & ATC" },
  { term: "Clearance", full: "", def: "An authorization from ATC to proceed under specified conditions.", cat: "Communication & ATC" },
  { term: "Flight following", full: "", def: "Traffic advisories provided by ATC to VFR aircraft on request, workload permitting.", cat: "Communication & ATC" },
  { term: "Phonetic alphabet", full: "", def: "The Alfa, Bravo, Charlie spelling alphabet used to make letters clear over the radio.", cat: "Communication & ATC" },
  { term: "Hold short", full: "", def: "An instruction to stop and remain clear of a runway or other point.", cat: "Communication & ATC" },

  /* ---------------- Human factors ---------------- */
  { term: "Hypoxia", full: "", def: "A state of insufficient oxygen that impairs judgment and performance, increasingly likely at higher altitudes.", cat: "Human factors" },
  { term: "Hyperventilation", full: "", def: "Over-breathing that lowers carbon dioxide and can cause dizziness, sometimes mistaken for hypoxia.", cat: "Human factors" },
  { term: "Spatial disorientation", full: "", def: "A false sense of the aircraft's position or motion, especially dangerous when outside visual reference is lost.", cat: "Human factors" },
  { term: "Hazardous attitudes", full: "", def: "The five attitudes that lead to poor decisions: anti-authority, impulsivity, invulnerability, macho, and resignation.", cat: "Human factors" },
  { term: "Get-there-itis", full: "", def: "The hazardous urge to complete a flight as planned despite deteriorating conditions.", cat: "Human factors" },
  { term: "Sterile cockpit", full: "", def: "A practice of limiting non-essential conversation and activity during critical phases of flight.", cat: "Human factors" },
  { term: "CFIT", full: "Controlled Flight Into Terrain", def: "An accident in which an airworthy aircraft under the pilot's control is unintentionally flown into terrain.", cat: "Human factors" }
];

window.__AV_AIRPORT_SIGNS__ = [
  { id: "m1", kind: "mandatory", text: "9-27", name: "Runway holding position sign", means: "A runway is just ahead — here, Runway 9/27. It marks the exact spot you must hold short of.", action: "At a towered airport, stop and hold until ATC clears you to cross or enter. It always pairs with the holding-position markings painted on the taxiway." },
  { id: "m2", kind: "mandatory", text: "ILS", name: "ILS critical area holding position sign", means: "Marks where to hold so your aircraft won't disturb the ILS signal that other aircraft are using to land in low visibility.", action: "Hold here only when ATC instructs — usually while instrument approaches are in progress." },
  { id: "m3", kind: "mandatory", text: "24-APCH", name: "Runway approach holding position sign", means: "Holding here keeps you clear of the approach and departure area for Runway 24.", action: "Hold short when directed so you don't penetrate the protected approach path." },
  { id: "m4", kind: "noentry", text: "", name: "No-entry sign", means: "You may not enter this pavement — it's closed to aircraft, or it's one-way in the other direction.", action: "Do not proceed past it; use an authorized route instead." },
  { id: "l1", kind: "location", text: "B", name: "Taxiway location sign", means: "You are currently on Taxiway Bravo. Black background with a yellow letter and yellow border always means 'you are here.'", action: "Use it with your airport diagram to confirm exactly where you are." },
  { id: "d1", kind: "direction", text: "A", arrow: "right", name: "Taxiway direction sign", means: "Taxiway Alpha is the next pavement to your right. This is the classic 'turn here' sign.", action: "Turn right to taxi onto Taxiway A. Direction signs sit just before the intersection they describe." },
  { id: "d2", kind: "direction", text: "C", arrow: "left", name: "Taxiway direction sign", means: "Taxiway Charlie turns off to the left.", action: "Turn left onto Taxiway C when you reach the intersection." },
  { id: "s1", kind: "destination", text: "9-27", arrow: "upleft", name: "Runway destination sign", means: "Follow the arrow to reach Runways 9 and 27.", action: "Taxi in the arrow's direction — here, ahead and to the left — toward those runways." },
  { id: "s2", kind: "destination", text: "MIL", arrow: "right", name: "Destination sign", means: "Points the way to a destination on the field — in this case the military area.", action: "The same yellow style points to terminals, cargo ramps, FBOs, and international aprons." },
  { id: "r1", kind: "distance", text: "5", name: "Runway distance-remaining sign", means: "5,000 feet of runway remain. These signs count down in 1,000-foot increments along the runway.", action: "Use them on takeoff or landing to judge how much usable runway is left." },
  { id: "r2", kind: "distance", text: "2", name: "Runway distance-remaining sign", means: "2,000 feet of runway remain ahead.", action: "A fast visual check of remaining runway during the takeoff or landing roll." }
];

window.__AV_AIRPORT_MARKINGS__ = [
  { id: "k1", type: "hold", name: "Runway holding position marking", means: "The painted partner to the red holding-position sign: two solid lines plus two dashed lines. The solid lines are on the hold side.", action: "Approaching a runway, stop before the solid lines and hold. After exiting a runway you cross from the dashed side to clear it." },
  { id: "k2", type: "centerline", name: "Taxiway centerline & edge", means: "A continuous yellow centerline guides you along the taxiway; continuous double-yellow lines mark its edge.", action: "Keep the nosewheel tracking the centerline as you taxi." },
  { id: "k3", type: "threshold", name: "Displaced threshold", means: "White arrows lead to a solid white bar. The paved area before the bar is not usable for landing.", action: "You may taxi, take off, or roll out on it, but landing aircraft must touch down beyond the solid line." }
];

window.__AV_FLASHCARDS__ = [
  /* Foundations */
  { id: "f1", cert: "foundation", front: "The four forces acting on an airplane in flight", back: "Lift, weight, thrust, and drag." },
  { id: "f2", cert: "foundation", front: "What does ATIS stand for?", back: "Automatic Terminal Information Service - a continuous recorded broadcast of an airport's weather and operational information. Listen before you call the tower." },
  { id: "f3", cert: "foundation", front: "Standard sea-level pressure and temperature", back: "29.92 inches of mercury (1013.2 hPa) and 15 degrees Celsius." },
  { id: "f4", cert: "foundation", front: "How do you read a runway number?", back: "It is the runway's magnetic heading rounded to the nearest 10 degrees, with the last zero dropped. Runway 27 points about 270 degrees." },
  { id: "f5", cert: "foundation", front: "What is density altitude?", back: "Pressure altitude corrected for nonstandard temperature - the altitude the airplane 'feels.' High, hot, and humid conditions raise it and reduce performance." },
  { id: "f6", cert: "foundation", front: "VFR cruising altitude rule (more than 3,000 ft AGL)", back: "On a magnetic course of 0-179 degrees fly odd thousands + 500 ft; on 180-359 degrees fly even thousands + 500 ft." },
  { id: "f7", cert: "foundation", front: "What does a METAR report?", back: "A routine aviation weather report for an airport: wind, visibility, weather, clouds, temperature/dew point, and altimeter setting." },
  { id: "f8", cert: "foundation", front: "What are ailerons, elevator, and rudder?", back: "The three primary flight controls - ailerons control roll, the elevator controls pitch, and the rudder controls yaw." },

  /* Sport & Recreational */
  { id: "sp1", cert: "sport", front: "What can a sport pilot use in place of an FAA medical certificate?", back: "A valid U.S. driver's license (complying with its restrictions), provided the pilot has no knowledge of a medical condition that would make flight unsafe." },
  { id: "sp2", cert: "sport", front: "Can a sport pilot fly at night?", back: "No. Sport-pilot privileges are limited to day, VFR conditions." },
  { id: "sp3", cert: "sport", front: "How many passengers may a sport pilot carry?", back: "One. Light-sport aircraft are limited to two seats." },
  { id: "sp4", cert: "sport", front: "May a sport pilot fly in Class B, C, or D airspace?", back: "Yes, with the proper airspace endorsement and ATC communication; without it, operations are limited to airspace that does not require tower contact." },

  /* Private Pilot */
  { id: "p1", cert: "ppl", front: "Can a private pilot be paid to fly?", back: "No. A private pilot may not act as PIC for compensation or hire, but may share operating expenses pro rata with passengers." },
  { id: "p2", cert: "ppl", front: "Required aircraft documents - the 'ARROW' acronym", back: "Airworthiness certificate, Registration, Radio station license (international ops), Operating limitations, Weight and balance data." },
  { id: "p3", cert: "ppl", front: "What does the fitness check 'IMSAFE' stand for?", back: "Illness, Medication, Stress, Alcohol, Fatigue, Emotion (or Eating) - a personal go/no-go self-assessment." },
  { id: "p4", cert: "ppl", front: "VFR weather minimums in Class E below 10,000 ft MSL (day)", back: "3 statute miles visibility, and cloud clearance of 500 ft below, 1,000 ft above, and 2,000 ft horizontal." },
  { id: "p5", cert: "ppl", front: "Does a private pilot certificate expire?", back: "No. Acting as PIC requires a current medical certificate (if required) and a flight review within the preceding 24 calendar months." },
  { id: "p6", cert: "ppl", front: "Difference between VX and VY", back: "VX is the best angle of climb - most altitude gained per unit of distance, used to clear obstacles. VY is the best rate of climb - most altitude gained per unit of time." },
  { id: "p7", cert: "ppl", front: "Passenger-carrying recency of experience", back: "Three takeoffs and landings within the preceding 90 days in the same category and class (and type, if required); they must be to a full stop at night or in a tailwheel airplane." },

  /* Instrument */
  { id: "i1", cert: "instrument", front: "Instrument recency - what does '6 HITS' cover?", back: "Within the preceding 6 calendar months: 6 instrument approaches, Holding procedures, and Intercepting and Tracking courses - to remain current to file and fly IFR." },
  { id: "i2", cert: "instrument", front: "What is a clearance limit?", back: "The point to which an aircraft is cleared. It is often the destination, but can be a fix at which you must hold until receiving further clearance." },
  { id: "i3", cert: "instrument", front: "Best defense against spatial disorientation", back: "Trust the flight instruments rather than bodily sensations - in cloud, the vestibular system is easily and dangerously fooled." },
  { id: "i4", cert: "instrument", front: "Standard items of an IFR clearance - the 'CRAFT' acronym", back: "Clearance limit, Route, Altitude, Frequency (for departure), and Transponder code." },
  { id: "i5", cert: "instrument", front: "What is a standard-rate turn?", back: "A turn of 3 degrees per second - a complete 360-degree turn in two minutes. Also called a rate-one turn." },
  { id: "i6", cert: "instrument", front: "What is an MEA?", back: "Minimum En route Altitude - the lowest altitude on an airway segment that ensures obstacle clearance and acceptable navigation-signal reception." },

  /* Commercial */
  { id: "c1", cert: "commercial", front: "Commercial pilot - minimum total time (airplane, Part 61)", back: "250 hours total time, including specified cross-country, night, and instrument experience." },
  { id: "c2", cert: "commercial", front: "What is a 'high-performance' airplane?", back: "An airplane with an engine of more than 200 horsepower. A one-time endorsement is required to act as PIC." },
  { id: "c3", cert: "commercial", front: "What is a 'complex' airplane?", back: "An airplane with retractable landing gear, flaps, and a controllable-pitch propeller (for seaplanes: flaps and a controllable-pitch propeller)." },
  { id: "c4", cert: "commercial", front: "Does a commercial certificate by itself let you fly anything for hire?", back: "No. Many paid operations must be conducted under additional operating rules (such as Part 135 or 121); the certificate establishes pilot qualification, not the operation's authority." },

  /* ATP */
  { id: "a1", cert: "atp", front: "Minimum age for an unrestricted ATP certificate", back: "23 years old. A restricted ATP (R-ATP) is available at 21." },
  { id: "a2", cert: "atp", front: "ATP minimum total flight time (unrestricted, airplane)", back: "1,500 hours total time, with required cross-country, night, and instrument experience." },
  { id: "a3", cert: "atp", front: "What must you complete before the multiengine ATP knowledge test?", back: "The ATP Certification Training Program (ATP-CTP)." },

  /* Remote / Part 107 */
  { id: "r1", cert: "remote", front: "Maximum groundspeed of a small UAS under Part 107", back: "100 mph (87 knots)." },
  { id: "r2", cert: "remote", front: "Maximum altitude under Part 107", back: "400 feet AGL - or within 400 feet of a structure when flying above that structure." },
  { id: "r3", cert: "remote", front: "Minimum flight visibility for Part 107 operations", back: "3 statute miles from the control station." },
  { id: "r4", cert: "remote", front: "Weight limit for a 'small' unmanned aircraft", back: "Less than 55 pounds, including everything on board at the time of takeoff." },
  { id: "r5", cert: "remote", front: "Can you fly a Part 107 drone at night?", back: "Yes. Since the 2021 rule update, night operations are allowed if the aircraft has anti-collision lighting visible for 3 statute miles and the remote pilot has completed the updated training." },
  { id: "r6", cert: "remote", front: "What governs flying a drone over people?", back: "The Operations Over People rules (Categories 1-4). You generally may not fly over people who are not participating and are not under a covered structure unless your operation meets a category's requirements." },

  /* Glider & Balloon */
  { id: "g1", cert: "glider", front: "What is 'best glide' speed used for?", back: "The airspeed that yields the greatest distance per unit of altitude lost - it maximizes glide range (the best lift-to-drag ratio)." },
  { id: "g2", cert: "glider", front: "What is a thermal?", back: "A rising column of warm air. Glider pilots circle within thermals to gain altitude without an engine." },
  { id: "b1", cert: "balloon", front: "How does a hot-air balloon climb and descend?", back: "Heating the air in the envelope makes it less dense than the surrounding air, creating lift to climb; venting or letting it cool causes a descent." },
  /* ---- Foundations: airport operations & protocol ---- */
  { id: "f9", cert: "foundation", front: "What must you read back to ATC at a towered airport?", back: "All runway hold-short instructions, plus any clearance to cross, line up and wait, take off, or land - along with your call sign." },
  { id: "f10", cert: "foundation", front: "What is a 'non-movement area'?", back: "The ramp/apron, marked by a solid-and-dashed yellow boundary line. You may move there without ATC clearance; taxiways and runways (the movement area) require a clearance at towered fields." },
  { id: "f11", cert: "foundation", front: "What is a runway 'hot spot' (HS)?", back: "A spot on the airport diagram flagged for a history of confusion or runway incursions. Give it extra attention." },
  { id: "f12", cert: "foundation", front: "At a non-towered airport, what frequency do you use?", back: "The CTAF (Common Traffic Advisory Frequency). Monitor it and self-announce your position and intentions, e.g., 'entering left downwind, runway 18.'" },
  { id: "f13", cert: "foundation", front: "Standard traffic pattern direction and altitude", back: "Left turns unless right traffic is published, and typically 1,000 ft AGL. The legs after upwind are crosswind, downwind, base, and final." },
  { id: "f14", cert: "foundation", front: "What should you do if you are unsure of your position while taxiing?", back: "Stop, hold your position, and ask ATC (or self-announce) for help. Never guess, and never cross hold lines without a clearance." },
  { id: "f15", cert: "foundation", front: "Tower light-gun signal: a steady green light", back: "On the ground it means cleared for takeoff; in the air it means cleared to land. Light signals are used if radios fail." },
  { id: "f16", cert: "foundation", front: "What is the purpose of the airport beacon (rotating beacon)?", back: "It marks the airport's location at night; a lighted beacon operating during the day at a Class B/C/D field generally means the field is below VFR minimums (ceiling under 1,000 ft or visibility under 3 SM)." },

  /* ---- Sport (expanded) ---- */
  { id: "sp5", cert: "sport", front: "What kinds of aircraft can a sport pilot fly?", back: "Light-sport aircraft (LSA): airplanes, gliders, gyroplanes, weight-shift-control trikes, powered parachutes, and lighter-than-air - each within LSA limits." },
  { id: "sp6", cert: "sport", front: "Does a sport pilot need a flight review?", back: "Yes. Like all pilots, a sport pilot must complete a flight review every 24 calendar months to act as PIC." },
  { id: "sp7", cert: "sport", front: "May a sport pilot fly cross-country?", back: "Yes. Cross-country flight using charts, pilotage, and dead reckoning is part of sport-pilot training and privileges." },

  /* ---- Multi-Engine & Seaplane (class) ---- */
  { id: "cl1", cert: "class", front: "What is VMC?", back: "Minimum control speed - the slowest airspeed at which directional control can be maintained with the critical engine inoperative and full power on the good engine. It is the red radial line on the airspeed indicator." },
  { id: "cl2", cert: "class", front: "What is the 'critical engine'?", back: "The engine whose failure most adversely affects performance and handling. On a conventional twin (both propellers turning clockwise), it is the left engine, due to P-factor and the descending propeller blade." },
  { id: "cl3", cert: "class", front: "What is VYSE (the 'blue line')?", back: "Best rate-of-climb speed with one engine inoperative. Flying the blue line gives the best single-engine climb performance." },
  { id: "cl4", cert: "class", front: "After an engine failure in a twin, how do you identify the dead engine?", back: "'Dead foot, dead engine' - the airplane yaws toward the failed engine, so the foot not holding rudder pressure points to it. Identify, verify, then feather that propeller." },
  { id: "cl5", cert: "class", front: "Seaplane: displacement taxi vs. step taxi", back: "Displacement (plow) taxi is slow with the hull deep in the water; step taxi is faster, up on the planing step. The step is the planing position used for takeoff." },
  { id: "cl6", cert: "class", front: "Seaplane: why is glassy water dangerous to land on?", back: "A glassy surface removes height and depth cues, making the water hard to judge. Pilots use a known pitch attitude and descent rate and fly the airplane onto the surface." },
  { id: "cl7", cert: "class", front: "Seaplane: what rules apply on the water?", back: "On the water a seaplane is treated as a vessel and follows nautical right-of-way (navigation) rules. A water rudder and sailing technique help maneuver at low speed." },

  /* ---- Flight Instructor (CFI) ---- */
  { id: "ci1", cert: "cfi", front: "What are the 'fundamentals of instructing' (FOI)?", back: "The knowledge every instructor needs: how people learn, human behavior and motivation, effective communication, the teaching process, assessment, and instructor responsibilities and professionalism." },
  { id: "ci2", cert: "cfi", front: "What is the 'law of primacy'?", back: "What is learned first is learned best and is hardest to change. Teach it correctly the first time, because un-teaching a bad habit is hard." },
  { id: "ci3", cert: "cfi", front: "What are the levels of learning?", back: "Rote, Understanding, Application, and Correlation. Correlation - associating the new knowledge with other learned material - is the goal." },
  { id: "ci4", cert: "cfi", front: "What special endorsement is required to earn an airplane CFI certificate?", back: "A one-time endorsement certifying training on stall awareness, spin entry, spins, and spin recovery." },
  { id: "ci5", cert: "cfi", front: "What does an instructor's endorsement signify?", back: "That the instructor certifies a person meets requirements - for solo, for a knowledge test, or for a practical test. Endorsements carry legal responsibility." },
  { id: "ci6", cert: "cfi", front: "How often must a student pilot's solo endorsement be renewed?", back: "Every 90 days, along with a make-and-model endorsement, before a student may continue to solo." },
  { id: "ci7", cert: "cfi", front: "What is the demonstration-performance teaching method?", back: "The instructor explains and demonstrates a skill, the student performs it, and the instructor evaluates and corrects - widely used for flight maneuvers." },

  /* ---- Commercial (expanded) ---- */
  { id: "c5", cert: "commercial", front: "Which precision maneuvers does commercial training add?", back: "Chandelles, lazy eights, eights-on-pylons, steep spirals, and power-off 180-degree accuracy landings, among others." },
  { id: "c6", cert: "commercial", front: "What is a chandelle?", back: "A maximum-performance 180-degree climbing turn that finishes wings-level just above a stall - the goal is the greatest altitude gain for the maneuver." },
  { id: "c7", cert: "commercial", front: "What is a lazy eight?", back: "Two opposing 180-degree turns with continuously changing pitch and bank, the nose tracing a symmetrical pattern about a point on the horizon. It develops smooth, coordinated control." },

  /* ---- ATP (expanded) ---- */
  { id: "a4", cert: "atp", front: "What is a Restricted ATP (R-ATP)?", back: "An ATP issued with lower total-time minimums to qualifying applicants - for example, graduates of approved degree programs (around 1,000-1,250 hours) and qualifying military pilots (around 750 hours)." },
  { id: "a5", cert: "atp", front: "When is a type rating required?", back: "To act as PIC of a turbojet-powered airplane, or any aircraft with a maximum takeoff weight over 12,500 pounds." },
  { id: "a6", cert: "atp", front: "Under which rule do U.S. scheduled airlines operate?", back: "Part 121, with multi-pilot crews, dispatch, and strict crew rest and duty-time limits." },

  /* ---- Gyroplane ---- */
  { id: "gy1", cert: "gyro", front: "How does a gyroplane stay airborne?", back: "Its rotor is unpowered in flight and autorotates - air flowing up through the disc keeps it spinning - while a separate engine and propeller provide forward thrust. It cannot hover." },
  { id: "gy2", cert: "gyro", front: "What is 'prerotation'?", back: "Spinning the rotor up to flight RPM on the ground before takeoff, after which the gyroplane accelerates until the rotor makes enough lift to fly." },
  { id: "gy3", cert: "gyro", front: "Why are low-G pushovers dangerous in a gyroplane?", back: "Unloading the rotor (low or zero G) reduces airflow through the disc and rotor RPM, which can lead to loss of control or a 'bunt-over.' Avoid abrupt forward stick." },
  { id: "gy4", cert: "gyro", front: "What certificate is needed to fly a gyroplane?", back: "Gyroplanes are a class within the rotorcraft category; a sport-pilot certificate (or higher) with a gyroplane rating is required." },

  /* ---- Powered-Lift & eVTOL ---- */
  { id: "pl1", cert: "poweredlift", front: "What defines a powered-lift aircraft?", back: "It takes off and lands vertically or short on engine-driven lift like a helicopter, but cruises on a wing like an airplane - for example the V-22 and many eVTOLs." },
  { id: "pl2", cert: "poweredlift", front: "What is the most critical phase of powered-lift flight?", back: "The transition between vertical (rotor-borne) and forward (wing-borne) flight, where the source of lift shifts." },
  { id: "pl3", cert: "poweredlift", front: "How is powered-lift treated for certification?", back: "Powered-lift is its own FAA aircraft category, with dedicated pilot-certification and operating rules established for it and for advanced air mobility." },
  { id: "pl4", cert: "poweredlift", front: "What is an eVTOL?", back: "An electric vertical-takeoff-and-landing aircraft. Most use distributed electric propulsion and are aimed at short urban and regional air-mobility flights." },

  /* ---- Weight-Shift (Trike) ---- */
  { id: "ws1", cert: "weightshift", front: "How is a weight-shift-control trike flown?", back: "By moving a control bar attached to the wing, which shifts the carriage's weight and changes the wing's attitude. There are no ailerons, elevator, or rudder." },
  { id: "ws2", cert: "weightshift", front: "What kind of wing does a trike use?", back: "A flexible, hang-glider-style wing from which the powered carriage hangs. Control comes from changing the wing's angle relative to the weight below it." },
  { id: "ws3", cert: "weightshift", front: "What certificate is needed for a weight-shift-control aircraft?", back: "Weight-shift-control is a light-sport category; a sport pilot (or higher) with a weight-shift-control rating is required." },
  { id: "ws4", cert: "weightshift", front: "What are a sport-level trike pilot's basic limits?", back: "Day VFR, one passenger, and limited airspace without the proper endorsement - the same core limits as other sport-pilot operations." },

  /* ---- Powered Parachute ---- */
  { id: "pc1", cert: "poweredchute", front: "What is a powered parachute?", back: "A wheeled (or float) carriage with a motor and propeller that flies beneath a ram-air parachute wing - one of the simplest powered aircraft to fly." },
  { id: "pc2", cert: "poweredchute", front: "How do you control a powered parachute?", back: "Throttle controls climb and descent; foot steering bars pull down the trailing edge of the wing to turn. Airspeed is essentially fixed - there is no separate pitch control." },
  { id: "pc3", cert: "poweredchute", front: "What weather suits a powered parachute?", back: "Light, calm wind - usually early morning or late evening. They are very wind-sensitive and limited to day VFR." },
  { id: "pc4", cert: "poweredchute", front: "What certificate is needed for a powered parachute?", back: "Powered parachute is a light-sport category; a sport pilot (or higher) with a powered-parachute rating is required." },

  /* ---- Glider (expanded) ---- */
  { id: "g3", cert: "glider", front: "How are gliders launched?", back: "Most commonly by aerotow (towed aloft behind a powerplane), by ground/winch launch, or by auto tow." },
  { id: "g4", cert: "glider", front: "Besides thermals, what lift do glider pilots use?", back: "Ridge lift (wind deflected upward along a slope) and mountain wave (standing waves of rising air downwind of a ridge)." },
  { id: "g5", cert: "glider", front: "What emergency do glider pilots train for on tow?", back: "A premature release or rope break. The pilot's options depend on altitude - land straight ahead, turn back to the runway, or maneuver to a landing area." },

  /* ---- Balloon (expanded) ---- */
  { id: "b2", cert: "balloon", front: "How does a balloon pilot 'steer'?", back: "By changing altitude to find winds blowing in different directions. A balloon cannot be steered directly." },
  { id: "b3", cert: "balloon", front: "What are the main parts of a hot-air balloon?", back: "The envelope (the fabric canopy), the burner (which heats the air), and the basket or gondola (which carries the occupants and fuel)." },
  { id: "b4", cert: "balloon", front: "When are balloons usually flown?", back: "In light winds, typically early morning or in the evening when the air is stable and surface winds are calm." },
];
