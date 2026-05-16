/**
 * Delta Chi Purdue — App logic
 * Reveal animations, lightbox, page data loaders.
 */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function loadJSON(path) {
    try {
      const r = await fetch(path, { cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      console.warn(`[loadJSON] ${path}:`, e.message);
      return null;
    }
  }

  function initReveal(root = document) {
    if (reduceMotion) {
      $$('.reveal', root).forEach(el => el.classList.add('visible'));
      return;
    }
    const els = $$('.reveal:not(.visible)', root);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    els.forEach(el => io.observe(el));
  }

  function initLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    const img = $('#lightbox-img');
    const close = $('.lightbox-close', lb);

    document.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const src = item.querySelector('img');
      if (!src) return;
      img.src = src.src;
      img.alt = src.alt || '';
      lb.classList.add('open');
      document.body.classList.add('no-scroll');
    });
    const dismiss = () => { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); };
    close && close.addEventListener('click', dismiss);
    lb.addEventListener('click', e => { if (e.target === lb) dismiss(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) dismiss(); });
  }

  /* -------- HOME -------- */
  async function initHome() {
    // Alumni spotlight
    const spotEl = $('#alumni-spotlight');
    if (spotEl) {
      const data = await loadJSON('content/alumni-spotlights.json');
      const s = data?.spotlights?.[0];
      if (s) {
        const quoteEl  = $('.spotlight-quote', spotEl);
        const nameEl   = $('.spotlight-name', spotEl);
        const titleEl  = $('.spotlight-title', spotEl);
        const photoEl  = $('.spotlight-author-photo', spotEl);
        if (quoteEl && s.quote) quoteEl.textContent = s.quote;
        if (nameEl) nameEl.textContent = s.name || '';
        if (titleEl) {
          const t = [s.title, s.company].filter(Boolean).join(' · ');
          titleEl.textContent = t;
        }
        if (photoEl && s.photo) photoEl.src = s.photo;
      }
    }
  }

  /* -------- LEADERSHIP -------- */
  async function initLeadership() {
    const data = await loadJSON('content/leadership.json');
    if (!data || !data.members) return;

    const members = data.members;
    const cleanPath = p => (!p ? 'assets/images/placeholder-avatar.svg' : p.replace(/^\//, ''));

    const isRecruit = m => /recruitment/i.test(m.role);
    const isAMC = m => /associate\s*member\s*counselor|amc/i.test(m.role);
    const isHouseMom = m => /house\s*mom/i.test(m.role);
    const isPres = m => /^president$/i.test(m.role);
    const isVP = m => /vice\s*president|^vp$/i.test(m.role);

    const president = members.find(isPres);
    const vp = members.find(isVP);
    const exec = members.filter(m => !isRecruit(m) && !isAMC(m) && !isPres(m) && !isVP(m) && !isHouseMom(m));
    const recruiters = members.filter(isRecruit);
    const amcs = members.filter(isAMC);
    const houseMom = members.find(isHouseMom);

    const featCard = m => `
      <article class="leader-feat-card reveal">
        <div class="leader-feat-photo"><img src="${cleanPath(m.photo)}" alt="${m.name}" loading="lazy"></div>
        <div class="leader-feat-body">
          <div class="leader-feat-role">${m.role}</div>
          <h3 class="leader-feat-name">${m.name}</h3>
          ${m.email ? `<a class="leader-feat-email" href="mailto:${m.email}">${m.email}</a>` : ''}
        </div>
      </article>
    `;

    const card = (m, i) => `
      <article class="leader-card reveal r-${(i % 6) + 1}">
        <div class="leader-card-photo"><img src="${cleanPath(m.photo)}" alt="${m.name}" loading="lazy"></div>
        <div class="leader-card-role">${m.role}</div>
        <div class="leader-card-name">${m.name}</div>
        ${m.email ? `<a class="leader-card-email" href="mailto:${m.email}">${m.email}</a>` : ''}
      </article>
    `;

    const featEl = $('#leaders-featured');
    const execEl = $('#leaders-exec');
    const recEl  = $('#leaders-recruit');
    const amcEl  = $('#leaders-amc');
    const hmEl   = $('#leaders-housemom');

    if (featEl) {
      const feat = [president, vp].filter(Boolean);
      featEl.innerHTML = feat.map(featCard).join('');
    }
    if (execEl) execEl.innerHTML = exec.map(card).join('');
    if (recEl)  recEl.innerHTML  = recruiters.length ? recruiters.map(card).join('') : '<div class="empty-state">Recruitment team coming soon.</div>';
    if (amcEl)  amcEl.innerHTML  = amcs.length ? amcs.map(card).join('') : '<div class="empty-state">No AMCs listed yet.</div>';
    if (hmEl && houseMom) hmEl.innerHTML = card(houseMom, 0);

    const tabs = $('#leader-tabs');
    if (tabs) {
      tabs.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        $$('.tab-btn', tabs).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        const map = { exec: ['featured','exec'], recruit: ['recruit'], amc: ['amc'], house: ['housemom'] };
        ['featured','exec','recruit','amc','housemom'].forEach(k => {
          const el = $(`#leaders-${k}`);
          if (!el) return;
          el.style.display = map[tab]?.includes(k) ? '' : 'none';
        });
      });
    }
    initReveal();
  }

  /* -------- EVENTS -------- */
  async function initEvents() {
    const cats = ['alumni','brotherhood','community-service','philanthropy','fundraising','social','academic'];
    const all = [];
    for (const c of cats) {
      const d = await loadJSON(`content/events/${c}.json`);
      if (d?.items) all.push(...d.items.map(it => ({ ...it, category: c })));
    }
    all.sort((a,b) => new Date(b.date || '1900-01-01') - new Date(a.date || '1900-01-01'));

    const filters = $('#event-filters');
    const list = $('#events-list');

    const fmt = iso => {
      if (!iso) return { day: '—', rest: 'Date TBA' };
      const d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
      return {
        day: d.toLocaleDateString('en-US', { day: 'numeric' }),
        rest: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
        weekday: d.toLocaleDateString('en-US', { weekday: 'long' })
      };
    };

    const draw = (events) => {
      if (!list) return;
      if (!events.length) {
        list.innerHTML = '<div class="empty-state">No events to show yet — check back soon.</div>';
        return;
      }
      list.innerHTML = events.map(ev => {
        const dt = fmt(ev.date);
        const catLabel = ev.category.replace(/-/g, ' ');
        return `
          <article class="event-row reveal">
            <div class="event-date">
              <span class="event-date-day">${dt.day}</span>
              <span class="event-date-rest">${dt.rest}</span>
            </div>
            <div class="event-body">
              <div class="event-cat">${catLabel}</div>
              <h3 class="event-title">${ev.title || 'Untitled'}</h3>
              ${ev.description ? `<p class="event-desc">${ev.description}</p>` : ''}
              ${ev.location ? `<div class="event-loc">${ev.location}</div>` : ''}
            </div>
            <div class="event-time">${dt.weekday || ''}</div>
          </article>
        `;
      }).join('');
      initReveal();
    };

    if (filters) {
      const present = [...new Set(all.map(e => e.category))];
      filters.innerHTML = `
        <button class="filter-chip active" data-cat="all">All</button>
        ${present.map(c => `<button class="filter-chip" data-cat="${c}">${c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>`).join('')}
      `;
      filters.addEventListener('click', e => {
        const b = e.target.closest('.filter-chip');
        if (!b) return;
        $$('.filter-chip', filters).forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const c = b.dataset.cat;
        draw(c === 'all' ? all : all.filter(ev => ev.category === c));
      });
    }
    draw(all);
  }

  /* -------- GALLERY -------- */
  async function initGallery() {
    const grid = $('#gallery-grid');
    if (!grid) return;
    const data = await loadJSON('content/gallery/index.json');
    let items = data?.items || [];

    // Fallback: surface any images from /assets/images/ that exist as visual content if no gallery
    if (!items.length) {
      const fallback = [
        '20250405_233957_306a00.jpeg',
        '20250405_233957_387929.jpeg',
        '20250401_230352_39d3ef.jpeg',
        '20250627_132405_347af0.jpeg',
        '20250627_132405_374d18.jpeg',
        '20250627_132405_31029c.jpeg'
      ];
      items = fallback.map(f => ({ title: '', description: '', photo: `assets/images/${f}` }));
    }

    grid.innerHTML = items.map(it => {
      const src = (it.photo || '').replace(/^\//, '');
      return `
        <div class="gallery-item reveal">
          <img src="${src}" alt="${it.title || 'Delta Chi Purdue'}" loading="lazy">
          ${(it.title || it.description) ? `
            <div class="gallery-overlay">
              <div>
                ${it.title ? `<h4>${it.title}</h4>` : ''}
                ${it.description ? `<p>${it.description}</p>` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    initReveal();
    initLightbox();
  }

  /* -------- ALUMNI -------- */
  async function initAlumni() {
    const settings = await loadJSON('content/settings.json');

    const rsvp = $('#rsvp-link');
    if (rsvp && settings?.alumni?.homecoming2025?.rsvp_url) rsvp.href = settings.alumni.homecoming2025.rsvp_url;

    const calBtn = $('#add-to-calendar');
    if (calBtn) {
      calBtn.addEventListener('click', () => {
        const title = 'Delta Chi Purdue — Homecoming Tailgate & House Tour';
        const loc = '501 N Russell St, West Lafayette, IN';
        const desc = 'House tour at 9:00 AM. Tailgate to follow.';
        const start = '20251025T130000Z';
        const end   = '20251025T180000Z';
        const ics = [
          'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Delta Chi Purdue//Homecoming//EN',
          'BEGIN:VEVENT',
          `UID:${(crypto.randomUUID && crypto.randomUUID()) || Date.now()}@deltachipurdue`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
          `DTSTART:${start}`, `DTEND:${end}`,
          `SUMMARY:${title}`, `LOCATION:${loc}`, `DESCRIPTION:${desc}`,
          'END:VEVENT','END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'dx-purdue-homecoming.ics';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      });
    }

    const nl = $('#newsletter-list');
    if (nl) {
      const data = await loadJSON('content/newsletters.json');
      const items = data?.newsletters || [];
      if (items.length) {
        nl.innerHTML = items.slice(0, 8).map(n => {
          const d = n.date ? new Date(n.date + (n.date.length <= 10 ? 'T00:00:00' : '')) : null;
          const ds = d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          return `<a class="newsletter-item" href="${n.url || '#'}" target="_blank" rel="noopener">
            <span class="newsletter-item-title">${n.title}</span>
            <span class="newsletter-item-date">${ds}</span>
          </a>`;
        }).join('');
      } else {
        nl.innerHTML = '<div class="newsletter-empty">Our newsletter archive is being assembled. Subscribe to be notified when the first issue ships.</div>';
      }
    }
  }

  /* -------- DONATE -------- */
  async function initDonate() {
    const settings = await loadJSON('content/settings.json');
    const donateAlumni = $('#donate-link-alumni');
    const donateFamily = $('#donate-link-family');
    if (donateAlumni && settings?.donate?.url) donateAlumni.href = settings.donate.url;
    if (donateFamily && settings?.donate?.url_family) donateFamily.href = settings.donate.url_family;

    $$('.donate-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.donate-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.donate-panel').forEach(p => p.classList.remove('active'));
        $(`#panel-${btn.dataset.tab}`)?.classList.add('active');
      });
    });

    const goalsList = $('#goals-list');
    if (goalsList) {
      const data = await loadJSON('content/goals.json');
      const goals = data?.goals || [];
      if (goals.length) {
        goalsList.innerHTML = goals.map(g => {
          const goal = Number(g.goal_amount || 0);
          const cur  = Number(g.current_amount || 0);
          const pct  = goal > 0 ? Math.min(100, Math.round((cur / goal) * 100)) : 0;
          return `
            <div class="goal-card reveal">
              <div class="goal-header">
                <span class="goal-title">${g.title}</span>
                <span class="goal-amount">$${cur.toLocaleString()} / $${goal.toLocaleString()}</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:0%" data-pct="${pct}"></div></div>
            </div>
          `;
        }).join('');
        // Animate fill after layout
        setTimeout(() => {
          $$('.progress-fill').forEach(f => { f.style.width = f.dataset.pct + '%'; });
        }, 200);
      } else {
        goalsList.innerHTML = '<div class="empty-state">No active goals listed.</div>';
      }
    }

    const donorFilters = $('#donor-filters');
    const donorList = $('#donor-list');
    if (donorFilters && donorList) {
      const dd = await loadJSON('content/donors.json');
      const donors = dd?.donors || [];
      const draw = (type) => {
        const filtered = type === 'all' ? donors : donors.filter(d => d.type === type);
        if (!filtered.length) {
          donorList.innerHTML = '<div class="empty-state">Be the first to add your name to the donor wall.</div>';
          return;
        }
        donorList.innerHTML = filtered.map(d => `
          <div class="donor-card reveal">
            <span class="donor-badge">${d.type === 'family' ? 'Family & Friends' : 'Alumni'}</span>
            <div class="donor-name">${d.name || 'Anonymous'}</div>
            ${d.type === 'alumni' && d.class_year ? `<div class="donor-detail">Class of ${d.class_year}</div>` : ''}
            ${d.type === 'family' && d.related_to ? `<div class="donor-detail">Supporting ${d.related_to}</div>` : ''}
            ${d.message ? `<div class="donor-message">"${d.message}"</div>` : ''}
          </div>
        `).join('');
        initReveal();
      };
      donorFilters.innerHTML = `
        <button class="filter-chip active" data-type="all">All</button>
        <button class="filter-chip" data-type="alumni">Alumni</button>
        <button class="filter-chip" data-type="family">Family & Friends</button>
      `;
      donorFilters.addEventListener('click', e => {
        const b = e.target.closest('.filter-chip');
        if (!b) return;
        $$('.filter-chip', donorFilters).forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        draw(b.dataset.type);
      });
      draw('all');
    }

    initReveal();
  }

  /* -------- INITIATIVES -------- */
  async function initInitiatives() {
    const data = await loadJSON('content/initiatives.json');
    if (!data) return;
    const cats = ['brotherhood', 'community-service', 'philanthropy', 'fundraising'];
    const tabsEl = $('#init-tabs');
    const listEl = $('#init-list');

    const draw = (cat) => {
      const items = data[cat] || [];
      if (!items.length) {
        listEl.innerHTML = '<div class="empty-state">No initiatives in this category yet.</div>';
        return;
      }
      listEl.innerHTML = items.map((it, i) => `
        <article class="init-card reveal r-${(i % 4) + 1}">
          <span class="init-card-tag">${cat.replace(/-/g, ' ')}</span>
          <h3>${it.title}</h3>
          <p>${it.description}</p>
        </article>
      `).join('');
      initReveal();
    };

    if (tabsEl) {
      tabsEl.innerHTML = cats.map((c, i) => `
        <button class="tab-btn ${i === 0 ? 'active' : ''}" data-cat="${c}">
          ${c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </button>
      `).join('');
      tabsEl.addEventListener('click', e => {
        const b = e.target.closest('.tab-btn');
        if (!b) return;
        $$('.tab-btn', tabsEl).forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        draw(b.dataset.cat);
      });
    }
    draw(cats[0]);
  }

  /* -------- INIT -------- */
  async function init() {
    initReveal();
    const page = document.body.dataset.page || '';
    switch (page) {
      case 'home':         await initHome(); break;
      case 'leadership':   await initLeadership(); break;
      case 'events':       await initEvents(); break;
      case 'gallery':      await initGallery(); break;
      case 'alumni':       await initAlumni(); break;
      case 'donate':       await initDonate(); break;
      case 'initiatives':  await initInitiatives(); break;
    }
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
