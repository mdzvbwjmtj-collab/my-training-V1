(()=>{
  const KEY='myTrainingDashboard';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  let last='';
  function visible(){return !!document.querySelector('.session-shell,.exercise-card,.hero')&&!!document.querySelector('.shell')};
  function render(){
    const old=document.getElementById('rest-timer-overlay');
    if(!visible()){if(old)old.remove();last='';return}
    const s=read(),active=!!s.activeWorkout,secs=Number(s.restSeconds||0),def=Number(s.restDefault||120);
    const sig=`${active}:${secs}:${def}`;
    if(old&&old.dataset.sig===sig)return;
    if(old)old.remove();
    const el=document.createElement('div');el.id='rest-timer-overlay';el.dataset.sig=sig;
    el.innerHTML=`<div style="font-size:11px;letter-spacing:.12em;color:#999;font-weight:700">REST TIMER</div><div style="font-size:34px;font-weight:800;line-height:1.1;margin:4px 0 10px;font-variant-numeric:tabular-nums">${fmt(secs||def)}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><button data-sec="60">1 min</button><button data-sec="120">2 min</button><button data-sec="180">3 min</button></div><div style="font-size:12px;color:#888;margin-top:8px">${secs?'Resting — next set unlocks when the timer reaches 0.':'Select your rest duration. It starts automatically after each completed set.'}</div>`;
    Object.assign(el.style,{position:'fixed',left:'12px',right:'12px',bottom:'86px',zIndex:'9999',background:'#111',border:'2px solid #444',borderRadius:'16px',padding:'14px 14px 12px',boxShadow:'0 8px 30px rgba(0,0,0,.5)',color:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'});
    el.querySelectorAll('button').forEach(b=>{Object.assign(b.style,{border:'1px solid #444',background:Number(b.dataset.sec)===def?'#fff':'#191919',color:Number(b.dataset.sec)===def?'#050505':'#ddd',borderRadius:'10px',padding:'9px 5px',fontWeight:'700'});b.onclick=()=>{const sec=Number(b.dataset.sec);if(window.restChoice)window.restChoice(sec);setTimeout(render,50)}});
    document.body.appendChild(el);last=sig;
  }
  const obs=new MutationObserver(()=>render());
  obs.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(render,1000);
  render();
})();