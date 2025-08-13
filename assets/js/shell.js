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
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
        <ul class="nav-menu">
          ${nav.map(n=>`<li><a class="nav-link ${page===n.id?'active':''}" href="${n.href}">${n.label}</a></li>`).join('')}
        </ul>
        <a class="admin-link" href="admin/">Admin Login</a>
      </div>
      <div class="mobile-drawer" aria-hidden="true">
        <div class="drawer-inner">
          ${nav.map(n=>`<a class="drawer-link ${page===n.id?'active':''}" href="${n.href}">${n.label}</a>`).join('')}
          <a class="drawer-link" href="admin/">Admin Login</a>
        </div>
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
  if (toggle && drawer){
    toggle.addEventListener('click', ()=>{
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true':'false');
      document.body.classList.toggle('no-scroll', open);
    });
    drawer.addEventListener('click', (e)=>{
      if(e.target.classList.contains('mobile-drawer')){
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        document.body.classList.remove('no-scroll');
      }
    });
  }
})();
