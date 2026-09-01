let restDuration=120;
let restEndsAt=0;
let restInterval=null;
let restAudio=null;
const restOptions=[60,120,180];
const openSets={};
const formatRest=s=>{const n=Math.max(0,Math.ceil(s));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
function pingRest(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;restAudio=restAudio||new C();if(restAudio.state==='suspended')restAudio.resume();const o=restAudio.createOscillator(),g=restAudio.createGain();o.type='sine';o.frequency.setValueAtTime(880,restAudio.currentTime);o.frequency.exponentialRampToValueAtTime(1320,restAudio.currentTime+.12);g.gain.setValueAtTime(.0001,restAudio.currentTime);g.gain.exponentialRampToValueAtTime(.18,restAudio.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,restAudio.currentTime+.45);o.connect(g);g.connect(restAudio.destination);o.start();o.stop(restAudio.currentTime+.46)}catch(e){}}
function restTick(){if(!restEndsAt)return;const left=Math.max(0,(restEndsAt-Date.now())/1000);if(left<=0){const next=restNext||null;restEndsAt=0;if(restInterval){clearInterval(restInterval);restInterval=null}pingRest();restNext=null;render();setTimeout(()=>{if(next)document.dispatchEvent(new CustomEvent('rest-complete',{detail:next}))},0);return}render()}
let restNext=null;
function startRest(seconds=restDuration,next=null){const s=restOptions.includes(Number(seconds))?Number(seconds):restDuration;restDuration=s;restNext=next;restEndsAt=Date.now()+s*1000;if(restInterval)clearInterval(restInterval);restInterval=setInterval(restTick,1000);render()}
function stopRest(){restEndsAt=0;restNext=null;if(restInterval){clearInterval(restInterval);restInterval=null}render()}
function selectRest(seconds){restDuration=restOptions.includes(Number(seconds))?Number(seconds):120;if(restEndsAt)restEndsAt=Date.now()+restDuration*1000;render()}
function restTimer(){const active=restEndsAt>0;const left=active?Math.max(0,(restEndsAt-Date.now())/1000):0;return `<div class="card rest-timer"><div class="rest-top"><div><div class="muted">Rest timer</div><div class="rest-time" aria-live="polite">${active?formatRest(left):'00:00'}</div></div><button class="rest-start" onclick="${active?'stopRest()':'startRest()'}">${active?'Stop':'Start rest'}</button></div><div class="rest-options" role="group" aria-label="Rest duration">${restOptions.map(x=>`<button class="rest-option ${restDuration===x?'selected':''}" onclick="selectRest(${x})">${x/60} min</button>`).join('')}</div><div class="rest-help">Choose 1, 2 or 3 minutes. Completing a set starts the selected rest automatically.</div></div>`}
const baseWorkoutWithTimer=window.workout;
window.workout=function(){let h=baseWorkoutWithTimer();return h.includes('rest-timer')?h:h.replace('<div class="card hero">',restTimer()+'<div class="card hero">')};
const baseToggleWithTimer=window.toggle;
window.toggle=function(ei,si){baseToggleWithTimer(ei,si);const l=currentLog();if(l?.sets?.[ei]?.[si]?.completed){const targets=reps(currentWorkout().exercises[ei]);const nextSi=si+1;const nextKey=nextSi<targets.length?{key:`${currentWorkout().id}:${ei}:${nextSi}`}:null;startRest(restDuration,nextKey)}};
