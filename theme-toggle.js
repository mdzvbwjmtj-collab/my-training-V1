(function(){
  const KEY='myTrainingTheme';
  const sun='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="12.5" fill="none" stroke="currentColor" stroke-width="3.8"/><g fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"><path d="M32 5v8"/><path d="M32 51v8"/><path d="M5 32h8"/><path d="M51 32h8"/><path d="M12.9 12.9l5.7 5.7"/><path d="M45.4 45.4l5.7 5.7"/><path d="M51.1 12.9l-5.7 5.7"/><path d="M18.6 45.4l-5.7 5.7"/></g></svg>';
  const moon='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="currentColor" d="M44.5 8.5c-3.5 1.2-6.7 3.2-9.4 5.9-5 5-7.7 11.7-7.7 18.8 0 14.7 11.9 26.6 26.6 26.6 2.1 0 4.1-.2 6-.7-4.7 4.1-10.8 6.6-17.5 6.6C27.9 65.7 16 53.8 16 39.2S27.9 12.6 42.5 12.6c.7 0 1.4 0 2 .1Z" transform="translate(-10 -6)"/></svg>';
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
