# Guide de déploiement sur o2switch - Next.js

## ⚠️ Important : Next.js vs React simple

Next.js est une application **Full-Stack** (Frontend + Backend Node.js), pas une simple application React frontend.
Contrairement à une app React classique, Next.js nécessite :
- Un serveur Node.js actif pour fonctionner (Server-Side Rendering)
- L'outil **"Setup Node.js App"** dans cPanel o2switch
- Une configuration Passenger pour maintenir l'application en ligne

## Prérequis

1. Compte o2switch actif avec accès cPanel
2. Accès SSH activé (mettre votre IP en liste blanche dans cPanel)
3. Domaine configuré et pointé vers o2switch
4. Version Node.js >= 18 disponible (vérifier dans Setup Node.js App)

## Étapes de déploiement

### 1. Préparation de la base de données MySQL

1. Connectez-vous à **cPanel o2switch**
2. Allez dans **"Bases de données MySQL"**
3. Créez une nouvelle base de données :
   - Nom : `bienvuimmo_db` (ou `votre_user_bienvuimmo`)
4. Créez un utilisateur MySQL :
   - Nom : `bienvuimmo_user` (ou `votre_user_bienvuimmo`)
   - Générez un mot de passe sécurisé et **notez-le**
5. Associez l'utilisateur à la base avec **tous les privilèges**
6. Notez le **host** : généralement `localhost`

### 2. Activer l'accès SSH

Dans cPanel o2switch :
1. Allez dans **"Autorisation SSH"**
2. Ajoutez votre adresse IP publique à la liste blanche
3. Ou utilisez directement l'outil **"Terminal"** dans cPanel (pas de liste blanche nécessaire)

### 3. Configurer Node.js dans le PATH (obligatoire)

Par défaut, les commandes `node` et `npm` ne sont pas accessibles sur o2switch.

**Connectez-vous en SSH** puis exécutez :

```bash
# Ajouter Node.js 22 au PATH (choisir la version selon vos besoins)
cat << EOF >> ~/.bashrc 
export PATH="\$PATH:/opt/alt/alt-nodejs22/root/usr/bin/" 
EOF 

# Recharger la configuration
source ~/.bashrc

# Vérifier que ça fonctionne
node --version
npm --version
```

**Versions disponibles** : nodejs6, nodejs8, nodejs9, nodejs10, nodejs11, nodejs12, nodejs14, nodejs16, nodejs18, nodejs20, nodejs22

### 4. Transférer les fichiers du projet

**Option A : Via Git (recommandé)**

```bash
# Se connecter en SSH
ssh votre_user@votre-domaine.fr

# Cloner le projet
cd ~
git clone https://github.com/votre-username/bienvuimmo.fr.git
cd bienvuimmo.fr/bienvuimmo
```

**Option B : Via FTP**
- Utiliser FileZilla pour transférer tous les fichiers du projet
- Placer dans `/home/votre_user/bienvuimmo/`

### 5. Configuration des variables d'environnement

```bash
# Dans le dossier du projet sur o2switch
cd ~/bienvuimmo.fr/bienvuimmo

# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Base de données MySQL
DATABASE_URL="mysql://sc1wtgm7011_bienvuimmo_user:VOTRE_MOT_DE_PASSE@localhost:3306/sc1wtgm7011_bienvuimmo_db"

# URLs
NEXT_PUBLIC_SITE_URL="https://votre-domaine.fr"
NEXTAUTH_URL="https://votre-domaine.fr"
NEXT_PUBLIC_API_URL="https://votre-domaine.fr/api"

# Générer avec : openssl rand -base64 32
NEXTAUTH_SECRET="votre_secret_genere_ici"

# Environment
NODE_ENV="production"
```

**Générer le secret** :
```bash
openssl rand -base64 32
```

### 6. Installation et Build sur le serveur

```bash
# Installer les dépendances
npm install --production

# Copier et utiliser le schéma MySQL
cp prisma/schema.mysql.prisma prisma/schema.prisma

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Build de l'application Next.js
npm run build
```

**Note** : Si vous rencontrez des erreurs de mémoire (`wasm out of memory`), utilisez un client SSH classique (PuTTy) au lieu du Terminal cPanel.

### 7. Configuration de l'application Node.js avec l'outil cPanel

**C'est l'étape la plus importante** : contrairement à une app React simple, Next.js nécessite l'outil "Setup Node.js App" de cPanel.

1. Dans cPanel, allez dans **"Setup Node.js App"**
2. Cliquez sur **"Create Application"**
3. Configurez :
   - **Version Node.js** : 22.x ou 20.x (selon ce que vous avez configuré dans PATH)
   - **Mode d'application** : Production
   - **Répertoire de l'application** : `/home/votre_user/bienvuimmo` (chemin vers votre projet)
   - **URL de l'application** : votre-domaine.fr (ou sous-domaine)
   - **Point d'entrée de l'application** : `server.js`
   - **Variables d'environnement** : Ajoutez toutes les variables de votre `.env`

4. Cliquez sur **"Create"**

### 8. Configuration du fichier .htaccess

Le fichier `.htaccess` doit être créé automatiquement par l'outil, mais vérifiez qu'il contient :

```apache
# Configuration Passenger pour Next.js
PassengerEnabled on
PassengerAppRoot /home/votre_user/bienvuimmo
PassengerAppType node
PassengerStartupFile server.js

# Version de Node.js (chemin absolu)
PassengerNodejs /opt/alt/alt-nodejs22/root/usr/bin/node

# Environnement
PassengerAppEnv production

# Performance
PassengerMaxPoolSize 6
PassengerMinInstances 1

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Sécurité
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Bloquer l'accès aux fichiers sensibles
<FilesMatch "\.(env|log)$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

### 9. Configurer server.js (déjà fourni)

Le fichier `server.js` est déjà présent dans votre projet et correctement configuré.

### 10. Démarrer/Redémarrer l'application

Dans l'outil **"Setup Node.js App"** de cPanel :
- Cliquez sur **"Restart"** pour l'application
- Ou via SSH : `touch ~/bienvuimmo/tmp/restart.txt`

### 11. Configuration SSL/HTTPS

1. Dans cPanel, allez dans **"SSL/TLS"** ou **"Let's Encrypt SSL"**
2. Sélectionnez votre domaine
3. Cliquez sur **"Installer le certificat"**
4. o2switch configure automatiquement le certificat gratuit
5. Le `.htaccess` force déjà la redirection HTTP → HTTPS

### 12. Vérification post-déploiement

Testez les points suivants :

✅ **Accès au site**
```bash
curl -I https://votre-domaine.fr
# Devrait retourner 200 OK
```

✅ **Vérifications**
- [ ] Homepage accessible sur https://votre-domaine.fr
- [ ] Dashboard accessible sur https://votre-domaine.fr/dashboard
- [ ] Connexion à la base de données fonctionnelle (pas d'erreur Prisma)
- [ ] SSL/HTTPS actif (cadenas vert)
- [ ] Images et CSS chargés correctement
- [ ] Application Node.js active dans cPanel (pastille verte)

### 13. Monitoring et logs

**Voir les logs de l'application** :
```bash
# Logs Passenger
tail -f ~/logs/votre-domaine.fr-ssl_log

# Logs Node.js (si configurés)
tail -f ~/bienvuimmo/logs/app.log
```

**Monitoring** :
- Configurer UptimeRobot pour surveiller la disponibilité
- Activer les notifications email en cas de downtime

## Scripts utiles pour la maintenance

### Redémarrage de l'application

**Méthode 1** : Via cPanel
- Aller dans "Setup Node.js App"
- Cliquer sur "Restart" pour votre application

**Méthode 2** : Via SSH
```bash
# Créer le fichier magique de redémarrage Passenger
mkdir -p ~/bienvuimmo.fr/tmp
touch ~/bienvuimmo.fr/tmp/restart.txt
```

### Voir les logs en temps réel
```bash
# Logs de l'application
tail -f ~/logs/bienvuimmo.fr-ssl_log

# Logs d'erreur
tail -f ~/logs/bienvuimmo.fr-ssl_error_log

# Logs Node.js/Passenger (si disponible)
tail -f ~/.passenger/logs/passenger.log
```

### Backup de la base de données
```bash
# Backup complet
mysqldump -u sc1wtgm7011_bienvuimmo_user -p sc1wtgm7011_bienvuimmo_db > ~/backups/backup_$(date +%Y%m%d).sql

# Avec compression
mysqldump -u sc1wtgm7011_bienvuimmo_user -p sc1wtgm7011_bienvuimmo_db | gzip > ~/backups/backup_$(date +%Y%m%d).sql.gz

# Restaurer un backup
mysql -u sc1wtgm7011_bienvuimmo_user -p sc1wtgm7011_bienvuimmo_db < ~/backups/backup_20251209.sql
```

### Mise à jour de l'application
```bash
cd ~/bienvuimmo.fr

# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances si nécessaire
npm install --production

# Rebuild
npm run build

# Relancer les migrations
npx prisma migrate deploy
npx prisma generate

# Redémarrer
touch tmp/restart.txt
```

## Problèmes courants

### L'application ne démarre pas

**Symptômes** : Page blanche, erreur 503, l'app n'apparaît pas dans cPanel

**Solutions** :
1. Vérifier que Node.js est dans le PATH : `node --version`
2. Vérifier le fichier `server.js` existe
3. Vérifier les logs : `tail -f ~/logs/bienvuimmo.fr-ssl_error_log`
4. Dans cPanel "Setup Node.js App", vérifier que l'app est bien configurée
5. Redémarrer : `touch ~/bienvuimmo.fr/tmp/restart.txt`

### Erreur "command not found: node" ou "command not found: npm"

**Cause** : Le PATH n'est pas configuré

**Solution** :
```bash
# Ajouter Node.js au PATH
echo 'export PATH="$PATH:/opt/alt/alt-nodejs22/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc

# Vérifier
node --version
npm --version
```

### Erreur de connexion à la base de données

**Symptômes** : Erreur Prisma, "Can't reach database server"

**Solutions** :
1. Vérifier `DATABASE_URL` dans `.env`
2. Format correct : `mysql://user:password@localhost:3306/database`
3. Tester la connexion :
```bash
npx prisma db pull
# Ou
mysql -u sc1wtgm7011_bienvuimmo_user -p -h localhost sc1wtgm7011_bienvuimmo_db
```
4. Vérifier que l'utilisateur MySQL a tous les privilèges

### Erreur 502 Bad Gateway

**Cause** : Le processus Node.js ne répond pas ou est crashé

**Solutions** :
1. Vérifier les logs d'erreur
2. Redémarrer l'application via cPanel ou `touch tmp/restart.txt`
3. Vérifier la mémoire disponible : `free -h`
4. Vérifier le point d'entrée dans cPanel : doit être `server.js`

### Erreur "wasm out of memory" ou "fork failed" lors du build

**Cause** : L'outil Terminal de cPanel a des limites de ressources

**Solution** : Utiliser un client SSH classique (PuTTy, Terminal Mac/Linux) au lieu du Terminal cPanel

```bash
**Sur votre machine locale**
ssh sc1wtgm7011@bienvuimmo.fr

# Puis lancer le build
cd ~/bienvuimmo.fr
npm run build
```

### Page blanche après le déploiement

**Causes possibles** :
1. Le build n'est pas terminé : `npm run build`
2. Variables d'environnement manquantes : vérifier `.env`
3. Erreur JS : vérifier la console du navigateur (F12)
4. Problème de routing : vérifier `.htaccess`

### Les images ou CSS ne se chargent pas

**Solutions** :
1. Vérifier que le dossier `public/` a bien été transféré
2. Vérifier les permissions : `chmod 755 public/`
3. Vérifier dans `.htaccess` que le routing ne bloque pas les assets
4. Forcer HTTPS si vous êtes en HTTP : ajouter le RewriteRule HTTPS

## Support et ressources

### Documentation officielle
- **Guide o2switch Next.js** : https://faq.o2switch.fr/hebergement-mutualise/creer-et-deployer-son-application-reactjs
- **FAQ o2switch** : https://faq.o2switch.fr/
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Prisma** : https://www.prisma.io/docs
- **Forum Next.js** : https://github.com/vercel/next.js/discussions

### Contacter le support
- **Support o2switch** : support@o2switch.fr (réponse sous 24-48h)
- **Ticket cPanel** : Via l'interface cPanel, section "Support"
- **Chat o2switch** : Disponible depuis l'espace client

### Ressources communauté
- Stack Overflow : Tag [next.js] ou [o2switch]
- Discord Next.js : https://nextjs.org/discord

## Maintenance continue

### Mise à jour de l'application

**Processus recommandé** :
```bash
# 1. Sur votre machine locale : tester les changements
git pull origin main
npm install
npm run build
npm start # Tester en local

# 2. Commit et push
git add .
git commit -m "Mise à jour: description"
git push origin main

# 3. Sur le serveur o2switch (via SSH)
cd ~/bienvuimmo
git pull origin main
npm install --production
npm run build
npx prisma migrate deploy
touch tmp/restart.txt

# 4. Vérifier
curl -I https://votre-domaine.fr
```

**⚠️ Important** : Toujours tester en local avant de déployer en production !

### Backup régulier

**Configuration d'un cron pour backup automatique** :

1. Dans cPanel, aller dans **"Cron Jobs"**
2. Ajouter une tâche quotidienne :

```bash
# Backup quotidien à 3h du matin
0 3 * * * mysqldump -u sc1wtgm7011_bienvuimmo_user -p'votre_mot_de_passe' sc1wtgm7011_bienvuimmo_db | gzip > ~/backups/db_backup_$(date +\%Y\%m\%d).sql.gz
```

3. Créer le dossier backups :
```bash
mkdir -p ~/backups
```

4. Nettoyer les vieux backups (garder 30 jours) :
```bash
# Ajouter ce cron job hebdomadaire
0 4 * * 0 find ~/backups -name "db_backup_*.sql.gz" -mtime +30 -delete
```

### Surveillance de la disponibilité

**UptimeRobot** (gratuit) :
1. Créer un compte sur https://uptimerobot.com
2. Ajouter un monitor HTTP(S)
3. URL à surveiller : `https://votre-domaine.fr`
4. Intervalle : 5 minutes
5. Notification email si downtime

**Surveillance manuelle** :
```bash
# Script de monitoring à exécuter localement
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://votre-domaine.fr)
if [ $STATUS -ne 200 ]; then
    echo "⚠️ Site down! Status: $STATUS"
    # Envoyer une alerte email si nécessaire
else
    echo "✅ Site up! Status: $STATUS"
fi
```

### Rotation des logs

Pour éviter que les logs prennent trop d'espace :

```bash
# Script à exécuter mensuellement
cd ~/logs
gzip votre-domaine.fr-ssl_log
gzip votre-domaine.fr-ssl_error_log
find ~/logs -name "*.gz" -mtime +90 -delete
```

### Checklist de maintenance mensuelle

- [ ] Vérifier l'espace disque : `du -sh ~/*`
- [ ] Vérifier les backups DB : `ls -lh ~/backups`
- [ ] Vérifier les logs d'erreur : `tail -n 100 ~/logs/votre-domaine.fr-ssl_error_log`
- [ ] Mettre à jour Next.js si version mineure : `npm update`
- [ ] Vérifier le certificat SSL (expiration) : Via cPanel SSL/TLS
- [ ] Tester la vitesse du site : PageSpeed Insights
- [ ] Vérifier la base de données : `npx prisma db pull` (pas de warning)

---

## Annexes

### Différences Next.js vs React simple

**⚠️ Important** : Ce guide concerne le déploiement de **Next.js full-stack**, pas une simple application React (Create React App).

| Critère | Next.js (ce projet) | React simple (CRA) |
|---------|---------------------|-------------------|
| Architecture | Full-stack (frontend + backend) | Frontend only |
| Serveur | Nécessite Node.js running 24/7 | Fichiers statiques HTML/JS |
| Déploiement | Via "Setup Node.js App" + Passenger | Via gestionnaire de fichiers ou FTP |
| Build | `npm run build` (crée `.next/`) | `npm run build` (crée `build/`) |
| Configuration | `.htaccess` + `server.js` + cPanel | Juste copier `build/` dans `public_html/` |
| Base de données | Prisma + MySQL via API Routes | API externe ou pas de DB |

**Si vous avez une app React simple** : Suivez le guide o2switch standard pour React, pas ce guide.

### Structure des fichiers déployés

```
~/bienvuimmo.fr/
├── .env                    # Variables d'environnement (NE PAS COMMIT)
├── .htaccess              # Configuration Apache/Passenger
├── server.js              # Point d'entrée Node.js
├── next.config.js         # Config Next.js
├── package.json           # Dépendances
├── node_modules/          # Modules Node.js (généré)
├── .next/                 # Build Next.js (généré par npm run build)
├── prisma/                # Schéma et migrations
├── public/                # Assets statiques (images, etc.)
├── src/                   # Code source
│   ├── app/              # Pages et layouts Next.js 14
│   ├── components/       # Composants React
│   └── lib/              # Utilitaires (Prisma client, etc.)
└── tmp/                   # Dossier pour restart.txt (Passenger)
```

### Variables d'environnement essentielles

Voir le fichier `.env.production.example` pour la liste complète.

**Minimum requis** :
```bash
NODE_ENV=production
DATABASE_URL=mysql://user:pass@localhost:3306/db
NEXTAUTH_SECRET=votre_secret_64_caracteres
NEXTAUTH_URL=https://votre-domaine.fr
```

**Génération de secrets** :
```bash
openssl rand -base64 32
```

---

**📋 Document mis à jour le** : 2025-01-09  
**✅ Testé avec** : Next.js 14.2.33, Node.js 22, o2switch hébergement mutualisé  
**👤 Auteur** : BienVuImmo - Guide de déploiement o2switch
