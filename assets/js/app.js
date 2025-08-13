// --- helpers ---
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmtDate = (iso) => {
  const d = new Date(iso + (iso.length<=10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
};
const clamp = (n,min,max)=> Math.max(min, Math.min(max, n));

// --- SPA nav ---
const links = $$('.nav-link');
const sections = $$('.section');
links.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    links.forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const id = a.dataset.section;
    sections.forEach(s=>s.classList.toggle('active', s.id===id));
    const menu = $('.nav-menu');
    if(menu.classList.contains('open')) {
      menu.classList.remove('open');
      $('.nav-toggle').setAttribute('aria-expanded','false');
    }
  });
});
$('.nav-toggle').addEventListener('click', ()=>{
  const menu = $('.nav-menu');
  menu.classList.toggle('open');
  $('.nav-toggle').setAttribute('aria-expanded', menu.classList.contains('open') ? 'true':'false');
});

// --- dynamic content sources ---
async function loadJSON(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

(async function init(){
  $('#year').textContent = new Date().getFullYear();

  // Load settings & content
  const settings = await loadJSON('content/settings.json');
  const leadership = await loadJSON('content/leadership.json');

  // Events
  const categories = ['alumni','community-service','philanthropy','social','brotherhood','academic'];
  let allEvents = [];
  for(const cat of categories){
    try{
      const indexRes = await fetch(`content/events/${cat}/index.json`,{cache:'no-store'});
      if(indexRes.ok){
        const list = await indexRes.json();
        for(const f of list.files){
          const ev = await loadJSON(`content/events/${cat}/${f}`);
          ev.category = cat;
          allEvents.push(ev);
        }
      }
    }catch{}
  }
  allEvents.sort((a,b)=> new Date(a.date) - new Date(b.date));

  // Gallery (optional)
  let gallery = [];
  try{
    const gidx = await loadJSON('content/gallery/index.json');
    for(const f of gidx.files){
      const item = await loadJSON(`content/gallery/${f}`);
      gallery.push(item);
    }
  }catch{}

  // Donors & Goals
  let donors = [];
  try{
    const d = await loadJSON('content/donors.json');
    donors = d.donors || [];
  }catch{}
  let goals = [];
  try{
    const g = await loadJSON('content/goals.json');
    goals = g.goals || [];
  }catch{}

  // Render leadership
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

  // Render events
  renderEventFilters(categories);
  renderEvents(allEvents);

  function renderEventFilters(cats){
    const el = $('#eventFilters');
    if(!el) return;
    el.innerHTML = ['all', ...cats].map(cat=>{
      const label = cat.replace('-',' ').replace(/\b\w/g,s=>s.toUpperCase());
      return `<button class="filter-chip${cat==='all'?' active':''}" data-cat="${cat}">${label}</button>`;
    }).join('');
    $$('#eventFilters .filter-chip').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        $$('#eventFilters .filter-chip').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        const list = (cat==='all') ? allEvents : allEvents.filter(e=>e.category===cat);
        renderEvents(list);
      });
    });
  }

  function renderEvents(list){
    const el = $('#eventsList');
    if(!el) return;
    if(!list.length){
      el.innerHTML = `<p style="text-align:center;color:#666">No events yet.</p>`;
      return;
    }
    el.innerHTML = list.map(ev=>{
      const thumb = ev.photo ? `<img class="thumb" src="${ev.photo}" alt="${ev.title}" loading="lazy"/>`
                             : `<div class="thumb" aria-hidden="true"></div>`;
      const badge = `<span class="badge">${ev.category.replace('-',' ').toUpperCase()}</span>`;
      return `
        <article class="event">
          ${thumb}
          <div class="date">${fmtDate(ev.date)}</div>
          <h3>${ev.title}</h3>
          <div>${badge}</div>
          <p>${ev.description||''}</p>
          <div class="where"><strong>Location:</strong> ${ev.location||'TBA'}</div>
        </article>`;
    }).join('');
  }

  // Hero mosaic (use up to 4 gallery images or placeholders)
  const hero = $('#heroPhotos');
  if(hero){
    let heroImgs = (gallery.filter(g=>g.photo).slice(0,4).map(g=>g.photo));
    if(heroImgs.length<4){
      while(heroImgs.length<4) heroImgs.push('assets/images/placeholder-hero.jpg');
    }
    hero.innerHTML = heroImgs.map(src=>`<img src="${src}" alt="" loading="lazy"/>`).join('');
  }

  // Alumni CTA: RSVP & ICS in Alumni section (unchanged from earlier)
  if($('#rsvpLink')){
    const rsvp = settings.alumni?.homecoming2025?.rsvp_url || '#';
    $('#rsvpLink').href = rsvp;
  }
  if($('#addToCalendar')){
    $('#addToCalendar').addEventListener('click', ()=>{
      const title = 'Delta Chi Purdue – Homecoming Tailgate & House Tour';
      const loc = '501 N Russell St, West Lafayette, IN';
      const desc = 'House tour at 9:00 AM. Tailgate to follow. We can’t wait to see you back at the house!';
      const start = '20251025T130000Z';
      const end   = '20251025T160000Z';
      const ics = [
        'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DX Purdue//Homecoming//EN','BEGIN:VEVENT',
        `UID:${crypto.randomUUID()}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
        `DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${title}`,`LOCATION:${loc}`,`DESCRIPTION:${desc}`,
        'END:VEVENT','END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([ics], {type:'text/calendar'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'dx-purdue-homecoming.ics';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });
  }

  // --- Donate tab logic ---

  // Tabs
  $$('.donate-tabs .tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.donate-tabs .tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      $$('.donate-panels .form-card').forEach(p=>p.classList.remove('active'));
      $(`#panel-${tab}`).classList.add('active');
      // focus first input
      const first = $(`#panel-${tab} input`);
      if(first) first.focus({preventScroll:true});
    });
  });

  // Donation links (Alumni & Family can be separate if desired)
  const donateUrl = settings.donate?.url || '#';
  const donateUrlFamily = settings.donate?.url_family || donateUrl;

  if($('#donateLinkAlumni')) $('#donateLinkAlumni').href = donateUrl;
  if($('#donateLinkFamily')) $('#donateLinkFamily').href = donateUrlFamily;

  if($('#copyDonateLinkAlumni')){
    $('#copyDonateLinkAlumni').addEventListener('click', async ()=>{
      try { await navigator.clipboard.writeText(donateUrl); alert('Alumni donation link copied!'); } catch {}
    });
  }
  if($('#copyDonateLinkFamily')){
    $('#copyDonateLinkFamily').addEventListener('click', async ()=>{
      try { await navigator.clipboard.writeText(donateUrlFamily); alert('Family/Friends donation link copied!'); } catch {}
    });
  }

  // Forms: Netlify (built-in) OR Formspree (if configured in settings.forms)
  const formMode = settings.forms?.mode || 'netlify'; // 'netlify' | 'formspree' | 'disabled'
  const alumniEndpoint = settings.forms?.alumni_endpoint || '';
  const familyEndpoint = settings.forms?.family_endpoint || '';

  function wireFormSpree(formEl, endpoint){
    formEl.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(!endpoint){ alert('Form endpoint not configured yet.'); return; }
      const data = new FormData(formEl);
      try{
        const res = await fetch(endpoint, { method:'POST', body: data, headers: { 'Accept': 'application/json' }});
        if(res.ok){ alert('Thanks! Your acknowledgment was received.'); formEl.reset(); }
        else{ alert('Submission failed. Please try again later.'); }
      }catch{ alert('Network error. Please try again.'); }
    });
  }

  if(formMode === 'formspree'){
    const af = $('#alumniForm'); const ff = $('#familyForm');
    if(af) wireFormSpree(af, alumniEndpoint);
    if(ff) wireFormSpree(ff, familyEndpoint);
  } else if(formMode === 'disabled'){
    const disable = f => f?.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Form submissions are disabled on this host.'); });
    disable($('#alumniForm')); disable($('#familyForm'));
  }
  // If 'netlify', no extra wiring needed—Netlify will capture posts.

  // Goals render (manual values, optional override via Netlify function later)
  renderGoals(goals);
  async function renderGoals(items){
    const wrap = $('#goalsList');
    if(!wrap) return;
    if(!items.length){ wrap.innerHTML = `<p class="muted">No goals yet. Add one in CMS → Goals.</p>`; return; }

    // try override via function if configured
    const useAuto = settings.goals?.use_function === true;
    let totals = {};
    if(useAuto){
      try{
        const res = await fetch('/api/goal-total'); // Netlify function path (see docs below)
        if(res.ok){ totals = await res.json(); } // expected { [slug]: current_amount }
      }catch{}
    }

    wrap.innerHTML = items.map(g=>{
      const goal = Number(g.goal_amount||0);
      const current = Number((useAuto && totals[g.slug]!=null) ? totals[g.slug] : (g.current_amount||0));
      const pct = goal>0 ? Math.round((current/goal)*100) : 0;
      return `
        <div class="goal" data-slug="${g.slug}">
          <h4>${g.title}</h4>
          <div class="progress" aria-label="Progress"><span style="width:${clamp(pct,0,100)}%"></span></div>
          <div class="meta"><span>$${current.toLocaleString()} raised</span><span>Goal: $${goal.toLocaleString()} (${clamp(pct,0,100)}%)</span></div>
        </div>
      `;
    }).join('');
  }

  // Donor filters + list
  renderDonors(donors);
  function renderDonors(list){
    const filters = $('#donorFilters');
    const out = $('#donorList');
    if(!filters || !out) return;

    const kinds = ['all','alumni','family'];
    filters.innerHTML = kinds.map(k=>{
      const label = k==='family' ? 'Parents/Family & Friends' : k[0].toUpperCase()+k.slice(1);
      return `<button class="filter-chip${k==='all'?' active':''}" data-kind="${k}">${label}</button>`;
    }).join('');

    function draw(kind){
      const filtered = (kind==='all') ? list : list.filter(d=>d.type===kind);
      if(!filtered.length){ out.innerHTML = `<p class="muted" style="text-align:center">No acknowledgments yet.</p>`; return; }
      out.innerHTML = filtered.map(d=>{
        const head = d.type==='family' ? 'Parents/Family & Friends' : 'Alumni';
        const who = d.type==='family' ? `<div><strong>Supporting:</strong> ${d.related_to||''}</div>` : (d.class_year ? `<div><strong>Class Year:</strong> ${d.class_year}</div>` : '');
        const note = d.message ? `<div class="note">${d.message}</div>` : '';
        return `
          <article class="donor">
            <div class="kind">${head}</div>
            <h4>${d.name||'Anonymous'}</h4>
            ${who}
            ${note}
          </article>
        `;
      }).join('');
    }
    draw('all');

    $$('#donorFilters .filter-chip').forEach(b=>{
      b.addEventListener('click', ()=>{
        $$('#donorFilters .filter-chip').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        draw(b.dataset.kind);
      });
    });
  }

})().catch(err=>{ console.error(err); });
