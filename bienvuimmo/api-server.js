/**
 * Serveur API léger pour o2switch
 * Gère l'authentification sans Prisma runtime
 * Utilise mysql2 directement pour les requêtes
 */

const http = require('http');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.API_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'BienvuImmo2024SecretKeyForJWTTokens!';

// Configuration MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sc1wtgm7011_bienvuimmo_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sc1wtgm7011_bienvuimmo_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

let pool;

async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    // Ne pas planter le serveur, il peut fonctionner sans DB pour les pages statiques
  }
}

// Parse JSON body
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

// Send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Set cookie helper
function setCookie(res, name, value, options = {}) {
  const maxAge = options.maxAge || 7 * 24 * 60 * 60; // 7 jours par défaut
  const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  res.setHeader('Set-Cookie', cookie);
}

// API: Login
async function handleLogin(req, res) {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
      return sendJSON(res, 400, { error: 'Email et mot de passe requis' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Chercher l'utilisateur
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

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendJSON(res, 401, { error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si actif
    if (!user.isActive) {
      return sendJSON(res, 403, { error: 'Compte désactivé' });
    }

    // Créer le token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Définir le cookie
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
        agency: {
          id: user.agency_id,
          name: user.agency_name,
          plan: user.agency_plan
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// API: Register
async function handleRegister(req, res) {
  try {
    const body = await parseBody(req);
    const {
      firstName, lastName, email, phone, password,
      agencyName, agencyAddress, agencyCity, agencyPostalCode,
      siret, carteT, plan
    } = body;

    if (!firstName || !lastName || !email || !password || !agencyName) {
      return sendJSON(res, 400, { error: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Vérifier si l'email existe
    const [existing] = await pool.execute(
      'SELECT id FROM User WHERE LOWER(email) = LOWER(?)',
      [email]
    );

    if (existing.length > 0) {
      return sendJSON(res, 409, { error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mapper le plan
    const planMap = { starter: 'FREE', pro: 'PRO', enterprise: 'BUSINESS' };
    const dbPlan = planMap[plan] || 'FREE';

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Créer l'agence
      const fullAddress = agencyAddress 
        ? `${agencyAddress}, ${agencyPostalCode} ${agencyCity}`
        : null;

      const [agencyResult] = await connection.execute(
        `INSERT INTO Agency (id, name, email, phone, address, siret, plan, createdAt, updatedAt)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [agencyName, email.toLowerCase(), phone || null, fullAddress, siret || null, dbPlan]
      );

      // Récupérer l'ID de l'agence créée
      const [agencies] = await connection.execute(
        'SELECT id FROM Agency WHERE email = ? ORDER BY createdAt DESC LIMIT 1',
        [email.toLowerCase()]
      );
      const agencyId = agencies[0].id;

      // Créer l'utilisateur
      await connection.execute(
        `INSERT INTO User (id, email, password, firstName, lastName, phone, role, isActive, agencyId, createdAt, updatedAt)
         VALUES (UUID(), ?, ?, ?, ?, ?, 'ADMIN', 1, ?, NOW(), NOW())`,
        [email.toLowerCase(), hashedPassword, firstName, lastName, phone || null, agencyId]
      );

      await connection.commit();

      // Récupérer l'utilisateur créé
      const [users] = await pool.execute(
        'SELECT * FROM User WHERE email = ?',
        [email.toLowerCase()]
      );
      const user = users[0];

      // Créer le token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      setCookie(res, 'auth_token', token);

      sendJSON(res, 201, {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
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

// API: Me (get current user)
async function handleMe(req, res) {
  try {
    // Récupérer le token du header ou cookie
    const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie || '';
    
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (authCookie) {
        token = authCookie.split('=')[1];
      }
    }

    if (!token) {
      return sendJSON(res, 401, { error: 'Non authentifié' });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return sendJSON(res, 401, { error: 'Token invalide' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Récupérer l'utilisateur
    const [users] = await pool.execute(
      `SELECT u.*, a.id as agency_id, a.name as agency_name, a.plan as agency_plan
       FROM User u
       LEFT JOIN Agency a ON u.agencyId = a.id
       WHERE u.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return sendJSON(res, 404, { error: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    sendJSON(res, 200, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        agency: {
          id: user.agency_id,
          name: user.agency_name,
          plan: user.agency_plan
        }
      }
    });

  } catch (error) {
    console.error('Me error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// API: Logout
function handleLogout(req, res) {
  res.setHeader('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Max-Age=0');
  sendJSON(res, 200, { success: true });
}

// Main server
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

  // Routes API
  if (url === '/api/auth/login' && method === 'POST') {
    return handleLogin(req, res);
  }
  
  if (url === '/api/auth/register' && method === 'POST') {
    return handleRegister(req, res);
  }
  
  if (url === '/api/auth/me' && method === 'GET') {
    return handleMe(req, res);
  }
  
  if (url === '/api/auth/logout' && method === 'POST') {
    return handleLogout(req, res);
  }

  // Health check
  if (url === '/api/health') {
    return sendJSON(res, 200, { 
      status: 'ok', 
      database: pool ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  // 404 pour les autres routes API
  sendJSON(res, 404, { error: 'Route not found' });
});

// Démarrage
initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
  });
});
