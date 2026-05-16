/**
 * Delta Chi Purdue — Shell
 * Header, footer, mobile drawer, scroll behavior.
 */
(function () {
  'use strict';

  const page = document.body.dataset.page || '';
  const headerVariant = document.body.dataset.header || ''; // 'dark' for hero pages

  const nav = [
    { id: 'home',        href: 'index.html',       label: 'Home' },
    { id: 'rush',        href: 'rush.html',        label: 'Rush' },
    { id: 'leadership',  href: 'leadership.html',  label: 'Leadership' },
    { id: 'initiatives', href: 'initiatives.html', label: 'Initiatives' },
    { id: 'events',      href: 'events.html',      label: 'Events' },
    { id: 'gallery',     href: 'gallery.html',     label: 'Gallery' },
    { id: 'alumni',      href: 'alumni.html',      label: 'Alumni' },
    { id: 'contact',     href: 'contact.html',     label: 'Contact' }
  ];

  const headerHTML = `
    <nav class="nav" aria-label="Primary">
      <a class="logo" href="index.html" aria-label="Delta Chi Purdue — Home">
        <span class="logo-symbol" aria-hidden="true">ΔΧ</span>
        <span class="logo-text">
          <span class="logo-text-main">Delta Chi</span>
          <span class="logo-text-sub">Purdue · Indiana Chapter</span>
        </span>
      </a>

      <ul class="nav-menu">
        ${nav.map(n => `
          <li><a class="nav-link ${page === n.id ? 'active' : ''}" href="${n.href}">${n.label}</a></li>
        `).join('')}
      </ul>

      <a class="nav-cta" href="donate.html">Give</a>

      <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
        <span class="nav-toggle-icon"><span></span><span></span><span></span></span>
      </button>
    </nav>

    <div class="mobile-drawer" id="mobileNav" aria-hidden="true">
      <nav class="drawer-inner" aria-label="Mobile">
        ${nav.map(n => `<a class="drawer-link ${page === n.id ? 'active' : ''}" href="${n.href}">${n.label}</a>`).join('')}
        <a class="drawer-cta" href="donate.html">Support the Chapter</a>
      </nav>
    </div>
  `;

  const footerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">Delta Chi <span>Purdue</span></div>
          <p class="footer-tagline">Promoting Friendship. Developing Character. Advancing Justice. Assisting in the Acquisition of a Sound Education.</p>
          <div class="footer-social">
            <a href="https://instagram.com/deltachipurdue" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://linkedin.com/company/deltachipurdue" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="mailto:purduedeltachi@gmail.com" aria-label="Email">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Chapter</h4>
          <div class="footer-links">
            <a href="rush.html">Rush ΔΧ</a>
            <a href="leadership.html">Leadership</a>
            <a href="initiatives.html">Initiatives</a>
            <a href="events.html">Events</a>
            <a href="gallery.html">Gallery</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Alumni & Friends</h4>
          <div class="footer-links">
            <a href="alumni.html">Stay Connected</a>
            <a href="donate.html">Make a Gift</a>
            <a href="alumni.html#newsletter">Newsletter</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Visit</h4>
          <div class="footer-links">
            <a href="https://maps.google.com/?q=501+N+Russell+St,+West+Lafayette,+IN+47906" target="_blank" rel="noopener">501 N Russell St<br>West Lafayette, IN 47906</a>
            <a href="mailto:purduedeltachi@gmail.com">purduedeltachi@gmail.com</a>
            <a href="contact.html">Contact the Chapter</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <span id="year"></span> Delta Chi Fraternity, Purdue University Chapter. Reestablished Fall 2024. Chartered 1927.</p>
        <a class="footer-admin" href="admin/">Content Manager</a>
      </div>
    </div>
  `;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) {
    headerEl.innerHTML = headerHTML;
    if (headerVariant === 'dark') headerEl.classList.add('on-dark');
  }
  if (footerEl) footerEl.innerHTML = footerHTML;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile drawer
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    const open = () => {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('no-scroll');
    };
    const close = (focusBack = true) => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('no-scroll');
      if (focusBack) toggle.focus();
    };
    toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    drawer.querySelectorAll('.drawer-link, .drawer-cta').forEach(a => a.addEventListener('click', () => close(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    window.matchMedia('(min-width: 1021px)').addEventListener('change', e => {
      if (e.matches && drawer.classList.contains('open')) close(false);
    });
  }

  // Scrolled state
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.pageYOffset > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
