/* =========================================================
   TEMPLE OF CHAOS · tonight's moon on the front page
   Shows today's sacred night (dark moon, new moon, full moon, sabbats)
   or the next one, with a link to the right garden.
   Uses the same astronomy as the Moon & Sabbats page.
   ========================================================= */
(function(){
var LANG = (function(){ try { var v = localStorage.getItem('temple-lang'); if (v === 'lt' || v === 'en') return v; } catch(e){}
  return (navigator.language || '').toLowerCase().indexOf('lt') === 0 ? 'lt' : 'en'; })();
function T(en, lt){ return LANG === 'lt' ? lt : en; }

const rad = d => d*Math.PI/180;
const jdToDate = jd => new Date((jd - 2440587.5) * 86400000);
const DELTA_T = 69/86400;   // TT − UT, about 69 s in the 2020s

function moonPhaseJDE(k){   // k: integer + 0 new, .25 first quarter, .5 full, .75 last quarter
  const T = k/1236.85, T2=T*T, T3=T2*T, T4=T3*T;
  let jde = 2451550.09766 + 29.530588861*k + 0.00015437*T2 - 0.000000150*T3 + 0.00000000073*T4;
  const E = 1 - 0.002516*T - 0.0000074*T2;
  const M  = rad(2.5534 + 29.10535670*k - 0.0000014*T2 - 0.00000011*T3);
  const Mp = rad(201.5643 + 385.81693528*k + 0.0107582*T2 + 0.00001238*T3 - 0.000000058*T4);
  const F  = rad(160.7108 + 390.67050284*k - 0.0016118*T2 - 0.00000227*T3 + 0.000000011*T4);
  const Om = rad(124.7746 - 1.56375588*k + 0.0020672*T2 + 0.00000215*T3);
  const s = Math.sin, c = Math.cos, frac = ((k % 1) + 1) % 1;
  let corr;
  if(frac < 0.01 || frac > 0.99 || Math.abs(frac-0.5) < 0.01){
    const full = Math.abs(frac-0.5) < 0.01;
    corr = (full?-0.40614:-0.40720)*s(Mp) + (full?0.17302:0.17241)*E*s(M) + (full?0.01614:0.01608)*s(2*Mp)
      + (full?0.01043:0.01039)*s(2*F) + (full?0.00734:0.00739)*E*s(Mp-M) - (full?0.00515:0.00514)*E*s(Mp+M)
      + (full?0.00209:0.00208)*E*E*s(2*M) - 0.00111*s(Mp-2*F) - 0.00057*s(Mp+2*F) + 0.00056*E*s(2*Mp+M)
      - 0.00042*s(3*Mp) + 0.00042*E*s(M+2*F) + 0.00038*E*s(M-2*F) - 0.00024*E*s(2*Mp-M) - 0.00017*s(Om)
      - 0.00007*s(Mp+2*M) + 0.00004*s(2*Mp-2*F) + 0.00004*s(3*M) + 0.00003*s(Mp+M-2*F) + 0.00003*s(2*Mp+2*F)
      - 0.00003*s(Mp+M+2*F) + 0.00003*s(Mp-M+2*F) - 0.00002*s(Mp-M-2*F) - 0.00002*s(3*Mp+M) + 0.00002*s(4*Mp);
  } else {
    corr = -0.62801*s(Mp) + 0.17172*E*s(M) - 0.01183*E*s(Mp+M) + 0.00862*s(2*Mp) + 0.00804*s(2*F)
      + 0.00454*E*s(Mp-M) + 0.00204*E*E*s(2*M) - 0.00180*s(Mp-2*F) - 0.00070*s(Mp+2*F) - 0.00040*s(3*Mp)
      - 0.00034*E*s(2*Mp-M) + 0.00032*E*s(M+2*F) + 0.00032*E*s(M-2*F) - 0.00028*E*E*s(Mp+2*M) + 0.00027*E*s(2*Mp+M)
      - 0.00017*s(Om) - 0.00005*s(Mp-M-2*F) + 0.00004*s(2*Mp+2*F) - 0.00004*s(Mp+M+2*F) + 0.00004*s(Mp-2*M)
      + 0.00003*s(Mp+M-2*F) + 0.00003*s(3*M) + 0.00002*s(2*Mp-2*F) + 0.00002*s(Mp-M+2*F) - 0.00002*s(3*Mp+M);
    const W = 0.00306 - 0.00038*E*c(M) + 0.00026*c(Mp) - 0.00002*c(Mp-M) + 0.00002*c(Mp+M) + 0.00002*c(2*F);
    corr += frac < 0.5 ? W : -W;
  }
  return jde + corr;
}
const PHASES = ['new','first','full','last'];
function phasesBetween(start, end){      // all principal phases between two Dates
  const out = [];
  const y = start.getUTCFullYear() + start.getUTCMonth()/12;
  let k = Math.floor((y - 2000) * 12.3685) - 1;
  for(;; k++){
    let done = false;
    for(let q=0;q<4;q++){
      const d = jdToDate(moonPhaseJDE(k + q/4) - DELTA_T);
      if(d > end){ done = true; break; }
      if(d >= start) out.push({ type:PHASES[q], date:d });
    }
    if(done) break;
  }
  return out;
}

const EQ_TERMS = [[485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],[156,73.14,45036.886],
 [136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],[70,243.58,9037.513],[58,119.81,33718.147],[52,297.17,150.678],
 [50,21.02,2281.226],[45,247.54,29929.562],[44,325.15,31555.956],[29,60.93,4443.417],[18,155.12,67555.328],[17,288.79,4562.452],
 [16,198.04,62894.029],[14,199.76,31436.921],[12,95.39,14577.848],[12,287.11,31931.756],[12,320.81,34777.259],[9,227.73,1222.114],[8,15.45,16859.074]];
function seasonDate(year, which){      // 0 March equinox, 1 June solstice, 2 September equinox, 3 December solstice
  const Y = (year-2000)/1000, Y2=Y*Y, Y3=Y2*Y, Y4=Y3*Y;
  const base = [
    2451623.80984 + 365242.37404*Y + 0.05169*Y2 - 0.00411*Y3 - 0.00057*Y4,
    2451716.56767 + 365241.62603*Y + 0.00325*Y2 + 0.00888*Y3 - 0.00030*Y4,
    2451810.21715 + 365242.01767*Y - 0.11575*Y2 + 0.00337*Y3 + 0.00078*Y4,
    2451900.05952 + 365242.74049*Y - 0.06223*Y2 - 0.00823*Y3 + 0.00032*Y4][which];
  const T = (base - 2451545)/36525, W = rad(35999.373*T - 2.47);
  const dl = 1 + 0.0334*Math.cos(W) + 0.0007*Math.cos(2*W);
  const S = EQ_TERMS.reduce((a,[A,B,C])=>a + A*Math.cos(rad(B + C*T)), 0);
  return jdToDate(base + 0.00001*S/dl - DELTA_T);
}


var FULL_NAMES = {
  en:['Wolf Moon','Snow Moon','Worm Moon','Pink Moon','Flower Moon','Strawberry Moon','Buck Moon','Sturgeon Moon','Harvest Moon',"Hunter's Moon",'Beaver Moon','Cold Moon'],
  lt:['Vilkų mėnulis','Sniego mėnulis','Kirmėlių mėnulis','Rožinis mėnulis','Žiedų mėnulis','Braškių mėnulis','Elnio mėnulis','Eršketų mėnulis','Derliaus mėnulis','Medžiotojų mėnulis','Bebrų mėnulis','Šalčio mėnulis']
};
/* EDIT HERE: where each sacred day leads */
function sabbats(year){
  function f(m, d, en, lt, href, go){ return { date:new Date(year, m, d, 12), kind:'sabbat', name:T(en, lt), href:href || 'calendar.html', go:go }; }
  function s(w, en, lt, href, go){ return { date:seasonDate(year, w), kind:'sabbat', name:T(en, lt), href:href || 'calendar.html', go:go }; }
  return [
    f(1, 1, 'Imbolc', 'Imbolkas'),
    s(0, 'Ostara · Spring Equinox', 'Ostara · Pavasario lygiadienis'),
    f(3, 30, 'Walpurgis Night', 'Valpurgijos naktis', 'lilith.html', T("Lilith's garden", 'Lilitos sodas')),
    f(4, 1, 'Beltane', 'Beltainas', 'aphrodite.html', T("Aphrodite's garden", 'Afroditės sodas')),
    s(1, 'Litha · Summer Solstice', 'Lita · Vasaros saulėgrįža'),
    f(5, 23, 'Rasos (Joninės)', 'Rasos (Joninės)'),
    f(7, 1, 'Lughnasadh', 'Lugnasadas'),
    s(2, 'Mabon · Autumn Equinox', 'Mabonas · Rudens lygiadienis'),
    f(9, 31, 'Samhain', 'Samhainas', 'nyx.html', T("Nyx's garden", 'Niktės sodas')),
    f(10, 2, 'Vėlinės', 'Vėlinės', 'nyx.html', T("Nyx's garden", 'Niktės sodas')),
    s(3, 'Yule · Winter Solstice', 'Jolė · Žiemos saulėgrįža')
  ];
}

var now = new Date();
function dayIndex(d){ return Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000 + 0.5); }
var from = new Date(now.getFullYear(), now.getMonth() - 2, 1), to = new Date(now.getFullYear(), now.getMonth() + 3, 1);
var phases = phasesBetween(from, to), ev = [];
phases.forEach(function(p){
  if (p.type === 'new') {
    var eve = new Date(p.date); eve.setDate(eve.getDate() - 1); eve.setHours(20, 0, 0, 0);
    ev.push({ date:eve, kind:'dark', name:T("Dark Moon · Hekate's Deipnon", 'Tamsusis mėnulis · Hekatės Deipnonas'), href:'hekate.html', go:T('Leave her supper at the crossroads', 'Palik jai vakarienę kryžkelėje') });
    ev.push({ date:p.date, kind:'new', name:T('New Moon · sacred to Kali', 'Jaunatis · šventa Kali'), href:'kali.html', go:T("Kali's garden", 'Kali sodas') });
  } else if (p.type === 'full') {
    ev.push({ date:p.date, kind:'full', name:T('Full Moon', 'Pilnatis') + ' · ' + FULL_NAMES[LANG][p.date.getMonth()], href:'tarot.html', go:T('Draw a card under her light', 'Ištrauk kortą jos šviesoje') });
  }
});
for (var y = from.getFullYear(); y <= to.getFullYear(); y++) ev = ev.concat(sabbats(y));
var ORDER = { sabbat:0, dark:1, full:2, new:3 };
ev.sort(function(a, b){ return a.date - b.date || ORDER[a.kind] - ORDER[b.kind]; });

var today = ev.filter(function(e){ return dayIndex(e.date) === 0; }).sort(function(a, b){ return ORDER[a.kind] - ORDER[b.kind]; })[0];
var next = ev.filter(function(e){ return dayIndex(e.date) > 0; })[0];

// the moon right now
var prevNew = null, nextNew = null;
phases.forEach(function(p){ if (p.type !== 'new') return; if (p.date <= now) prevNew = p.date; else if (!nextNew) nextNew = p.date; });
var f = prevNew && nextNew ? (now - prevNew) / (nextNew - prevNew) : 0;
var near = phases.filter(function(p){ return dayIndex(p.date) === 0; })[0];
var PN = { new:T('New Moon','Jaunatis'), first:T('First Quarter','Priešpilnis'), full:T('Full Moon','Pilnatis'), last:T('Last Quarter','Delčia') };
var lastP = phases.filter(function(p){ return p.date <= now; }).pop();
var BETWEEN = { new:T('Waxing Crescent','Jaunas mėnulis'), first:T('Waxing Gibbous','Augantis mėnulis'), full:T('Waning Gibbous','Dylantis mėnulis'), last:T('Waning Crescent','Senas mėnulis') };
var phaseName = near ? PN[near.type] : lastP ? BETWEEN[lastP.type] : '';

function moon(fr){
  var r = 46, k = Math.cos(2 * Math.PI * fr), rx = Math.abs(k) * r, wax = fr < .5, gib = k < 0;
  var d = 'M50 4 A46 46 0 0 ' + (wax ? 1 : 0) + ' 50 96 A' + rx.toFixed(2) + ' 46 0 0 ' + (wax ? (gib ? 1 : 0) : (gib ? 0 : 1)) + ' 50 4Z';
  var illum = (1 - k) / 2;
  var lit = illum > .995 ? '<circle cx="50" cy="50" r="46" fill="#efe6cf"/>' : illum < .005 ? '' : '<path d="' + d + '" fill="#efe6cf"/>';
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#1b1722" stroke="rgba(239,230,207,.35)" stroke-width="2"/>' + lit + '</svg>';
}
function days(n){ if (LANG !== 'lt') return n === 1 ? 'tomorrow' : 'in ' + n + ' days';
  if (n === 1) return 'rytoj'; var a = n % 10, b = n % 100; return 'po ' + n + ' ' + (a === 1 && b !== 11 ? 'dienos' : 'dienų'); }

var top, main, link, go;
if (today) {
  top = today.kind === 'dark' || today.kind === 'full' ? T('Tonight', 'Šiąnakt') : T('Today', 'Šiandien');
  main = today.name; link = today.href; go = today.go || T('Moon & Sabbats', 'Mėnulis ir šventės');
} else if (next) {
  var n = dayIndex(next.date);
  top = phaseName;
  main = (n === 1 ? T('Tomorrow: ', 'Rytoj: ') + next.name : next.name + ' ' + days(n));
  link = n === 1 && next.href ? next.href : 'calendar.html'; go = n === 1 && next.go ? next.go : T('Moon & Sabbats', 'Mėnulis ir šventės');
} else return;

var css = document.createElement('style');
css.textContent =
  '#templeTonight{display:inline-flex;align-items:center;gap:14px;margin-top:26px;padding:11px 20px 11px 12px;max-width:min(92vw,460px);' +
  'border:1px solid rgba(213,187,140,.32);background:rgba(7,7,8,.62);color:#e8dcc0;text-decoration:none;text-align:left;' +
  'font-family:Georgia,"Times New Roman",serif;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:background .25s,border-color .25s}' +
  '#templeTonight:hover{background:rgba(213,187,140,.1);border-color:rgba(213,187,140,.6)}' +
  '#templeTonight svg{width:38px;height:38px;flex:none;filter:drop-shadow(0 0 8px rgba(239,230,207,.35))}' +
  '#templeTonight .tt-top{display:block;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#a89878}' +
  '#templeTonight .tt-main{display:block;margin-top:3px;font-size:15px;line-height:1.35;color:#efe2c4}' +
  '#templeTonight .tt-go{display:block;margin-top:3px;font-size:12px;font-style:italic;color:#c9b38a}' +
  '#templeTonight.tt-now{border-color:rgba(213,187,140,.6);box-shadow:0 0 30px rgba(140,110,230,.18)}' +
  '@media (max-width:480px){#templeTonight{margin-top:20px;gap:11px;padding:9px 14px 9px 10px}#templeTonight svg{width:32px;height:32px}#templeTonight .tt-main{font-size:14px}}';
document.head.appendChild(css);

var a = document.createElement('a');
a.id = 'templeTonight'; a.href = link; if (today) a.className = 'tt-now';
a.innerHTML = moon(f) + '<span><span class="tt-top"></span><span class="tt-main"></span><span class="tt-go"></span></span>';
a.querySelector('.tt-top').textContent = top;
a.querySelector('.tt-main').textContent = main;
a.querySelector('.tt-go').textContent = go + ' →';

function place(){
  var btn = document.querySelector('.temple-content .enter-button');
  if (!btn) return false;
  var wrap = document.createElement('div'); wrap.appendChild(a);
  btn.insertAdjacentElement('afterend', wrap);
  return true;
}
if (!place()) document.addEventListener('DOMContentLoaded', place);
})();
