/* Aquill – Aquatiis Legalisis | v0.1 foundation
   All data below is DEMO DATA. No real client data, passwords or keys belong in this file. */

/* ---------- Menu: add a new module by adding one line here ---------- */
const MENU = [
  { group: 'Overview', items: [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'updates', name: 'Portal Updates' } ] },
  { group: 'My Apps', items: [
    { name: 'Billing App', href: 'Bill.html' },
    { name: 'CS Office Manager', href: 'ASK.html' },
    { name: 'GST Manager', href: 'gst-manager.html' } ] },
  { group: 'Official portals', items: [
    { name: 'MCA / ROC', href: 'https://www.mca.gov.in' },
    { name: 'GST Portal', href: 'https://www.gst.gov.in' },
    { name: 'Income Tax', href: 'https://www.incometax.gov.in' } ] },
  { group: 'Clients', items: [
    { id: 'clients', name: 'Client Master', about: 'Companies and LLPs with CIN/LLPIN, directors, registered office and contacts.' } ] },
  { group: 'Compliance', items: [
    { id: 'roc', name: 'ROC/MCA Compliance', about: 'Annual filings, event-based forms, due dates and filing status per client.' },
    { id: 'gst', name: 'GST', about: 'Monthly and annual returns, notices and reconciliation status.' },
    { id: 'it', name: 'Income Tax', about: 'Returns, TDS, advance tax and assessment follow-ups.' },
    { id: 'pt', name: 'Professional Tax', about: 'State-wise registrations, returns and payments.' },
    { id: 'epfo', name: 'EPFO/ESIC', about: 'Monthly contributions, returns and registrations.' },
    { id: 'notices', name: 'Scrutiny and Notices', about: 'Notices received, reply deadlines and reply drafts.' } ] },
  { group: 'Intellectual property', items: [
    { id: 'tm', name: 'Trademark', about: 'Applications, objections, hearings and renewals.' },
    { id: 'dpiit', name: 'DPIIT', about: 'Startup recognition applications and follow-ups.' } ] },
  { group: 'Finance', items: [
    { id: 'loans', name: 'Loans and Reports', about: 'Loan documentation checklists and report generation.' } ] },
  { group: 'Office', items: [
    { id: 'docs', name: 'Documents', about: 'Client-wise document storage and search.' },
    { id: 'tasks', name: 'Team Tasks', about: 'Assign work to team members with role-based access.' },
    { id: 'ai', name: 'AI Secretary', about: 'Reminders, daily work summaries and reply drafts.' },
    { id: 'settings', name: 'Settings', about: 'Team members, roles and Google Sheets connection.' } ] }
];

/* ---------- DEMO DATA (dates are relative to today so the demo stays fresh) ---------- */
const day = n => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0, 0, 0, 0); return d; };
const DEMO_CLIENTS = 112;
const DEMO_DUES = [
  { client: 'Demo Company A Pvt Ltd', item: 'AOC-4 filing', due: day(-2) },
  { client: 'Demo LLP B', item: 'Form 11 annual return', due: day(2) },
  { client: 'Demo Company C Ltd', item: 'MGT-7 filing', due: day(5) },
  { client: 'Demo Company D Pvt Ltd', item: 'GSTR-3B', due: day(6) },
  { client: 'Demo LLP E', item: 'Form 8 statement', due: day(14) }
];
const DEMO_NOTICES = [
  { client: 'Demo Company A Pvt Ltd', item: 'GST scrutiny notice – reply due', due: day(4) },
  { client: 'Demo Company F Pvt Ltd', item: 'ROC notice – explanation sought', due: day(11) }
];
const DEMO_TASKS = [
  { who: 'Team member 1', item: 'Prepare AOC-4 draft', status: 'In progress' },
  { who: 'Team member 2', item: 'Collect trademark documents', status: 'To do' },
  { who: 'Team member 3', item: 'Send invoice reminders', status: 'To do' }
];
const DEMO_OUTSTANDING = 245000;

/* ---------- Helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const daysLeft = d => Math.round((d - day(0)) / 86400000);
const fmtDate = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const inr = n => '₹' + n.toLocaleString('en-IN');

function dueChip(d) {
  const n = daysLeft(d);
  if (n < 0) return `<span class="chip over">${-n} day${n === -1 ? '' : 's'} overdue</span>`;
  if (n === 0) return '<span class="chip soon">Due today</span>';
  if (n <= 7) return `<span class="chip soon">${n} day${n === 1 ? '' : 's'} left</span>`;
  return `<span class="chip ok">${n} days left</span>`;
}

const list = (rows, line2) => rows.length
  ? rows.map(r => `<div class="row"><div><div class="t">${esc(r.item)}</div><div class="s">${esc(line2(r))}</div></div>${r.due ? dueChip(r.due) : `<span class="chip info">${esc(r.status)}</span>`}</div>`).join('')
  : '<div class="row"><div class="s">Nothing here yet.</div></div>';

/* ---------- Pages ---------- */
function pageDashboard() {
  const overdue = DEMO_DUES.filter(d => daysLeft(d.due) < 0).length;
  const week = DEMO_DUES.filter(d => { const n = daysLeft(d.due); return n >= 0 && n <= 7; }).length;
  const h = new Date().getHours();
  const hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `
    <div class="demo-note"><b>Demo data.</b> Every name and number on this page is a sample. Real data comes after the database is connected.</div>
    <div class="hello"><h2>${hello}</h2><p>${fmtDate(new Date())}</p></div>
    <div class="ledger">
      <div class="fig"><b>${DEMO_CLIENTS}</b><span>Clients</span></div>
      <div class="fig warn"><b>${overdue}</b><span>Overdue filings</span></div>
      <div class="fig"><b>${week}</b><span>Due in 7 days</span></div>
      <div class="fig"><b>${DEMO_NOTICES.length}</b><span>Open notices</span></div>
      <div class="fig"><b>${inr(DEMO_OUTSTANDING)}</b><span>Outstanding fees</span></div>
    </div>
    <div class="cols">
      <section class="panel"><h3>Upcoming deadlines</h3>${list(DEMO_DUES, r => `${r.client} · ${fmtDate(r.due)}`)}</section>
      <div>
        <section class="panel"><h3>Notices to reply</h3>${list(DEMO_NOTICES, r => `${r.client} · ${fmtDate(r.due)}`)}</section>
        <section class="panel" style="margin-top:22px"><h3>Team tasks</h3>${list(DEMO_TASKS, r => r.who)}</section>
      </div>
    </div>`;
}

function pageModule(m) {
  return `<div class="soon-page"><h2>${esc(m.name)}</h2><p>${esc(m.about)}</p>
    <ul><li>Planned for a later step.</li><li>The menu and page frame already work.</li></ul>
    <p class="later">Nothing to enter here yet.</p></div>`;
}

/* ---------- Router ---------- */
const ALL = MENU.flatMap(g => g.items).filter(i => !i.href);
const navEl = document.getElementById('nav');
const viewEl = document.getElementById('view');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

navEl.innerHTML = MENU.map(g =>
  `<div class="grp">${esc(g.group)}</div>` +
  g.items.map(i => i.href
    ? `<a class="nav-link" href="${esc(i.href)}" target="_blank" rel="noopener">${esc(i.name)} ↗</a>`
    : `<button class="nav-link" data-id="${i.id}">${esc(i.name)}</button>`).join('')
).join('');

function setMenu(open) { sidebar.classList.toggle('open', open); scrim.classList.toggle('show', open); }

function go() {
  const id = location.hash.slice(1) || 'dashboard';
  const m = ALL.find(i => i.id === id) || ALL[0];
  document.getElementById('pageTitle').textContent = m.name;
  document.title = m.name + ' – Aquill';
  if (m.id === 'updates') { viewEl.innerHTML = '<p>Loading…</p>'; if (window.renderUpdates) renderUpdates(viewEl); }
  else viewEl.innerHTML = m.id === 'dashboard' ? pageDashboard() : pageModule(m);
  navEl.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.id === m.id));
  setMenu(false);
  window.scrollTo(0, 0);
}

navEl.addEventListener('click', e => {
  const b = e.target.closest('.nav-link');
  if (b) location.hash = b.dataset.id;
});
document.getElementById('menuBtn').addEventListener('click', () => setMenu(true));
scrim.addEventListener('click', () => setMenu(false));
window.addEventListener('hashchange', go);
go();
