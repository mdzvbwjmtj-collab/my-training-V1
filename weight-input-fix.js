(()=>{
let draft=null;
const isWeight=e=>e?.id==='weight'&&e.closest('#progress-redesign');
const today=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
const save=v=>{v=Number(v);if(!(v>0))return false;let a;try{a=JSON.parse(localStorage.getItem('myTrainingWeights')||'[]')}catch{a=[]}if(!Array.isArray(a))a=[];const date=today(),i=a.findIndex(x=>x.date===date);if(i>=0)a[i]={...a[i],date,weight:v};else a.push({date,weight:v});a.sort((x,y)=>x.date.localeCompare(y.date));localStorage.setItem('myTrainingWeights',JSON.stringify(a));try{const d=JSON.parse(localStorage.getItem('myTrainingDashboard')||'{}');d.weight=v;localStorage.setItem('myTrainingDashboard',JSON.stringify(d))}catch{}draft=String(v);return true};
document.addEventListener('input',e=>{if(isWeight(e.target))draft=e.target.value},true);
document.addEventListener('change',e=>{if(isWeight(e.target))draft=e.target.value},true);
const capture=e=>{const btn=e.target.closest?.('[data-save-weight]');if(!btn)return;const el=document.querySelector('#progress-redesign #weight');const raw=(el?.value!==undefined&&el.value!=='')?el.value:draft;const v=Number(raw);if(!(v>0))return;e.preventDefault();e.stopImmediatePropagation();save(v);if(el){el.blur();el.value=v.toFixed(1)}setTimeout(()=>{window.dispatchEvent(new Event('resize'));document.querySelector('[data-progress-tab="body"]')?.click()},20)};
document.addEventListener('pointerdown',capture,true);document.addEventListener('touchend',capture,true);document.addEventListener('click',capture,true);
})();