const CACHE='my-training-shell-v48';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;event.respondWith((async()=>{try{const fresh=await fetch(event.request,{cache:'no-store'});if(fresh&&fresh.ok){const cache=await caches.open(CACHE);cache.put(event.request,fresh.clone())}return fresh}catch(err){const cached=await caches.match(event.request);if(cached)return cached;throw err}})())});
