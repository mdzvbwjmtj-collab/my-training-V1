(function(){
  const KEY='myTrainingTheme';
  const sun='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="13" fill="none" stroke="currentColor" stroke-width="4"/><g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M32 5v9"/><path d="M32 50v9"/><path d="M5 32h9"/><path d="M50 32h9"/><path d="m13 13 6 6"/><path d="m45 45 6 6"/><path d="m51 13-6 6"/><path d="m19 45-6 6"/></g></svg>';
  const moon='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M48 11c-3 2-7 3-11 3-13 0-23 10-23 23s10 23 23 23c9 0 17-5 21-12-3 1-6 2-9 2-13 0-23-10-23-23 0-7 3-13 8-17 4-3 9-5 14-5z" fill="currentColor"/></svg>';
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
