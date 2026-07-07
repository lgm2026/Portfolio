var fs = require("fs");
var SCR = "scr" + "ipt";
var BRAND = "AvHype Aviation Education";
var BADGE = "AVHYPE AVIATION EDUCATION";

var reactUMD = fs.readFileSync("/home/claude/fp/node_modules/react/umd/react.production.min.js", "utf8");
var reactDomUMD = fs.readFileSync("/home/claude/fp/node_modules/react-dom/umd/react-dom.production.min.js", "utf8");
var app = fs.readFileSync("/home/claude/fp/FlightPathAcademy.jsx", "utf8");
var __b64 = function (p) { return fs.readFileSync(p).toString("base64"); };
var LOGO_FULL_URI = "data:image/png;base64," + __b64("/home/claude/fp/assets/full.png");
var LOGO_MARK_URI = "data:image/png;base64," + __b64("/home/claude/fp/assets/mark.png");
var FAV_URI = "data:image/png;base64," + __b64("/home/claude/fp/assets/fav.png");
var DBMARK_URI = "data:image/png;base64," + __b64("/home/claude/fp/assets/db-mark.png");
var DBMARK_LIGHT_URI = "data:image/png;base64," + __b64("/home/claude/fp/assets/db-mark-light.png");

function neutralize(s) { return s.split("</scr" + "ipt>").join("<\\/scr" + "ipt>"); }
reactUMD = neutralize(reactUMD); reactDomUMD = neutralize(reactDomUMD); app = neutralize(app);

function forceGlobal(umd) {
  return '(function (module, exports, define) {\n'
    + 'module = void 0; exports = void 0; define = void 0;\n'
    + umd + '\n'
    + '}).call(typeof window !== "undefined" ? window : this);';
}
var reactWrapped = forceGlobal(reactUMD);
var reactDomWrapped = forceGlobal(reactDomUMD);

var head = [
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'  <meta charset="utf-8" />',
'  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
'  <meta name="theme-color" content="#070E1C" />',
'  <title>' + BRAND + '</title>',
'  <link rel="icon" type="image/png" href="' + FAV_URI + '" />',
'  <style>',
'    *{box-sizing:border-box}',
'    html,body{margin:0;padding:0;background:#0a131c;-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
'    #fpa-bootsplash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;',
'      background:radial-gradient(120% 90% at 50% -10%,#15295A 0%,#0C1A33 45%,#070E1C 100%);overflow:hidden;opacity:1;transition:opacity .5s ease}',
'    #fpa-bootsplash.leaving{opacity:0;pointer-events:none}',
'    .fpa-stars{position:absolute;inset:0;background-image:radial-gradient(1.5px 1.5px at 20% 30%,rgba(255,255,255,.7),transparent),radial-gradient(1.5px 1.5px at 70% 20%,rgba(255,255,255,.5),transparent),radial-gradient(1.5px 1.5px at 40% 70%,rgba(255,255,255,.45),transparent),radial-gradient(1.5px 1.5px at 85% 60%,rgba(255,255,255,.6),transparent),radial-gradient(1.5px 1.5px at 55% 45%,rgba(255,255,255,.4),transparent);animation:fpa-tw 4s ease-in-out infinite alternate}',
'    @keyframes fpa-tw{from{opacity:.5}to{opacity:.95}}',
'    .fpa-card{position:relative;width:100%;max-width:440px;background:rgba(19,32,45,.72);border:1px solid #22384A;border-radius:22px;',
'      padding:22px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center;color:#E8EEF3}',
'    .fpa-logo{background:#fff;border-radius:18px;padding:18px 16px;margin:2px 0 16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(0,0,0,.28)}',
'    .fpa-logo img{display:block;width:100%;max-width:230px;height:auto}',
'    .fpa-sky{position:relative;height:108px;margin:2px 0 14px;border-radius:14px;overflow:hidden;background:linear-gradient(180deg,rgba(46,134,193,.18),rgba(46,134,193,.04))}',
'    .fpa-cloud{position:absolute;border-radius:999px;background:rgba(255,255,255,.16)}',
'    .fpa-cloud:before,.fpa-cloud:after{content:"";position:absolute;border-radius:999px;background:rgba(255,255,255,.16)}',
'    .c1{width:54px;height:16px;top:24px;left:-70px;animation:fpa-drift 9s linear infinite}',
'    .c1:before{width:24px;height:24px;top:-10px;left:10px}.c1:after{width:18px;height:18px;top:-7px;left:30px}',
'    .c2{width:40px;height:12px;top:64px;left:-60px;opacity:.7;animation:fpa-drift 13s linear infinite;animation-delay:2s}',
'    .c2:before{width:18px;height:18px;top:-8px;left:8px}.c2:after{width:14px;height:14px;top:-5px;left:22px}',
'    .c3{width:34px;height:10px;top:14px;left:-50px;opacity:.55;animation:fpa-drift 16s linear infinite;animation-delay:5s}',
'    .c3:before{width:14px;height:14px;top:-6px;left:6px}.c3:after{width:11px;height:11px;top:-4px;left:18px}',
'    @keyframes fpa-drift{from{transform:translateX(0)}to{transform:translateX(560px)}}',
'    .fpa-path{position:absolute;left:8%;right:8%;top:52%;height:0;border-top:2px dashed rgba(255,255,255,.28)}',
'    .fpa-plane{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;color:#E8EEF3;animation:fpa-bob 2.6s ease-in-out infinite}',
'    @keyframes fpa-bob{0%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-9px) rotate(2deg)}100%{transform:translateY(0) rotate(-4deg)}}',
'    .fpa-badge{font-size:11px;letter-spacing:2px;font-weight:800;color:#5C8EF0;margin-bottom:8px}',
'    .fpa-h1{font-size:21px;line-height:1.2;font-weight:900;margin:0 0 7px}',
'    .fpa-sub{font-size:13.5px;line-height:1.55;color:#9DB2C2;margin:0 0 16px}',
'    .fpa-namewrap{text-align:left;margin:0 0 14px}',
'    .fpa-label{display:block;font-size:12.5px;font-weight:700;color:#C7D6E2;margin:0 0 7px}',
'    .fpa-input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #2A4A63;background:#0f1c28;color:#E8EEF3;font-size:15px;outline:none;font-family:inherit}',
'    .fpa-input:focus{border-color:#2C6FE0;box-shadow:0 0 0 3px rgba(44,111,224,.22)}',
'    .fpa-input::placeholder{color:#5E7689}',
'    .fpa-tip{min-height:34px;font-size:12.5px;font-style:italic;line-height:1.5;color:#7E94A6;margin:0 0 16px;transition:opacity .28s ease}',
'    .fpa-btn{width:100%;border:none;border-radius:13px;padding:14px 16px;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;background:#3a5870;color:#9DB2C2;transition:background .25s ease,transform .1s ease}',
'    .fpa-btn[disabled]{cursor:default}',
'    .fpa-btn.ready{background:#1E63D6;color:#FFFFFF;animation:fpa-pulse 1.8s ease-in-out infinite}',
'    .fpa-btn.ready:active{transform:scale(.985)}',
'    @keyframes fpa-pulse{0%{box-shadow:0 0 0 0 rgba(30,99,214,.4)}70%{box-shadow:0 0 0 12px rgba(30,99,214,0)}100%{box-shadow:0 0 0 0 rgba(30,99,214,0)}}',
'    .fpa-spinner{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(157,178,194,.35);border-top-color:#9DB2C2;animation:fpa-spin .8s linear infinite}',
'    @keyframes fpa-spin{to{transform:rotate(360deg)}}',
'    .fpa-progress{margin-top:14px;height:5px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}',
'    .fpa-progress-bar{height:100%;width:38%;border-radius:99px;background:linear-gradient(90deg,transparent,#3D7BE6,transparent);animation:fpa-shim 1.25s ease-in-out infinite}',
'    @keyframes fpa-shim{0%{transform:translateX(-180%)}100%{transform:translateX(420%)}}',
'    .fpa-foot{margin-top:12px;font-size:11px;color:#5E7689}',
'    .fpa-dbmark{display:flex;align-items:center;justify-content:center;margin-top:12px;opacity:.6}',
'    .fpa-dbmark img{width:30px;height:auto;object-fit:contain}',
'    @media (prefers-reduced-motion: reduce){',
'      #fpa-bootsplash, #fpa-bootsplash.leaving{transition:none}',
'      .fpa-stars{animation:none;opacity:.75}',
'      .c1,.c2,.c3{animation:none}',
'      .fpa-plane{animation:none}',
'      .fpa-btn.ready{animation:none}',
'      .fpa-spinner{animation:none;border-top-color:rgba(157,178,194,.35)}',
'      .fpa-progress-bar{animation:none;width:60%}',
'    }',
'  </style>',
'  <' + SCR + '>window.__AVHYPE_LOGO__=' + JSON.stringify(LOGO_FULL_URI) + ';window.__AVHYPE_MARK__=' + JSON.stringify(LOGO_MARK_URI) + ';window.__AVHYPE_DBMARK__=' + JSON.stringify(DBMARK_URI) + ';window.__AVHYPE_DBMARK_LIGHT__=' + JSON.stringify(DBMARK_LIGHT_URI) + ';</' + SCR + '>',
'</head>',
'<body>',
'  <div id="root"></div>',
'  <div id="fpa-bootsplash">',
'    <div class="fpa-stars"></div>',
'    <div class="fpa-card">',
'      <div class="fpa-logo"><img id="fpa-splashimg" alt="AvHype Aviation" /></div>',
'      <div class="fpa-badge">' + BADGE + '</div>',
'      <h1 class="fpa-h1" id="fpa-h1">Preparing for takeoff</h1>',
'      <p class="fpa-sub" id="fpa-sub">Your learning attendant is getting everything ready. This takes just a moment.</p>',
'      <div class="fpa-namewrap" id="fpa-namewrap">',
'        <label class="fpa-label" for="fpa-name">While we taxi, what should we call you?</label>',
'        <input class="fpa-input" id="fpa-name" type="text" autocomplete="given-name" placeholder="Your name (optional)" />',
'      </div>',
'      <div class="fpa-tip" id="fpa-tip"></div>',
'      <button class="fpa-btn" id="fpa-board" disabled>',
'        <span class="fpa-spinner" id="fpa-spinner"></span><span id="fpa-btnlabel">Preparing AvHype\u2026</span>',
'      </button>',
'      <div class="fpa-progress"><div class="fpa-progress-bar"></div></div>',
'      <div class="fpa-foot">Free \u00b7 no account needed \u00b7 works offline \u00b7 your progress stays on this device</div>',
'      <div class="fpa-dbmark"><img src="' + DBMARK_LIGHT_URI + '" alt="" aria-hidden="true" /></div>',
'    </div>',
'  </div>'
].join("\n");

var splashJs = [
'  <' + SCR + '>',
'  (function () {',
'    var W = window;',
'    W.__fpaDeferBoot = true;',
'    W.__fpaPrefill = { name: "" };',
'    var el = function (id) { return document.getElementById(id); };',
'    var splashImg = el("fpa-splashimg"); if (splashImg && W.__AVHYPE_LOGO__) { splashImg.src = W.__AVHYPE_LOGO__; }',
'    var btn = el("fpa-board"), btnLabel = el("fpa-btnlabel"), spinner = el("fpa-spinner");',
'    var nameWrap = el("fpa-namewrap"), nameInput = el("fpa-name"), h1 = el("fpa-h1"), sub = el("fpa-sub"), tipEl = el("fpa-tip");',
'    var returning = false, knownName = "";',
'    try {',
'      var raw = W.localStorage ? W.localStorage.getItem("flightpath_academy_v1") : null;',
'      if (raw) { var st = JSON.parse(raw); if (st && st.onboarded) { returning = true; if (st.profile && st.profile.name) { knownName = st.profile.name; } } }',
'    } catch (e) {}',
'    if (returning) {',
'      if (nameWrap) { nameWrap.style.display = "none"; }',
'      if (h1) { h1.textContent = knownName ? ("Welcome back, " + knownName) : "Welcome back, aviator"; }',
'      if (sub) { sub.textContent = "Your learning attendant is preparing your flight deck. This takes just a moment."; }',
'    }',
'    if (nameInput) { nameInput.addEventListener("input", function () { W.__fpaPrefill.name = nameInput.value; }); }',
'    var tips = [',
'      "The preflight checklist exists because of a 1935 crash \u2014 now every flight begins with one.",',
'      "Runway numbers are the magnetic heading with the last zero dropped: 270\u00b0 is Runway 27.",',
'      "VFR cruising: odd thousands plus 500 eastbound, even thousands plus 500 westbound.",',
'      "Hot, high, and humid air is thinner \u2014 that is density altitude, and it stretches every takeoff.",',
'      "Lift, weight, thrust, and drag: the four forces acting on every aircraft.",',
'      "Always get the current ATIS before you call the tower.",',
'      "A standard day is 15\u00b0C and 29.92 inches of mercury at sea level.",',
'      "Earn a new aircraft for your hangar with every Flight Level you reach."',
'    ];',
'    var ti = 0;',
'    if (tipEl) { tipEl.textContent = tips[0]; ti = 1; }',
'    var tipTimer = setInterval(function () {',
'      if (!tipEl) { return; }',
'      tipEl.style.opacity = "0";',
'      setTimeout(function () { tipEl.textContent = tips[ti % tips.length]; tipEl.style.opacity = "1"; ti = ti + 1; }, 280);',
'    }, 3200);',
'    var ready = false, minElapsed = false, armed = false;',
'    function arm() {',
'      if (armed) { return; }',
'      armed = true;',
'      if (btn) { btn.disabled = false; btn.className = "fpa-btn ready"; }',
'      if (spinner) { spinner.style.display = "none"; }',
'      if (btnLabel) { btnLabel.textContent = returning ? "Enter AvHype" : "Ready for takeoff"; }',
'    }',
'    function maybeArm() { if (ready && minElapsed) { arm(); } }',
'    W.__fpaReady = function () { ready = true; maybeArm(); };',
'    setTimeout(function () { minElapsed = true; maybeArm(); }, 400);',
'    setTimeout(function () { ready = true; minElapsed = true; arm(); }, 8000);',
'    function board() {',
'      if (btn && btn.disabled) { return; }',
'      if (nameInput) { W.__fpaPrefill.name = nameInput.value; }',
'      clearInterval(tipTimer);',
'      if (typeof W.__fpaBoot === "function") { W.__fpaBoot(); }',
'      var bs = el("fpa-bootsplash");',
'      if (bs) { bs.className = bs.className + " leaving"; setTimeout(function () { if (bs.parentNode) { bs.parentNode.removeChild(bs); } }, 540); }',
'    }',
'    if (btn) { btn.addEventListener("click", board); }',
'  })();',
'  </' + SCR + '>'
].join("\n");

var reactBlock = '  <' + SCR + '>\n' + reactWrapped + '\n  </' + SCR + '>';
var reactDomBlock = '  <' + SCR + '>\n' + reactDomWrapped + '\n  </' + SCR + '>';
/* Section data is kept in editable sibling source files (avhype-lessons/reference/content.js) but
   INLINED here as compact JSON.parse() blobs. This keeps the page fully self-contained (works in any
   single-file host, including the in-app preview, with no extra file requests) and starts faster than
   large JS object literals, since JSON.parse is much quicker for the engine to read. */
function runInto(win, file) { (new Function("window", fs.readFileSync("/home/claude/fp/" + file, "utf8")))(win); }
var DW = {};
runInto(DW, "avhype-lessons.js"); runInto(DW, "avhype-lessons-extra.js"); runInto(DW, "avhype-lessons-extra2.js"); runInto(DW, "avhype-lessons-extra3.js"); runInto(DW, "avhype-reference.js"); runInto(DW, "avhype-reference-extra.js"); runInto(DW, "avhype-reference-extra2.js"); runInto(DW, "avhype-content.js");
var jsonBlob = JSON.stringify(DW).split("</").join("<\\/");
var dataInline = '  <' + SCR + ' type="application/json" id="avhype-data">' + jsonBlob + '</' + SCR + '>\n'
  + '  <' + SCR + '>(function(){var D=JSON.parse(document.getElementById("avhype-data").textContent);for(var k in D){window[k]=D[k];}})();</' + SCR + '>';
var appBlock = '  <' + SCR + '>\n' + app + '\n  </' + SCR + '>';
var footer = '</body>\n</html>\n';

var html = head + "\n" + splashJs + "\n" + reactBlock + "\n" + reactDomBlock + "\n" + dataInline + "\n" + appBlock + "\n" + footer;
fs.writeFileSync("/mnt/user-data/outputs/FlightPathAcademy.html", html);
console.log("wrote HTML bytes:", html.length, "| data globals:", Object.keys(DW).length, "| title brand:", html.indexOf("<title>" + BRAND) > -1, "| badge:", html.indexOf(BADGE) > -1);
