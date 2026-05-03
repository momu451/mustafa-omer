const DB_KEY = 'sto_v3';

const RULES = `SOVIET TRAINING OS — COMPACT DOCTRINE

Go-strength over show. Bilateral first. No junk. Every exercise must carry over to the day’s physical quality. Scan 7-10 days across press, width, thickness, hinge, lower, calves, arms, grip, yoke/neck, core and GPP. Most underfed chain wins unless blocked.

Hinge re-feed: deadlift/rack pull/KB swing absent >=14 days means hinge primary. Grip integration: if grip limited a pull, next upper/hinge includes direct grip. Neck raises at least every other session. Core every session.

Rows default RIR 2-3. If row breach plus pain spike >=1pt or fatigue >=5/10, apply 7-day row RIR 3-4 cap.

Banned: barbell bench, DB flyes, deep dips, barbell OHP, barbell squat, loaded twisting/side bends, planks, bear crawls, T-bar row.

Deadlift: operating zone 90-95kg total. 90kg total = 70kg plates + 20kg bar. 95kg total = 75kg plates + 20kg bar. No testing above 100kg total until clean zone is boring. Right scap packed; right grip failure precedes scap instability.`;

const EXERCISES = [
  ['Machine incline chest press','press'],['Machine shoulder press','press'],['Machine chest press','press'],
  ['Wide pronated pulldown','width'],['V-grip pulldown','width'],['Pull-up singles','width'],['Rope lat prayers','width'],
  ['Plate-loaded chest-supported row','thickness'],['Seated cable row','thickness'],['Inverted row','thickness'],['Unilateral chest-supported row','thickness'],
  ['Deadlift','hinge'],['Rack pull','hinge'],['KB swings','hinge'],
  ['Belt squat','lower'],['Leg curl','lower'],['Leg extension','lower'],['Unilateral leg press','lower'],
  ['Smith calf raise on step','calves'],['Leg press calf raise','calves'],['DB step calf raise','calves'],['Seated yellow Technogym calf raise','calves',true],
  ['Rope pushdown','arms'],['Reverse skull crusher','arms'],['Rope hammer curl','arms'],['DB hammer curl','arms'],['Incline curl','arms'],['Overhead cable ext','arms'],
  ['Dead hangs','grip'],['Thick bar holds','grip'],['Plate pinches','grip'],['Heavy farmers/suitcase carries','grip'],
  ['Neck raises','yoke'],['EZ-bar upright row','yoke'],['Cable upright row','yoke'],['Single-arm cable high row','yoke'],['Shrugs','yoke'],
  ['Back extensions','core'],['Elbow-supported leg raises','core'],['Left-hand suitcase carry','core'],['Dead bugs','core'],
  ['Backward sled drag with TRX','gpp'],['Ski-erg','gpp'],['Row erg','gpp'],['Face pulls','rear']
].map(x => ({ name:x[0], cat:x[1], deprioritised:!!x[2] }));

const defaultData = {
  version: 4,
  archiveLoaded: false,
  rules: RULES,
  dynamicState: {
    rowCap: true,
    rowCapEnd: '2026-05-04',
    rowBreaches: 3,
    gripFlag: true,
    lastQuality: 'hinge',
    pain: { er: 1.25, el: 0.25, hq: 0, costal: 0 },
    deadliftMap: { cleanTripleTotal: 90, cleanDoubleTotal: 95, cleanSingleTotal: 99, breakdownTotal: 100, failedZone: 105, barWeight: 20 }
  },
  exercises: EXERCISES,
  sessions: [],
  notes: '',
  research: []
};

let db = loadDB();

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch (_) {
    return structuredClone(defaultData);
  }
}

function migrate(x) {
  x.version = 4;
  x.rules = x.rules || RULES;
  x.dynamicState = Object.assign(structuredClone(defaultData.dynamicState), x.dynamicState || {});
  x.dynamicState.pain = Object.assign(structuredClone(defaultData.dynamicState.pain), x.dynamicState.pain || {});
  x.dynamicState.deadliftMap = Object.assign(structuredClone(defaultData.dynamicState.deadliftMap), x.dynamicState.deadliftMap || {});
  x.exercises = Array.isArray(x.exercises) && x.exercises.length ? x.exercises : EXERCISES;
  x.sessions = (x.sessions || []).map(normaliseSession).filter(Boolean);
  x.notes = x.notes || '';
  x.research = x.research || [];
  return x;
}

function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function todayISO() { return new Date().toISOString().split('T')[0]; }
function dayDiff(dateStr) { if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 999; return Math.floor((new Date(todayISO()) - new Date(dateStr)) / 86400000); }
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function byDateDesc(a,b) { return String(b.date || '').localeCompare(String(a.date || '')); }

function normaliseSession(s) {
  if (!s) return null;
  if (s.d || s.s || s.e) {
    return { date:s.d || '', quality:s.q || inferQuality(s.e || [], s.s || ''), summary:s.s || '', exercises:s.e || [], source:'archive' };
  }
  return { date:s.date || '', quality:s.quality || inferQuality(s.exercises || [], s.summary || ''), summary:s.summary || '', exercises:s.exercises || [], source:s.source || 'local' };
}

function mergeSessions(incoming) {
  const map = new Map();
  [...db.sessions, ...incoming.map(normaliseSession).filter(Boolean)].forEach(s => {
    const key = `${s.date}|${s.summary.slice(0,80)}`;
    if (!map.has(key)) map.set(key, s);
  });
  db.sessions = [...map.values()].sort(byDateDesc);
}

async function loadArchive() {
  try {
    const res = await fetch('history.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('history fetch failed');
    const archive = await res.json();
    if (Array.isArray(archive.sessions)) {
      mergeSessions(archive.sessions);
      db.archiveLoaded = true;
      db.archiveVersion = archive.version || 'unknown';
      saveDB();
    }
  } catch (_) {
    // offline or first cache miss; app still works from localStorage
  }
}

function chainText(session) {
  return `${session.quality || ''} ${(session.summary || '')} ${(session.exercises || []).map(e => Array.isArray(e) ? e.join(' ') : JSON.stringify(e)).join(' ')}`.toLowerCase();
}

function hasChain(session, chain) {
  const t = chainText(session);
  const patterns = {
    press:['press','incline','chest press','shoulder press','dip'],
    width:['pulldown','pull-up','pullup','lat prayer','lat'],
    thickness:['row','face pull'],
    hinge:['deadlift','rack pull','kb swing','hip thrust','hinge'],
    lower:['belt squat','leg press','leg curl','leg extension','lunge','lower','quad','hamstring'],
    calves:['calf','calves'],
    arms:['curl','pushdown','skull','tricep','bicep','arms'],
    grip:['grip','hang','pinch','carry','farmer','suitcase'],
    yoke:['neck','shrug','upright row','high row','yoke','trap'],
    core:['core','ab crunch','leg raise','back extension','dead bug','suitcase'],
    gpp:['sled','ski','row erg','air bike','bike','conditioning','gpp']
  };
  return (patterns[chain] || [chain]).some(p => t.includes(p));
}

function inferQuality(exercises, summary) {
  const temp = { quality:'', summary: summary || '', exercises: exercises || [] };
  for (const c of ['hinge','lower','press','width','thickness','gpp','grip','arms','core','calves','yoke']) if (hasChain(temp,c)) return c;
  return 'mixed';
}

function latestChainDate(chain) {
  const hit = db.sessions.find(s => hasChain(s, chain));
  return hit ? hit.date : '';
}

function deficitReport() {
  const targets = { core:0, yoke:3, hinge:14, grip:10, gpp:7, press:7, width:7, thickness:7, lower:7, calves:7, arms:7 };
  return Object.keys(targets).map(chain => {
    const last = latestChainDate(chain);
    const days = dayDiff(last);
    return { chain, last:last || 'never', days, target:targets[chain], deficit:days - targets[chain] };
  }).sort((a,b) => b.deficit - a.deficit);
}

function getExerciseForCat(cat) {
  let pool = db.exercises.filter(e => e.cat === cat && !e.deprioritised);
  if (cat === 'thickness' && rowCapActive()) pool = pool.filter(e => !e.name.toLowerCase().includes('row') || e.name.toLowerCase().includes('chest-supported'));
  if (!pool.length) pool = db.exercises.filter(e => e.cat === cat);
  return pool[0] || { name:`Any ${cat}`, cat };
}

function rowCapActive() { return db.dynamicState.rowCap && todayISO() <= db.dynamicState.rowCapEnd; }

function generateSuggestion() {
  const deficits = deficitReport();
  let primary = '';
  if (dayDiff(latestChainDate('hinge')) >= 14) primary = 'hinge';
  else if (db.dynamicState.gripFlag) primary = 'grip';
  else primary = (deficits.find(d => d.chain !== db.dynamicState.lastQuality) || deficits[0]).chain;

  const catsByPrimary = {
    hinge:['hinge','grip','width','core','yoke'],
    grip:['grip','width','thickness','core','yoke'],
    press:['press','width','arms','core','yoke'],
    width:['width','rear','arms','core','yoke'],
    thickness:['thickness','width','rear','core','yoke'],
    lower:['lower','calves','core','gpp','yoke'],
    gpp:['gpp','core','width','grip','yoke']
  };
  let cats = catsByPrimary[primary] || [primary,'core','yoke','arms','gpp'];
  if (dayDiff(latestChainDate('yoke')) >= 2 && !cats.includes('yoke')) cats.push('yoke');
  if (db.dynamicState.gripFlag && !cats.includes('grip')) cats.splice(1,0,'grip');

  const seen = new Set();
  const exercises = cats.map(cat => cat === 'rear' ? { name:'Face pulls', cat:'rear' } : getExerciseForCat(cat))
    .filter(e => e && !seen.has(e.name) && seen.add(e.name))
    .slice(0,5)
    .map(prescribe);
  return { date:todayISO(), primary, deficits, exercises };
}

function prescribe(e) {
  const out = { name:e.name, cat:e.cat, sets:'3', reps:'8-12', load:'enter load', rir:'2-3', reason:`${e.cat} support for today.` };
  if (e.name === 'Deadlift') {
    const m = db.dynamicState.deadliftMap;
    out.sets = '3 wave sets'; out.reps = '3 / 2 / 3';
    out.load = `${m.cleanTripleTotal}kg total = ${m.cleanTripleTotal - m.barWeight}kg plates + ${m.barWeight}kg bar; ${m.cleanDoubleTotal}kg total = ${m.cleanDoubleTotal - m.barWeight}kg plates + ${m.barWeight}kg bar`;
    out.rir = '2 technical'; out.reason = 'Hinge re-feed / go-strength. No testing above clean zone.';
  } else if (e.cat === 'core') { out.reps = e.name.includes('carry') ? '20-40m' : '12-15'; out.reason = 'Core required every session.'; }
  else if (e.cat === 'yoke') { out.reps = e.name === 'Neck raises' ? '15 front + 15 back' : '10-15'; out.reason = 'Neck/yoke priority; chin tucked.'; }
  else if (e.cat === 'grip') { out.reps = '20-40s / clean distance'; out.rir = 'stop before scap breaks'; out.reason = 'Direct grip because grip flag is active.'; }
  else if (e.cat === 'width') { out.sets = '4'; out.reps = '8-10'; out.reason = 'Lat width/scap depression carryover.'; }
  else if (e.cat === 'thickness') { out.reps = '8-10'; out.rir = rowCapActive() ? '3-4 row cap' : '2-3'; out.reason = 'Back thickness; respect row cap.'; }
  else if (e.cat === 'gpp') { out.sets = '6'; out.reps = '20-30m / short burst'; out.rir = 'RPE 7-8'; out.reason = 'Sled/GPP tactical transfer.'; }
  return out;
}

function recentCompleted(daysBack = 10) {
  const recent = db.sessions.filter(s => dayDiff(s.date) >= 0 && dayDiff(s.date) <= daysBack).sort(byDateDesc);
  return recent.length ? recent : db.sessions.slice(0,7);
}

function renderActiveView(target) {
  if (target === 'view-today') return renderToday();
  if (target === 'view-log') return renderLog();
  if (target === 'view-status') return renderStatus();
  if (target === 'view-history') return renderHistory();
  if (target === 'view-rules') return renderRules();
}

function renderToday() {
  const sugg = generateSuggestion();
  let html = `<div class="card"><h3>Primary: ${esc(sugg.primary.toUpperCase())}</h3>`;
  html += `<p><strong>Archive:</strong> ${db.sessions.length} stored sessions${db.archiveLoaded ? '' : ' (archive not loaded yet)'}</p>`;
  if (rowCapActive()) html += `<p style="color:var(--accent)">Row Cap Active until ${esc(db.dynamicState.rowCapEnd)}</p>`;
  if (db.dynamicState.gripFlag) html += `<p style="color:var(--accent)">Grip flag active: include direct grip.</p>`;
  html += `<h3>Prescription</h3>`;
  sugg.exercises.forEach(e => html += `<div class="card"><strong>${esc(e.name)}</strong><p>${esc(e.sets)} sets · ${esc(e.reps)} · ${esc(e.load)} · RIR/RPE ${esc(e.rir)}</p><small>${esc(e.reason)}</small></div>`);
  html += `<h3>Last 7-10 Days Completed</h3>`;
  recentCompleted(10).forEach(s => html += `<div class="card"><small>${esc(s.date)} · ${esc(s.quality || '')}</small><p>${esc(s.summary)}</p></div>`);
  html += `</div>`;
  document.getElementById('today-suggestion').innerHTML = html;
  buildLogForm(sugg);
}

function buildLogForm(sugg = generateSuggestion()) {
  let formHtml = `<input type="hidden" id="log-primary" value="${esc(sugg.primary)}">`;
  sugg.exercises.forEach((e, i) => {
    formHtml += `<div class="log-item"><label>${esc(e.name)}</label>
      <input type="text" id="log-ex-${i}" data-chain="${esc(e.cat)}" placeholder="Sets x reps x load" value="${esc(e.sets + ' x ' + e.reps + ' @ ' + e.load + ' / ' + e.rir)}">
    </div>`;
  });
  formHtml += `<div class="log-item"><label>Session Notes</label><textarea id="log-notes"></textarea></div>`;
  document.getElementById('log-form').innerHTML = formHtml;
}

function renderLog() { buildLogForm(); }

function renderStatus() {
  const s = db.dynamicState, def = deficitReport();
  let html = `<div class="card">
    <p><strong>Stored workouts:</strong> ${db.sessions.length}</p>
    <p><strong>Archive loaded:</strong> ${db.archiveLoaded ? 'yes' : 'no'}</p>
    <p><strong>Row Cap:</strong> ${rowCapActive() ? `Active to ${s.rowCapEnd}` : 'Inactive'} (Breaches: ${s.rowBreaches})</p>
    <p><strong>Grip Flag:</strong> ${s.gripFlag}</p>
    <p><strong>Pain:</strong> ER ${s.pain.er}, EL ${s.pain.el}, Hip/QL ${s.pain.hq}, Costal ${s.pain.costal}</p>
    <h3>Deadlift Map</h3><p>Triple ${s.deadliftMap.cleanTripleTotal}kg · Double ${s.deadliftMap.cleanDoubleTotal}kg · Single ${s.deadliftMap.cleanSingleTotal}kg · Breakdown ${s.deadliftMap.breakdownTotal}kg</p>
    <h3>Deficits</h3>${def.map(d => `<p>${esc(d.chain)}: ${esc(d.last)} · ${d.days} days · ${d.deficit > 0 ? '<span style="color:var(--accent)">underfed</span>' : 'covered'}</p>`).join('')}
  </div>`;
  document.getElementById('status-content').innerHTML = html;
}

function renderHistory() {
  let html = `<div class="card"><strong>${db.sessions.length} stored sessions</strong><p>Newest first. Static archive + your local logs.</p></div>`;
  db.sessions.slice().sort(byDateDesc).forEach(s => {
    const ex = (s.exercises || []).slice(0,8).map(e => Array.isArray(e) ? e[0] : (e.name || '')).filter(Boolean).join(', ');
    html += `<div class="card"><small>${esc(s.date)} · ${esc(s.quality || '')}</small><p>${esc(s.summary)}</p>${ex ? `<small>${esc(ex)}</small>` : ''}</div>`;
  });
  document.getElementById('history-list').innerHTML = html;
}

function renderRules() {
  document.getElementById('rules-text').textContent = db.rules;
  document.getElementById('research-notes').value = db.notes || '';
  let html = '';
  db.exercises.forEach((e, i) => {
    html += `<div class="checkbox-row"><span>${esc(e.name)} <small>(${esc(e.cat)})</small></span><input type="checkbox" onchange="toggleDeprio(${i})" ${e.deprioritised ? 'checked' : ''}></div>`;
  });
  document.getElementById('exercise-rules').innerHTML = html;
}

document.querySelectorAll('#bottom-nav button').forEach(btn => {
  btn.addEventListener('click', e => {
    const target = e.currentTarget.dataset.target;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('#bottom-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    e.currentTarget.classList.add('active');
    renderActiveView(target);
  });
});

document.getElementById('save-session-btn').addEventListener('click', () => {
  const primary = document.getElementById('log-primary')?.value || 'mixed';
  const items = [...document.querySelectorAll('[id^="log-ex-"]')].map(el => [el.previousElementSibling.innerText, '', el.value, '', el.dataset.chain || '', 'logged']);
  const summary = `${primary}: ` + items.map(i => `${i[0]} (${i[2]})`).join(', ') + '. ' + (document.getElementById('log-notes').value || '');
  const session = { date:getTodayDate(), quality:primary, summary, exercises:items, source:'local' };
  db.sessions.unshift(session);
  db.dynamicState.lastQuality = primary;
  if (items.some(i => i[4] === 'grip')) db.dynamicState.gripFlag = false;
  saveDB();
  alert('Session saved.');
  renderActiveView('view-history');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('#bottom-nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('view-history').classList.add('active');
  document.querySelector('[data-target="view-history"]').classList.add('active');
});

document.getElementById('save-notes-btn').addEventListener('click', () => {
  db.notes = document.getElementById('research-notes').value;
  db.research.push({ date:getTodayDate(), note:db.notes, manual:true });
  saveDB();
  alert('Notes saved.');
});

window.toggleDeprio = function(idx) { db.exercises[idx].deprioritised = !db.exercises[idx].deprioritised; saveDB(); };

document.getElementById('export-db-btn').addEventListener('click', () => copyText(JSON.stringify(db, null, 2), 'Copied full DB.'));
document.getElementById('export-gpt-btn').addEventListener('click', () => copyText(JSON.stringify({ date:getTodayDate(), dynamicState:db.dynamicState, suggestion:generateSuggestion(), recent10:recentCompleted(10), last7:db.sessions.slice(0,7) }, null, 2), 'Copied ChatGPT status.'));
document.getElementById('import-db-btn').addEventListener('click', () => {
  try { const incoming = migrate(JSON.parse(document.getElementById('import-data').value)); db = incoming; saveDB(); alert('Imported.'); renderActiveView('view-status'); }
  catch(e) { alert('Invalid JSON.'); }
});

function copyText(text, msg) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert(msg)).catch(() => prompt('Copy this:', text));
  else prompt('Copy this:', text);
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});

loadArchive().then(() => renderActiveView('view-today'));
renderActiveView('view-today');
