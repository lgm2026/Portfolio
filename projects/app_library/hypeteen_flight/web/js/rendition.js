/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* THIS RENDITION - written by tools/new_rendition.py from preset.json.
   Deep-merged over js/config.js. Edit here (or edit the preset and run the tool again). */
window.CONFIG_MERGE(window.CONFIG, {
  "id": "hfq",
  "name": "FLIGHT ACADEMY",
  "subtitle": "HYPETEEN",
  "tagline": [
    "LEARN",
    "EXPLORE",
    "FLY"
  ],
  "blurb": "The companion academy to the HypeTeen Flight Academy books: ground school, aircraft, airports, real places to visit and runway games for cadets 10–14.",
  "welcome": [
    "**Cadets** enroll with a made-up call sign and a 4-digit PIN.",
    "**Parents:** enroll first. The first cadet on a device is the Family Lead."
  ],
  "startLabel": "► CLEARED TO ENTER",
  "readyText": "READY ON THE RAMP.",
  "pageTitle": "HypeTeen Flight Academy",
  "a11yLabel": "HypeTeen Flight Academy. The walkable airfield is drawn on a canvas. For screen-reader friendly menus, use the Academy Hub: Settings, Academy Hub mode.",
  "font": {"family": "Rubik", "google": null, "local": "css/fonts.css"},
  "theme": {
      "_note": "HypeTeen Flight Academy palette (r7): midnight navy #10263D, deep airfield blue #183B5A, warm brass #B88C35, cream #F2E7CB, slate #657889. FAA airfield signs, markings and lights in the world keep their standard colors (AC 150/5340-18, AC 150/5340-30).",
      "bg": "#0D1F33",
      "bgGlow": "#183B5A",
      "panel": "rgba(16,38,61,.98)",
      "card": "rgba(24,59,90,.92)",
      "cardPress": "#22507A",
      "ink": "#F7F1E3",
      "sub": "#E2D6BA",
      "dim": "#A9B6C3",
      "faint": "#7D8D9C",
      "accent": "#B88C35",
      "accentHi": "#D9B25E",
      "accentLo": "#9C7428",
      "accentText": "#E6C477",
      "onAccent": "#10263D",
      "title": "#F2E7CB",
      "titleGold": "#E9C77A",
      "good": "#5FD38D",
      "bad": "#FF6B5B",
      "info": "#86B8FF",
      "warn": "#F2C14E",
      "btn": "#14304D",
      "btnHi": "#1C3F63",
      "btnLine": "rgba(242,231,203,.18)",
      "danger": "#C8102E",
      "dangerHi": "#DC1F3C",
      "dangerLine": "rgba(255,255,255,.55)",
      "dangerInk": "#FFFFFF",
      "success": "#123D2B",
      "successHi": "#18503A",
      "successLine": "rgba(95,211,141,.6)",
      "successInk": "#C9F3DA",
      "key": "#14304D",
      "keyNum": "#1A3A5C",
      "keySpecial": "#102841",
      "keyPress": "#2A5682"
  },

  "assets": [
    {
      "name": "logo",
      "src": "assets/brand/htfa_emblem.webp"
    }
  ],
  "logo": "logo",
  "accounts": {
    "enabled": true,
    "guest": true,
    "photo": false,
    "nameLabel": "YOUR CALL SIGN",
    "nameMax": 16
  },
  "homeScene": "world",
  "settingsToggles": [
    {"id": "voice", "label": "TOWER VOICE", "def": true}
  ],
  "words": {
    "login": "SIGN IN",
    "loginSub": "CALL SIGN + PIN",
    "signup": "ENROLL",
    "signupSub": "NEW CADETS START HERE",
    "guest": "VISIT AS GUEST",
    "guestSub": "LOOK AROUND FIRST",
    "pickName": "WHO’S FLYING TODAY?",
    "newAccount": "+ ENROLL A NEW CADET",
    "nameHint": "ONE WORD, LIKE A REAL CALL SIGN. MAKE IT UP, NOT YOUR REAL NAME",
    "suggest": "GIVE ME A FUN ONE",
    "welcome": "WELCOME ABOARD, ",
    "welcomeBack": "WELCOME BACK, ",
    "logout": "SIGN OUT",
    "loggedOut": "SIGNED OUT - BLUE SKIES",
    "deleteAcct": "REMOVE THIS CADET",
    "owner": "FAMILY LEAD",
    "points": "XP",
    "guestName": "GUEST CADET",
    "exit": "EXIT"
  },
  "dashTitle": "FLIGHT BAG",
  "cards": [
    {
      "id": "path",
      "label": "FLIGHT PATH",
      "sub": "YOUR COURSE",
      "icon": "road",
      "scene": "path"
    },
    {
      "id": "gs",
      "label": "GROUND SCHOOL",
      "sub": "56 UNITS",
      "icon": "docs",
      "scene": "groundschool"
    },
    {
      "id": "practice",
      "label": "PRACTICE HUB",
      "sub": "FLASHCARDS • TRIVIA • DRILLS",
      "icon": "cards",
      "scene": "practice"
    },
    {
      "id": "library",
      "label": "THE LIBRARY",
      "sub": "THE SERIES + 32 BOOKS",
      "icon": "book",
      "scene": "library"
    },
    {
      "id": "record",
      "label": "FLIGHT RECORD",
      "sub": "LEARNED • DID • NEXT",
      "icon": "docs",
      "scene": "record"
    },
    {
      "id": "explorer",
      "label": "EXPLORER",
      "sub": "REAL PLACES TO VISIT",
      "icon": "map",
      "scene": "explorer"
    },
    {
      "id": "logbook",
      "label": "MY LOGBOOK",
      "sub": "PHASES + BADGES",
      "icon": "trophy",
      "scene": "logbook"
    },
    {
      "id": "flightlog",
      "label": "FLIGHT LOG",
      "sub": "EVERY FLIGHT",
      "icon": "cal",
      "scene": "flightlog"
    },
    {
      "id": "locker",
      "label": "MY LOCKER",
      "sub": "YOUR LOOK",
      "icon": "user",
      "scene": "locker"
    },
    {
      "id": "board",
      "label": "HANGAR NEWS",
      "sub": "ANNOUNCEMENTS",
      "icon": "megaphone",
      "scene": "board"
    },
    {
      "id": "hangar",
      "label": "MY HANGAR",
      "sub": "MY AIRCRAFT",
      "icon": "plane",
      "scene": "fleet"
    },
    {
      "id": "aircraft",
      "label": "AIRCRAFT",
      "sub": "THE GALLERY",
      "icon": "search",
      "scene": "fleet",
      "args": {"gallery": true}
    },
    {
      "id": "radio",
      "label": "CALL THE TOWER",
      "sub": "WEATHER + RADIO",
      "icon": "headset",
      "scene": "radio"
    },
    {
      "id": "squadron",
      "label": "CREW BOARD",
      "sub": "KUDOS + CADETS",
      "icon": "roster",
      "scene": "crew"
    },
    {
      "id": "games",
      "label": "GAMES",
      "sub": "27 TO PLAY",
      "icon": "joy",
      "scene": "games"
    },
    {
      "id": "tutorial",
      "label": "TUTORIAL",
      "sub": "YOUR FIRST BRIEFING",
      "icon": "chat",
      "scene": "tutorial"
    },
    {
      "id": "about",
      "label": "ABOUT",
      "sub": "FOR FAMILIES",
      "icon": "info",
      "page": "about"
    }
  ],
  "pages": {
    "about": {
      "title": "ABOUT",
      "body": [
        "# HYPETEEN FLIGHT ACADEMY",
        "HypeTeen Flight Academy is the companion app to the seven-book HypeTeen Flight Academy series. Cadets explore a walkable airfield, meet the crew and work through real ground school one short lesson at a time, read the books for free in the Library, and keep a Flight Record of what they learned and did.",
        "# TWO WAYS AROUND",
        "The WALKABLE AIRFIELD is the default: drag anywhere on the floor to walk (a thumb-stick appears under your finger), and when a person or a station is in reach it glows and USE lights up. The round MAP button shows the whole field. The ACADEMY HUB, switched on in Settings, is the direct way: every lesson, game, book, place and tool one tap away, with search, and built to work with screen readers and keyboards. Both reach exactly the same lessons, scores, badges and records; switching never changes progress.",
        "# THE FLIGHT PATH",
        "The whole course in one line, unit by unit: lessons (a briefing, tap-only challenges, a takeoff and a landing), a Library book, a game that practices it, a timed drill and the checkride. Units unlock in order. Already know one? TEST OUT with 10 questions, two tries a day, no retries of the same test. Mastery per unit: BRONZE (every lesson done, or tested out), SILVER (the checkride, which earns the unit patch), GOLD (a perfect drill and the unit's book quizzes).",
        "# GROUND SCHOOL",
        "56 units and 512 lessons, from a discovery flight to private pilot and beyond. A wrong answer gets a clue from your instructor first (which briefing card to look back at), then a closer clue, then the answer and the why; SHOW ME skips straight to it, and the question comes back at the end of the flight. HINT gives the first two clues before you answer. Cadets start in the CLASSROOM, and their desk always picks up where they left off.",
        "# THE LIBRARY",
        "All seven HypeTeen Flight Academy books, free to read start to finish in a real e-reader: chapters, bookmarks, your place kept, text size, serif or sans, night, sepia or day pages, and everything offline once a book has been opened. The Ground School Notes at the end of each book link to the academy units they belong to. The Library also holds 32 short ground school books on seven shelves, each with a quiz that counts toward GOLD. Nothing in the academy is ever locked behind a book.",
        "# THE PRACTICE HUB",
        "For affirming what you know: flashcards for every unit, timed Flight Trivia, drills, and HANGAR FLYING, where every missed question comes back until it is right. Practice never pretends to be mastery: only lessons, checkrides and quizzes change a cadet's tiers.",
        "# GAMES + AIRCRAFT",
        "Twenty-seven games. The learning games live where they belong on the airfield (the Tower's radio and weather games, the Runway, the Parking Stand, the Wash Rack, the Platform, the Classroom), the just-for-fun ones fill the GAME ROOM off the Lounge, and the GAMES directory in the Hub lists all of them with what each practices, how long it takes and your best. Game XP is capped each day so lessons always earn the most.",
        "Every cadet picks a trainer from the six most common training airplanes, then unlocks more aircraft through the academy phases. The HALL OF FLIGHT adds aviation history: name an aircraft in Plane Spotter and it joins the cadet's hangar.",
        "# THE EXPLORER",
        "A map and a directory of real aviation places to visit across the United States, Canada and Mexico: museums, historic airfields, spaceflight centers, pioneers' homes and memorials, each with its story, a learning card, a reflection question, how to get in, how to stay safe and where the facts came from. It is a checked starter set, not every aviation place on the continent, and it works offline. Visiting earns no XP and no badge: the academy never needs a trip.",
        "# THE FLIGHT RECORD",
        "WHAT I LEARNED is recorded by the app: lessons, checkrides, quizzes, badges, with dates. WHAT I DID is the cadet's own: passenger flights, discovery flights, lessons, museums, airshows, aircraft spotted, with optional photos and notes, always marked SELF-REPORTED and never mixed up with the verified record. WHAT'S NEXT lists topics to practice and the cadet's own goals. Simulated time is never real flight time; checkrides here are practice; nothing in the app grants a real certificate or rating.",
        "# CALL THE TOWER",
        "The radio starts with the ATIS weather, then real radio calls to ground and tower, built by tapping (no typing, and nothing is sent anywhere). The tower answers in the phone's own voice; TOWER VOICE in Settings turns it off. Academy Field and its identifier are fictional; the phraseology follows the real Aeronautical Information Manual.",
        "# THE FLIGHT LOG + THE CREW BOARD",
        "Every cadet keeps a FLIGHT LOG in two books, like a real pilot's logbook: FLIGHTS they log themselves, and SIM SESSIONS the app logs. The CREW BOARD is the social hub, built for kids: nobody types anything. It fills itself with what cadets do (badges, patches, aircraft spotted, personal bests, 'logged a flight', never where), and cadets cheer each other with one-tap kudos. Only the Family Lead posts Hangar News.",
        "# BACKUPS",
        "Everything lives on this device, so a backup file is how a family keeps progress safe and moves it to a new device: one cadet or the whole household, optionally locked with a passphrase (AES-256 encryption done on the device), with a preview before anything changes, a restore point saved first and a way back. Browsers can clear site data; a backup is the only protection against that, and the app says so.",
        "# FOR FAMILIES",
        "Cadets enroll with a made-up, one-word call sign and a 4-digit PIN. No real names, emails or photos are asked for; photos a cadet adds to their own record are shrunk, stripped of location data and never leave the device. A PIN keeps family members out of each other's profiles; it is not a security lock. The first cadet enrolled on a device becomes the FAMILY LEAD, who can reset a forgotten PIN, restore other cadets' backups and post Hangar News.",
        "The lessons follow FAA handbooks (the Pilot's Handbook of Aeronautical Knowledge, the AIM and the flight rules), written for ages 10-14. It is practice for curious cadets, not an FAA course: no flight time, endorsement, certificate or rating comes from it."
      ]
    },
    "aircraft": {
      "title": "AIRCRAFT GALLERY",
      "body": [
        "# KINDS OF AIRCRAFT",
        "Pilots sort aircraft into categories. These are the ones on a pilot certificate:",
        "# AIRPLANE",
        "Fixed wings and an engine. Most student pilots learn in a small airplane like the trainer in our hangar.",
        "# ROTORCRAFT",
        "Spinning blades make the lift. Helicopters are rotorcraft, and so are gyroplanes.",
        "# GLIDER",
        "No engine needed once it’s flying. Gliders ride rising air to stay up.",
        "# LIGHTER-THAN-AIR",
        "Hot-air balloons and airships float because they’re lighter than the air around them.",
        "# POWERED-LIFT",
        "Takes off like a helicopter and flies like an airplane. Tiltrotors are powered-lift.",
        "# POWERED PARACHUTE + WEIGHT-SHIFT",
        "Two kinds of light aircraft. One hangs under a parachute-style wing. The other is steered by shifting weight, like a hang glider with an engine.",
        "# LEARN MORE",
        "Ground School unit 13, Types of Aircraft, covers the classes inside each category: single-engine and multi-engine, land and sea, helicopters and gyroplanes, balloons and airships."
      ]
    },
    "radio": {
      "title": "TOWER RADIO",
      "body": [
        "# THE PHONETIC ALPHABET",
        "Pilots spell with words so letters never get mixed up over a scratchy radio.",
        "A  ALFA  •  B  BRAVO  •  C  CHARLIE  •  D  DELTA",
        "E  ECHO  •  F  FOXTROT  •  G  GOLF  •  H  HOTEL",
        "I  INDIA  •  J  JULIETT  •  K  KILO  •  L  LIMA",
        "M  MIKE  •  N  NOVEMBER  •  O  OSCAR  •  P  PAPA",
        "Q  QUEBEC  •  R  ROMEO  •  S  SIERRA  •  T  TANGO",
        "U  UNIFORM  •  V  VICTOR  •  W  WHISKEY  •  X  X-RAY",
        "Y  YANKEE  •  Z  ZULU",
        "# NUMBERS",
        "Numbers are said one digit at a time, and nine is said NINER.",
        "# RADIO WORDS",
        "ROGER: I heard you.",
        "WILCO: I will comply.",
        "SAY AGAIN: please repeat that.",
        "AFFIRMATIVE: yes.  NEGATIVE: no."
      ]
    },
    "wash": {
      "title": "WASH SUPPLIES",
      "body": [
        "# BEFORE YOU GET ANYTHING WET",
        "Cover the PITOT TUBE and the STATIC PORTS. They feed the airspeed indicator, the altimeter and the vertical speed indicator. Water inside can make those gauges give wrong readings.",
        "Bright orange REMOVE BEFORE FLIGHT streamers hang from the covers so nobody forgets them.",
        "# THE SHELF",
        "AIRCRAFT SOAP: made for airplane paint and metal. Some household cleaners can cause corrosion.",
        "BUG REMOVER: soaks bugs off the leading edges of the wings, the tail and the propeller.",
        "PLASTIC CLEANER + A SOFT CLOTH: windshields are plastic, not glass. Paper towels scratch them.",
        "CHAMOIS: a soft cloth for drying without swirls.",
        "# WHEN YOU’RE DONE",
        "Take the covers OFF. Then walk around and look for oil leaks, loose screws and dents. A wash is a great inspection."
      ]
    },
    "windsock": {
      "title": "THE WINDSOCK",
      "body": [
        "A windsock shows two things at a glance: which way the wind is blowing, and roughly how strong it is.",
        "# DIRECTION",
        "Wind blows into the big open end and out the small end, so the sock points the way the wind is going.",
        "# STRENGTH",
        "A limp sock means calm air. The fatter and straighter it flies, the stronger the wind.",
        "# WHY PILOTS CARE",
        "Airplanes take off and land into the wind. A headwind slows the airplane over the ground, so it needs less runway."
      ]
    }
  },
  "board": {
    "title": "HANGAR NEWS",
    "collection": "news",
    "post": "owner",
    "max": 280
  },
  "badges": [
    {
      "id": "enrolled",
      "n": "ENROLLED",
      "d": "JOINED THE ACADEMY"
    },
    {
      "id": "styled",
      "n": "LOCKER READY",
      "d": "SUITED UP IN YOUR LOCKER"
    },
    {
      "id": "explorer",
      "n": "AIRFIELD EXPLORER",
      "d": "VISITED ALL NINE PLACES"
    },
    {
      "id": "crew",
      "n": "MET THE CREW",
      "d": "TALKED TO EVERY CREW MEMBER"
    },
    {
      "id": "student",
      "n": "GROUND SCHOOL STUDENT",
      "d": "OPENED YOUR FIRST UNIT"
    },
    {
      "id": "newsreader",
      "n": "IN THE KNOW",
      "d": "READ HANGAR NEWS"
    },
    {
      "id": "firstflight",
      "n": "FIRST FLIGHT",
      "d": "FINISHED YOUR FIRST LESSON"
    },
    {
      "id": "perfect",
      "n": "GREASED IT",
      "d": "3 STARS ON A LESSON"
    },
    {
      "id": "tailwind",
      "n": "TAILWIND",
      "d": "5 RIGHT IN A ROW"
    },
    {
      "id": "streak3",
      "n": "FLIGHT DAYS",
      "d": "LEARNED 3 DAYS IN A ROW"
    },
    {
      "id": "checkride",
      "n": "FIRST PATCH",
      "d": "PASSED YOUR FIRST UNIT CHECKRIDE"
    },
    {
      "id": "mytrainer",
      "n": "MY TRAINER",
      "d": "PICKED YOUR FIRST AIRCRAFT"
    },
    {
      "id": "arcade",
      "n": "GAME ON",
      "d": "PLAYED YOUR FIRST CLUBHOUSE GAME"
    },
    {
      "id": "arcade8",
      "n": "ARCADE ACE",
      "d": "PLAYED 8 CLUBHOUSE GAMES"
    },
    {
      "id": "radio",
      "n": "ON FREQUENCY",
      "d": "MADE YOUR FIRST RADIO CALL"
    },
    {
      "id": "spotter",
      "n": "SHARP EYES",
      "d": "SPOTTED 10 AIRCRAFT"
    },
    {
      "id": "spotall",
      "n": "HALL OF FLIGHT",
      "d": "SPOTTED EVERY AIRCRAFT IN THE GUIDE"
    },
    {
      "id": "games17",
      "n": "GAME NIGHT REGULAR",
      "d": "PLAYED 17 DIFFERENT GAMES"
    },
    {
      "id": "games27",
      "n": "CLUBHOUSE LEGEND",
      "d": "PLAYED ALL 27 GAMES"
    },
    {
      "id": "briefed",
      "n": "FIRST BRIEFING",
      "d": "FINISHED THE TUTORIAL"
    },
    {
      "id": "reader",
      "n": "PAGE ONE",
      "d": "READ YOUR FIRST LIBRARY BOOK"
    },
    {
      "id": "bookworm",
      "n": "BOOKWORM",
      "d": "PASSED 8 LIBRARY QUIZZES"
    },
    {
      "id": "librarian",
      "n": "LIBRARIAN",
      "d": "PASSED EVERY LIBRARY QUIZ"
    },
    {
      "id": "testout",
      "n": "ALREADY KNEW IT",
      "d": "TESTED OUT OF A UNIT"
    },
    {
      "id": "gold1",
      "n": "GOLD WINGS",
      "d": "TOOK A UNIT TO GOLD"
    },
    {
      "id": "goldall",
      "n": "GROUND SCHOOL MASTER",
      "d": "EVERY UNIT AT GOLD"
    },
    {
      "id": "trivia10",
      "n": "TRIVIA NIGHT REGULAR",
      "d": "PLAYED 10 ROUNDS OF FLIGHT TRIVIA"
    },
    {
      "id": "flightlog",
      "n": "LOGBOOK OPENED",
      "d": "LOGGED YOUR FIRST REAL FLIGHT"
    },
    {
      "id": "traveler",
      "n": "FREQUENT FLYER",
      "d": "LOGGED 10 REAL FLIGHTS"
    },
    {
      "id": "grad",
      "n": "DISCOVERY GRAD",
      "d": "EARNED EVERY DISCOVERY PATCH"
    },
    {
      "id": "stugrad",
      "n": "STUDENT PILOT GRAD",
      "d": "EARNED EVERY STUDENT PATCH"
    },
    {
      "id": "prvgrad",
      "n": "PRIVATE PILOT GRAD",
      "d": "EARNED EVERY PRIVATE PATCH"
    },
    {
      "id": "topsky",
      "n": "TOP OF THE SKY",
      "d": "EARNED EVERY BEYOND PATCH"
    }
  ],
  "audio": {
    "menuMusic": "title",
    "radio": []
  }
});
