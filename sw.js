const CACHE_NAME='koum-os2-v1';
const CORE=['/','/index.html'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c=>c.addAll(CORE))
      .catch(err=>console.log('Cache install error:',err))
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys.filter(k=>k!==CACHE_NAME)
          .map(k=>caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.url.includes('supabase.co'))return;
  if(e.request.url.includes('googleapis.com'))return;
  e.respondWith(
    caches.match(e.request)
      .then(cached=>{
        const fresh=fetch(e.request)
          .then(r=>{
            if(r&&r.status===200){
              const clone=r.clone();
              caches.open(CACHE_NAME)
                .then(c=>c.put(e.request,clone));
            }
            return r;
          })
          .catch(()=>cached);
        return cached||fresh;
      })
  );
});

self.addEventListener('message',e=>{
  if(e.data==='skipWaiting')self.skipWaiting();
});
