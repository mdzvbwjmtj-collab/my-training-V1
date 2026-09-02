(()=>{
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const targets=e=>{const m=String(e.reps||'').match(/\d+x(.+)/);return m?m[1].split(',').map(Number):[]};
const totalSets=w=>w.exercises.reduce((n,e)=>n+targets(e).length,0);
const render=()=>{
 const app=document.getElementById('app'); if(!app||!window.PROGRAM)return;
 const workouts=window.PROGRAM;
 app.innerHTML=`<main class="shell programme-page"><div class="top programme-heading"><div><div class="eyebrow">Training programme</div><div class="title">Pumped</div><div class="sub">20 workouts · 4 sessions per week</div></div></div>
 <section class="programme-phase phase-one"><div class="phase-heading"><div><div class="eyebrow">Phase 1</div><h2>Current programme</h2></div><span class="phase-count">${workouts.length} workouts</span></div>
 <div class="programme-workouts">${workouts.map(w=>`<article class="programme-workout card"><div class="programme-workout-head"><div><span class="workout-number">Workout #${esc(w.id)}</span><h3>${esc(w.type)}</h3></div><span class="workout-meta">${w.exercises.length} exercises · ${totalSets(w)} sets</span></div><div class="programme-exercises">${w.exercises.map((e,i)=>`<div class="programme-exercise"><span class="programme-index">${i+1}</span><div><b>${esc(e.name)}</b><div class="muted">${esc(e.reps)}</div></div></div>`).join('')}</div><button type="button" class="text-link" onclick="choose('${esc(w.id)}')">Open workout <span>›</span></button></article>`).join('')}</div></section>
 <section class="programme-phase phase-two"><div class="phase-heading"><div><div class="eyebrow">Phase 2</div><h2>Coming later</h2></div></div><div class="phase-empty card"><div class="phase-empty-icon">+</div><h3>Phase 2</h3><p class="muted">This phase is ready for your next programme. Details will be added here later.</p></div></section></main><nav class="nav"><button class="active" onclick="go('plan')">☷<span>Plan</span></button><button onclick="go('home')">⌂<span>Home</span></button><button onclick="go('progress')">⌁<span>Progress</span></button></nav>`;
};
const install=()=>{const g=window.go;if(typeof g!=='function'||g.__programmePlan)return;const wrapped=s=>{g(s);if(s==='plan')setTimeout(render,0)};wrapped.__programmePlan=true;window.go=wrapped;if((window.myTrainingDashboard?.screen||'home')==='plan')render()};
setTimeout(install,0);setTimeout(install,100);setTimeout(install,500);
})();
