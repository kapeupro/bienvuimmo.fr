# Checklist de déploiement o2switch - BienVuImmo

> ⚠️ **Important** : Ce guide concerne le déploiement de **Next.js full-stack** (pas une simple app React).  
> Next.js nécessite un serveur Node.js running 24/7 via l'outil **"Setup Node.js App"** de cPanel.

## ✅ Avant le déploiement

### 1. Préparation o2switch
- [ ] Compte o2switch actif et accès cPanel disponible
- [ ] Nom de domaine configuré et pointé vers o2switch (DNS propagés)
- [ ] Accès SSH activé (vérifier dans cPanel → "Terminal" ou "SSH Access")
- [ ] Node.js 22 disponible : `/opt/alt/alt-nodejs22/root/usr/bin/node`

### 2. Base de données MySQL
- [ ] Base de données créée dans cPanel : `sc1wtgm7011_bienvuimmo_db`
- [ ] Utilisateur MySQL créé : `sc1wtgm7011_bienvuimmo_user`
- [ ] Mot de passe sécurisé généré (noté dans gestionnaire de mots de passe)
- [ ] Utilisateur associé à la base avec tous privilèges
- [ ] Note : Host MySQL est `localhost` sur o2switch

### 3. Configuration locale
- [ ] Fichier `.env.production` créé à partir de `.env.production.example`
- [ ] `DATABASE_URL` configuré : `mysql://user:pass@localhost:3306/bienvuimmo_db`
- [ ] `NEXTAUTH_SECRET` généré : `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` configuré avec votre domaine : `https://votre-domaine.fr`
- [ ] `NEXT_PUBLIC_SITE_URL` configuré : `https://votre-domaine.fr`
- [ ] Email SMTP configuré (service email o2switch)

### 4. Tests locaux
- [ ] `npm install` réussi (sans erreurs)
- [ ] `npm run build` réussi (génère `.next/`)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs Prisma : `npx prisma generate` fonctionne
- [ ] Test en local : `npm start` puis accès à http://localhost:3000

## 🚀 Déploiement

### 5. Préparation du code source

#### Option A : Via Git (recommandé)
```bash
# Sur votre machine locale
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-user/bienvuimmo.git
git push -u origin main
```
- [ ] Repository Git créé (GitHub, GitLab, etc.)
- [ ] Code pushé sur la branche `main`

#### Option B : Via FTP
- [ ] Connexion FTP établie vers o2switch
- [ ] Créer le dossier `~/bienvuimmo/` (en dehors de `public_html/`)

### 6. Configuration du serveur o2switch (SSH)

```bash
# Se connecter en SSH
ssh votre_user@votre-domaine.fr

# Ajouter Node.js au PATH (important !)
echo 'export PATH="$PATH:/opt/alt/alt-nodejs22/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc

# Vérifier Node.js
node --version  # Doit afficher v22.x.x
npm --version   # Doit afficher v10.x.x
```
- [ ] SSH fonctionne
- [ ] Node.js accessible : `node --version` OK
- [ ] NPM accessible : `npm --version` OK

### 7. Transfert du code

#### Si Git :
```bash
cd ~
git clone https://github.com/votre-user/bienvuimmo.git bienvuimmo.fr
cd bienvuimmo.fr
```
- [ ] Repository cloné dans `~/bienvuimmo.fr/`

#### Si FTP :
- [ ] Tous les fichiers transférés dans `~/bienvuimmo.fr/`
- [ ] Vérifier que `.next/` n'est PAS transféré (sera généré)
- [ ] Vérifier que `node_modules/` n'est PAS transféré (sera installé)

### 8. Configuration des variables d'environnement

```bash
cd ~/bienvuimmo
nano .env
```

Copier le contenu de `.env.production` et adapter :
```bash
NODE_ENV=production
DATABASE_URL=mysql://sc1wtgm7011_bienvuimmo_user:VOTRE_MDP@localhost:3306/sc1wtgm7011_bienvuimmo_db
NEXTAUTH_SECRET=votre_secret_genere
NEXTAUTH_URL=https://votre-domaine.fr
NEXT_PUBLIC_SITE_URL=https://votre-domaine.fr
```
- [ ] Fichier `.env` créé sur le serveur
- [ ] Toutes les variables configurées
- [ ] `DATABASE_URL` correcte avec les identifiants MySQL o2switch

### 9. Build de l'application sur le serveur

> ⚠️ **Important** : Utiliser un vrai client SSH (PuTTY, Terminal), pas le Terminal cPanel (limites mémoire).

```bash
cd ~/bienvuimmo.fr

# Installer les dépendances
npm install --production

# Générer le client Prisma
npx prisma generate

# Déployer les migrations
npx prisma migrate deploy

# Build Next.js
npm run build
```
- [ ] `npm install` réussi (peut prendre 5-10 minutes)
- [ ] `npx prisma generate` réussi
- [ ] `npx prisma migrate deploy` réussi (tables créées)
- [ ] `npm run build` réussi (dossier `.next/` créé)

### 10. Configuration cPanel "Setup Node.js App"

Dans cPanel, chercher **"Setup Node.js App"** :
1. Cliquer sur **"Create Application"**
2. Remplir les champs :
   - **Node.js version** : 22.x.x
   - **Application mode** : Production
   - **Application root** : `bienvuimmo.fr` (chemin relatif depuis home)
   - **Application URL** : bienvuimmo.fr
   - **Application startup file** : `server.js`
3. Cliquer sur **"Create"**
4. Dans les variables d'environnement, vérifier `PORT` (généralement 3000)
5. Cliquer sur **"Restart"**

- [ ] Application Node.js créée dans cPanel
- [ ] Point d'entrée = `server.js`
- [ ] Application redémarrée
- [ ] Pastille verte visible = app active

### 11. Configuration .htaccess

Vérifier que `~/bienvuimmo.fr/.htaccess` existe avec ce contenu :
```apache
PassengerEnabled On
PassengerAppRoot /home/sc1wtgm7011/bienvuimmo.fr
PassengerAppType node
PassengerStartupFile server.js
PassengerNodejs /opt/alt/alt-nodejs22/root/usr/bin/node

# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```
- [ ] Fichier `.htaccess` présent dans `~/bienvuimmo.fr/`
- [ ] Chemins avec utilisateur `sc1wtgm7011` et dossier `bienvuimmo.fr`

### 12. Configuration SSL/HTTPS
Dans cPanel, section **"SSL/TLS"** ou **"Let's Encrypt SSL"** :
1. Sélectionner votre domaine
2. Cliquer sur **"Installer"** ou **"Issue"**
3. o2switch génère automatiquement le certificat gratuit

- [ ] Certificat SSL Let's Encrypt activé
- [ ] Cadenas vert visible dans le navigateur
- [ ] Redirection HTTP → HTTPS active (via `.htaccess`)

## 🔍 Vérifications post-déploiement

### 13. Tests fonctionnels de base

```bash
# Test depuis le terminal
curl -I https://votre-domaine.fr
# Doit retourner : HTTP/2 200
```

- [ ] Site accessible sur https://votre-domaine.fr
- [ ] Homepage s'affiche correctement (pas d'erreur 502/503)
- [ ] Images et CSS chargés correctement
- [ ] Pas d'erreur dans la console du navigateur (F12)
- [ ] Dashboard accessible : https://votre-domaine.fr/dashboard
- [ ] Application Node.js active dans cPanel (pastille verte)

### 14. Tests base de données

Via SSH :
```bash
cd ~/bienvuimmo.fr
npx prisma studio --browser none
# Ou tester une requête
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.property.count().then(count => console.log('Properties:', count));"
```

- [ ] Connexion DB fonctionnelle (pas d'erreur Prisma)
- [ ] Tables créées correctement dans MySQL
- [ ] Possibilité de lire les données (même si vides)

### 15. Tests de performance

```bash
# Test depuis votre machine locale
curl -w "\nTime: %{time_total}s\n" https://votre-domaine.fr
```

- [ ] Temps de chargement < 3 secondes
- [ ] Images optimisées (format WebP si possible)
- [ ] Compression Gzip active (vérifier via .htaccess)
- [ ] Test Google PageSpeed Insights > 70

### 16. Tests de sécurité

```bash
# Vérifier que .env n'est pas accessible
curl https://votre-domaine.fr/.env
# Devrait retourner 403 Forbidden ou 404
```

- [ ] HTTPS activé et cadenas vert
- [ ] Fichier `.env` non accessible publiquement (403/404)
- [ ] Headers de sécurité configurés (X-Frame-Options, etc.)
- [ ] Pas de données sensibles exposées dans le HTML
- [ ] Certificat SSL valide (vérifié via browser)

### 17. Configuration du monitoring

**UptimeRobot** (recommandé) :
1. Créer un compte sur https://uptimerobot.com
2. Ajouter un monitor HTTP(S) : `https://votre-domaine.fr`
3. Intervalle : 5 minutes
4. Alertes email

- [ ] Monitoring configuré (UptimeRobot ou alternative)
- [ ] Alertes email actives
- [ ] Test d'alerte effectué (downtime simulé)

## 📧 Configuration Email (Optionnel)

### 18. SMTP o2switch

Dans cPanel > **"Comptes email"** :
1. Créer un compte email : `contact@votre-domaine.fr` ou `noreply@votre-domaine.fr`
2. Noter les informations SMTP

Dans le fichier `.env` sur le serveur :
```bash
SMTP_HOST=mail.votre-domaine.fr
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@votre-domaine.fr
SMTP_PASSWORD=votre_mot_de_passe_email
SMTP_FROM=contact@votre-domaine.fr
```

- [ ] Compte email créé dans cPanel
- [ ] Configuration SMTP ajoutée à `.env`
- [ ] Test d'envoi email réussi (si applicable)

## 🔧 Maintenance et sauvegarde

### 19. Configuration des backups

**Backup automatique de la base de données** :

Dans cPanel > **"Cron Jobs"** :
```bash
# Backup quotidien à 3h du matin
0 3 * * * mysqldump -u bienvuimmo_user -p'votre_mdp' bienvuimmo_db | gzip > ~/backups/db_backup_$(date +\%Y\%m\%d).sql.gz
```

Créer le dossier backups :
```bash
mkdir -p ~/backups
```

- [ ] Dossier `~/backups/` créé
- [ ] Cron job backup quotidien configuré
- [ ] Test manuel du backup : `mysqldump -u bienvuimmo_user -p bienvuimmo_db > ~/backups/test.sql`
- [ ] Vérifier que le fichier backup est créé

### 20. Documentation interne

- [ ] Credentials MySQL notés dans un gestionnaire de mots de passe (LastPass, 1Password, etc.)
- [ ] Credentials SSH/FTP sauvegardés
- [ ] URLs importantes documentées (cPanel, site, dashboard)
- [ ] Procédure de mise à jour documentée (voir DEPLOYMENT.md)
- [ ] Contacts support notés (o2switch, développeurs)
- [ ] Accès partagés avec l'équipe (si applicable)

## 🆘 Dépannage rapide

### Problèmes courants et solutions

**❌ L'application ne démarre pas (Erreur 503)**

```bash
# Vérifier les logs
tail -f ~/logs/bienvuimmo.fr-ssl_error_log

# Vérifier l'app dans cPanel "Setup Node.js App"
# Si elle n'apparaît pas : la recréer

# Redémarrer
cd ~/bienvuimmo.fr
touch tmp/restart.txt
```

**❌ Erreur "command not found: node"**

```bash
# Ajouter Node.js au PATH
echo 'export PATH="$PATH:/opt/alt/alt-nodejs22/root/usr/bin/"' >> ~/.bashrc
source ~/.bashrc
node --version
```

**❌ Erreur 502 Bad Gateway**

- Vérifier que le processus Node.js tourne (cPanel → Setup Node.js App)
- Vérifier les logs : `tail -f ~/logs/votre-domaine.fr-ssl_error_log`
- Redémarrer : `touch ~/bienvuimmo/tmp/restart.txt`
- En dernier recours : redémarrer l'app via cPanel

**❌ Base de données inaccessible**

```bash
# Tester la connexion
cd ~/bienvuimmo
npx prisma db pull

# Vérifier les credentials dans .env
cat .env | grep DATABASE_URL

# Tester MySQL directement
mysql -u bienvuimmo_user -p -h localhost bienvuimmo_db
```

**❌ Page blanche ou erreur de compilation**

```bash
# Vider le cache et rebuild
cd ~/bienvuimmo.fr
rm -rf .next/
npm run build
touch tmp/restart.txt
```

**❌ Les images ou CSS ne se chargent pas**

- Vérifier que le dossier `public/` est bien présent
- Vérifier les permissions : `chmod -R 755 ~/bienvuimmo/public/`
- Vérifier dans le navigateur (F12) les erreurs 404
- Forcer la redirection HTTPS dans `.htaccess`

### Commandes de diagnostic utiles

```bash
# Vérifier l'état de l'application
cd ~/bienvuimmo.fr
ls -la .next/          # Le build existe-t-il ?
node --version         # Node.js accessible ?
npm --version          # NPM accessible ?

# Tester manuellement le serveur
node server.js         # Lance le serveur (Ctrl+C pour arrêter)

# Vérifier la base de données
npx prisma db pull     # Teste la connexion
npx prisma studio      # Interface graphique DB

# Voir les logs en temps réel
tail -f ~/logs/bienvuimmo.fr-ssl_error_log
```

## 📞 Support et ressources

### Documentation
- **Guide complet** : Voir `DEPLOYMENT.md` pour les détails
- **Variables d'environnement** : Voir `ENV_SETUP.md`
- **o2switch FAQ** : https://faq.o2switch.fr/
- **Next.js Docs** : https://nextjs.org/docs
- **Prisma Docs** : https://www.prisma.io/docs

### Contacter le support
- **Support o2switch** : support@o2switch.fr (24-48h)
- **Ticket cPanel** : Via l'interface cPanel
- **Forum Next.js** : https://github.com/vercel/next.js/discussions

## 🎉 Déploiement terminé !

Si toutes les cases sont cochées, votre application BienVuImmo est maintenant en production sur o2switch ! 🚀

**Prochaines étapes** :
1. Tester toutes les fonctionnalités
2. Configurer le monitoring (UptimeRobot)
3. Documenter les credentials dans un gestionnaire de mots de passe
4. Planifier les backups réguliers
5. Ajouter du contenu et des données

**Maintenance régulière** :
- Vérifier les logs hebdomadairement
- Sauvegarder la DB régulièrement
- Mettre à jour Next.js mensuellement (versions mineures)
- Surveiller les performances et la disponibilité

---

**Dernière mise à jour** : 2025-01-09  
**Version** : 1.0 - o2switch + Next.js 14

Si tous les éléments sont cochés, votre application BienVuImmo est en production sur o2switch ! 🚀

N'oubliez pas de :
- Configurer les sauvegardes automatiques
- Monitorer les performances
- Mettre à jour régulièrement les dépendances
- Communiquer l'URL à vos utilisateurs
