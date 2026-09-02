(()=>{
const goPlan=()=>{location.href='plan.html'};
const isPlan=el=>el&&el.tagName==='BUTTON'&&/\bPlan\b/.test((el.textContent||'').trim());
document.addEventListener('click',e=>{
 const el=e.target.closest('button');
 if(isPlan(el)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();goPlan();}
},true);
const replace=()=>{
 const nav=document.querySelector('.nav');
 if(!nav)return;
 [...nav.querySelectorAll('button')].forEach(b=>{if(isPlan(b)){const a=document.createElement('a');a.className='plan-link';a.href='plan.html';a.innerHTML='☷<span>Plan</span>';b.replaceWith(a)}});
};
replace();
new MutationObserver(replace).observe(document.documentElement,{childList:true,subtree:true});
})();
