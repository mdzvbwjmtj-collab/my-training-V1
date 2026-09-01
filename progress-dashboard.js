(function(){
const FALLBACK_WEIGHTS=[
{date:'2026-08-11',weight:97.0},{date:'2026-08-16',weight:96.5},{date:'2026-08-18',weight:95.3},{date:'2026-08-19',weight:95.3},{date:'2026-08-20',weight:94.4},{date:'2026-08-21',weight:94.6},{date:'2026-08-22',weight:95.0},{date:'2026-08-23',weight:95.0},{date:'2026-08-24',weight:94.5},{date:'2026-08-25',weight:94.3},{date:'2026-08-26',weight:94.0},{date:'2026-08-27',weight:94.0},{date:'2026-08-28',weight:94.0},{date:'2026-08-29',weight:94.0},{date:'2026-08-30',weight:95.1},{date:'2026-08-31',weight:94.7},{date:'2026-09-01',weight:94.4}
];
let rangeMonths=1;
function rows(){const live=(state.weights||[]).map(r=>({date:r.logged_on||r.date,weight:Number(r.weight_kg??r.weight)})).filter(x=>x.date&&Number.isFinite(x.weight));return (live.length?live:FALLBACK_WEIGHTS).sort((a,b)=>a.date.localeCompare(b.date))}
function avg(a){return a.length?a.reduce((s,x)=>s+x,0)/a.length:null}
function chart(all){
 const end=new Date();end.setHours(23,59,59,999);
 const start=new Date(end);start.setMonth(start.getMonth()-rangeMonths);start.setHours(0,0,0,0);
 const startMs=start.getTime(),endMs=end.getTime(),span=endMs-startMs;
 const data=all.filter(x=>{const t=new Date(x.date+'T12:00:00').getTime();return t>=startMs&&t<=endMs});
 const shown=data.length?data:[];
 const W=100,H=60,L=13,R=3,T=5,B=15,pw=W-L-R,ph=H-T-B;
 let mn=93,mx=98;
 if(shown.length){mn=Math.floor(Math.min(...shown.map(x=>x.weight))-.5);mx=Math.ceil(Math.max(...shown.map(x=>x.weight)+.5));}
 if(mx-mn<1)mx=mn+1;
 const y=v=>T+(mx-v)/(mx-mn)*ph;
 const tx=date=>L+((new Date(date+'T12:00:00').getTime()-startMs)/span)*pw;
 const ticks=[];
 for(let v=mn;v<=mx+.001;v+=1)ticks.push(`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#252525" stroke-width="0.3"/><text x="${L-2}" y="${y(v)+1}" fill="#888" font-size="3.1" text-anchor="end">${v.toFixed(0)}</text>`);
 const dateTicks=[];const tickCount=6;
 for(let i=0;i<tickCount;i++){const d=new Date(startMs+(span*i/(tickCount-1)));const day=d.getDate(),month=d.toLocaleDateString('en-GB',{month:'short'});const xx=L+(i/(tickCount-1))*pw;const anchor=i===0?'start':i===tickCount-1?'end':'middle';dateTicks.push(`<line x1="${xx}" x2="${xx}" y1="${H-B}" y2="${H-B+1.5}" stroke="#777" stroke-width="0.4"/><text x="${xx}" y="${H-4}" fill="#888" font-size="2.9" text-anchor="${anchor}">${day} ${month}</text>`)}
 const points=shown.map(d=>`${tx(d.date)},${y(d.weight)}`).join(' ');
 const dots=shown.map(d=>`<circle cx="${tx(d.date)}" cy="${y(d.weight)}" r="0.7" fill="white"/>`).join('');
 return `<div style="margin-top:12px"><div class="weight-range" style="display:flex;gap:6px;margin-bottom:8px"><button type="button" data-range="1" class="range-btn ${rangeMonths===1?'primary':''}" style="padding:6px 10px">1 month</button><button type="button" data-range="3" class="range-btn ${rangeMonths===3?'primary':''}" style="padding:6px 10px">3 months</button><button type="button" data-range="6" class="range-btn ${rangeMonths===6?'primary':''}" style="padding:6px 10px">6 months</button></div><svg viewBox="0 0 ${W} ${H}" width="100%" height="280" preserveAspectRatio="none" aria-label="Bodyweight history chart"><line x1="${L}" x2="${L}" y1="${T}" y2="${H-B}" stroke="#777" stroke-width="0.5"/><line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#777" stroke-width="0.5"/>${ticks.join('')}${dateTicks.join('')}<polyline points="${points}" fill="none" stroke="white" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round"/>${dots}<text x="3" y="${T+ph/2}" fill="#888" font-size="3" transform="rotate(-90 3 ${T+ph/2})" text-anchor="middle">Weight (kg)</text></svg></div>`;
}
function nav(){return `<nav class="nav"><button onclick="window.go('home')">⌂<span>Home</span></button><button onclick="window.go('workout')">▥<span>Workouts</span></button><button onclick="window.go('plan')">☷<span>Plan</span></button><button class="active" onclick="window.go('progress')">⌁<span>Progress</span></button></nav>`}
function dashboard(){
 const all=rows(),recent=all.slice(-7),prev=all.slice(-14,-7),ra=avg(recent.map(x=>x.weight)),pa=avg(prev.map(x=>x.weight)),delta=ra!=null&&pa!=null?ra-pa:null,latest=all[all.length-1],start=all[0];
 const trend=delta==null?'—':(delta>0?'+':'')+delta.toFixed(1)+' kg';const change=latest.weight-start.weight;
 const end=new Date();end.setHours(23,59,59,999);const rangeStart=new Date(end);rangeStart.setMonth(rangeStart.getMonth()-rangeMonths);const shownCount=all.filter(x=>new Date(x.date+'T12:00:00')>=rangeStart&&new Date(x.date+'T12:00:00')<=end).length;
 return `<main class="shell"><div class="top"><div><div class="eyebrow">Progress</div><div class="title">Your progress</div><div class="sub">Full bodyweight history and trend</div></div></div><div class="grid"><div class="stat"><div class="muted">Latest</div><b>${latest.weight.toFixed(1)} kg</b></div><div class="stat"><div class="muted">Change from start</div><b>${change>0?'+':''}${change.toFixed(1)} kg</b></div><div class="stat"><div class="muted">7-day average</div><b>${ra.toFixed(1)} kg</b></div><div class="stat"><div class="muted">vs previous 7 days</div><b>${trend}</b></div></div><div class="card"><h3>Bodyweight history</h3><div class="muted" style="margin-top:5px">${shownCount} weigh-ins · selected period</div>${chart(all)}</div><div class="card"><h3>All weigh-ins</h3>${all.map(x=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #222"><span>${new Date(x.date+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span><b>${x.weight.toFixed(1)} kg</b></div>`).join('')}</div><div class="card"><h3>Nutrition targets</h3><div class="grid"><div class="stat"><div class="muted">Calories</div><b>2,400 kcal</b></div><div class="stat"><div class="muted">Protein</div><b>200 g</b></div></div></div><div class="card"><h3>Log bodyweight</h3><div class="form"><input id="weight" type="number" step="0.1" value="${latest.weight.toFixed(1)}"><button class="primary" onclick="saveWeight()">Save</button></div></div></main>${nav()}`;
}
function bindRangeButtons(){document.querySelectorAll('.range-btn').forEach(btn=>btn.addEventListener('click',function(){const months=Number(this.dataset.range);if(![1,3,6].includes(months))return;rangeMonths=months;document.body.innerHTML=dashboard();bindRangeButtons();}));}
window.setWeightRange=function(months){if(![1,3,6].includes(Number(months)))return;rangeMonths=Number(months);document.body.innerHTML=dashboard();bindRangeButtons();};
window.progressDashboard=function(){document.body.innerHTML=dashboard();bindRangeButtons();};
window.progress=window.progressDashboard;
document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('button');if(b&&b.textContent.trim()==='Progress'){e.preventDefault();e.stopPropagation();window.progressDashboard()}},true);
})();