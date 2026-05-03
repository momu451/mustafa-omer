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
    press: '2026-04-27', width: '2026-05-02', thickness: '2026-04-27', hinge: '2026-04-30', lower: '2026-04-26', calves: '2026-05-03', arms: '2026-05-02', grip: '2026-05-02', yoke: '2026-05-02', core: '2026-05-02', gpp: '2026-05-02'
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

const defaultData = { version: 7, archiveLoaded: false, rules: RULES, dynamicState: structuredClone(POST_SATURDAY_STATE), exercises: EXERCISES, sessions: [structuredClone(SATURDAY_SESSION)], notes: '', research: [] };
let db = loadDB();

function loadDB() { try { const raw = localStorage.getItem(DB_KEY); return raw ? migrate(JSON.parse(raw)) : structuredClone(defaultData); } catch (_) { return structuredClone(defaultData); } }
function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function todayISO() { return new Date().toISOString().split('T')[0]; }
function displayDate() { return new Date().toLocaleDateString(undefined, { weekday:'long', day:'2-digit', month:'short', year:'numeric' }); }
function dayDiff(dateStr) { if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 999; return Math.floor((new Date(todayISO()) - new Date(dateStr)) / 86400000); }
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function byDateDesc(a,b) { return String(b.date || '').localeCompare(String(a.date || '')); }

function migrate(x) {
  x.version = 7;
  x.rules = x.rules || RULES;
  x.dynamicState = Object.assign(structuredClone(defaultData.dynamicState), x.dynamicState || {});
  applyPostSaturdayReality(x);
  x.exercises = mergeExerciseCatalogue(x.exercises || []);
  x.sessions = (x.sessions || []).map(normaliseSession).filter(Boolean);
  injectSaturdaySession(x);
  x.notes = x.notes || '';
  x.research = x.research || [];
  try { localStorage.setItem(DB_KEY, JSON.stringify(x)); } catch (_) {}
  return x;
}
function applyPostSaturdayReality(x) { Object.assign(x.dynamicState, structuredClone(POST_SATURDAY_STATE)); }
function mergeExerciseCatalogue(existing) { const map = new Map(); [...EXERCISES, ...existing].forEach(e => map.set(String(e.name).toLowerCase(), e)); return [...map.values()]; }
function normaliseSession(s) { if (!s) return null; if (s.d || s.s || s.e) return { date:s.d || '', primary:s.q || 'mixed', quality:s.q || 'mixed', summary:s.s || '', exercises:s.e || [], source:'archive' }; return { date:s.date || '', primary:s.primary || s.quality || 'mixed', quality:s.quality || s.primary || 'mixed', summary:s.summary || '', exercises:s.exercises || [], source:s.source || 'local' }; }
function injectSaturdaySession(target) { target.sessions = target.sessions || []; const exists = target.sessions.some(s => s.date === '2026-05-02' && String(s.summary || '').includes('V-grip pulldown 55x5')); if (!exists) target.sessions.unshift(structuredClone(SATURDAY_SESSION)); target.sessions = target.sessions.map(normaliseSession).filter(Boolean).sort(byDateDesc); }
function mergeSessions(incoming) { const map = new Map(); [...db.sessions, ...incoming.map(normaliseSession).filter(Boolean)].forEach(s => { const key = `${s.date}|${String(s.summary || '').slice(0,80)}`; if (!map.has(key)) map.set(key, s); }); db.sessions = [...map.values()].sort(byDateDesc); injectSaturdaySession(db); }
async function loadArchive() { try { const res = await fetch('history.json', { cache: 'no-store' }); if (!res.ok) throw new Error('history fetch failed'); const archive = await res.json(); if (Array.isArray(archive.sessions)) { mergeSessions(archive.sessions); db.archiveLoaded = true; db.archiveVersion = archive.version || 'unknown'; applyPostSaturdayReality(db); saveDB(); } } catch (_) {} }

function latestChainDate(chain) { return db.dynamicState.lastUsedPerCategory?.[chain] || ''; }
function deficitReport() { const targets = { core:0, yoke:3, hinge:14, grip:10, gpp:7, press:7, width:7, thickness:7, lower:7, calves:7, arms:7 }; return Object.keys(targets).map(chain => { const last = latestChainDate(chain); const days = dayDiff(last); return { chain, last:last || 'never', days, target:targets[chain], deficit:days - targets[chain] }; }).sort((a,b) => b.deficit - a.deficit); }
function rowCapActive() { return db.dynamicState.rowCap && todayISO() <= db.dynamicState.rowCapEnd; }

function sundayPressSession() {
  const slots = [
    {
      name:'Machine incline chest press', cat:'press', role:'MAIN ANCHOR',
      sets:'Ramp + 3 work sets', reps:'Ramp 40x8, 45x5, 47.5x3; Work 50x6, 52.5x6, 50x6', load:'40 / 45 / 47.5 / 50 / 52.5 kg machine stack', rir:'Work sets RIR 2-3. If right elbow rises by 0.5+, keep all work at 50kg RIR 3.',
      reason:'Protected upper-chest armour. Press is underfed; no barbell bench, no dips.'
    },
    {
      name:'Machine chest press', cat:'press', role:'SECONDARY PRESS',
      sets:'3 work sets', reps:'8 / 8 / 8', load:'45kg machine stack. If elbows feel worse, use 40kg.', rir:'RIR 2-3, no grind',
      reason:'Adds pressing volume without shoulder chaos or costal irritation.'
    },
    {
      name:'Smith calf raise on step', cat:'calves', role:'CALVES SUPPORT',
      sets:'4 work sets', reps:'12 / 12 / 12 / 12-15', load:'30kg plate load + Smith bar/counterbalance. If your Smith bar counts as 20kg, log total as 50kg; plate load is 30kg.', rir:'RIR 1-2',
      reason:'Calves/inner-calf priority. 2-sec top squeeze, 2-sec stretch, pressure through big toe mound.'
    },
    {
      name:'Elbow-supported leg raises', cat:'core', role:'CORE ROTATION',
      sets:'3 work sets', reps:'12-15 / 12-15 / 12-15', load:'Bodyweight', rir:'RIR 2-3',
      reason:'Posterior tilt, tight waist, no floor work. Do not swing.'
    }
  ];
  return { date:todayISO(), primary:'press', deficits:deficitReport(), exercises:slots, blocks:['NO ROWS — row cap active until 04/05.', 'NO WIDTH / GRIP / ARMS / NECK / GPP — all hit Saturday.', 'NO HINGE / LOWER / SLED — Saturday sled reached RPE 9.'] };
}

function generateSuggestion() {
  if (todayISO() === '2026-05-03') return sundayPressSession();
  return sundayPressSession();
}

function recentCompleted(daysBack = 10) { const recent = db.sessions.filter(s => dayDiff(s.date) >= 0 && dayDiff(s.date) <= daysBack).sort(byDateDesc); return recent.length ? recent : db.sessions.slice(0,7); }

function renderActiveView(target) { if (target === 'view-today') return renderToday(); if (target === 'view-log') return renderLog(); if (target === 'view-status') return renderStatus(); if (target === 'view-history') return renderHistory(); if (target === 'view-rules') return renderRules(); }
function renderToday() {
  const s = generateSuggestion();
  const workout = s.exercises.map((e, i) => `<div class="workout-card"><div class="workout-num">${i+1}</div><div><div class="eyebrow">${esc(e.role || e.cat)}</div><h3>${esc(e.name)}</h3><p><strong>Sets:</strong> ${esc(e.sets)}</p><p><strong>Reps:</strong> ${esc(e.reps)}</p><p><strong>Load:</strong> ${esc(e.load)}</p><p><strong>RIR/RPE:</strong> ${esc(e.rir)}</p><small>${esc(e.reason)}</small></div></div>`).join('');
  const blocks = (s.blocks || []).map(b => `<div class="warning-line">${esc(b)}</div>`).join('');
  const recent = recentCompleted(10).slice(0,3).map(r => `<div class="mini-history"><strong>${esc(r.date)}</strong> · ${esc(r.quality || r.primary || '')}<br><span>${esc(r.summary)}</span></div>`).join('');
  document.getElementById('today-suggestion').innerHTML = `<section class="today-hero"><div class="eyebrow">TODAY’S WORKOUT · ${esc(displayDate())}</div><h2>${esc(s.primary.toUpperCase())} SESSION</h2><p class="hero-sub">Specifics are below. Do it, log it, done.</p><button class="btn primary giant" onclick="showLogNow()">LOG THIS WORKOUT</button></section><section class="card"><h2>Do These ${s.exercises.length}</h2>${workout}</section><section class="card"><h2>Hard Blocks</h2>${blocks}</section><section class="card"><h2>Recent Completed</h2>${recent}</section>`;
  buildLogForm(s);
}
window.showLogNow = function() { document.querySelector('[data-target="view-log"]').click(); };
function buildLogForm(s = generateSuggestion()) { let formHtml = `<input type="hidden" id="log-primary" value="${esc(s.primary)}">`; s.exercises.forEach((e, i) => { formHtml += `<div class="log-item"><label>${esc(i+1)}. ${esc(e.name)}</label><input type="text" id="log-ex-${i}" data-chain="${esc(e.cat)}" value="${esc(e.reps + ' @ ' + e.load + ' / ' + e.rir)}"></div>`; }); formHtml += `<div class="log-item"><label>Session Notes</label><textarea id="log-notes" placeholder="What actually happened?"></textarea></div>`; document.getElementById('log-form').innerHTML = formHtml; }
function renderLog() { buildLogForm(); }
function renderStatus() { const d = db.dynamicState, def = deficitReport(); document.getElementById('status-content').innerHTML = `<div class="card"><p><strong>Stored workouts:</strong> ${db.sessions.length}</p><p><strong>Archive loaded:</strong> ${db.archiveLoaded ? 'yes' : 'no'}</p><p><strong>Row Cap:</strong> ${rowCapActive() ? `Active to ${d.rowCapEnd}` : 'Inactive'} · breaches ${d.rowBreaches}</p><p><strong>Grip Flag:</strong> ${d.gripFlag}</p><p><strong>Pain:</strong> ER ${d.pain.er}, EL ${d.pain.el}, Hip/QL ${d.pain.hq}, Costal ${d.pain.costal}</p><h3>Deadlift Map</h3><p>${d.deadliftMap.cleanTripleTotal}kg total = ${d.deadliftMap.cleanTripleTotal - d.deadliftMap.barWeight}kg plates + ${d.deadliftMap.barWeight}kg bar<br>${d.deadliftMap.cleanDoubleTotal}kg total = ${d.deadliftMap.cleanDoubleTotal - d.deadliftMap.barWeight}kg plates + ${d.deadliftMap.barWeight}kg bar<br>Single ${d.deadliftMap.cleanSingleTotal}kg · Breakdown ${d.deadliftMap.breakdownTotal}kg · Failed ${d.deadliftMap.failedZone}kg+</p><h3>Deficits</h3>${def.map(x => `<p>${esc(x.chain)}: ${esc(x.last)} · ${x.days} days</p>`).join('')}</div>`; }
function renderHistory() { document.getElementById('history-list').innerHTML = `<div class="card"><strong>${db.sessions.length} stored sessions</strong></div>` + db.sessions.slice().sort(byDateDesc).map(s => `<div class="card"><small>${esc(s.date)} · ${esc(s.quality || s.primary || '')}</small><p>${esc(s.summary)}</p></div>`).join(''); }
function renderRules() { document.getElementById('rules-text').textContent = db.rules; document.getElementById('research-notes').value = db.notes || ''; document.getElementById('exercise-rules').innerHTML = db.exercises.map((e,i) => `<div class="checkbox-row"><span>${esc(e.name)} <small>(${esc(e.cat)})</small></span><input type="checkbox" onchange="toggleDeprio(${i})" ${e.deprioritised ? 'checked' : ''}></div>`).join(''); }

document.querySelectorAll('#bottom-nav button').forEach(btn => btn.addEventListener('click', e => { const target = e.currentTarget.dataset.target; document.querySelectorAll('.view').forEach(v => v.classList.remove('active')); document.querySelectorAll('#bottom-nav button').forEach(b => b.classList.remove('active')); document.getElementById(target).classList.add('active'); e.currentTarget.classList.add('active'); renderActiveView(target); }));
document.getElementById('save-session-btn').addEventListener('click', () => { const primary = document.getElementById('log-primary')?.value || 'mixed'; const items = [...document.querySelectorAll('[id^="log-ex-"]')].map(el => [el.previousElementSibling.innerText, '', el.value, '', el.dataset.chain || '', 'logged']); const summary = `${primary}: ` + items.map(i => `${i[0]} (${i[2]})`).join(', ') + '. ' + (document.getElementById('log-notes').value || ''); db.sessions.unshift({ date:todayISO(), primary, quality:primary, summary, exercises:items, source:'local' }); db.dynamicState.lastQuality = primary; items.forEach(i => { if (db.dynamicState.lastUsedPerCategory && i[4]) db.dynamicState.lastUsedPerCategory[i[4]] = todayISO(); }); saveDB(); alert('Session saved.'); document.querySelector('[data-target="view-history"]').click(); });
document.getElementById('save-notes-btn').addEventListener('click', () => { db.notes = document.getElementById('research-notes').value; saveDB(); alert('Notes saved.'); });
window.toggleDeprio = function(idx) { db.exercises[idx].deprioritised = !db.exercises[idx].deprioritised; saveDB(); };
document.getElementById('export-db-btn').addEventListener('click', () => copyText(JSON.stringify(db, null, 2), 'Copied full DB.'));
document.getElementById('export-gpt-btn').addEventListener('click', () => copyText(JSON.stringify({ date:todayISO(), dynamicState:db.dynamicState, suggestion:generateSuggestion(), recent10:recentCompleted(10), last7:db.sessions.slice(0,7) }, null, 2), 'Copied ChatGPT status.'));
document.getElementById('import-db-btn').addEventListener('click', () => { try { db = migrate(JSON.parse(document.getElementById('import-data').value)); saveDB(); alert('Imported.'); renderActiveView('view-status'); } catch(e) { alert('Invalid JSON.'); } });
function copyText(text, msg) { navigator.clipboard ? navigator.clipboard.writeText(text).then(() => alert(msg)).catch(() => prompt('Copy this:', text)) : prompt('Copy this:', text); }
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
loadArchive().then(() => renderActiveView('view-today'));
renderActiveView('view-today');
