/**
 * Serveur statique ultra-léger pour o2switch
 * Sert les fichiers HTML pré-générés sans Next.js runtime
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, '.next/static');
const SERVER_DIR = path.join(__dirname, '.next/server/app');

// Types MIME
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// Routes vers fichiers HTML pré-générés
const ROUTES = {
  '/': '/index.html',
  '/annonces': '/annonces.html',
  '/contact': '/contact.html',
  '/tarifs': '/tarifs.html',
  '/fonctionnalites': '/fonctionnalites.html',
  '/dashboard': '/dashboard.html',
  '/dashboard/contacts': '/dashboard/contacts.html',
  '/dashboard/mandates': '/dashboard/mandates.html',
  '/dashboard/properties': '/dashboard/properties.html',
  '/dashboard/settings': '/dashboard/settings.html',
  '/dashboard/visits': '/dashboard/visits.html',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Page non trouvée</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0]; // Ignorer query strings
  
  console.log(`${new Date().toISOString()} - ${req.method} ${url}`);
  
  // Servir les fichiers statiques (_next/static/*)
  if (url.startsWith('/_next/static/')) {
    const staticPath = url.replace('/_next/static/', '');
    const filePath = path.join(STATIC_DIR, staticPath);
    return serveFile(filePath, res);
  }
  
  // Servir les pages HTML pré-générées
  if (ROUTES[url]) {
    const htmlPath = path.join(SERVER_DIR, ROUTES[url]);
    return serveFile(htmlPath, res);
  }
  
  // Essayer de trouver un fichier HTML correspondant
  const htmlPath = path.join(SERVER_DIR, url + '.html');
  if (fs.existsSync(htmlPath)) {
    return serveFile(htmlPath, res);
  }
  
  // Fichier public
  const publicPath = path.join(__dirname, 'public', url);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return serveFile(publicPath, res);
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>404 - BienVuImmo</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>Page non trouvée</h1>
      <p><a href="/">Retour à l'accueil</a></p>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🏠 BienVuImmo - Serveur statique démarré sur le port ${PORT}`);
  console.log(`📁 Fichiers statiques: ${STATIC_DIR}`);
  console.log(`📄 Pages HTML: ${SERVER_DIR}`);
});
