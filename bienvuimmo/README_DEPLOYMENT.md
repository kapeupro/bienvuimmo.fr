# 🚀 Déploiement BienVuImmo sur o2switch - Guide Rapide

> ⚠️ **Important** : Ce projet est une application **Next.js full-stack**, pas une simple app React.  
> Elle nécessite un serveur Node.js running 24/7 via l'outil **"Setup Node.js App"** de cPanel.

## 📋 Résumé

Tous les fichiers nécessaires pour déployer votre application BienVuImmo sur o2switch ont été créés et configurés selon les bonnes pratiques o2switch pour Next.js.

## 📁 Fichiers créés

| Fichier | Description |
|---------|-------------|
| `.env.production.example` | Template des variables d'environnement |
| `prisma/schema.mysql.prisma` | Schéma Prisma adapté pour MySQL |
| `server.js` | Serveur Node.js pour Passenger |
| `.htaccess` | Configuration Apache/Passenger |
| `deploy.sh` | Script de déploiement automatisé |
| `DEPLOYMENT.md` | Guide complet de déploiement |
| `DEPLOYMENT_CHECKLIST.md` | Checklist étape par étape |
| `ENV_SETUP.md` | Guide de configuration des variables |

## 🎯 Déploiement en 4 étapes (temps estimé : 30-45 min)

### 1️⃣ Préparation o2switch (10 min)

**Dans cPanel** :
1. **Base de données** → Créer une base MySQL : `sc1wtgm7011_bienvuimmo_db`
2. **Utilisateur MySQL** → Créer : `sc1wtgm7011_bienvuimmo_user` avec mot de passe fort
3. **Associer** l'utilisateur à la base avec tous privilèges
4. **SSL/TLS** → Activer Let's Encrypt pour votre domaine
5. **SSH Access** → Vérifier que SSH est activé

### 2️⃣ Configuration des variables d'environnement (5 min)

```bash
# Sur votre machine locale
cd /workspaces/bienvuimmo.fr/bienvuimmo

# Créer le fichier .env à partir de l'exemple
cp .env.production.example .env.production

# Générer un secret sécurisé
openssl rand -base64 32

# Éditer et configurer toutes les variables
nano .env.production
```

**Variables essentielles à configurer** :
- `DATABASE_URL` : Connexion MySQL o2switch
- `NEXTAUTH_SECRET` : Secret généré ci-dessus
- `NEXTAUTH_URL` : Votre domaine (https://votre-domaine.fr)
- `NEXT_PUBLIC_SITE_URL` : Même domaine

### 3️⃣ Déploiement sur le serveur (20 min)

**Via SSH (recommandé)** :

```bash
# Se connecter au serveur
ssh sc1wtgm7011@bienvuimmo.fr

# Ajouter Node.js au PATH (IMPORTANT !)
echo 'export PATH="$PATH:/opt/alt/alt-nodejs22/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc

# Vérifier Node.js
node --version  # Doit afficher v22.x.x

# Cloner ou transférer le code
cd ~
git clone https://github.com/votre-user/bienvuimmo.git bienvuimmo.fr
# OU transférer via FTP dans ~/bienvuimmo.fr/

# Aller dans le dossier
cd bienvuimmo.fr

# Créer le fichier .env (copier le contenu de .env.production)
nano .env

# Installer et builder (utiliser un vrai client SSH, pas le Terminal cPanel)
npm install --production
npx prisma generate
npx prisma migrate deploy
npm run build
```

**Configuration dans cPanel "Setup Node.js App"** :
1. Aller dans **"Setup Node.js App"**
2. Cliquer sur **"Create Application"**
3. Remplir :
   - Node.js version : **22.x.x**
   - Application mode : **Production**
   - Application root : **bienvuimmo.fr** (relatif à home)
   - Application URL : **bienvuimmo.fr**
   - Application startup file : **server.js**
4. Cliquer **"Create"** puis **"Restart"**

### 4️⃣ Vérification et tests (5 min)

```bash
# Tester depuis votre terminal local
curl -I https://bienvuimmo.fr
# Devrait retourner : HTTP/2 200
```

**Checklist finale** :
- ✅ https://bienvuimmo.fr → Homepage affichée
- ✅ https://bienvuimmo.fr/dashboard → Dashboard accessible
- ✅ Certificat SSL valide (cadenas vert dans le navigateur)
- ✅ Application active dans cPanel "Setup Node.js App" (pastille verte)
- ✅ Pas d'erreur dans les logs : `tail -f ~/logs/bienvuimmo.fr-ssl_error_log`

## 📞 Informations nécessaires d'o2switch

Avant de commencer, vous devez avoir :

### Base de données MySQL
```
Host : localhost
Database : sc1wtgm7011_bienvuimmo_db
User : sc1wtgm7011_bienvuimmo_user
Password : [votre mot de passe généré par cPanel]
```

> 💡 **Note** : o2switch ajoute automatiquement le préfixe de votre compte (ex: `sc1wtgm7011_`) aux noms de bases et utilisateurs.

### Accès serveur
```
SSH Host : bienvuimmo.fr
SSH User : sc1wtgm7011
SSH Password : [votre password cPanel]
FTP Host : ftp.bienvuimmo.fr
```

### Email SMTP
```
SMTP Host : mail.bienvuimmo.fr
SMTP Port : 465
Email : contact@bienvuimmo.fr
Password : [password du compte email]
```

## 🔐 Sécurité - Points critiques

### ⚠️ À faire AVANT le déploiement

1. **Générer un secret sécurisé pour NextAuth**
   ```bash
   openssl rand -base64 32
   # Copier le résultat dans NEXTAUTH_SECRET
   ```

2. **Configurer le fichier .env**
   - ✅ Doit contenir vos vraies credentials (pas les exemples)
   - ❌ Ne JAMAIS commiter `.env` dans Git (déjà dans `.gitignore`)
   - ✅ Sur le serveur : `chmod 600 ~/bienvuimmo.fr/.env` (permissions restrictives)

3. **Vérifier la sécurité sur le serveur**
   ```bash
   # .env ne doit pas être accessible publiquement
   curl https://votre-domaine.fr/.env
   # Doit retourner 403 Forbidden ou 404
   ```

4. **Activer HTTPS**
   - Certificat Let's Encrypt gratuit via cPanel
   - Redirection HTTP → HTTPS automatique (configurée dans `.htaccess`)

## 📚 Documentation complète

Ce guide est un **résumé rapide**. Pour des instructions détaillées :

| Document | Description |
|----------|-------------|
| **`DEPLOYMENT.md`** | 📖 Guide complet avec toutes les explications techniques (13 sections) |
| **`DEPLOYMENT_CHECKLIST.md`** | ✅ Checklist étape par étape avec cases à cocher (20 sections) |
| **`ENV_SETUP.md`** | 🔐 Configuration détaillée des variables d'environnement |
| **`deploy.sh`** | 🤖 Script de déploiement automatisé (à personnaliser) |
| **`check-deployment.sh`** | 🔍 Script de vérification pré-déploiement |

## 🆘 Dépannage rapide

### Problèmes courants

**❌ Erreur "command not found: node"**
```bash
echo 'export PATH="$PATH:/opt/alt/alt-nodejs22/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc
```

**❌ Erreur 502 Bad Gateway**
```bash
# Vérifier l'app dans cPanel "Setup Node.js App"
# Redémarrer
cd ~/bienvuimmo.fr
touch tmp/restart.txt
```

**❌ Base de données inaccessible**
```bash
# Vérifier la connexion
cd ~/bienvuimmo.fr
npx prisma db pull
# Vérifier DATABASE_URL dans .env
```

**❌ Page blanche**
```bash
# Vérifier les logs
tail -f ~/logs/bienvuimmo.fr-ssl_error_log
# Rebuild
cd ~/bienvuimmo.fr
rm -rf .next/
npm run build
touch tmp/restart.txt
```

### Voir les logs en temps réel

```bash
# Connexion SSH
ssh sc1wtgm7011@bienvuimmo.fr

# Logs d'erreur
tail -f ~/logs/bienvuimmo.fr-ssl_error_log

# Logs d'accès
tail -f ~/logs/bienvuimmo.fr-ssl_log
```

## 📞 Support et ressources

### Documentation officielle
- **FAQ o2switch** : https://faq.o2switch.fr/
- **Guide React/Next.js o2switch** : https://faq.o2switch.fr/hebergement-mutualise/creer-et-deployer-son-application-reactjs
- **Next.js Docs** : https://nextjs.org/docs
- **Prisma Docs** : https://www.prisma.io/docs

### Contacter o2switch
- **Email** : support@o2switch.fr
- **Téléphone** : 04 44 44 60 40
- **Ticket** : Via cPanel

## ✅ Checklist de pré-déploiement

Avant de commencer :

- [ ] Compte o2switch actif avec accès cPanel
- [ ] Nom de domaine configuré et DNS propagés
- [ ] Base de données MySQL créée dans cPanel
- [ ] Utilisateur MySQL créé et associé à la base
- [ ] Fichier `.env.production` configuré localement
- [ ] `NEXTAUTH_SECRET` généré avec `openssl rand -base64 32`
- [ ] Build local réussi : `npm run build` sans erreurs
- [ ] Accès SSH testé : `ssh sc1wtgm7011@bienvuimmo.fr`

---

## 🚀 Commencer maintenant

1. **Suivre la checklist complète** : Ouvrir `DEPLOYMENT_CHECKLIST.md`
2. **Lire le guide détaillé** : Consulter `DEPLOYMENT.md` si besoin
3. **Configurer les variables** : Voir `ENV_SETUP.md`

**Temps estimé total** : 30-45 minutes pour un premier déploiement

---

**Dernière mise à jour** : 2025-01-09  
**Testé avec** : Next.js 14.2.33, Node.js 22, o2switch hébergement mutualisé

## 🎉 Après le déploiement

Une fois en production :

1. ✅ Tester toutes les fonctionnalités
2. 📊 Configurer le monitoring (UptimeRobot, Google Analytics)
3. 💾 Mettre en place les backups automatiques
4. 📧 Tester l'envoi d'emails
5. 🔒 Vérifier la sécurité (HTTPS, headers)
6. 📱 Tester sur mobile
7. 🚀 Communiquer l'URL à vos utilisateurs

## 💡 Conseils

- **Testez d'abord sur un sous-domaine** (ex: test.bienvuimmo.fr)
- **Faites un backup avant chaque déploiement**
- **Documentez vos credentials de manière sécurisée**
- **Configurez un monitoring pour être alerté en cas de panne**

## 🚨 Problèmes courants

| Problème | Solution |
|----------|----------|
| Erreur 502 | `touch tmp/restart.txt` pour redémarrer |
| DB inaccessible | Vérifier DATABASE_URL dans .env |
| Fichiers non chargés | Vérifier permissions (755 pour dossiers, 644 pour fichiers) |
| Erreur SSL | Activer Let's Encrypt dans cPanel |

---

**Prêt à déployer ? Suivez la checklist dans `DEPLOYMENT_CHECKLIST.md` ! 🚀**
