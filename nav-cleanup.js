(()=>{
  function clean(){
    document.querySelectorAll('.nav').forEach(nav=>{
      [...nav.querySelectorAll('button')].forEach(btn=>{
        const label=btn.querySelector('span')?.textContent?.trim();
        if(label==='Workouts')btn.remove();
      });
      nav.style.gridTemplateColumns='repeat(3,minmax(0,1fr))';
    });
  }
  const obs=new MutationObserver(clean);
  obs.observe(document.documentElement,{childList:true,subtree:true});
  clean();
})();
