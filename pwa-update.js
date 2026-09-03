(()=>{
if(!('serviceWorker' in navigator))return;
let refreshing=false,reg=null;
const activate=async()=>{try{if(!reg)reg=await navigator.serviceWorker.register('./sw.js?v=49',{scope:'./',updateViaCache:'none'});await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(err){console.warn('PWA update check failed',err)}};
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});
window.addEventListener('load',async()=>{await activate();reg?.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)w.postMessage({type:'SKIP_WAITING'})})});setInterval(activate,5*60*1000)});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')activate()});window.addEventListener('pageshow',activate);
})();