(function(){
  const KEY='myTrainingTheme';
  const apply=()=>document.documentElement.dataset.theme=localStorage.getItem(KEY)==='light'?'light':'dark';
  const mount=()=>{
    let b=document.getElementById('theme-toggle');
    if(!b){
      b=document.createElement('button');
      b.id='theme-toggle';
      b.type='button';
      b.className='theme-toggle';
      b.setAttribute('aria-label','Switch theme');
      document.body.appendChild(b);
    }
    const light=document.documentElement.dataset.theme==='light';
    b.textContent=light?'☾':'☀';
    b.title=light?'Switch to dark mode':'Switch to light mode';
    b.setAttribute('aria-label',b.title);
    if(!b.dataset.bound){
      b.dataset.bound='1';
      b.addEventListener('click',()=>{
        const next=document.documentElement.dataset.theme==='light'?'dark':'light';
        localStorage.setItem(KEY,next);
        apply();
        mount();
      });
    }
  };
  apply();
  new MutationObserver(mount).observe(document.body,{childList:true});
  mount();
})();
