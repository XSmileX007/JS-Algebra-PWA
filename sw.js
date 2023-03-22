var cacheName = 'myCache';
var filesToCache = [
  'background.png',
	'bar.png',
	'header.png'
];

var myImages = [];
myImages.push('screenshot.jpg');


var appShellFiles = [
  'index.html',
  'app.js',
  'style.css'
];

var contentToCache = appShellFiles.concat(myImages);

var beforeInstallPrompt = null;
 

  function eventHandler(event){
      beforeInstallPrompt = event; 
      document.getElementById('installBtn').removeAttribute('disabled');       
  }
  function errorHandler(e){
      console.log('error: ' + e);
  }
  function install() {
    if (beforeInstallEvent) beforeInstallPrompt.prompt();
  }

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install 1');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install 2');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: content');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

