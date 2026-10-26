/* Portal Updates: one screen, five categories, stored in Supabase. */
const UPD_CATS = ['GST', 'EPFO/ESIC', 'Professional Tax', 'ROC/MCA', 'Income Tax'];
const UPD_PORTALS = [
  ['GST', 'https://www.gst.gov.in/newsandupdates'], ['EPFO', 'https://www.epfindia.gov.in'],
  ['ESIC', 'https://www.esic.gov.in'], ['MCA', 'https://www.mca.gov.in'],
  ['Income Tax', 'https://www.incometax.gov.in'], ['Maharashtra PT', 'https://mahagst.gov.in']
];
let updFilter = 'All';

async function renderUpdates(el) {
  if (typeof db === 'undefined') { el.innerHTML = '<p>Sign in to see updates.</p>'; return; }
  el.innerHTML = '<p>Loading…</p>';
  const [u, p] = await Promise.all([
    db.from('updates').select('*').order('published', { ascending: false }).limit(300),
    db.from('profiles').select('role').maybeSingle()
  ]);
  if (u.error) { el.innerHTML = `<div class="demo-note">Could not load updates: ${esc(u.error.message)}. Run setup.sql in Supabase.</div>`; return; }
  const admin = !!(p.data && p.data.role === 'admin');
  const rows = u.data.filter(r => updFilter === 'All' || r.category === updFilter);
  const safe = l => /^https?:\/\//i.test(l || '') ? l : '';
  el.innerHTML = `
    <div class="portals">Official portals: ${UPD_PORTALS.map(([n, l]) => `<a href="${l}" target="_blank" rel="noopener">${esc(n)}</a>`).join(' · ')}</div>
    <div class="tabs">${['All', ...UPD_CATS].map(c => `<button data-c="${esc(c)}" class="${c === updFilter ? 'on' : ''}">${esc(c)}</button>`).join('')}</div>
    ${admin ? `<div class="addbox"><h3>Add an update</h3>
      <select id="uCat">${UPD_CATS.map(c => `<option>${esc(c)}</option>`).join('')}</select>
      <input id="uTitle" placeholder="Title of the notification">
      <input id="uLink" placeholder="Link to the official notice (https://…)">
      <input id="uDate" type="date" value="${new Date().toISOString().slice(0, 10)}">
      <input id="uNote" placeholder="Short note (optional)">
      <p id="updMsg" role="alert"></p><button id="uAdd" class="go" type="button">Save update</button></div>` : ''}
    <section class="panel"><h3>${esc(updFilter)} updates</h3>
    ${rows.length ? rows.map(r => `<div class="row"><div><div class="t">${safe(r.link) ? `<a href="${esc(safe(r.link))}" target="_blank" rel="noopener">${esc(r.title)}</a>` : esc(r.title)}</div>
      <div class="s">${esc(fmtDate(new Date(r.published)))}${r.note ? ' · ' + esc(r.note) : ''}</div></div>
      <span><span class="chip info">${esc(r.category)}</span>${admin ? `<button class="del" data-id="${esc(r.id)}">Delete</button>` : ''}</span></div>`).join('')
      : '<div class="row"><div class="s">No updates yet. Use the official portal links above.</div></div>'}</section>`;
  el.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { updFilter = b.dataset.c; renderUpdates(el); });
  el.querySelectorAll('.del').forEach(b => b.onclick = async () => {
    if (confirm('Delete this update?')) { await db.from('updates').delete().eq('id', b.dataset.id); renderUpdates(el); }
  });
  const add = el.querySelector('#uAdd');
  if (add) add.onclick = async () => {
    const title = el.querySelector('#uTitle').value.trim();
    if (!title) { el.querySelector('#updMsg').textContent = 'Enter a title.'; return; }
    const { error } = await db.from('updates').insert({
      category: el.querySelector('#uCat').value, title,
      link: el.querySelector('#uLink').value.trim() || null,
      published: el.querySelector('#uDate').value, note: el.querySelector('#uNote').value.trim() || null });
    if (error) el.querySelector('#updMsg').textContent = error.message; else renderUpdates(el);
  };
}
window.renderUpdates = renderUpdates;
