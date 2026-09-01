(function(){
const page=window.exercisePageState=window.exercisePageState||{index:0};
const clamp=()=>{const w=currentWorkout();page.index=Math.max(0,Math.min(w.exercises.length-1,Number(page.index)||0));return page.index};
function goExercise(i){page.index=Number(i);clamp();if(typeof stopRest==='function')stopRest();save();render()}
window.previousExercise=()=>{const i=clamp();if(i>0)goExercise(i-1)};
window.nextExercise=()=>{const w=currentWorkout(),i=clamp();if(i<w.exercises.length-1)goExercise(i+1);else finish()};
const oldChoose=window.choose;window.choose=function(id){page.index=0;oldChoose(id)};
const oldStart=window.start;window.start=function(){page.index=0;oldStart()};
window.workout=function(){
 const w=currentWorkout(),i=clamp(),e=w.exercises[i],l=currentLog(),targets=reps(e),done=targets.filter((_,si)=>l.sets?.[i]?.[si]?.completed).length;
 const first=i===0,last=i===w.exercises.length-1;
 return `<main class="shell exercise-page" data-exercise-index="${i}"><div class="exercise-nav-top"><button class="exercise-back" onclick="previousExercise()" ${first?'disabled':''}>‹ Previous exercise</button><span>Exercise ${i+1} of ${w.exercises.length}</span></div><div class="top"><div class="eyebrow">Workout #${w.id} · ${w.type}</div><div class="title">${i+1}. ${esc(e.name)}</div><div class="sub">Programme: ${esc(e.reps)}</div></div>${restTimer()}<section class="section">${exercise(e,i)}</section><div class="exercise-nav-bottom"><button class="primary next-exercise" onclick="nextExercise()">${last?'Finish workout':'Next exercise'} <span>›</span></button></div></main>${nav('workout')}`;
};
const oldToggle=window.toggle;
window.toggle=function(ei,si){oldToggle(ei,si);const w=currentWorkout(),l=currentLog(),targets=reps(w.exercises[ei]);if(l?.sets?.[ei]?.[si]?.completed&&ei===clamp()&&si===targets.length-1){if(ei<w.exercises.length-1)startRest(restDuration,{exercise:ei+1});else startRest(restDuration,{exercise:'finish'});}};
document.addEventListener('rest-complete',e=>{const ex=e.detail&&e.detail.exercise;if(ex==='finish'){finish();return}if(ex!=null)goExercise(ex)});
function enhance(){document.querySelectorAll('.exercise-card').forEach((card,ei)=>{if(card.querySelector('.quick-actions'))return;const rec=card.querySelector('.recommendation');if(!rec)return;const actions=document.createElement('div');actions.className='quick-actions';actions.style='display:flex;gap:8px;margin:10px 0 4px;';actions.innerHTML='<button type="button" class="text-link quick-use" style="padding:7px 10px;border:1px solid #333;border-radius:8px;background:#111;">Use last load</button><span class="muted" style="align-self:center;font-size:12px">Complete each set before moving on</span>';actions.querySelector('.quick-use').addEventListener('click',function(){const w=currentWorkout(),last=previousLog(w.id),prev=last&&last.sets&&last.sets[ei];if(!prev)return;const targets=reps(w.exercises[ei]);targets.forEach((_,si)=>{const p=prev[si];if(p&&p.weight!==''&&p.weight!=null)setValue(ei,si,'weight',p.weight)});});rec.after(actions)});}
document.addEventListener('DOMContentLoaded',enhance);
})();