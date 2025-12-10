/**
 * Serveur hybride BienVuImmo pour o2switch
 * - Sert les pages HTML pré-générées (pas de Next.js runtime)
 * - Gère les API d'authentification avec MySQL direct
 * - Gère l'envoi d'emails de confirmation
 */

// Charger les variables d'environnement depuis .env
require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, '.next/static');
const SERVER_DIR = path.join(__dirname, '.next/server/app');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'BienvuImmo2024SecretKeyForJWTTokens!';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bienvuimmo.fr';

// Configuration email SMTP (o2switch)
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.bienvuimmo.fr',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'noreply@bienvuimmo.fr',
    pass: process.env.SMTP_PASS || ''
  }
});

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
  console.log('📝 Register request received');
  try {
    const body = await parseBody(req);
    console.log('📝 Register body parsed:', { email: body.email, agencyName: body.agencyName });
    
    const { firstName, lastName, email, phone, password, agencyName, agencyAddress, agencyCity, agencyPostalCode, siret, plan } = body;

    if (!firstName || !lastName || !email || !password || !agencyName) {
      console.log('❌ Register: champs manquants');
      return sendJSON(res, 400, { error: 'Champs obligatoires manquants' });
    }

    if (!pool) {
      console.log('❌ Register: base de données non disponible');
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Vérifier email existant
    const [existing] = await pool.execute('SELECT id FROM User WHERE LOWER(email) = LOWER(?)', [email]);
    if (existing.length > 0) {
      console.log('❌ Register: email déjà utilisé');
      return sendJSON(res, 409, { error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const planMap = { starter: 'FREE', pro: 'PRO', enterprise: 'BUSINESS' };
    const dbPlan = planMap[plan] || 'FREE';
    const fullAddress = agencyAddress ? `${agencyAddress}, ${agencyPostalCode} ${agencyCity}` : null;

    // Générer token de confirmation email
    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Créer agence
      const agencyId = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO Agency (id, name, email, phone, address, siret, plan, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [agencyId, agencyName, email.toLowerCase(), phone || null, fullAddress, siret || null, dbPlan]
      );

      // Créer utilisateur avec token de confirmation
      const userId = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO User (id, email, password, firstName, lastName, phone, role, isActive, emailVerified, emailToken, emailTokenExpiry, agencyId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'ADMIN', 1, 0, ?, ?, ?, NOW(), NOW())`,
        [userId, email.toLowerCase(), hashedPassword, firstName, lastName, phone || null, emailToken, emailTokenExpiry, agencyId]
      );

      await connection.commit();
      console.log('✅ Register: compte créé avec succès');

      // Envoyer email de confirmation (en arrière-plan, ne bloque pas l'inscription)
      sendConfirmationEmail(email.toLowerCase(), firstName, emailToken).catch(err => {
        console.error('Erreur envoi email confirmation:', err);
      });

      const token = jwt.sign(
        { userId, email: email.toLowerCase(), role: 'ADMIN', agencyId },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      setCookie(res, 'auth_token', token);

      sendJSON(res, 201, {
        success: true,
        token,
        user: { 
          id: userId, 
          email: email.toLowerCase(), 
          firstName, 
          lastName, 
          role: 'ADMIN',
          agency: { id: agencyId, name: agencyName, plan: dbPlan }
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('❌ Register error:', error);
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

// ============ EMAIL FUNCTIONS ============

async function sendConfirmationEmail(email, firstName, token) {
  const confirmUrl = `${SITE_URL}/confirmer-email?token=${token}`;
  
  const mailOptions = {
    from: `"BienVuImmo" <${process.env.SMTP_USER || 'noreply@bienvuimmo.fr'}>`,
    to: email,
    subject: '✅ Confirmez votre compte BienVuImmo',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1c1917; margin-top: 0; }
          .content p { color: #57534e; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
          .footer { background: #fafaf9; padding: 20px 30px; text-align: center; color: #a8a29e; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 BienVuImmo</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${firstName} !</h2>
            <p>Merci de vous être inscrit sur BienVuImmo, la plateforme SaaS nouvelle génération pour les agents immobiliers.</p>
            <p>Pour activer votre compte et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
              <a href="${confirmUrl}" class="button">Confirmer mon email</a>
            </p>
            <p style="font-size: 14px; color: #a8a29e;">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
          <div class="footer">
            <p>© 2024 BienVuImmo - Créé avec ❤️ par Dimitri Sarrazin</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log('📧 Email de confirmation envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    return false;
  }
}

async function handleConfirmEmail(req, res) {
  try {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const token = urlParams.searchParams.get('token');

    if (!token) {
      return sendJSON(res, 400, { error: 'Token manquant' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    // Vérifier le token
    const [users] = await pool.execute(
      'SELECT id, email, firstName, emailVerified FROM User WHERE emailToken = ? AND emailTokenExpiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return sendJSON(res, 400, { error: 'Token invalide ou expiré' });
    }

    const user = users[0];

    if (user.emailVerified) {
      return sendJSON(res, 200, { success: true, message: 'Email déjà confirmé' });
    }

    // Confirmer l'email
    await pool.execute(
      'UPDATE User SET emailVerified = 1, emailToken = NULL, emailTokenExpiry = NULL, updatedAt = NOW() WHERE id = ?',
      [user.id]
    );

    console.log('✅ Email confirmé pour:', user.email);
    sendJSON(res, 200, { success: true, message: 'Email confirmé avec succès' });

  } catch (error) {
    console.error('Confirm email error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleResendConfirmation(req, res) {
  try {
    const { email } = await parseBody(req);

    if (!email) {
      return sendJSON(res, 400, { error: 'Email requis' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const [users] = await pool.execute(
      'SELECT id, firstName, emailVerified FROM User WHERE LOWER(email) = LOWER(?)',
      [email]
    );

    if (users.length === 0) {
      // Ne pas révéler si l'email existe ou non
      return sendJSON(res, 200, { success: true, message: 'Si cet email existe, un nouveau lien a été envoyé' });
    }

    const user = users[0];

    if (user.emailVerified) {
      return sendJSON(res, 200, { success: true, message: 'Email déjà confirmé' });
    }

    // Générer nouveau token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await pool.execute(
      'UPDATE User SET emailToken = ?, emailTokenExpiry = ?, updatedAt = NOW() WHERE id = ?',
      [token, expiry, user.id]
    );

    await sendConfirmationEmail(email, user.firstName, token);

    sendJSON(res, 200, { success: true, message: 'Email de confirmation renvoyé' });

  } catch (error) {
    console.error('Resend confirmation error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ DASHBOARD API ============

async function getAuthenticatedUser(req) {
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

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function handleDashboardStats(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return sendJSON(res, 401, { error: 'Non authentifié' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const agencyId = user.agencyId;

    // Récupérer les statistiques
    const [[propertyStats]] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'UNDER_OFFER' THEN 1 ELSE 0 END) as underOffer,
        SUM(CASE WHEN status = 'SOLD' THEN 1 ELSE 0 END) as sold
       FROM Property WHERE agencyId = ?`,
      [agencyId]
    );

    const [[contactStats]] = await pool.execute(
      'SELECT COUNT(*) as total FROM Contact WHERE agencyId = ?',
      [agencyId]
    );

    const [[visitStats]] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'SCHEDULED' AND date >= CURDATE() THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as thisWeek
       FROM Visit WHERE agencyId = ?`,
      [agencyId]
    );

    const [[mandateStats]] = await pool.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active
       FROM Mandate WHERE agencyId = ?`,
      [agencyId]
    );

    sendJSON(res, 200, {
      stats: {
        properties: {
          total: propertyStats?.total || 0,
          available: propertyStats?.available || 0,
          underOffer: propertyStats?.underOffer || 0,
          sold: propertyStats?.sold || 0
        },
        contacts: {
          total: contactStats?.total || 0
        },
        visits: {
          total: visitStats?.total || 0,
          upcoming: visitStats?.upcoming || 0,
          thisWeek: visitStats?.thisWeek || 0
        },
        mandates: {
          total: mandateStats?.total || 0,
          active: mandateStats?.active || 0
        }
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDashboardProperties(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return sendJSON(res, 401, { error: 'Non authentifié' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const [properties] = await pool.execute(
      `SELECT id, reference, title, city, price, surface, status, views, createdAt
       FROM Property WHERE agencyId = ? ORDER BY createdAt DESC LIMIT 10`,
      [user.agencyId]
    );

    sendJSON(res, 200, { properties });

  } catch (error) {
    console.error('Dashboard properties error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDashboardActivities(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return sendJSON(res, 401, { error: 'Non authentifié' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const [activities] = await pool.execute(
      `SELECT id, type, message, createdAt
       FROM Activity WHERE agencyId = ? ORDER BY createdAt DESC LIMIT 10`,
      [user.agencyId]
    );

    sendJSON(res, 200, { activities });

  } catch (error) {
    console.error('Dashboard activities error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDashboardVisits(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return sendJSON(res, 401, { error: 'Non authentifié' });
    }

    if (!pool) {
      return sendJSON(res, 503, { error: 'Base de données non disponible' });
    }

    const [visits] = await pool.execute(
      `SELECT v.id, v.date, v.time, v.status, p.title as propertyTitle, c.firstName, c.lastName
       FROM Visit v
       LEFT JOIN Property p ON v.propertyId = p.id
       LEFT JOIN Contact c ON v.contactId = c.id
       WHERE v.agencyId = ? AND v.date >= CURDATE()
       ORDER BY v.date ASC, v.time ASC LIMIT 10`,
      [user.agencyId]
    );

    sendJSON(res, 200, { visits });

  } catch (error) {
    console.error('Dashboard visits error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ PROPERTIES API ============

async function handleGetProperties(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const status = urlParams.searchParams.get('status');
    const type = urlParams.searchParams.get('type');
    const search = urlParams.searchParams.get('search');
    const limit = parseInt(urlParams.searchParams.get('limit') || '50');
    const offset = parseInt(urlParams.searchParams.get('offset') || '0');

    let query = `SELECT p.*, u.firstName as agentFirstName, u.lastName as agentLastName
                 FROM Property p 
                 LEFT JOIN User u ON p.agentId = u.id
                 WHERE p.agencyId = ?`;
    const params = [user.agencyId];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND p.type = ?';
      params.push(type);
    }
    if (search) {
      query += ' AND (p.title LIKE ? OR p.city LIKE ? OR p.reference LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [properties] = await pool.execute(query, params);
    
    // Count total
    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) as total FROM Property WHERE agencyId = ?',
      [user.agencyId]
    );

    sendJSON(res, 200, { properties, total, limit, offset });
  } catch (error) {
    console.error('Get properties error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleGetProperty(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [properties] = await pool.execute(
      `SELECT p.*, u.firstName as agentFirstName, u.lastName as agentLastName
       FROM Property p 
       LEFT JOIN User u ON p.agentId = u.id
       WHERE p.id = ? AND p.agencyId = ?`,
      [id, user.agencyId]
    );

    if (properties.length === 0) {
      return sendJSON(res, 404, { error: 'Bien non trouvé' });
    }

    // Get images
    const [images] = await pool.execute(
      'SELECT * FROM PropertyImage WHERE propertyId = ? ORDER BY position',
      [id]
    );

    sendJSON(res, 200, { property: { ...properties[0], images } });
  } catch (error) {
    console.error('Get property error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleCreateProperty(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);
    const { title, description, type, status, price, surface, rooms, bedrooms, bathrooms, 
            address, city, postalCode, latitude, longitude, features } = body;

    if (!title || !type || !price) {
      return sendJSON(res, 400, { error: 'Titre, type et prix sont requis' });
    }

    const id = crypto.randomUUID();
    const reference = `BV-${Date.now().toString(36).toUpperCase()}`;

    await pool.execute(
      `INSERT INTO Property (id, reference, title, description, type, status, price, surface, rooms, bedrooms, bathrooms, address, city, postalCode, latitude, longitude, features, agencyId, agentId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, reference, title, description || null, type, status || 'AVAILABLE', price, surface || null, rooms || null, bedrooms || null, bathrooms || null, address || null, city || null, postalCode || null, latitude || null, longitude || null, JSON.stringify(features || []), user.agencyId, user.userId]
    );

    // Log activity
    await pool.execute(
      `INSERT INTO Activity (id, type, message, agencyId, userId, createdAt) VALUES (?, 'PROPERTY_CREATED', ?, ?, ?, NOW())`,
      [crypto.randomUUID(), `Nouveau bien créé: ${title}`, user.agencyId, user.userId]
    );

    sendJSON(res, 201, { success: true, id, reference });
  } catch (error) {
    console.error('Create property error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur: ' + error.message });
  }
}

async function handleUpdateProperty(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    // Check ownership
    const [existing] = await pool.execute(
      'SELECT id FROM Property WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );
    if (existing.length === 0) {
      return sendJSON(res, 404, { error: 'Bien non trouvé' });
    }

    const body = await parseBody(req);
    const fields = [];
    const values = [];

    const allowedFields = ['title', 'description', 'type', 'status', 'price', 'surface', 'rooms', 'bedrooms', 'bathrooms', 'address', 'city', 'postalCode', 'latitude', 'longitude'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (body.features !== undefined) {
      fields.push('features = ?');
      values.push(JSON.stringify(body.features));
    }

    if (fields.length === 0) {
      return sendJSON(res, 400, { error: 'Aucun champ à mettre à jour' });
    }

    fields.push('updatedAt = NOW()');
    values.push(id, user.agencyId);

    await pool.execute(
      `UPDATE Property SET ${fields.join(', ')} WHERE id = ? AND agencyId = ?`,
      values
    );

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Update property error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDeleteProperty(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [result] = await pool.execute(
      'DELETE FROM Property WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );

    if (result.affectedRows === 0) {
      return sendJSON(res, 404, { error: 'Bien non trouvé' });
    }

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Delete property error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ CONTACTS API ============

async function handleGetContacts(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const type = urlParams.searchParams.get('type');
    const search = urlParams.searchParams.get('search');
    const limit = parseInt(urlParams.searchParams.get('limit') || '50');
    const offset = parseInt(urlParams.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM Contact WHERE agencyId = ?';
    const params = [user.agencyId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (search) {
      query += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [contacts] = await pool.execute(query, params);

    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) as total FROM Contact WHERE agencyId = ?',
      [user.agencyId]
    );

    sendJSON(res, 200, { contacts, total, limit, offset });
  } catch (error) {
    console.error('Get contacts error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleGetContact(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [contacts] = await pool.execute(
      'SELECT * FROM Contact WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );

    if (contacts.length === 0) {
      return sendJSON(res, 404, { error: 'Contact non trouvé' });
    }

    // Get associated properties
    const [properties] = await pool.execute(
      `SELECT p.id, p.title, p.reference, pc.type as interestType
       FROM PropertyContact pc
       JOIN Property p ON pc.propertyId = p.id
       WHERE pc.contactId = ?`,
      [id]
    );

    sendJSON(res, 200, { contact: { ...contacts[0], properties } });
  } catch (error) {
    console.error('Get contact error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleCreateContact(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);
    const { firstName, lastName, email, phone, type, source, budget, notes } = body;

    if (!firstName || !lastName) {
      return sendJSON(res, 400, { error: 'Prénom et nom sont requis' });
    }

    const id = crypto.randomUUID();

    await pool.execute(
      `INSERT INTO Contact (id, firstName, lastName, email, phone, type, source, budget, notes, agencyId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, firstName, lastName, email || null, phone || null, type || 'BUYER', source || 'WEBSITE', budget || null, notes || null, user.agencyId]
    );

    // Log activity
    await pool.execute(
      `INSERT INTO Activity (id, type, message, agencyId, userId, createdAt) VALUES (?, 'CONTACT_CREATED', ?, ?, ?, NOW())`,
      [crypto.randomUUID(), `Nouveau contact: ${firstName} ${lastName}`, user.agencyId, user.userId]
    );

    sendJSON(res, 201, { success: true, id });
  } catch (error) {
    console.error('Create contact error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur: ' + error.message });
  }
}

async function handleUpdateContact(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [existing] = await pool.execute(
      'SELECT id FROM Contact WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );
    if (existing.length === 0) {
      return sendJSON(res, 404, { error: 'Contact non trouvé' });
    }

    const body = await parseBody(req);
    const fields = [];
    const values = [];

    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'type', 'source', 'budget', 'notes'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (fields.length === 0) {
      return sendJSON(res, 400, { error: 'Aucun champ à mettre à jour' });
    }

    fields.push('updatedAt = NOW()');
    values.push(id, user.agencyId);

    await pool.execute(
      `UPDATE Contact SET ${fields.join(', ')} WHERE id = ? AND agencyId = ?`,
      values
    );

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Update contact error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDeleteContact(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [result] = await pool.execute(
      'DELETE FROM Contact WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );

    if (result.affectedRows === 0) {
      return sendJSON(res, 404, { error: 'Contact non trouvé' });
    }

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ VISITS API ============

async function handleGetVisits(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const status = urlParams.searchParams.get('status');
    const propertyId = urlParams.searchParams.get('propertyId');
    const fromDate = urlParams.searchParams.get('from');
    const toDate = urlParams.searchParams.get('to');

    let query = `SELECT v.*, p.title as propertyTitle, p.reference as propertyReference,
                        c.firstName as contactFirstName, c.lastName as contactLastName, c.phone as contactPhone
                 FROM Visit v
                 LEFT JOIN Property p ON v.propertyId = p.id
                 LEFT JOIN Contact c ON v.contactId = c.id
                 WHERE v.agencyId = ?`;
    const params = [user.agencyId];

    if (status) {
      query += ' AND v.status = ?';
      params.push(status);
    }
    if (propertyId) {
      query += ' AND v.propertyId = ?';
      params.push(propertyId);
    }
    if (fromDate) {
      query += ' AND v.date >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      query += ' AND v.date <= ?';
      params.push(toDate);
    }

    query += ' ORDER BY v.date DESC, v.time DESC';

    const [visits] = await pool.execute(query, params);
    sendJSON(res, 200, { visits });
  } catch (error) {
    console.error('Get visits error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleCreateVisit(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);
    const { propertyId, contactId, date, time, notes } = body;

    if (!propertyId || !contactId || !date || !time) {
      return sendJSON(res, 400, { error: 'Bien, contact, date et heure sont requis' });
    }

    const id = crypto.randomUUID();

    await pool.execute(
      `INSERT INTO Visit (id, propertyId, contactId, date, time, status, notes, agencyId, agentId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?, NOW(), NOW())`,
      [id, propertyId, contactId, date, time, notes || null, user.agencyId, user.userId]
    );

    // Log activity
    await pool.execute(
      `INSERT INTO Activity (id, type, message, agencyId, userId, createdAt) VALUES (?, 'VISIT_SCHEDULED', ?, ?, ?, NOW())`,
      [crypto.randomUUID(), `Visite programmée le ${date} à ${time}`, user.agencyId, user.userId]
    );

    sendJSON(res, 201, { success: true, id });
  } catch (error) {
    console.error('Create visit error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur: ' + error.message });
  }
}

async function handleUpdateVisit(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [existing] = await pool.execute(
      'SELECT id FROM Visit WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );
    if (existing.length === 0) {
      return sendJSON(res, 404, { error: 'Visite non trouvée' });
    }

    const body = await parseBody(req);
    const fields = [];
    const values = [];

    const allowedFields = ['date', 'time', 'status', 'notes', 'feedback'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (fields.length === 0) {
      return sendJSON(res, 400, { error: 'Aucun champ à mettre à jour' });
    }

    fields.push('updatedAt = NOW()');
    values.push(id, user.agencyId);

    await pool.execute(
      `UPDATE Visit SET ${fields.join(', ')} WHERE id = ? AND agencyId = ?`,
      values
    );

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Update visit error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDeleteVisit(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [result] = await pool.execute(
      'DELETE FROM Visit WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );

    if (result.affectedRows === 0) {
      return sendJSON(res, 404, { error: 'Visite non trouvée' });
    }

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Delete visit error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ MANDATES API ============

async function handleGetMandates(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const status = urlParams.searchParams.get('status');
    const type = urlParams.searchParams.get('type');

    let query = `SELECT m.*, p.title as propertyTitle, p.reference as propertyReference,
                        c.firstName as ownerFirstName, c.lastName as ownerLastName
                 FROM Mandate m
                 LEFT JOIN Property p ON m.propertyId = p.id
                 LEFT JOIN Contact c ON m.ownerId = c.id
                 WHERE m.agencyId = ?`;
    const params = [user.agencyId];

    if (status) {
      query += ' AND m.status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND m.type = ?';
      params.push(type);
    }

    query += ' ORDER BY m.createdAt DESC';

    const [mandates] = await pool.execute(query, params);
    sendJSON(res, 200, { mandates });
  } catch (error) {
    console.error('Get mandates error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleCreateMandate(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);
    const { propertyId, ownerId, type, startDate, endDate, commission, exclusivity } = body;

    if (!propertyId || !type || !startDate) {
      return sendJSON(res, 400, { error: 'Bien, type et date de début sont requis' });
    }

    const id = crypto.randomUUID();
    const reference = `MAN-${Date.now().toString(36).toUpperCase()}`;

    await pool.execute(
      `INSERT INTO Mandate (id, reference, propertyId, ownerId, type, status, startDate, endDate, commission, exclusivity, agencyId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, reference, propertyId, ownerId || null, type, startDate, endDate || null, commission || null, exclusivity ? 1 : 0, user.agencyId]
    );

    // Log activity
    await pool.execute(
      `INSERT INTO Activity (id, type, message, agencyId, userId, createdAt) VALUES (?, 'MANDATE_CREATED', ?, ?, ?, NOW())`,
      [crypto.randomUUID(), `Nouveau mandat créé: ${reference}`, user.agencyId, user.userId]
    );

    sendJSON(res, 201, { success: true, id, reference });
  } catch (error) {
    console.error('Create mandate error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur: ' + error.message });
  }
}

async function handleUpdateMandate(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [existing] = await pool.execute(
      'SELECT id FROM Mandate WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );
    if (existing.length === 0) {
      return sendJSON(res, 404, { error: 'Mandat non trouvé' });
    }

    const body = await parseBody(req);
    const fields = [];
    const values = [];

    const allowedFields = ['type', 'status', 'startDate', 'endDate', 'commission', 'exclusivity'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'exclusivity') {
          fields.push(`${field} = ?`);
          values.push(body[field] ? 1 : 0);
        } else {
          fields.push(`${field} = ?`);
          values.push(body[field]);
        }
      }
    }

    if (fields.length === 0) {
      return sendJSON(res, 400, { error: 'Aucun champ à mettre à jour' });
    }

    fields.push('updatedAt = NOW()');
    values.push(id, user.agencyId);

    await pool.execute(
      `UPDATE Mandate SET ${fields.join(', ')} WHERE id = ? AND agencyId = ?`,
      values
    );

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Update mandate error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleDeleteMandate(req, res, id) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [result] = await pool.execute(
      'DELETE FROM Mandate WHERE id = ? AND agencyId = ?',
      [id, user.agencyId]
    );

    if (result.affectedRows === 0) {
      return sendJSON(res, 404, { error: 'Mandat non trouvé' });
    }

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Delete mandate error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

// ============ SETTINGS API ============

async function handleGetSettings(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const [users] = await pool.execute(
      'SELECT id, email, firstName, lastName, phone, role FROM User WHERE id = ?',
      [user.userId]
    );

    const [agencies] = await pool.execute(
      'SELECT * FROM Agency WHERE id = ?',
      [user.agencyId]
    );

    sendJSON(res, 200, {
      user: users[0] || null,
      agency: agencies[0] || null
    });
  } catch (error) {
    console.error('Get settings error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleUpdateSettings(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);

    // Update user
    if (body.user) {
      const { firstName, lastName, phone } = body.user;
      await pool.execute(
        'UPDATE User SET firstName = ?, lastName = ?, phone = ?, updatedAt = NOW() WHERE id = ?',
        [firstName, lastName, phone || null, user.userId]
      );
    }

    // Update agency (admin only)
    if (body.agency && user.role === 'ADMIN') {
      const { name, address, phone, email, siret } = body.agency;
      await pool.execute(
        'UPDATE Agency SET name = ?, address = ?, phone = ?, email = ?, siret = ?, updatedAt = NOW() WHERE id = ?',
        [name, address || null, phone || null, email || null, siret || null, user.agencyId]
      );
    }

    sendJSON(res, 200, { success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
}

async function handleChangePassword(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return sendJSON(res, 401, { error: 'Non authentifié' });
    if (!pool) return sendJSON(res, 503, { error: 'Base de données non disponible' });

    const body = await parseBody(req);
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return sendJSON(res, 400, { error: 'Mot de passe actuel et nouveau requis' });
    }

    if (newPassword.length < 8) {
      return sendJSON(res, 400, { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }

    // Verify current password
    const [users] = await pool.execute(
      'SELECT password FROM User WHERE id = ?',
      [user.userId]
    );

    if (users.length === 0) {
      return sendJSON(res, 404, { error: 'Utilisateur non trouvé' });
    }

    const isValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValid) {
      return sendJSON(res, 401, { error: 'Mot de passe actuel incorrect' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.execute(
      'UPDATE User SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, user.userId]
    );

    sendJSON(res, 200, { success: true, message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    sendJSON(res, 500, { error: 'Erreur serveur' });
  }
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });
    return res.end();
  }

  // ===== API ROUTES =====
  // Login
  if (url === '/api/auth/login' && method === 'POST') {
    return handleLogin(req, res);
  }
  
  // Register
  if (url === '/api/auth/register' && method === 'POST') {
    return handleRegister(req, res);
  }
  
  // Me - GET user info
  if (url === '/api/auth/me' && method === 'GET') {
    return handleMe(req, res);
  }
  
  // Logout
  if (url === '/api/auth/logout' && method === 'POST') {
    return handleLogout(req, res);
  }

  // Confirm email
  if (url.startsWith('/api/auth/confirm-email')) {
    return handleConfirmEmail(req, res);
  }

  // Resend confirmation email
  if (url === '/api/auth/resend-confirmation' && method === 'POST') {
    return handleResendConfirmation(req, res);
  }

  // Dashboard stats
  if (url === '/api/dashboard/stats' && method === 'GET') {
    return handleDashboardStats(req, res);
  }

  // Dashboard properties
  if (url === '/api/dashboard/properties' && method === 'GET') {
    return handleDashboardProperties(req, res);
  }

  // Dashboard activities
  if (url === '/api/dashboard/activities' && method === 'GET') {
    return handleDashboardActivities(req, res);
  }

  // Dashboard upcoming visits
  if (url === '/api/dashboard/visits' && method === 'GET') {
    return handleDashboardVisits(req, res);
  }

  // ===== PROPERTIES API =====
  if (url === '/api/properties' && method === 'GET') {
    return handleGetProperties(req, res);
  }
  if (url === '/api/properties' && method === 'POST') {
    return handleCreateProperty(req, res);
  }
  if (url.match(/^\/api\/properties\/[\w-]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    return handleGetProperty(req, res, id);
  }
  if (url.match(/^\/api\/properties\/[\w-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return handleUpdateProperty(req, res, id);
  }
  if (url.match(/^\/api\/properties\/[\w-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    return handleDeleteProperty(req, res, id);
  }

  // ===== CONTACTS API =====
  if (url === '/api/contacts' && method === 'GET') {
    return handleGetContacts(req, res);
  }
  if (url === '/api/contacts' && method === 'POST') {
    return handleCreateContact(req, res);
  }
  if (url.match(/^\/api\/contacts\/[\w-]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    return handleGetContact(req, res, id);
  }
  if (url.match(/^\/api\/contacts\/[\w-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return handleUpdateContact(req, res, id);
  }
  if (url.match(/^\/api\/contacts\/[\w-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    return handleDeleteContact(req, res, id);
  }

  // ===== VISITS API =====
  if (url === '/api/visits' && method === 'GET') {
    return handleGetVisits(req, res);
  }
  if (url === '/api/visits' && method === 'POST') {
    return handleCreateVisit(req, res);
  }
  if (url.match(/^\/api\/visits\/[\w-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return handleUpdateVisit(req, res, id);
  }
  if (url.match(/^\/api\/visits\/[\w-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    return handleDeleteVisit(req, res, id);
  }

  // ===== MANDATES API =====
  if (url === '/api/mandates' && method === 'GET') {
    return handleGetMandates(req, res);
  }
  if (url === '/api/mandates' && method === 'POST') {
    return handleCreateMandate(req, res);
  }
  if (url.match(/^\/api\/mandates\/[\w-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return handleUpdateMandate(req, res, id);
  }
  if (url.match(/^\/api\/mandates\/[\w-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    return handleDeleteMandate(req, res, id);
  }

  // ===== SETTINGS API =====
  if (url === '/api/settings' && method === 'GET') {
    return handleGetSettings(req, res);
  }
  if (url === '/api/settings' && method === 'PUT') {
    return handleUpdateSettings(req, res);
  }
  if (url === '/api/settings/password' && method === 'PUT') {
    return handleChangePassword(req, res);
  }
  
  // Health check
  if (url === '/api/health') {
    return sendJSON(res, 200, { 
      status: 'ok', 
      database: pool ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  // API 404 - Retourner JSON pour les routes /api/*
  if (url.startsWith('/api/')) {
    return sendJSON(res, 404, { error: 'Route API non trouvée', path: url, method });
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
   
   Routes API disponibles:
   
   Auth:
   - POST /api/auth/login          → Connexion
   - POST /api/auth/register       → Inscription
   - GET  /api/auth/me             → Utilisateur courant
   - POST /api/auth/logout         → Déconnexion
   - GET  /api/auth/confirm-email  → Confirmer email
   - POST /api/auth/resend-confirmation → Renvoyer confirmation
   
   Dashboard:
   - GET  /api/dashboard/stats      → Statistiques
   - GET  /api/dashboard/properties → Derniers biens
   - GET  /api/dashboard/activities → Activités récentes
   - GET  /api/dashboard/visits     → Prochaines visites
   
   Properties:
   - GET    /api/properties         → Liste des biens
   - POST   /api/properties         → Créer un bien
   - GET    /api/properties/:id     → Détail d'un bien
   - PUT    /api/properties/:id     → Modifier un bien
   - DELETE /api/properties/:id     → Supprimer un bien
   
   Contacts:
   - GET    /api/contacts           → Liste des contacts
   - POST   /api/contacts           → Créer un contact
   - GET    /api/contacts/:id       → Détail d'un contact
   - PUT    /api/contacts/:id       → Modifier un contact
   - DELETE /api/contacts/:id       → Supprimer un contact
   
   Visits:
   - GET    /api/visits             → Liste des visites
   - POST   /api/visits             → Planifier une visite
   - PUT    /api/visits/:id         → Modifier une visite
   - DELETE /api/visits/:id         → Annuler une visite
   
   Mandates:
   - GET    /api/mandates           → Liste des mandats
   - POST   /api/mandates           → Créer un mandat
   - PUT    /api/mandates/:id       → Modifier un mandat
   - DELETE /api/mandates/:id       → Supprimer un mandat
   
   Settings:
   - GET    /api/settings           → Paramètres utilisateur/agence
   - PUT    /api/settings           → Modifier paramètres
   - PUT    /api/settings/password  → Changer mot de passe
   
   - GET  /api/health               → Status serveur
═══════════════════════════════════════════════ 🏠
    `);
  });
});
