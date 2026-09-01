(function(){
  const openState=window.setFlowOpen=window.setFlowOpen||{};
  const key=(ei,si)=>`${currentWorkout().id}:${ei}:${si}`;
  function enhance(){
    document.querySelectorAll('.exercise-card').forEach((card,ei)=>{
      let flow=card.querySelector('.set-flow');
      if(!flow){
        const rows=[...card.querySelectorAll('.set-row')];
        if(!rows.length)return;
        flow=document.createElement('div');flow.className='set-flow';
        const head=card.querySelector('.log-head');
        rows.forEach(row=>flow.appendChild(row));
        if(head)head.after(flow);else card.appendChild(flow);
      }
      const rows=[...flow.querySelectorAll('.set-row')];
      rows.forEach((row,si)=>{
        const k=key(ei,si);
        if(openState[k]===undefined)openState[k]=(si===0);
        let summary=row.previousElementSibling;
        if(!summary||!summary.classList.contains('set-summary')){
          summary=document.createElement('button');summary.type='button';summary.className='set-summary';
          row.before(summary);
          summary.addEventListener('click',()=>{openState[k]=!openState[k];enhance();});
        }
        const check=row.querySelector('.check');
        const done=!!(check&&check.classList.contains('checked'));
        summary.innerHTML=`<span>Set ${si+1}</span><span>${done?'✓ Completed':(openState[k]?'Open':'Locked')} <span class="set-chevron">${openState[k]?'⌃':'⌄'}</span></span>`;
        row.style.display=openState[k]?'grid':'none';
        row.classList.toggle('set-open',!!openState[k]);
      });
    });
  }
  const originalRender=window.render;
  window.render=function(){originalRender();setTimeout(enhance,0)};
  document.addEventListener('rest-complete',function(e){
    const k=e.detail&&e.detail.key;if(!k)return;
    const parts=k.split(':');
    Object.keys(openState).forEach(x=>{const p=x.split(':');if(p[0]===parts[0]&&p[1]===parts[1])openState[x]=false});
    openState[k]=true;
    render();
  });
  document.addEventListener('DOMContentLoaded',enhance);
})();