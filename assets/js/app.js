// --- helpers ---
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmtDate = (iso) => {
  const d = new Date(iso + (iso.length<=10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
};
const by = (k) => (a,b)=> (a[k]||'').localeCompare(b[k]||'');

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
    // collapse mobile menu
    const menu = $('.nav-menu');
    if(menu.classList.contains('open')) {
      menu.classList.remove('open');
      $('.nav-toggle').setAttribute('aria-expanded','false');
    }
  });
});
// mobile toggler
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

  // Events: gather from subfolders
  const categories = ['alumni','community-service','philanthropy','social','brotherhood','academic'];
  let allEvents = [];
  for(const cat of categories){
    try{
      const indexRes = await fetch(`content/events/${cat}/index.json`,{cache:'no-store'});
      if(indexRes.ok){
        const list = await indexRes.json(); // list of file names
        for(const f of list.files){
          const ev = await loadJSON(`content/events/${cat}/${f}`);
          ev.category = cat;
          allEvents.push(ev);
        }
      }
    }catch{}
  }
  allEvents.sort((a,b)=> new Date(a.date) - new Date(b.date));

  // Gallery (optional index of files)
  let gallery = [];
  try{
    const gidx = await loadJSON('content/gallery/index.json');
    for(const f of gidx.files){
      const item = await loadJSON(`content/gallery/${f}`);
      gallery.push(item);
    }
  }catch{ /* fine if empty */ }

  // Render leadership
  const lg = $('#leadershipGrid');
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

  // Render events
  renderEventFilters(categories);
  renderEvents(allEvents);

  function renderEventFilters(cats){
    const el = $('#eventFilters');
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
  let heroImgs = (gallery.filter(g=>g.photo).slice(0,4).map(g=>g.photo));
  if(heroImgs.length<4){
    while(heroImgs.length<4) heroImgs.push('assets/images/placeholder-hero.jpg');
  }
  hero.innerHTML = heroImgs.map(src=>`<img src="${src}" alt="" loading="lazy"/>`).join('');

  // Alumni CTA: RSVP & ICS
  const rsvp = settings.alumni?.homecoming2025?.rsvp_url || '#';
  $('#rsvpLink').href = rsvp;

  $('#addToCalendar').addEventListener('click', ()=>{
    // Oct 25, 2025 09:00-12:00 ET
    const title = 'Delta Chi Purdue – Homecoming Tailgate & House Tour';
    const loc = '501 N Russell St, West Lafayette, IN';
    const desc = 'House tour at 9:00 AM. Tailgate to follow. We can’t wait to see you back at the house!';
    // Convert ET to UTC for ICS: 2025-10-25T09:00:00-04:00 -> 13:00Z
    const start = '20251025T130000Z';
    const end   = '20251025T160000Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DX Purdue//Homecoming//EN',
      'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `LOCATION:${loc}`,
      `DESCRIPTION:${desc}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], {type:'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dx-purdue-homecoming.ics';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  // Donate
  const donateUrl = settings.donate?.url || '#';
  $('#donateLink').href = donateUrl;
  $('#copyDonateLink').addEventListener('click', async ()=>{
    try { await navigator.clipboard.writeText(donateUrl); alert('Donation link copied!'); }
    catch { /* ignore */ }
  });

  // tiny inline QR (no external libs)
  if(donateUrl && donateUrl !== '#'){
    makeQr($('#donateQr'), donateUrl, 128);
  }

})().catch(err=>{
  console.error(err);
});

// Minimal QR generator (tiny, basic)
function makeQr(el, text, size=128){
  // Simple canvas QR via third-party-free approach (placeholder pattern if QR lib not used)
  // For production-grade QR, drop a small library; here we render a fallback copy link box.
  el.innerHTML = `<div style="text-align:center;padding:.8rem">Scan not available – use the Donate button or copied link above.</div>`;
}
