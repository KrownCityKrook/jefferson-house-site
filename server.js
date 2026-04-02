const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

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
