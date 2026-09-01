(()=>{
let open=false;
const enhance=()=>{
 const main=document.querySelector('main.shell');
 if(!main||main.querySelector('.top .title')?.textContent.trim()!=='Your progress')return;
 const list=main.querySelector('.history-list');
 if(!list||list.dataset.historyCollapseReady==='1')return;
 const rows=[...list.children];
 if(rows.length<=7)return;
 list.dataset.historyCollapseReady='1';
 const toggle=document.createElement('button');
 toggle.type='button';
 toggle.className='history-toggle text-link';
 toggle.style.cssText='display:block!important;margin:12px 0 2px;width:100%;cursor:pointer;text-align:left;background:none;border:0;padding:0;font:inherit;';
 const apply=()=>{rows.forEach((row,i)=>row.style.display=open||i<7?'':'none');toggle.textContent=open?'Hide older entries':'Show full history'};
 toggle.onclick=()=>{open=!open;apply()};
 list.parentElement.appendChild(toggle);
 apply();
};
new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(enhance,100);
})();
