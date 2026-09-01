(()=>{
const DATA=[['11 Aug',97],['16 Aug',96.5],['18 Aug',95.3],['19 Aug',95.3],['20 Aug',94.4],['21 Aug',94.6],['22 Aug',95],['23 Aug',95],['24 Aug',94.5],['25 Aug',94.3],['26 Aug',94],['27 Aug',94],['28 Aug',94],['29 Aug',94],['30 Aug',95.1],['31 Aug',94.7],['1 Sep',94.4]];
function graph(){
 const old=document.getElementById('bodyweight-graph'); if(old) return;
 const heading=[...document.querySelectorAll('h3')].find(x=>x.textContent.trim()==='Bodyweight history');
 if(!heading)return;
 const card=heading.closest('.card'); if(!card)return;
 const W=720,H=300,L=55,R=18,T=35,B=55,mn=93,mx=98;
 const x=i=>L+i*(W-L-R)/Math.max(1,DATA.length-1),y=v=>T+(mx-v)/(mx-mn)*(H-T-B);
 const grid=[93,94,95,96,97,98].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#333"/><text x="${L-9}" y="${y(v)+4}" fill="#999" font-size="12" text-anchor="end">${v}</text>`).join('');
 const points=DATA.map((d,i)=>`${x(i)},${y(d[1])}`).join(' ');
 const marks=DATA.map((d,i)=>`<g><circle cx="${x(i)}" cy="${y(d[1])}" r="5" fill="#fff"/><text x="${x(i)}" y="${y(d[1])-11}" fill="#fff" font-size="11" text-anchor="middle">${d[1].toFixed(1)}</text></g>`).join('');
 const labels=DATA.map((d,i)=>i%2===0?`<text x="${x(i)}" y="${H-18}" fill="#999" font-size="10" text-anchor="middle">${d[0]}</text>`:'').join('');
 const wrap=document.createElement('div'); wrap.id='bodyweight-graph'; wrap.style.cssText='margin-top:16px;width:100%;overflow:hidden';
 wrap.innerHTML=`<div style="font-size:12px;color:#999;margin-bottom:4px">Bodyweight (kg)</div><svg viewBox="0 0 ${W} ${H}" width="100%" height="300" role="img" aria-label="Bodyweight history from 11 August to 1 September"><rect width="100%" height="100%" fill="transparent"/>${grid}<polyline points="${points}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${marks}${labels}</svg>`;
 card.appendChild(wrap);
}
new MutationObserver(()=>graph()).observe(document.body,{childList:true,subtree:true});
setTimeout(graph,50);
})();