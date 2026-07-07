/* AvHype Aviation Education — reference extras, WAVE 2
   Adds more pilot lingo/slang to the glossary and more commonly-mispronounced
   terms to the pronunciation guide. These CONCAT onto whatever the earlier
   reference + reference-extra files already placed on window.
   Pure data (JSON-serializable). No functions, no inner unescaped double quotes. */
(function () {
  var moreLingo = [
    { term: "Hangar flying", cat: "Lingo & Slang", def: "Swapping flying stories and 'what would you do' scenarios on the ground, usually around the hangar. Great informal learning, but no substitute for real training." },
    { term: "Chair flying", cat: "Lingo & Slang", def: "Mentally rehearsing a flight or maneuver from a chair, touching imaginary controls and calling out each step. A proven way to lock in procedures before you fly." },
    { term: "Steam gauges", cat: "Lingo & Slang", def: "Traditional round analog instruments (the classic 'six-pack'), as opposed to a digital glass cockpit. Named for their old mechanical look." },
    { term: "Glass cockpit", cat: "Lingo & Slang", def: "A panel built around digital displays (like the Garmin G1000) instead of individual round dials, showing attitude, navigation, and engine data on screens." },
    { term: "Spam can", cat: "Lingo & Slang", def: "Affectionate slang for a common mass-produced metal airplane such as a Cessna 172 or Piper Cherokee. Contrast with experimental or fabric aircraft." },
    { term: "CAVU / Severe clear", cat: "Lingo & Slang", def: "CAVU means Ceiling And Visibility Unlimited: a wide-open, gorgeous sky. 'Severe clear' is the joking pilot version of the same idea." },
    { term: "Pucker factor", cat: "Lingo & Slang", def: "Slang for how tense or nerve-wracking a moment was. A high 'pucker factor' means it got your full attention." },
    { term: "Kick the tires (and light the fires)", cat: "Lingo & Slang", def: "Old-school slang for getting going fast. In real life you still do a full preflight and run-up first, never actually skip checks." },
    { term: "Rotate", cat: "Lingo & Slang", def: "The takeoff callout at lift-off speed (Vr) when you smoothly pull back to raise the nosewheel and begin flying." },
    { term: "Run-up", cat: "Lingo & Slang", def: "The pre-takeoff engine check done in the run-up area: set power, check magnetos, carb heat, gauges, and controls before taking the runway." },
    { term: "Squawk VFR", cat: "Lingo & Slang", def: "ATC instruction to set transponder code 1200, the standard VFR code in the U.S. 'Squawk' refers to your transponder code." },
    { term: "Ident", cat: "Lingo & Slang", def: "ATC asking you to press the IDENT button on the transponder, which flashes your target on their scope so they can positively identify you." },
    { term: "Unable", cat: "Lingo & Slang", def: "The proper one-word reply when you cannot comply with an ATC instruction. Clear, professional, and expected, so never hesitate to say it." },
    { term: "Say again", cat: "Lingo & Slang", def: "Radio phrase meaning 'repeat your last transmission.' Use it instead of 'what?' when you miss or did not understand a call." },
    { term: "Stand by", cat: "Lingo & Slang", def: "ATC or you saying 'wait a moment.' It is not a clearance or approval, just a request to hold for a follow-up." },
    { term: "Zero-zero", cat: "Lingo & Slang", def: "Conditions with essentially zero ceiling and zero visibility, like thick fog. 'Zero-zero' weather is a hard no-go for VFR flight." },
    { term: "Hotspot", cat: "Lingo & Slang", def: "A marked spot on an airport diagram with a history of confusion or runway-incursion risk. Give it extra attention when taxiing through." },
    { term: "Prop wash", cat: "Lingo & Slang", def: "The turbulent stream of air blown back by a propeller, strong enough to rock a small plane parked behind another, and definitely not the cleaning product the old prank refers to." },
    { term: "Full stop / Stop-and-go", cat: "Lingo & Slang", def: "Full stop means land and taxi clear. Stop-and-go means land, come to a complete stop on the runway, then take off again. Both differ from a touch-and-go." },
    { term: "Pickle", cat: "Lingo & Slang", def: "Slang (mostly military) for pressing the release button to drop something, or in trainers to disconnect. In GA you will hear it jokingly for 'punch the button.'" },
    { term: "Sterile cockpit", cat: "Lingo & Slang", def: "A discipline of no non-essential talk or distractions during critical phases (taxi, takeoff, approach, landing). Borrowed from the airlines for safety." },
    { term: "Flameout", cat: "Lingo & Slang", def: "When a running engine quits, classically a turbine losing combustion, but used loosely for any in-flight engine stoppage." },
    { term: "Hot start", cat: "Lingo & Slang", def: "A tricky engine start (especially fuel-injected or turbine) when residual heat makes the engine hard to light without flooding or over-temping." },
    { term: "The impossible turn", cat: "Lingo & Slang", def: "The risky attempt to turn back to the runway after an engine failure right after takeoff. Often unsurvivable at low altitude, so the safer plan is usually to land mostly straight ahead." },
    { term: "Wake turbulence", cat: "Lingo & Slang", def: "Invisible, powerful wingtip vortices trailing behind an aircraft, strongest from heavy, slow, clean jets. Stay above and upwind of a preceding heavy's path." },
    { term: "Read back / Hear back", cat: "Lingo & Slang", def: "You repeat (read back) an ATC clearance so the controller can confirm (hear back) you got it right. Required for runway and altitude assignments." }
  ];

  var morePron = [
    { term: "Pirep", say: "PYE-rep", cat: "Weather & airport", tip: "A pilot report of actual conditions aloft. Two syllables: PYE-rep, not 'pee-rep'." },
    { term: "Sigmet", say: "SIG-met", cat: "Weather & airport", tip: "Significant Meteorological advisory for hazards like severe turbulence or icing. Hard G: SIG-met." },
    { term: "Airmet", say: "AIR-met", cat: "Weather & airport", tip: "Airmen's Meteorological advisory for less severe but still important weather. AIR-met." },
    { term: "Cumulonimbus", say: "kew-myoo-loh-NIM-bus", cat: "Weather & airport", tip: "The towering thunderstorm cloud. Stress the NIM." },
    { term: "Stratus", say: "STRAT-us", cat: "Weather & airport", tip: "Flat, layered cloud. STRAT-us, rhymes with 'flat us'." },
    { term: "Lenticular", say: "len-TIK-yoo-ler", cat: "Weather & airport", tip: "The lens-shaped mountain-wave cloud. Stress the TIK." },
    { term: "Adiabatic", say: "ay-dee-uh-BAT-ik", cat: "Weather & airport", tip: "Temperature change from expanding or compressing air with no heat added. Stress the BAT." },
    { term: "Isobar", say: "EYE-soh-bar", cat: "Weather & airport", tip: "A line of equal pressure on a weather chart. EYE-soh-bar." },
    { term: "Tropopause", say: "TROH-puh-pawz", cat: "Weather & airport", tip: "The boundary between the troposphere and stratosphere. TROH-puh-pawz." },
    { term: "Orographic", say: "or-uh-GRAF-ik", cat: "Weather & airport", tip: "Lift caused by terrain forcing air upward. Stress the GRAF." },
    { term: "Stabilator", say: "STAB-ih-lay-ter", cat: "Airframe & structure", tip: "A one-piece movable horizontal tail that combines stabilizer and elevator. STAB-ih-lay-ter." },
    { term: "Flaperon", say: "FLAP-er-on", cat: "Airframe & structure", tip: "A surface that acts as both flap and aileron. FLAP-er-on." },
    { term: "Vortices", say: "VOR-tih-seez", cat: "Airframe & structure", tip: "Plural of vortex. Ends in -seez: VOR-tih-seez, not 'vor-tiss-ess'." },
    { term: "Detonation", say: "det-uh-NAY-shun", cat: "Systems & instruments", tip: "Uncontrolled, damaging combustion 'knock' in the engine. det-uh-NAY-shun." },
    { term: "Mach", say: "mock", cat: "Speeds, nav & medical", tip: "Speed relative to the speed of sound. Said 'mock,' not 'match' or 'mack.'" },
    { term: "Azimuth", say: "AZ-ih-muth", cat: "Speeds, nav & medical", tip: "A horizontal bearing or direction angle. AZ-ih-muth." },
    { term: "Isogonic", say: "eye-suh-GON-ik", cat: "Speeds, nav & medical", tip: "Lines of equal magnetic variation on a chart. eye-suh-GON-ik." },
    { term: "Hyperventilation", say: "HY-per-ven-tih-LAY-shun", cat: "Speeds, nav & medical", tip: "Over-breathing that blows off too much CO2. Slow your breathing to recover." },
    { term: "Barotrauma", say: "BAR-oh-traw-muh", cat: "Speeds, nav & medical", tip: "A pressure injury to ears or sinuses from climbing or descending. BAR-oh-traw-muh." },
    { term: "Valsalva", say: "val-SAL-vuh", cat: "Speeds, nav & medical", tip: "Gently clearing your ears by pinching the nose and blowing softly. val-SAL-vuh." },
    { term: "Coriolis", say: "kor-ee-OH-lis", cat: "Speeds, nav & medical", tip: "The tumbling vestibular illusion from head movement during a turn. kor-ee-OH-lis." },
    { term: "Vestibular", say: "ves-TIB-yoo-ler", cat: "Speeds, nav & medical", tip: "Your inner-ear balance system, the source of many spatial illusions. ves-TIB-yoo-ler." },
    { term: "Rotax", say: "ROH-taks", cat: "Aircraft & engine makers", tip: "Austrian engine maker common in light-sport aircraft. ROH-taks." },
    { term: "Socata", say: "soh-kah-TAH", cat: "Aircraft & engine makers", tip: "French builder of the TB and TBM line, now part of Daher. soh-kah-TAH." },
    { term: "Tecnam", say: "TEK-nahm", cat: "Aircraft & engine makers", tip: "Italian light-aircraft manufacturer. TEK-nahm." },
    { term: "Continental", say: "kon-tih-NEN-tul", cat: "Aircraft & engine makers", tip: "Major piston-engine maker alongside Lycoming. kon-tih-NEN-tul." },
    { term: "Hartzell", say: "HART-zell", cat: "Aircraft & engine makers", tip: "Well-known propeller manufacturer. HART-zell." },
    { term: "McCauley", say: "muh-KAW-lee", cat: "Aircraft & engine makers", tip: "Propeller manufacturer affiliated with Cessna. muh-KAW-lee." },
    { term: "Daher", say: "dah-AIR", cat: "Aircraft & engine makers", tip: "French aerospace firm that builds the TBM and Kodiak. dah-AIR." }
  ];

  window.__AV_GLOSSARY__ = (window.__AV_GLOSSARY__ || []).concat(moreLingo);
  window.__AV_PRONUNCIATION__ = (window.__AV_PRONUNCIATION__ || []).concat(morePron);
})();
