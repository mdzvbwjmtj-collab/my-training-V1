(function(){
 const pageState=window.exercisePageState=window.exercisePageState||{index:0};
 state.workoutSession=state.workoutSession||{active:false,workoutId:null,exerciseIndex:0};
 if(state.workoutSession.active && state.workoutSession.workoutId===state.selected){pageState.index=Number(state.workoutSession.exerciseIndex)||0}else if(!state.workoutSession.active){pageState.index=0}
 const clamp=()=>{const w=currentWorkout();pageState.index=Math.max(0,Math.min(w.exercises.length-1,Number(pageState.index)||0));return pageState.index};
 function beginSession(){state.workoutSession={active:true,workoutId:state.selected,exerciseIndex:0};pageState.index=0;state.screen='workout';save();render()}
 function stopWorkout(){if(!confirm('Stop this workout? Your logged sets will be saved, but the workout will not be marked completed.'))return;stopRest();state.workoutSession={active:false,workoutId:null,exerciseIndex:0};state.screen='home';save();render()}
 function goExercise(index){pageState.index=Number(index);clamp();state.workoutSession.active=true;state.workoutSession.workoutId=state.selected;state.workoutSession.exerciseIndex=pageState.index;stopRest();save();render()}
 window.start=beginSession;
 window.stopWorkout=stopWorkout;
 window.goExercise=goExercise;
 window.nextExercise=()=>{const w=currentWorkout(),i=clamp();if(i<w.exercises.length-1)goExercise(i+1);else finish()};
 window.previousExercise=()=>{const i=clamp();if(i>0)goExercise(i-1)};
 const originalFinish=window.finish;
 window.finish=function(){if(!confirm('Finish workout? This will mark the workout as completed.'))return;stopRest();originalFinish();state.workoutSession={active:false,workoutId:null,exerciseIndex:0};state.screen='home';save();render()};
 const oldWorkout=window.workout;
 window.workout=function(){
   const w=currentWorkout(),i=clamp(),e=w.exercises[i];
   const first=i===0,last=i===w.exercises.length-1;
   const card=exercise(e,i);
   const inner=card.replace(/^<article class="card exercise-card">/,'').replace(/<\/article>$/,'');
   const body=inner.replace(/<div class="exercise-head">[\s\S]*?<\/div><div class="previous">/,'<div class="previous">');
   const timer=restTimer();
   return `<main class="shell exercise-page" data-exercise-index="${i}"><div class="exercise-session-bar"><button class="exercise-back" onclick="previousExercise()" ${first?'disabled':''}>‹ Previous exercise</button><span>Exercise ${i+1} of ${w.exercises.length}</span><button class="exercise-stop" onclick="stopWorkout()">Stop workout</button></div><div class="top"><div class="eyebrow">Workout #${w.id} · ${w.type}</div><div class="title">${i+1}. ${esc(e.name)}</div><div class="sub">Programme: ${esc(e.reps)}</div></div><section class="section"><article class="card exercise-card integrated-exercise">${body}<div class="integrated-rest">${timer}</div></article></section><div class="exercise-nav-bottom"><button class="primary next-exercise" onclick="nextExercise()">${last?'Finish workout':'Next exercise'} <span>›</span></button></div></main>`;
 };
 const oldRender=window.render;
 window.render=function(){oldRender();setTimeout(()=>{const card=document.querySelector('.exercise-page .exercise-card');if(card){card.dataset.setFlowReady='';if(typeof enhance==='function')enhance();}},0)};
 const oldToggle=window.toggle;
 window.toggle=function(ei,si){oldToggle(ei,si);const w=currentWorkout(),l=currentLog(),targets=reps(w.exercises[ei]);if(l?.sets?.[ei]?.[si]?.completed&&ei===clamp()&&si===targets.length-1&&ei<w.exercises.length-1){startRest(restDuration,{exercise:ei+1});}};
 document.addEventListener('rest-complete',e=>{const ex=e.detail&&e.detail.exercise;if(ex!=null){goExercise(ex)}});
})();