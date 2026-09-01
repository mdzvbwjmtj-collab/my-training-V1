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
  toggle.style.cssText='display:block;margin:12px 0 2px;width:100%;cursor:pointer;text-align:left;background:none;border:0;padding:0;font:inherit;';
  const apply=()=>{
    items.forEach((row,i)=>{row.style.display=open||i<7?'':'none'});
    toggle.textContent=open?'Hide older entries':'Show full history';
  };
  toggle.onclick=()=>{open=!open;apply()};
  list.parentElement.appendChild(toggle);
  lastToggle=toggle;
  apply();
};
const observer=new MutationObserver(enhance);
observer.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(enhance,0);
})();
