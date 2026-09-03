(()=>{
let draft=null,editing=false;
const input=()=>document.querySelector('#progress-redesign #weight');
document.addEventListener('focusin',e=>{if(e.target?.id==='weight'&&e.target.closest('#progress-redesign')){editing=true;draft=e.target.value}},true);
document.addEventListener('input',e=>{if(e.target?.id==='weight'&&e.target.closest('#progress-redesign'))draft=e.target.value},true);
document.addEventListener('focusout',e=>{if(e.target?.id==='weight'&&e.target.closest('#progress-redesign'))setTimeout(()=>editing=false,250)},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-save-weight]')){const el=input(),v=Number(el?.value||draft);if(v>0){draft=String(v);editing=false;setTimeout(()=>{const fresh=input();if(fresh)fresh.value=Number(v).toFixed(1)},50)}}},true);
new MutationObserver(()=>{if(!editing||draft==null)return;const el=input();if(el&&el.value!==draft)el.value=draft}).observe(document.body,{childList:true,subtree:true});
})();