(function(){
  const KEY='myTrainingTheme';
  const sun='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="12.5" fill="none" stroke="currentColor" stroke-width="3.8"/><g fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"><path d="M32 5v8"/><path d="M32 51v8"/><path d="M5 32h8"/><path d="M51 32h8"/><path d="M12.9 12.9l5.7 5.7"/><path d="M45.4 45.4l5.7 5.7"/><path d="M51.1 12.9l-5.7 5.7"/><path d="M18.6 45.4l-5.7 5.7"/></g></svg>';
  const moon='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="currentColor" d="M43.5 7.5c-3.2 2.7-5.2 6.8-5.2 11.3 0 8.2 6.7 14.9 14.9 14.9 1.3 0 2.6-.2 3.8-.5C54.5 45.9 45.1 54 33.8 54 20.5 54 10 43.5 10 30.2 10 18.9 18.1 9.5 29.2 7c-.3 1.2-.5 2.5-.5 3.8 0 8.2 6.7 14.9 14.9 14.9 4.5 0 8.6-2 11.3-5.2-.4-5.3-4.6-9.5-9.9-10Z"/></svg>';
  const apply=()=>document.documentElement.dataset.theme=localStorage.getItem(KEY)==='light'?'light':'dark';
  const mount=()=>{
    if(!document.body)return;
    let b=document.getElementById('theme-toggle');
    if(!b){b=document.createElement('button');b.id='theme-toggle';b.type='button';b.className='theme-toggle';document.body.appendChild(b);}
    const light=document.documentElement.dataset.theme==='light';
    b.innerHTML=light?moon:sun;
    b.title=light?'Switch to dark mode':'Switch to light mode';
    b.setAttribute('aria-label',b.title);
    if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>{localStorage.setItem(KEY,document.documentElement.dataset.theme==='light'?'dark':'light');apply();mount();});}
  };
  apply();
  const start=()=>{mount();new MutationObserver(mount).observe(document.body,{childList:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
