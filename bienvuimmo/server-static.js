/**
 * Serveur hybride BienVuImmo pour o2switch
 * - Sert les pages HTML pré-générées (pas de Next.js runtime)
 * - Gère les API d'authentification avec MySQL direct
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, '.next/static');
const SERVER_DIR = path.join(__dirname, '.next/server/app');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'BienvuImmo2024SecretKeyForJWTTokens!';

// Configuration MySQL depuis .env ou variables d'environnement
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

// Parser DATABASE_URL si disponible
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  DB_CONFIG.host = url.hostname;
  DB_CONFIG.user = url.username;
  DB_CONFIG.password = url.password;
  DB_CONFIG.database = url.pathname.slice(1);
  DB_CONFIG.port = url.port || 3306;
}

let pool = null;

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
  '/inscription': '/inscription.html',
  '/connexion': '/connexion.html',
  '/dashboard': '/dashboard.html',
  '/dashboard/contacts': '/dashboard/contacts.html',
  '/dashboard/mandates': '/dashboard/mandates.html',
  '/dashboard/properties': '/dashboard/properties.html',
  '/dashboard/settings': '/dashboard/settings.html',
  '/dashboard/visits': '/dashboard/visits.html',
};

// ============ HELPERS ============

async function initDatabase() {
  if (!DB_CONFIG.user || !DB_CONFIG.database) {
    console.log('⚠️  Configuration MySQL manquante - API désactivées');
    return;
  }
  try {
    pool = mysql.createPool(DB_CONFIG);
    const connection = await pool.getConnection();
    console.log('✅ MySQL connecté');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur MySQL:', error.message);
    pool = null;
  }
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

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

function setCookie(res, name, value, maxAge = 7 * 24 * 60 * 60) {
  const existing = res.getHeader('Set-Cookie') || [];
  const cookies = Array.isArray(existing) ? existing : [existing];
  cookies.push(`${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`);
  res.setHeader('Set-Cookie', cookies);
}

// ============ API HANDLERS ============

async function handleLogin(req, res) {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
      return sendJSON(res, 400, { error: 'Email et mot de passe requis' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const [users] = await pool.execute(
      `SELECT u.*, a.id as agency_id, a.name as agency_name, a.plan as agency_plan
       FROM User u
       LEFT JOIN Agency a ON u.agencyId = a.id
       WHERE LOWER(u.email) = LOWER(?)`,
      [email]
    );

    if (users.length === 0) {
      return sendJSON(res, 401, { error: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return sendJSON(res, 401, { error: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return sendJSON(res, 403, { error: 'Compte désactivé' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, agencyId: user.agencyId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    setCookie(res, 'auth_token', token);

    sendJSON(res, 200, {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        agency: { id: user.agency_id, name: user.agency_name, plan: user.agency_plan }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleRegister(req, res) {
  try {
    const body = await parseBody(req);
    const { firstName, lastName, email, phone, password, agencyName, agencyAddress, agencyCity, agencyPostalCode, siret, plan } = body;

    if (!firstName || !lastName || !email || !password || !agencyName) {
      return sendJSON(res, 400, { error: 'Champs obligatoires manquants' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Vérifier email existant
    const [existing] = await pool.execute('SELECT id FROM User WHERE LOWER(email) = LOWER(?)', [email]);
    if (existing.length > 0) {
      return sendJSON(res, 409, { error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const planMap = { starter: 'FREE', pro: 'PRO', enterprise: 'BUSINESS' };
    const dbPlan = planMap[plan] || 'FREE';
    const fullAddress = agencyAddress ? `${agencyAddress}, ${agencyPostalCode} ${agencyCity}` : null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Créer agence
      const agencyId = require('crypto').randomUUID();
      await connection.execute(
        `INSERT INTO Agency (id, name, email, phone, address, siret, plan, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [agencyId, agencyName, email.toLowerCase(), phone || null, fullAddress, siret || null, dbPlan]
      );

      // Créer utilisateur
      const userId = require('crypto').randomUUID();
      await connection.execute(
        `INSERT INTO User (id, email, password, firstName, lastName, phone, role, isActive, agencyId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'ADMIN', 1, ?, NOW(), NOW())`,
        [userId, email.toLowerCase(), hashedPassword, firstName, lastName, phone || null, agencyId]
      );

      await connection.commit();

      const token = jwt.sign(
        { userId, email: email.toLowerCase(), role: 'ADMIN', agencyId },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      setCookie(res, 'auth_token', token);

      sendJSON(res, 201, {
        success: true,
        token,
        user: { id: userId, email: email.toLowerCase(), firstName, lastName, role: 'ADMIN' }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Register error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur: ' + error.message });
  }
}

async function handleMe(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie || '';
    
    let token = null;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (authCookie) token = authCookie.split('=')[1];
    }

    if (!token) return sendJSON(res, 401, { error: 'Non authentifié' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return sendJSON(res, 401, { error: 'Token invalide' });
    }

    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [users] = await pool.execute(
      `SELECT u.*, a.id as agency_id, a.name as agency_name, a.plan as agency_plan
       FROM User u LEFT JOIN Agency a ON u.agencyId = a.id WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) return sendJSON(res, 404, { error: 'Utilisateur non trouvé' });

    const user = users[0];
    sendJSON(res, 200, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        agency: { id: user.agency_id, name: user.agency_name, plan: user.agency_plan }
      }
    });

  } catch (error) {
    console.error('Me error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

function handleLogout(req, res) {
  res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Max-Age=0');
  sendJSON(res, 200, { success: true });
}

// ============ MAIN SERVER ============

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${url}`);

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // ===== API ROUTES =====
  if (url === '/api/auth/login' && method === 'POST') return handleLogin(req, res);
  if (url === '/api/auth/register' && method === 'POST') return handleRegister(req, res);
  if (url === '/api/auth/me' && method === 'GET') return handleMe(req, res);
  if (url === '/api/auth/logout' && method === 'POST') return handleLogout(req, res);
  
  if (url === '/api/health') {
    return sendJSON(res, 200, { 
      status: 'ok', 
      database: pool ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  // ===== STATIC FILES =====
  
  // Fichiers statiques Next.js
  if (url.startsWith('/_next/static/')) {
    const staticPath = url.replace('/_next/static/', '');
    return serveFile(path.join(STATIC_DIR, staticPath), res);
  }

  // Pages HTML pré-générées
  if (ROUTES[url]) {
    return serveFile(path.join(SERVER_DIR, ROUTES[url]), res);
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
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>404 - BienVuImmo</title>
      <style>
        body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #FAFAF9; }
        h1 { color: #1c1917; }
        a { color: #f59e0b; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <p><a href="/">← Retour à l'accueil</a></p>
    </body>
    </html>
  `);
});

// ============ STARTUP ============

initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`
🏠 ═══════════════════════════════════════════════
   BienVuImmo - Serveur Hybride
   Port: ${PORT}
   
   📄 Pages statiques: activées
   🔐 API Auth: ${pool ? 'activées' : 'désactivées (DB non configurée)'}
   
   Routes disponibles:
   - GET  /                     → Page d'accueil
   - GET  /connexion            → Page de connexion
   - GET  /inscription          → Page d'inscription
   - GET  /dashboard/*          → Dashboard
   - POST /api/auth/login       → Connexion API
   - POST /api/auth/register    → Inscription API
   - GET  /api/auth/me          → Utilisateur courant
   - POST /api/auth/logout      → Déconnexion
   - GET  /api/health           → Status serveur
═══════════════════════════════════════════════ 🏠
    `);
  });
});
