(()=>{
const KEY='myTrainingSchedule';
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>new Date(`${s}T12:00:00`);
const today=()=>iso(new Date());
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const schedule=()=>{let a=read(KEY);if(!Array.isArray(a)||!a.length){const start=today();a=(window.PROGRAM||[]).map((w,i)=>({id:w.id,date:addDays(start,i)}));save(KEY,a)}return a};
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const monthName=d=>d.toLocaleDateString('en-GB',{month:'long',year:'numeric'}).toUpperCase();
const dayKey=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const completedByDate=()=>{
  const out=new Set();
  ['myTrainingDashboard','myTrainingVideoPlan'].forEach(key=>{
    const data=read(key);if(!data||!data.logs)return;
    Object.entries(data.logs).forEach(([k,v])=>{
      if(!v||!v.done)return;
      const parts=k.split('::');if(parts[0])out.add(parts[0]);
    });
  });
  return out;
};
const hasPR=value=>{
  if(!value||typeof value!=='object')return false;
  if(Array.isArray(value))return value.some(hasPR);
  return Object.entries(value).some(([k,v])=>/(^|_|-)(pr|personal.?best|personal.?record)(_|-|$)/i.test(k)&&(v===true||(Array.isArray(v)&&v.length>0)||(v&&typeof v==='object'))||hasPR(v));
};
const prDates=()=>{
  const out=new Set();
  ['myTrainingDashboard','myTrainingVideoPlan'].forEach(key=>{
    const data=read(key);if(!data||!data.logs)return;
    Object.entries(data.logs).forEach(([k,v])=>{if(hasPR(v)){const parts=k.split('::');if(parts[0])out.add(parts[0])}});
  });
  return out;
};
const workoutForDate=(date,a)=>a.find(x=>x.date===date)||null;
const icons={
  dumbbell:`<svg class="calendar-icon dumbbell" viewBox="0 0 44 30" aria-hidden="true"><path d="M7 8v14M2 10v10M12 5v20M32 5v20M37 8v14M42 10v10M12 15h20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trophy:`<svg class="calendar-icon trophy" viewBox="0 0 44 34" aria-hidden="true"><path d="M14 4h16v8c0 6-3 10-8 10s-8-4-8-10V4Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 7H7v3c0 5 3 7 7 7M30 7h7v3c0 5-3 7-7 7M22 22v5M16 30h12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  calendar:`<svg class="calendar-head-icon" viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="5" width="22" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M8 3v5M20 3v5M3 11h22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="19" cy="19" r="3" fill="currentColor"/></svg>`
};
let calendarOpen=false,viewDate=new Date(new Date().getFullYear(),new Date().getMonth(),1),origGo=null,origStart=null,patched=false;
function calendarPage(){
  const a=schedule(),done=completedByDate(),prs=prDates();
  const y=viewDate.getFullYear(),m=viewDate.getMonth();
  const first=new Date(y,m,1),last=new Date(y,m+1,0);
  const startOffset=(first.getDay()+6)%7;
  const total=Math.ceil((startOffset+last.getDate())/7)*7;
  let cells='';
  for(let i=0;i<total;i++){
    const n=i-startOffset+1;
    if(n<1||n>last.getDate()){cells+=`<div class="calendar-cell empty" aria-hidden="true"></div>`;continue}
    const date=dayKey(y,m,n),x=workoutForDate(date,a),completed=done.has(date),pr=prs.has(date),isToday=date===today();
    const past=date<today();
    let state='';
    if(x) state=completed?'workout':past?'missed':'workout future';
    else if(date>=a.reduce((min,q)=>q.date<min?q.date:min,a[0]?.date||date)) state='rest';
    const icon=pr?icons.trophy:x?(completed?icons.dumbbell:(past?'×':icons.dumbbell)):state==='rest'?'R':'';
    const label=x?`Workout #${esc(x.id)}${completed?' completed':''}${pr?' · personal record':''}`:(state==='rest'?'Rest day':isToday?'Today':'No workout');
    cells+=`<button type="button" class="calendar-cell ${state} ${isToday?'today':''} ${pr?'pr':''}" aria-label="${esc(label)}" onclick="calendarDay('${date}')"><span class="calendar-number">${n}</span><span class="calendar-mark">${icon}</span></button>`;
  }
  return `<main class="shell calendar-modern"><section class="calendar-header"><h1>${monthName(viewDate)}</h1><div class="calendar-actions"><button type="button" aria-label="Previous month" onclick="calendarMonth(-1)">‹</button><button type="button" class="calendar-today" aria-label="Go to current month" onclick="calendarToday()">${icons.calendar}</button><button type="button" aria-label="Next month" onclick="calendarMonth(1)">›</button></div></section><div class="calendar-weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="calendar-grid">${cells}</div></main>${nav('calendar')}`;
}
function nav(active){return `<nav class="nav"><button class="${active==='home'?'active':''}" onclick="calendarNav('home')">⌂<span>Home</span></button><button class="${active==='calendar'?'active':''}" onclick="calendarNav('calendar')">▣<span>Calendar</span></button><button class="${active==='plan'?'active':''}" onclick="calendarNav('plan')">☷<span>Plan</span></button><button class="${active==='progress'?'active':''}" onclick="calendarNav('progress')">⌁<span>Progress</span></button></nav>`}
window.calendarMonth=n=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+n,1);renderCalendar()};
window.calendarToday=()=>{const d=new Date();viewDate=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar()};
window.calendarDay=date=>{
  const x=schedule().find(q=>q.date===date);if(!x)return;
  const w=(window.PROGRAM||[]).find(q=>q.id===x.id);if(w&&typeof window.choose==='function'){try{window.choose(x.id)}catch{}}
};
window.calendarMove=(id,date)=>{if(!date)return;const a=schedule(),x=a.find(q=>q.id===id);if(x)x.date=date;else a.push({id,date});save(KEY,a);renderCalendar()};
window.calendarNav=s=>{if(s==='calendar'){calendarOpen=true;renderCalendar();return}calendarOpen=false;if(origGo)origGo(s);else if(s==='home'&&typeof window.render==='function')window.render()};
function renderCalendar(){document.body.innerHTML=calendarPage()}
function patch(){
  if(typeof window.go==='function'&&!origGo){origGo=window.go;window.go=(s)=>s==='calendar'?window.calendarNav('calendar'):origGo(s)}
  if(typeof window.start==='function'&&!origStart){origStart=window.start;window.start=()=>{const a=schedule(),done=completedByDate(),next=a.find(x=>!done.has(x.date)&&x.date>=today());if(next&&typeof window.choose==='function')window.choose(next.id);origStart()}}
  if(!patched){patched=true;fixNav()}
}
function fixNav(){if(calendarOpen)return;const n=document.querySelector('.nav');if(!n||n.querySelector('[data-calendar]'))return;const b=document.createElement('button');b.dataset.calendar='1';b.innerHTML='▣<span>Calendar</span>';b.onclick=()=>window.calendarNav('calendar');n.insertBefore(b,n.children[1]||null)}
new MutationObserver(()=>{patch();if(calendarOpen&&!document.querySelector('.calendar-modern'))renderCalendar();else fixNav()}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(patch,200);setTimeout(patch,500);
})();
