// ---------- SERVICE TAB SWITCHING ----------
const serviceOptions = document.querySelectorAll('.service-option');
const tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(tabId, scrollToPanel = true) {
    serviceOptions.forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
    });

    tabPanels.forEach(panel => {
        const isActive = panel.id === 'panel-' + tabId;
        panel.classList.toggle('active', isActive);
        if (isActive && scrollToPanel) {
            panel.focus({ preventScroll: true });
        }
    });
}

serviceOptions.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// Allow deep-linking straight to a service, e.g. services.html#tab-dashboarding
const requestedHash = window.location.hash.replace('#', '');
const requestedTab = requestedHash.replace(/^tab-/, '');
if (requestedTab && document.getElementById('tab-' + requestedTab)) {
    activateTab(requestedTab, false);
}

// ---------- DASHBOARD EXAMPLE SWITCHER ----------
const dashPills = document.querySelectorAll('.dash-pill');
const dashExamples = document.querySelectorAll('.dash-example');
dashPills.forEach(pill => {
    pill.addEventListener('click', () => {
        dashPills.forEach(p => {
            p.classList.toggle('active', p === pill);
            p.setAttribute('aria-selected', p === pill);
        });
        dashExamples.forEach(ex => {
            ex.classList.toggle('active', ex.id === 'dash-' + pill.dataset.dash);
        });
    });
});
