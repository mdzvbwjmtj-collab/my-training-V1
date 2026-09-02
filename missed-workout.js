(()=>{
const S='myTrainingSchedule',P='myTrainingProgramme',D='myTrainingDashboard';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const localIso=d=>{const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const today=()=>localIso(new Date());
const isDone=(x,d)=>Boolean(d.logs?.[`${x.date}::${x.id}`]?.done||x.completedLater||x.completed);
const missed=()=>{const a=read(S)||[],d=read(D)||{},t=today();return a.filter(x=>!x.completedLater&&!x.completed&&((x.originalDate&&x.originalDate<t)||(!x.originalDate&&x.date<t&&!isDone(x,d)))).sort((a,b)=>String(a.originalDate||a.date).localeCompare(String(b.originalDate||b.date)))};
const todaySession=()=>{const a=read(S)||[],d=read(D)||{},t=today();return a.find(x=>x.date===t&&!isDone(x,d))};
const nextTrainingDates=(days,count,start)=>{const out=[],d=new Date(`${start}T12:00:00`);for(let i=0;out.length<count&&i<730;i++){const wd=(d.getDay()+6)%7;if(days.includes(wd))out.push(localIso(d));d.setDate(d.getDate()+1)}return out};
const moveMissedIntoSequence=(x)=>{
 const a=read(S)||[],p=read(P)||{},d=read(D)||{},t=today();
 const moving=a.filter(q=>q!==x&&q.date>=t&&!isDone(q,d)).sort((u,v)=>String(u.date).localeCompare(String(v.date))||String(u.id).localeCompare(String(v.id)));
 const fixed=a.filter(q=>q!==x&&!moving.includes(q));
 const days=Array.isArray(p.days)?p.days:[0,1,2,3];
 const tomorrowDate=(()=>{const z=new Date(`${t}T12:00:00`);z.setDate(z.getDate()+1);return localIso(z)})();
 const dates=nextTrainingDates(days,moving.length,tomorrowDate);
 x.originalDate=x.originalDate||x.date;
 x.date=t;
 moving.forEach((q,i)=>{if(dates[i])q.date=dates[i]});
 write(S,[...fixed,x,...moving].sort((u,v)=>String(u.date).localeCompare(String(v.date))||String(u.id).localeCompare(String(v.id))));
};
const css=()=>{if(document.getElementById('missed-workout-css'))return;const s=document.createElement('style');s.id='missed-workout-css';s.textContent='.missed-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.68);display:grid;place-items:center;padding:20px}.missed-dialog{width:min(520px,100%);background:#151515;color:#f5f5f5;border:1px solid #3a3a3a;border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.45)}.missed-dialog h2{margin:0 0 8px;font-size:26px}.missed-dialog p{color:#aaa;line-height:1.45;margin:0 0 20px}.missed-dialog .missed-name{font-weight:800;color:#fff}.missed-actions{display:grid;gap:10px}.missed-actions button{border-radius:12px;padding:14px 16px;font-weight:800;font-size:15px}.missed-do{border:0;background:#fff;color:#050505}.missed-skip{border:1px solid #3a3a3a;background:#101010;color:#fff}.missed-cancel{border:0;background:transparent;color:#999;padding:8px!important;font-weight:600!important}html[data-theme="light"] .missed-dialog{background:#f5f5f5;color:#050505;border-color:#d5d5d5}html[data-theme="light"] .missed-dialog p{color:#666}html[data-theme="light"] .missed-dialog .missed-name{color:#050505}html[data-theme="light"] .missed-skip{background:#fff;color:#111;border-color:#ccc}';document.head.appendChild(s)};
const close=()=>document.getElementById('missed-workout-overlay')?.remove();
const launch=(id,original,sequence)=>{const d=read(D)||{};d.selected=id;d.screen='workout';d.activeWorkout=false;write(D,d);if(sequence)moveMissedIntoSequence(sequence);close();original()};
const show=(m,original)=>{css();const x=m[0],ts=todaySession();const overlay=document.createElement('div');overlay.id='missed-workout-overlay';overlay.className='missed-overlay';overlay.innerHTML=`<section class="missed-dialog" role="dialog" aria-modal="true"><div class="eyebrow">Missed workout</div><h2>You have a missed workout</h2><p><span class="missed-name">Workout #${x.id}</span> was scheduled for ${new Date(`${x.originalDate||x.date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long'})}.</p><p>Would you like to do the missed workout today, or continue with today's scheduled workout?</p><div class="missed-actions"><button class="missed-do" data-choice="do">Do missed workout</button>${ts?'<button class="missed-skip" data-choice="skip">Skip to today\'s workout</button>':''}<button class="missed-cancel" data-choice="cancel">Cancel</button></div></section>`;document.body.appendChild(overlay);overlay.addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(!b)return;const choice=b.dataset.choice;if(choice==='cancel'){close();return}if(choice==='do'){launch(x.id,original,x);return}if(choice==='skip'&&ts){launch(ts.id,original,null)}});};
const install=()=>{const original=window.start;if(typeof original!=='function'||original.__missedBridge)return;const wrapped=function(){if(window.__startingMissed)return;const m=missed();if(m.length){show(m,original);return}original()};wrapped.__missedBridge=true;window.start=wrapped;const finish=window.finishWorkout;if(typeof finish==='function'&&!finish.__missedBridge){const f=function(){const d=read(D)||{},id=d.selected;const a=read(S)||[],x=a.find(q=>String(q.id)===String(id)&&q.originalDate);finish();if(x){x.completedLater=true;x.completedOn=today();write(S,a)}};f.__missedBridge=true;window.finishWorkout=f}};
setTimeout(install,0);setTimeout(install,100);setTimeout(install,500);
})();
