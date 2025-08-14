// assets/js/app.js

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmtDate = iso => {
  const d = new Date(iso + (iso.length<=10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
};
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

async function loadJSON(path){
  const res = await fetch(path,{cache:'no-store'});
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

(async function boot(){
  // footer year (safe no-op if missing)
  try { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); } catch {}

  const page = (document.body.dataset.page||'').trim();

  // HOME: hero grid uses 4 gallery covers if present
  if(page==='home'){
    const grid = $('.hero-grid');
    if(grid){
      let imgs = [];
      try {
        const gidx = await loadJSON('content/gallery/index.json');
        const files = gidx.files || gidx.items || [];
        for (const f of files.slice(0,4)){
          try {
            const item = await loadJSON(`content/gallery/${f}`);
            const src = item.cover || item.photo || (item.photos && item.photos[0]);
            if(src) imgs.push(src);
          } catch {}
        }
      } catch {}
      if(imgs.length===0){
        grid.innerHTML = `<div class="hero-tile"></div><div class="hero-tile"></div><div class="hero-tile"></div><div class="hero-tile"></div>`;
      } else {
        grid.innerHTML = imgs.slice(0,4).map(src => `<div class="hero-tile"><img src="${src}" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>`).join('');
      }
    }
  }

  // LEADERSHIP: featured (President/VP) + grid
  if(page==='leadership'){
    try{
      const data = await loadJSON('content/leadership.json');
      const members = data.members || [];

      const pres = members.find(m => /president/i.test(m.role) && !/vice/i.test(m.role));
      const vp   = members.find(m => /vice|vp/i.test(m.role));
      const others = members.filter(m => m !== pres && m !== vp);

      const f = $('#leadersFeatured');
      if(f){
        const items = [pres, vp].filter(Boolean).map(m => {
          const img = m.photo || 'assets/images/placeholder-avatar.png';
          return `
            <article class="leader-lg">
              <img src="${img}" alt="${m.name} – ${m.role}" loading="lazy" width="100" height="100" />
              <div>
                <h3>${m.name}</h3>
                <div class="role">${m.role}</div>
                ${m.email ? `<div><a href="mailto:${m.email}">${m.email}</a></div>`:''}
              </div>
            </article>`;
        }).join('');
        f.innerHTML = items || '<p class="muted">Add President and Vice President in CMS → Leadership.</p>';
      }

      const g = $('#leadersGrid');
      if(g){
        g.innerHTML = others.map(m=>{
          const img = m.photo || 'assets/images/placeholder-avatar.png';
          return `
            <article class="leader-sm">
              <img src="${img}" alt="${m.name} – ${m.role}" loading="lazy" width="90" height="90" />
              <h4>${m.name}</h4>
              <div class="role">${m.role}</div>
              ${m.email ? `<div><a href="mailto:${m.email}">${m.email}</a></div>`:''}
            </article>`;
        }).join('');
      }
    }catch{
      const f = $('#leadersFeatured');
      const g = $('#leadersGrid');
      if(f) f.innerHTML = '<p class="muted">Unable to load leadership yet.</p>';
      if(g) g.innerHTML = '';
    }
  }

  // EVENTS: single JSON per category (brotherhood, community-service, philanthropy)
  if(page==='events'){
    const categories = ['brotherhood','community-service','philanthropy'];
    let allEvents = [];
    for(const cat of categories){
      try{
        const data = await loadJSON(`content/events/${cat}.json`);
        const list = data.items || data.events || [];
        allEvents.push(...list.map(ev => ({...ev, category: cat})));
      }catch{}
    }
    allEvents.sort((a,b)=> new Date(a.date) - new Date(b.date));

    const filters = $('#eventFilters');
    const listEl  = $('#eventsList');

    function draw(list){
      if(!listEl) return;
      if(!list.length){ listEl.innerHTML = `<p class="muted" style="text-align:center">No events yet.</p>`; return; }
      listEl.innerHTML = list.map(ev=>{
        const thumb = ev.photo ? `<img class="thumb" src="${ev.photo}" alt="${ev.title}" loading="lazy"/>` : `<div class="thumb" aria-hidden="true"></div>`;
        const badge = `<span class="badge">${ev.category.replace('-',' ').toUpperCase()}</span>`;
        return `<article class="event">${thumb}<div class="date">${fmtDate(ev.date)}</div><h3>${ev.title}</h3><div>${badge}</div><p>${ev.description||''}</p><div><strong>Location:</strong> ${ev.location||'TBA'}</div></article>`;
      }).join('');
    }

    if(filters){
      filters.innerHTML = ['all',...categories].map(c=>`<button class="filter-chip ${c==='all'?'active':''}" data-cat="${c}">${c.replace('-',' ').replace(/\b\w/g,s=>s.toUpperCase())}</button>`).join('');
      $$('#eventFilters .filter-chip').forEach(b=>{
        b.addEventListener('click', ()=>{
          $$('#eventFilters .filter-chip').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const cat = b.dataset.cat;
          draw(cat==='all' ? allEvents : allEvents.filter(e=>e.category===cat));
        });
      });
    }
    draw(allEvents);
  }

  // GALLERY: basic grid using index.json (cover/photo)
  if(page==='gallery'){
    const grid = $('#galleryGrid');
    if(grid){
      try{
        const idx = await loadJSON('content/gallery/index.json');
        const files = idx.files || idx.items || [];
        const cards = [];
        for(const f of files){
          try{
            const album = await loadJSON(`content/gallery/${f}`);
            const cover = album.cover || album.photo || (album.photos && album.photos[0]) || 'assets/images/placeholder.jpg';
            cards.push(`<div class="gallery-item"><img src="${cover}" alt="${album.title||''}" loading="lazy"/><div class="meta"><h4>${album.title||''}</h4><p>${album.description||''}</p></div></div>`);
          }catch{}
        }
        grid.innerHTML = cards.join('') || '<p class="muted" style="text-align:center">No photos yet.</p>';
      }catch{
        grid.innerHTML = '<p class="muted" style="text-align:center">No photos yet.</p>';
      }
    }
  }

  // ALUMNI: RSVP + ICS
  if(page==='alumni'){
    let settings={}; try{ settings = await loadJSON('content/settings.json'); }catch{}
    const rsvp = settings.alumni?.homecoming2025?.rsvp_url || '#';
    const link = $('#rsvpLink'); if(link) link.href = rsvp;
    const btn = $('#addToCalendar');
    if(btn){
      btn.addEventListener('click', ()=>{
        const title='Delta Chi Purdue – Homecoming Tailgate & House Tour';
        const loc='501 N Russell St, West Lafayette, IN';
        const desc='House tour at 9:00 AM. Tailgate to follow. Family welcome!';
        const start='20251025T130000Z', end='20251025T160000Z';
        const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DX Purdue//Homecoming//EN','BEGIN:VEVENT',
        `UID:${crypto.randomUUID()}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
        `DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${title}`,`LOCATION:${loc}`,`DESCRIPTION:${desc}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
        const blob=new Blob([ics],{type:'text/calendar'}); const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download='dx-purdue-homecoming.ics'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      });
    }
  }

  // DONATE: tabs + goals + donor wall (netlify forms mode by default)
  if(page==='donate'){
    // tabs
    $$('.donate-tabs .tab-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        $$('.donate-tabs .tab-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
        $$('.form-card').forEach(p=>p.classList.remove('active'));
        $('#panel-'+b.dataset.tab).classList.add('active');
      });
    });

    // settings (links, forms mode)
    let settings={}; try{ settings = await loadJSON('content/settings.json'); }catch{}
    const donateUrl = settings.donate?.url || '#';
    const donateUrlFamily = settings.donate?.url_family || donateUrl;
    const set = (sel, url)=>{ const a=$(sel); if(a) a.href=url; };
    set('#donateLinkAlumni', donateUrl);
    set('#donateLinkFamily', donateUrlFamily);

    // goals
    let goals=[];
    try{ const g=await loadJSON('content/goals.json'); goals=g.goals||[]; }catch{}
    const wrap = $('#goalsList');
    if(wrap){
      wrap.innerHTML = goals.length ? goals.map(g=>{
        const goal=Number(g.goal_amount||0), current=Number(g.current_amount||0);
        const pct = goal>0 ? Math.round((current/goal)*100) : 0;
        return `<div class="goal"><h4>${g.title}</h4><div class="progress"><span style="width:${clamp(pct,0,100)}%"></span></div><div class="meta"><span>$${current.toLocaleString()} raised</span><span>Goal: $${goal.toLocaleString()} (${clamp(pct,0,100)}%)</span></div></div>`;
      }).join('') : `<p class="muted">No goals yet.</p>`;
    }

    // donors
    let donors=[];
    try{ const d=await loadJSON('content/donors.json'); donors=d.donors||[]; }catch{}
    const filters = $('#donorFilters'); const out = $('#donorList');
    if(filters && out){
      const kinds=['all','alumni','family'];
      filters.innerHTML = kinds.map(k=>`<button class="filter-chip ${k==='all'?'active':''}" data-kind="${k}">${k==='family'?'Parents/Family & Friends':k[0].toUpperCase()+k.slice(1)}</button>`).join('');
      function draw(kind){
        const list = (kind==='all')? donors : donors.filter(d=>d.type===kind);
        out.innerHTML = !list.length ? `<p class="muted" style="text-align:center">No acknowledgments yet.</p>` :
          list.map(d=>{
            const head=d.type==='family'?'Parents/Family & Friends':'Alumni';
            const who = d.type==='family' ? (d.related_to?`<div><strong>Supporting:</strong> ${d.related_to}</div>`:'') : (d.class_year?`<div><strong>Class Year:</strong> ${d.class_year}</div>`:'');
            const note = d.message ? `<div class="note">${d.message}</div>` : '';
            return `<article class="donor"><div class="kind">${head}</div><h4>${d.name||'Anonymous'}</h4>${who}${note}</article>`;
          }).join('');
      }
      draw('all');
      $$('#donorFilters .filter-chip').forEach(b=> b.addEventListener('click', ()=>{
        $$('#donorFilters .filter-chip').forEach(x=>x.classList.remove('active'));
        b.classList.add('active'); draw(b.dataset.kind);
      }));
    }
  }
})(); 
