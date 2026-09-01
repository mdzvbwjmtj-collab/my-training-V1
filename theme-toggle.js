(function(){
  const KEY='myTrainingTheme';
  const apply=()=>document.documentElement.dataset.theme=localStorage.getItem(KEY)==='light'?'light':'dark';
  const mount=()=>{
    if(!document.body)return;
    let b=document.getElementById('theme-toggle');
    if(!b){
      b=document.createElement('button');
      b.id='theme-toggle';
      b.type='button';
      b.className='theme-toggle';
      document.body.appendChild(b);
    }
    const light=document.documentElement.dataset.theme==='light';
    b.textContent=light?'☾':'☀';
    b.title=light?'Switch to dark mode':'Switch to light mode';
    b.setAttribute('aria-label',b.title);
    if(!b.dataset.bound){
      b.dataset.bound='1';
      b.addEventListener('click',()=>{
        localStorage.setItem(KEY,document.documentElement.dataset.theme==='light'?'dark':'light');
        apply();
        mount();
      });
    }
  };
  apply();
  const start=()=>{
    mount();
    new MutationObserver(mount).observe(document.body,{childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
