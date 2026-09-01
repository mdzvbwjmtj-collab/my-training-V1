(()=>{
  const KEY='myTrainingWorkoutSession';
  let s=JSON.parse(localStorage.getItem(KEY)||'null')||{active:false,index:0,timer:0};
  const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
  const esc=x=>String(x??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const targets=e=>{const m=String(e.reps).match(/\d+x(.+)/);return m?m[1].split(',').map(Number):[]};
  const workout=()=>PROGRAM.find(w=>w.id===JSON.parse(localStorage.getItem('myTrainingDashboard')||'{}').selected)||PROGRAM[0];
  const dashboard=()=>JSON.parse(localStorage.getItem('myTrainingDashboard')||'{}');
  let timerId=null;
  function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
  function beep(){try{const C=window.AudioContext||window.webkitAudioContext;if(C){const c=new C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.08;o.start();o.stop(c.currentTime+.18)}}catch{}}
  function startTimer(min,after){stopTimer();s.timer=min*60;save();render();timerId=setInterval(()=>{s.timer--;save();render();if(s.timer<=0){stopTimer();s.timer=0;save();beep();if(after)after()}},1000)}
  const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  function start(){s.active=true;s.index=0;s.timer=0;save();render()}
  function finish(){stopTimer();s.active=false;s.index=0;s.timer=0;save();if(window.finishCore)window.finishCore();else{const d=dashboard();d.screen='home';d.activeWorkout=false;localStorage.setItem('myTrainingDashboard',JSON.stringify(d));location.reload()}}
  function stop(){if(!confirm('Stop this workout? Your logged sets will be saved, but the workout will not be marked complete.'))return;stopTimer();s.active=false;s.timer=0;save();const d=dashboard();d.screen='home';d.activeWorkout=false;localStorage.setItem('myTrainingDashboard',JSON.stringify(d));location.reload()}
  function next(){const w=workout();if(s.index<w.exercises.length-1){s.index++;s.timer=0;save();render()}else finish()}
  function prev(){if(s.index>0){s.index--;s.timer=0;save();render()}}
  function timerChoice(m){startTimer(m,()=>{const w=workout(),t=targets(w.exercises[s.index]);const d=dashboard();const l=d.logs?.[`${new Date().toISOString().slice(0,10)}::${d.selected}`];const sets=l?.sets?.[s.index]||{};const last=t.length-1;if(sets[last]?.completed){if(s.index<w.exercises.length-1){s.index++;save();render()}}})}
  function page(){const w=workout(),e=w.exercises[s.index],t=targets(e),d=dashboard(),l=d.logs?.[`${new Date().toISOString().slice(0,10)}::${d.selected}`]||{sets:{}};const sets=l.sets?.[s.index]||{};const done=t.filter((_,i)=>sets[i]?.completed).length;
    return `<main class="shell session-shell"><header class="session-head"><button class="session-back" onclick="workoutPrev()" ${s.index===0?'disabled':''}>‹ Previous</button><div><div class="eyebrow">Exercise ${s.index+1} of ${w.exercises.length}</div><h1>${esc(e.name)}</h1><div class="muted">${esc(e.reps)}</div></div><button class="session-stop" onclick="workoutStop()">Stop</button></header><div class="session-progress"><span style="width:${((s.index+1)/w.exercises.length)*100}%"></span></div><article class="card session-card"><div class="session-meta"><span>${done}/${t.length} sets</span><span>${esc(w.type)}</span></div><div class="log-head"><span>SET</span><span>KG</span><span>TARGET</span><span>REPS</span><span></span></div>${t.map((target,i)=>{const x=sets[i]||{};return `<div class="set-row"><span class="set-num">${i+1}</span><input inputmode="decimal" type="number" step="0.5" placeholder="kg" value="${x.weight??''}" onchange="setValue(${s.index},${i},'weight',this.value)"><span class="target">${target}</span><input inputmode="numeric" type="number" step="1" placeholder="${target}" value="${x.reps??''}" onchange="setValue(${s.index},${i},'reps',this.value)"><button class="check ${x.completed?'checked':''}" onclick="toggleSet(${s.index},${i})">${x.completed?'✓':'○'}</button></div>${x.completed&&i<t.length-1?`<div class="set-timer"><span>Rest</span>${s.timer?`<b>${fmt(s.timer)}</b>`:`<button onclick="rest(1)">1m</button><button onclick="rest(2)">2m</button><button onclick="rest(3)">3m</button>`}</div>`:''}`).join('')}</article><div class="session-bottom"><button class="secondary" onclick="workoutPrev()" ${s.index===0?'disabled':''}>Previous exercise</button><button class="primary" onclick="workoutNext()">${s.index===w.exercises.length-1?'Finish workout':'Next exercise'} <span>›</span></button></div></main>`
  }
  function render(){if(!s.active)return;document.body.innerHTML=page()}
  window.start=start;window.workoutNext=next;window.workoutPrev=prev;window.workoutStop=stop;window.rest=timerChoice;
  window.toggleSet=(ei,si)=>{if(typeof toggle==='function')toggle(ei,si);setTimeout(()=>{if(s.active)render()},0)};
  const oldFinish=window.finish;window.finishCore=oldFinish;window.finish=finish;
  if(s.active)render();
})();