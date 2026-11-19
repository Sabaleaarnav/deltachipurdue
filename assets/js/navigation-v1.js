const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const compactHeader = window.matchMedia("(max-width: 760px)");

function setMenuOpen(open) {
  siteNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", (event) => {
  const open = menuToggle.getAttribute("aria-expanded") === "false";
  setMenuOpen(open);
  if (open && event.detail === 0) siteNav.querySelector("a").focus();
});
siteNav.addEventListener("click", (event) => {
  if (!compactHeader.matches || !event.target.closest("a")) return;
  setMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !siteNav.classList.contains("is-open")) return;
  setMenuOpen(false);
  menuToggle.focus();
});
compactHeader.addEventListener("change", () => setMenuOpen(false));
document.documentElement.classList.add("has-menu");
