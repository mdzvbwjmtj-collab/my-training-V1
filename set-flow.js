(function(){
  const openState=new Set();
  window.setFlowOpen=openState;
  function key(ei,si){return `${currentWorkout().id}:${ei}:${si}`}
  function enhance(){
    document.querySelectorAll('.exercise-card').forEach(card=>{
      if(card.dataset.setFlowReady==='1')return;
      const rows=[...card.querySelectorAll(':scope > .set-row')];
      if(!rows.length)return;
      const ei=rows[0].querySelector('.set-num') ? card.querySelector('.index')?.textContent : null;
      const exerciseIndex=[...document.querySelectorAll('.exercise-card')].indexOf(card);
      rows.forEach((row,si)=>{
        const wrap=document.createElement('div');
        wrap.className='collapsible-set';
        wrap.dataset.setKey=key(exerciseIndex,si);
        const completed=row.querySelector('.check.checked')||row.querySelector('.check')?.textContent.includes('✓');
        const shouldOpen=openState.has(wrap.dataset.setKey)||(!completed&&si===0);
        if(shouldOpen)wrap.classList.add('open');
        const summary=document.createElement('button');
        summary.type='button';summary.className='set-summary';
        summary.innerHTML=`<span>Set ${si+1}</span><span class="set-summary-status">${completed?'✓ Completed':shouldOpen?'Open':'Locked'}</span>`;
        summary.onclick=()=>{if(wrap.classList.contains('open')){wrap.classList.remove('open');openState.delete(wrap.dataset.setKey)}else{wrap.classList.add('open');openState.add(wrap.dataset.setKey)}};
        wrap.appendChild(summary);
        const content=document.createElement('div');content.className='set-content';content.appendChild(row);
        wrap.appendChild(content);summary.setAttribute('aria-expanded',String(shouldOpen));
        card.insertBefore(wrap,card.querySelector('.log-head').nextSibling);
      });
      card.dataset.setFlowReady='1';
    });
  }
  const observer=new MutationObserver(()=>enhance());
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('rest-complete',e=>{
    if(e.detail?.key){openState.add(e.detail.key);enhance();const el=document.querySelector(`[data-set-key="${CSS.escape(e.detail.key)}"]`);if(el){el.classList.add('open');el.querySelector('.set-summary')?.setAttribute('aria-expanded','true')}}
  });
  setTimeout(enhance,0);
})();
