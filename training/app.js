const DB_KEY = 'sto_v3';

const RULES = `SOVIET TRAINING OS — COMPACT DOCTRINE

Go-strength over show. Bilateral first. No junk. Every exercise must carry over to the day’s physical quality. Scan 7-10 days across press, width, thickness, hinge, lower, calves, arms, grip, yoke/neck, core and GPP. Most underfed chain wins unless blocked.

Hinge re-feed: deadlift/rack pull/KB swing absent >=14 days means hinge primary. Grip integration: if grip limited a pull, next upper/hinge includes direct grip. Neck raises at least every other session. Core every session.

Rows default RIR 2-3. If row breach plus pain spike >=1pt or fatigue >=5/10, apply 7-day row RIR 3-4 cap.

Banned: barbell bench, DB flyes, deep dips, barbell OHP, barbell squat, loaded twisting/side bends, planks, bear crawls, T-bar row.

Deadlift: operating zone 90-95kg total. 90kg total = 70kg plates + 20kg bar. 95kg total = 75kg plates + 20kg bar. No testing above 100kg total until clean zone is boring. Right scap packed; right grip failure precedes scap instability.`;

const SATURDAY_SESSION = {
  date: '2026-05-02',
  primary: 'width',
  quality: 'width',
  summary: 'V-grip pulldown 55x5+50x3 drop, rope lat prayers 12.5x12x3, face pulls 12.5x12x3 with right-side 2-sec isometrics, dead hangs 4 rounds (~100s total), barbell rack lockout static holds 100kg total mixed grip (pronated grip failed at 4s), back extensions 3x12, unilateral offset DB curls, DB hammer curls, rope pushdowns, neck raises front/back 2x15, backward sled drag with waist strap up to 100kg at RPE 9. Productive dual overreach. Right elbow 2/10 post-session.',
  exercises: ['V-grip pulldown', 'rope lat prayers', 'rope face pulls', 'dead hangs', 'barbell rack lockout static holds', 'back extensions', 'unilateral offset DB curl', 'DB hammer curl', 'rope pushdown', 'neck raises', 'backward sled drag with TRX'],
  source: 'seed'
};

const POST_SATURDAY_STATE = {
  rowCap: true,
  rowCapEnd: '2026-05-04',
  rowBreaches: 3,
  gripFlag: true,
  lastQuality: 'width',
  hingeLast: '2026-04-30',
  neckLast: '2026-05-02',
  sledRpe8: '2026-05-02',
  pain: { er: 2.0, el: 0.5, hq: 0, costal: 0 },
  lastUsedPerCategory: {
    press: '2026-04-27',
    width: '2026-05-02',
    thickness: '2026-04-27',
    hinge: '2026-04-30',
    lower: '2026-04-26',
    calves: '2026-05-03',
    arms: '2026-05-02',
    grip: '2026-05-02',
    yoke: '2026-05-02',
    core: '2026-05-02',
    gpp: '2026-05-02'
  },
  deadliftMap: { cleanTripleTotal: 90, cleanDoubleTotal: 95, cleanSingleTotal: 99, breakdownTotal: 100, failedZone: 105, barWeight: 20 }
};

const EXERCISES = [
  ['Machine incline chest press','press'],['Machine shoulder press','press'],['Machine chest press','press'],
  ['Wide pronated pulldown','width'],['V-grip pulldown','width'],['Pull-up singles','width'],['Rope lat prayers','width'],
  ['Plate-loaded chest-supported row','thickness'],['Seated cable row','thickness'],['Inverted row','thickness'],['Unilateral chest-supported row','thickness'],
  ['Deadlift','hinge'],['Rack pull','hinge'],['KB swings','hinge'],
  ['Belt squat','lower'],['Leg curl','lower'],['Leg extension','lower'],['Unilateral leg press','lower'],
  ['Smith calf raise on step','calves'],['Leg press calf raise','calves'],['DB step calf raise','calves'],['Seated yellow Technogym calf raise','calves',true],
  ['Rope pushdown','arms'],['Reverse skull crusher','arms'],['Rope hammer curl','arms'],['DB hammer curl','arms'],['Incline curl','arms'],['Overhead cable ext','arms'],['Unilateral offset DB curl','arms'],
  ['Dead hangs','grip'],['Thick bar holds','grip'],['Plate pinches','grip'],['Heavy farmers/suitcase carries','grip'],['Barbell rack lockout static holds','grip'],
  ['Neck raises','yoke'],['EZ-bar upright row','yoke'],['Cable upright row','yoke'],['Single-arm cable high row','yoke'],['Shrugs','yoke'],
  ['Back extensions','core'],['Elbow-supported leg raises','core'],['Left-hand suitcase carry','core'],['Dead bugs','core'],
  ['Backward sled drag with TRX','gpp'],['Ski-erg','gpp'],['Row erg','gpp'],['Face pulls','rear'],['Rope face pulls','rear']
].map(x => ({ name:x[0], cat:x[1], deprioritised:!!x[2] }));

const defaultData = {
  version: 5,
  archiveLoaded: false,
  rules: RULES,
  dynamicState: structuredClone(POST_SATURDAY_STATE),
  exercises: EXERCISES,
  sessions: [structuredClone(SATURDAY_SESSION)],
  notes: '',
  research: []
};

let db = loadDB();

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return structuredClone(defaultData);
    return migrate(JSON.parse(raw));
  } catch (_) {
    return structuredClone(defaultData);
  }
}

function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function todayISO() { return new Date().toISOString().split('T')[0]; }
function dayDiff(dateStr) { if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 999; return Math.floor((new Date(todayISO()) - new Date(dateStr)) / 86400000); }
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function byDateDesc(a,b) { return String(b.date || '').localeCompare(String(a.date || '')); }

function migrate(x) {
  x.version = 5;
  x.rules = x.rules || RULES;
  x.dynamicState = Object.assign(structuredClone(defaultData.dynamicState), x.dynamicState || {});
  x.dynamicState.pain = Object.assign(structuredClone(POST_SATURDAY_STATE.pain), x.dynamicState.pain || {});
  x.dynamicState.deadliftMap = structuredClone(POST_SATURDAY_STATE.deadliftMap);
  x.dynamicState.lastUsedPerCategory = Object.assign(structuredClone(POST_SATURDAY_STATE.lastUsedPerCategory), x.dynamicState.lastUsedPerCategory || {});
  applyPostSaturdayReality(x);
  x.exercises = mergeExerciseCatalogue(x.exercises || []);
  x.sessions = (x.sessions || []).map(normaliseSession).filter(Boolean);
  injectSaturdaySession(x);
  x.notes = x.notes || '';
  x.research = x.research || [];
  saveAfterMigration(x);
  return x;
}

function saveAfterMigration(x) { try { localStorage.setItem(DB_KEY, JSON.stringify(x)); } catch (_) {} }

function applyPostSaturdayReality(x) {
  x.dynamicState.rowCap = true;
  x.dynamicState.rowCapEnd = '2026-05-04';
  x.dynamicState.rowBreaches = 3;
  x.dynamicState.gripFlag = true;
  x.dynamicState.lastQuality = 'width';
  x.dynamicState.hingeLast = '2026-04-30';
  x.dynamicState.neckLast = '2026-05-02';
  x.dynamicState.sledRpe8 = '2026-05-02';
  x.dynamicState.pain = { er: 2.0, el: 0.5, hq: 0, costal: 0 };
  x.dynamicState.lastUsedPerCategory = structuredClone(POST_SATURDAY_STATE.lastUsedPerCategory);
  x.dynamicState.deadliftMap = structuredClone(POST_SATURDAY_STATE.deadliftMap);
}

function mergeExerciseCatalogue(existing) {
  const map = new Map();
  [...EXERCISES, ...existing].forEach(e => map.set(String(e.name).toLowerCase(), e));
  return [...map.values()];
}

function injectSaturdaySession(target) {
  target.sessions = target.sessions || [];
  const exists = target.sessions.some(s => s.date === '2026-05-02' && String(s.summary || '').includes('V-grip pulldown 55x5'));
  if (!exists) target.sessions.unshift(structuredClone(SATURDAY_SESSION));
  target.sessions = target.sessions.map(normaliseSession).filter(Boolean).sort(byDateDesc);
}

function normaliseSession(s) {
  if (!s) return null;
  if (s.d || s.s || s.e) {
    return { date:s.d || '', primary:s.q || inferQuality(s.e || [], s.s || ''), quality:s.q || inferQuality(s.e || [], s.s || ''), summary:s.s || '', exercises:s.e || [], source:'archive' };
  }
  return { date:s.date || '', primary:s.primary || s.quality || inferQuality(s.exercises || [], s.summary || ''), quality:s.quality || s.primary || inferQuality(s.exercises || [], s.summary || ''), summary:s.summary || '', exercises:s.exercises || [], source:s.source || 'local' };
}

function mergeSessions(incoming) {
  const map = new Map();
  [...db.sessions, ...incoming.map(normaliseSession).filter(Boolean)].forEach(s => {
    const key = `${s.date}|${String(s.summary || '').slice(0,80)}`;
    if (!map.has(key)) map.set(key, s);
  });
  db.sessions = [...map.values()].sort(byDateDesc);
  injectSaturdaySession(db);
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
      applyPostSaturdayReality(db);
      saveDB();
    }
  } catch (_) {}
}

function sessionExercisesText(session) {
  return (session.exercises || []).map(e => Array.isArray(e) ? e.join(' ') : String(e)).join(' ');
}

function chainText(session) {
  return `${session.primary || ''} ${session.quality || ''} ${session.summary || ''} ${sessionExercisesText(session)}`.toLowerCase();
}

function hasChain(session, chain) {
  const t = chainText(session);
  const patterns = {
    press:['press','incline','chest press','shoulder press','dip'],
    width:['pulldown','pull-up','pullup','lat prayer','lat','v-grip'],
    thickness:['row','face pull'],
    hinge:['deadlift','rack pull','kb swing','hip thrust','hinge'],
    lower:['belt squat','leg press','leg curl','leg extension','lunge','lower','quad','hamstring'],
    calves:['calf','calves'],
    arms:['curl','pushdown','skull','tricep','bicep','arms'],
    grip:['grip','hang','pinch','carry','farmer','suitcase','lockout static hold'],
    yoke:['neck','shrug','upright row','high row','yoke','trap'],
    core:['core','ab crunch','leg raise','back extension','dead bug','suitcase'],
    gpp:['sled','ski','row erg','air bike','bike','conditioning','gpp']
  };
  return (patterns[chain] || [chain]).some(p => t.includes(p));
}

function inferQuality(exercises, summary) {
  const temp = { primary:'', quality:'', summary: summary || '', exercises: exercises || [] };
  for (const c of ['hinge','lower','press','width','thickness','gpp','grip','arms','core','calves','yoke']) if (hasChain(temp,c)) return c;
  return 'mixed';
}

function latestChainDate(chain) {
  const explicit = db.dynamicState.lastUsedPerCategory && db.dynamicState.lastUsedPerCategory[chain];
  if (explicit) return explicit;
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

function getExerciseByName(name) {
  return db.exercises.find(e => e.name.toLowerCase() === name.toLowerCase()) || { name, cat:'support' };
}

function getExerciseForCat(cat) {
  let pool = db.exercises.filter(e => e.cat === cat && !e.deprioritised);
  if (cat === 'thickness' && rowCapActive()) pool = [];
  if (!pool.length) pool = db.exercises.filter(e => e.cat === cat && !e.deprioritised);
  return pool[0] || { name:`Any ${cat}`, cat };
}

function rowCapActive() { return db.dynamicState.rowCap && todayISO() <= db.dynamicState.rowCapEnd; }
function lowerBlocked() { return dayDiff(db.dynamicState.sledRpe8) <= 1; }
function hingeBlocked() { return lowerBlocked() || dayDiff(latestChainDate('hinge')) < 3; }
function gripRecentlyHit() { return dayDiff(latestChainDate('grip')) <= 1; }
function yokeRecentlyHit() { return dayDiff(latestChainDate('yoke')) <= 1; }

function sundayPressSession() {
  const slots = [
    prescribe(getExerciseByName('Machine incline chest press'), { sets:'3', reps:'6', load:'50-55kg operating zone', rir:'2-3', reason:'Main protected press anchor. Width/grip/arms/neck/GPP were hit Saturday; press is the clean underfed chain.' }),
    prescribe(getExerciseByName('Machine chest press'), { sets:'3', reps:'8', load:'controlled machine load', rir:'2-3', reason:'Secondary press volume without barbell bench or deep dip risk.' }),
    prescribe(getExerciseByName('Smith calf raise on step'), { sets:'4', reps:'10-15', load:'state total + plates', rir:'1-2', reason:'Calves support slot; inner-calf cue, controlled full ROM.' }),
    prescribe(getExerciseByName('Elbow-supported leg raises'), { sets:'3', reps:'12-15', load:'BW', rir:'2-3', reason:'Core rotation; posterior tilt, no floor work.' })
  ];
  return { date:todayISO(), primary:'press', deficits:deficitReport(), exercises:slots, forcedSunday:true, blocks:['No rows: row cap active until 2026-05-04.','No width/grip/arms/neck/GPP: all hit Saturday 2026-05-02.','No hinge/lower/sled: Saturday sled reached RPE 9.'] };
}

function generateSuggestion() {
  if (todayISO() === '2026-05-03') return sundayPressSession();

  const deficits = deficitReport();
  let primary = '';
  if (dayDiff(latestChainDate('hinge')) >= 14 && !hingeBlocked()) primary = 'hinge';
  else if (db.dynamicState.gripFlag && !gripRecentlyHit()) primary = 'grip';
  else primary = (deficits.find(d => d.chain !== db.dynamicState.lastQuality && !(d.chain === 'hinge' && hingeBlocked()) && !(d.chain === 'lower' && lowerBlocked())) || deficits[0]).chain;

  const catsByPrimary = {
    hinge:['hinge','grip','width','core','yoke'],
    grip:['grip','width','thickness','core','yoke'],
    press:['press','calves','core'],
    width:['width','rear','arms','core','yoke'],
    thickness:['thickness','width','rear','core','yoke'],
    lower:['lower','calves','core','gpp','yoke'],
    gpp:['gpp','core','width','grip','yoke']
  };
  let cats = catsByPrimary[primary] || [primary,'core','yoke','arms','gpp'];
  if (rowCapActive()) cats = cats.filter(c => c !== 'thickness' && c !== 'rear');
  if (lowerBlocked()) cats = cats.filter(c => c !== 'lower' && c !== 'hinge' && c !== 'gpp');
  if (yokeRecentlyHit()) cats = cats.filter(c => c !== 'yoke');
  if (gripRecentlyHit()) cats = cats.filter(c => c !== 'grip');
  if (!cats.includes('core')) cats.push('core');

  const seen = new Set();
  const exercises = cats.map(cat => cat === 'rear' ? { name:'Face pulls', cat:'rear' } : getExerciseForCat(cat))
    .filter(e => e && !seen.has(e.name) && seen.add(e.name))
    .slice(0,5)
    .map(e => prescribe(e));
  return { date:todayISO(), primary, deficits, exercises };
}

function prescribe(e, override = {}) {
  const out = Object.assign({ name:e.name, cat:e.cat, sets:'3', reps:'8-12', load:'enter load', rir:'2-3', reason:`${e.cat} support for today.` }, override);
  if (e.name === 'Deadlift') {
    const m = db.dynamicState.deadliftMap;
    out.sets = '3 wave sets'; out.reps = '3 / 2 / 3';
    out.load = `${m.cleanTripleTotal}kg total = ${m.cleanTripleTotal - m.barWeight}kg plates + ${m.barWeight}kg bar; ${m.cleanDoubleTotal}kg total = ${m.cleanDoubleTotal - m.barWeight}kg plates + ${m.barWeight}kg bar`;
    out.rir = '2 technical'; out.reason = 'Hinge re-feed / go-strength. No testing above clean zone.';
  } else if (e.cat === 'core' && !override.reps) { out.reps = e.name.includes('carry') ? '20-40m' : '12-15'; out.reason = 'Core required every session.'; }
  else if (e.cat === 'yoke' && !override.reps) { out.reps = e.name === 'Neck raises' ? '15 front + 15 back' : '10-15'; out.reason = 'Neck/yoke priority; chin tucked.'; }
  else if (e.cat === 'grip' && !override.reps) { out.reps = '20-40s / clean distance'; out.rir = 'stop before scap breaks'; out.reason = 'Direct grip because grip flag is active.'; }
  else if (e.cat === 'width' && !override.reps) { out.sets = '4'; out.reps = '8-10'; out.reason = 'Lat width/scap depression carryover.'; }
  else if (e.cat === 'thickness' && !override.reps) { out.reps = '8-10'; out.rir = rowCapActive() ? '3-4 row cap' : '2-3'; out.reason = 'Back thickness; respect row cap.'; }
  else if (e.cat === 'gpp' && !override.reps) { out.sets = '6'; out.reps = '20-30m / short burst'; out.rir = 'RPE 7-8'; out.reason = 'Sled/GPP tactical transfer.'; }
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
  if (db.dynamicState.gripFlag) html += `<p style="color:var(--accent)">Grip flag active, but direct grip was hit Saturday; no grip today.</p>`;
  if (sugg.blocks) sugg.blocks.forEach(b => html += `<p><small>${esc(b)}</small></p>`);
  html += `<h3>Prescription</h3>`;
  sugg.exercises.forEach(e => html += `<div class="card"><strong>${esc(e.name)}</strong><p>${esc(e.sets)} sets · ${esc(e.reps)} · ${esc(e.load)} · RIR/RPE ${esc(e.rir)}</p><small>${esc(e.reason)}</small></div>`);
  html += `<h3>Last 7-10 Days Completed</h3>`;
  recentCompleted(10).forEach(s => html += `<div class="card"><small>${esc(s.date)} · ${esc(s.quality || s.primary || '')}</small><p>${esc(s.summary)}</p></div>`);
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
    <h3>Deadlift Map</h3><p>Triple ${s.deadliftMap.cleanTripleTotal}kg total = ${s.deadliftMap.cleanTripleTotal - s.deadliftMap.barWeight}kg plates + ${s.deadliftMap.barWeight}kg bar · Double ${s.deadliftMap.cleanDoubleTotal}kg total = ${s.deadliftMap.cleanDoubleTotal - s.deadliftMap.barWeight}kg plates + ${s.deadliftMap.barWeight}kg bar · Single ${s.deadliftMap.cleanSingleTotal}kg · Breakdown ${s.deadliftMap.breakdownTotal}kg · Failed zone ${s.deadliftMap.failedZone}kg+</p>
    <h3>Last Used</h3><pre>${esc(JSON.stringify(s.lastUsedPerCategory, null, 2))}</pre>
    <h3>Deficits</h3>${def.map(d => `<p>${esc(d.chain)}: ${esc(d.last)} · ${d.days} days · ${d.deficit > 0 ? '<span style="color:var(--accent)">underfed</span>' : 'covered'}</p>`).join('')}
  </div>`;
  document.getElementById('status-content').innerHTML = html;
}

function renderHistory() {
  let html = `<div class="card"><strong>${db.sessions.length} stored sessions</strong><p>Newest first. Static archive + your local logs.</p></div>`;
  db.sessions.slice().sort(byDateDesc).forEach(s => {
    const ex = (s.exercises || []).slice(0,12).map(e => Array.isArray(e) ? e[0] : String(e)).filter(Boolean).join(', ');
    html += `<div class="card"><small>${esc(s.date)} · ${esc(s.quality || s.primary || '')}</small><p>${esc(s.summary)}</p>${ex ? `<small>${esc(ex)}</small>` : ''}</div>`;
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
  const session = { date:todayISO(), primary, quality:primary, summary, exercises:items, source:'local' };
  db.sessions.unshift(session);
  db.dynamicState.lastQuality = primary;
  items.forEach(i => { if (db.dynamicState.lastUsedPerCategory && i[4]) db.dynamicState.lastUsedPerCategory[i[4]] = todayISO(); });
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
  db.research.push({ date:todayISO(), note:db.notes, manual:true });
  saveDB();
  alert('Notes saved.');
});

window.toggleDeprio = function(idx) { db.exercises[idx].deprioritised = !db.exercises[idx].deprioritised; saveDB(); };

document.getElementById('export-db-btn').addEventListener('click', () => copyText(JSON.stringify(db, null, 2), 'Copied full DB.'));
document.getElementById('export-gpt-btn').addEventListener('click', () => copyText(JSON.stringify({ date:todayISO(), dynamicState:db.dynamicState, suggestion:generateSuggestion(), recent10:recentCompleted(10), last7:db.sessions.slice(0,7) }, null, 2), 'Copied ChatGPT status.'));
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
