(()=>{
const add=()=>{
 const n=document.querySelector('.nav');
 if(!n)return;
 let p=n.querySelector('.plan-link');
 if(!p){
  const old=[...n.children].find(x=>x.tagName==='BUTTON'&&/Plan/.test(x.textContent||''));
  if(old){p=document.createElement('a');p.className='plan-link';p.href='plan.html';p.innerHTML='☷<span>Plan</span>';old.replaceWith(p)}
 }
 let c=n.querySelector('.calendar-link');
 if(!c){c=document.createElement('a');c.className='calendar-link';c.href='calendar.html';c.innerHTML='▣<span>Calendar</span>';const home=n.children[0];n.insertBefore(c,n.children[1]||null)}
};
const original=window.go;if(typeof original==='function'&&!original.__calendarNav){const go=(s)=>{original(s);setTimeout(add,0)};go.__calendarNav=true;window.go=go}
setTimeout(add,0);setTimeout(add,100);setTimeout(add,500);
if(!document.querySelector('script[data-missed-workout]')){const s=document.createElement('script');s.src='missed-workout.js?v=2';s.dataset.missedWorkout='1';document.body.appendChild(s)}
})();
