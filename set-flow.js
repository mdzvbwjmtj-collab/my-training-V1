(function(){
 const state=window.setFlowState=window.setFlowState||{};
 const key=(ei,si)=>`${currentWorkout().id}:${ei}:${si}`;
 function build(card,ei){
  const head=card.querySelector('.log-head');if(!head)return;
  const oldFlow=card.querySelector('.set-flow');
  let rows=oldFlow?[...oldFlow.querySelectorAll('.set-row')]:[...card.querySelectorAll('.set-row')];
  if(!rows.length)return;
  const oldSummaries=[...card.querySelectorAll('.set-summary')];oldSummaries.forEach(x=>x.remove());
  if(oldFlow)oldFlow.remove();
  const flow=document.createElement('div');flow.className='set-flow';
  rows.forEach((row,si)=>{
   const k=key(ei,si);const check=row.querySelector('.check');const done=!!(check&&check.classList.contains('checked'));
   if(state[k]===undefined)state[k]=si===0;
   if(done&&si>0)state[k]=true;
   const wrap=document.createElement('div');wrap.className='collapsible-set';wrap.dataset.setKey=k;
   const summary=document.createElement('button');summary.type='button';summary.className='set-summary';
   const update=()=>{const open=!!state[k];wrap.classList.toggle('open',open);summary.innerHTML=`<span>Set ${si+1}</span><span>${done?'✓ Completed':open?'Open':'Locked'} <span class="set-chevron">${open?'⌃':'⌄'}</span></span>`;summary.setAttribute('aria-expanded',String(open));row.style.display=open?'grid':'none'};
   summary.onclick=()=>{state[k]=!state[k];update()};
   wrap.append(summary,row);flow.appendChild(wrap);update();
  });
  head.after(flow);
  card.dataset.setFlowReady='1';
 }
 function enhance(){document.querySelectorAll('.exercise-card').forEach((card,ei)=>{if(card.dataset.setFlowReady==='1')return;build(card,ei)})}
 const originalRender=window.render;window.render=function(){originalRender();setTimeout(enhance,0)};
 document.addEventListener('rest-complete',e=>{const k=e.detail&&e.detail.key;if(!k)return;state[k]=true;const p=k.split(':');Object.keys(state).forEach(x=>{const q=x.split(':');if(q[0]===p[0]&&q[1]===p[1]&&x!==k)state[x]=false});render()});
 document.addEventListener('DOMContentLoaded',enhance);setTimeout(enhance,0);
})();