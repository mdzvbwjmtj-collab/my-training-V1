(()=>{
let open=false,lastList=null,lastToggle=null;
const enhance=()=>{
  const main=document.querySelector('main.shell');
  if(!main||main.querySelector('.top .title')?.textContent.trim()!=='Your progress')return;
  const list=main.querySelector('.history-list');
  if(!list)return;
  if(list===lastList&&lastToggle&&lastToggle.isConnected)return;
  lastList=list;
  const items=[...list.children];
  if(items.length<=7)return;
  if(lastToggle?.isConnected)lastToggle.remove();
  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='history-toggle text-link';
  const apply=()=>{
    items.forEach((row,i)=>{row.style.display=open||i<7?'':'none'});
    toggle.textContent=open?'Hide older entries':'Show full history';
  };
  toggle.onclick=()=>{open=!open;apply()};
  list.parentElement.appendChild(toggle);
  lastToggle=toggle;
  apply();
};
new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
setTimeout(enhance,0);
})();
