/* RKA content data: dialogue, trivia, minigame data, routes, achievements.
   Tone: strings may be {g:"garage talk", f:"family night"}; plain strings serve both. */
(function(){
const DATA = {};

DATA.ROADNAMES = ['SMOKEY','DIESEL','TORCH','HALLIGAN','EMBER','NOZZLE','SPARKY','AXLE','GRIZZ','CHROME','BACKDRAFT','TANKER','HYDRANT','MAVERICK','LOWGEAR','ROOSTER','BIGRIG','FLASHOVER','KICKSTAND','SLEDGE'];
/* 500 + 500 road names / nicknames for the sign-up RANDOM button (names already taken in the club are skipped) */
DATA.NAMES_M = ["TORCH", "HALLIGAN", "NOZZLE", "HYDRANT", "LADDER", "HOOK", "PIKEPOLE", "BACKDRAFT", "FLASHOVER", "SMOKEY", "SPARKY", "TANKER", "ENGINE", "RESCUE", "BOOTS", "HELMET", "TURNOUT", "BUNKER", "PUMPER", "HOSEJOCKEY", "PROBIE", "MEDIC", "HAZMAT", "SQUAD", "TRUCKIE", "IRONS", "ROOFMAN", "SMOKEEATER", "FIREBALL", "CINDER", "CHARCOAL", "SOOT", "CHIMNEY", "SPARKPLUG", "FUSE", "INFERNO", "BLAZER", "BURNER", "KINDLING", "HOTSPOT", "TINDER", "BEACON", "FLARE", "DIESEL", "AXLE", "CHROME", "KICKSTAND", "LOWGEAR", "THROTTLE", "CLUTCH", "PISTON", "CAMSHAFT", "CRANK", "SPROCKET", "GEARBOX", "TORQUE", "REDLINE", "NITRO", "OCTANE", "GASKET", "RATCHET", "WRENCH", "SOCKET", "BOLT", "RIVET", "FENDER", "BAFFLE", "EXHAUST", "HEADER", "CARB", "MAGNETO", "STATOR", "TACH", "SPEEDO", "CHOPPER", "BOBBER", "BAGGER", "CRUISER", "IRONHORSE", "HOG", "SADDLE", "SIDECAR", "WHEELIE", "BURNOUT", "HIGHSIDE", "APEX", "ROADDOG", "ASPHALT", "BLACKTOP", "GRAVEL", "TARMAC", "ODOMETER", "GRIZZ", "BEAR", "WOLF", "HAWK", "EAGLE", "BULL", "MOOSE", "BISON", "BADGER", "WOLVERINE", "COYOTE", "RAPTOR", "VIPER", "COBRA", "PYTHON", "GATOR", "CROC", "SHARK", "BARRACUDA", "MARLIN", "STALLION", "BRONCO", "PANTHER", "COUGAR", "LYNX", "BOBCAT", "JACKAL", "RHINO", "BUFFALO", "MULE", "RAM", "BILLYGOAT", "ROOSTER", "BANTAM", "CROW", "FALCON", "OSPREY", "CONDOR", "BUZZARD", "SCORPION", "HORNET", "THUNDER", "TWISTER", "CYCLONE", "TORNADO", "BLIZZARD", "AVALANCHE", "RAMBLER", "ROCKSLIDE", "BOULDER", "GRANITE", "FLINT", "IRON", "STEEL", "TITANIUM", "COBALT", "BRONZE", "COPPER", "NICKEL", "TIMBER", "OAK", "HICKORY", "BRUISER", "BRUTUS", "TANK", "TINY", "BIGFOOT", "HOSS", "BUBBA", "BOOMER", "DOC", "PREACHER", "PADRE", "DEACON", "JUDGE", "SHERIFF", "MARSHAL", "RANGER", "SCOUT", "NOMAD", "DRIFTER", "ROAMER", "WANDERER", "PILGRIM", "GHOST", "SHADOW", "PHANTOM", "RASCAL", "ROGUE", "MAVERICK", "HOTSHOT", "HOTROD", "SLICK", "LUCKY", "DUKE", "BARON", "WHISKEY", "BOURBON", "BRISKET", "BACON", "BISCUIT", "GRAVY", "CORNBREAD", "JERKY", "JALAPENO", "HABANERO", "CAYENNE", "PEPPER", "CHILI", "GUMBO", "TATER", "MEATBALL", "PORKCHOP", "TBONE", "RIBEYE", "SIRLOIN", "SMOKESTACK", "SLEDGE", "HAMMER", "ANVIL", "CROWBAR", "PRYBAR", "CHISEL", "MALLET", "HATCHET", "MACHETE", "BUZZSAW", "CHAINSAW", "JACKHAMMER", "DRILL", "VISE", "CLAMP", "TONGS", "PLIERS", "SHOVEL", "PICKAXE", "SPIKE", "LUGNUT", "GUNNER", "SARGE", "MAJOR", "COLONEL", "CADET", "ROOKIE", "TROOPER", "CHAPLAIN", "BOMBER", "JUMPER", "RECON", "BRAVO", "TANGO", "FOXTROT", "CHARLIE", "ROMEO", "VICTOR", "DELTA", "ECHO", "OSCAR", "TITAN", "ATLAS", "ZEUS", "THOR", "ODIN", "LOKI", "APOLLO", "HERCULES", "SPARTAN", "VIKING", "SAMURAI", "RONIN", "GLADIATOR", "CENTURION", "PALADIN", "CRUSADER", "BARBARIAN", "WARLORD", "COMET", "METEOR", "ORBIT", "ROCKET", "JETSTREAM", "BIGRIG", "ROOFER", "SPANNER", "FLYWHEEL", "HEADGASKET", "KNUCKLES", "PANHEAD", "SHOVELHEAD", "FLATHEAD", "BOXER", "TWINCAM", "OILCAN", "GREASE", "GREASER", "MUDFLAP", "TAILPIPE", "TAILGUNNER", "ROADHOUSE", "ROADRUNNER", "ROADIE", "DUSTDEVIL", "TUMBLEWEED", "SAGEBRUSH", "MESQUITE", "CACTUS", "RATTLER", "SIDEWINDER", "COPPERHEAD", "MOCCASIN", "LONGHORN", "LONESTAR", "BADLANDS", "CANYON", "MESA", "RIDGELINE", "SUMMIT", "TIMBERLINE", "BACKWOODS", "BOONDOCKS", "BAYOU", "SWAMPRAT", "TRIGGER", "SPURS", "SADDLEBAG", "STIRRUP", "LASSO", "WRANGLER", "RODEO", "BUCKAROO", "COWPOKE", "DRAGSTER", "STREETROD", "RATROD", "MUSCLE", "FASTBACK", "STINGRAY", "TURBO", "BOOST", "BLOWER", "DRAGLINE", "HOLESHOT", "MILEMARKER", "CROSSROADS", "ESPRESSO", "JAVA", "CAFFEINE", "DONUT", "PICKLE", "TACO", "BURRITO", "NACHO", "BRATWURST", "HOTDOG", "CORNDOG", "HUSHPUPPY", "CATFISH", "CRAWDAD", "SHRIMP", "CRABCAKE", "OYSTER", "GRITS", "MOLASSES", "SAUSAGE", "KIELBASA", "CHORIZO", "PRETZEL", "MUSTARD", "KETCHUP", "SRIRACHA", "WASABI", "GHOSTCHILI", "SCORCHER", "BLACKENED", "ASHCAN", "HEATWAVE", "SUNBURN", "VOLCANO", "MAGMA", "LAVA", "OBSIDIAN", "QUAKE", "TREMOR", "SONIC", "BOOMBOX", "RIFF", "POWERCHORD", "DRUMMER", "BASSMAN", "TWANG", "HONKYTONK", "JUKEBOX", "ENCORE", "ROADHOG", "HIGHWAYMAN", "TRUCKER", "CONVOY", "GEARJAMMER", "BULLHAULER", "LOGGER", "LUMBERJACK", "PAULBUNYAN", "SPLITTER", "BRAWLER", "SLUGGER", "KNOCKOUT", "HAYMAKER", "UPPERCUT", "JAB", "SOUTHPAW", "CHAMP", "CONTENDER", "UNDERDOG", "ROUGHNECK", "WILDCATTER", "DRILLER", "DERRICK", "WELDER", "RIVETER", "IRONWORKER", "STEELTOE", "HARDHAT", "BLUECOLLAR", "FOREMAN", "MECHANIC", "GEARHEAD", "MOTORHEAD", "WRENCHHEAD", "TINKER", "JUNKYARD", "SCRAPPER", "PITSTOP", "PITCREW", "FLAGMAN", "CHECKERED", "FINISHLINE", "OUTRIDER", "SWEEP", "LEADDOG", "POINTMAN", "WINGMAN", "ANCHOR", "MOOSEJAW", "BEARCLAW", "BEARTRAP", "WOLFPACK", "LONEWOLF", "ALPHA", "SASQUATCH", "YETI", "GRIZZLY", "KODIAK", "POLAR", "WALRUS", "NARWHAL", "ORCA", "HAMMERHEAD", "MAKO", "TIGERSHARK", "MANTA", "GROUPER", "TARPON", "SNOOK", "REDFISH", "BASS", "WALLEYE", "MUSKIE", "PIKE", "GAR", "STURGEON", "PADDLEFISH", "SNAPPER", "BLUEGILL", "CRAPPIE", "IRONCLAD", "STEELHEAD", "BRIMSTONE", "BEOWULF", "GOLIATH", "SAMSON", "JERICHO", "COLT", "BRICK", "CONCRETE", "MORTAR", "MARBLE", "SLATE", "TUNDRA", "GLACIER", "FROSTBITE", "RAINMAKER", "LONGSHOT", "BIGSHOT", "SLAPSHOT", "BULLSEYE", "DEADEYE", "HAWKEYE", "EAGLEEYE", "NIGHTHAWK", "NIGHTOWL", "NIGHTRIDER", "BLACKOUT", "HIGHBEAM", "HANDLEBAR", "APEHANGER", "SISSYBAR", "RAKE", "SPRINGER"];
DATA.NAMES_F = ["VIXEN", "RAVEN", "ROXY", "SUGAR", "LACE", "STARLA", "SCARLET", "RUBY", "PIXIE", "SASSY", "DIAMOND", "SAPPHIRE", "MAGNOLIA", "DIXIE", "HONEY", "PEACHES", "CHERRY", "KITTY", "FOXY", "SPITFIRE", "WILDFIRE", "STORMY", "HURRICANE", "VELVET", "SATIN", "GLITTER", "SPARKLE", "MOONSHINE", "QUEENIE", "DUCHESS", "EMPRESS", "VALKYRIE", "ATHENA", "SIREN", "BANSHEE", "PHOENIX", "ROSE", "LILY", "DAISY", "IRIS", "VIOLET", "JASMINE", "POPPY", "DAHLIA", "PEONY", "LOTUS", "ORCHID", "CAMELLIA", "AZALEA", "MARIGOLD", "TULIP", "HOLLY", "IVY", "FERN", "WILLOW", "SAGE", "ROSEMARY", "BLOSSOM", "PETAL", "PEARL", "OPAL", "JADE", "AMBER", "GARNET", "TOPAZ", "ONYX", "EMERALD", "CRYSTAL", "AMETHYST", "CORAL", "JASPER", "BERYL", "CANDY", "COOKIE", "CUPCAKE", "MUFFIN", "CINNAMON", "NUTMEG", "GINGER", "TOFFEE", "BUTTERCUP", "CARAMEL", "PRALINE", "TAFFY", "BONBON", "TRUFFLE", "MOCHA", "LATTE", "SPRINKLES", "GUMDROP", "LOLLIPOP", "PUDDIN", "FIREFLY", "DYNAMITE", "PISTOL", "TROUBLE", "MISCHIEF", "RIOT", "MAYHEM", "CHAOS", "WILDCAT", "LOLA", "LULU", "BETTY", "PEGGY", "DOLLY", "MOLLY", "POLLY", "GOLDIE", "ROSIE", "SADIE", "MAISIE", "BONNIE", "SALLY", "SUSIE", "JOLENE", "LORETTA", "TAMMY", "STARDUST", "STARLIGHT", "MOONBEAM", "SUNNY", "SUNSHINE", "RAINBOW", "AURORA", "NOVA", "LUNA", "STELLA", "ESTRELLA", "SKYE", "MISTY", "BREEZE", "RAINDROP", "SNOWFLAKE", "FROSTY", "WINTER", "SUMMER", "AUTUMN", "HARMONY", "MELODY", "LYRIC", "JAZZ", "BLUES", "ROCKABILLY", "DIVA", "PRINCESS", "BARONESS", "CONTESSA", "LADYBUG", "LADYHAWK", "ARTEMIS", "FREYA", "MUSE", "MEDUSA", "PANDORA", "CALYPSO", "ELECTRA", "JUNO", "VESTA", "DOE", "FAWN", "DOVE", "ROBIN", "WREN", "FINCH", "SPARROW", "BLUEJAY", "CANARY", "BUTTERFLY", "DRAGONFLY", "MINX", "MARE", "FILLY", "PONY", "SWAN", "HERON", "LIONESS", "TIGRESS", "CHEETAH", "MINK", "SABLE", "ERMINE", "EMBER", "BLAZE", "SPICE", "PAPRIKA", "SAFFRON", "CLOVE", "VANILLA", "MAPLE", "CLOVER", "SEQUIN", "TIARA", "HALO", "STILETTO", "ROUGE", "BLUSH", "LOCKET", "CHARM", "BANGLE", "TEARDROP", "DIMPLES", "FRECKLES", "CURLS", "RINGLETS", "BRAIDS", "PIGTAILS", "BUNNY", "KITTEN", "DUCKY", "CHICKADEE", "BLUEBIRD", "MAGPIE", "LARK", "SKYLARK", "PIPER", "PEACHY", "GEORGIA", "CAROLINA", "SAVANNAH", "MEMPHIS", "NASHVILLE", "DAKOTA", "CHEYENNE", "SIERRA", "SANTAFE", "TAHOE", "SEDONA", "MONTANA", "ARIZONA", "VEGAS", "TULSA", "CHROMEGIRL", "REVS", "PURR", "GLAM", "GLITZ", "SHIMMER", "SHINE", "GLOW", "TWINKLE", "DAZZLE", "RAZZLE", "FIZZ", "BUBBLES", "SPARKS", "SALSA", "RUMBA", "SAMBA", "MAMBO", "CHACHA", "BALLERINA", "JIVE", "BOOGIE", "DISCO", "COWGIRL", "BARREL", "MERMAID", "SIRENA", "PEARLY", "SEASHELL", "SEAGLASS", "TIDE", "WAVE", "SURF", "ISLAND", "BAHAMA", "CARIBBEAN", "COCONUT", "MANGO", "PAPAYA", "GUAVA", "KIWI", "LIME", "LEMON", "LEMONDROP", "TANGERINE", "CLEMENTINE", "APRICOT", "PLUM", "BERRY", "RASPBERRY", "BLUEBERRY", "STRAWBERRY", "CRANBERRY", "ELDERBERRY", "GOOSEBERRY", "MULBERRY", "JUNIPER", "HAZEL", "OLIVE", "CHESTNUT", "ALMOND", "PISTACHIO", "MACAROON", "MERINGUE", "SOUFFLE", "CREPE", "TIRAMISU", "CANNOLI", "BISCOTTI", "GELATO", "SHERBET", "SORBET", "SUNDAE", "MILKSHAKE", "MALT", "SODAPOP", "ROOTBEER", "BUBBLY", "BRANDY", "SHERRY", "LAVENDER", "LILAC", "PRIMROSE", "HYACINTH", "BLUEBELL", "BEGONIA", "GARDENIA", "FREESIA", "ZINNIA", "ASTER", "CALLA", "POINSETTIA", "HIBISCUS", "PLUMERIA", "WISTERIA", "HEATHER", "SUNFLOWER", "DAFFODIL", "SNAPDRAGON", "FOXGLOVE", "PRAIRIE", "MEADOW", "WILDFLOWER", "THISTLE", "BRIAR", "BRAMBLE", "BRIARROSE", "SILVER", "PLATINUM", "TITANIA", "ROSEGOLD", "CITRINE", "PERIDOT", "TOURMALINE", "MOONSTONE", "SUNSTONE", "TURQUOISE", "LAPIS", "AQUAMARINE", "ZIRCON", "AGATE", "QUARTZ", "TEMPEST", "TYPHOON", "MONSOON", "LIGHTNING", "STARFIRE", "STARBURST", "SUPERNOVA", "GALAXY", "CELESTE", "SOLSTICE", "ECLIPSE", "TWILIGHT", "DAWN", "DUSK", "SUNSET", "SUNRISE", "ZEPHYR", "GALE", "SQUALL", "DRIZZLE", "FEISTY", "SPUNKY", "SAUCY", "PEPPY", "ZESTY", "FIERY", "FURY", "BOMBSHELL", "FIREBRAND", "FIRESTORM", "HOTSAUCE", "SPICY", "PEPPERMINT", "TRIXIE", "BAMBI", "DESTINY", "CHARITY", "FAITH", "HOPE", "GRACE", "MERCY", "JOY", "BLISS", "HAVEN", "SERENITY", "TRINITY", "GENESIS", "EDEN", "KARMA", "ZEN", "MOJO", "MYSTIC", "MYSTIQUE", "ENIGMA", "RIDDLE", "WHISPER", "KITTYCAT", "TIGERLILY", "OCELOT", "GAZELLE", "OTTER", "KOALA", "PANDA", "FLAMINGO", "SWALLOW", "ORIOLE", "CARDINAL", "TANAGER", "PHOEBE", "EGRET", "IBIS", "KESTREL", "BUMBLEBEE", "HONEYBEE", "QUEENBEE", "FLAME", "FLICKER", "CANDLE", "SPARKLER", "GLIMMER", "BONFIRE", "CAMPFIRE", "HEARTH", "LEATHER", "BUCKLE", "FRINGE", "TASSEL", "BANDANA", "BEADS", "INKED", "WANDERESS", "ROADQUEEN", "ROADBELLE", "BELLE", "DIXIEBELLE", "SWEETPEA", "SWEETIE", "HONEYBUN", "HONEYPIE", "SUGARPIE", "CUTIEPIE", "PUMPKIN", "BUTTERBEAN", "JELLYBEAN", "COCOA", "CAPPUCCINO", "MACCHIATO", "CHAI", "VIRGINIA", "CHARLOTTE", "MYRTLE", "ASPEN", "PARIS", "VIENNA", "FLORENCE", "ODESSA", "SHASTA", "SONOMA", "NAPA", "HERA", "VENUS", "NYX", "SELENE", "RHEA", "GAIA", "MAIA", "CIRCE", "ARIADNE", "PENELOPE", "CASSANDRA", "SOPRANO", "TREBLE", "BALLAD", "SERENADE", "LULLABY", "CADENCE", "RHYTHM", "SONATA", "LIBERTY", "INDIGO", "CRIMSON", "CERISE", "MAGENTA", "FUCHSIA", "COCO", "PINUP"];

DATA.DISCLAIMERS = [
 'ARCADE POINTS ARE NEVER MONEY.',
 'THE STORY IS FICTION. IT DOES NOT GRANT OR IMITATE REAL CLUB STATUS.',
 'THIS GAME IS NOT ROAD-SAFETY TRAINING.',
 'OTHER RIDERS AND CLUBS SHOWN ARE GENERIC AND UNNAMED.',
 'NO WAGERING. NO PRIZES. POKER RUN PAYS POINTS ONLY.',
 'CLUB ARTWORK SUPPLIED BY THE CLUB AND USED WITH PERMISSION.'
];

/* ---------------- NPC dialogue ---------------- */
DATA.NPC = {
 chief:{ name:'CHIEF', col:'#ffb040',
  intro:[
   {g:"So you're the new prospect. Thirty years on the trucks taught me one thing:", f:"Welcome in! You must be our new prospect."},
   {g:"nobody rides alone. Not into a fire, not down a highway.", f:"Around here nobody rides alone. Not ever."},
   "This club runs on three things: brotherhood, wrenches, and bad coffee.",
   {g:"Prove you can hold a line and I'll see you patched by sundown. Fictionally speaking.", f:"Finish the Prospect Day checklist and we'll celebrate you proper. It's all in good fun."},
   "Start in the GARAGE. A rider who skips the pre-ride check is a pedestrian waiting to happen."
  ],
  mid:["Checklist's on the wall, prospect. Garage, 501 ride, Ladies' desk, cornhole, trivia, poker run.","Then come see me in the meeting room."],
  ceremony:[
   "Garage check. The 501. You stopped for a brother down. Benefit planned, bags thrown, questions answered, cards drawn.",
   {g:"That's a full day, prospect. Hell of a shift.", f:"That's a full day, prospect. Well done."},
   "By the entirely fictional power vested in me by this arcade cabinet...",
   "...consider yourself PATCHED. Story-mode only. The real thing takes years and a lot more dish duty.",
   "Jukebox is yours tonight. Kickstands up!"
  ],
  after:["Lifetime points don't buy anything but bragging rights. Exactly how it should be.","Go log some REAL miles on the clipboard if you rode today. Real bikes, real odometer, no arcade nonsense."],
  darts_win:["Thirty years of station-house darts, prospect. Treble twenty is muscle memory.","Good arm. Steadier breathing next time and you'll have me."],
  darts_lose:["Well I'll be. Out-thrown at my own oche. Frame that scoresheet.","Don't get cocky. I was letting the coffee wear off."]
 },
 hammer:{ name:'HAMMER', col:'#ff7030',
  talk:[
   {g:"Road Captain Hammer. I plan the routes and I set the pace. Kevin owns the cornhole boards - I just own the road.", f:"I'm Hammer, the Road Captain. I plan our routes. Kevin's the cornhole champ around here."},
   "Rules of the convoy: keep your spacing, watch the rider behind you, point out the potholes.",
   "Pick a route off my board when you're ready. The 501 is a crawl, the Dragon is a dance, and the Poker Run is a party."
  ],
  pool_win:["Rack 'em again whenever you like. The table's been mine since the clubhouse opened.","Shot selection, prospect. Leave yourself a shape, not a prayer."],
  pool_lose:["Clean. Real clean. I'm buying the next round of root beer.","Huh. Somebody's been practicing on my table after hours."]
 },
 kevin:{ name:'KEVIN', col:'#60d080',
  talk:[
   {g:"Kevin. Undefeated at cornhole since the chili incident of aught-nineteen.", f:"I'm Kevin - the club cornhole champ!"},
   "Rules are simple: play to 21, cancel scoring, and the wind lies to everybody but me.",
   "Boards are set up in the picnic yard. Bring your arm, prospect."
  ],
  cornhole_win:[{g:"Unbelievable. Beat by a prospect. Drinks— er, SODAS are on me.", f:"Wow, beat by a prospect! Sodas are on me."}],
  cornhole_lose:["The board giveth and the board taketh. Run it back any time, prospect."]
 },
 ember:{ name:'MAWMAW', col:'#ff9ad0',
  talk:[
   "Mawmaw. President of the Raging Knights Ladies, and the reason anything around here actually gets organized.",
   "We ride, we plan the benefits, and we out-cook the men every single picnic.",
   "The kids at the burn camp count on our care-bag drive. Want to help plan it?"
  ],
  benefit_intro:["Okay, planner. The benefit needs volunteers in the right places.","Three calls to make. Make them count. The kids are counting on us."],
  benefit_good:["THAT is how you plan a benefit. The Ladies approve. Care bags: packed!","You'd be surprised how far a toy bike and a get-well card go for a kid in a burn unit."],
  benefit_ok:["Not bad. A little chaos keeps it interesting. Bags are packed either way!"],
  chili_pre:["Picnic rule one: never trust a judge who isn't sweating.","Five ingredients. Balance the heat. Stir like you mean it."],
  bj_good:["Well, butter my biscuit. You beat the house, sugar.","Lucky cards and a cool head. I'll allow it."],
  bj_ok:["House always wins, sugar. Come back when you're feeling brave.","Not your night. Stand on sixteen less and we'll talk."]
 },
 sparks:{ name:'SPARKS', col:'#80c8ff',
  talk:[
   {g:"They call me Sparks. One prospect to another: Chief's bark is worse than his bite. Barely.", f:"I'm Sparks, a prospect like you! Chief seems tough but he's a softie."},
   "Try the arcade cabinet. The trivia machine ate my high score and my pride.",
   "Oh, and if you see a rider on the shoulder out there? We ALWAYS stop. Club rule older than the club."
  ],
  pong_win:[{g:"Six for six! Pong is a game of physics, prospect. And I'm a physics guy.",f:"Six for six! Cup pong is all physics, and I'm a physics guy."},"Rematch any time. Bring a steadier pull."],
  pong_lose:["You ran my rack! Fine. FINE. Best of three?","Okay, that arc was pretty. I'll be practicing tonight."]
 },
 visitor:{ name:'ROAD GUEST', col:'#b0b0c0',
  talk:[
   "We're a visiting club from up north. No names needed on a poker run, friend.",
   "Your crew's hospitality is famous. Five stops, five cards, zero rain. Perfect day.",
   "Ride safe out there. Rubber side down."
  ]}
};

/* ---------------- Benefit planning choices (Ladies desk) ---------------- */
DATA.BENEFIT = [
 { q:'The toy drive table needs a lead. Who do you post there?',
   opts:[{t:'Mawmaw’s Ladies crew',s:2,r:'The Ladies run tables like a fireground command post. Perfect.'},
         {t:'Hammer (he’s loud)',s:1,r:'Loud works... until he starts rating the toys.'},
         {t:'Leave it unstaffed',s:0,r:'An unstaffed table at a biker picnic? Brave. Wrong, but brave.'}]},
 { q:'Supplies budget: 40 care bags. What goes in first?',
   opts:[{t:'Comfort items + notes from the club',s:2,r:'Comfort first. That’s the whole point.'},
         {t:'All candy',s:1,r:'The kids vote yes. The nurses vote no. Compromise reached.'},
         {t:'Club stickers only',s:0,r:'Stickers are great. Stickers alone? We can do better.'}]},
 { q:'A storm cloud rolls in an hour before the ride. Call it:',
   opts:[{t:'Delay 30, check radar, brief everyone',s:2,r:'Calm call, clear brief. Chief would be proud.'},
         {t:'Ride anyway',s:0,r:'Wet roads and a convoy? The Road Captain overrules you.'},
         {t:'Cancel everything',s:1,r:'Safe, but the sun came out 20 minutes later. Lesson logged.'}]}
];

/* ---------------- Trivia (curated, factual; source noted) ---------------- */
DATA.TRIVIA = [
 {q:'Harley-Davidson was founded in which city?',o:['Detroit','Milwaukee','Chicago','Cleveland'],a:1,src:'H-D company history, 1903'},
 {q:'What year was Harley-Davidson founded?',o:['1898','1903','1911','1920'],a:1,src:'H-D company history'},
 {q:'The first Harley-Davidson "factory" was famously a...',o:['Barn','Wooden shed','Garage loft','Blacksmith shop'],a:1,src:'H-D heritage: 10x15 ft shed'},
 {q:'"Tail of the Dragon" at Deals Gap is part of which US route?',o:['US 129','US 441','US 19','US 74'],a:0,src:'NC/TN border, US 129'},
 {q:'The Tail of the Dragon packs how many curves into 11 miles?',o:['128','218','318','418'],a:2,src:'Famous count: 318 curves'},
 {q:'The classic American V-twin cylinder angle on a Harley is...',o:['45 degrees','60 degrees','90 degrees','72 degrees'],a:0,src:'H-D 45-degree V-twin'},
 {q:'HOG, founded 1983, stands for...',o:['Highway Owners Guild','Harley Owners Group','Hog Operators Garage','Heritage Of Gears'],a:1,src:'Harley Owners Group'},
 {q:'Indian Motocycle, America’s other early marque, was founded in...',o:['1901','1905','1912','1899'],a:0,src:'Springfield, MA, 1901'},
 {q:'The Sturgis Motorcycle Rally is held in which state?',o:['Montana','Wyoming','South Dakota','Nevada'],a:2,src:'Sturgis, SD; began 1938'},
 {q:'Route 66 historically ran from Chicago to...',o:['San Diego','Santa Monica','San Francisco','Las Vegas'],a:1,src:'US 66, Chicago to Santa Monica'},
 {q:'A "bagger" is a motorcycle with...',o:['No front brake','Saddlebags / touring gear','A sidecar','Ape hangers'],a:1,src:'Common touring slang'},
 {q:'"Ape hangers" are...',o:['Tall handlebars','Crash bars','Floorboards','Loud pipes'],a:0,src:'Common bike slang'},
 {q:'Counter-steering means initiating a right turn by...',o:['Leaning back','Pressing the right grip forward','Pulling the left grip','Braking hard'],a:1,src:'Basic riding physics (push right, go right)'},
 {q:'The engine nicknamed "Knucklehead" got its name from...',o:['Rocker-box shape','A race team','Its inventor','A cartoon'],a:0,src:'1936 H-D OHV rocker covers'},
 {q:'Which engine came FIRST?',o:['Shovelhead','Panhead','Knucklehead','Evolution'],a:2,src:'Knuckle 1936, Pan 1948, Shovel 1966, Evo 1984'},
 {q:'Daytona Bike Week happens in which state?',o:['Texas','Florida','Georgia','Arizona'],a:1,src:'Daytona Beach, FL'},
 {q:'Myrtle Beach Bike Week rolls through which state?',o:['North Carolina','Virginia','South Carolina','Tennessee'],a:2,src:'Grand Strand, SC'},
 {q:'The Blue Ridge Parkway runs about how many miles?',o:['169','269','469','669'],a:2,src:'469 miles, NC/VA'},
 {q:'A trike has how many wheels?',o:['2','3','4','5'],a:1,src:'Tri = three'},
 {q:'DOT-approved helmets in the US meet standard...',o:['FMVSS 218','ISO 9001','SAE J2258','ANSI Z87'],a:0,src:'Federal Motor Vehicle Safety Standard 218'},
 {q:'MSF stands for...',o:['Motor Speed Federation','Motorcycle Safety Foundation','Mobile Service Fleet','Motorway Standards Forum'],a:1,src:'Rider education nonprofit'},
 {q:'"Two-up" means riding...',o:['Standing','With a passenger','In second gear','Side by side'],a:1,src:'Common riding slang'},
 {q:'The Cherohala Skyway connects Tennessee with...',o:['Georgia','Virginia','North Carolina','Kentucky'],a:2,src:'Tellico Plains TN to Robbinsville NC'},
 {q:'A motorcycle "fairing" is...',o:['A wind-deflecting bodywork','A chrome exhaust','A seat spring','A fuel additive'],a:0,src:'Bodywork that cuts wind'},
 {q:'"Kickstands up" traditionally means...',o:['Time to park','Time to ride out','Engine trouble','Lunch break'],a:1,src:'Convoy departure call'},
 {q:'US 501 is the classic crawl into which beach town?',o:['Virginia Beach','Myrtle Beach','Daytona Beach','Ocean City'],a:1,src:'US 501 into Myrtle Beach, SC'}
];

/* ---------------- Chili cook-off ---------------- */
DATA.CHILI = {
 ingredients:[
  {n:'BRISKET',heat:0,flav:30,chaos:0,d:'Low and slow. The backbone.'},
  {n:'FIRE-ROAST TOMATO',heat:5,flav:20,chaos:0,d:'Sweet smoke in a can.'},
  {n:'ANCHO CHILES',heat:15,flav:22,chaos:0,d:'Warm, raisiny, reliable.'},
  {n:'JALAPENO',heat:20,flav:12,chaos:0,d:'The people’s pepper.'},
  {n:'HABANERO',heat:38,flav:8,chaos:5,d:'Now we’re cooking with foam.'},
  {n:'GHOST PEPPER',heat:60,flav:4,chaos:12,d:'Sign the waiver first.'},
  {n:'DARK BEER SPLASH',heat:0,flav:16,chaos:4,d:'For the pot. Mostly.'},
  {n:'COCOA SQUARE',heat:0,flav:14,chaos:6,d:'Secret weapon of champions.'},
  {n:'CINNAMON STICK',heat:0,flav:10,chaos:10,d:'Bold move, Cincinnati.'},
  {n:'MYSTERY JAR',heat:18,flav:10,chaos:25,d:'Unlabeled. Found in the garage.'}
 ],
 judges:[
  {n:'CHIEF',likeHeat:[35,70],bonus:'flav',lines:{hi:{g:'Burns like a three-alarm. I LOVE IT.',f:'Spicy! Just how I like it.'},lo:'Needs more kick, prospect.',good:'Balanced. Hearty. Another bowl.'}},
  {n:'MAWMAW',likeHeat:[25,55],bonus:'flav',lines:{hi:'Trying to send me to the burn unit I fundraise for?',lo:'Mild... polite... suspicious.',good:'Okay, THIS is going in the club cookbook.'}},
  {n:'ROAD GUEST',likeHeat:[20,80],bonus:'chaos',lines:{hi:'Our club has chili like this. We call it "initiation".',lo:'Smooth. Travels well.',good:'I’m taking this recipe north. No names, no extradition.'}}
 ]
};

/* ---------------- Garage tune-up (fictional pre-ride ritual) ---------------- */
DATA.GARAGE = [
 {k:'TIRES',icon:'tire',s:'Thump the tires'},
 {k:'CONTROLS',icon:'lever',s:'Squeeze the levers'},
 {k:'LIGHTS',icon:'light',s:'Flash the lights'},
 {k:'OIL',icon:'oil',s:'Check the oil'},
 {k:'CHASSIS',icon:'bolt',s:'Rattle the bolts'},
 {k:'STAND',icon:'stand',s:'Kick the stand'}
];

/* ---------------- Rides (10 routes; locations from the club-approved route list) ---------------- */
DATA.ROUTE_ORDER=['r501','dragon','cherohala','botd','brp','nickel','trace','keys','poker','memorial'];
DATA.ROUTES = {
 r501:{ id:'r501', name:'STUCK IN 501 TRAFFIC', sub:'US 501 → MYRTLE BEACH, SC', bg:'bg_501',
   scn:'palms', sky:['#3878c8','#90c8e8'], shoulder:'#c8b088',
   intro:['Friday. Bike week. US 501.','Every cage in three states is crawling toward the beach.','Keep your head on a swivel, hold formation when the captain calls it, and get the crew to the Grand Strand.'],
   len:5200, baseSpeed:120, maxSpeed:230, traffic:.9, potholes:.5, sand:.3, curves:0, theme:'ride',
   landmarks:['CONWAY','AYNOR OVERPASS','WACCAMAW RIVER','TANGER OUTLETS','BROADWAY','GRAND STRAND'],
   tips:'DODGE TRAFFIC. HOLD THE CAPTAIN’S LINE FOR BONUS.' },
 dragon:{ id:'dragon', name:'TAIL OF THE DRAGON', sub:'US 129, NC/TN • 318 CURVES / 11 MI', bg:'bg_convoy',
   scn:'pines', sky:['#2a3a58','#6a88a8'], shoulder:'#3a5a38',
   intro:['Deals Gap. 318 curves in 11 miles.','No traffic to fight here. Just you, the lean, and the mountain.','Hit every curve gate at a safe speed. Smooth is fast.'],
   len:6000, baseSpeed:130, maxSpeed:245, traffic:.25, potholes:.25, sand:.45, curves:1, theme:'dragon',
   landmarks:['DEALS GAP','GRAVITY CAVITY','THE WHIP','BEGINNER’S END','PARSON BRANCH','TREE OF SHAME'],
   tips:'BRAKE FOR CURVE GATES. SMOOTH IS FAST.' },
 cherohala:{ id:'cherohala', name:'CHEROHALA SKYWAY', sub:'NC/TN • MILE-HIGH SWEEPERS', bg:'bg_convoy',
   scn:'pines', sky:['#4a5a78','#9cb8c8'], shoulder:'#44604a',
   intro:['Tellico Plains to Robbinsville. A mile above the valley floor.','Big, wide sweepers instead of hairpins - but the clouds ride WITH you up here.','Respect the curve gates. The mountain doesn’t grade on a curve.'],
   len:5800, baseSpeed:125, maxSpeed:235, traffic:.15, potholes:.2, sand:.5, curves:1, theme:'dragon',
   landmarks:['TELLICO PLAINS','TURKEY CREEK','HOOPER BALD','UNICOI CREST','SANTEETLAH','ROBBINSVILLE'],
   tips:'HIGH-COUNTRY SWEEPERS. EASY ON THE GAS IN THE MIST.' },
 botd:{ id:'botd', name:'BACK OF THE DRAGON', sub:'VA 16 • 438 CURVES / 32 MI', bg:'bg_convoy',
   scn:'pines', sky:['#30486a','#88a0b8'], shoulder:'#4a5a40',
   intro:['Marion to Tazewell. Three mountains. 438 curves.','The Tail’s big brother doesn’t get the t-shirts, but it gets your full attention.','Gate speeds are posted. Hit them clean.'],
   len:6400, baseSpeed:128, maxSpeed:240, traffic:.2, potholes:.35, sand:.35, curves:1, theme:'dragon',
   landmarks:['MARION','HUNGRY MOTHER','WALKER MTN','BURKES GARDEN','THOMPSON VALLEY','TAZEWELL'],
   tips:'THREE MOUNTAINS. KEEP THE RUBBER SIDE DOWN.' },
 brp:{ id:'brp', name:'BLUE RIDGE PARKWAY', sub:'NC/VA • 469 SCENIC MILES', bg:'bg_convoy',
   scn:'ridge', sky:['#5878a8','#c8d8e8'], shoulder:'#4a6a3a',
   intro:['America’s favorite ride. 45 and sunny.','This one isn’t about speed - it’s about the overlooks.','Pull into the scenic overlooks for bonus points. Take the picture. Live a little.'],
   len:6200, baseSpeed:110, maxSpeed:180, traffic:.3, potholes:.2, sand:.25, curves:0, vistas:3, theme:'club',
   landmarks:['DOUGHTON PARK','LINN COVE','GRANDFATHER MTN','CRAGGY GARDENS','MT PISGAH','CHEROKEE'],
   tips:'CRUISE EASY. PULL INTO OVERLOOKS FOR +75.' },
 nickel:{ id:'nickel', name:'OHIO TRIPLE NICKEL', sub:'OH 555 • ROLLERCOASTER BLACKTOP', bg:'bg_convoy',
   scn:'farm', sky:['#4878b8','#b0d0e0'], shoulder:'#7a8a4a',
   intro:['Route 555. The Triple Nickel.','Sixty-two miles of whoops, blind crests and farm-country curves.','Watch the gravel in the corners and mind the tractors.'],
   len:5600, baseSpeed:125, maxSpeed:230, traffic:.35, potholes:.55, sand:.35, curves:1, theme:'ride',
   landmarks:['ZANESVILLE','CUTLER RIDGE','RINARD MILLS','BARTLETT','CHESTERHILL','LITTLE HOCKING'],
   tips:'POTHOLE COUNTRY. LIGHT HANDS, QUICK EYES.' },
 trace:{ id:'trace', name:'NATCHEZ TRACE PARKWAY', sub:'MS/AL/TN • THE OLD TRACE', bg:'bg_convoy',
   scn:'ridge', sky:['#4a88a0','#cfe4d8'], shoulder:'#5a7a3a',
   intro:['444 miles of history and zero billboards.','Fifty miles an hour, canopy overhead, nobody in a hurry.','Perfect formation country. Hold the captain’s line and enjoy the trees.'],
   len:5400, baseSpeed:105, maxSpeed:170, traffic:.2, potholes:.15, sand:.2, curves:0, vistas:2, theme:'club',
   landmarks:['NATCHEZ','PORT GIBSON','FRENCH CAMP','TUPELO','BUZZARD ROOST','MERIWETHER'],
   tips:'EASY CRUISE. OVERLOOKS PAY +75.' },
 keys:{ id:'keys', name:'OVERSEAS HIGHWAY', sub:'US 1, FLORIDA KEYS • RUN TO MILE 0', bg:'bg_convoy',
   scn:'water', sky:['#2890c8','#a8e0f0'], shoulder:'#d8c890',
   intro:['A hundred miles of bridges over turquoise water.','Key Largo to Key West. Mile marker 0 or bust.','Crosswind gusts hit hard on the long bridges. Stay loose.'],
   len:5800, baseSpeed:120, maxSpeed:210, traffic:.45, potholes:.2, sand:.2, curves:0, gusts:true, theme:'poker',
   landmarks:['KEY LARGO','ISLAMORADA','MARATHON','SEVEN MILE BRIDGE','BIG PINE KEY','MILE 0'],
   tips:'HOLD STEADY THROUGH THE BRIDGE GUSTS.' },
 poker:{ id:'poker', name:'CHARITY POKER RUN', sub:'5 STOPS • 5 CARDS • POINTS ONLY', bg:'bg_convoy',
   scn:'farm', sky:['#38306a','#d87840'], shoulder:'#8a6a3a',
   intro:['Five stops hosted by five visiting clubs. No names, no colors shown - just open roads and open doors.','Pull into each stop zone to draw a card.','Best five-card hand at the last stop pays big points. No buy-in. No wagering. Just miles and smiles.'],
   len:7000, baseSpeed:115, maxSpeed:225, traffic:.5, potholes:.4, sand:.3, curves:0, theme:'poker', stops:5,
   landmarks:['STOP 1','STOP 2','STOP 3','STOP 4','FINAL STOP'],
   tips:'SLOW INTO EACH STOP ZONE TO DRAW.' },
 memorial:{ id:'memorial', name:'9/11 MEMORIAL RIDE', sub:'IN MEMORY OF THE 343', bg:'bg_bikerdown',
   scn:'memorial', sky:['#2a2440','#c86840'], shoulder:'#5a4a40',
   intro:['Once a year the club rides slow and quiet.','Flags on every pole. Helmets off at the bell.','We ride to remember the 343. Steady pace. Full hearts.'],
   len:4600, baseSpeed:100, maxSpeed:150, traffic:.15, potholes:.1, sand:.1, curves:0, assist:true, theme:'somber',
   landmarks:['STATION 1','FIREHOUSE ROW','MEMORIAL PARK','THE BELL','LAST ALARM'],
   tips:'RIDE STEADY. WE RIDE TO REMEMBER.' }
};

DATA.POKER_PAY = [
 ['ROYAL FLUSH',5000],['STRAIGHT FLUSH',3000],['FOUR OF A KIND',2000],['FULL HOUSE',1200],
 ['FLUSH',900],['STRAIGHT',700],['THREE OF A KIND',500],['TWO PAIR',350],['PAIR',200],['HIGH CARD',100]
];

/* ---------------- Biker Down event ---------------- */
DATA.BIKERDOWN = {
 intro:['Up ahead - a rider from another crew is down on the shoulder.','No colors you recognize. Doesn’t matter. It never matters.'],
 prompt:'A RIDER IS DOWN. PULL OVER?',
 steps:[
  {q:'First move?',opts:[{t:'Secure the scene - bikes upstream, flashers on',ok:true,r:'Traffic parts around your wall of chrome. Scene is safe.'},{t:'Run straight into the lane',ok:false,r:'Hammer yanks you back: "Secure the scene FIRST, prospect!"'},{t:'Take a picture',ok:false,r:'Mawmaw’s glare could weld steel. Scene first.'}]},
  {q:'The rider is awake, shaken, arm banged up.',opts:[{t:'Talk calm, keep them still, check for worse',ok:true,r:'You keep them talking. Steady voice, steady hands.'},{t:'Help them walk it off',ok:false,r:'Chief: "We don’t move hurt riders, prospect. We keep them safe."'},{t:'Stand their bike up first',ok:false,r:'Bikes can wait. Riders can’t.'}]},
  {q:'Next call?',opts:[{t:'Wave down help & call it in properly',ok:true,r:'Help is rolling. You give clear directions. Textbook.'},{t:'Honk at traffic',ok:false,r:'Noise isn’t help. Make the call.'},{t:'Challenge traffic to fight',ok:false,r:'Tempting. Not helpful. Make the call.'}]}
 ],
 outro:['Their crew rolls up ten minutes later. Handshakes all around.','Different patch. Same road. Same rules.','BROTHERS ALWAYS PICK UP BROTHERS. +POINTS'],
 perfect:'PERFECT RESPONSE! BONUS +500'
};

/* ---------------- Achievements ---------------- */
DATA.ACH = [
 {id:'first_ride',n:'KICKSTANDS UP',d:'Finish your first ride'},
 {id:'no_crash',n:'501 SURVIVOR',d:'Finish a ride without crashing'},
 {id:'formation',n:'FORMATION PRO',d:'Score 3 formation bonuses in one ride'},
 {id:'brothers',n:'BROTHERS ALWAYS',d:'Handle Biker Down perfectly'},
 {id:'cornhole_w',n:'BAG BARON',d:'Beat Kevin at cornhole'},
 {id:'cornhole_hole',n:'SWISH',d:'Throw a cornhole (4 bags in the hole lifetime)'},
 {id:'trivia_ace',n:'PIT BOSS BRAIN',d:'Score 10/10 in trivia'},
 {id:'chili_gold',n:'THREE-ALARM CHEF',d:'Score 90+ in the chili cook-off'},
 {id:'wrench',n:'WRENCH WIZARD',d:'Reach round 7 in Garage Tune-up'},
 {id:'poker_fh',n:'FULL HOUSE',d:'Draw a full house or better on a poker run'},
 {id:'patched',n:'PATCHED (STORY)',d:'Complete the Prospect Day chapter'},
 {id:'dragon_clean',n:'DRAGON TAMER',d:'Clear every curve gate on the Dragon'},
 {id:'logged',n:'REAL MILES',d:'Log a ride in the ride log'},
 {id:'road_dog',n:'ROAD DOG',d:'Reach 15,000 lifetime points'},
 {id:'all_routes',n:'EVERY MILE COUNTS',d:'Finish all 10 routes'},
 {id:'memorial',n:'NEVER FORGET',d:'Complete the 9/11 Memorial Ride'},
 {id:'match3',n:'PATCHWORK PRO',d:'Score 5000+ in Patch Match'},
 {id:'breaker',n:'WRECKING BALL',d:'Clear all 3 Burnout Breaker racks'},
 {id:'frogger',n:'BOULEVARD LEGEND',d:'Get 4 riders across the Boulevard'},
 {id:'runner',n:'ROAD NEVER ENDS',d:'Run 2000+ yards in the endless ride'},
 {id:'jackpot',n:'FULL SEND',d:'Hit the triple-crest jackpot on the slots'},
 {id:'bj21',n:'BLACKJACK!',d:'Get dealt a natural 21 at Mawmaw’s table'},
 {id:'pong_w',n:'CUP CRUSHER',d:'Beat Sparks at pong'},
 {id:'darts_w',n:'TREBLE TROUBLE',d:'Beat the Chief at darts'},
 {id:'darts_bull',n:'DEAD CENTER',d:'Hit a bullseye'},
 {id:'pool_w',n:'EIGHT BALL',d:'Beat Hammer at 8-ball'}
];

/* ---------------- Story ---------------- */
DATA.STORY = [
 {id:0,hint:'MEET CHIEF IN THE MEETING ROOM',where:'meeting'},
 {id:1,hint:'RUN THE GARAGE TUNE-UP',where:'garage'},
 {id:2,hint:'RIDE THE 501 (ROUTE BOARD)',where:'rides'},
 {id:3,hint:'HELP MAWMAW PLAN THE BENEFIT',where:'ladies'},
 {id:4,hint:'THROW CORNHOLE WITH KEVIN',where:'picnic'},
 {id:5,hint:'WIN TRIVIA NIGHT (6+ RIGHT)',where:'arcade'},
 {id:6,hint:'RIDE THE CHARITY POKER RUN',where:'rides'},
 {id:7,hint:'SEE CHIEF FOR THE CEREMONY',where:'meeting'},
 {id:8,hint:'CHAPTER COMPLETE! FREE RIDE FOREVER',where:null}
];

window.DATA=DATA;
})();
