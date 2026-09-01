(()=>{
const SEED=[['2026-08-11',97],['2026-08-16',96.5],['2026-08-18',95.3],['2026-08-19',95.3],['2026-08-20',94.4],['2026-08-21',94.6],['2026-08-22',95],['2026-08-23',95],['2026-08-24',94.5],['2026-08-25',94.3],['2026-08-26',94],['2026-08-27',94],['2026-08-28',94],['2026-08-29',94],['2026-08-30',95.1],['2026-08-31',94.7],['2026-09-01',94.4]];
let range=1,rendering=false;
function data(){try{const a=JSON.parse(localStorage.getItem('myTrainingWeights')||'null');if(Array.isArray(a)&&a.length)return a.sort((x,y)=>x.date.localeCompare(y.date)).map(x=>[x.date,Number(x.weight)]).filter(x=>Number.isFinite(x[1]));}catch{}return SEED}
window.setProgressRange=r=>{range=Number(r);render()};
function render(){
 if(rendering)return;
 const main=document.querySelector('main.shell');
 if(!main||main.querySelector('.top .title')?.textContent.trim()!=='Your progress')return;
 let card=document.getElementById('weight-chart-card');
 if(!card){card=document.createElement('div');card.id='weight-chart-card';card.className='card';main.querySelector('.top').insertAdjacentElement('afterend',card)}
 rendering=true;
 const all=data(),now=new Date('2026-09-01T00:00:00'),cut=new Date(now);cut.setMonth(cut.getMonth()-(range===1?1:range===3?3:6));
 const shown=all.filter(d=>new Date(d[0]+'T00:00:00')>=cut),pts=shown.length?shown:all,vals=pts.map(d=>d[1]);
 const min=Math.floor(Math.min(...vals)-.5),max=Math.ceil(Math.max(...vals)+.5),W=720,H=300,L=55,R=18,T=30,B=55;
 const x=i=>L+i*(W-L-R)/Math.max(1,pts.length-1),y=v=>T+(max-v)/(max-min||1)*(H-T-B);
 const ticks=[];for(let v=min;v<=max;v++)ticks.push(v);
 const grid=ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#333"/><text x="${L-9}" y="${y(v)+4}" fill="#999" font-size="12" text-anchor="end">${v}</text>`).join('');
 const points=pts.map((d,i)=>`${x(i)},${y(d[1])}`).join(' ');
 const marks=pts.map((d,i)=>`<g><circle cx="${x(i)}" cy="${y(d[1])}" r="5" fill="#fff"/><text x="${x(i)}" y="${y(d[1])-11}" fill="#fff" font-size="11" text-anchor="middle">${d[1].toFixed(1)}</text></g>`).join('');
 const labels=pts.map((d,i)=>{const show=pts.length<=10||i%Math.ceil(pts.length/8)===0;return show?`<text x="${x(i)}" y="${H-18}" fill="#999" font-size="10" text-anchor="middle">${new Date(d[0]+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</text>`:''}).join('');
 card.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><div class="eyebrow">BODYWEIGHT</div><h3 style="margin:3px 0 0">Weight trend</h3></div><div style="display:flex;gap:6px"><button type="button" class="chart-range ${range===1?'selected':''}" onclick="setProgressRange(1)">1 month</button><button type="button" class="chart-range ${range===3?'selected':''}" onclick="setProgressRange(3)">3 months</button><button type="button" class="chart-range ${range===6?'selected':''}" onclick="setProgressRange(6)">6 months</button></div></div><div style="margin-top:10px;color:#999;font-size:12px">${pts.length} weigh-ins · kg</div><div style="width:100%;overflow:hidden;margin-top:4px"><svg viewBox="0 0 ${W} ${H}" width="100%" height="300" role="img" aria-label="Bodyweight trend">${grid}<polyline points="${points}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${marks}${labels}</svg></div>`;
 rendering=false;
}
new MutationObserver(()=>{if(!document.getElementById('weight-chart-card'))setTimeout(render,0)}).observe(document.body,{childList:true,subtree:true});
setTimeout(render,50);
})();