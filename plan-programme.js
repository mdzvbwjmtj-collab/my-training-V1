(()=>{
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const targets=e=>{const m=String(e.reps||'').match(/\d+x(.+)/);return m?m[1].split(',').map(Number):[]};
const totalSets=w=>w.exercises.reduce((n,e)=>n+targets(e).length,0);
const totalExercises=ws=>ws.reduce((n,w)=>n+w.exercises.length,0);
const workouts=()=>window.PROGRAM||[];
const nav=()=>`<nav class="nav"><a href="index.html?screen=home">⌂<span>Home</span></a><a href="calendar.html">▦<span>Calendar</span></a><button class="active" type="button" onclick="go('plan')">☷<span>Plan</span></button><button type="button" onclick="go('progress')">⌁<span>Progress</span></button></nav>`;
const renderOverview=()=>{
 const app=document.getElementById('app'); if(!app)return;
 const ws=workouts();
 app.innerHTML=`<main class="shell programme-page">
  <header class="programme-hero"><div class="eyebrow">Training programme</div><h1>Pumped</h1><p>20 workouts · 4 sessions per week</p></header>
  <section class="programme-section current-section">
   <h2 class="section-title">Current phase</h2>
   <button class="phase-card phase-card-current" type="button" onclick="openProgrammePhase(1)">
    <span class="phase-card-copy"><strong>Phase 1</strong><span>${ws.length} Workouts <i></i> ${totalExercises(ws)} Exercises</span></span><span class="phase-arrow">›</span>
   </button>
  </section>
  <section class="programme-section upcoming-section">
   <h2 class="section-title">Upcoming phases</h2>
   <div class="phase-card phase-card-empty" aria-disabled="true">
    <span class="phase-card-copy"><strong>Phase 2</strong><span>Coming later</span></span><span class="phase-arrow">›</span>
   </div>
  </section>
  <section class="programme-overview">
   <h2 class="section-title">Programme overview</h2>
   <p>Designed to take you through 20 structured training sessions across Phase 1. Select the current phase above to view the workouts.</p>
  </section>
 </main>${nav()}`;
};
const renderPhase1=()=>{
 const app=document.getElementById('app'); if(!app)return;
 const ws=workouts();
 app.innerHTML=`<main class="shell programme-page">
  <button class="programme-back" type="button" onclick="backToProgramme()">‹ <span>Training programme</span></button>
  <header class="phase-detail-heading"><div class="eyebrow">Current phase</div><h1>Phase 1</h1><p>${ws.length} workouts · ${totalExercises(ws)} exercises</p></header>
  <section class="programme-workouts">${ws.map(w=>`<article class="programme-workout card"><div class="programme-workout-head"><div><span class="workout-number">Workout #${esc(w.id)}</span><h3>${esc(w.type)}</h3></div><span class="workout-meta">${w.exercises.length} exercises · ${totalSets(w)} sets</span></div><div class="programme-exercises">${w.exercises.map((e,i)=>`<div class="programme-exercise"><span class="programme-index">${i+1}</span><div><b>${esc(e.name)}</b><div class="muted">${esc(e.reps)}</div></div></div>`).join('')}</div><button type="button" class="text-link" onclick="choose('${esc(w.id)}')">Open workout <span>›</span></button></article>`).join('')}</section>
 </main>${nav()}`;
};
window.openProgrammePhase=phase=>{if(Number(phase)===1)renderPhase1()};
window.backToProgramme=()=>renderOverview();
const install=()=>{const g=window.go;if(typeof g!=='function'||g.__programmePlan)return;const wrapped=s=>{g(s);if(s==='plan')setTimeout(renderOverview,0)};wrapped.__programmePlan=true;window.go=wrapped;setTimeout(()=>{if(location.search.includes('screen=plan'))renderOverview()},0)};
setTimeout(install,0);setTimeout(install,100);setTimeout(install,500);
})();
