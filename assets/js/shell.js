(function(){
  const page = document.body.dataset.page || "";
  const nav = [
    { id:"home",       href:"index.html",       label:"Home" },
    { id:"initiatives",href:"initiatives.html",    label:"Initiatives" },  // renamed
    { id:"leadership", href:"leadership.html",  label:"Leadership" },
    { id:"events",     href:"events.html",      label:"Events" },
    { id:"gallery",    href:"gallery.html",     label:"Gallery" },
    { id:"alumni",     href:"alumni.html",      label:"Alumni" },
    { id:"donate",     href:"donate.html",      label:"Donate" }
  ];
  const header = `
    <div class="site-header">
      <div class="container nav">
        <a class="logo" href="index.html">ΔΧ Purdue</a>
        <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">☰</button>
        <ul class="nav-menu">
          ${nav.map(n=>`<li><a class="nav-link ${page===n.id?'active':''}" href="${n.href}">${n.label}</a></li>`).join('')}
        </ul>
        <a class="admin-link" href="admin/">Admin Login</a>
      </div>
      <div class="mobile-drawer" id="mobileNav" aria-hidden="true">
        <nav class="drawer-inner" aria-label="Primary navigation">
          ${nav.map(n=>`<a class="drawer-link ${page===n.id?'active':''}" href="${n.href}">${n.label}</a>`).join('')}
          <a class="drawer-link" href="admin/">Admin Login</a>
        </nav>
      </div>
    </div>
  `;
  const footer = `
    <div class="site-footer">
      <div class="container footer-inner">
        <small>© <span id="year"></span> Delta Chi – Purdue University</small>
      </div>
    </div>
  `;
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const firstDrawerLink = () => drawer ? drawer.querySelector('.drawer-link') : null;
  if (toggle && drawer){
    const closeDrawer = (returnFocus=true)=>{
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
      document.body.classList.remove('no-scroll');
      if(returnFocus){
        try{ toggle.focus({preventScroll:true}); }
        catch(e){ toggle.focus(); }
      }
    };
    const openDrawer = ()=>{
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden','false');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      document.body.classList.add('no-scroll');
      const first = firstDrawerLink();
      if(first){
        try{ first.focus({preventScroll:true}); }
        catch(e){ first.focus(); }
      }
    };

    toggle.addEventListener('click', ()=>{
      if(drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });

    drawer.addEventListener('click', (e)=>{
      if(e.target.classList.contains('mobile-drawer')) closeDrawer();
      const link = e.target.closest('.drawer-link');
      if(link){
        closeDrawer(false);
      }
    });

    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeDrawer();
    });

    const mq = typeof window.matchMedia === 'function'
      ? window.matchMedia('(min-width: 951px)')
      : null;
    if(mq){
      if(typeof mq.addEventListener === 'function'){
        mq.addEventListener('change', (evt)=>{ if(evt.matches) closeDrawer(false); });
      } else if(typeof mq.addListener === 'function'){
        mq.addListener((evt)=>{ if(evt.matches) closeDrawer(false); });
      }
    }
  }
})();
