const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3001;

// Proxy /apply, /api/*, and /lease-editor/* to the JH tenant hub.
// Targeting the tenant subdomain (not bare lastround.app) so that
// requireTenant in churchill-ops resolves to tenant 2 (jefferson-house)
// instead of falling back to the platform-owner tenant.
const PROXY_TARGET = 'jefferson-house.lastround.app';
function proxyToHub(req, res) {
  const targetPath = req.originalUrl;
  const proxyReq = https.request({
    hostname: PROXY_TARGET,
    port: 443,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: PROXY_TARGET },
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (err) => {
    console.error('[proxy]', err.message);
    if (!res.headersSent) res.status(502).send('Bad Gateway');
  });
  req.pipe(proxyReq);
}
app.use('/apply', proxyToHub);
app.use('/api', proxyToHub);
app.use('/lease-editor', proxyToHub);

app.use(express.static(path.join(__dirname), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    // No cache on HTML so updates show immediately
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    // Long cache on large assets
    if (filePath.endsWith('.glb')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

// SPA fallback for clean URLs
app.get('/book', (req, res) => res.sendFile(path.join(__dirname, 'book', 'index.html')));
app.get('/book/*', (req, res) => res.sendFile(path.join(__dirname, 'book', 'index.html')));
app.get('/events', (req, res) => res.sendFile(path.join(__dirname, 'events', 'index.html')));
app.get('/events/*', (req, res) => res.sendFile(path.join(__dirname, 'events', 'index.html')));
app.get('/jobs', (req, res) => res.sendFile(path.join(__dirname, 'jobs', 'index.html')));
app.get('/jobs/*', (req, res) => res.sendFile(path.join(__dirname, 'jobs', 'index.html')));

app.listen(PORT, () => {
  console.log(`Jefferson House site running on port ${PORT}`);
});
