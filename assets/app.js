// ---------- SIDEBAR NAVIGATION (drawer + scrollspy) ----------
// Shared across every page. Scrollspy only observes sections that
// actually exist in the current page's DOM, so it's safe to reuse
// the same sidenav markup (and this same script) everywhere.
const sidenav = document.getElementById('sidenav');
const sidenavScrim = document.getElementById('sidenavScrim');
const menuToggle = document.getElementById('menuToggle');
const sidenavClose = document.getElementById('sidenavClose');
const sidenavLinks = document.querySelectorAll('.sidenav-link');

function openSidenav() {
    sidenav.classList.add('open');
    sidenavScrim.classList.add('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
}
function closeSidenav() {
    sidenav.classList.remove('open');
    sidenavScrim.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
}
if (menuToggle) menuToggle.addEventListener('click', openSidenav);
if (sidenavClose) sidenavClose.addEventListener('click', closeSidenav);
if (sidenavScrim) sidenavScrim.addEventListener('click', closeSidenav);
sidenavLinks.forEach(link => link.addEventListener('click', closeSidenav));

const spySections = Array.from(sidenavLinks)
    .map(link => link.dataset.section ? document.getElementById(link.dataset.section) : null)
    .filter(Boolean);

if ('IntersectionObserver' in window && spySections.length) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sidenavLinks.forEach(link => {
                    if (!link.dataset.section) return;
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    spySections.forEach(section => spy.observe(section));
}

// ---------- REVEAL ANIMATION ----------
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}
