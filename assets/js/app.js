/**
 * Delta Chi Purdue — Main Application
 * Page-specific logic, animations, and content loading
 */

(function() {
  'use strict';
  
  // ========================================
  // UTILITIES
  // ========================================
  
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  
  const formatDate = (iso) => {
    if (!iso) return 'TBA';
    const date = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateShort = (iso) => {
    if (!iso) return 'TBA';
    const date = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
  
  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return res.json();
    } catch (e) {
      console.warn(`Could not load ${path}:`, e);
      return null;
    }
  }
  
  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  
  function initScrollAnimations() {
    const elements = $$('.fade-in, .fade-in-up, .scale-in');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
  }
  
  // ========================================
  // LIGHTBOX
  // ========================================
  
  function initLightbox() {
    const lightbox = $('#lightbox');
    if (!lightbox) return;
    
    const lightboxImg = $('#lightbox-img');
    const closeBtn = $('.lightbox-close', lightbox);
    
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('open');
          document.body.classList.add('no-scroll');
        }
      }
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
  
  // ========================================
  // PAGE: HOME
  // ========================================
  
  async function initHomePage() {
    // Load alumni spotlight
    const spotlightSection = $('#alumni-spotlight');
    if (spotlightSection) {
      try {
        const data = await loadJSON('content/alumni-spotlights.json');
        if (data && data.spotlights && data.spotlights.length > 0) {
          const s = data.spotlights[0];
          const container = spotlightSection.querySelector('.spotlight-content');
          if (container) {
            container.innerHTML = `
              <blockquote class="spotlight-quote">${s.quote || 'Quote coming soon...'}</blockquote>
              <div class="spotlight-author">
                ${s.photo ? `<img src="${s.photo}" alt="${s.name}" class="spotlight-avatar">` : ''}
                <div>
                  <div class="spotlight-name">${s.name || 'Alumni Name'}</div>
                  <div class="spotlight-title">${s.title || ''} ${s.company ? '• ' + s.company : ''}</div>
                </div>
              </div>
            `;
          }
        }
      } catch (e) {}
    }
    
    // Load career outcomes
    const careersGrid = $('#careers-grid');
    if (careersGrid) {
      try {
        const data = await loadJSON('content/careers.json');
        if (data && data.placements && data.placements.length > 0) {
          careersGrid.innerHTML = data.placements.slice(0, 6).map(p => `
            <div class="career-card fade-in">
              ${p.logo ? `<img src="${p.logo}" alt="${p.company}" class="career-card-logo">` : ''}
              <div class="career-card-company">${p.company}</div>
              <div class="career-card-role">${p.role}</div>
              <div class="career-card-year">${p.year}</div>
            </div>
          `).join('');
          initScrollAnimations();
        }
      } catch (e) {}
    }
  }
  
  // ========================================
  // PAGE: LEADERSHIP
  // ========================================
  
  async function initLeadershipPage() {
    const data = await loadJSON('content/leadership.json');
    if (!data || !data.members) return;
    
    const members = data.members;
    const defaultPhoto = 'assets/images/placeholder-avatar.png';
    const getPhoto = (m) => m.photo || defaultPhoto;
    
    const createFeaturedCard = (m) => `
      <div class="leader-featured fade-in">
        <img src="${getPhoto(m)}" alt="${m.name}" class="leader-featured-image" loading="lazy">
        <div class="leader-featured-info">
          <h3>${m.name}</h3>
          <div class="leader-featured-role">${m.role}</div>
          ${m.email ? `<a href="mailto:${m.email}" class="leader-featured-email">${m.email}</a>` : ''}
        </div>
      </div>
    `;
    
    const createCard = (m) => `
      <div class="leader-card fade-in">
        <img src="${getPhoto(m)}" alt="${m.name}" class="leader-image" loading="lazy">
        <div class="leader-name">${m.name}</div>
        <div class="leader-role">${m.role}</div>
        ${m.email ? `<a href="mailto:${m.email}" class="leader-email">${m.email}</a>` : ''}
      </div>
    `;
    
    const isRecruit = (m) => /recruitment/i.test(m.role);
    const isAMC = (m) => /associate\s*member\s*counselor|amc/i.test(m.role);
    const isPresident = (m) => /^president$/i.test(m.role);
    const isVP = (m) => /vice\s*president|^vp$/i.test(m.role);
    
    const president = members.find(isPresident);
    const vp = members.find(isVP);
    const execOthers = members.filter(m => !isRecruit(m) && !isAMC(m) && !isPresident(m) && !isVP(m));
    const recruiters = members.filter(isRecruit);
    const amcs = members.filter(isAMC);
    
    const featuredEl = $('#leaders-featured');
    const execEl = $('#leaders-exec');
    const recruitEl = $('#leaders-recruit');
    const amcEl = $('#leaders-amc');
    
    if (featuredEl) {
      const featured = [president, vp].filter(Boolean);
      featuredEl.innerHTML = featured.length > 0 
        ? featured.map(createFeaturedCard).join('') 
        : '';
      if (featured.length === 0) featuredEl.style.display = 'none';
    }
    
    if (execEl) execEl.innerHTML = execOthers.map(createCard).join('');
    if (recruitEl) recruitEl.innerHTML = recruiters.length ? recruiters.map(createCard).join('') : '<p class="empty-state">Coming soon</p>';
    if (amcEl) amcEl.innerHTML = amcs.length ? amcs.map(createCard).join('') : '<p class="empty-state">Coming soon</p>';
    
    // Tabs
    const tabs = $('#leader-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        
        $$('.tab-btn', tabs).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        if (featuredEl) featuredEl.style.display = tab === 'exec' ? '' : 'none';
        if (execEl) execEl.style.display = tab === 'exec' ? '' : 'none';
        if (recruitEl) recruitEl.style.display = tab === 'recruit' ? '' : 'none';
        if (amcEl) amcEl.style.display = tab === 'amc' ? '' : 'none';
      });
    }
    
    initScrollAnimations();
  }
  
  // ========================================
  // PAGE: EVENTS
  // ========================================
  
  async function initEventsPage() {
    const categories = ['alumni', 'brotherhood', 'community-service', 'philanthropy', 'fundraising', 'social', 'academic'];
    let allEvents = [];
    
    // Load all events
    for (const cat of categories) {
      const data = await loadJSON(`content/events/${cat}.json`);
      if (data && data.items) {
        allEvents.push(...data.items.map(item => ({ ...item, category: cat })));
      }
    }
    
    // Sort by date
    allEvents.sort((a, b) => new Date(a.date || '2100-01-01') - new Date(b.date || '2100-01-01'));
    
    const filtersEl = $('#event-filters');
    const listEl = $('#events-list');
    
    const drawEvents = (events) => {
      if (!listEl) return;
      if (!events.length) {
        listEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>No events yet. Check back soon!</p></div>';
        return;
      }
      
      listEl.innerHTML = events.map(ev => `
        <article class="event-card fade-in">
          <div class="event-card-image">
            ${ev.photo ? `<img src="${ev.photo}" alt="${ev.title || ''}" loading="lazy">` : '<div class="placeholder-image">📷</div>'}
          </div>
          <div class="event-card-body">
            <span class="event-card-badge">${ev.category.replace(/-/g, ' ')}</span>
            <div class="event-card-date">${formatDate(ev.date)}</div>
            <h3 class="event-card-title">${ev.title || 'Untitled Event'}</h3>
            ${ev.description ? `<p>${ev.description}</p>` : ''}
            <div class="event-card-location">📍 ${ev.location || 'TBA'}</div>
          </div>
        </article>
      `).join('');
      
      initScrollAnimations();
    };
    
    // Build filters
    if (filtersEl) {
      const availableCats = [...new Set(allEvents.map(e => e.category))];
      filtersEl.innerHTML = `
        <button class="filter-chip active" data-cat="all">All</button>
        ${availableCats.map(cat => `
          <button class="filter-chip" data-cat="${cat}">${cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>
        `).join('')}
      `;
      
      filtersEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (!btn) return;
        
        $$('.filter-chip', filtersEl).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const cat = btn.dataset.cat;
        drawEvents(cat === 'all' ? allEvents : allEvents.filter(ev => ev.category === cat));
      });
    }
    
    drawEvents(allEvents);
  }
  
  // ========================================
  // PAGE: GALLERY
  // ========================================
  
  async function initGalleryPage() {
    const grid = $('#gallery-grid');
    if (!grid) return;
    
    const data = await loadJSON('content/gallery/index.json');
    if (!data || !data.items || !data.items.length) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📷</div><p>Photos coming soon!</p></div>';
      return;
    }
    
    grid.innerHTML = data.items.map(item => `
      <div class="gallery-item fade-in">
        <img src="${item.photo}" alt="${item.title || ''}" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-caption">
            <h4>${item.title || ''}</h4>
            <p>${item.description || ''}</p>
          </div>
        </div>
      </div>
    `).join('');
    
    initScrollAnimations();
    initLightbox();
  }
  
  // ========================================
  // PAGE: ALUMNI
  // ========================================
  
  async function initAlumniPage() {
    const settings = await loadJSON('content/settings.json');
    
    // RSVP link
    const rsvpLink = $('#rsvp-link');
    if (rsvpLink && settings?.alumni?.homecoming2025?.rsvp_url) {
      rsvpLink.href = settings.alumni.homecoming2025.rsvp_url;
    }
    
    // Calendar download
    const calBtn = $('#add-to-calendar');
    if (calBtn) {
      calBtn.addEventListener('click', () => {
        const title = 'Delta Chi Purdue – Homecoming Tailgate & House Tour';
        const location = '501 N Russell St, West Lafayette, IN';
        const description = 'House tour at 9:00 AM. Tailgate to follow. We can\'t wait to see you back at the house!';
        const start = '20251025T130000Z';
        const end = '20251025T180000Z';
        
        const ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Delta Chi Purdue//Homecoming//EN',
          'BEGIN:VEVENT',
          `UID:${crypto.randomUUID()}`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART:${start}`,
          `DTEND:${end}`,
          `SUMMARY:${title}`,
          `LOCATION:${location}`,
          `DESCRIPTION:${description}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');
        
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dx-purdue-homecoming.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }
    
    // Newsletter list
    const newsletterList = $('#newsletter-list');
    if (newsletterList) {
      const data = await loadJSON('content/newsletters.json');
      if (data && data.newsletters && data.newsletters.length > 0) {
        newsletterList.innerHTML = data.newsletters.slice(0, 5).map(n => `
          <a href="${n.url}" target="_blank" rel="noopener" class="newsletter-item">
            <span class="newsletter-item-title">${n.title}</span>
            <span class="newsletter-item-date">${formatDateShort(n.date)}</span>
          </a>
        `).join('');
      } else {
        newsletterList.innerHTML = '<p class="newsletter-empty">No newsletters yet. Subscribe to be notified!</p>';
      }
    }
  }
  
  // ========================================
  // PAGE: DONATE
  // ========================================
  
  async function initDonatePage() {
    const settings = await loadJSON('content/settings.json');
    
    // Donation links
    const donateAlumni = $('#donate-link-alumni');
    const donateFamily = $('#donate-link-family');
    
    if (donateAlumni && settings?.donate?.url) {
      donateAlumni.href = settings.donate.url;
    }
    if (donateFamily && settings?.donate?.url_family) {
      donateFamily.href = settings.donate.url_family;
    }
    
    // Tabs
    $$('.donate-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.donate-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.donate-panel').forEach(p => p.classList.remove('active'));
        $(`#panel-${btn.dataset.tab}`)?.classList.add('active');
      });
    });
    
    // Goals
    const goalsList = $('#goals-list');
    if (goalsList) {
      const goalsData = await loadJSON('content/goals.json');
      if (goalsData && goalsData.goals && goalsData.goals.length > 0) {
        goalsList.innerHTML = goalsData.goals.map(g => {
          const goal = Number(g.goal_amount || 0);
          const current = Number(g.current_amount || 0);
          const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
          return `
            <div class="goal-card fade-in">
              <div class="goal-header">
                <span class="goal-title">${g.title}</span>
                <span class="goal-amount">$${current.toLocaleString()} / $${goal.toLocaleString()}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${clamp(pct, 0, 100)}%"></div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        goalsList.innerHTML = '<p class="empty-state">No active goals right now.</p>';
      }
    }
    
    // Donors
    const donorFilters = $('#donor-filters');
    const donorList = $('#donor-list');
    
    if (donorFilters && donorList) {
      const donorData = await loadJSON('content/donors.json');
      const donors = donorData?.donors || [];
      
      const drawDonors = (type) => {
        const filtered = type === 'all' ? donors : donors.filter(d => d.type === type);
        if (!filtered.length) {
          donorList.innerHTML = '<p class="empty-state">No donors to display yet. Be the first!</p>';
          return;
        }
        
        donorList.innerHTML = filtered.map(d => `
          <div class="donor-card fade-in">
            <span class="donor-badge">${d.type === 'family' ? 'Family & Friends' : 'Alumni'}</span>
            <div class="donor-name">${d.name || 'Anonymous'}</div>
            ${d.type === 'alumni' && d.class_year ? `<div class="donor-detail">Class of ${d.class_year}</div>` : ''}
            ${d.type === 'family' && d.related_to ? `<div class="donor-detail">Supporting ${d.related_to}</div>` : ''}
            ${d.message ? `<div class="donor-message">"${d.message}"</div>` : ''}
          </div>
        `).join('');
        
        initScrollAnimations();
      };
      
      donorFilters.innerHTML = `
        <button class="filter-chip active" data-type="all">All</button>
        <button class="filter-chip" data-type="alumni">Alumni</button>
        <button class="filter-chip" data-type="family">Family & Friends</button>
      `;
      
      donorFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (!btn) return;
        $$('.filter-chip', donorFilters).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawDonors(btn.dataset.type);
      });
      
      drawDonors('all');
    }
    
    initScrollAnimations();
  }
  
  // ========================================
  // PAGE: RUSH
  // ========================================
  
  async function initRushPage() {
    // Load career outcomes for rush page too
    const careersGrid = $('#rush-careers-grid');
    if (careersGrid) {
      const data = await loadJSON('content/careers.json');
      if (data && data.placements && data.placements.length > 0) {
        careersGrid.innerHTML = data.placements.map(p => `
          <div class="career-card fade-in">
            ${p.logo ? `<img src="${p.logo}" alt="${p.company}" class="career-card-logo">` : ''}
            <div class="career-card-company">${p.company}</div>
            <div class="career-card-role">${p.role}</div>
            <div class="career-card-year">${p.year}</div>
          </div>
        `).join('');
      } else {
        careersGrid.innerHTML = '<p class="empty-state">Internship data coming soon!</p>';
      }
    }
    
    initScrollAnimations();
  }
  
  // ========================================
  // PAGE: INITIATIVES
  // ========================================
  
  async function initInitiativesPage() {
    const data = await loadJSON('content/initiatives.json');
    if (!data) return;
    
    const categories = ['brotherhood', 'community-service', 'philanthropy', 'fundraising'];
    const tabs = $('#init-tabs');
    const list = $('#init-list');
    
    const drawCategory = (cat) => {
      const items = data[cat] || [];
      if (!items.length) {
        list.innerHTML = '<p class="empty-state">No initiatives in this category yet.</p>';
        return;
      }
      
      list.innerHTML = items.map(item => `
        <div class="initiative-card fade-in">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `).join('');
      
      initScrollAnimations();
    };
    
    if (tabs) {
      tabs.innerHTML = categories.map((cat, i) => `
        <button class="tab-btn ${i === 0 ? 'active' : ''}" data-cat="${cat}">
          ${cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </button>
      `).join('');
      
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        $$('.tab-btn', tabs).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawCategory(btn.dataset.cat);
      });
    }
    
    drawCategory(categories[0]);
  }
  
  // ========================================
  // INITIALIZATION
  // ========================================
  
  async function init() {
    const page = document.body.dataset.page || '';
    
    // Common initialization
    initScrollAnimations();
    
    // Page-specific initialization
    switch (page) {
      case 'home':
        await initHomePage();
        break;
      case 'leadership':
        await initLeadershipPage();
        break;
      case 'events':
        await initEventsPage();
        break;
      case 'gallery':
        await initGalleryPage();
        break;
      case 'alumni':
        await initAlumniPage();
        break;
      case 'donate':
        await initDonatePage();
        break;
      case 'rush':
        await initRushPage();
        break;
      case 'initiatives':
        await initInitiativesPage();
        break;
    }
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
