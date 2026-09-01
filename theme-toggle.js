(function(){
  const KEY='myTrainingTheme';
  const sun='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="12.5" fill="none" stroke="currentColor" stroke-width="3.8"/><g fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"><path d="M32 5v8"/><path d="M32 51v8"/><path d="M5 32h8"/><path d="M51 32h8"/><path d="M12.9 12.9l5.7 5.7"/><path d="M45.4 45.4l5.7 5.7"/><path d="M51.1 12.9l-5.7 5.7"/><path d="M18.6 45.4l-5.7 5.7"/></g></svg>';
  const moon='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="currentColor" d="M47.5 8.5C38.2 11.2 32 19.8 32 29.6c0 12.2 9.8 22 22 22 1 0 2-.1 3-.2C53.2 58.2 45.3 62 36.5 62 19.1 62 5 47.9 5 30.5 5 15.2 15.9 2.4 30.4 0 28.8 3.7 28 7.8 28 12c0 12.2 9.8 22 22 22 4.2 0 8.3-1.2 12-3.5-2.4-1.6-4.1-4.1-4.5-7.1Z"/></svg>';
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
