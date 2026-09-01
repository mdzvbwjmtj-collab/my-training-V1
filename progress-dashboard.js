(()=>{
const SEED=[['2026-08-11',97],['2026-08-16',96.5],['2026-08-18',95.3],['2026-08-19',95.3],['2026-08-20',94.4],['2026-08-21',94.6],['2026-08-22',95],['2026-08-23',95],['2026-08-24',94.5],['2026-08-25',94.3],['2026-08-26',94],['2026-08-27',94],['2026-08-28',94],['2026-08-29',94],['2026-08-30',95.1],['2026-08-31',94.7],['2026-09-01',94.4]];
let range=1;
function data(){try{const a=JSON.parse(localStorage.getItem('myTrainingWeights')||'null');if(Array.isArray(a)&&a.length)return a.sort((x,y)=>x.date.localeCompare(y.date)).map(x=>[x.date,Number(x.weight)]).filter(x=>Number.isFinite(x[1]));}catch{}return SEED}
function draw(){
 const main=document.querySelector('main.shell');
 if(!main||main.querySelector('.top .title')?.textContent.trim()!=='Your progress')return;
 let card=document.getElementById('weight-chart-card');
 if(!card){card=document.createElement('div');card.id='weight-chart-card';card.className='card';main.querySelector('.top').insertAdjacentElement('afterend',card)}
 const all=data(),now=new Date('2026-09-01T00:00:00'),start=new Date(now);start.setMonth(start.getMonth()-range);
 const shown=all.filter(d=>{const q=new Date(d[0]+'T00:00:00');return q>=start&&q<=now}),pts=shown.length?shown:all,vals=pts.map(d=>d[1]);
 const min=Math.floor(Math.min(...vals)-.5),max=Math.ceil(Math.max(...vals)+.5),W=720,H=300,L=55,R=18,T=30,B=55,startMs=start.getTime(),span=now.getTime()-startMs;
 const x=d=>L+(new Date(d+'T00:00:00').getTime()-startMs)*(W-L-R)/span,y=v=>T+(max-v)/(max-min||1)*(H-T-B);
 const ticks=[];for(let v=min;v<=max;v++)ticks.push(v);
 const grid=ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#333"/><text x="${L-9}" y="${y(v)+4}" fill="#999" font-size="12" text-anchor="end">${v}</text>`).join('');
 const points=pts.map(d=>`${x(d[0])},${y(d[1])}`).join(' ');
 const marks=pts.map(d=>`<g><circle cx="${x(d[0])}" cy="${y(d[1])}" r="5" fill="#fff"/><text x="${x(d[0])}" y="${y(d[1])-11}" fill="#fff" font-size="11" text-anchor="middle">${d[1].toFixed(1)}</text></g>`).join('');
 const labels=`<text x="${L}" y="${H-18}" fill="#999" font-size="10" text-anchor="start">${start.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</text><text x="${W-R}" y="${H-18}" fill="#999" font-size="10" text-anchor="end">${now.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</text>`;
 card.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><div class="eyebrow">BODYWEIGHT</div><h3 style="margin:3px 0 0">Weight trend</h3></div><div style="display:flex;gap:6px;position:relative;z-index:2"><button type="button" class="chart-range ${range===1?'selected':''}" onclick="window.setWeightRange(1);return false">1 month</button><button type="button" class="chart-range ${range===3?'selected':''}" onclick="window.setWeightRange(3);return false">3 months</button><button type="button" class="chart-range ${range===6?'selected':''}" onclick="window.setWeightRange(6);return false">6 months</button></div></div><div style="margin-top:10px;color:#999;font-size:12px">${pts.length} weigh-ins · ${range}-month view</div><div style="width:100%;overflow:hidden;margin-top:4px"><svg viewBox="0 0 ${W} ${H}" width="100%" height="300" role="img" aria-label="Bodyweight trend">${grid}<polyline points="${points}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${marks}${labels}</svg></div>`;
}
window.setWeightRange=function(n){range=Number(n);draw()};
function ensure(){const main=document.querySelector('main.shell');const card=document.getElementById('weight-chart-card');if(main?.querySelector('.top .title')?.textContent.trim()==='Your progress'&&!card)draw()}
setInterval(ensure,500);
setTimeout(draw,50);
})();