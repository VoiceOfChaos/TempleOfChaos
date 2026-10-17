/* =========================================================
   TEMPLE OF CHAOS · who is in the Temple right now
   Every page that includes this file counts as "in the Temple".
   The page with  <script src="presence.js" data-show="true">  also shows:
   "✦ 12 members · 3 in the Temple now"
   ========================================================= */
(function(){
    var SUPABASE_URL = "https://gdgraqxbannrdttmtwro.supabase.co";
    var SUPABASE_KEY = "sb_publishable_BPScsIo5l3fnkkcRAQu1Sw_rT7-R7JH";
    var me = document.currentScript;
    var show = me && me.getAttribute('data-show') === 'true';
    var lt = false;
    try { var v = localStorage.getItem('temple-lang'); lt = v ? v === 'lt' : (navigator.language || '').toLowerCase().indexOf('lt') === 0; } catch(e){}

    var box = null, members = null, online = 1;
    function draw(){
        if (!box) return;
        var parts = [];
        if (members !== null) parts.push(lt ? 'Narių: <b>' + members + '</b>' : '<b>' + members + '</b> ' + (members === 1 ? 'member' : 'members'));
        parts.push(lt ? 'Dabar Šventykloje: <b>' + online + '</b>' : '<b>' + online + '</b> in the Temple now');
        box.innerHTML = '<span class="tp-dot"></span>' + parts.join(' <span class="tp-sep">·</span> ');
        box.style.opacity = '1';
    }
    function makeBox(){
        var st = document.createElement('style');
        st.textContent =
          '#templePresence{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:90;display:flex;align-items:center;gap:8px;' +
          'padding:7px 14px;border:1px solid rgba(213,187,140,.32);background:rgba(7,7,8,.78);color:#cdbf9f;font-family:Georgia,"Times New Roman",serif;' +
          'font-size:12px;letter-spacing:.06em;white-space:nowrap;opacity:0;transition:opacity .4s ease;pointer-events:none;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}' +
          '#templePresence b{color:#ecdcb4;font-weight:normal}' +
          '#templePresence .tp-sep{opacity:.5}' +
          '#templePresence .tp-dot{width:7px;height:7px;border-radius:50%;background:#8fd18b;box-shadow:0 0 8px #8fd18b;animation:tpPulse 2.4s ease-in-out infinite}' +
          '@keyframes tpPulse{50%{opacity:.45}}' +
          'body.temple-popup-open #templePresence,body.temple-chrome-hidden #templePresence{opacity:0 !important}' +
          '@media (max-width:420px){#templePresence{font-size:11px;padding:6px 11px;bottom:10px}}';
        document.head.appendChild(st);
        box = document.createElement('div');
        box.id = 'templePresence';
        box.setAttribute('aria-live', 'polite');
        document.body.appendChild(box);
    }

    function start(){
        if (!window.supabase || !window.supabase.createClient) return;
        var sb;
        try {
            sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false, storageKey:'temple-presence' }
            });
        } catch(e){ return; }
        if (show) {
            makeBox(); draw();
            sb.rpc('temple_member_count').then(function(r){ if (!r.error && typeof r.data === 'number') { members = r.data; draw(); } });
        }
        var key = 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        var ch = sb.channel('temple-presence', { config: { presence: { key: key } } });
        ch.on('presence', { event: 'sync' }, function(){
            online = Math.max(1, Object.keys(ch.presenceState()).length);
            draw();
        });
        ch.subscribe(function(status){
            if (status === 'SUBSCRIBED') ch.track({ page: location.pathname.split('/').pop() || 'index.html', at: Date.now() });
        });
    }

    function boot(){
        if (window.supabase && window.supabase.createClient) return start();
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload = start;
        document.head.appendChild(s);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
