var V='orders-v1',F='fonts-v1';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==V&&k!==F}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(function(res){
      var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res;
    }).catch(function(){
      return caches.match(r).then(function(m){return m||caches.match('index.html')});
    }));
  }else if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(F).then(function(c){
      return c.match(r).then(function(m){
        return m||fetch(r).then(function(res){c.put(r,res.clone());return res});
      });
    }));
  }
});
