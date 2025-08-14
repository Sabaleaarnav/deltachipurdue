const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
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
  // common
  try { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); } catch {}

  const page = document.body.dataset.page || "";

  // load shared content if needed
  let settings = {};
  try { settings = await loadJSON('content/settings.json'); } catch {}

  // HOME: hero grid uses up to 4 gallery images (or just shows subtle tiles)
  if(page==='home'){
    const grid = $('.hero-grid');
    if(grid){
      let imgs = [];
      try {
        const gidx = await loadJSON('content/gallery/index.json');
        for(const f of gidx.files.slice(0,4)){
          const item = await loadJSON(`content/gallery/${f}`);
          if(item.photo) imgs.push(item.photo);
        }
      } catch {}
      if(imgs.length===0){
        grid.innerHTML = `<div class="hero-tile"></div><div class="hero-tile"></div><div class="hero-tile"></div><div class="hero-tile"></div>`;
      } else {
        grid.innerHTML = imgs.slice(0,4).map(src => `<div class="hero-tile"><img src="${src}" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>`).join('');
      }
    }
  }

  // ABOUT: leadership
  if(page==='about'){
    try{
      const leadership = await loadJSON('content/leadership.json');
      const lg = $('#leadershipGrid');
      if(lg){
        lg.innerHTML = leadership.members.map(m=>{
          const img = m.photo || 'assets/images/placeholder-avatar.png';
          return `
            <article class="leader">
              <img src="${img}" alt="${m.name} – ${m.role}" loading="lazy"/>
              <h4>${m.name}</h4>
              <div class="role">${m.role}</div>
              ${m.email ? `<div><a href="mailto:${m.email}">${m.email}</a></div>`:''}
            </article>`;
        }).join('');
      }
    } catch {}
  }

  // LEADERSHIP: featured + tabbed groups
if (page === 'leadership') {
  (async function(){
    try{
      const data = await loadJSON('content/leadership.json');
      const members = data.members || [];

      // helpers
      const photoOr = (m)=> m.photo || 'assets/images/placeholder-avatar.png';
      const cardSM = (m)=>`
        <article class="leader-sm">
          <img src="${photoOr(m)}" alt="${m.name} – ${m.role}" loading="lazy"/>
          <h4>${m.name}</h4>
          <div class="role">${m.role}</div>
          ${m.email ? `<div><a href="mailto:${m.email}">${m.email}</a></div>`:''}
        </article>`;

      // sort into groups
      const isRecruit = m => /recruitment/i.test(m.role);
      const isAmc     = m => /associate\s*member\s*counselor/i.test(m.role);

      const execAll = members.filter(m => !isRecruit(m) && !isAmc(m));
      const pres = execAll.find(m => /president/i.test(m.role) && !/vice/i.test(m.role));
      const vp   = execAll.find(m => /vice|vp/i.test(m.role));
      const execOthers = execAll.filter(m => m !== pres && m !== vp);

      const recruits = members.filter(isRecruit);
      const amc = members.filter(isAmc);

      // featured
      const featured = document.getElementById('leadersFeatured');
      if (featured){
        if (pres || vp){
          featured.innerHTML = [pres, vp].filter(Boolean).map(m=>`
            <article class="leader-lg">
              <img src="${photoOr(m)}" alt="${m.name} – ${m.role}" loading="lazy"/>
              <div><h3>${m.name}</h3><div class="role">${m.role}</div>
              ${m.email ? `<div><a href="mailto:${m.email}">${m.email}</a></div>`:''}</div>
            </article>`).join('');
        } else featured.style.display = 'none';
      }

      // fill grids
      const fill = (id, list)=>{ const el = document.getElementById(id); if(el) el.innerHTML = list.map(cardSM).join(''); }
      fill('leadersExec', execOthers);
      fill('leadersRecruit', recruits);
      fill('leadersAmc', amc);

      // tabs
      const tabs = document.getElementById('leaderTabs');
      tabs?.addEventListener('click', (e)=>{
        const b = e.target.closest('.filter-chip'); if(!b) return;
        tabs.querySelectorAll('.filter-chip').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        const tab = b.dataset.tab;
        document.getElementById('leadersFeatured').style.display = (tab==='exec' ? '' : 'none');
        document.getElementById('leadersExec').style.display = (tab==='exec' ? '' : 'none');
        document.getElementById('leadersRecruit').style.display = (tab==='recruit' ? '' : 'none');
        document.getElementById('leadersAmc').style.display = (tab==='amc' ? '' : 'none');
      });
    }catch(e){
      document.getElementById('leadersExec').innerHTML = '<p class="muted">Leadership coming soon.</p>';
    }
  })();
}



  // EVENTS (+ filters)
if(page==='events'){
  // combined philanthropy+fundraising under "philanthropy"
  const categories = ['brotherhood','community-service','philanthropy'];

  let allEvents = [];
  for (const cat of categories){
    try {
      const data = await loadJSON(`content/events/${cat}.json`);
      const list = data.items || data.events || [];
      allEvents.push(...list.map(ev => ({...ev, category: cat})));
    } catch {}
  }
  allEvents.sort((a,b)=> new Date(a.date) - new Date(b.date));

  const filters = $('#eventFilters');
  const listEl  = $('#eventsList');

  function draw(list){
    if(!listEl) return;
    if(!list.length){
      listEl.innerHTML = `<p class="muted" style="text-align:center">No events yet.</p>`;
      return;
    }
    listEl.innerHTML = list.map(ev=>{
      const thumb = ev.photo
        ? `<img class="thumb" src="${ev.photo}" alt="${ev.title}" loading="lazy"/>`
        : `<div class="thumb" aria-hidden="true"></div>`;
      const badge = `<span class="badge">${ev.category.replace('-',' ').toUpperCase()}</span>`;
      return `
        <article class="event">
          ${thumb}
          <div class="date">${fmtDate(ev.date)}</div>
          <h3>${ev.title}</h3>
          <div>${badge}</div>
          <p>${ev.description||''}</p>
          <div><strong>Location:</strong> ${ev.location||'TBA'}</div>
        </article>`;
    }).join('');
  }

  if(filters){
    filters.innerHTML = ['all',...categories]
      .map(c=>`<button class="filter-chip ${c==='all'?'active':''}" data-cat="${c}">
        ${c.replace('-',' ').replace(/\b\w/g,s=>s.toUpperCase())}
      </button>`).join('');

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

    // build filter chips
    if(filters){
      filters.innerHTML = ['all',...categories]
        .map(c=>`<button class="filter-chip ${c==='all'?'active':''}" data-cat="${c}">
                    ${c.replace('-',' ').replace(/\b\w/g,s=>s.toUpperCase())}
                  </button>`).join('');
      $$('#eventFilters .filter-chip').forEach(b=>{
        b.addEventListener('click', ()=>{
          $$('#eventFilters .filter-chip').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const cat=b.dataset.cat;
          draw(cat==='all' ? all : all.filter(e=>e.category===cat));
        });
      });
    }

    draw(all);
  })();
}

// INITIATIVES (Programs) — simple list per category
if (page === 'initiatives') {
  const cats = ['brotherhood','community-service','philanthropy','fundraising'];
  const tabs = $('#initTabs');
  const out  = $('#initList');

  (async ()=>{
    let data = {};
    try {
      const res = await fetch('content/initiatives.json', {cache:'no-store'});
      data = await res.json();
    } catch { data = {}; }

    function draw(cat){
      const items = Array.isArray(data[cat]) ? data[cat] : [];
      if(!items.length){ out.innerHTML = `<p class="muted" style="text-align:center">No items yet.</p>`; return; }
      out.innerHTML = items.map(i=>`
        <article class="card">
          <h3>${i.title||''}</h3>
          <p>${i.description||''}</p>
        </article>`).join('');
    }

    // build tabs
    if(tabs){
      tabs.innerHTML = cats.map((c,i)=>`<button class="tab-btn ${i===0?'active':''}" data-k="${c}">
        ${c.replace('-',' ').replace(/\b\w/g,s=>s.toUpperCase())}
      </button>`).join('');
      $$('#initTabs .tab-btn').forEach(b=>{
        b.addEventListener('click', ()=>{
          $$('#initTabs .tab-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          draw(b.dataset.k);
        });
      });
    }
    draw(cats[0]);
  })();
}



  // ALUMNI: RSVP + ICS
  if(page==='alumni'){
    const rsvp = settings.alumni?.homecoming2025?.rsvp_url || '#';
    const link = $('#rsvpLink'); if(link) link.href = rsvp;
    const btn = $('#addToCalendar');
    if(btn){
      btn.addEventListener('click', ()=>{
        const title='Delta Chi Purdue – Homecoming Tailgate & House Tour';
        const loc='501 N Russell St, West Lafayette, IN';
        const desc='House tour at 9:00 AM. Tailgate to follow. We can’t wait to see you back at the house!';
        const start='20251025T130000Z', end='20251025T160000Z';
        const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DX Purdue//Homecoming//EN','BEGIN:VEVENT',
        `UID:${crypto.randomUUID()}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
        `DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${title}`,`LOCATION:${loc}`,`DESCRIPTION:${desc}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
        const blob=new Blob([ics],{type:'text/calendar'}); const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download='dx-purdue-homecoming.ics'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      });
    }
  }

  // DONATE: tabs, forms, goals, donor wall
  if(page==='donate'){
    // tabs
    $$('.donate-tabs .tab-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        $$('.donate-tabs .tab-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
        $$('.form-card').forEach(p=>p.classList.remove('active'));
        $('#panel-'+b.dataset.tab).classList.add('active');
      });
    });

    const donateUrl = settings.donate?.url || '#';
    const donateUrlFamily = settings.donate?.url_family || donateUrl;
    const set = (id, url)=>{ const a=$(id); if(a) a.href=url; };
    set('#donateLinkAlumni', donateUrl);
    set('#donateLinkFamily', donateUrlFamily);
    const copy = (btnId, url)=>{ const b=$(btnId); if(b) b.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(url); alert('Link copied!'); }catch{} }); };
    copy('#copyDonateLinkAlumni', donateUrl);
    copy('#copyDonateLinkFamily', donateUrlFamily);

    const mode = settings.forms?.mode || 'netlify';
    const alumniForm = $('#alumniForm'); const familyForm = $('#familyForm');

    if(mode==='formspree'){
      const alumniEndpoint = settings.forms?.alumni_endpoint || '';
      const familyEndpoint = settings.forms?.family_endpoint || '';
      const wire = (form, endpoint)=>{
        if(!form || !endpoint) return;
        form.addEventListener('submit', async (e)=>{
          e.preventDefault();
          const data = new FormData(form);
          try{
            const res = await fetch(endpoint,{method:'POST', body:data, headers:{'Accept':'application/json'}});
            if(res.ok){ alert('Thanks!'); form.reset(); }
            else alert('Submission failed.');
          }catch{ alert('Network error.'); }
        });
      };
      wire(alumniForm, alumniEndpoint); wire(familyForm, familyEndpoint);
    } else if(mode==='disabled'){
      const dis = f => f?.addEventListener('submit', e=>{ e.preventDefault(); alert('Form disabled'); });
      dis(alumniForm); dis(familyForm);
    } // netlify mode: nothing extra to do

    // goals
    let goals=[];
    try{ const g=await loadJSON('content/goals.json'); goals=g.goals||[]; }catch{}
    const wrap = $('#goalsList');
    if(wrap){
      if(!goals.length){ wrap.innerHTML = `<p class="muted">No goals yet.</p>`; }
      else {
        wrap.innerHTML = goals.map(g=>{
          const goal=Number(g.goal_amount||0), current=Number(g.current_amount||0);
          const pct = goal>0 ? Math.round((current/goal)*100) : 0;
          return `<div class="goal"><h4>${g.title}</h4><div class="progress"><span style="width:${clamp(pct,0,100)}%"></span></div><div class="meta"><span>$${current.toLocaleString()} raised</span><span>Goal: $${goal.toLocaleString()} (${clamp(pct,0,100)}%)</span></div></div>`;
        }).join('');
      }
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
})().catch(e=>console.error(e));
