(()=>{
const engine=()=>window.MyTrainingProgression;
function enhance(){const e=engine();if(!e)return;const title=document.querySelector('.session-head h1');if(!title)return;const name=title.textContent.trim();const rows=[...document.querySelectorAll('.session-card .set-row')];const result=e.analyse(name);if(rows.length&&Number.isFinite(result.next)){const changed=e.prefill(name,rows.length);if(changed){rows.forEach(row=>{const input=row.querySelector('input[type="number"]');if(input&&(input.value===''||input.value==null))input.value=result.next})}}
const old=document.querySelector('.session-card .progress-note');if(old){old.classList.add('progression-smart');old.innerHTML=`<b>${result.label||'Progression target'}</b><span>${result.message}</span>`}
}
const css=document.createElement('style');css.textContent='.progression-smart{display:flex!important;flex-direction:column;gap:4px;padding:12px 14px!important;border-radius:12px;background:rgba(34,211,79,.08);border:1px solid rgba(34,211,79,.24)}.progression-smart b{font-size:14px;color:#22d34f}.progression-smart span{font-size:13px;line-height:1.35;color:inherit;opacity:.8}';document.head.appendChild(css);
const obs=new MutationObserver(()=>requestAnimationFrame(enhance));obs.observe(document.getElementById('app'),{childList:true,subtree:true});requestAnimationFrame(enhance);
})();