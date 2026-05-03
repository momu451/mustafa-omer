const DB_KEY = 'sto_v3';

const defaultData = {
    dynamicState: {
        rowCap: true, rowCapEnd: "2026-05-04", rowBreaches: 3,
        gripFlag: true, lastQuality: "hinge",
        lastDates: { hinge: "2026-04-30", neck: "2026-04-28", sled: "2026-04-26", core: "2026-04-30", width: "2026-04-28", press: "2026-04-18", lower: "2026-03-23" },
        pain: { er: 1.25, el: 0.25, hq: 0, costal: 0 },
        deadliftMap: { cleanTripleTotal: 90, cleanDoubleTotal: 95, cleanSingleTotal: 99, breakdownTotal: 100, failedZone: 105, barWeight: 20 }
    },
    sessions: [
        { date: "2026-04-30", summary: "hinge, deadlift triples/doubles/singles, leg curl, back extensions." },
        { date: "2026-04-28", summary: "width, wide pulldown 50x8, leg raises, pushdowns, neck raises." },
        { date: "2026-04-26", summary: "GPP, sled RPE8+, backward sled drag." },
        { date: "2026-04-18", summary: "press, incline 55x6, shoulder press, pull-up singles." },
        { date: "2026-03-24", summary: "press, incline 50-55, pulldown, chest-supported row." },
        { date: "2026-03-23", summary: "lower, belt squat 40-50x8, leg curl, inverted rows." }
    ],
    exercises: [
        { name: "Machine incline chest press", cat: "press", deprioritised: false },
        { name: "Machine shoulder press", cat: "press", deprioritised: false },
        { name: "Wide pronated pulldown", cat: "width", deprioritised: false },
        { name: "Plate-loaded chest-supported row", cat: "thickness", deprioritised: false },
        { name: "Deadlift", cat: "hinge", deprioritised: false },
        { name: "Belt squat", cat: "lower", deprioritised: false },
        { name: "Smith calf raise on step", cat: "calves", deprioritised: false },
        { name: "Seated yellow Technogym calf raise", cat: "calves", deprioritised: true },
        { name: "Rope pushdown", cat: "arms", deprioritised: false },
        { name: "Dead hangs", cat: "grip", deprioritised: false },
        { name: "Neck raises", cat: "yoke/neck", deprioritised: false },
        { name: "Back extensions", cat: "core", deprioritised: false },
        { name: "Backward sled drag with TRX", cat: "gpp", deprioritised: false }
    ],
    notes: ""
};

let db = JSON.parse(localStorage.getItem(DB_KEY));
if (!db) { db = defaultData; saveDB(); }

function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function getDaysSince(dateStr) {
    if (!dateStr) return 999;
    return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}
function getTodayDate() { return new Date().toISOString().split('T')[0]; }

// Navigation
document.querySelectorAll('#bottom-nav button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('#bottom-nav button').forEach(b => b.classList.remove('active'));
        document.getElementById(e.target.dataset.target).classList.add('active');
        e.target.classList.add('active');
        renderActiveView(e.target.dataset.target);
    });
});

function generateSuggestion() {
    let primary = "";
    let hGap = getDaysSince(db.dynamicState.lastDates.hinge);
    
    if (hGap >= 14) primary = "hinge";
    else if (db.dynamicState.gripFlag) primary = "grip";
    else {
        let maxGap = -1;
        for (let cat of ["press", "width", "thickness", "lower", "calves", "arms", "gpp"]) {
            let gap = getDaysSince(db.dynamicState.lastDates[cat]);
            if (gap > maxGap && cat !== db.dynamicState.lastQuality) { maxGap = gap; primary = cat; }
        }
    }

    let session = [];
    session.push(getExerciseForCat("core"));
    if (getDaysSince(db.dynamicState.lastDates.neck) >= 2) session.push(getExerciseForCat("yoke/neck"));
    if (db.dynamicState.gripFlag && primary !== "grip") session.push(getExerciseForCat("grip"));
    if (!session.find(e => e.cat === primary)) session.push(getExerciseForCat(primary));
    
    while(session.length < 5) {
        let cat = ["arms", "calves", "width"].find(c => !session.find(e => e && e.cat === c));
        if(cat) session.push(getExerciseForCat(cat));
        else break;
    }

    return { primary, exercises: session.filter(Boolean) };
}

function getExerciseForCat(cat) {
    let avail = db.exercises.filter(e => e.cat === cat && !e.deprioritised);
    if(cat === 'thickness' && db.dynamicState.rowCap && new Date() <= new Date(db.dynamicState.rowCapEnd)) avail = avail.filter(e => e.name !== "Plate-loaded chest-supported row");
    if(avail.length === 0) avail = db.exercises.filter(e => e.cat === cat);
    let ex = avail[0] || { name: `Any ${cat} exercise`, cat };
    
    if (ex.name === "Deadlift") {
        let m = db.dynamicState.deadliftMap;
        let plates3 = (m.cleanTripleTotal - m.barWeight)/2;
        let plates2 = (m.cleanDoubleTotal - m.barWeight)/2;
        ex.details = `Wave: ${m.cleanTripleTotal}kg (2x${plates3}kg plates) x3, ${m.cleanDoubleTotal}kg (2x${plates2}kg plates) x2, ${m.cleanTripleTotal}kg x3. RIR 2.`;
    }
    return ex;
}

function renderActiveView(target) {
    if (target === 'view-today') {
        const sugg = generateSuggestion();
        let html = `<div class="card"><h3>Primary: ${sugg.primary.toUpperCase()}</h3>`;
        if(db.dynamicState.rowCap && new Date() <= new Date(db.dynamicState.rowCapEnd)) html += `<p style="color:var(--accent)">Row Cap Active until ${db.dynamicState.rowCapEnd}</p>`;
        html += `<ul>`;
        sugg.exercises.forEach(e => html += `<li style="margin-bottom:8px"><strong>${e.name}</strong> ${e.details ? '<br><small>'+e.details+'</small>' : ''}</li>`);
        html += `</ul></div>`;
        document.getElementById('today-suggestion').innerHTML = html;
        
        // Prep log
        let formHtml = `<input type="hidden" id="log-primary" value="${sugg.primary}">`;
        sugg.exercises.forEach((e, i) => {
            formHtml += `<div class="log-item">
                <label>${e.name}</label>
                <input type="text" id="log-ex-${i}" placeholder="Sets x Reps x Load" value="${e.details || ''}">
            </div>`;
        });
        formHtml += `<div class="log-item"><label>Session Notes</label><textarea id="log-notes"></textarea></div>`;
        document.getElementById('log-form').innerHTML = formHtml;
    }
    else if (target === 'view-status') {
        const s = db.dynamicState;
        let html = `<div class="card">
            <p><strong>Row Cap:</strong> ${s.rowCap ? `Active to ${s.rowCapEnd}` : 'Inactive'} (Breaches: ${s.rowBreaches})</p>
            <p><strong>Grip Flag:</strong> ${s.gripFlag}</p>
            <p><strong>Pain:</strong> ER: ${s.pain.er}, EL: ${s.pain.el}, HQ: ${s.pain.hq}, Costal: ${s.pain.costal}</p>
            <h3>Deadlift Map</h3>
            <p>Triples: ${s.deadliftMap.cleanTripleTotal}kg | Doubles: ${s.deadliftMap.cleanDoubleTotal}kg | Singles: ${s.deadliftMap.cleanSingleTotal}kg</p>
        </div>`;
        document.getElementById('status-content').innerHTML = html;
    }
    else if (target === 'view-history') {
        let html = '';
        db.sessions.slice(0, 7).forEach(s => {
            html += `<div class="card"><small>${s.date}</small><p>${s.summary}</p></div>`;
        });
        document.getElementById('history-list').innerHTML = html;
    }
    else if (target === 'view-rules') {
        document.getElementById('research-notes').value = db.notes || "";
        let html = '';
        db.exercises.forEach((e, i) => {
            html += `<div class="checkbox-row">
                <span>${e.name} <small>(${e.cat})</small></span>
                <input type="checkbox" onchange="toggleDeprio(${i})" ${e.deprioritised ? 'checked' : ''}>
            </div>`;
        });
        document.getElementById('exercise-rules').innerHTML = html;
    }
}

document.getElementById('save-session-btn').addEventListener('click', () => {
    let summary = document.getElementById('log-primary').value + ", ";
    document.querySelectorAll('[id^="log-ex-"]').forEach(el => {
        if(el.value) summary += el.previousElementSibling.innerText + " (" + el.value + "), ";
    });
    summary += document.getElementById('log-notes').value;
    
    db.sessions.unshift({ date: getTodayDate(), summary });
    db.dynamicState.lastQuality = document.getElementById('log-primary').value;
    db.dynamicState.lastDates[db.dynamicState.lastQuality] = getTodayDate();
    if(summary.toLowerCase().includes('grip')) { db.dynamicState.gripFlag = false; db.dynamicState.lastDates.grip = getTodayDate(); }
    if(summary.toLowerCase().includes('neck')) db.dynamicState.lastDates.neck = getTodayDate();
    if(summary.toLowerCase().includes('core')) db.dynamicState.lastDates.core = getTodayDate();
    if(summary.toLowerCase().includes('hinge') || summary.toLowerCase().includes('deadlift')) db.dynamicState.lastDates.hinge = getTodayDate();
    
    saveDB();
    alert("Session saved!");
});

document.getElementById('save-notes-btn').addEventListener('click', () => {
    db.notes = document.getElementById('research-notes').value;
    saveDB();
    alert("Notes saved.");
});

window.toggleDeprio = function(idx) {
    db.exercises[idx].deprioritised = !db.exercises[idx].deprioritised;
    saveDB();
};

document.getElementById('export-db-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(db, null, 2)).then(() => alert("Copied full DB to clipboard!"));
});

document.getElementById('export-gpt-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(db.dynamicState, null, 2)).then(() => alert("Copied dynamic state to clipboard!"));
});

document.getElementById('import-db-btn').addEventListener('click', () => {
    try {
        let newData = JSON.parse(document.getElementById('import-data').value);
        if(newData.dynamicState && newData.sessions) { db = newData; saveDB(); alert("Imported!"); renderActiveView('view-status'); }
        else alert("Invalid JSON structure.");
    } catch(e) { alert("Invalid JSON."); }
});

// Init
renderActiveView('view-today');