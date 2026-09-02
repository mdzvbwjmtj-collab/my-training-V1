(()=>{
const add=()=>{const n=document.querySelector('.nav');if(!n||n.querySelector('.calendar-link'))return;const a=document.createElement('a');a.className='calendar-link';a.href='calendar.html';a.innerHTML='▣<span>Calendar</span>';n.insertBefore(a,n.children[1]||null)};
const original=window.go;if(typeof original==='function'&&!original.__calendarNav){const go=(s)=>{original(s);setTimeout(add,0)};go.__calendarNav=true;window.go=go}setTimeout(add,0);
if(!document.querySelector('script[data-missed-workout]')){const s=document.createElement('script');s.src='missed-workout.js?v=1';s.dataset.missedWorkout='1';document.body.appendChild(s)}
})();
