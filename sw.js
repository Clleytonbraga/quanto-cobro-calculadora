// Mantenha CACHE igual ao ?v= dos <link>/<script> nos 3 HTML (index, privacidade, guia).
const CACHE = 'fiz-v30'
const FILES = ['./', 'privacidade/', 'guias/como-fazer-orcamento-freelancer/',
  'styles.css?v=30', 'app.js?v=30', 'calc.js', 'analytics.js', 'analytics.js?v=30', 'manifest.webmanifest',
  'assets/icon-light.svg', 'assets/icon-dark.svg', 'assets/logo-light.svg', 'assets/logo-dark.svg',
  'assets/apple-touch-icon.png', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-maskable-512.png']

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())))

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())))

self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return // GA4 e Brevo: só rede
  if (req.mode === 'navigate') {
    // rede primeiro; offline cai na própria página ou no app
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./'))))
    return
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
    return res
  })))
})
