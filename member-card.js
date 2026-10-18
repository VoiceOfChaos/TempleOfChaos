/* =========================================================
   TEMPLE OF CHAOS · member card
   A small window with a member's public profile.
   Open it with:  openMemberCard('Nickname')
   Used by the chat (index.html) and the Archive (archive.html).
   ========================================================= */
(function(){
    var SUPABASE_URL = "https://gdgraqxbannrdttmtwro.supabase.co";
    var SUPABASE_KEY = "sb_publishable_BPScsIo5l3fnkkcRAQu1Sw_rT7-R7JH";
    var lt = (function(){ try { var v = localStorage.getItem('temple-lang'); if (v === 'lt' || v === 'en') return v === 'lt'; } catch(e){}
        return (navigator.language || '').toLowerCase().indexOf('lt') === 0; })();
    function T(en, l){ return lt ? l : en; }
    function esc(x){ return String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    var PATHS = [
  ['chaos','Chaos magic','Chaoso magija'], ['luciferian','Luciferianism','Liuciferizmas'], ['lhp','Left-hand path','Kairiosios rankos kelias'],
  ['hellenic','Hellenic','Helėnų'], ['roman','Roman','Romėnų'], ['baltic','Baltic (Romuva)','Baltų (Romuva)'], ['slavic','Slavic','Slavų'],
  ['norse','Norse','Skandinavų'], ['celtic','Celtic','Keltų'], ['kemetic','Kemetic (Egyptian)','Kemetizmas (Egipto)'],
  ['mesopotamian','Mesopotamian','Mesopotamijos'], ['hindu','Hindu & Shakta','Induizmas ir šaktizmas'], ['buddhist','Buddhist & Tantric','Budizmas ir tantra'],
  ['wicca','Wicca','Vika'], ['witchcraft','Witchcraft','Raganavimas'], ['thelema','Thelema','Telema'], ['hermetic','Hermetic & Occult','Hermetizmas ir okultizmas'],
  ['demonolatry','Demonolatry','Demonolatrija'], ['shamanism','Shamanism & Animism','Šamanizmas ir animizmas'], ['folk','Folk magic','Liaudies magija'],
  ['eclectic','Eclectic','Eklektinis'], ['other','Other','Kitas']
];
    var GARDENS = { lucifer:['garden.html','Garden of Lucifer','Liuciferio sodas'], hekate:['hekate.html','Crossroads of Hekate','Hekatės kryžkelė'],
        kali:['kali.html','Garden of Kali Ma','Motinos Kali sodas'], lilith:['lilith.html','Garden of Lilith','Lilitos sodas'],
        nyx:['nyx.html','Garden of Nyx','Niktės sodas'], aphrodite:['aphrodite.html','Garden of Aphrodite','Afroditės sodas'] };
    var LEATHER = ['#5a1e24','#2b3d2a','#26304d','#4a2648','#4a3018','#1f3d3d','#6a4316','#3d1f1f','#2a2a2e','#3b2a55','#55302a','#1e3a2c'];
    function hashN(n){ var x = (Number(n) * 2654435761) >>> 0; x ^= x >>> 15; return x >>> 0; }
    function pathName(id){ for (var i = 0; i < PATHS.length; i++) if (PATHS[i][0] === id) return lt ? PATHS[i][2] : PATHS[i][1]; return id || ''; }

    var client = null, box = null;
    function getClient(){
        if (client) return Promise.resolve(client);
        return new Promise(function(ok, fail){
            function make(){ try { client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false, storageKey:'temple-membercard' } }); ok(client); } catch(e){ fail(e); } }
            if (window.supabase && window.supabase.createClient) return make();
            var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; s.onload = make; s.onerror = fail; document.head.appendChild(s);
        });
    }

    function build(){
        if (box) return;
        var st = document.createElement('style');
        st.textContent =
          '#memberCard{position:fixed;inset:0;z-index:2147483000 !important;display:none;align-items:center;justify-content:center;padding:16px;font-family:Georgia,"Times New Roman",serif}' +
          '#memberCard.on{display:flex}' +
          '#memberCard .mc-bg{position:absolute;inset:0;background:rgba(0,0,0,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}' +
          '#memberCard .mc-card{position:relative;width:min(460px,100%);max-height:calc(100dvh - 32px);overflow-y:auto;padding:30px 22px 24px;text-align:center;color:#e8e3d8;' +
            'border:1px solid rgba(213,187,140,.32);background:linear-gradient(160deg,#1c1614,#070708);box-shadow:0 30px 70px rgba(0,0,0,.7),inset 0 0 0 6px rgba(0,0,0,.25),inset 0 0 0 7px rgba(213,187,140,.14)}' +
          '#memberCard .mc-x{position:absolute;top:10px;right:10px;width:34px;height:34px;border:1px solid rgba(213,187,140,.3);background:rgba(7,7,8,.8);color:#d9c7a4;font-size:18px;cursor:pointer}' +
          '#memberCard .mc-seal{width:92px;height:92px;margin:0 auto;position:relative;color:#d6bc89;filter:drop-shadow(0 0 12px rgba(214,188,137,.3))}' +
          '#memberCard .mc-seal svg{position:absolute;inset:0;width:100%;height:100%}' +
          '#memberCard .mc-ini{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:34px;color:#f0e2c4}' +
          '#memberCard .mc-nick{margin-top:14px;font-weight:normal;font-size:26px;letter-spacing:.08em;color:#d6bc89;overflow-wrap:anywhere}' +
          '#memberCard .mc-keeper{display:inline-block;margin-top:8px;padding:3px 11px;border:1px solid rgba(213,187,140,.55);font-size:10px;letter-spacing:.2em;color:#f0e2c4;background:rgba(213,187,140,.1)}' +
          '#memberCard .mc-since{margin-top:8px;color:#82796e;font-size:13px;font-style:italic}' +
          '#memberCard .mc-facts{margin-top:20px;display:grid;gap:12px;text-align:left}' +
          '#memberCard .mc-k{font-size:10px;letter-spacing:.2em;color:#82796e;text-transform:uppercase}' +
          '#memberCard .mc-v{margin-top:3px;font-size:16px;line-height:1.55;color:#e4dbcd;white-space:pre-wrap;overflow-wrap:anywhere}' +
          '#memberCard .mc-stats{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
          '#memberCard .mc-stats div{border:1px solid rgba(213,187,140,.14);padding:10px 4px;background:rgba(0,0,0,.25)}' +
          '#memberCard .mc-stats b{display:block;font-weight:normal;font-size:20px;color:#f0e2c4}' +
          '#memberCard .mc-stats span{display:block;margin-top:2px;font-size:9px;letter-spacing:.14em;color:#82796e;text-transform:uppercase}' +
          '#memberCard .mc-fav{margin-top:12px;font-size:14px;color:#a89e90}#memberCard a{color:#d6bc89}' +
          '#memberCard .mc-books{margin-top:20px;text-align:left}' +
          '#memberCard .mc-books h4{font-weight:normal;font-size:11px;letter-spacing:.2em;color:#d6bc89;text-align:center}' +
          '#memberCard .mc-books a{display:flex;align-items:center;gap:10px;margin-top:8px;padding:9px 10px;border:1px solid rgba(213,187,140,.14);color:#e4dbcd;text-decoration:none;background:rgba(0,0,0,.2)}' +
          '#memberCard .mc-sp{width:9px;height:28px;flex:none;box-shadow:inset 0 0 0 1px rgba(232,207,149,.4)}' +
          '#memberCard .mc-note{margin-top:16px;color:#82796e;font-style:italic;font-size:14px}';
        document.head.appendChild(st);
        box = document.createElement('div');
        box.id = 'memberCard'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
        box.innerHTML = '<div class="mc-bg"></div><div class="mc-card"><button class="mc-x" type="button" aria-label="Close">×</button><div class="mc-body"></div></div>';
        document.body.appendChild(box);
        box.querySelector('.mc-bg').onclick = close; box.querySelector('.mc-x').onclick = close;
        document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
    }
    function close(){ if (box) box.classList.remove('on'); }

    var SEAL = (function(){
        var t = '', d = '';
        for (var i = 0; i < 8; i++) {
            var a = i * Math.PI / 4, b = a + Math.PI / 8;
            t += '<line x1="' + (60 + 50 * Math.cos(a)).toFixed(1) + '" y1="' + (60 + 50 * Math.sin(a)).toFixed(1) + '" x2="' + (60 + 56 * Math.cos(a)).toFixed(1) + '" y2="' + (60 + 56 * Math.sin(a)).toFixed(1) + '"/>';
            d += '<circle cx="' + (60 + 53 * Math.cos(b)).toFixed(1) + '" cy="' + (60 + 53 * Math.sin(b)).toFixed(1) + '" r="1.4"/>';
        }
        return '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor"><circle cx="60" cy="60" r="56" stroke-width="1.5"/><circle cx="60" cy="60" r="50" stroke-width=".8" opacity=".6"/><g stroke-width="1.2" opacity=".75">' + t + '</g><g fill="currentColor" stroke="none">' + d + '</g></svg>';
    })();

    function render(p){
        var since = new Date(p.member_since).toLocaleDateString(lt ? 'lt-LT' : 'en-GB', { year:'numeric', month:'long' });
        var g = p.favourite_garden && GARDENS[p.favourite_garden];
        var facts = [];
        if (p.path) facts.push([T('Path', 'Kelias'), pathName(p.path)]);
        if (p.patrons) facts.push([T('Patron deities', 'Globėjai'), p.patrons]);
        if (p.bio) facts.push([T('About', 'Apie'), p.bio]);
        var books = p.books || [];
        var here = /archive\.html$/.test(location.pathname);
        return '<div class="mc-seal">' + SEAL + '<div class="mc-ini">' + esc((p.nickname || '?').charAt(0).toUpperCase()) + '</div></div>' +
          '<h2 class="mc-nick">' + esc(p.nickname) + '</h2>' +
          (p.keeper ? '<div class="mc-keeper">✦ ' + T('TEMPLE KEEPER', 'ŠVENTYKLOS SERGĖTOJA') + ' ✦</div>' : '') +
          '<div class="mc-since">' + T('Member since ', 'Narys nuo ') + esc(since) + '</div>' +
          (facts.length ? '<div class="mc-facts">' + facts.map(function(f){ return '<div><div class="mc-k">' + esc(f[0]) + '</div><div class="mc-v">' + esc(f[1]) + '</div></div>'; }).join('') + '</div>'
                        : '<div class="mc-note">' + T('This member has not written about their path yet.', 'Šis narys dar neparašė apie savo kelią.') + '</div>') +
          '<div class="mc-stats"><div><b>' + books.length + '</b><span>' + T('Books', 'Knygos') + '</span></div><div><b>' + (p.offerings || 0) + '</b><span>' + T('Offerings', 'Aukos') + '</span></div><div><b>' + (p.comments || 0) + '</b><span>' + T('Comments', 'Komentarai') + '</span></div></div>' +
          (g ? '<div class="mc-fav">' + T('Walks most often in ', 'Dažniausiai lankosi: ') + '<a href="' + g[0] + '">' + esc(lt ? g[2] : g[1]) + '</a></div>' : '') +
          (books.length ? '<div class="mc-books"><h4>' + T('BOOKS IN THE ARCHIVE', 'KNYGOS ARCHYVE') + '</h4>' + books.map(function(b){
              return '<a href="' + (here ? '' : 'archive.html') + '#e/' + b.id + '" data-book><span class="mc-sp" style="background:' + LEATHER[hashN(b.id) % LEATHER.length] + '"></span><span>' + esc(b.title) + '</span></a>'; }).join('') + '</div>' : '');
    }

    window.openMemberCard = async function(nickname){
        if (!nickname) return;
        build();
        var body = box.querySelector('.mc-body');
        body.innerHTML = '<div class="mc-note">' + T('Opening…', 'Atveriama…') + '</div>';
        box.classList.add('on');
        try {
            var sb = await getClient();
            var r = await sb.rpc('temple_profile', { p_nickname: nickname });
            if (r.error) throw r.error;
            body.innerHTML = r.data ? render(r.data) : '<div class="mc-note">' + T('No member with this nickname.', 'Nėra nario tokiu slapyvardžiu.') + '</div>';
            body.querySelectorAll('[data-book]').forEach(function(a){ a.addEventListener('click', close); });
        } catch(e) {
            console.error('Member card could not load', e);
            body.innerHTML = '<div class="mc-note">' + T('The profile could not be opened.', 'Profilio nepavyko atverti.') + '</div>';
        }
    };
})();
