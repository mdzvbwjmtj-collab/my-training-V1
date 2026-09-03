(()=>{
if(!('serviceWorker' in navigator))return;
let refreshing=false;
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});
window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('./sw.js?v=48',{scope:'./',updateViaCache:'none'});await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)worker.postMessage({type:'SKIP_WAITING'})})});setInterval(()=>reg.update(),60*60*1000)}catch(err){console.warn('PWA update registration failed',err)}});
})();
