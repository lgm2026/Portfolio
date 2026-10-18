/*! HypeTeen Flight Academy. Copyright (c) 2026 Hype Learning Academies. All rights reserved. Proprietary: no license granted; see LICENSE. */
/* ============================================================================================
   APP CONFIG — the defaults for every rendition.
   Don't edit this file to make a rendition. Put your changes in js/rendition.js instead
   (or run tools/new_rendition.py with a JSON file). rendition.js is deep-merged over this.
   Arrays (cards, assets, radio...) are REPLACED, not merged.
   ============================================================================================ */
window.CONFIG = {
  /* identity: `id` namespaces every localStorage key and salts PIN hashes.
     Give every rendition its own id, or two renditions on one device will share accounts. */
  id: 'appshell',
  name: 'APP SHELL',            // big title on the welcome page + title screen
  subtitle: 'MOBILE HUB',       // small spaced line under it
  tagline: ['FAST', 'SIMPLE', 'YOURS'],   // bullet-separated line (empty array = hidden)
  blurb: 'A blank, phone-first hub. Replace this line in rendition.js.',
  welcome: [                    // paragraphs under the button. **word** = accent-colored
    '**Members** sign in with a name and a 4-digit PIN.',
    '**Everyone** can look around as a guest.'
  ],
  startLabel: '► START',   // the welcome page button
  readyText: 'READY.',
  pageTitle: 'App Shell',       // browser tab title

  /* look: every color in the app comes from here */
  theme: {
    bg: '#0b0d12',              // page + canvas background
    bgGlow: '#121a2a',          // radial glow behind the welcome page
    panel: 'rgba(20,23,32,.97)',// panels and modals
    card: 'rgba(26,29,40,.96)', // dashboard cards / list rows
    cardPress: '#2a2f42',
    ink: '#eef1f6',             // main text
    sub: '#c4cad6',             // secondary text
    dim: '#8b93a3',             // hints
    faint: '#6b7282',
    accent: '#3d8bff',          // borders, focus, toggles
    accentHi: '#6aa8ff',        // top of the glowing primary button
    accentLo: '#2f6fe0',        // bottom of the glowing primary button
    accentText: '#8cbcff',      // ghost-button text, icons
    onAccent: '#071022',        // text drawn on the accent color
    title: '#ffd060',           // screen titles, keyboard focus ring
    good: '#80ffa0', bad: '#ff7a60', info: '#80e0ff', warn: '#ffd27a',
    /* buttons other than primary (fill, hover fill, outline, text) */
    btn: '#262634', btnHi: '#323244', btnLine: 'rgba(255,255,255,.12)',
    danger: '#47191b', dangerHi: '#5a2222', dangerLine: 'rgba(255,110,90,.7)', dangerInk: '#ffb8a8',
    success: '#1b4630', successHi: '#22573a', successLine: 'rgba(128,255,160,.6)', successInk: '#c8ffd8',
    /* the on-screen keyboard / PIN keypad */
    key: '#24222e', keyNum: '#2a2836', keySpecial: '#1b1924', keyPress: '#423b52'
  },
  font: { family: 'Rubik', google: 'Rubik:wght@400;600;700;800' },  // google:null = system font only

  /* art: loaded before START appears; drawn with G.img[name]. Missing files are skipped, not fatal. */
  assets: [
    { name: 'logo', src: 'assets/logo.svg' }
  ],
  logo: 'logo',                 // asset shown on the welcome page + title screen (null = none)
  backdrop: null,               // asset drawn behind the title + dashboard (null = plain gradient)

  /* accounts (stored on this device; PINs are hashed) */
  accounts: {
    enabled: true,              // false = no sign-in at all: START goes straight to the dashboard
    guest: true,                // allow CONTINUE AS GUEST
    photo: true,                // headshot picker in Settings
    nameLabel: 'YOUR NAME',     // what the name field asks for ("ROAD NAME", "CALL SIGN"...)
    nameMax: 16
  },

  /* shared data: window.claude.use('db') when published as a claude.ai artifact; otherwise a
     single-device database kept in localStorage (same API) so everything still works offline */
  data: { localFallback: true },

  /* the dashboard: one card per entry.
     scene: a registered scene to open  |  page: a key in `pages` below  |  href: an outside link
     need: null (everyone) | 'member' (signed in) | 'owner' (the artifact owner / first account on a device) */
  dashTitle: null,              // null = the signed-in name
  cards: [
    { id: 'board', label: 'BULLETIN', sub: 'SHARED POSTS', icon: 'megaphone', scene: 'board' },
    { id: 'about', label: 'ABOUT', sub: 'WHO WE ARE', icon: 'info', page: 'about' },
    { id: 'slot1', label: 'MODULE SLOT', sub: 'BUILD ME', icon: 'grid', scene: 'blank' },
    { id: 'link', label: 'WEBSITE', sub: 'OPENS A LINK', icon: 'link', href: 'https://example.com' }
  ],

  /* simple read-only pages (no code needed). body: array of paragraphs; '# ' starts a heading */
  pages: {
    about: { title: 'ABOUT', body: [
      '# WHAT THIS IS',
      'This is the empty shell. Every word here comes from CONFIG.pages in js/config.js or js/rendition.js.',
      '# NEXT STEPS',
      'Rename the app, pick colors, swap the logo, then add modules for whatever this rendition needs.'
    ] }
  },

  /* the example module (js/mod_board.js) */
  board: { title: 'BULLETIN', collection: 'posts', post: 'member', max: 280 },

  /* sound. radio: streamed songs [{key,t,d,src}] for the title + dashboard; empty = the 8-bit theme */
  audio: { menuMusic: 'theme', radio: [] },

  /* points + badges (optional; G.award / G.ach). badges: [{id,n}] */
  badges: [],

  /* extra fields added to every fresh save (per account), e.g. {streak:0} */
  saveExtra: {},

  /* where START lands: 'title' (sign-in screen) or 'dash' */
  startScene: 'title',
  /* where people land after signing in (and where Settings / BACK return): 'dash', or a module's scene such as 'world' */
  homeScene: 'dash',

  /* every built-in word the person sees, so a rendition can speak its own language */
  words: {
    login: 'LOG IN', loginSub: 'NAME + PIN',
    signup: 'CREATE ACCOUNT', signupSub: 'START HERE',
    guest: 'CONTINUE AS GUEST', guestSub: 'NO ACCOUNT NEEDED',
    pickName: 'TAP YOUR NAME', newAccount: '+ NEW ACCOUNT',
    nameHint: 'THIS IS HOW OTHERS SEE YOU',
    suggest: 'SUGGEST ONE',
    welcome: 'WELCOME, ', welcomeBack: 'WELCOME BACK, ',
    logout: 'LOG OUT', loggedOut: 'LOGGED OUT', deleteAcct: 'DELETE THIS ACCOUNT',
    owner: 'OWNER', points: 'PTS', guestName: 'GUEST', exit: 'EXIT',
    storageWarn: 'CAN\u2019T SAVE ON THIS DEVICE', crashHome: 'SOMETHING WENT WRONG. BACK TO BASE'
  },

  /* the world module (js/mod_world.js): walkable places. Rooms come from the rendition (see mod_world.js) */
  world: null
};

/* deep merge helper (objects merge; arrays and values replace) */
window.CONFIG_MERGE = function merge(a, b) {
  for (const k in b) {
    const v = b[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) merge(a[k], v);
    else a[k] = v;
  }
  return a;
};
